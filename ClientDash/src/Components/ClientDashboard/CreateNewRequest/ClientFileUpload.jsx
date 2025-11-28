
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
  FaEdit,FaPencilAlt,
} from "react-icons/fa";

const ClientFileUpload = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { ref_id, financial_year, categary, user_id, subject } = state || {};

  const fileInputRef = useRef(null);
  const matterFileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categary || "");
  const [fileList, setFileList] = useState([]);

  const [file, setFile] = useState(null);
  const [linkName, setLinkName] = useState("");

  const [matterCategoryCode, setMatterCategoryCode] = useState("");
  const [letterUploaded, setLetterUploaded] = useState(false);
  const [matterFile, setMatterFile] = useState(null);
  const [matterLinkName, setMatterLinkName] = useState("");

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

  // ---------------- UPLOAD LETTER FILE ----------------
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

    try {
      await axios.post("http://localhost:3080/api/post-files", formData);

      setFile(null);
      setLinkName("");
      setPreviewURL(null);
      setPreviewType("");

      if (fileInputRef.current) fileInputRef.current.value = "";

      setShowModal(true);
      fetchFiles();
      fetchCategories();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // ---------------- UPLOAD MATTER FILE ----------------
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
      setPreviewURL(null);
      setPreviewType("");

      if (matterFileInputRef.current)
        matterFileInputRef.current.value = "";

      setShowModal(true);
      fetchFiles();
      fetchCategories();
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      if (letterUploaded) setMatterFile(selected);
      else setFile(selected);

      if (selected) {
        setPreviewURL(URL.createObjectURL(selected));
        setPreviewType(selected.type);
      }
    }
  };





