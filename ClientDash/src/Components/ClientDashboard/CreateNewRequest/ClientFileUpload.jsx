// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaTrash, FaDownload } from "react-icons/fa";

// const ClientFileUpload = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Extract state from navigation
//   const { ref_id, financial_year, categary, user_id, subject } = location.state || {};

//   const [file, setFile] = useState(null);
//   const [linkName, setLinkName] = useState("");
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(categary || "");

//   // ================= Fetch Categories =================
//   const fetchCategories = async () => {
//     if (!ref_id || !financial_year) return;
//     try {
//       const res = await axios.get(`http://localhost:3080/api/upload-categories`, {
//         params: { ref_id, financial_year },
//       });
//       const data = res.data.data || [];
//       setCategories(data);
//       if (data.length > 0 && !selectedCategory) setSelectedCategory(data[0].cat_cd);
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [ref_id, financial_year]);

//   // ================= Fetch Uploaded Files =================
//   const fetchFiles = async () => {
//     if (!ref_id || !financial_year || !selectedCategory) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:3080/api/files/${ref_id}/${financial_year}/${selectedCategory}`
//       );
//       setFileList(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, [ref_id, financial_year, selectedCategory]);

//   // ================= Handle Upload =================
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file || !linkName || !selectedCategory) {
//       alert("Please select category, enter Link Name and select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("ref_id", ref_id);
//     formData.append("financial_year", financial_year);
//     formData.append("categary_cd", selectedCategory);
//     formData.append("user_id", user_id);
//     formData.append("link_name", linkName);

//     setLoading(true);

//     try {
//       await axios.post("http://localhost:3080/api/post-files", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setShowModal(true);
//       setFile(null);
//       setLinkName("");
//       fetchFiles(); // refresh for selected category
//     } catch (err) {
//       alert(err.response?.data?.message || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= Delete File =================
//   const deleteFile = async (sno) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     setDeletingId(sno);
//     try {
//       await axios.delete(
//         `http://localhost:3080/api/files/${ref_id}/${financial_year}/${sno}`
//       );
//       fetchFiles();
//     } catch (err) {
//       console.error("Delete error:", err);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div className="container py-4">
//       {/* Modal */}
//       {showModal && (
//         <div
//           className="modal fade show d-block"
//           style={{ background: "rgba(0,0,0,0.6)" }}
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-success text-white">
//                 <h5 className="modal-title">Success</h5>
//               </div>
//               <div className="modal-body text-center">
//                 <h5>File Uploaded Successfully!</h5>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-success px-4"
//                   onClick={() => setShowModal(false)}
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header Info */}
//       <div className="card mb-3 shadow-sm">
//         <div className="card-header bg-primary text-white fw-bold">
//           Upload Client Files
//         </div>
//         <div className="p-3">
//           <p><b>Ref ID:</b> {ref_id}</p>
//           <p><b>Subject:</b> {subject}</p>
//           <p><b>Financial Year:</b> {financial_year}</p>
//           <p><b>User ID:</b> {user_id}</p>
//         </div>
//       </div>

//       {/* Upload Form */}
//       <form onSubmit={handleUpload} className="card p-4 shadow-sm mb-4">
//         <div className="row g-3">
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Category *</label>
//             <select
//               className="form-select"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               required
//             >
//               {categories.map((cat) => (
//                 <option key={cat.cat_cd} value={cat.cat_cd}>
//                   {cat.cat_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-4">
//             <label className="form-label fw-bold">Link Name *</label>
//             <input
//               type="text"
//               className="form-control"
//               value={linkName}
//               onChange={(e) => setLinkName(e.target.value)}
//               placeholder="Enter file title"
//               required
//             />
//           </div>

//           <div className="col-md-4">
//             <label className="form-label fw-bold">Choose File *</label>
//             <input
//               type="file"
//               className="form-control"
//               onChange={(e) => setFile(e.target.files[0])}
//               required
//             />
//           </div>

