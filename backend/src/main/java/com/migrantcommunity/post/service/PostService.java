package com.migrantcommunity.post.service;

import com.migrantcommunity.common.enums.NotificationType;
import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.exception.ForbiddenException;
import com.migrantcommunity.common.exception.ResourceNotFoundException;
import com.migrantcommunity.common.security.CurrentUserProvider;
import com.migrantcommunity.community.entity.Community;
import com.migrantcommunity.community.repository.CommunityMemberRepository;
import com.migrantcommunity.community.repository.CommunityRepository;
import com.migrantcommunity.notification.service.NotificationService;
import com.migrantcommunity.post.dto.CommentResponse;
import com.migrantcommunity.post.dto.CreateCommentRequest;
import com.migrantcommunity.post.dto.CreatePostRequest;
import com.migrantcommunity.post.dto.PostDetailsResponse;
import com.migrantcommunity.post.entity.Comment;
import com.migrantcommunity.post.entity.Post;
import com.migrantcommunity.post.entity.PostImage;
import com.migrantcommunity.post.entity.Reaction;
import com.migrantcommunity.post.repository.CommentRepository;
import com.migrantcommunity.post.repository.PostImageRepository;
import com.migrantcommunity.post.repository.PostRepository;
import com.migrantcommunity.post.repository.ReactionRepository;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final PostImageRepository postImageRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final NotificationService notificationService;
    private final CurrentUserProvider currentUserProvider;

    public PostService(PostRepository postRepository, CommentRepository commentRepository,
                       ReactionRepository reactionRepository, PostImageRepository postImageRepository,
                       CommunityRepository communityRepository,
                       CommunityMemberRepository communityMemberRepository,
                       NotificationService notificationService,
                       CurrentUserProvider currentUserProvider) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.reactionRepository = reactionRepository;
        this.postImageRepository = postImageRepository;
        this.communityRepository = communityRepository;
        this.communityMemberRepository = communityMemberRepository;
        this.notificationService = notificationService;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional(readOnly = true)
    public Page<PostDetailsResponse> feed(Long communityId, Pageable pageable) {
        User me = currentUserProvider.requireUser();
        Page<Post> page;
        if (communityId != null) {
            Community community = communityRepository.findById(communityId)
                    .orElseThrow(() -> new ResourceNotFoundException("Community", "id", communityId));
            if (!community.isPublicCommunity()) {
                boolean member = communityMemberRepository
                        .existsByCommunityIdAndUserId(communityId, me.getId());
                if (!member) throw new ForbiddenException("You must be a member to view this community's posts");
            }
            page = postRepository.findByCommunityIdOrderByCreatedAtDesc(communityId, pageable);
        } else {
            page = postRepository.findByPublicCommunityOrderByCreatedAtDesc(pageable);
        }
        return page.map(p -> toDetails(p, me.getId()));
    }

    @Transactional(readOnly = true)
    public Page<PostDetailsResponse> myPosts(Pageable pageable) {
        User me = currentUserProvider.requireUser();
        return postRepository.findByUserIdOrderByCreatedAtDesc(me.getId(), pageable)
                .map(p -> toDetails(p, me.getId()));
    }

    public PostDetailsResponse create(CreatePostRequest request) {
        User me = currentUserProvider.requireUser();
        Community community = communityRepository.findById(request.communityId())
                .orElseThrow(() -> new ResourceNotFoundException("Community", "id", request.communityId()));
        requireMembership(community);

        Post post = new Post(community, me, request.content().trim(), request.imageUrl());
        post = postRepository.save(post);

        List<String> extraImages = request.imageUrls() != null ? request.imageUrls() : List.of();
        for (int i = 0; i < extraImages.size(); i++) {
            postImageRepository.save(new PostImage(post, extraImages.get(i), i + 1));
        }
        return toDetails(post, me.getId());
    }

    public PostDetailsResponse update(Long postId, String content, String imageUrl) {
        Post post = getPost(postId);
        requireAuthor(post);
        if (content != null) post.setContent(content.trim());
        if (imageUrl != null) post.setImageUrl(imageUrl);
        return toDetails(postRepository.save(post), currentUserProvider.requireUserId());
    }

    public void delete(Long postId) {
        Post post = getPost(postId);
        User me = currentUserProvider.requireUser();
        requireAuthor(post);
        // Community moderators/owners may also remove content.
        if (!post.getUser().getId().equals(me.getId())) {
            throw new ForbiddenException("Only the author can delete this post");
        }
        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public PostDetailsResponse details(Long postId) {
        Post post = getPost(postId);
        return toDetails(post, currentUserProvider.requireUserId());
    }

    public CommentResponse addComment(CreateCommentRequest request) {
        User me = currentUserProvider.requireUser();
        Post post = getPost(request.postId());
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(me);
        comment.setContent(request.content().trim());
        if (request.parentCommentId() != null) {
            Comment parent = commentRepository.findById(request.parentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", request.parentCommentId()));
            if (!parent.getPost().getId().equals(post.getId())) {
                throw new BadRequestException("Parent comment belongs to a different post");
            }
            comment.setParentComment(parent);
        }
        comment = commentRepository.save(comment);
        post.incrementCommentCount();
        postRepository.save(post);

        if (!post.getUser().getId().equals(me.getId())) {
            notificationService.createNotification(
                    post.getUser().getId(), NotificationType.COMMENT,
                    "New comment", displayName(me) + " commented on your post", post.getId());
        }
        return toCommentResponse(comment);
    }

    public CommentResponse updateComment(Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
        requireAuthor(comment.getUser());
        comment.setContent(content.trim());
        return toCommentResponse(commentRepository.save(comment));
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
        User me = currentUserProvider.requireUser();
        if (!comment.getUser().getId().equals(me.getId())
                && !postRepository.findById(comment.getPost().getId())
                        .map(p -> p.getUser().getId().equals(me.getId())).orElse(false)) {
            throw new ForbiddenException("Only the author or post owner can delete this comment");
        }
        Post post = comment.getPost();
        commentRepository.delete(comment);
        post.decrementCommentCount();
        postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public Page<CommentResponse> comments(Long postId, Pageable pageable) {
        getPost(postId);
        return commentRepository.findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(postId, pageable)
                .map(this::toCommentResponse);
    }

    public void react(Long postId, String type) {
        User me = currentUserProvider.requireUser();
        Post post = getPost(postId);
        if (reactionRepository.existsByPostIdAndUserId(postId, me.getId())) {
            throw new BadRequestException("Already reacted to this post");
        }
        Reaction reaction = new Reaction();
        reaction.setPost(post);
        reaction.setUser(me);
        reaction.setType(type != null ? type : "LIKE");
        reactionRepository.save(reaction);
        post.incrementLikeCount();
        postRepository.save(post);

        if (!post.getUser().getId().equals(me.getId())) {
            notificationService.createNotification(
                    post.getUser().getId(), NotificationType.POST_LIKE,
                    "New reaction", displayName(me) + " reacted to your post", post.getId());
        }
    }

    public void unreact(Long postId) {
        User me = currentUserProvider.requireUser();
        getPost(postId);
        if (reactionRepository.existsByPostIdAndUserId(postId, me.getId())) {
            reactionRepository.deleteByPostIdAndUserId(postId, me.getId());
            Post post = getPost(postId);
            post.decrementLikeCount();
            postRepository.save(post);
        }
    }

    @Transactional(readOnly = true)
    public boolean hasReacted(Long postId) {
        return reactionRepository.existsByPostIdAndUserId(postId, currentUserProvider.requireUserId());
    }

    private void requireMembership(Community community) {
        User me = currentUserProvider.requireUser();
        if (!community.isPublicCommunity()) {
            boolean member = communityMemberRepository.existsByCommunityIdAndUserId(community.getId(), me.getId());
            if (!member) throw new ForbiddenException("You must be a member to post in this community");
        }
    }

    private void requireAuthor(User author) {
        if (!author.getId().equals(currentUserProvider.requireUserId())) {
            throw new ForbiddenException("You can only modify your own content");
        }
    }

    private void requireAuthor(Post post) {
        requireAuthor(post.getUser());
    }

    private Post getPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));
    }

    private String displayName(User user) {
        Profile p = user.getProfile();
        if (p != null && p.getFirstName() != null) {
            return p.getFirstName() + (p.getLastName() != null ? " " + p.getLastName() : "");
        }
        return user.getEmail().split("@")[0];
    }

    private PostDetailsResponse toDetails(Post p, Long viewerId) {
        List<String> images = postImageRepository.findByPostIdOrderBySortOrderAsc(p.getId())
                .stream().map(PostImage::getImageUrl).toList();
        Profile authorProfile = p.getUser().getProfile();
        return new PostDetailsResponse(
                p.getId(), p.getCommunity().getId(), p.getCommunity().getName(),
                p.getUser().getId(), displayName(p.getUser()),
                authorProfile != null ? authorProfile.getProfilePictureUrl() : null,
                p.getContent(), p.getImageUrl(), images,
                p.getLikeCount(), p.getCommentCount(),
                reactionRepository.existsByPostIdAndUserId(p.getId(), viewerId),
                p.getCreatedAt(), p.getUpdatedAt());
    }

    private CommentResponse toCommentResponse(Comment c) {
        return new CommentResponse(
                c.getId(), c.getPost().getId(),
                c.getParentComment() != null ? c.getParentComment().getId() : null,
                c.getUser().getId(), displayName(c.getUser()),
                c.getContent(), c.getCreatedAt());
    }
}
