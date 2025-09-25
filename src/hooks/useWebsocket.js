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
  const [interfaces, setInterfaces] = useState([]); // State for interfaces
  const ws = useRef(null);

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

        if (isStopping.current && msg.metrics?.status === "running") {
          return;
        }
        if (msg.metrics?.status === "stopped") {
          isStopping.current = false;
        }

        switch (msg.type) {
          case "initial_state":
            setMetrics(msg.metrics);
            setPackets(msg.packets || []);
            setInterfaces(msg.interfaces || []);
            break;

          case "interfaces_response":
            setInterfaces(msg.interfaces || []);
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
              isStopping.current = false;
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

    if (command === "stop_capture") {
      isStopping.current = true;
      setMetrics(prev => ({ ...prev, status: "stopped" }));
      // Optimistic UI update for stop command
      setLoading(false);
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
    interfaces,
  };
}