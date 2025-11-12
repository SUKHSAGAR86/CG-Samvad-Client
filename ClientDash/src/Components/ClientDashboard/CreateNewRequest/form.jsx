import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ClientAdvtRequest = () => {
  const [formData, setFormData] = useState({
    subject: "",
    tender_amt: "",
    letter_no: "",
    letter_date: "",
    schedule_date: "",
    remarks: "",
    print_in_national_np: "",
    print_in_local_np: "",
    print_in_state_np: "",
    print_in_other_np: "",
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: "", type: "" });

    try {
      const res = await axios.post(
        "http://localhost:3080/api/insert/client-advt-request",
        formData
      );

      setAlert({ show: true, message: res.data.message, type: "success" });

      // Reset form after success
      setFormData({
        subject: "",
        tender_amt: "",
        letter_no: "",
        letter_date: "",
        schedule_date: "",
        remarks: "",
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

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4 text-primary fw-bold">
        Client Advertisement Request
      </h3>

      {alert.show && (
        <div className={`alert alert-${alert.type} text-center`} role="alert">
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Basic Details */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              Basic Details
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

              <div className="col-md-2">
                <label className="form-label">Letter Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="letter_date"
                  value={formData.letter_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Schedule Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="schedule_date"
                  value={formData.schedule_date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Publication Details */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              Publication Details
            </div>
            <div className="card-body">
              <div className="row">
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

              <div className="mt-3">
                <label className="form-label fw-bold">Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks here..."
                  rows="4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
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

export default ClientAdvtRequest;


