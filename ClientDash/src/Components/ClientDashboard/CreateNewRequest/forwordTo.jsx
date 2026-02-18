
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./button.css";

const ForwardTo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const actionType = location.state?.action || "get";

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);



  const recordsPerPage = 10;

  // Get localStorage only once (optimized)
  const { financial_year, user_id, user_name } = useMemo(() => ({
    financial_year: localStorage.getItem("financial_year") || "",
    user_id: localStorage.getItem("user_id") || "",
    user_name: localStorage.getItem("user_name") || "",
  }), []);

  // Safe Date Format (no timezone issue)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
  };

  // ============= Fetch All Requests ===================
  const fetchData = async () => {
    if (!financial_year || !user_id) {
      console.warn("Missing localStorage values:", {
        financial_year,
        user_id,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:3080/api/get-client-advt-request",
        {
          params: {
            financial_year,
            user_id,
            user_name,
            action: actionType,
            category: "02",
          },
        }
      );

      console.log("API Response:", res.data);

      // Handle multiple backend response formats safely
      const responseData =
        res.data?.data ||
        res.data?.result ||
        (Array.isArray(res.data) ? res.data : []);

      setData(responseData || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Fetch Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [actionType, financial_year, user_id, user_name]);

  // ============ Edit Handler ====================
  const handleEdit = async (ref_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3080/api/get-client-advt-request/${ref_id}`,
        {
          params: {
            financial_year,
            user_id,
            user_name,
            action: "get_by_id",
          },
        }
      );

      const rowData =
        response.data?.data ||
        response.data?.result ||
        response.data;

      navigate(`/newrequest`, {
        state: {
          action: "update",
          rowData,
        },
      });
    } catch (error) {
      console.error("Edit Error:", error);
      alert("Failed to fetch record details");
    }
  };

  // ================= DELETE HANDLER ===============
  const handleDelete = async (ref_id) => {
    if (!window.confirm(`Delete Ref ID ${ref_id}?`)) return;

    try {
      const res = await axios.delete(
        `http://localhost:3080/api/client-advt-request/${ref_id}`,
        {
          data: {
            ref_id,
            financial_year,
            user_id,
            user_name,
            action: "delete",
          },
        }
      );

      const status = res.data?.status ?? res.data?.success;

      if (status === 1 || status === true) {
        setData((prev) => prev.filter((row) => row.ref_id !== ref_id));
        alert(`Deleted successfully (Ref ID: ${ref_id})`);
      } else {
        alert(res.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Server error while deleting");
    }
  };

  // ================= Pagination ==================
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(data.length / recordsPerPage);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };



  const getTitle = () => {
  switch (actionType) {
    case "get_all_accepted":
      return "Accepted to Samvad";
    case "get_forwarded":
      return "Submited to Samvad";
    case "get_not_forwarded":
      return "Forward To Samvad";
case "get_under_process":
      return "Under Processing Request";
   
  }
};

  return (
    <div className="container p-4">
      <h4 className="fw-bold text-danger mb-3 text-center w-100">
    {getTitle()}
  </h4>


      {loading && (
        <div className="text-center mb-3">
          <span className="spinner-border text-danger" />
        </div>
      )}

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-custom table-bordered table-striped">
          <thead >
            <tr>
              <th>Ref ID</th>
              <th>Subject</th>
              <th>Letter No</th>
              <th>Category</th>
              <th>Letter Date</th>
              <th>Scheduled Publish Date</th>
              <th>Tender Amt</th>
              <th>Attachment</th>
              <th>Action</th>
              <th>Forward To Samvad</th>
            </tr>
          </thead>

          <tbody>
            {!loading && currentRecords.length > 0 ? (
              currentRecords.map((row, index) => (
                <tr key={row.ref_id || index}>
                  <td>{row.ref_id}</td>
                  <td>{row.subject || "-"}</td>
                  <td>{row.letter_no || "-"}</td>
                  <td>{row.ref_Category_text || "-"}</td>
                  <td>{formatDate(row.letter_date)}</td>
                  <td>{formatDate(row.schedule_date)}</td>
                  <td>{row.tender_amt || "-"}</td>
                  <td>—</td>

                  <td className="d-flex align-items-center">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(row.ref_id)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(row.ref_id)}
                    >
                      Delete
                    </button>
                  </td>

                  <td className="text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  {loading ? "Loading..." : "No data found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            {getPageNumbers().map((page, index) => (
              <li
                key={index}
                className={`page-item ${
                  page === currentPage ? "active" : ""
                } ${page === "..." ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    page !== "..." && setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ForwardTo;