const handleFileChange = (e) => {
  const selected = e.target.files[0];

  if (!selected) return;

  // Save file or matter file
  if (letterUploaded) {
    setMatterFile(selected);
  } else {
    setFile(selected);
  }

  // Preview
  setPreviewURL(URL.createObjectURL(selected));
  setPreviewType(selected.type);

  // File size in MB
  setFileSize((selected.size / (1024 * 1024)).toFixed(2));

  // Auto-generate next file name
  const auto = generateNextFileName();
  if (letterUploaded) {
    setMatterLinkName(auto);
  } else {
    setLinkName(auto);
  }
};






  // ---------------- Auto File Name ----------------
  const generateNextFileName = () => {
    const count = fileList.length + 1;
    return `${ref_id}_${count}`;
  };

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
              {/* <div className="col-md-3">
                <div className="info-box hover-lift">
                  <small className="d-block opacity-75">User ID</small>
                  <h5 className="mb-0 fw-bold">{user_id}</h5>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-box-alt hover-lift">
                  <small className="d-block opacity-75">Subject</small>
                  <h6 className="mb-0 fw-bold text-truncate">{subject}</h6>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* ================= UPLOAD FORM ================= */}
         {/* <div
          className="card shadow-lg mb-4 hover-lift"
          style={{ borderRadius: "20px", border: "none" }}
        >
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-4">
              <div
                className={`${
                  letterUploaded ? "bg-success" : "bg-primary"
                } bg-opacity-10 p-3 rounded-circle me-3`}
              >
                <FaUpload
                  size={24}
                  className={letterUploaded ? "text-success" : "text-primary"}
                />
              </div>
              <h4
                className={`mb-0 fw-bold ${
                  letterUploaded ? "text-success" : "text-primary"
                }`}
              >
                {letterUploaded ? "Upload Matter Documents" : "Upload Files"}
              </h4>
            </div>

            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">
                  <FaFileAlt className="me-2" />
                  Category *
                </label>

                {!letterUploaded ? (
                  <select
                    className="form-select form-select-lg"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ borderRadius: "10px" }}
                  >
                    {categories.map((c) => (
                      <option key={c.cat_cd} value={c.cat_cd}>
                        {c.cat_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="form-control form-control-lg bg-success bg-opacity-10 text-success fw-bold"
                    value="Matter"
                    disabled
                    style={{ borderRadius: "10px" }}
                  />
                )}
              </div>

              
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">File Name *</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="File name"
                  value={letterUploaded ? matterLinkName : linkName}
                  onChange={(e) =>
                    letterUploaded
                      ? setMatterLinkName(e.target.value)
                      : setLinkName(e.target.value)
                  }
                 
                  style={{ borderRadius: "10px" }}
                />
              </div>

      
             
            </div>
             <div className="col-md-8 mb-3">
                <label className="form-label fw-bold">Choose File *</label>

                <input
                  type="file"
                  ref={letterUploaded ? matterFileInputRef : fileInputRef}
                  onChange={handleFileChange}
                 
                  style={{ display: "none" }}
                />

                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100"
                  style={{ borderRadius: "10px" }}
                  onClick={() =>
                    (letterUploaded
                      ? matterFileInputRef.current
                      : fileInputRef.current
                    ).click()
                  }
                >
                  Browse
                </button>
              </div>

            
             <div className="row">
              <div className="col-md-8">
                <div
                  className={`upload-zone ${dragActive ? "drag-active" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (letterUploaded) matterFileInputRef.current?.click();
                    else fileInputRef.current?.click();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-center">
                    <FaUpload
                      size={50}
                      className={dragActive ? "text-primary" : "text-muted"}
                    />
                    <h5 className="mt-3 fw-bold">Drag & Drop Files Here</h5>
                    <p className="text-muted">or use the file input above</p>
                  </div>
                </div>
              </div> 

           
           <div className="col-md-4">
                <div className="preview-card">
                  {!previewURL ? (
                    <div className="text-center">
                      <FaFileAlt size={50} className="text-muted mb-2" />
                      <p className="text-muted mb-0">No file selected</p>
                    </div>
                  ) : (
                    <div className="w-100">
                      {previewType.startsWith("image/") && (
                        <img
                          src={previewURL}
                          className="img-fluid rounded"
                          style={{
                            maxHeight: "200px",
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
                            height: "200px",
                            border: 0,
                            borderRadius: "10px",
                          }}
                          title="PDF Preview"
                        ></iframe>
                      )}

                      {!previewType.startsWith("image/") &&
                        previewType !== "application/pdf" && (
                          <div className="text-center">
                            <FaFileAlt
                              size={50}
                              className="text-primary mb-2"
                            />
                            <p className="fw-bold">
                              {(file || matterFile)?.name}
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div> 

<div className="row ">

  <div className="col-md-8">


    {!previewURL ? (
      <div
        className={`upload-zone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (letterUploaded) matterFileInputRef.current?.click();
          else fileInputRef.current?.click();
        }}
        style={{ cursor: "pointer", height: "250px" }}
      >
        <div className="text-center">
          <FaUpload
            size={50}
            className={dragActive ? "text-primary" : "text-muted"}
          />
          <h5 className="mt-3 fw-bold">Drag & Drop Files Here</h5>
          <p className="text-muted">or click to browse</p>
        </div>
      </div>
    ) : (
    
      <div className="preview-card p-2 bg-light rounded" style={{ height: "250px" }}>

        {previewType.startsWith("image/") && (
          <img
            src={previewURL}
            className="img-fluid rounded"
            style={{ maxHeight: "230px", width: "100%", objectFit: "contain" }}
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
              <p className="fw-bold">{(file || matterFile)?.name}</p>
            </div>
          )}
      </div>
    )}

  </div>


 <div className="col-md-4">
    <div className="preview-card text-center p-3">
      {!previewURL ? (
        <>
          <FaFileAlt size={50} className="text-muted mb-2" />
          <p className="text-muted mb-0">No file selected</p>
        </>
      ) : (
        <>
          <FaCheckCircle size={50} className="text-success mb-2" />
          <p className="fw-bold mb-0">{(file || matterFile)?.name}</p>
        </>
      )}
    </div>
  </div> 
</div>

            

           
            <div className="text-center mt-4">
              <button
                className={`btn ${
                  letterUploaded ? "btn-gradient-success" : "btn-gradient"
                } btn-lg px-5 py-3`}
                onClick={letterUploaded ? handleMatterUpload : handleUpload}
                style={{
                  borderRadius: "50px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                <FaUpload className="me-2" />
                {letterUploaded ? "Upload Matter File" : "Upload File"}
              </button>
            </div>
          </div>
        </div>  */}



        <div
  className="card shadow-lg mb-4 hover-lift"
  style={{ borderRadius: "20px", border: "none" }}
