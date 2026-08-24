import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Sidebar } from "./components/layout/Sidebar";

import { ConfigureUpload } from "./pages/sender/ConfigureUpload";
import { ReceiverDashboard } from "./pages/reciever/ReceiverDashboard";
import { Toaster } from "sonner";

function App() {

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          <Toaster
            position="top-right"

            richColors
            closeButton
          />
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/sender/configure" replace />}
            />

            <Route path="/sender/configure" element={<ConfigureUpload />} />

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
