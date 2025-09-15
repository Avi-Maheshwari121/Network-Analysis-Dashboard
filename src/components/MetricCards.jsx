export default function MetricCards({ metrics, streamCount }) {
  const Card = ({ title, value, unit }) => (
    <div className="bg-surface-dark p-5 rounded-xl border border-border-dark text-center shadow-md">
      <p className="text-sm font-semibold text-text-secondary uppercase mb-2">{title}</p>
      <p className="text-3xl font-bold text-text-main">
        {value} {unit && <span className="text-lg">{unit}</span>}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <Card title="Throughput" value={metrics ? (metrics.throughput*8 / 1e6).toFixed(2) : "0.00"} unit="Mbps" />
      <Card title="Latency" value={metrics ? metrics.latency.toFixed(1) : "0.0"} unit="ms" />
      <Card title="Packet Loss" value={metrics ? metrics.packet_loss_count : "0"} />
      <Card title="Status" value={metrics ? metrics.status : "stopped"} />
      <Card title="Streams" value={streamCount || "0"} />
    </div>
  );
}
