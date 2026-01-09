package com.musicstream.app.controller;

import com.musicstream.app.model.Song;
import com.musicstream.app.repository.SongRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/songs")
@CrossOrigin(origins = "http://localhost:5173")
public class SongController {

    private final SongRepository songRepository;

    public SongController(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    // -------------------------
    // GET /songs
    // -------------------------
    @GetMapping
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    // -------------------------
    // GET /songs/{id}
    // -------------------------
    @GetMapping("/{id}")
    public Song getSongById(@PathVariable Long id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));
    }

    // -------------------------
    // GET /songs/{id}/stream
    // -------------------------
    @GetMapping(value = "/{id}/stream", produces = "audio/mpeg")
    public ResponseEntity<Resource> streamSong(
            @PathVariable Long id,
            @RequestHeader HttpHeaders headers
    ) throws IOException {

        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        // ✅ Absolute file path (works 100% reliably)
        Path path = Paths.get("src/main/resources/audio/" + song.getFilePath());

        if (!Files.exists(path)) {
            throw new RuntimeException("Audio file not found");
        }

        long fileSize = Files.size(path);
        Resource resource = new UrlResource(path.toUri());

        // ✅ No Range header → send full file
        if (headers.getRange().isEmpty()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("audio/mpeg"))
                    .contentLength(fileSize)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(resource);
        }

        // ✅ Range request
        HttpRange range = headers.getRange().get(0);
        long start = range.getRangeStart(fileSize);
        long end = range.getRangeEnd(fileSize);
        long length = end - start + 1;

        // 🔥 Create sliced resource
        Resource slicedResource = new UrlResource(path.toUri()) {
            @Override
            public long contentLength() {
                return length;
            }
        };

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaType.valueOf("audio/mpeg"))
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .header(HttpHeaders.CONTENT_RANGE,
                        "bytes " + start + "-" + end + "/" + fileSize)
                .contentLength(length)
                .body(slicedResource);
    }
}
