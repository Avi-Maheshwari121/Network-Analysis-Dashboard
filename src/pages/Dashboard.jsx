import StatusBanner from "../components/StatusBanner";
import MetricCards from "../components/MetricCards";
import ControlPanel from "../components/ControlPanel";

export default function Dashboard({
  wsConnected,
  metrics,
  streamCount,
  commandStatus,
  loading,
  error,
  sendCommand,
  interfaces,
}) {
  return (
    <div>
      {/* Pass metrics to StatusBanner to show capture status */}
      <StatusBanner connected={wsConnected} error={error} metrics={metrics} />
      
      <ControlPanel
        sendCommand={sendCommand}
        loading={loading}
        commandStatus={commandStatus}
        interfaces={interfaces}
      />
      
      {/* The Status card is now removed from here */}
      <MetricCards metrics={metrics} streamCount={streamCount} />
    </div>
  );
}