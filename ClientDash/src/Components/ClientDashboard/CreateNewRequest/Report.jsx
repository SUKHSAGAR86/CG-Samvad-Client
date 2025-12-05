


// ==============================

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./Report.css"; // <-- Add this

// const Report = () => {
//   const financial_year = localStorage.getItem("financial_year");
//   const user_id = localStorage.getItem("user_id");

//   const [action, setAction] = useState("get");
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 20;

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         "http://localhost:3080/api/get-client-advt-request",
//         {
//           params: {
//             financial_year,
//             user_id,
//             action,
//           },
//         }
//       );

//       setData(res.data.data || []);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [action]);

//   // Search
//   const filteredData = data.filter((item) =>
//     (item.subject || "").toLowerCase().includes(search.toLowerCase())
//   );

//   // Pagination logic
//   const indexOfLast = currentPage * recordsPerPage;
//   const indexOfFirst = indexOfLast - recordsPerPage;
//   const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / recordsPerPage);

//   // Dynamic page links
//   const getPageNumbers = () => {
//     let pages = [];

//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1);

//       if (currentPage > 3) pages.push("...");

//       let start = Math.max(2, currentPage - 1);
//       let end = Math.min(totalPages - 1, currentPage + 1);

//       for (let i = start; i <= end; i++) pages.push(i);

//       if (currentPage < totalPages - 2) pages.push("...");

//       pages.push(totalPages);
//     }
//     return pages;
//   };

//   return (
//     <div className="container mt-4">

//       <div className="card card-modern p-4">
//         <h3 className="text-center mb-3 fw-bold">Client Advertisement Requests</h3>

//         {/* 🔵 Filter Bar */}
//         <div className="filter-bar">
//           <select
//             className="form-select filter-select"
//             value={action}
//             onChange={(e) => {
//               setAction(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="get_forwarded">Forwarded</option>
//             <option value="get_not_forwarded">Not Forwarded</option>
//             <option value="get_under_process">Under Process</option>
//             <option value="get_all_accepted">Accepted</option>
//             <option value="get_all_unaccepted">Unaccepted</option>
//           </select>

//           <input
//             type="text"
//             className="form-control filter-input"
//             placeholder="Search subject..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1);
//             }}
//           />

//           <button className="btn btn-primary px-4">Search</button>
//         </div>

//         {/* Loader */}
//         {loading && <div className="text-center">Loading...</div>}

//         {/* Table */}
//         {!loading && (
//           <div className="table-responsive mt-3">
//             <table className="table custom-table">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Ref ID</th>
//                   <th>Subject</th>
//                   <th>Client Code</th>
//                   <th>Tender Amount</th>
//                   <th>Letter No</th>
//                   <th>Letter Date</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentRows.length > 0 ? (
//                   currentRows.map((item, idx) => (
//                     <tr key={idx}>
//                       <td>{indexOfFirst + idx + 1}</td>
//                       <td>{item.ref_id}</td>
//                       <td>{item.subject}</td>
//                       <td>{item.client_cd}</td>
//                       <td>{item.tender_amt}</td>
//                       <td>{item.letter_no}</td>
//                       <td>{item.letter_date}</td>

//                       {/* 🔵 Status Badge */}
//                       <td>
//                         <span
//                           className={`status-badge ${
//                             item.status === "COMPLETED"
//                               ? "status-completed"
//                               : item.status === "IN PROGRESS"
//                               ? "status-progress"
//                               : "status-pending"
//                           }`}
//                         >
//                           {item.status || "PENDING"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center text-danger">
//                       No data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="d-flex justify-content-center mt-3">
//         <ul className="pagination">
//           <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//             <button
//               className="page-link"
//               onClick={() => setCurrentPage(currentPage - 1)}
//             >
//               Prev
//             </button>
//           </li>

//           {getPageNumbers().map((page, index) =>
//             page === "..." ? (
//               <li key={index} className="page-item disabled">
//                 <span className="page-link">...</span>
//               </li>
//             ) : (
//               <li
//                 key={index}
//                 className={`page-item ${currentPage === page ? "active" : ""}`}
//               >
//                 <button className="page-link" onClick={() => setCurrentPage(page)}>
//                   {page}
//                 </button>
//               </li>
//             )
//           )}

