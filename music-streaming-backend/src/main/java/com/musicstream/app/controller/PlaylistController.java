package com.musicstream.app.controller;

import com.musicstream.app.model.Playlist;
import com.musicstream.app.model.Song;
import com.musicstream.app.repository.PlaylistRepository;
import com.musicstream.app.repository.SongRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/playlists")
@CrossOrigin(origins = "http://localhost:5173")
public class PlaylistController {

    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;

    public PlaylistController(
            PlaylistRepository playlistRepository,
            SongRepository songRepository
    ) {
        this.playlistRepository = playlistRepository;
        this.songRepository = songRepository;
    }

    // =========================
    // GET all playlists
    // =========================
    @GetMapping
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    // =========================
    // GET playlist by ID (with songs)
    // =========================
    @GetMapping("/{id}")
    public Playlist getPlaylist(@PathVariable Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
    }

    // =========================
    // CREATE playlist
    // =========================
    @PostMapping
    public Playlist createPlaylist(@RequestBody Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    // =========================
    // ADD SONG TO PLAYLIST ✅ (CRITICAL)
    // =========================
    @PostMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<?> addSongToPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long songId
    ) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        // Prevent duplicates
        if (!playlist.getSongs().contains(song)) {
            playlist.getSongs().add(song);
            playlistRepository.save(playlist);
        }

        return ResponseEntity.ok().build();
    }

    // =========================
    // REMOVE SONG FROM PLAYLIST (OPTIONAL BUT GOOD)
    // =========================
    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<?> removeSongFromPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long songId
    ) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        playlist.getSongs().removeIf(song -> song.getId().equals(songId));
        playlistRepository.save(playlist);

        return ResponseEntity.ok().build();
    }

    // =========================
    // DELETE playlist
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlaylist(@PathVariable Long id) {
        playlistRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
