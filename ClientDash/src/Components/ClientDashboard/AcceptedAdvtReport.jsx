import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/AcceptedAdvtReport.css";

const AcceptedAdvtReport = () => {
  const [form, setForm] = useState({
    district: "",
    date: "",
    financialYear: "2024-2025",
    year: "",
    month: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      district: "",
      date: "",
      financialYear: "2024-2025",
      year: "",
      month: "",
    });
  };

  return (
    <div className="report-container d-flex justify-content-center">
      <div className="report-card p-4 shadow-lg">
        <h4 className="text-center report-title mb-4">Accepted Advertisement Report</h4>

        <div className="row g-3">
          {/* District */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">District</label>
            <select
              name="district"
              className="form-select modern-input"
              value={form.district}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="A">District A</option>
              <option value="B">District B</option>
            </select>
          </div>

          {/* Date */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Date</label>
            <input
              type="date"
              name="date"
              className="form-control modern-input"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          {/* Financial Year */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Financial Year</label>
            <select
              name="financialYear"
              className="form-select modern-input"
              value={form.financialYear}
              onChange={handleChange}
            >
              <option>2023-2024</option>
              <option>2024-2025</option>
              <option>2025-2026</option>
            </select>
          </div>

          {/* Year */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Year</label>
            <select
              name="year"
              className="form-select modern-input"
              value={form.year}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
            </select>
          </div>

          {/* Month */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Month</label>
            <select
              name="month"
              className="form-select modern-input"
              value={form.month}
              onChange={handleChange}
            >
              <option value="">-- Select Month --</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="text-center mt-4">
          <button className="btn btn-primary px-4 modern-btn me-2">Go</button>
          <button className="btn btn-outline-secondary px-4 modern-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptedAdvtReport;
