


// import React, {useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const ClientFileUpload = ({ref_id}) => {
//   const [file, setFile] = useState(null);
//   const [matterFile, setMatterFile] = useState(null);

//   const [alertMsg, setAlertMsg] = useState("");
//   const [showMatterInput, setShowMatterInput] = useState(false);

//   const BASE_URL = "http://localhost:3080/api";

// useEffect(() => {
//     if (!localStorage.getItem("financial_year")) {
//       localStorage.setItem("financial_year", "2025-2026");
//     }
//     if (!localStorage.getItem("user_id")) {
//       localStorage.setItem("user_id", "00002");
//     }


   
//   }, []);

//   const financial_year = localStorage.getItem("financial_year");
//   const user_id = localStorage.getItem("user_id");



//   // ================= UPLOAD Letter =======================
//   const handleUpload = async () => {
//     if (!file) {
//       setAlertMsg("⚠ Please choose a file to upload!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("ref_id", ref_id);
//     formData.append("financial_year", financial_year);
//     formData.append("user_id", user_id);

//     try {
//       await axios.post(`${BASE_URL}/files`, formData);
//       setAlertMsg("✔ Letter uploaded successfully!");
//       setShowMatterInput(true);
//       setFile(null);
//     } catch (err) {
//       console.log("Upload Error:", err);
//     }
//   };

//   // ================= UPLOAD Matter =======================
//   const handleMatterUpload = async () => {
//     if (!matterFile) {
//       setAlertMsg("⚠ Please choose matter file to upload!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", matterFile);
//     formData.append("ref_id", ref_id);
//     formData.append("financial_year", financial_year);
//     formData.append("user_id", user_id);

//     try {
//       await axios.post(`${BASE_URL}/files`, formData);
//       setAlertMsg("✔ Matter uploaded successfully!");
//       setMatterFile(null);
//     } catch (err) {
//       console.log("Upload Error:", err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h4 className="text-center fw-bold mb-4 text-primary">
//         📄 Client File Upload Manager
//       </h4>

//       {/* Upload Letter */}
//       <div className="card shadow-lg rounded-4 mb-4 p-4">
//         <label className="form-label fw-semibold">Upload Letter</label>
//         <div className="d-flex justify-content-between">
//           <input
//             type="file"
//             className="form-control"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           <button className="btn btn-success ms-3" onClick={handleUpload}>
//             Upload Letter
//           </button>
//         </div>
//       </div>

//       {/* Upload Matter */}
//       {showMatterInput && (
//         <div className="card shadow-lg rounded-4 mb-4 p-4">
//           <label className="form-label fw-semibold">Upload Matter</label>
//           <div className="d-flex justify-content-between">
//             <input
//               type="file"
//               className="form-control"
//               onChange={(e) => setMatterFile(e.target.files[0])}
//             />
//             <button className="btn btn-primary ms-3" onClick={handleMatterUpload}>
//               Upload Matter
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ALERT */}
//       {alertMsg && (
//         <div className="alert alert-info text-center fw-bold">{alertMsg}</div>
//       )}
//     </div>
//   );
// };

// export default ClientFileUpload;




import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ClientFileUpload = ({ref_id }) => {
  const [file, setFile] = useState(null);
  const [matterFile, setMatterFile] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [showMatterInput, setShowMatterInput] = useState(false);

  const BASE_URL = "http://localhost:3080/api";

  // Set session default values
  useEffect(() => {
    if (!localStorage.getItem("financial_year")) {
      localStorage.setItem("financial_year", "2025-2026");
    }
    if (!localStorage.getItem("user_id")) {
      localStorage.setItem("user_id", "00002");
    }
  }, []);

  const financial_year = localStorage.getItem("financial_year");
  const user_id = localStorage.getItem("user_id");

  // ================= UPLOAD Letter =======================
  const handleUpload = async () => {
    if (!file) {
      setAlertMsg("⚠ Please choose a Letter file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ref_id",ref_id);
    formData.append("financial_year", financial_year);
    formData.append("user_id", user_id);

    // Required fields for Stored Procedure
    formData.append("categary_cd", "01");               // Letter Category
    formData.append("sno", +1);                          // SP auto-assigns next number
    formData.append("link_name", file.name);            // Display name
    formData.append("action", "post");                  // Insert action

    try {
      await axios.post(`${BASE_URL}/upload-files`, formData);
      setAlertMsg("✔ Letter uploaded successfully!");
      setShowMatterInput(true);
      setFile(null);
    } catch (err) {
      // console.log("Upload Error:", err);
      // setAlertMsg("❌ Upload failed. Check console for details.");

      console.log("Upload Error Full:", JSON.stringify(err, null, 2));
  console.log("Server Response:", err.response?.data);
  console.log("Status:", err.response?.status);
  console.log("Details:", err.response?.data?.message);
  setAlertMsg("❌ Upload failed. Check console for details.");
    }
  };

  // ================= UPLOAD Matter =======================
  const handleMatterUpload = async () => {
    if (!matterFile) {
      setAlertMsg("⚠ Please choose a Matter file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", matterFile);
    formData.append("ref_id", ref_id);
    formData.append("financial_year", financial_year);
    formData.append("user_id", user_id);

    // Required fields for Stored Procedure
    formData.append("categary_cd", "02");                // Matter Category
    formData.append("sno", 0);
    formData.append("link_name", matterFile.name);
    formData.append("action", "post");

    try {
      await axios.post(`${BASE_URL}/files`, formData);
      setAlertMsg("✔ Matter uploaded successfully!");
      setMatterFile(null);
    } catch (err) {
      console.log("Upload Error:", err);
      setAlertMsg("❌ Upload failed. Check console for details.");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center fw-bold mb-4 text-primary">
        📄 Client File Upload Manager
      </h4>

      {/* Upload Letter */}
      <div className="card shadow-lg rounded-4 mb-4 p-4">
        <label className="form-label fw-semibold">Upload Letter</label>
        <div className="d-flex justify-content-between gap-3">
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button className="btn btn-success" onClick={handleUpload}>
            Upload Letter
          </button>
        </div>
      </div>

      {/* Upload Matter */}
      {showMatterInput && (
        <div className="card shadow-lg rounded-4 mb-4 p-4">
          <label className="form-label fw-semibold">Upload Matter</label>
          <div className="d-flex justify-content-between gap-3">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setMatterFile(e.target.files[0])}
            />
            <button className="btn btn-primary" onClick={handleMatterUpload}>
              Upload Matter
            </button>
          </div>
        </div>
      )}

      {/* ALERT MESSAGE */}
      {alertMsg && (
        <div className="alert alert-info text-center fw-bold">
          {alertMsg}
        </div>
      )}
    </div>
  );
};

export default ClientFileUpload;
