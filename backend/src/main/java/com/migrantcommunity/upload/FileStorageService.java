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

    private static final int SNIFF_BYTES = 12;

    /** Detects the real image type from magic bytes; returns the canonical MIME type or null. */
    private static String detectImageType(byte[] header) {
        if (header.length >= 3
                && (header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (header.length >= 8
                && (header[0] & 0xFF) == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47
                && header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A) {
            return "image/png";
        }
        if (header.length >= 6 && header[0] == 'G' && header[1] == 'I' && header[2] == 'F'
                && header[3] == '8' && (header[4] == '7' || header[4] == '9') && header[5] == 'a') {
            return "image/gif";
        }
        if (header.length >= 12
                && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
            return "image/webp";
        }
        return null;
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new BadRequestException("File exceeds maximum size of " + (maxSizeBytes / 1024 / 1024) + "MB");
        }
        // Never trust the client-provided Content-Type; verify the actual bytes.
        byte[] header;
        try (InputStream in = file.getInputStream()) {
            header = in.readNBytes(SNIFF_BYTES);
        } catch (IOException ex) {
            throw new BadRequestException("Unable to read uploaded file");
        }
        String detectedType = detectImageType(header);
        Set<String> extensions = detectedType != null ? ALLOWED_TYPES.get(detectedType) : null;
        if (extensions == null) {
            throw new BadRequestException("Unsupported file type. Allowed: JPEG, PNG, WebP, GIF");
        }
        String declaredType = file.getContentType();
        if (declaredType != null && !declaredType.isBlank()
                && !detectedType.equalsIgnoreCase(declaredType.trim())) {
            throw new BadRequestException("File content does not match declared type " + declaredType);
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
