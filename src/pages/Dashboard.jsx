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
}) {
  return (
    <div>
      <StatusBanner connected={wsConnected} error={error} />
      <ControlPanel
        sendCommand={sendCommand}
        loading={loading}
        commandStatus={commandStatus}
      />
      <MetricCards metrics={metrics} streamCount={streamCount} />
    </div>
  );
}
