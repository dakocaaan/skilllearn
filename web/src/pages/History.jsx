
import { useEffect, useState } from "react";
import { Clock3, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await api.get("/history");
        setHistory(response.data.history);
      } catch (err) {
        setError("Unable to load learning history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const clearHistory = async () => {
    if (!window.confirm("Clear all your learning history?")) {
      return;
    }

    setClearing(true);

    try {
      await api.delete("/history");
      setHistory([]);
    } catch (err) {
      alert("Failed to clear learning history.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="dashboard-header">
        <div>
          <p className="dashboard-overline">YOUR LEARNING ACTIVITY</p>
          <h1>Learning History</h1>
        </div>
      </header>

      <div className="history-toolbar">
        <p>Resources you've started learning.</p>

        {history.length > 0 && (
          <button
            className="clear-history-button"
            onClick={clearHistory}
            disabled={clearing}
          >
            <Trash2 size={16} />
            {clearing ? "Clearing..." : "Clear History"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="dashboard-status">Loading history...</div>
      ) : error ? (
        <div className="dashboard-status">{error}</div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <Clock3 size={42} />
          <h2>No learning history yet</h2>
          <p>Click Start Learning on any material to begin.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.filter(item => item.material).map((item) => (
            <Link
              to={`/material/${item.material._id}`}
              key={item._id}
              className="history-item"
            >
              <div className="history-icon">
                <Clock3 size={22} />
              </div>

              <div className="history-details">
                <h3>{item.material.title}</h3>
                <p>
                  {item.material.category} · Opened {item.accessCount} time(s)
                </p>
                <span>
                  Last opened:{" "}
                  {new Date(item.lastAccessed).toLocaleString()}
                </span>
              </div>

              <ExternalLink size={19} />
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default History;