//           <div className="col-12 d-flex justify-content-end mt-3">
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Upload File"}
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* File List Table */}
//       <div className="card shadow-sm">
//         <div className="card-header bg-success text-white fw-bold">
//           Uploaded Files
//         </div>
//         <div className="card-body p-0 table-responsive">
//           <table className="table table-bordered table-striped mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Link Name</th>
//                 <th>File Name</th>
//                 <th className="text-center">Download</th>
//                 <th className="text-center">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fileList.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-3 text-danger">
//                     No files uploaded yet
//                   </td>
//                 </tr>
//               ) : (
//                 fileList.map((file, index) => (
//                   <tr key={file.sno}>
//                     <td>{index + 1}</td>
//                     <td>{file.link_name}</td>
//                     <td>{file.file_name}</td>
//                     <td className="text-center">
//                       <a
//                         href={`http://localhost:3080/uploads/${file.file_name}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-sm btn-outline-primary"
//                       >
//                         <FaDownload />
//                       </a>
//                     </td>
//                     <td className="text-center">
//                       <button
//                         className="btn btn-sm btn-danger"
//                         disabled={deletingId === file.sno}
//                         onClick={() => deleteFile(file.sno)}
//                       >
//                         {deletingId === file.sno ? "Deleting..." : <FaTrash />}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ClientFileUpload;
// =========================================



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaTrash, FaDownload } from "react-icons/fa";

// const ClientFileUpload = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { ref_id, financial_year, categary, user_id, subject } = location.state || {};

//   const [file, setFile] = useState(null);
//   const [linkName, setLinkName] = useState("");
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(categary || "");

//   const [letterUploaded, setLetterUploaded] = useState(false);

//   // Matter upload state
//   const [matterFile, setMatterFile] = useState(null);
//   const [matterLinkName, setMatterLinkName] = useState("");
//   const [matterCategoryCode, setMatterCategoryCode] = useState("");

//   // ================= Fetch Categories =================
//   const fetchCategories = async () => {
//     if (!ref_id || !financial_year) return;
//     try {
//       const res = await axios.get(`http://localhost:3080/api/upload-categories`, {
//         params: { ref_id, financial_year },
//       });
//       const data = res.data.data || [];
//       setCategories(data);

//       if (data.length > 0 && !selectedCategory) setSelectedCategory(data[0].cat_cd);

//       // Find Matter category code dynamically
//       const matterCat = data.find(cat => cat.cat_name.toLowerCase().includes("matter"));
//       if (matterCat) setMatterCategoryCode(matterCat.cat_cd);

//       // Check if Letter already uploaded
//       const letterCat = data.find(cat => cat.cat_name.toLowerCase().includes("letter"));
//       if (letterCat) {
//         const letterUploadedCheck = await axios.get(
//           `http://localhost:3080/api/files/${ref_id}/${financial_year}/${letterCat.cat_cd}`
//         );
//         setLetterUploaded(letterUploadedCheck.data.data.length > 0);
//       }
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [ref_id, financial_year]);

//   // ================= Fetch Uploaded Files =================
//   const fetchFiles = async () => {
//     if (!ref_id || !financial_year || !selectedCategory) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:3080/api/files/${ref_id}/${financial_year}/${selectedCategory}`
//       );
//       setFileList(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch files error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, [ref_id, financial_year, selectedCategory]);

