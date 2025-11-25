import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash, FaDownload } from "react-icons/fa";

const ClientFileUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { ref_id, financial_year, user_id, subject } = location.state || {};

  const [file, setFile] = useState(null);
  const [linkName, setLinkName] = useState("");
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ================= Fetch Uploaded Files =================
  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3080/api/files/?ref_id=${ref_id}&financial_year=${financial_year}`
      );
      setFileList(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // ================= Handle Upload =================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !linkName) {
      alert("Please enter Link Name and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ref_id", ref_id);
    formData.append("financial_year", financial_year);
    formData.append("user_id", user_id);
    formData.append("link_name", linkName);

    setLoading(true);

    try {
      await axios.post("http://localhost:3080/api/post-files", formData);
      setShowModal(true);
      setFile(null);
      setLinkName("");
      fetchFiles();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= Delete File =================
  const deleteFile = async (sno) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(
        `http://localhost:3080/api/files/${ref_id}/${financial_year}/${sno}`
      );
      fetchFiles();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="container py-4">
      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Success</h5>
              </div>
              <div className="modal-body text-center">
                <h5>File Uploaded Successfully!</h5>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success px-4" onClick={() => setShowModal(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="card mb-3 shadow-sm">
        <div className="card-header bg-primary text-white fw-bold">
          Upload Client Files
        </div>
        <div className="p-3">
          <p><b>Ref ID:</b> {ref_id}</p>
          <p><b>Subject:</b> {subject}</p>
          <p><b>Financial Year:</b> {financial_year}</p>
          <p><b>User ID:</b> {user_id}</p>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="card p-4 shadow-sm">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Link Name *</label>
            <input
              type="text"
              className="form-control"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              placeholder="Enter file title"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Choose File *</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>
      </form>

      {/* File List Table */}
      <div className="card mt-4 shadow-sm">
        <div className="card-header bg-success text-white fw-bold">
          Uploaded Files
        </div>
        <div className="card-body p-0">
          <table className="table table-bordered table-striped mb-0">
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
                  <td colSpan="5" className="text-center py-3 text-danger">
                    No files uploaded yet
                  </td>
                </tr>
              ) : (
                fileList.map((file, index) => (
                  <tr key={file.sno}>
                    <td>{index + 1}</td>
                    <td>{file.link_name}</td>
                    <td>{file.file_name}</td>
                    <td className="text-center">
                      <a
                        href={`http://localhost:3080/uploads/${file.file_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        <FaDownload />
                      </a>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteFile(file.sno)}
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

      <div className="text-center mt-4">
        <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default ClientFileUpload;
