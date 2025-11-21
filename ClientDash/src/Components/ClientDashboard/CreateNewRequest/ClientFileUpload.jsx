import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ClientFileUpload = ({ ref_id, financial_year, user_id }) => {
  const [file, setFile] = useState(null);
  const [linkName, setLinkName] = useState("");
  const [category, setCategory] = useState("");
  const [sno, setSno] = useState("");
  const [fileList, setFileList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const BASE_URL = "http://localhost:3080/api"; // change based on server

  // ================= FETCH FILE LIST =======================
  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/files/${ref_id}/${financial_year}`
      );
      setFileList(res.data.data || []);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ================= UPLOAD =======================
  const handleUpload = async () => {
    if (!file || !category || !linkName || !sno) {
      setAlertMsg("⚠ Please fill all fields before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ref_id", ref_id);
    formData.append("financial_year", financial_year);
    formData.append("categary_cd", category);
    formData.append("link_name", linkName);
    formData.append("sno", sno);
    formData.append("user_id", user_id);

    try {
      const res = await axios.post(`${BASE_URL}/files`, formData);
      setAlertMsg("✔ File uploaded successfully!");
      fetchFiles();
      clearForm();
    } catch (err) {
      console.log("Upload Error:", err);
    }
  };

  // ================= UPDATE =======================
  const handleUpdate = async () => {
    const formData = new FormData();
    if (file) formData.append("file", file);

    formData.append("ref_id", ref_id);
    formData.append("financial_year", financial_year);
    formData.append("sno", sno);
    formData.append("link_name", linkName);
    formData.append("user_id", user_id);

    try {
      await axios.put(`${BASE_URL}/files`, formData);
      setAlertMsg("✔ File updated successfully!");
      fetchFiles();
      clearForm();
    } catch (err) {
      console.log("Update Error:", err);
    }
  };

  // ================= DELETE =======================
  const deleteFile = async (snoValue) => {
    try {
      await axios.delete(
        `${BASE_URL}/files/${ref_id}/${financial_year}/${snoValue}`,
        { data: { user_id } }
      );
      setAlertMsg("🗑 Deleted successfully!");
      fetchFiles();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  const clearForm = () => {
    setEditMode(false);
    setFile(null);
    setLinkName("");
    setCategory("");
    setSno("");
  };

  const onEdit = (row) => {
    setEditMode(true);
    setLinkName(row.link_name);
    setSno(row.sno);
  };

  return (
    <div className="container mt-4">
      <h4 className="text-center fw-bold mb-4 text-primary">
        📄 Client File Upload Manager
      </h4>

      {/* FORM CARD */}
      <div className="card shadow-lg rounded-4 mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-3">
              <label className="form-label fw-semibold">Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Category Code"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">S.No</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter serial"
                value={sno}
                onChange={(e) => setSno(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Link Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter document name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Upload File</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <div className="col-12 mt-3 text-center">
              {!editMode ? (
                <button className="btn btn-success px-4" onClick={handleUpload}>
                  Upload File
                </button>
              ) : (
                <button className="btn btn-warning px-4" onClick={handleUpdate}>
                  Update File
                </button>
              )}
              <button className="btn btn-secondary ms-2 px-4" onClick={clearForm}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT */}
      {alertMsg && (
        <div className="alert alert-info text-center fw-bold">{alertMsg}</div>
      )}

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-primary text-center">
            <tr>
              <th>S.No</th>
              <th>Link Name</th>
              <th>Category</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {fileList.map((row, idx) => (
              <tr key={idx}>
                <td className="text-center">{row.sno}</td>
                <td>{row.link_name}</td>
                <td className="text-center">{row.categary_cd}</td>
                <td className="text-center">{row.file_size_in_bytes} KB</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(row)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteFile(row.sno)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientFileUpload;
