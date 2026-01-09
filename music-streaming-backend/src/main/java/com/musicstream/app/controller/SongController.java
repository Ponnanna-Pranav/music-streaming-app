package com.musicstream.app.controller;

import com.musicstream.app.model.Song;
import com.musicstream.app.repository.SongRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/songs")
public class SongController {

    private final SongRepository songRepository;

    public SongController(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    // =========================
    // GET /songs
    // =========================
    @GetMapping
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    // =========================
    // GET /songs/{id}/stream
    // =========================
    @GetMapping(value = "/{id}/stream", produces = "audio/mpeg")
    public ResponseEntity<Resource> streamSong(
            @PathVariable Long id,
            @RequestHeader HttpHeaders headers
    ) throws IOException {

        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        Resource resource = new ClassPathResource(song.getFilePath());

        if (!resource.exists()) {
            throw new RuntimeException("Audio file not found: " + song.getFilePath());
        }

        long fileSize = resource.contentLength();

        // ✅ No Range → full file
        if (headers.getRange().isEmpty()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("audio/mpeg"))
                    .contentLength(fileSize)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(resource);
        }

        // ✅ Range request (streaming)
        HttpRange range = headers.getRange().get(0);
        long start = range.getRangeStart(fileSize);
        long end = range.getRangeEnd(fileSize);
        long length = end - start + 1;

        return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaType.valueOf("audio/mpeg"))
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .header(
                        HttpHeaders.CONTENT_RANGE,
                        "bytes " + start + "-" + end + "/" + fileSize
                )
                .contentLength(length)
                .body(resource);
    }
}
