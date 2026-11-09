package com.migrantcommunity.messaging.service;

import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.connection.repository.BlockRepository;
import com.migrantcommunity.connection.repository.ConnectionRepository;
import com.migrantcommunity.messaging.dto.ConversationSummary;
import com.migrantcommunity.messaging.dto.MessageDto;
import com.migrantcommunity.messaging.entity.Conversation;
import com.migrantcommunity.messaging.entity.ConversationMember;
import com.migrantcommunity.messaging.entity.Message;
import com.migrantcommunity.messaging.repository.ConversationMemberRepository;
import com.migrantcommunity.messaging.repository.ConversationRepository;
import com.migrantcommunity.messaging.repository.MessageRepository;
import com.migrantcommunity.notification.service.NotificationService;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import com.migrantcommunity.user.repository.UserRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class MessagingService {

    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository memberRepository;
    private final MessageRepository messageRepository;
    private final ConnectionRepository connectionRepository;
    private final BlockRepository blockRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUserProvider;
    private final ApplicationEventPublisher eventPublisher;

    public MessagingService(ConversationRepository conversationRepository,
                            ConversationMemberRepository memberRepository,
                            MessageRepository messageRepository,
                            ConnectionRepository connectionRepository,
                            BlockRepository blockRepository,
                            UserRepository userRepository,
                            NotificationService notificationService,
                            CurrentUserProvider currentUserProvider,
                            ApplicationEventPublisher eventPublisher) {
        this.conversationRepository = conversationRepository;
        this.memberRepository = memberRepository;
        this.messageRepository = messageRepository;
        this.connectionRepository = connectionRepository;
        this.blockRepository = blockRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.currentUserProvider = currentUserProvider;
        this.eventPublisher = eventPublisher;
    }

    /** Creates or returns the 1:1 conversation with another user. */
    public ConversationSummary createConversation(Long otherUserId) {
        User me = currentUserProvider.requireUser();
        if (me.getId().equals(otherUserId)) {
            throw new BadRequestException("Cannot message yourself");
        }
        User other = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", otherUserId));
        enforceMessagingAllowed(me.getId(), otherUserId);

        return conversationRepository.findDirectConversationBetweenUsers(me.getId(), otherUserId)
                .map(c -> toSummary(c, me.getId()))
                .orElseGet(() -> {
                    Conversation conversation = new Conversation();
                    conversation.setCreatedBy(me);
                    conversation = conversationRepository.save(conversation);
                    memberRepository.save(new ConversationMember(conversation, me));
                    memberRepository.save(new ConversationMember(conversation, other));
                    return toSummary(conversation, me.getId());
                });
    }

    @Transactional(readOnly = true)
    public Page<ConversationSummary> conversations(Pageable pageable) {
        User me = currentUserProvider.requireUser();
        return conversationRepository.findByUserId(me.getId(), pageable)
                .map(c -> toSummary(c, me.getId()));
    }

    @Transactional(readOnly = true)
    public Page<MessageDto> history(Long conversationId, Pageable pageable) {
        User me = currentUserProvider.requireUser();
        requireMember(conversationId, me.getId());
        return messageRepository.findLatestMessagesByConversationId(conversationId, pageable)
                .map(this::toDto);
    }

    public MessageDto send(Long conversationId, String content) {
        User me = currentUserProvider.requireUser();
        Conversation conversation = requireMember(conversationId, me.getId());
        enforceMessagingAllowed(me.getId(), otherMemberId(conversation, me.getId()));

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(me);
        message.setContent(content.trim());
        message = messageRepository.save(message);

        ConversationMember membership = memberRepository
                .findByConversationIdAndUserId(conversationId, me.getId()).orElse(null);
        if (membership != null) {
            membership.setLastReadAt(Instant.now());
            memberRepository.save(membership);
        }

        Long recipientId = otherMemberId(conversation, me.getId());
        notificationService.createNotification(
                recipientId, NotificationType.MESSAGE,
                "New message",
                displayName(me) + " sent you a message", conversationId);

        eventPublisher.publishEvent(new MessageSentEvent(this, toDto(message), recipientId));
        return toDto(message);
    }

    public void markRead(Long conversationId) {
        User me = currentUserProvider.requireUser();
        ConversationMember membership = memberRepository
                .findByConversationIdAndUserId(conversationId, me.getId())
                .orElseThrow(() -> new ForbiddenException("You are not a member of this conversation"));
        membership.setLastReadAt(Instant.now());
        memberRepository.save(membership);
        // Mark messages from others as read for this member.
        messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId, Pageable.unpaged())
                .forEach(m -> {
                    if (!m.getSender().getId().equals(me.getId()) && !m.isRead()) {
                        m.setRead(true);
                    }
                });
    }

    @Transactional(readOnly = true)
    public long unreadCount(Long conversationId) {
        User me = currentUserProvider.requireUser();
        requireMember(conversationId, me.getId());
        return messageRepository.countUnreadMessages(conversationId, me.getId());
    }

    @Transactional(readOnly = true)
    public long totalUnreadCount() {
        return messageRepository.countAllUnreadMessagesForUser(currentUserProvider.requireUserId());
    }

    private void enforceMessagingAllowed(Long userId, Long otherUserId) {
        if (blockRepository.isBlockedBetweenUsers(userId, otherUserId)) {
            throw new ForbiddenException("Messaging is not allowed with this user");
        }
        if (!connectionRepository.areUsersConnected(userId, otherUserId)) {
            throw new ForbiddenException("You can only message accepted connections");
        }
        User other = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", otherUserId));
        if (!com.migrantcommunity.profile.PrivacySettings
                .fromProfile(other.getProfile()).allowDirectMessages()) {
            throw new ForbiddenException("This user is not accepting direct messages");
        }
    }

    private Conversation requireMember(Long conversationId, Long userId) {
        ConversationMember member = memberRepository.findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this conversation"));
        return member.getConversation();
    }

    private Long otherMemberId(Conversation conversation, Long userId) {
        return memberRepository.findByConversationId(conversation.getId()).stream()
                .map(cm -> cm.getUser().getId())
                .filter(id -> !id.equals(userId))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Conversation has no other member"));
    }

    private String displayName(User user) {
        Profile p = user.getProfile();
        if (p != null && p.getFirstName() != null) {
            return p.getFirstName() + (p.getLastName() != null ? " " + p.getLastName() : "");
        }
        return user.getEmail().split("@")[0];
    }

    private ConversationSummary toSummary(Conversation c, Long viewerId) {
        List<ConversationSummary.MemberInfo> members = memberRepository.findByConversationId(c.getId())
                .stream()
                .map(cm -> {
                    User u = cm.getUser();
                    Profile p = u.getProfile();
                    String name = p != null && p.getFirstName() != null
                            ? p.getFirstName() + (p.getLastName() != null ? " " + p.getLastName() : "")
                            : u.getEmail().split("@")[0];
                    return new ConversationSummary.MemberInfo(u.getId(), name,
                            p != null ? p.getProfilePictureUrl() : null);
                })
                .toList();
        Page<Message> latest = messageRepository.findLatestMessagesByConversationId(
                c.getId(), Pageable.ofSize(1));
        Message last = latest.getContent().isEmpty() ? null : latest.getContent().get(0);
        return new ConversationSummary(
                c.getId(), members,
                last != null ? last.getContent() : null,
                last != null ? last.getCreatedAt() : null,
                messageRepository.countUnreadMessages(c.getId(), viewerId));
    }

    private MessageDto toDto(Message m) {
        Profile p = m.getSender().getProfile();
        String name = p != null && p.getFirstName() != null
                ? p.getFirstName() + (p.getLastName() != null ? " " + p.getLastName() : "")
                : m.getSender().getEmail().split("@")[0];
        return new MessageDto(m.getId(), m.getConversation().getId(), m.getSender().getId(),
                name, m.getContent(), m.isRead(), m.getCreatedAt());
    }

    /** Published after a message is persisted; consumed by the WebSocket layer. */
    public record MessageSentEvent(Object source, MessageDto message, Long recipientId) {
    }
}
