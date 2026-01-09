package com.musicstream.app.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String artist;
    private String album;

    @Column(name = "file_path")
    private String filePath;
}
