
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./ClientFileUpload.css";
import {
  FaTrash,
  FaDownload,
  FaUpload,
  FaFileAlt,
  FaCheckCircle,
  FaFolder,
  FaPencilAlt,
} from "react-icons/fa";

const ClientFileUpload = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { ref_id, financial_year, user_id } = state || {}; // Removed 'categary', 'subject' as they aren't used for initial state

  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fileList, setFileList] = useState([]);

  const [file, setFile] = useState(null);
  const [linkName, setLinkName] = useState("");

  const [letterCategoryCode, setLetterCategoryCode] = useState(""); // ⬅️ NEW STATE for Letter code
  const [matterCategoryCode, setMatterCategoryCode] = useState("");
  const [letterUploaded, setLetterUploaded] = useState(0); // Initialize with 0

  const [showModal, setShowModal] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const [previewType, setPreviewType] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [fileSize, setFileSize] = useState(null);

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    if (!ref_id || !financial_year) return;

    try {
      const res = await axios.get(
        "http://localhost:3080/api/upload-categories",
        {
          params: { ref_id, financial_year },
        }
      );

      const data = res.data.data || [];
      setCategories(data);

      const letter = data.find((c) =>
        c.cat_name.toLowerCase().includes("letter")
      );
      if (letter) {
        setLetterCategoryCode(letter.cat_cd); // ⬅️ Save Letter code

        // Check if letter has been uploaded
        const check = await axios.get(
          `http://localhost:3080/api/files/${ref_id}/${financial_year}/${letter.cat_cd}`
        );
        const uploadedCount = check?.data.data.length || 0;
        setLetterUploaded(uploadedCount);

        // Set initial selected category after checking upload status
        if (uploadedCount > 0 && data.length > 0) {
          // If letter is uploaded, select the first *other* category (or the first one if all are "matter")
          const firstOtherCategory = data.find(c => c.cat_cd !== letter.cat_cd);
          setSelectedCategory(firstOtherCategory ? firstOtherCategory.cat_cd : data[0].cat_cd);
        } else if (uploadedCount === 0) {
           // If letter is not uploaded, set the selection to letter code
           setSelectedCategory(letter.cat_cd);
        }

      }
      
      const matter = data.find((c) =>
        c.cat_name.toLowerCase().includes("matter")
      );
      if (matter) setMatterCategoryCode(matter.cat_cd);


    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- FETCH FILES ----------------
  const fetchFiles = async () => {
    // Only fetch files for the selected category
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
    // Re-fetch files whenever selectedCategory changes
    fetchFiles();
  }, [selectedCategory, letterUploaded]); // Added letterUploaded dependency

  // ---------------- UPLOAD FILE (Combined) ----------------
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !linkName) return;

    // ⬅️ CRUCIAL LOGIC MODIFICATION
    let categoryToUse;

    // 1. If 'letter' is NOT uploaded, we MUST upload to the letter category.
    if (letterUploaded === 0) {
      categoryToUse = letterCategoryCode;
    } else {
      // 2. If 'letter' IS uploaded, we use the selected category from the dropdown.
      categoryToUse = selectedCategory;
    }
    
    if (!categoryToUse) {
        console.error("Category code not determined. Cannot upload.");
        return;
    }


    const formData = new FormData();
    formData.append("file", file);
    formData.append("ref_id", ref_id);
    formData.append("financial_year", financial_year);
    formData.append("categary_cd", categoryToUse); // ⬅️ DYNAMIC CATEGORY
    formData.append("user_id", user_id);
    formData.append("link_name", linkName);

    try {
      await axios.post("http://localhost:3080/api/post-files", formData);

      // Reset state for the next upload
      setFile(null);
      setLinkName("");
      setPreviewURL(null);
      setPreviewType("");
      setFileSize(null);

      if (fileInputRef.current) fileInputRef.current.value = "";

      setShowModal(true);
      
      // Re-fetch categories to update letterUploaded status
      await fetchCategories(); 

      // Re-fetch files for the currently selected category
      fetchFiles(); 
      
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };


  // ---------------- DELETE FILE ----------------
  // const deleteFile = async (sno) => {
  //   if (!window.confirm("Delete this file?")) return;

  //   try {
  //     await axios.delete(
  //       `http://localhost:3080/api/files/delete//${ref_id}/${financial_year}/${sno}`
  //     );
  //     // Re-fetch categories to check if letter count changes
  //     await fetchCategories();
  //     fetchFiles();
  //   } catch (err) {
  //     console.error("Delete failed:", err);
  //   }
  // };



  const deleteFile = async (sno) => {
  if (!window.confirm("Delete this file?")) return;

  try {
    await axios.delete(
      `http://localhost:3080/api/files/delete/${ref_id}/${financial_year}/${sno}`,
      {
        data: {
          user_id,
        },
      }
    );

    await fetchCategories();
    fetchFiles();
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  // ---------------- DRAG & DROP ----------------
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      
      if (selected) {
        setPreviewURL(URL.createObjectURL(selected));
        setPreviewType(selected.type);
      }
      // Auto-generate next file name
      setLinkName(generateNextFileName(letterUploaded === 0 ? letterCategoryCode : selectedCategory)); 
      setFileSize((selected.size / (1024 * 1024)).toFixed(2));
    }
  };


  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    // Save file 
    setFile(selected);

    // Preview
    setPreviewURL(URL.createObjectURL(selected));
    setPreviewType(selected.type);

    // File size in MB
    setFileSize((selected.size / (1024 * 1024)).toFixed(2));

    // Auto-generate next file name based on current context
    setLinkName(generateNextFileName(letterUploaded === 0 ? letterCategoryCode : selectedCategory));

  };


  // ---------------- Auto File Name ----------------
  const generateNextFileName = (cat_cd) => {
    // Filter fileList by the category code that the *new* file will be uploaded to
    const filesInCurrentCat = fileList.filter(f => f.categary_cd === cat_cd);
    const count = filesInCurrentCat.length + 1;

    // Use a category name prefix for better naming (optional, but good practice)
    const categoryName = categories.find(c => c.cat_cd === cat_cd)?.cat_name || 'DOC';

    return `${ref_id}_${categoryName.toUpperCase()}_${count}`;
  };

  // ---------------- UI Handlers ----------------
  const handleCategoryChange = (e) => {
      setSelectedCategory(e.target.value);
      setFile(null); // Clear file and link name when category changes
      setLinkName("");
      setPreviewURL(null);
      setPreviewType("");
      setFileSize(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Determine the current file/link state to display in the input fields
  const currentFile = file;
  const currentLinkName = linkName;
  const currentFileInputRef = fileInputRef;


  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "linear-gradient(135deg, #f1f1f1ff 0%, #f5f5f5ff 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        {/* ================= SUCCESS MODAL ================= */}
        {showModal && (
          <div
            className="modal fade show d-block"
            style={{ background: "#00000070" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content modal-custom"
                style={{ borderRadius: "20px", border: "none" }}
              >
                <div
                  className="modal-header"
                  style={{
                    background:
                      "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                    borderRadius: "20px 20px 0 0",
                    border: "none",
                  }}
                >
                  <h5 className="modal-title text-white">
                    <FaCheckCircle className="me-2" /> Success
                  </h5>
                </div>
                <div className="modal-body text-center py-4">
                  <div className="mb-3">
                    <FaCheckCircle size={60} color="#38ef7d" />
                  </div>
                  <h5 className="fw-bold">File Uploaded Successfully!</h5>
                  <p className="text-muted">
                    Your file has been uploaded and saved.
                  </p>
                </div>
                <div className="modal-footer border-0 justify-content-center">
                  <button
                    className="btn btn-gradient-success px-5 py-2"
                    onClick={() => setShowModal(false)}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= HEADER CARD ================= */}
        <div className="card gradient-card mb-4 hover-lift">
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-white p-3 rounded-circle me-3">
                <FaFolder size={30} color="#667eea" />
              </div>
              <div>
                <h3 className="text-white mb-0 fw-bold">
                  File Management
                </h3>
                <p className="text-white-50 mb-0">
                  Upload and manage your documents
                </p>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-3">
                <div className="info-box hover-lift">
                  <small className="d-block opacity-75">Reference ID</small>
                  <h5 className="mb-0 fw-bold">{ref_id}</h5>
                </div>
              </div>
              <div className="col-md-2">
                <div className="info-box-alt hover-lift">
                  <small className="d-block opacity-75">Financial Year</small>
                  <h5 className="mb-0 fw-bold">{financial_year}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= UPLOAD FORM ================= */}
        <div
          className="card shadow-lg mb-4 hover-lift"
          style={{ borderRadius: "20px", border: "none" }}
        >
          <div className="card-body p-4">
            {/* TITLE CENTER */}
            <div className="d-flex justify-content-center align-items-center mb-4 text-center">
              <div
                className={`${
                  letterUploaded > 0 ? "bg-success" : "bg-primary"
                } bg-opacity-10 p-3 rounded-circle me-3`}
              >
                <FaUpload
                  size={24}
                  className={letterUploaded > 0 ? "text-success" : "text-primary"}
                />
              </div>
              <h4
                className={`mb-0 fw-bold ${
                  letterUploaded > 0 ? "text-success" : "text-primary"
                }`}
              >
                {letterUploaded > 0 ? "Upload Documents" : "Upload Initial Letter"}
              </h4>
            </div>

            {/* CENTER FORM SECTION */}
            <div className="row justify-content-center text-center mb-4">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">
                  <FaFileAlt className="me-2" />
                  Category *
                </label>

                {/* ⬅️ CATEGORY SELECTION LOGIC */}
                {letterUploaded === 0 ? (
                  <input
                    className="form-control form-control-lg bg-success bg-opacity-10 text-success fw-bold text-center"
                    value="Letter" // Display 'Letter' name
                    disabled
                    style={{ borderRadius: "10px" }}
                  />
                ) : (
                  <select
                    className="form-select form-select-lg text-center"
                    value={selectedCategory}
                    onChange={handleCategoryChange} // ⬅️ Use new handler
                    style={{ borderRadius: "10px" }}
                  >
                    {categories.map((c) => (
                      // Only show selectable categories (non-letter categories, and letter if desired)
                       <option key={c.cat_cd} value={c.cat_cd}>
                          {c.cat_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">File Name *</label>
                <input
                  type="text"
                  className="form-control form-control-lg text-center"
                  placeholder="File name"
                  value={currentLinkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  style={{ borderRadius: "10px" }}
                />
              </div>

              {/* BROWSE BUTTON CENTER */}
              <div className="col-md-8 mb-3 d-flex justify-content-center">
                <div className="w-100">
                  <label className="form-label fw-bold">Choose File *</label>

                  <input
                    type="file"
                    ref={currentFileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    className="btn btn-primary btn-lg w-100"
                    style={{ borderRadius: "10px" }}
                    onClick={() => currentFileInputRef.current.click()}
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>

            {/* DRAG + DROP OR PREVIEW CENTERED */}

            <div className="row justify-content-center">
              <div className="col-md-8">
                {/* NO PREVIEW → DRAG BOX */}
                {!previewURL ? (
                  <div
                    className={`upload-zone center-box ${
                      dragActive ? "drag-active" : ""
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => currentFileInputRef.current?.click()}
                    style={{
                      cursor: "pointer",
                      borderRadius: "15px",
                    }}
                  >
                    <div className="text-center">
                      <FaUpload
                        size={50}
                        className={dragActive ? "text-primary" : "text-muted"}
                      />
                      <h5 className="mt-3 fw-bold">
                        Drag & Drop Files Here
                      </h5>
                      <p className="text-muted">or click to browse</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* PREVIEW CENTERED */}
                    <div
                      className="preview-card p-2 bg-light rounded center-box"
                      style={{ height: "250px" }}
                    >
                      {previewType.startsWith("image/") && (
                        <img
                          src={previewURL}
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "230px",
                            width: "100%",
                            objectFit: "contain",
                          }}
                          alt="Preview"
                        />
                      )}

                      {previewType === "application/pdf" && (
                        <iframe
                          src={previewURL}
                          style={{
                            width: "100%",
                            height: "230px",
                            border: 0,
                            borderRadius: "10px",
                          }}
                          title="PDF Preview"
                        ></iframe>
                      )}

                      {!previewType.startsWith("image/") &&
                        previewType !== "application/pdf" && (
                          <div className="text-center">
                            <FaFileAlt size={50} className="text-primary mb-2" />
                            <p className="fw-bold">{currentFile?.name}</p>
                          </div>
                        )}
                    </div>

                    {/* ✅ FILE SIZE OUTSIDE PREVIEW BOX */}
                    {fileSize && (
                      <p className="text-muted text-center mt-2">
                        Size: <strong>{fileSize} MB</strong>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* UPLOAD BUTTON CENTER */}
            <div className="text-center mt-4">
              <button
                className={`btn ${
                  letterUploaded > 0 ? "btn-gradient-success" : "btn-gradient"
                } btn-lg px-5 py-3`}
                onClick={handleUpload}
                disabled={!file || !linkName} // Disable if no file or linkName
                style={{
                  borderRadius: "50px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                <FaUpload className="me-2" />
                {letterUploaded > 0 ? "Upload File" : "Upload Letter"}
              </button>
            </div>
          </div>
        </div>

        {/* ===================== FILE TABLE ===================== */}
        <div className="card shadow-lg mb-5">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">
                Uploaded Files for Category: 
                <span className="fw-bold ms-2">
                    {categories.find(c => c.cat_cd === selectedCategory)?.cat_name || "N/A"}
                </span>
            </h5>
          </div>

          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "80px" }}>S.No</th>
                  <th>File Name</th>
                  <th>File Size</th>
                  <th>File Type</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {fileList.map((file, index) => {
                  return (
                    <tr key={file.sno}>
                      <td className="fw-bold">{index + 1}</td>
                      <td className="fw-semibold">{file.link_name}</td>
                      <td>
                        {(file.file_size_in_bytes / (1024 * 1024)).toFixed(2)}{" "}
                        MB
                      </td>
                      <td>{file.content_type}</td>
                      <td className="d-flex justify-content-around">
                        <span>
                          <a
                            href={`http://localhost:3080/${file.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success"
                          >
                            <FaDownload />
                          </a>
                        </span>
                        <button
                            className="btn btn-danger"
                            onClick={() => deleteFile(file.sno)}
                        >
                            <FaTrash />
                        </button>
                        {/* Assuming edit is not implemented, kept for consistency */}
                        <span className="btn btn-warning">
                          <FaPencilAlt />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {fileList.length === 0 && (
                <div className="text-center text-muted py-3">
                    No files uploaded in this category.
                </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <button  className="btn px-4 text-white me-4"
  style={{
    background: "linear-gradient(135deg, #fa1837ff 100%)",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold"
  }} onClick={() => navigate(-1)}>
          Back
        </button>

       <button
  className="btn px-4 text-white"
  style={{
    background: "linear-gradient(135deg, #93a6fbff 0%, #3935f5ff 100%)",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold"
  }}
  onClick={() => navigate("/forwardto")}
>
 next 
</button>
   
      </div>
    </div>
  );
};

export default ClientFileUpload;