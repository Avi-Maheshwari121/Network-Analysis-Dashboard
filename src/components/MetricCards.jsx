export default function MetricCards({ metrics, streamCount }) {
  const Card = ({ title, value, unit, subValue }) => (
    <div className="bg-surface-dark p-5 rounded-xl border border-border-dark text-center shadow-md">
      <p className="text-sm font-semibold text-text-secondary uppercase mb-2">{title}</p>
      <p className="text-3xl font-bold text-text-main">
        {value} {unit && <span className="text-lg">{unit}</span>}
      </p>
      {subValue && <p className="text-xs text-text-secondary mt-1 font-bold">{subValue}</p>}
    </div>
  );

  // Safely access metric values, providing defaults if metrics object is null
  const throughput = metrics ? (metrics.throughput * 8 / 1e6).toFixed(2) : "0.00";
  const latency = metrics ? metrics.latency.toFixed(1) : "0.0";
  const jitter = metrics ? (metrics.jitter || 0).toFixed(1) : "0.0";
  const packetLossCount = metrics ? metrics.packet_loss_count : "0";
  const packetLossPercent = metrics ? (metrics.packet_loss_percent || 0).toFixed(2) : "0.00";
  const status = metrics ? metrics.status : "stopped";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
      <Card title="Throughput" value={throughput} unit="Mbps" />
      <Card title="Latency" value={latency} unit="ms" />
      <Card title="Jitter" value={jitter} unit="ms" />
      <Card 
        title="Packet Loss" 
        value={packetLossCount} 
        subValue={`(${packetLossPercent}%)`} 
      />
      <Card title="Status" value={status} />
      <Card title="Streams" value={streamCount || "0"} />
    </div>
  );
}