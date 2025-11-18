
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const RequestForm = ({ category }) => {
  /* ---------------------------------------
     Create session values in localStorage
  -----------------------------------------*/
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

  /* ---------------------------------------
     Category Handling
  -----------------------------------------*/
  const cat_text = category?.cat_text || "";
  const category_option = cat_text ? cat_text.split("-")[0].trim() : "";
  const cat_id = category?.cat_id || ""; // FIXED 🔥

  let form_option =
    category_option.toLowerCase() === "classified" ||
    category_option.toLowerCase() === "display"
      ? true
      : false;

  /* ---------------------------------------
     Auto-set category in formData
  -----------------------------------------*/
  useEffect(() => {
    if (cat_text) {
      setFormData((prev) => ({
        ...prev,
        ref_Category_text: category_option,
        ref_Category_id: cat_id,
      }));
    }
  }, [cat_text]);

  /* ---------------------------------------
     Form State
  -----------------------------------------*/
  const [formData, setFormData] = useState({
    subject: "",
    tender_amt: "",
    letter_no: "",
    letter_date: "",
    schedule_date: "",
    ref_Category_id: "",
    ref_Category_text: "",
    remarks: "",
    print_in_national_np: "",
    print_in_local_np: "",
    print_in_state_np: "",
    print_in_other_np: "",
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  /* ---------------------------------------
    Handle Change
  -----------------------------------------*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /* ---------------------------------------
    Submit Form
  -----------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: "", type: "" });

    try {
      const payload = {
        ...formData,
        financial_year: financial_year,
        user_id: user_id,
      };

      const res = await axios.post(
        "http://localhost:3080/api/insert/client-advt-request",
        payload
      );

      setAlert({ show: true, message: res.data.message, type: "success" });

      // Reset
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
      });
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || "Error submitting form",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------
    UI
  -----------------------------------------*/
  return (
    <div className="container py-4">
      {alert.show && (
        <div className={`alert alert-${alert.type} text-center`} role="alert">
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              Basic Details
            </div>

            {/* Financial Year Static View */}
            <div className="text-center mt-2">
              <label className="fw-bold">Financial Year: {financial_year}</label>
            </div>

            <div className="card-body row g-3">
              <div className="col-md-3">
                <label className="form-label">Letter No</label>
                <input
                  type="text"
                  className="form-control"
                  name="letter_no"
                  value={formData.letter_no}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-5">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              {form_option && (
                <div className="col-md-3">
                  <label className="form-label">Tender Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tender_amt"
                    value={formData.tender_amt}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="col-md-3">
                <label className="form-label">Letter Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="letter_date"
                  value={formData.letter_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Schedule Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="schedule_date"
                  value={formData.schedule_date}
                  onChange={handleChange}
                />
              </div>

              {/* Category */}
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="ref_Category_text"
                  value={formData.ref_Category_text}
                  onChange={handleChange}
                >
                  {!cat_text ? (
                    <option hidden>--select--</option>
                  ) : (
                    <option value={category_option}>{category_option}</option>
                  )}
                </select>
              </div>

              {/* Category ID */}
              <div className="col-md-3">
                <label className="form-label">Category ID</label>
                <select
                  className="form-select"
                  name="ref_Category_id"
                  value={formData.ref_Category_id}
                  onChange={handleChange}
                >
                  {!cat_text ? (
                    <option hidden>--select--</option>
                  ) : (
                    <option value={cat_id}>{cat_id}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Publication Details */}
            {form_option && (
              <div className="">
                <div className="card-header bg-success text-white">
                  Publication Details
                </div>
                <div className="card-body row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">National Newspapers</label>
                    <input
                      type="number"
                      className="form-control"
                      name="print_in_national_np"
                      value={formData.print_in_national_np}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Local Newspapers</label>
                    <input
                      type="number"
                      className="form-control"
                      name="print_in_local_np"
                      value={formData.print_in_local_np}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">State Newspapers</label>
                    <input
                      type="number"
                      className="form-control"
                      name="print_in_state_np"
                      value={formData.print_in_state_np}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Other Newspapers</label>
                    <input
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

        <div className="text-center mt-3">
          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;

