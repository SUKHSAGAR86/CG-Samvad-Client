
import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import "bootstrap/dist/css/bootstrap.min.css";

const ClientNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // toggle state

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("http://localhost:3080/api/get-clientnotices");
        setNotices(res.data.data || []);
      } catch (err) {
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  // Decide which notices to show
  const visibleNotices = showAll ? notices : notices.slice(0, 10);

  return (
    <div className="container-fluid py-3 p-3">
      <div className="container p-0 shadow-lg rounded">
        {/* Header Bar */}
        <div
          className="notice-header text-center text-white py-2 fw-bold"
          style={{
            background: "linear-gradient(135deg, #dce3f0 0%, #7c3737ff 100%)",
            borderBottom: "2px solid #999",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            fontSize: "1.2rem",
            letterSpacing: "1px",
          }}
        >
          सूचना पट्ट (Notice Board)
        </div>

        {/* Scrollable Notice List */}
        <div
          className="notice-list"
          style={{
            maxHeight: showAll ? "none" : "400px",
            overflowY: showAll ? "visible" : "auto",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
          }}
        >
          {loading ? (
            <div className="text-center p-4 text-muted">Loading notices...</div>
          ) : notices.length === 0 ? (
            <div className="text-center p-4 text-danger">
              कोई सक्रिय सूचना उपलब्ध नहीं है।
            </div>
          ) : (
            visibleNotices.map((notice, idx) => (
              <div
                key={idx}
                className="notice-item d-flex align-items-start px-3 py-2 border-bottom"
                style={{
                  backgroundColor: idx % 2 === 0 ? "#fafafa" : "#fff",
                  transition: "background 0.3s",
                }}
              >
                <div className="notice-content flex-grow-1">
                  <div
                    className="notice-text"
                    style={{
                      fontFamily: "'Noto Sans Devanagari', sans-serif",
                      color: "#4b1f1f",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    {parse(notice.Information || "")}
                  </div>
                  <div
                    className="notice-date text-end"
                    style={{ fontSize: "0.9rem", color: "#555" }}
                  >
                    <strong>Date:</strong> {notice.entry_date}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show More / Show Less Button */}
        {!loading && notices.length > 10 && (
          <div className="text-center p-3 bg-light border-top">
            <button
              className="btn btn-sm btn-outline-danger fw-bold"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientNotices;
