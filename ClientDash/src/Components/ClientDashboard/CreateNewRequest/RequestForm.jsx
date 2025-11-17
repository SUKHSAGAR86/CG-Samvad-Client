import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const RequestForm = ({category}) => {

// create by default session (localStorage)
useEffect(()=>{
  if(!localStorage.getItem("financial_year")){
    localStorage.setItem("finacial_year","2025-2026");
  }
},[]);

const financial_year=localStorage.getItem("financial_year");

// =================session (localStorage) CLOSE AREA========================


const cat_text = category?.cat_text || '';
let category_option = cat_text.split('-')[0].trim();

// Determine form option based on category
// true - all otpoins visible
// false - only selected options visible
let form_option = false;
if(category_option.toLowerCase() === 'classified'){
  form_option = true;
}else if(category_option.toLowerCase() === 'display'){
   form_option = true;
}else{
  form_option = false;
}

  

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
       //  ADD financial_year in payload
       const payload={
        ...formData,
        financial_year:financial_year // << added here
       }
      //  ADD financial_year in payload
       
      const res = await axios.post(
        "http://localhost:3080/api/insert/client-advt-request",
payload
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
{/* show financial_year static */}

<div className="text-center">
  <label className="form-lable fw-bold">Financial Year</label>

      {financial_year}
</div>
{/* =================================== */}

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

            { form_option && <div className="col-md-3">
                <label className="form-label">Tender Amount</label>
                <input
                  type="number"
                  className="form-control"
                  name="tender_amt"
                  value={formData.tender_amt}
                  onChange={handleChange}
                />
              </div>}

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
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <select className="form-select" name="name" id="category">
                 { !cat_text ? ( <option hidden>--select--</option>) : (<option value={cat_text}>{category_option}</option>)
                 }
                </select>
              </div>
            </div>
            {/* Publication Details */}
        <div className="col-12">
         {form_option&& <div className="">
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

             
            </div>
          </div>}
           <div className="mt-3 p-4">
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

export default RequestForm;

