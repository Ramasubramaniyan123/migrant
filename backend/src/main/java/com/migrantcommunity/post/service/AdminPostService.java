package com.migrantcommunity.post.service;

import com.migrantcommunity.community.entity.Community;
import com.migrantcommunity.moderation.repository.ContentFlagRepository;
import com.migrantcommunity.post.dto.Post;
import com.migrantcommunity.post.repository.CommentRepository;
import com.migrantcommunity.post.repository.PostRepository;
import com.migrantcommunity.profile.entity.Profile;
import com.migrantcommunity.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminPostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ContentFlagRepository contentFlagRepository;

    public AdminPostService(PostRepository postRepository,
                            CommentRepository commentRepository,
                            ContentFlagRepository contentFlagRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.contentFlagRepository = contentFlagRepository;
    }

    @Transactional(readOnly = true)
    public List<Post> list(String communityId) {
        List<com.migrantcommunity.post.entity.Post> rows;
        if (communityId != null && !communityId.isBlank()) {
            rows = postRepository.findByCommunityIdOrderByCreatedAtDesc(parseId(communityId), Pageable.unpaged())
                    .getContent();
        } else {
            rows = postRepository.findAllByOrderByCreatedAtDesc(Pageable.unpaged()).getContent();
        }
        return rows.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<Post> flagged() {
        Set<Long> flaggedIds = contentFlagRepository.findByStatusOrderByCreatedAtDesc("OPEN").stream()
                .filter(f -> "POST".equalsIgnoreCase(f.getTargetType()))
                .map(com.migrantcommunity.moderation.entity.ContentFlag::getTargetId)
                .collect(Collectors.toSet());
        if (flaggedIds.isEmpty()) {
            return List.of();
        }
        return postRepository.findAllById(flaggedIds).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Post getById(String id) {
        return toDto(getEntity(id));
    }

    public void remove(String id) {
        postRepository.delete(getEntity(id));
    }

    private com.migrantcommunity.post.entity.Post getEntity(String id) {
        return postRepository.findById(parseId(id))
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
    }

    private Long parseId(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Post not found");
        }
    }

    private Post toDto(com.migrantcommunity.post.entity.Post p) {
        User author = p.getUser();
        Profile profile = author != null ? author.getProfile() : null;
        String authorName = profile != null && profile.getFirstName() != null
                ? profile.getFirstName() + (profile.getLastName() != null ? " " + profile.getLastName() : "")
                : (author != null ? author.getEmail() : "Unknown");
        Community community = p.getCommunity();
        boolean flagged = contentFlagRepository.existsByTargetTypeAndTargetIdAndStatus(
                "POST", p.getId(), "OPEN");
        return new Post(
                String.valueOf(p.getId()),
                author != null ? String.valueOf(author.getId()) : null,
                authorName,
                community != null ? String.valueOf(community.getId()) : null,
                community != null ? community.getName() : null,
                p.getContent(),
                p.getImageUrl(),
                p.getLikeCount(),
                commentRepository.countByPostId(p.getId()),
                flagged,
                p.getCreatedAt() != null ? p.getCreatedAt().toString() : null);
    }
}
