package com.musicstream.app.controller;

import com.musicstream.app.model.Song;
import com.musicstream.app.repository.SongRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceRegion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/songs")
public class SongController {

    private static final long CHUNK_SIZE = 1024 * 1024; // 1MB

    private final SongRepository songRepository;

    public SongController(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @GetMapping
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    @GetMapping("/{id}")
    public Song getSongById(@PathVariable Long id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));
    }

    // ✅ CORRECT STREAMING IMPLEMENTATION
    @GetMapping(value = "/{id}/stream", produces = "audio/mpeg")
    public ResponseEntity<ResourceRegion> streamSong(
            @PathVariable Long id,
            @RequestHeader HttpHeaders headers
    ) throws IOException {

        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        Resource resource = new ClassPathResource(song.getFilePath());

        if (!resource.exists()) {
            throw new RuntimeException("Audio file not found: " + song.getFilePath());
        }

        long contentLength = resource.contentLength();

        ResourceRegion region;

        if (headers.getRange().isEmpty()) {
            region = new ResourceRegion(resource, 0, Math.min(CHUNK_SIZE, contentLength));
        } else {
            HttpRange range = headers.getRange().get(0);
            long start = range.getRangeStart(contentLength);
            long end = range.getRangeEnd(contentLength);
            long rangeLength = Math.min(CHUNK_SIZE, end - start + 1);
            region = new ResourceRegion(resource, start, rangeLength);
        }

        return ResponseEntity
                .status(HttpStatus.PARTIAL_CONTENT)
                .contentType(MediaType.valueOf("audio/mpeg"))
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(region);
    }
}
