package com.migrantcommunity.upload;

import com.migrantcommunity.common.exception.BadRequestException;
import com.migrantcommunity.common.response.ApiResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.util.Map;

/** REST endpoints for secure file uploads and retrieval. */
@RestController
@RequestMapping("/v1/uploads")
public class UploadController {

    private final FileStorageService storageService;

    public UploadController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, String>>> upload(@RequestParam("file") MultipartFile file) {
        String filename = storageService.store(file);
        return ResponseEntity.ok(ApiResponse.ok(
                Map.of("filename", filename, "url", storageService.publicUrl(filename)),
                "File uploaded"));
    }

    @GetMapping("/files/{filename}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> file(@PathVariable String filename) {
        try {
            var path = storageService.resolve(filename);
            Resource resource = new FileSystemResource(path);
            String contentType = Files.probeContentType(path);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .header("X-Content-Type-Options", "nosniff")
                    .contentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (BadRequestException ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
