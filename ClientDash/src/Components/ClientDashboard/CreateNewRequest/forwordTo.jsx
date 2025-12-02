import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./gtt.css";
import { use } from "react";

const ForwardTo = () => {
  const financial_year = localStorage.getItem("financial_year");
  const user_id = localStorage.getItem("user_id");
    const user_name = localStorage.getItem("user_name");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const [data, setData] = useState([]);

  // =============Fetch All Requests (GET API)===================
  const fetchData = () => {
    axios
      .get("http://localhost:3080/api/get-client-advt-request", {
        params: {
          financial_year,
          user_id,
          user_name,
        },
      })
      .then((res) => {
        setData(res.data); // controller returns recordset directly
      })
      .catch((err) => console.error("Fetch Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============Edit Handler====================
  const handleEdit = async (ref_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3080/api/get-client-advt-request/${ref_id}`,
        {
          params: {
            financial_year,
            user_id,
            user_name,
          },
        }
      );

      const rowData = response.data;

      navigate("/", {
        state: {
          action: "update",
          rowData,
        },
      });
    } catch (error) {
      console.error("Edit Error:", error);
    }
  };

  // =================DELETE HANDLER ===============
  const handleDelete = async (ref_id) => {
    if (!window.confirm("Are you sure?")) return;

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

      if (res.data.status === 1) {
        setData((prev) => prev.filter((row) => row.ref_id !== ref_id));
        alert(`Deleted successfully (Ref ID: ${ref_id})`);
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Server error");
    }
  };

  //===================pagination-========================
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(data.length / recordsPerPage);

  // Generate Page Numbers
  const getPageNumbers = () => {
    let pages = [];

    if (totalPages <= 7) {
      // Show all pages if total <= 7
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show: 1 ... middle ... last
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="container p-4">
      <h4 className="text-danger text-center mb-3">
        <span>Forward To Samvad </span>
        <span className="bi bi-forward-fill text-danger"></span>
      </h4>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-custom table-bordered table-striped ">
          <thead>
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
            {currentRecords.map((row) => (
              <tr key={row.ref_id}>
                <td>{row.ref_id}</td>
                <td>{row.subject}</td>
                <td>{row.letter_no}</td>
                <td>{row.ref_Category_text}</td>
                <td>{formatDate(row.letter_date)}</td>
                <td>{formatDate(row.schedule_date)}</td>
                <td>{row.tender_amt}</td>
                <td>—</td>

                <td>
                  <span
                    className="btn btn-warning btn-sm action-btn me-2"
                    onClick={() => {
                      console.log("", row.ref_id);
                      handleEdit(row.ref_id);
                    }}
                  >
                    Edit
                  </span>

                  <span
                    className="btn btn-danger btn-sm action-btn"
                    onClick={() => handleDelete(row.ref_id)}
                  >
                    Delete
                  </span>
                </td>

                <td className="text-center">
                  <input className="form-check-input" type="checkbox" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ---------------- Pagination ---------------- */}
      <div className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
          </li>

          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <li key={index} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li
                key={index}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            )
          )}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ForwardTo;
