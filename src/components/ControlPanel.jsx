export default function ControlPanel({ sendCommand, loading, commandStatus }) {
  const Button = ({ onClick, children }) => (
    <button
      className="bg-primary-accent text-base-dark px-4 py-2 rounded font-bold shadow disabled:opacity-50"
      onClick={onClick}
      disabled={loading}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button onClick={() => sendCommand("start_capture")}>Start Capture</Button>
      <Button onClick={() => sendCommand("stop_capture")}>Stop Capture</Button>
      {/* <Button onClick={() => sendCommand("clear_packets")}>Clear Packets</Button> */}
      {/* <Button onClick={() => sendCommand("get_status")}>Get Status</Button> */}
      {commandStatus && (
        <div className={`ml-auto px-4 py-2 rounded text-white ${commandStatus.success ? "bg-green-600" : "bg-red-600"}`}>
          {commandStatus.message || `Status: ${commandStatus.metrics.status}`}
        </div>
      )}
    </div>
  );
}