//   // ================= Handle Letter Upload =================
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file || !linkName || !selectedCategory) {
//       console.log("Please select category, enter Link Name and select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("ref_id", ref_id);
//     formData.append("financial_year", financial_year);
//     formData.append("categary_cd", selectedCategory);
//     formData.append("user_id", user_id);
//     formData.append("link_name", linkName);

//     setLoading(true);

//     try {
//       await axios.post("http://localhost:3080/api/post-files", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setShowModal(true); // Show success modal
//       setFile(null);
//       setLinkName("");
//       fetchFiles();
//     } catch (err) {
//       console.error(err.response?.data?.message || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= Handle Matter Upload =================
//   const handleMatterUpload = async (e) => {
//     e.preventDefault();
//     if (!matterFile || !matterLinkName || !matterCategoryCode) {
//       console.log("Please enter Link Name and select a file for Matter");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", matterFile);
//     formData.append("ref_id", ref_id);
//     formData.append("financial_year", financial_year);
//     formData.append("categary_cd", matterCategoryCode);
//     formData.append("user_id", user_id);
//     formData.append("link_name", matterLinkName);

//     try {
//       await axios.post("http://localhost:3080/api/post-files", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setMatterFile(null);
//       setMatterLinkName("");
//       fetchFiles();
//       setShowModal(true); // Reuse modal for Matter upload success
//     } catch (err) {
//       console.error(err.response?.data?.message || "Upload failed");
//     }
//   };

//   // ================= Delete File =================
//   const deleteFile = async (sno) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     setDeletingId(sno);
//     try {
//       await axios.delete(
//         `http://localhost:3080/api/files/${ref_id}/${financial_year}/${sno}`
//       );
//       fetchFiles();
//     } catch (err) {
//       console.error("Delete error:", err);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div className="container py-4">
//       {/* Modal */}
//       {showModal && (
//         <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-success text-white">
//                 <h5 className="modal-title">Success</h5>
//               </div>
//               <div className="modal-body text-center">
//                 <h5>File Uploaded Successfully!</h5>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-success px-4"
//                   onClick={() => {
//                     setShowModal(false);

//                     // Show Matter form only if Letter uploaded
//                     const letterCat = categories.find(
//                       (cat) => cat.cat_name.toLowerCase().includes("letter")
//                     );
//                     if (letterCat && selectedCategory === letterCat.cat_cd) {
//                       setLetterUploaded(true);
//                     }
//                   }}
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header Info */}
//       <div className="card mb-3 shadow-sm">
//         <div className="card-header bg-primary text-white fw-bold">
//           Upload Client Files
//         </div>
//         <div className="p-3">
//           <p><b>Ref ID:</b> {ref_id}</p>
//           <p><b>Subject:</b> {subject}</p>
//           <p><b>Financial Year:</b> {financial_year}</p>
//           <p><b>User ID:</b> {user_id}</p>
//         </div>
//       </div>

//       {/* Upload Letter Form */}
//       <form onSubmit={handleUpload} className="card p-4 shadow-sm mb-4">
//         <div className="row g-3">
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Category *</label>
//             <select
//               className="form-select"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               required
//             >
//               {categories.map((cat) => (
//                 <option key={cat.cat_cd} value={cat.cat_cd}>
//                   {cat.cat_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-4">
//             <label className="form-label fw-bold">Link Name *</label>
//             <input
//               type="text"
//               className="form-control"
//               value={linkName}
//               onChange={(e) => setLinkName(e.target.value)}
//               placeholder="Enter file title"
//               required
//             />
//           </div>

//           <div className="col-md-4">
//             <label className="form-label fw-bold">Choose File *</label>
//             <input
//               type="file"
//               className="form-control"
//               onChange={(e) => setFile(e.target.files[0])}
//               required
//             />
//           </div>

//           <div className="col-12 d-flex justify-content-end mt-3">
//             <button type="submit" className="btn btn-primary" disabled={loading}>
//               {loading ? "Uploading..." : "Upload File"}
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* Upload Matter Form */}
//       {letterUploaded && matterCategoryCode && (
//         <form onSubmit={handleMatterUpload} className="card p-4 shadow-sm mb-4">
//           <h5 className="mb-3">Upload Matter</h5>
//           <div className="row g-3">
//             <div className="col-md-4">
//               <label className="form-label fw-bold">Link Name *</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={matterLinkName}
//                 onChange={(e) => setMatterLinkName(e.target.value)}
//                 placeholder="Enter file title"
//                 required
//               />
//             </div>

//             <div className="col-md-4">
//               <label className="form-label fw-bold">Choose File *</label>
//               <input
//                 type="file"
//                 className="form-control"
//                 onChange={(e) => setMatterFile(e.target.files[0])}
//                 required
//               />
//             </div>

//             <div className="col-12 d-flex justify-content-end mt-3">
//               <button type="submit" className="btn btn-success">
//                 Upload Matter
//               </button>
//             </div>
//           </div>
//         </form>
//       )}

