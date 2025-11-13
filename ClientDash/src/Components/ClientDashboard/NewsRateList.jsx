
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const NewsRatesList = () => {
//   const [newspapers, setNewspapers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 5;
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState({});

//   useEffect(() => {
//     fetchNewspaperRates();
//   }, []);

//   const fetchNewspaperRates = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:3080/api/get-news-rate");
//       setNewspapers(res.data);
//     } catch (error) {
//       console.error("Error fetching newspaper rates:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleExpand = (np_cd) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [np_cd]: !prev[np_cd],
//     }));
//   };

//   // Pagination Logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = newspapers.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(newspapers.length / recordsPerPage);

//   return (
//     <div className="container mt-4">
//       <h4 className="text-center fw-bold mb-4 text-primary">
//         📰 Active Newspapers & Rate Details
//       </h4>

//       {loading ? (
//         <div className="text-center my-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover align-middle shadow-sm">
//               <thead className="table-primary text-center">
//                 <tr>
//                   <th style={{ width: "5%" }}>Sr.No</th>
//                   <th style={{ width: "30%" }}>Newspaper</th>
//                   <th style={{ width: "10%" }}>Total Rates</th>
//                   <th style={{ width: "10%" }}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRecords.map((np, index) => (
//                   <React.Fragment key={np.np_cd}>
//                     <tr
//                       className={`text-center ${
//                         index % 2 === 0 ? "table-light" : "table-white"
//                       }`}
//                     >
//                       <td>{np.sr_no}</td>
//                       <td className="text-start fw-semibold">{np.NP}</td>
//                       <td>{np.rates.length}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => toggleExpand(np.np_cd)}
//                         >
//                           {expanded[np.np_cd] ? "Hide" : "View"}
//                         </button>
//                       </td>
//                     </tr>

//                     {expanded[np.np_cd] && (
//                       <tr>
//                         <td colSpan="4" className="p-0">
//                           <div className="p-3 bg-light border-top">
//                             <h6 className="fw-bold text-secondary mb-2">
//                               Rate Details
//                             </h6>
//                             <div className="table-responsive">
//                               <table className="table table-sm table-bordered">
//                                 <thead className="table-secondary text-center">
//                                   <tr>
//                                     <th>Rate Code</th>
//                                     <th>Circulation</th>
//                                     <th>CC Rate</th>
//                                     <th>SC Rate</th>
//                                     <th>Category</th>
//                                     <th>From</th>
//                                     <th>To</th>
//                                     <th>Remark</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {np.rates.length > 0 ? (
//                                     np.rates.map((r, i) => (
//                                       <tr
//                                         key={i}
//                                         className={
//                                           i % 2 === 0 ? "table-light" : ""
//                                         }
//                                       >
//                                         <td>{r.rate_cd}</td>
//                                         <td>{r.no_of_circulation}</td>
//                                         <td>{r.cc_rate}</td>
//                                         <td>{r.sc_rate}</td>
//                                         <td>{r.rate_category_name}</td>
//                                         <td>{r.from_date}</td>
//                                         <td>{r.to_date}</td>
//                                         <td>{r.remark}</td>
//                                       </tr>
//                                     ))
//                                   ) : (
//                                     <tr>
//                                       <td colSpan="8" className="text-center">
//                                         No rate records found.
//                                       </td>
//                                     </tr>
//                                   )}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <nav>
//             <ul className="pagination justify-content-center">
//               <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                 <button
//                   className="page-link"
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                 >
//                   Previous
//                 </button>
//               </li>
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <li
//                   key={i + 1}
//                   className={`page-item ${
//                     currentPage === i + 1 ? "active" : ""
//                   }`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(i + 1)}
//                   >
//                     {i + 1}
//                   </button>
//                 </li>
//               ))}
//               <li
//                 className={`page-item ${
//                   currentPage === totalPages ? "disabled" : ""
//                 }`}
//               >
//                 <button
//                   className="page-link"
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                 >
//                   Next
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </>
//       )}
//     </div>
//   );
// };

// export default NewsRatesList;




import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";

const NewsRatesList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container-fluid mt-4" style={{ maxWidth: "1200px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div
          className="d-flex align-items-center text-primary"
          style={{ cursor: "pointer" }}
          onClick={exportToExcel}
        >
          <img
            src="https://img.icons8.com/color/48/microsoft-excel-2019--v1.png"
            alt="Excel"
            width="35"
            height="35"
          />
          <span className="ms-2 fw-semibold">Click to export data</span>
        </div>
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
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive shadow-sm border rounded">
          <table
            className="table table-bordered"
            style={{
              fontSize: "14px",
              borderCollapse: "collapse",
              backgroundColor: "#f9ffff",
            }}
          >
            <thead>
              <tr className="text-center align-middle" >
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "5%"}}>Sr No.</th>
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "25%"}}>NP Name</th>
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "5%" }}>Sno</th>
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "15%" }}>Category</th>
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "10%" }}>CC Rate ₹</th>
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "10%" }}>SC Rate ₹</th>
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "10%" }}>Circulation</th>
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "10%" }}>From Date</th>
                <th style={{ backgroundColor:"rgb(163, 72, 90)",width: "10%" }}>To Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((np, idx) => (
                <React.Fragment key={np.np_cd}>
                  {np.rates.map((r, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor:
                          idx % 2 === 0 ? "#e0f7fa" : "#ffffff",
                      }}
                    >
                      {i === 0 && (
                        <>
                          <td
                            rowSpan={np.rates.length}
                            className="text-center fw-bold"
                            style={{
                              verticalAlign: "middle",
                              borderRight: "2px solid #00bcd4",
                            }}
                          >
                            {np.sr_no}
                          </td>
                          <td
                            rowSpan={np.rates.length}
                            className="fw-semibold text-primary"
                            style={{
                              verticalAlign: "middle",
                              borderRight: "2px solid #00bcd4",
                            }}
                          >
                            {np.NP}
                          </td>
                        </>
                      )}
                      <td className="text-center">{i + 1}</td>
                      <td>{r.rate_category_name}</td>
                      <td className="text-end">{r.cc_rate}</td>
                      <td className="text-end">{r.sc_rate}</td>
                      <td className="text-end">{r.no_of_circulation}</td>
                      <td className="text-center">{r.from_date}</td>
                      <td className="text-center">{r.to_date}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NewsRatesList;
