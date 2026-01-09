// src/api/api.js
import axios from "axios";

/* ============================
   BASE URL (ENV-BASED)
============================ */

const BASE_URL = import.meta.env.VITE_API_URL;

/* ============================
   AXIOS INSTANCE
============================ */

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   ATTACH JWT (SKIP AUTH)
============================ */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (
      token &&
      !config.url.startsWith("/users/login") &&
      !config.url.startsWith("/users/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ============================
   AUTH APIs
============================ */

export const loginUser = async (email, password) => {
  const res = await api.post("/users/login", { email, password });
  return res.data;
};

export const registerUser = async (email, password) => {
  const res = await api.post("/users/register", { email, password });
  return res.data;
};

/* ============================
   SONG APIs
============================ */

export const getSongs = async () => {
  const res = await api.get("/songs");
  return res.data;
};

export const streamSongUrl = (songId) =>
  `${BASE_URL}/songs/${songId}/stream`;

/* ============================
   PLAYLIST APIs
============================ */

export const getPlaylists = async () => {
  const res = await api.get("/playlists");
  return res.data;
};

export const getPlaylistById = async (id) => {
  const res = await api.get(`/playlists/${id}`);
  return res.data;
};

export const createPlaylist = async (name) => {
  const res = await api.post("/playlists", { name });
  return res.data;
};

export const deletePlaylist = async (id) => {
  await api.delete(`/playlists/${id}`);
};

export const addSongToPlaylist = async (playlistId, songId) => {
  await api.post(`/playlists/${playlistId}/songs/${songId}`);
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  await api.delete(`/playlists/${playlistId}/songs/${songId}`);
};

export default api;