//       {/* File List Table */}
//       <div className="card shadow-sm">
//         <div className="card-header bg-success text-white fw-bold">
//           Uploaded Files
//         </div>
//         <div className="card-body p-0 table-responsive">
//           <table className="table table-bordered table-striped mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Link Name</th>
//                 <th>File Name</th>
//                 <th className="text-center">Download</th>
//                 <th className="text-center">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fileList.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-3 text-danger">
//                     No files uploaded yet
//                   </td>
//                 </tr>
//               ) : (
//                 fileList.map((file, index) => (
//                   <tr key={file.sno}>
//                     <td>{index + 1}</td>
//                     <td>{file.link_name}</td>
//                     <td>{file.file_name}</td>
//                     <td className="text-center">
//                       <a
//                         href={`http://localhost:3080/uploads/${file.file_name}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-sm btn-outline-primary"
//                       >
//                         <FaDownload />
//                       </a>
//                     </td>
//                     <td className="text-center">
//                       <button
//                         className="btn btn-sm btn-danger"
//                         disabled={deletingId === file.sno}
//                         onClick={() => deleteFile(file.sno)}
//                       >
//                         {deletingId === file.sno ? "Deleting..." : <FaTrash />}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ClientFileUpload;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaTrash, FaDownload } from "react-icons/fa";

// const ClientFileUpload = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Destructure state passed via react-router-dom's navigate
//   const { ref_id, financial_year, categary, user_id, subject } = location.state || {};

//   // State for general file upload (used for categories other than Matter)
//   const [file, setFile] = useState(null);
//   const [linkName, setLinkName] = useState("");
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
//   const [showModal, setShowModal] = useState(false); // Success Modal

//   // Category and Letter-specific states
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(categary || "");
//   const [letterUploaded, setLetterUploaded] = useState(false);

//   // Matter upload state (only shown after Letter is uploaded)
//   const [matterFile, setMatterFile] = useState(null);
//   const [matterLinkName, setMatterLinkName] = useState("");
//   const [matterCategoryCode, setMatterCategoryCode] = useState("");

//   // ================= Fetch Categories and Check Letter Upload Status =================
//   const fetchCategories = async () => {
//     if (!ref_id || !financial_year) return;
//     try {
//       const res = await axios.get(`http://localhost:3080/api/upload-categories`, {
//         params: { ref_id, financial_year },
//       });
//       const data = res.data.data || [];
//       setCategories(data);

//       // 1. Set default selected category if none is set
//       if (data.length > 0 && !selectedCategory) setSelectedCategory(data[0].cat_cd);

//       // 2. Find Matter category code dynamically
//       const matterCat = data.find(cat => cat.cat_name.toLowerCase().includes("matter"));
//       if (matterCat) setMatterCategoryCode(matterCat.cat_cd);

//       // 3. Check if Letter has already been uploaded (Crucial for Matter form visibility)
//       const letterCat = data.find(cat => cat.cat_name.toLowerCase().includes("letter"));
//       if (letterCat) {
//         const letterUploadedCheck = await axios.get(
//           `http://localhost:3080/api/files/${ref_id}/${financial_year}/${letterCat.cat_cd}`
//         );
//         // If files exist in the 'Letter' category, set letterUploaded to true
//         setLetterUploaded(letterUploadedCheck.data.data.length > 0);
//       }
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, [ref_id, financial_year]);

//   // ================= Fetch Uploaded Files for the Current Category =================
//   const fetchFiles = async () => {
//     if (!ref_id || !financial_year || !selectedCategory) return;
//     try {
//       const res = await axios.get(
//         `http://localhost:3080/api/files/${ref_id}/${financial_year}/${selectedCategory}`
//       );
//       setFileList(res.data.data || []);
//     } catch (err) {
//       console.error("Fetch files error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, [ref_id, financial_year, selectedCategory]);

