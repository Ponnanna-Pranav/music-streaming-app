import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Songs from "./pages/Songs";
import Playlists from "./pages/Playlists";
import PlaylistDetails from "./pages/PlaylistDetails";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import GlobalAudioPlayer from "./components/GlobalAudioPlayer";
import MainLayout from "./layouts/MainLayout";
import { PlayerProvider } from "./context/PlayerContext";

function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>

          {/* 🔐 AUTH ROUTES */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🎵 APP ROUTES */}
          <Route
            path="/songs"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Songs />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Playlists />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/playlists/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PlaylistDetails />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Account />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Admin />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* 🚫 FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>

        {/* 🎧 GLOBAL AUDIO PLAYER */}
        <GlobalAudioPlayer />
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
