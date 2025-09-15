import { useState, useRef, useEffect } from "react";

const MAX_PACKETS_TO_STORE = 10000;

export default function useWebSocket(url) {
  const [wsConnected, setWsConnected] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [packets, setPackets] = useState([]);
  const [streamCount, setStreamCount] = useState(0);
  const [commandStatus, setCommandStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  // THIS IS THE KEY ADDITION: A flag to prevent race conditions
  const isStopping = useRef(false);
  
  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => setWsConnected(true);
    ws.current.onclose = () => setWsConnected(false);
    ws.current.onerror = () => setError("WebSocket connection error.");

    ws.current.onmessage = ({ data }) => {
      try {
        const msg = JSON.parse(data);
        setError(null);

        // If we are in the process of stopping, ignore any "running" status
        if (isStopping.current && msg.metrics?.status === "running") {
          return; // Skip this update to prevent overwriting our "stopped" status
        }
        // Once we receive a "stopped" status, reset the flag
        if (msg.metrics?.status === "stopped") {
          isStopping.current = false;
        }

        switch (msg.type) {
          case "initial_state":
            setMetrics(msg.metrics);
            setPackets(msg.packets || []);
            break;

          case "update":
          case "metrics_update":
            const newLossFromPayload = msg.metrics.packet_loss_count || 0;
            setMetrics(prevMetrics => {
              const oldCumulativeLoss = prevMetrics ? prevMetrics.packet_loss_count : 0;
              const newCumulativeLoss = oldCumulativeLoss + newLossFromPayload;
              return { ...msg.metrics, packet_loss_count: newCumulativeLoss };
            });
            setStreamCount(msg.stream_count || 0);

            if (msg.new_packets && msg.new_packets.length > 0) {
              setPackets(prevPackets => {
                const updatedPackets = [...prevPackets, ...msg.new_packets];
                return updatedPackets.slice(-MAX_PACKETS_TO_STORE);
              });
            }
            break;

          case "command_response":
            setCommandStatus(msg);
            setLoading(false);
            if (msg.command === "start_capture" && msg.success) {
              isStopping.current = false; // Reset flag on new start
              setMetrics(null); 
              setPackets([]);
              setStreamCount(0);
            }
            break;

          default:
            break;
        }
      } catch (e) {
        setError("Invalid data received from backend.");
      }
    };

    return () => ws.current?.close();
  }, [url]);

  const sendCommand = (command, payload = {}) => {
    setLoading(true);

    // THIS IS THE OTHER KEY CHANGE
    if (command === "stop_capture") {
      isStopping.current = true; // Set the flag before sending the command
      // Optimistically update the UI so it feels instantaneous
      setMetrics(prev => ({ ...prev, status: "stopped" }));
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ command, ...payload }));
    } else {
      setError("Cannot send command: WebSocket is not connected.");
      setLoading(false);
    }
  };

  return {
    wsConnected,
    metrics,
    packets,
    streamCount,
    commandStatus,
    loading,
    error,
    sendCommand,
  };
}