//           <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//             <button
//               className="page-link"
//               onClick={() => setCurrentPage(currentPage + 1)}
//             >
//               Next
//             </button>
//           </li>
//         </ul>
//       </div>

//     </div>
//   );
// };

// export default Report;





// ========================================
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./button.css"
const Report = () => {
  const financial_year = localStorage.getItem("financial_year");
  const user_id = localStorage.getItem("user_id");

  const [action, setAction] = useState("get");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // CATEGORY STATES
  const [category, setCategory] = useState("02");
  const [categoryList, setCategoryList] = useState([]);

  // Load Category
  const loadCategory = async () => {
    try {
      const res = await axios.get("http://localhost:3080/api/createnewrequest");
      const list = res.data?.data || res.data || [];
      setCategoryList(list);
    } catch (error) {
      console.error("Category Load Error:", error);
      setCategoryList([]);
    }
  };

  useEffect(() => {
    loadCategory();
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // Format Date (dd-mm-yyyy)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Fetch Main Data
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:3080/api/get-client-advt-request",
        {
          params: { financial_year, user_id, action,category},
        }
      );
console.log("aa:>",res.data?.data)
      setData(res.data?.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 fetchData();
  }, [action,category]);

  // -------------------------
  // FILTER LOGIC (FINAL)
  // -------------------------
  const filteredData = data.filter((item) => {
    // Search match
    const searchMatch = (item.subject || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    // Convert both values to number
    const refCat = Number(item.ref_Category_id);
    const selectedCat = Number(category);

    // Category match
    const categoryMatch = category ? refCat === selectedCat : true;

    // Action match
    const actionMatch = action
      ? String(item.action_type).toLowerCase() === String(action).toLowerCase()
      : true;

    return searchMatch && categoryMatch && actionMatch;
  });

  // Pagination
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  //Sconst currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const getPageNumbers = () => {
    let pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
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
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-3">Client Advertisement Requests</h3>

        <div className="row mb-3">
          {/* Category Dropdown */}
          <div className="col-md-3">
            <label className="form-label fw-bold">Select Category</label>

            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">------ Select Here ------</option>

              {Array.isArray(categoryList) &&
                categoryList.map((item) => (
                  <option key={item.cat_id} value={item.cat_id}>
                    {item.cat_text.split("-")[0].trim()}
                  </option>
                ))}
            </select>
          </div>

          {/* Action Dropdown */}
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
               <option value="get">Get All</option>
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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Message when action selected but category not selected */}
        {action && !category && (
          <div className="alert alert-warning text-center fw-bold">
            Please select category to continue
          </div>
        )}

        {loading && <div className="text-center">Loading...</div>}

        {!loading && action && category && (
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Sn</th>
                  <th>Ref ID</th>
                  <th>Subject</th>
                  <th>Tender Amount</th>
                  <th>Letter No / Date</th>
                  <th>Schedule Publish Date</th>
                  <th>Category</th>
                  <th>Print On NP</th>
                  <th>Attachment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
 <tbody>
                {data.length > 0 ? (
                  data.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor:
                          idx % 2 === 0 ? "#f8f9fa" : "#ffffff",
                      }}
                    >
                      <td>{indexOfFirst + idx + 1}</td>
                      <td>{item.ref_id}</td>
                      <td>{item.subject}</td>
                      <td>{item.tender_amt}</td>

                      <td className="text-center">
                        {item.letter_no} / <br />
                        {formatDate(item.letter_date)}
                      </td>

                      <td>{formatDate(item.schedule_date)}</td>

                      <td>{item.ref_Category_text}</td>

                      <td>
                        National - {item.print_in_national_np} <br />
                        State - {item.print_in_state_np} <br />
                        Local - {item.print_in_local_np} <br />
                        Others - {item.print_in_other_np}
                      </td>

                      <td>{item.reject_status}</td>
                      <td>{item.status}</td>

                      <td>
                        <span
    className="btn btn-warning btn-sm action-btn me-2"
    onClick={() => handleEdit(row.ref_id)}
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center text-danger">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody> 
              
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {action && category && (
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
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
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
      )}
    </div>
  );
};

export default Report;