>
  <div className="card-body p-4">

    {/* TITLE CENTER */}
    <div className="d-flex justify-content-center align-items-center mb-4 text-center">
      <div
        className={`${
          letterUploaded ? "bg-success" : "bg-primary"
        } bg-opacity-10 p-3 rounded-circle me-3`}
      >
        <FaUpload
          size={24}
          className={letterUploaded ? "text-success" : "text-primary"}
        />
      </div>
      <h4
        className={`mb-0 fw-bold ${
          letterUploaded ? "text-success" : "text-primary"
        }`}
      >
        {letterUploaded ? "Upload Matter Documents" : "Upload Files"}
      </h4>
    </div>

    {/* CENTER FORM SECTION */}
    <div className="row justify-content-center text-center mb-4">
      <div className="col-md-4 mb-3">
        <label className="form-label fw-bold">
          <FaFileAlt className="me-2" />
          Category *
        </label>

        {!letterUploaded ? (
          <select
            className="form-select form-select-lg text-center"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ borderRadius: "10px" }}
          >
            {categories.map((c) => (
              <option key={c.cat_cd} value={c.cat_cd}>
                {c.cat_name}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="form-control form-control-lg bg-success bg-opacity-10 text-success fw-bold text-center"
            value="Matter"
            disabled
            style={{ borderRadius: "10px" }}
          />
        )}
      </div>

      <div className="col-md-4 mb-3">
        <label className="form-label fw-bold">File Name *</label>
        <input
          type="text"
          className="form-control form-control-lg text-center"
          placeholder="File name"
          value={letterUploaded ? matterLinkName : linkName}
          onChange={(e) =>
            letterUploaded
              ? setMatterLinkName(e.target.value)
              : setLinkName(e.target.value)
          }
          style={{ borderRadius: "10px" }}
        />
      </div>

      {/* BROWSE BUTTON CENTER */}
      <div className="col-md-8 mb-3 d-flex justify-content-center">
        <div className="w-100">
          <label className="form-label fw-bold">Choose File *</label>

          <input
            type="file"
            ref={letterUploaded ? matterFileInputRef : fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <button
            type="button"
            className="btn btn-primary btn-lg w-100"
            style={{ borderRadius: "10px" }}
            onClick={() =>
              (letterUploaded
                ? matterFileInputRef.current
                : fileInputRef.current
              ).click()
            }
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
        onClick={() => {
          if (letterUploaded) matterFileInputRef.current?.click();
          else fileInputRef.current?.click();
        }}
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
          <h5 className="mt-3 fw-bold">Drag & Drop Files Here</h5>
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
                <p className="fw-bold">{(file || matterFile)?.name}</p>
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
          letterUploaded ? "btn-gradient-success" : "btn-gradient"
        } btn-lg px-5 py-3`}
        onClick={letterUploaded ? handleMatterUpload : handleUpload}
        style={{
          borderRadius: "50px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        <FaUpload className="me-2" />
        {letterUploaded ? "Upload Matter File" : "Upload File"}
      </button>
    </div>
  </div>
</div>


        {/* ===================== FILE TABLE ===================== */}
        <div className="card shadow-lg mb-5">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">Uploaded Files</h5>
          </div>

          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "80px" }}>S.No</th>
                  <th>File Name</th>
                  <th>File Size</th>
                  <th>file type</th>
                <th>Action</th>
                </tr>
              </thead>

              


              <tbody>
  {fileList.map((file, index) => {
    console.log("File row →", file); // ✅ Correct place

    return (
      <tr key={file.sno}>
        <td className="fw-bold">{index + 1}</td>
        <td className="fw-semibold">{file.link_name}</td>
        <td>{(file.file_size_in_bytes / (1024 * 1024)).toFixed(2)} MB</td>
        <td>{file.content_type }</td>
        <td className="d-flex justify-content-around">
          <span><a
            href={`http://localhost:3080/${file.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            <FaDownload /> 
          </a></span>
          <span className="btn btn-danger"><FaTrash/></span>
          <span className="btn btn-warning"><FaPencilAlt/></span>
        </td>
      </tr>
    );
  })}
</tbody>

            </table>
          </div>
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
