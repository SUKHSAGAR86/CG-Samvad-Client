// // ========================================
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./button.css";
// import parse from "html-react-parser";

// const Report = () => {
//   const financial_year = localStorage.getItem("financial_year");
//   const user_id = localStorage.getItem("user_id");

//   const [action, setAction] = useState("get");
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   // CATEGORY STATES
//   const [category, setCategory] = useState("02");
//   const [categoryList, setCategoryList] = useState([]);

//   // Load Category
//   const loadCategory = async () => {
//     try {
//       const res = await axios.get("http://localhost:3080/api/createnewrequest");
//       const list = res.data?.data || res.data || [];
//       setCategoryList(list);
//     } catch (error) {
//       console.error("Category Load Error:", error);
//       setCategoryList([]);
//     }
//   };

//   useEffect(() => {
//     loadCategory();
//   }, []);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 20;

//   // Format Date (dd-mm-yyyy)
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Fetch Main Data
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         "http://localhost:3080/api/get-client-advt-request",
//         {
//           params: { financial_year, user_id, action, category },
//         }
//       );
//       console.log("aa:>", res.data?.data);
//       setData(res.data?.data || []);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();

//   }, [action, category]);

//   // -------------------------
//   // FILTER LOGIC (FINAL)
//   // -------------------------
//   const filteredData = data.filter((item) => {
//     // Search match
//     const searchMatch = (item.subject || "")
//       .toLowerCase()
//       .includes(search.toLowerCase());

//     // Convert both values to number
//     const refCat = Number(item.ref_Category_id);
//     const selectedCat = Number(category);

//     // Category match
//     const categoryMatch = category ? refCat === selectedCat : true;

//     // Action match
//     const actionMatch = action
//       ? String(item.action_type).toLowerCase() === String(action).toLowerCase()
//       : true;

//     return searchMatch && categoryMatch && actionMatch;
//   });

//   // Pagination
//   const indexOfLast = currentPage * recordsPerPage;
//   const indexOfFirst = indexOfLast - recordsPerPage;
//   //Sconst currentRows = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / recordsPerPage);

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
//       <div className="card shadow-lg p-4">
//         <h3 className="text-center mb-3">Client Advertisement Requests</h3>

//         <div className="row mb-3">
//           {/* Category Dropdown */}
//           <div className="col-md-3">
//             <label className="form-label fw-bold">Select Category</label>

//             <select
//               className="form-select"
//               value={category}
//               onChange={(e) => {
//                 setCategory(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="">------ Select Here ------</option>

//               {Array.isArray(categoryList) &&
//                 categoryList.map((item) => (
//                   <option key={item.cat_id} value={item.cat_id}>
//                     {item.cat_text.split("-")[0].trim()}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           {/* Action Dropdown */}
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Select Action</label>
//             <select
//               className="form-select"
//               value={action}
//               onChange={(e) => {
//                 setAction(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="get">Get All</option>
//               <option value="get_forwarded">Forwarded</option>
//               <option value="get_not_forwarded">Not Forwarded</option>
//               <option value="get_under_process">Under Process</option>
//               <option value="get_all_accepted">Accepted</option>
//               <option value="get_all_unaccepted">Unaccepted</option>
//             </select>
//           </div>

//           {/* Search */}
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Search (Subject)</label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setCurrentPage(1);
//               }}
//             />
//           </div>
//         </div>

//         {/* Message when action selected but category not selected */}
//         {action && !category && (
//           <div className="alert alert-warning text-center fw-bold">
//             Please select category to continue
//           </div>
//         )}

//         {loading && <div className="text-center">Loading...</div>}

