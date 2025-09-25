import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import RawData from "./pages/RawData";
import useWebSocket from "./hooks/useWebsocket.js"; // Import the hook here

const WEBSOCKET_URL = "ws://localhost:8765";

function App() {
  const [view, setView] = useState("dashboard");

  const {
    wsConnected,
    metrics,
    packets,
    streamCount,
    commandStatus,
    loading,
    error,
    sendCommand,
    interfaces, // Get interfaces from the hook
  } = useWebSocket(WEBSOCKET_URL);

  return (
    <div className="bg-base-dark min-h-screen text-text-main font-sans flex">
      <Sidebar activeView={view} setActiveView={setView} />
      <main className="flex-1 p-8">
        {view === "dashboard" ? (
          <Dashboard
            wsConnected={wsConnected}
            metrics={metrics}
            streamCount={streamCount}
            commandStatus={commandStatus}
            loading={loading}
            error={error}
            sendCommand={sendCommand}
            interfaces={interfaces} // Pass interfaces to Dashboard
          />
        ) : (
          <RawData
            wsConnected={wsConnected}
            packets={packets}
            error={error}
          />
        )}
      </main>
    </div>
  );
}

export default App;