//   // ================= Handle General File Upload (Including Letter) =================
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file || !linkName || !selectedCategory) {
//       console.log("Please select category, enter Link Name and select a file");
//       return;
//     }
    
//     // Check if the current upload is a 'Letter'
//     const letterCat = categories.find(cat => cat.cat_name.toLowerCase().includes("letter"));
//     const isLetterUpload = letterCat && selectedCategory === letterCat.cat_cd;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("ref_id", ref_id);
//     formData.append("financial_year", financial_year);
//     formData.append("categary_cd", selectedCategory);
//     formData.append("user_id", user_id);
//     formData.append("link_name", linkName);

//     setLoading(true);

//     try {
//       await axios.post("http://localhost:3080/api/post-files", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setShowModal(true); // Show success modal
//       setFile(null);
//       setLinkName("");
//       fetchFiles();

//       // 🌟 CRITICAL FIX: If a Letter was uploaded, re-fetch categories to update the 
//       // letterUploaded state, which will render the Upload Matter form.
//       if (isLetterUpload) {
//         await fetchCategories();
//       }
      
//     } catch (err) {
//       console.error(err.response?.data?.message || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= Handle Matter Upload =================
//   const handleMatterUpload = async (e) => {
//     e.preventDefault();
//     if (!matterFile || !matterLinkName || !matterCategoryCode) {
//       console.log("Please enter Link Name and select a file for Matter");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", matterFile);
//     formData.append("ref_id", ref_id);
//     formData.append("financial_year", financial_year);
//     formData.append("categary_cd", matterCategoryCode);
//     formData.append("user_id", user_id);
//     formData.append("link_name", matterLinkName);

//     try {
//       await axios.post("http://localhost:3080/api/post-files", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setMatterFile(null);
//       setMatterLinkName("");
//       fetchFiles(); // Re-fetch files to update the list for the currently selected category
//       setShowModal(true); // Reuse modal for Matter upload success
//     } catch (err) {
//       console.error(err.response?.data?.message || "Upload failed");
//     }
//   };

//   // ================= Delete File =================
//   const deleteFile = async (sno) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     setDeletingId(sno);
//     try {
//       await axios.delete(
//         `http://localhost:3080/api/files/${ref_id}/${financial_year}/${sno}`
//       );
//       fetchFiles(); // Re-fetch files to update the list
//       // 💡 If the deleted file was the only 'Letter' file, you might want to call 
//       // fetchCategories() here too to hide the Matter form, but we'll stick to the 
//       // original requirement of just deleting the file.
//     } catch (err) {
//       console.error("Delete error:", err);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div className="container py-4">
//       {/* 🟢 Success Modal */}
//       {showModal && (
//         <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-success text-white">
//                 <h5 className="modal-title">Success</h5>
//               </div>
//               <div className="modal-body text-center">
//                 <h5>File Uploaded Successfully!</h5>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   className="btn btn-success px-4"
//                   onClick={() => setShowModal(false)}
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ℹ️ Header Info */}
//       <div className="card mb-3 shadow-sm">
//         <div className="card-header bg-primary text-white fw-bold">
//           Upload Client Files
//         </div>
//         <div className="p-3">
//           <p><b>Ref ID:</b> {ref_id}</p>
//           <p><b>Subject:</b> {subject}</p>
//           <p><b>Financial Year:</b> {financial_year}</p>
//           <p><b>User ID:</b> {user_id}</p>
//         </div>
//       </div>

//       <hr />

//       {/* 📁 General Upload Form (for Letter and other categories) */}
//       <form onSubmit={handleUpload} className="card p-4 shadow-sm mb-4">
//         <h5 className="mb-3 text-primary">Upload File</h5>
//         <div className="row g-3">
//           <div className="col-md-4">
//             <label className="form-label fw-bold">Category *</label>
//             <select
//               className="form-select"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               required
//             >
//               {/* Ensure a default category is selected */}
//               {categories.map((cat) => (
//                 <option key={cat.cat_cd} value={cat.cat_cd}>
//                   {cat.cat_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-4">
//             <label className="form-label fw-bold">Link Name *</label>
//             <input
//               type="text"
//               className="form-control"
//               value={linkName}
//               onChange={(e) => setLinkName(e.target.value)}
//               placeholder="Enter file title"
//               required
//             />
//           </div>

//           <div className="col-md-4">
//             <label className="form-label fw-bold">Choose File *</label>
//             <input
//               type="file"
//               className="form-control"
//               onChange={(e) => setFile(e.target.files[0])}
//               required
//             />
//           </div>

