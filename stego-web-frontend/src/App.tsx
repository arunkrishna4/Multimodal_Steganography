import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { Sidebar } from "./components/layout/Sidebar";

import { ConfigureUpload } from "./pages/sender/ConfigureUpload";
import { SplitEmbed } from "./pages/sender/SplitEmbed";
import { ReceiverDashboard } from "./pages/reciever/ReceiverDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/sender/configure" replace />}
            />

            <Route path="/sender/configure" element={<ConfigureUploadPage />} />

            <Route path="/sender/split" element={<SplitEmbedPage />} />

            <Route path="/receiver" element={<ReceiverDashboard />} />

            <Route
              path="*"
              element={<Navigate to="/sender/configure" replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

// ==========================================
// SENDER CONFIGURE PAGE
// ==========================================

const ConfigureUploadPage = () => {
  const navigate = useNavigate();

  return <ConfigureUpload onContinue={() => navigate("/sender/split")} />;
};

// ==========================================
// SENDER SPLIT PAGE
// ==========================================

const SplitEmbedPage = () => {
  const navigate = useNavigate();

  return (
    <SplitEmbed
      splitInfo={createDemoSplitInfo()}
      onBack={() => navigate("/sender/configure")}
    />
  );
};

// ==========================================
// DEMO DATA
// ==========================================

const createDemoSplitInfo = () => {
  return {
    secretFileName: "secret-message.txt",
    secretFileSize: 19600,
    totalParts: 2,

    files: [
      {
        id: "image-1",
        mediaType: "image" as const,
        fileName: "image.png",
        methodName: "LSB Substitution",
        bytes: 10052,
        percentage: 50,
        status: "pending" as const,
      },

      {
        id: "audio-1",
        mediaType: "audio" as const,
        fileName: "audio.wav",
        methodName: "Echo Hiding",
        bytes: 10052,
        percentage: 50,
        status: "pending" as const,
      },
    ],
  };
};