//         {!loading && action && category && (
//           <div className="table-responsive">
//             <table className="table table-bordered  table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>Sn</th>
//                   <th>Ref ID</th>
//                   <th>Subject</th>
//                   <th>Tender Amount</th>
//                   <th>Letter No / Date</th>
//                   <th>Schedule Date</th>
//                   <th>Category</th>
//                   <th>Print On NP</th>
//                   <th>Attachment</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.length > 0 ? (
//                   data.map((item, idx) => (
//                       //  console.log(idx, item.count_attachment, typeof item.count_attachment),
//                     <tr
//                       key={idx}
//                       style={{
//                         backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "#ffffff",
//                       }}
//                     >
//                       <td>{indexOfFirst + idx + 1}</td>
//                       <td>{item.ref_id}</td>
//                       <td>{item.subject}</td>
//                       <td>{item.tender_amt}</td>

//                       <td className="text-center">
//                         {item.letter_no} / <br />
//                         {formatDate(item.letter_date)}
//                       </td>

//                       <td>{formatDate(item.schedule_date)}</td>

//                       <td>{item.ref_Category_text}</td>

//                       <td>
//                         National - {item.print_in_national_np} <br />
//                         State - {item.print_in_state_np} <br />
//                         Local - {item.print_in_local_np} <br />
//                         Others - {item.print_in_other_np}
//                       </td>

// <td>
//   {item.count_attachment
//     ? parse(String(item.count_attachment))
//     : "-"}
// </td>
//                       <td>{item.status}</td>

//                       <td>
//                         <span
//                           className="btn btn-warning btn-sm action-btn me-2"
//                           onClick={() => handleEdit(row.ref_id)}
//                         >
//                           Edit
//                         </span>

//                         <span
//                           className="btn btn-danger btn-sm action-btn"
//                           onClick={() => handleDelete(row.ref_id)}
//                         >
//                           Delete
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="11" className="text-center text-danger">
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
//       {action && category && (
//         <div className="d-flex justify-content-center mt-3">
//           <ul className="pagination">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage - 1)}
//               >
//                 Prev
//               </button>
//             </li>

//             {getPageNumbers().map((page, index) =>
//               page === "..." ? (
//                 <li key={index} className="page-item disabled">
//                   <span className="page-link">...</span>
//                 </li>
//               ) : (
//                 <li
//                   key={index}
//                   className={`page-item ${
//                     currentPage === page ? "active" : ""
//                   }`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(page)}
//                   >
//                     {page}
//                   </button>
//                 </li>
//               )
//             )}

//             <li
//               className={`page-item ${
//                 currentPage === totalPages ? "disabled" : ""
//               }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage(currentPage + 1)}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Report;

/// working code =========================



// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./button.css";
// import parse from "html-react-parser";

// const RECORDS_PER_PAGE = 20;

// const Report = () => {
//   const financial_year = localStorage.getItem("financial_year");
//   const user_id = localStorage.getItem("user_id");

//   const [action, setAction] = useState("get");
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Category
//   const [category, setCategory] = useState("02");
//   const [categoryList, setCategoryList] = useState([]);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);

//   /* -------------------- Utilities -------------------- */
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const d = new Date(dateStr);
//     return `${String(d.getDate()).padStart(2, "0")}-${String(
//       d.getMonth() + 1
//     ).padStart(2, "0")}-${d.getFullYear()}`;
//   };

//   /* -------------------- API Calls -------------------- */
//   const loadCategory = useCallback(async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3080/api/createnewrequest"
//       );
//       setCategoryList(res.data?.data || res.data || []);
//     } catch (err) {
//       console.error("Category Load Error:", err);
//       setCategoryList([]);
//     }
//   }, []);

//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "http://localhost:3080/api/get-client-advt-request",
//         {
//           params: { financial_year, user_id, action, category },
//         }
//       );
//       setData(res.data?.data || []);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [financial_year, user_id, action, category]);

//   useEffect(() => {
//     loadCategory();
//   }, [loadCategory]);

//   useEffect(() => {
//     if (action && category) {
//       fetchData();
//     }
//   }, [fetchData]);

//   /* -------------------- Filtering -------------------- */
//   // const filteredData = useMemo(() => {
//   //   return data.filter((item) => {
//   //     const subjectMatch = (item.subject || "")
//   //       .toLowerCase()
//   //       .includes(search.toLowerCase());