//           <div className="col-12 d-flex justify-content-end mt-3">
//             <button type="submit" className="btn btn-primary" disabled={loading}>
//               {loading ? "Uploading..." : "Upload File"}
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* 📄 Upload Matter Form (Conditional Display) */}
//       {/* This form appears when letterUploaded is true AND the Matter category code is found */}
//       {letterUploaded && matterCategoryCode && (
//         <>
//           <hr />
//           <form onSubmit={handleMatterUpload} className="card p-4 shadow-sm mb-4 border-success">
//             <h5 className="mb-3 text-success">Upload Matter (Letter already uploaded)</h5>
//             <div className="row g-3">
//               <div className="col-md-4">
//                 <label className="form-label fw-bold">Category</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={categories.find(cat => cat.cat_cd === matterCategoryCode)?.cat_name || "Matter"}
//                   disabled
//                 />
//               </div>
//               <div className="col-md-4">
//                 <label className="form-label fw-bold">Link Name *</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={matterLinkName}
//                   onChange={(e) => setMatterLinkName(e.target.value)}
//                   placeholder="Enter file title for Matter"
//                   required
//                 />
//               </div>

//               <div className="col-md-4">
//                 <label className="form-label fw-bold">Choose File *</label>
//                 <input
//                   type="file"
//                   className="form-control"
//                   onChange={(e) => setMatterFile(e.target.files[0])}
//                   required
//                 />
//               </div>

//               <div className="col-12 d-flex justify-content-end mt-3">
//                 <button type="submit" className="btn btn-success">
//                   Upload Matter
//                 </button>
//               </div>
//             </div>
//           </form>
//           <hr />
//         </>
//       )}

//       {/* 📋 File List Table */}
//       <div className="card shadow-sm">
//         <div className="card-header bg-secondary text-white fw-bold">
//           Uploaded Files (Category: {categories.find(cat => cat.cat_cd === selectedCategory)?.cat_name || 'Loading...'})
//         </div>
//         <div className="card-body p-0 table-responsive">
//           <table className="table table-hover table-bordered table-striped mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>#</th>
//                 <th>Link Name</th>
//                 <th>Categary Name</th>
//                 <th>File Name</th>
//                 <th className="text-center">Download</th>
//                 <th className="text-center">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fileList.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-3 text-danger">
//                     No files uploaded yet for this category.
//                   </td>
//                 </tr>
//               ) : (
//                 fileList.map((file, index) => (
//                   <tr key={file.sno}>
//                     <td>{index + 1}</td>
//                     <td>{file.link_name}</td>
//                     <td>{file.file_name}</td>
//                     <td className="text-center">
//                       <a
//                         href={`http://localhost:3080/uploads/${file.file_name}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="btn btn-sm btn-outline-primary"
//                       >
//                         <FaDownload />
//                       </a>
//                     </td>
//                     <td className="text-center">
//                       <button
//                         className="btn btn-sm btn-danger"
//                         disabled={deletingId === file.sno}
//                         onClick={() => deleteFile(file.sno)}
//                       >
//                         {deletingId === file.sno ? "Deleting..." : <FaTrash />}
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="text-center mt-4">
//         <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ClientFileUpload;




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash, FaDownload } from "react-icons/fa";

