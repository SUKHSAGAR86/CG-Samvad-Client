import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RequestForm = ({ category }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { action, rowData } = location.state || {};

  // ===============Create session values in localStorage=============
  useEffect(() => {
    if (!localStorage.getItem("financial_year")) {
      localStorage.setItem("financial_year", "2024-2025");
    }
    if (!localStorage.getItem("user_id")) {
      localStorage.setItem("user_id", "00100");
    }

    if (!localStorage.getItem("ref_Category_id")) {
      localStorage.setItem("ref_Category_id", "02");
    }

    if (!localStorage.getItem("user_name")) {
      localStorage.setItem(
        "user_name",
        "SUPERINTENDING ENGINEER, City Circle-II CSPDCL,Raipur, रायपुर"
      );
    }

    // ================== Fetch IP==================
    const getIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          ip_address: data.ip,
        }));
      } catch (err) {
        console.error("IP Fetch Error:", err);
      }
    };

    getIP();
  }, []);

  const financial_year = localStorage.getItem("financial_year");
  const user_id = localStorage.getItem("user_id");
  const user_name = localStorage.getItem("user_name");

  // ===================== Category Handling ===================
  const cat_text = category?.cat_text || "";
  const category_option = cat_text ? cat_text.split("-")[0].trim() : "";
  const cat_id = category?.cat_id || "";
  const form_option = ["classified", "display"].includes(
    category_option.toLowerCase()
  );

  // ================ Form State ===================
  const [formData, setFormData] = useState({
    subject: "",
    tender_amt: "",
    letter_no: "",
    letter_date: "",
    schedule_date: "",
    remarks: "",
    ref_Category_id: "",
    ref_Category_text: "",
    print_in_national_np: "",
    print_in_local_np: "",
    print_in_state_np: "",
    print_in_other_np: "",
    ip_address: "",
  });

  const [loading, setLoading] = useState(false);

  //============Popup state=================================
  const [showModal, setShowModal] = useState(false);
  const [savedRefId, setSavedRefId] = useState("");

  // ===== Auto Fill Category Only For New =====
  useEffect(() => {
    if (cat_text && action !== "update") {
      setFormData((prev) => ({
        ...prev,
        ref_Category_text: category_option,
        ref_Category_id: cat_id,
      }));
    }
  }, [cat_text, action]);

  // ===== Auto Fill Form when Editing =====
  useEffect(() => {
    if (action === "update" && rowData) {
      setFormData({
        subject: rowData.subject || "",
        tender_amt: rowData.tender_amt || "",
        letter_no: rowData.letter_no || "",
        letter_date: rowData.letter_date?.split("T")[0] || "",
        schedule_date: rowData.schedule_date?.split("T")[0] || "",
        remarks: rowData.remarks || "",
        ref_Category_id: rowData.ref_Category_id || "",
        ref_Category_text: rowData.ref_Category_text || "",
        print_in_national_np: rowData.print_in_national_np || "",
        print_in_local_np: rowData.print_in_local_np || "",
        print_in_state_np: rowData.print_in_state_np || "",
        print_in_other_np: rowData.print_in_other_np || "",
        ip_address: rowData.ip_address || "",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [action, rowData]);

  //  ================== Handle Change =======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =================== Submit Form (Insert) ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        financial_year: financial_year,
        user_id: user_id,
        user_name: user_name,
      };

      const res = await axios.post(
        "http://localhost:3080/api/client-advt-request",
        payload
      );

      setSavedRefId(res.data.ref_id);
      setShowModal(true);

      setFormData({
        subject: "",
        tender_amt: "",
        letter_no: "",
        letter_date: "",
        schedule_date: "",
        remarks: "",
        ref_Category_id: "",
        ref_Category_text: "",
        print_in_national_np: "",
        print_in_local_np: "",
        print_in_state_np: "",
        print_in_other_np: "",
        ip_address: formData.ip_address,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  // =========== Update Handler ==================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        financial_year,
        user_id,
        ref_id: rowData.ref_id,
      };

      await axios.put(
        `http://localhost:3080/api/client-advt-request/${rowData.ref_id}`,
        payload
      );

      setSavedRefId(rowData.ref_id);
      setShowModal(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error updating record");
    } finally {
      setLoading(false);
    }
  };

  // ============ Handle OK click → redirect ===================
  const handleOk = () => {
    setShowModal(false);

    navigate(`/upload-file/${savedRefId}`, {
      state: {
        ref_id: savedRefId,
        financial_year,
        user_id,
        user_name,
        subject: formData.subject,
      },
    });
  };

  return (
    <div className="container py-4">
      {/* Popup Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Success</h5>
              </div>

              <div className="modal-body text-center">
                <h5>
                  {action === "update"
                    ? "Record updated successfully!"
                    : "Data submitted successfully!"}
                </h5>
                <p className="fw-bold">Ref ID: {savedRefId}</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-success px-4" onClick={handleOk}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM UI */}
      <form
       
        className="row g-3"
      >
        <div className="col-12">
          <div className="card shadow-sm">
            {/* <div className="card-header bg-primary text-white">
              Basic Details
            </div> */}
            <div className="text-center mt-2">
              <label className="fw-bold">
                Financial Year: {financial_year}
              </label>
            </div>

            <div className="card-body row g-3">
              <div className="col-md-3">
                {/* <label className="form-label">Letter No</label> */}
                <input
                  type="text"
                  className="form-control"
                  name="letter_no"
                  placeholder="Letter No"
                  value={formData.letter_no}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3">
            
                <input
                  type="date"
                  style={{
                    opacity: 0,
                    position: "absolute",
                    pointerEvents: "none",
                  }}
                  ref={(el) => (window.letterDatePicker = el)}
                  min={(() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 7);
                    return d.toISOString().split("T")[0];
                  })()}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const [yyyy, mm, dd] = e.target.value.split("-");
                    const formatted = `${yyyy}-${mm}-${dd}`;

                    setFormData((prev) => ({
                      ...prev,
                      letter_date: formatted,
                    }));
                  }}
                />

                {/* --- Read-only visible input --- */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Letter Date"
                  value={formData.letter_date}
                  readOnly // <-- 🚀 USER CAN NEVER TYPE
                  onClick={() => window.letterDatePicker.showPicker()} // <-- opens calendar
                />
              </div>

              <div className="col-md-5">
                {/* <label className="form-label">Subject</label> */}
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                {/* --- Hidden real date picker for schedule_date --- */}
                <input
                  type="date"
                  style={{
                    opacity: 0,
                    position: "absolute",
                    pointerEvents: "none",
                  }}
                  ref={(el) => (window.scheduleDatePicker = el)}
                  //  Only allow FUTURE dates (tomorrow onwards)
                  min={(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split("T")[0];
                  })()}
                  onChange={(e) => {
                    const [yyyy, mm, dd] = e.target.value.split("-");
                    const formatted = `${yyyy}-${mm}-${dd}`;

                    setFormData((prev) => ({
                      ...prev,
                      schedule_date: formatted,
                    }));
                  }}
                />

                {/* --- Read-only visible input for schedule_date --- */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Schedule Date"
                  value={formData.schedule_date}
                  readOnly // user cannot type manually
                  onClick={() => window.scheduleDatePicker.showPicker()} // opens calendar
                />
              </div>

              {form_option && (
                <div className="col-md-3">
                  {/* <label className="form-label">Tender Amount</label> */}
                  <input
                    type="number"
                    placeholder="Tender Amount"
                    className="form-control"
                    name="tender_amt"
                    value={formData.tender_amt}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="col-md-3">
                {/* <label className="form-label">Category</label> */}

                <select
                  className="form-select"
                  name="ref_Category_id"
                  placeholder="Category"
                  value={formData.ref_Category_id}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedText =
                      e.target.options[e.target.selectedIndex].text;

                    setFormData((prev) => ({
                      ...prev,
                      ref_Category_id: selectedId,
                      ref_Category_text: selectedText,
                    }));
                  }}
                >
                  {!cat_text ? (
                    <option value="" hidden>
                      --select--
                    </option>
                  ) : (
                    <option value={cat_id}>{category_option}</option>
                  )}
                </select>
              </div>
            </div>

            {form_option && (
              <div>
                <div className="card-header bg-success text-white">
                  Enter Number of Papers
                </div>
                <div className="card-body row">
                  <div className="col-md-3 mb-3">
                    <input
                      placeholder="National Newspapers"
                      type="number"
                      className="form-control"
                      name="print_in_national_np"
                      value={formData.print_in_national_np}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input
                      placeholder="Local Newspapers"
                      type="number"
                      className="form-control"
                      name="print_in_local_np"
                      value={formData.print_in_local_np}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input
                      placeholder="State Newspapers"
                      type="number"
                      className="form-control"
                      name="print_in_state_np"
                      value={formData.print_in_state_np}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input
                      placeholder="Other Newspapers"
                      type="number"
                      className="form-control"
                      name="print_in_other_np"
                      value={formData.print_in_other_np}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="p-4">
              <label className="form-label fw-bold">Remarks</label>
              <textarea
                className="form-control"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="4"
                placeholder="Enter remarks here..."
              />
            </div>
          </div>
        </div>

        {/* dynamic button */}
        <div className="text-center mt-3">
          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={loading}
             onClick={action === "update" ? handleUpdate : handleSubmit}
          >
            {loading
              ? "Processing..."
              : action === "update"
              ? "Update Request"
              : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