//   //     const categoryMatch = category
//   //       ? Number(item.ref_Category_id) === Number(category)
//   //       : true;

//   //     const actionMatch = action
//   //       ? String(item.action_type).toLowerCase() ===
//   //         String(action).toLowerCase()
//   //       : true;

//   //     return subjectMatch && categoryMatch && actionMatch;
//   //   });
//   // }, [data, search, category, action]);



//   const filteredData = useMemo(() => {
//   return data.filter((item) => {
//     const ref_idMatch = (item.ref_id || "")
//       .toLowerCase()
//       .includes(search.toLowerCase());

//     const categoryMatch = category
//       ? Number(item.ref_Category_id) === Number(category)
//       : true;

//     return ref_idMatch&& categoryMatch;
//   });
// }, [data, search, category]);

//   /* -------------------- Pagination -------------------- */
//   const totalPages = Math.ceil(filteredData.length / RECORDS_PER_PAGE);

//   const currentRows = useMemo(() => {
//     const start = (currentPage - 1) * RECORDS_PER_PAGE;
//     return filteredData.slice(start, start + RECORDS_PER_PAGE);
//   }, [filteredData, currentPage]);

//   const getPageNumbers = () => {
//     const pages = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1);
//       if (currentPage > 3) pages.push("...");
//       for (
//         let i = Math.max(2, currentPage - 1);
//         i <= Math.min(totalPages - 1, currentPage + 1);
//         i++
//       ) {
//         pages.push(i);
//       }
//       if (currentPage < totalPages - 2) pages.push("...");
//       pages.push(totalPages);
//     }
//     return pages;
//   };

//   /* -------------------- Actions -------------------- */
//   const handleEdit = (id) => {
//     console.log("Edit:", id);
//   };

//   const handleDelete = (id) => {
//     console.log("Delete:", id);
//   };

//   /* -------------------- JSX -------------------- */
//   return (
//     <div className="container mt-4">
//       <div className="card shadow-lg p-4">
//         <h3 className="text-center mb-3">Client Advertisement Requests</h3>

//         {/* Filters */}
//         <div className="row mb-3">
//           <div className="col-md-3">
//             <label className="fw-bold">Select Category</label>
//             <select
//               className="form-select"
//               value={category}
//               onChange={(e) => {
//                 setCategory(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="">------ Select Here ------</option>
//               {categoryList.map((c) => (
//                 <option key={c.cat_id} value={c.cat_id}>
//                   {c.cat_text?.split("-")[0]}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-4">
//             <label className="fw-bold">Select Action</label>
//             <select
//               className="form-select"
//               value={action}
//               onChange={(e) => {
//                 setAction(e.target.value);
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="get">Get All</option>
//               <option value="get_forwarded">Forwarded</option>
//               <option value="get_not_forwarded">Not Forwarded</option>
//               <option value="get_under_process">Under Process</option>
//               <option value="get_all_accepted">Accepted</option>
//               <option value="get_all_unaccepted">Unaccepted</option>
//             </select>
//           </div>

//           <div className="col-md-4">
//             <label className="fw-bold">Search (Reference ID)</label>
//             <input
//               className="form-control"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setCurrentPage(1);
//               }}
//             />
//           </div>
//         </div>

//         {loading && <div className="text-center">Loading...</div>}

//         {!loading && currentRows.length === 0 && (
//           <div className="alert alert-danger text-center">
//             No data available
//           </div>
//         )}

//         {!loading && currentRows.length > 0 && (
//           <div className="table-responsive">
//             <table className="table table-bordered table-striped">
//               <thead className="table-dark">
//                 <tr>


