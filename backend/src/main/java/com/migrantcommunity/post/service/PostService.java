package com.migrantcommunity.post.service;

import com.migrantcommunity.post.dto.PostResponse;
import org.springframework.stereotype.Service;

import java.util.List;

/** Placeholder post logic for the prototype. */
@Service
public class PostService {

    /**
     * Returns a placeholder feed.
     * The real implementation will read the posts table from the database.
     */
    public List<PostResponse> feed() {
        return List.of(
                new PostResponse("post_001", "usr_002", "com_001", "Any good Indian grocery stores nearby?", 4),
                new PostResponse("post_002", "usr_003", "com_002", "Weekend meetup planned for the Tamil group.", 11));
    }

    /**
     * Returns the placeholder post that was created.
     * The real implementation will persist a new row in the posts table.
     */
    public PostResponse create(String authorId, String communityId, String content) {
        return new PostResponse("post_new", authorId, communityId, content, 0);
    }
}
