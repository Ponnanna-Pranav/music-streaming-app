package com.musicstream.app.service;

import com.musicstream.app.model.Playlist;
import com.musicstream.app.model.Song;
import com.musicstream.app.repository.PlaylistRepository;
import com.musicstream.app.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;

    public PlaylistService(
            PlaylistRepository playlistRepository,
            SongRepository songRepository
    ) {
        this.playlistRepository = playlistRepository;
        this.songRepository = songRepository;
    }

    // ✅ Get all playlists
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    // ✅ Get playlist by ID (FIX)
    public Playlist getPlaylistById(Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
    }

    // ✅ Create playlist
    public Playlist createPlaylist(String name) {
        Playlist playlist = new Playlist();
        playlist.setName(name);
        return playlistRepository.save(playlist);
    }

    // ✅ Add song to playlist
    public void addSongToPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        playlist.getSongs().add(song);
        playlistRepository.save(playlist);
    }

    // ✅ Remove song from playlist
    public void removeSongFromPlaylist(Long playlistId, Long songId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        playlist.getSongs().removeIf(song -> song.getId().equals(songId));
        playlistRepository.save(playlist);
    }
}