//                   <th>Sn</th>
//                   <th>Ref ID</th>
//                   <th>Subject</th>
//                   <th>Tender Amount</th>
//                   <th>Letter No/ <br/>Date</th>
//                   <th>Schedule Date</th>
//                   <th>Category</th>
//                   <th>Print On NP</th>
//                   <th>Attachment</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRows.map((item, idx) => (
//                   <tr key={item.ref_id}>
//                     <td>{(currentPage - 1) * RECORDS_PER_PAGE + idx + 1}</td>
//                     <td>{item.ref_id}</td>
//                     <td>{item.subject}</td>
//                     <td>{item.tender_amt}</td>
//                     <td className="text-center">
//                       {item.letter_no} <br />
//                       {formatDate(item.letter_date)}
//                     </td>
//                     <td>{formatDate(item.schedule_date)}</td>
//                     <td>{item.ref_Category_text}</td>
//                     <td>
//                       National - {item.print_in_national_np}
//                       <br />
//                       State - {item.print_in_state_np}
//                       <br />
//                       Local - {item.print_in_local_np}
//                       <br />
//                       Others - {item.print_in_other_np}
//                     </td>
//                     <td>
//                       {item.count_attachment
//                         ? parse(String(item.count_attachment))
//                         : "-"}
//                     </td>
//                     <td>{item.status}</td>
//                     <td>
//                       <button
//                         className="btn btn-warning btn-sm me-2"
//                         onClick={() => handleEdit(item.ref_id)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => handleDelete(item.ref_id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="d-flex justify-content-center mt-3">
//           <ul className="pagination">
//             <li className={`page-item ${currentPage === 1 && "disabled"}`}>
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage((p) => p - 1)}
//               >
//                 Prev
//               </button>
//             </li>

//             {getPageNumbers().map((p, i) =>
//               p === "..." ? (
//                 <li key={i} className="page-item disabled">
//                   <span className="page-link">...</span>
//                 </li>
//               ) : (
//                 <li
//                   key={i}
//                   className={`page-item ${currentPage === p && "active"}`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(p)}
//                   >
//                     {p}
//                   </button>
//                 </li>
//               )
//             )}

//             <li
//               className={`page-item ${
//                 currentPage === totalPages && "disabled"
//               }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => setCurrentPage((p) => p + 1)}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Report;


// ==================second solution=====================




import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./button.css";
import parse from "html-react-parser";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";


const RECORDS_PER_PAGE = 20;

