package com.migrantcommunity.upload;

import com.migrantcommunity.common.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Secure local file storage for uploads. Validates content type by magic
 * bytes where possible, enforces size limits, and stores files under
 * randomized names inside a configurable directory.
 */
@Service
public class FileStorageService {

    private static final Map<String, Set<String>> ALLOWED_TYPES = Map.of(
            "image/jpeg", Set.of("jpg", "jpeg"),
            "image/png", Set.of("png"),
            "image/webp", Set.of("webp"),
            "image/gif", Set.of("gif"));

    private final Path root;
    private final long maxSizeBytes;

    public FileStorageService(
            @Value("${app.upload.dir:./uploads}") String uploadDir,
            @Value("${app.upload.max-size-bytes:5242880}") long maxSizeBytes) {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.maxSizeBytes = maxSizeBytes;
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new BadRequestException("File exceeds maximum size of " + (maxSizeBytes / 1024 / 1024) + "MB");
        }
        String contentType = file.getContentType();
        Set<String> extensions = contentType != null ? ALLOWED_TYPES.get(contentType.toLowerCase()) : null;
        if (extensions == null) {
            throw new BadRequestException("Unsupported file type: " + contentType
                    + ". Allowed: JPEG, PNG, WebP, GIF");
        }
        try {
            Files.createDirectories(root);
        } catch (IOException ex) {
            throw new IllegalStateException("Cannot initialize upload directory", ex);
        }
        String extension = extensions.iterator().next();
        String filename = UUID.randomUUID() + "." + extension;
        Path target = root.resolve(filename).normalize();
        if (!target.startsWith(root)) {
            throw new BadRequestException("Invalid file path");
        }
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalStateException("Failed to store uploaded file", ex);
        }
        return filename;
    }

    public Path resolve(String filename) {
        Path target = root.resolve(filename).normalize();
        if (!target.startsWith(root) || !Files.exists(target)) {
            throw new BadRequestException("File not found");
        }
        return target;
    }

    public String publicUrl(String filename) {
        return "/v1/uploads/files/" + filename;
    }
}
