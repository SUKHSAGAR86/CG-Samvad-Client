
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./gtt.css";

const ForwardTo = () => {
  const financial_year = localStorage.getItem("financial_year");
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const [data, setData] = useState([]);

  // =============Fetch All Requests (GET API)===================
  const fetchData = () => {
    axios
      .get("http://localhost:3080/api/get-client-advt-request", {
        params: {
          financial_year,
          user_id,
        },
      })
      .then((res) => {
        setData(res.data); // controller returns recordset directly
      })
      .catch((err) => console.error("Fetch Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============Edit Handler====================
const handleEdit = async (ref_id) => {
  try {
    const response = await axios.get(
      `http://localhost:3080/api/get-client-advt-request/${ref_id}`,
      {
        params: {
          financial_year,
          user_id,
        },
      }
    );

    const rowData = response.data;

    navigate("/", {
      state: {
        action: "update",
        rowData,
      },
    });
  } catch (error) {
    console.error("Edit Error:", error);
  }
};

  // =================DELETE HANDLER ===============
const handleDelete = async (ref_id) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    const res = await axios.delete(
      `http://localhost:3080/api/client-advt-request/${ref_id}`,
      {
        data: {
          ref_id,
          financial_year,
          user_id,
          action: "delete",
        },
      }
    );

    if (res.data.status === 1) {
      setData((prev) => prev.filter((row) => row.ref_id !== ref_id));
      alert(`Deleted successfully (Ref ID: ${ref_id})`);
    } else {
      alert("Delete failed");
    }
  } catch (err) {
    console.error("Delete Error:", err);
    alert("Server error");
  }
};

  return (
    <div className="container p-4">
      <h4 className="text-danger text-center mb-3">
        <span>Forward To Samvad </span>
        <span className="bi bi-forward-fill text-danger"></span>
      </h4>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-custom table-bordered table-striped ">
          <thead>
            <tr>
              <th>Ref ID</th>
              <th>Subject</th>
              <th>Letter No</th>
              <th>Category</th>
              <th>Letter Date</th>
              <th>Scheduled Publish Date</th>
              <th>Tender Amt</th>
              <th>Attachment</th>
              <th>Action</th>
              <th>Forward To Samvad</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.ref_id}>
                <td>{row.ref_id}</td>
                <td>{row.subject}</td>
                <td>{row.letter_no}</td>
                <td>{row.ref_Category_text}</td>
                <td>{formatDate(row.letter_date)}</td>
                <td>{formatDate(row.schedule_date)}</td>
                <td>{row.tender_amt}</td>
                <td>—</td>

                <td>
                  <span
                    className="btn btn-warning btn-sm action-btn me-2"
                    onClick={() =>{ 
                      console.log("",row.ref_id)
                      handleEdit(row.ref_id)}}
                  >
                    Edit
                  </span>

                  <span
                    className="btn btn-danger btn-sm action-btn"
                    onClick={() => handleDelete(row.ref_id)}
                  >
                    Delete
                  </span>
                </td>

                <td className="text-center">
                  <input className="form-check-input" type="checkbox" />
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ForwardTo;