const Report = () => {
  const financial_year = localStorage.getItem("financial_year");
  const user_id = localStorage.getItem("user_id");

  const [action, setAction] = useState("get");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Category
  const [category, setCategory] = useState("02");
  const [categoryList, setCategoryList] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  /* -------------------- Utilities -------------------- */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  /* -------------------- API Calls -------------------- */
  const loadCategory = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:3080/api/createnewrequest"
      );
      setCategoryList(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Category Load Error:", err);
      setCategoryList([]);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3080/api/get-client-advt-request",
        {
          params: { financial_year, user_id, action, category },
        }
      );
      setData(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [financial_year, user_id, action, category]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  useEffect(() => {
    if (action && category) {
      fetchData();
    }
  }, [fetchData]);

 //================filter recored==================
  const filteredData = useMemo(() => {
  return data.filter((item) => {
    const ref_idMatch = (item.ref_id || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch = category
      ? Number(item.ref_Category_id) === Number(category)
      : true;

    return ref_idMatch&& categoryMatch;
  });
}, [data, search, category]);

//===========export record==============
const getCurrentPageExportData = () =>
  currentRows.map((item, index) => ({
    "Sn": (currentPage - 1) * RECORDS_PER_PAGE + index + 1,
    "Ref ID": item.ref_id,
    "Subject": item.subject,
    "Tender Amount": item.tender_amt,
    "Letter No": item.letter_no,
    "Letter Date": formatDate(item.letter_date),
    "Schedule Date": formatDate(item.schedule_date),
    "Category": item.ref_Category_text,
    "National NP": item.print_in_national_np,
    "State NP": item.print_in_state_np,
    "Local NP": item.print_in_local_np,
    "Other NP": item.print_in_other_np,
    "Status": item.status,
  }));

// Excel formate
const exportCurrentPageExcel = () => {
  if (currentRows.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(
    getCurrentPageExportData()
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    `Page_${currentPage}`
  );

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([buffer], {
    type: "application/octet-stream",
  });

  saveAs(
    blob,
    `Client_Advt_Request_Page_${currentPage}.xlsx`
  );
};


// Pdf Formate
const exportCurrentPagePDF = () => {
  if (!currentRows || currentRows.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(14);
  doc.text(
    `Client Advertisement Requests (Page ${currentPage})`,
    14,
    15
  );

  const columns = [
    "Sn",
    "Ref ID",
    "Subject",
    "Tender",
    "Letter Date",
    "Schedule Date",
    "Category",
    "Status",
  ];

  const rows = currentRows.map((item, index) => [
    (currentPage - 1) * RECORDS_PER_PAGE + index + 1,
    item.ref_id || "",
    item.subject || "",
    item.tender_amt || "",
    formatDate(item.letter_date),
    formatDate(item.schedule_date),
    item.ref_Category_text || "",
    item.status || "",
  ]);

  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 22,
    styles: { fontSize: 8 },
    theme: "grid",
  });

  doc.save(`Client_Advt_Request_Page_${currentPage}.pdf`);
};







  /* -------------------- Pagination -------------------- */
  const totalPages = Math.ceil(filteredData.length / RECORDS_PER_PAGE);

  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * RECORDS_PER_PAGE;
    return filteredData.slice(start, start + RECORDS_PER_PAGE);
  }, [filteredData, currentPage]);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  /* -------------------- Actions -------------------- */
  const handleEdit = (id) => {
    console.log("Edit:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  /* -------------------- JSX -------------------- */
  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-3">Client Advertisement Requests</h3>

        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="fw-bold">Select Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">------ Select Here ------</option>
              {categoryList.map((c) => (
                <option key={c.cat_id} value={c.cat_id}>
                  {c.cat_text?.split("-")[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="fw-bold">Select Action</label>
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

          <div className="col-md-4">
            <label className="fw-bold">Search (Reference ID)</label>
            <input
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

        {/* =====================export button */}

        <div className="d-flex justify-content-end gap-2 mb-3">
  <button
    className="btn btn-success btn-sm"
    onClick={exportCurrentPageExcel}
  >
    Export Current Page (Excel)
  </button>

<button
  className="btn btn-danger btn-sm"
  onClick={exportCurrentPagePDF}
>
  Export Current Page (PDF)
</button>

</div>
{/* ======================== */}

        {loading && <div className="text-center">Loading...</div>}

        {!loading && currentRows.length === 0 && (
          <div className="alert alert-danger text-center">
            No data available
          </div>
        )}

        {!loading && currentRows.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>


                  <th>Sn</th>
                  <th>Ref ID</th>
                  <th>Subject</th>
                  <th>Tender Amount</th>
                  <th>Letter No/ <br/>Date</th>
                  <th>Schedule Date</th>
                  <th>Category</th>
                  <th>Print On NP</th>
                  <th>Attachment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item, idx) => (
                  <tr key={item.ref_id}>
                    <td>{(currentPage - 1) * RECORDS_PER_PAGE + idx + 1}</td>
                    <td>{item.ref_id}</td>
                    <td>{item.subject}</td>
                    <td>{item.tender_amt}</td>
                    <td className="text-center">
                      {item.letter_no} <br />
                      {formatDate(item.letter_date)}
                    </td>
                    <td>{formatDate(item.schedule_date)}</td>
                    <td>{item.ref_Category_text}</td>
                    <td>
                      National - {item.print_in_national_np}
                      <br />
                      State - {item.print_in_state_np}
                      <br />
                      Local - {item.print_in_local_np}
                      <br />
                      Others - {item.print_in_other_np}
                    </td>
                    <td>
                      {item.count_attachment
                        ? parse(String(item.count_attachment))
                        : "-"}
                    </td>
                    <td>{item.status}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(item.ref_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.ref_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
            </li>

            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <li key={i} className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              ) : (
                <li
                  key={i}
                  className={`page-item ${currentPage === p && "active"}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                </li>
              )
            )}

            <li
              className={`page-item ${
                currentPage === totalPages && "disabled"
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p + 1)}
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
