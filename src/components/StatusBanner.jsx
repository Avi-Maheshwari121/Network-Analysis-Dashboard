export default function StatusBanner({ connected, error }) {
  if (error) {
    return <div className="bg-red-600 text-white px-4 py-2 rounded mb-4">{error}</div>;
  }

  return (
    <div className="flex items-center gap-2 font-semibold text-text-secondary mb-6">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
      <span>System Status: {connected ? "Operational" : "Disconnected"}</span>
    </div>
  );
}
