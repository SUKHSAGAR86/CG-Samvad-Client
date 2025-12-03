import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/newsRateList.css"

const NewsRatesList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔵 PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3080/api/get-news-rate");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Export to Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    let ws_data = [];

    data.forEach((np) => {
      np.rates.forEach((r, idx) => {
        ws_data.push({
          "Sr No.": np.sr_no,
          "NP Name": np.NP,
          "Sno": idx + 1,
          "Category": r.rate_category_name,
          "CC Rate ₹": r.cc_rate,
          "SC Rate ₹": r.sc_rate,
          "Circulation": r.no_of_circulation,
          "From Date": r.from_date,
          "To Date": r.to_date,
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "NewspaperRates");
    XLSX.writeFile(wb, "NewspaperRates.xlsx");
  };

  // 🔵 PAGINATION LOGIC
  const totalPages = Math.ceil(data.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);

  // Generate button numbers
const getPageNumbers = () => {
  let pages = [];

  // Always show first page
  pages.push(1);

  if (currentPage > 3) pages.push("...");

  // Middle sliding window
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push("...");

  // Always show last page (only if > 1)
  if (totalPages > 1) pages.push(totalPages);

  // 🔥 Remove duplicates
  pages = [...new Set(pages)];

  return pages;
};

  return (
    <div className="container mt-4" >

        <h3 className=" text-center fw-bold p-2 rounded mb-5" style={{backgroundColor:"#D1A980", color:"#313647"}}>  News Paper Rate List</h3>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 ">
        
        
        <div
          className="px-3 py-1 fw-bold text-white"
          style={{
            backgroundColor: "#00bcd4",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          Total&nbsp;&nbsp;{data.length}
        </div>
        <div
          className="d-flex align-items-center btn btn-outline-success"
          style={{ cursor: "pointer" }}
          onClick={exportToExcel}
        >
          <img
            src="https://img.icons8.com/color/48/microsoft-excel-2019--v1.png"
            alt="Excel"
            width="35"
            height="35"
          />
          <span className="  ms-2 fw-semibold">Click to export data</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive shadow-sm border rounded">
          
            <table
              className="table table-bordered table-container"
              style={{
                fontSize: "14px",
                borderCollapse: "collapse",
                backgroundColor: "#f9ffff",     
                position: "fixed !important",
  
              }}
            >
              <thead className="table-header">
                <tr className="text-center ">
                  <th style={{ width: "5%" }}>Sr No.</th>
                  <th style={{ width: "25%" }}>News Paper Name</th>
                  <th style={{ width: "5%" }}>Sno</th>
                  <th style={{ width: "15%" }}>Category</th>
                  <th style={{ width: "10%" }}>CC Rate ₹</th>
                  <th style={{ width: "10%" }}>SC Rate ₹</th>
                  <th style={{ width: "10%" }}>Circulation</th>
                  <th style={{ width: "10%" }}>From Date</th>
                  <th style={{ width: "10%" }}>To Date</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((np, idx) => (
                  <React.Fragment key={np.np_cd}>
                    {np.rates.map((r, i) => {
                      const bg = (idx + i) % 2 === 0 ? "#ffffff": "#DCDCDC";
                      const bg1 = idx % 2 === 0 ?  "#ffffff": "#DCDCDC";

                      return (
                        <tr key={i} className="custom-row-border">
                          {i === 0 && (
                            <>
                              <td
                                rowSpan={np.rates.length}
                                className="text-center fw-bold"
                                style={{
                                  verticalAlign: "middle",
                                  backgroundColor: bg,
                                }}
                              >
                                {np.sr_no}
                              </td>

                              <td
                                rowSpan={np.rates.length}
                                className="fw-bold text-dark text-center fs-6"
                                style={{
                                  verticalAlign: "middle",
                                  backgroundColor: bg,
                                  fontWeight:"bold"
                                }}
                              >
                                {np.NP}
                              </td>
                            </>
                          )}

                          <td className="text-center" style={{ backgroundColor: bg1 }}>
                            {i + 1}
                          </td>

                          <td style={{ backgroundColor: bg1 }}>
                            {r.rate_category_name}
                          </td>

                          <td className="text-end" style={{ backgroundColor: bg1 }}>
                            {r.cc_rate}
                          </td>

                          <td className="text-end" style={{ backgroundColor: bg1 }}>
                            {r.sc_rate}
                          </td>

                          <td className="text-end" style={{ backgroundColor: bg1 }}>
                            {r.no_of_circulation}
                          </td>

                          <td className="text-center" style={{ backgroundColor: bg1 }}>
                            {r.from_date}
                          </td>

                          <td className="text-center" style={{ backgroundColor: bg1 }}>
                            {r.to_date}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔵 PAGINATION */}
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Prev
                  </button>
                </li>

                {getPageNumbers().map((num, index) =>
                  num === "..." ? (
                    <li key={index} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  ) : (
                    <li
                      key={index}
                      className={`page-item ${num === currentPage ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    </li>
                  )
                )}

                <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default NewsRatesList;
