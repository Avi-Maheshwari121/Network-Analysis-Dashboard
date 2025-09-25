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
  interfaces, // Receive interfaces prop
}) {
  return (
    <div>
      <StatusBanner connected={wsConnected} error={error} />
      <ControlPanel
        sendCommand={sendCommand}
        loading={loading}
        commandStatus={commandStatus}
        interfaces={interfaces} // Pass interfaces to ControlPanel
      />
      <MetricCards metrics={metrics} streamCount={streamCount} />
    </div>
  );
}