const ClientFileUpload = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { ref_id, financial_year, categary, user_id, subject } = state || {};

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categary || "");
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState(null);
  const [linkName, setLinkName] = useState("");
  const [loading, setLoading] = useState(false);

  // Matter Upload Section
  const [matterCategoryCode, setMatterCategoryCode] = useState("");
  const [letterUploaded, setLetterUploaded] = useState(false);
  const [matterFile, setMatterFile] = useState(null);
  const [matterLinkName, setMatterLinkName] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    if (!ref_id || !financial_year) return;

    try {
      const res = await axios.get("http://localhost:3080/api/upload-categories", {
        params: { ref_id, financial_year },
      });

      const data = res.data.data || [];
      setCategories(data);

      if (!selectedCategory && data.length > 0) {
        setSelectedCategory(data[0].cat_cd);
      }

      const matter = data.find((c) =>
        c.cat_name.toLowerCase().includes("matter")
      );
      if (matter) setMatterCategoryCode(matter.cat_cd);

      const letter = data.find((c) =>
        c.cat_name.toLowerCase().includes("letter")
      );

      if (letter) {
        const check = await axios.get(
          `http://localhost:3080/api/files/${ref_id}/${financial_year}/${letter.cat_cd}`
        );
        setLetterUploaded(check.data.data.length > 0);
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- FETCH FILES ----------------
  const fetchFiles = async () => {
    if (!selectedCategory) return;

    try {
      const res = await axios.get(
        `http://localhost:3080/api/files/${ref_id}/${financial_year}/${selectedCategory}`
      );
      setFileList(res.data.data || []);
    } catch (err) {
      console.error("Fetch files error:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedCategory]);

  // ---------------- UPLOAD GENERAL FILE (LETTER + OTHERS) ----------------
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !linkName || !selectedCategory) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ref_id", ref_id);
    formData.append("financial_year", financial_year);
    formData.append("categary_cd", selectedCategory);
    formData.append("user_id", user_id);
    formData.append("link_name", linkName);

    setLoading(true);

    try {
      await axios.post("http://localhost:3080/api/post-files", formData);

      setFile(null);
      setLinkName("");
      setShowModal(true);
      fetchFiles();

      // If Letter uploaded → re-check Matter permission
      const letterCategory = categories.find((c) =>
        c.cat_name.toLowerCase().includes("letter")
      );

      if (letterCategory && selectedCategory == letterCategory.cat_cd) {
        fetchCategories();
      }
    } catch (err) {
      console.error("Upload failed:", err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UPLOAD MATTER ----------------
  const handleMatterUpload = async (e) => {
    e.preventDefault();
    if (!matterFile || !matterLinkName || !matterCategoryCode) return;

    const formData = new FormData();
    formData.append("file", matterFile);
    formData.append("ref_id", ref_id);
    formData.append("financial_year", financial_year);
    formData.append("categary_cd", matterCategoryCode);
    formData.append("user_id", user_id);
    formData.append("link_name", matterLinkName);

    try {
      await axios.post("http://localhost:3080/api/post-files", formData);

      setMatterFile(null);
      setMatterLinkName("");
      setShowModal(true);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // ---------------- DELETE FILE ----------------
  const deleteFile = async (sno) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await axios.delete(
        `http://localhost:3080/api/files/${ref_id}/${financial_year}/${sno}`
      );
      fetchFiles();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="container py-4">

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "#00000070" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Success</h5>
              </div>
              <div className="modal-body">
                <h5>File Uploaded Successfully!</h5>
              </div>
              <button className="btn btn-success m-3" onClick={() => setShowModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="card mb-3 shadow-sm">
        <div className="card-header bg-primary text-white">
          <b>Upload Client Files</b>
        </div>
        <div className="p-3">
          <p><b>Ref ID:</b> {ref_id}</p>
          <p><b>Subject:</b> {subject}</p>
          <p><b>Financial Year:</b> {financial_year}</p>
          <p><b>User ID:</b> {user_id}</p>
        </div>
      </div>

      {/* GENERAL FILE UPLOAD */}
      <form onSubmit={handleUpload} className="card p-4 shadow-sm mb-4">
        <h5 className="text-primary mb-3">Upload File</h5>

        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Category *</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.cat_cd} value={c.cat_cd}>
                  {c.cat_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Link Name *</label>
            <input
              type="text"
              className="form-control"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Choose File *</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </form>

      {/* MATTER UPLOAD - SHOWN ONLY AFTER LETTER */}
      {letterUploaded && matterCategoryCode && (
        <form onSubmit={handleMatterUpload} className="card p-4 shadow-sm mb-4 border-success">
          <h5 className="text-success mb-3">Upload Matter</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Category</label>
              <input
                className="form-control"
                value="Matter"
                disabled
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Link Name *</label>
              <input
                type="text"
                className="form-control"
                value={matterLinkName}
                onChange={(e) => setMatterLinkName(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Choose File *</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setMatterFile(e.target.files[0])}
              />
            </div>

            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-success">Upload Matter</button>
            </div>
          </div>
        </form>
      )}

      {/* FILE TABLE */}
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">
          <b>Uploaded Files</b>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Link Name</th>
                <th>File Name</th>
                <th className="text-center">Download</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {fileList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-danger">
                    No files yet.
                  </td>
                </tr>
              ) : (
                fileList.map((f, i) => (
                  <tr key={f.sno}>
                    <td>{i + 1}</td>
                    <td>{f.link_name}</td>
                    <td>{f.file_name}</td>
                    <td className="text-center">
                      <a
                        href={`http://localhost:3080/uploads/${f.file_name}`}
                        target="_blank"
                        className="btn btn-outline-primary btn-sm"
                      >
                        <FaDownload />
                      </a>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteFile(f.sno)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-3">
        <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ClientFileUpload;
