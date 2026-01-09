package com.musicstream.app.repository;

import com.musicstream.app.model.Song;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    @Query("""
        SELECT s FROM Song s
        WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(s.artist) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(s.album) LIKE LOWER(CONCAT('%', :q, '%'))
    """)
    List<Song> search(@Param("q") String q);
}
