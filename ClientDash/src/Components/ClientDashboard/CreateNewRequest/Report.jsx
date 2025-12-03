import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Report = () => {
  const financial_year = localStorage.getItem("financial_year");
  const user_id = localStorage.getItem("user_id");

  const [action, setAction] = useState("get");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:3080/api/get-client-advt-request",
        {
          params: {
            financial_year,
            user_id,
            action,
          },
        }
      );

      console.log("API Response:", res.data);

      setData(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [action]);

  // Filtered data
  const filteredData = data.filter((item) =>
    (item.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="container mt-4">

      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-3">Client Advertisement Requests</h3>

        {/* Action Dropdown */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Select Action</label>
            <select
              className="form-select"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="get_forwarded">Forwarded</option>
              <option value="get_not_forwarded">Not Forwarded</option>
              <option value="get_under_process">Under Process</option>
              <option value="get_all_accepted">Accepted</option>
              <option value="get_all_unaccepted">Unaccepted</option>
            </select>
          </div>

          {/* Search */}
          <div className="col-md-4">
            <label className="form-label fw-bold">Search (Subject)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Loader */}
        {loading && <div className="text-center">Loading...</div>}

        {/* Table */}
        {!loading && (
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Ref ID</th>
                  <th>Subject</th>
                  <th>Client Code</th>
                  <th>Tender Amount</th>
                  <th>Letter No</th>
                  <th>Letter Date</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((item, idx) => (
                    <tr key={idx}>
                      <td>{indexOfFirst + idx + 1}</td>
                      <td>{item.ref_id}</td>
                      <td>{item.subject}</td>
                      <td>{item.client_cd}</td>
                      <td>{item.tender_amt}</td>
                      <td>{item.letter_no}</td>
                      <td>{item.letter_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-danger">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)} of{" "}
            {filteredData.length}
          </span>

          <div>
            <button
              className="btn btn-secondary me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            <button
              className="btn btn-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
