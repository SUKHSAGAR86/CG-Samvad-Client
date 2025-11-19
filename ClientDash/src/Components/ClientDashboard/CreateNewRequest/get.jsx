// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./gtt.css";

// const ViewRequests = () => {
//   const financial_year = localStorage.getItem("financial_year");
//   const user_id = localStorage.getItem("user_id");
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios
//       .post("http://localhost:3080/api/client-advt-request", {
//         action: "get",
//         financial_year,
//         user_id,
//       })
//       .then((res) => setData(res.data.data));
//   }, []);

//   const handleEdit = async (ref_id) => {
//     const response = await axios.post(
//       "http://localhost:3080/api/client-advt-request",
//       {
//         action: "get_by_id",
//         ref_id,
//         financial_year,
//         user_id,
//       }
//     );

//     const rowData = response.data.data[0];

//     navigate(`/edit-request/${ref_id}`, {
//       state: {
//         action: "update",
//         rowData,
//       },
//     });
//   };

//   return (
//     <div className="container p-4">
//       <h4 className="text-white mb-3">All Requests</h4>

//       <div className="table-responsive shadow-sm rounded">
//         <table className="table table-custom table-bordered">
//           <thead>
//             <tr>
//               <th>Ref ID</th>
//               <th>Subject</th>
//               <th>Letter No</th>
//               <th>Category</th>
//               <th>Letter Date</th>
//               <th>Scheduled Publish Date</th>
//               <th>Attachment</th>
//               <th>Action</th>
//               <th>Forward To Samvad</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((row) => (
//               <tr key={row.ref_id}>
//                 <td>{row.ref_id}</td>
//                 <td>{row.subject}</td>
//                 <td>{row.letter_no}</td>
//                 <td>{row.ref_Category_text}</td>
//                 <td>{row.letter_date}</td>
//                 <td>{row.schedule_date}</td>
//                 <td>—</td>

//                 <td>
//                   <span
//                     className="btn btn-warning btn-sm action-btn me-2"
//                     onClick={() => handleEdit(row.ref_id)}
//                   >
//                     Edit
//                   </span>

//                   <span className="btn btn-danger btn-sm action-btn">
//                     Delete
//                   </span>
//                 </td>

//                 <td className="text-center">
//                   <input className="form-check-input" type="checkbox" />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ViewRequests;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./gtt.css";

const ViewRequests = () => {
  const financial_year = localStorage.getItem("financial_year");
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  // ================================
  // Fetch All Requests
  // ================================
  const fetchData = () => {
    axios
      .post("http://localhost:3080/api/client-advt-request", {
        action: "get",
        financial_year,
        user_id,
      })
      .then((res) => setData(res.data.data))
      .catch((err) => console.error("Fetch Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================================
  // Edit Handler
  // ================================
  const handleEdit = async (ref_id) => {
    try {
      const response = await axios.post(
        "http://localhost:3080/api/client-advt-request",
        {
          action: "get_by_id",
          ref_id,
          financial_year,
          user_id,
        }
      );

      const rowData = response.data.data[0];

      navigate(`/${ref_id}`, {
        state: {
          action: "update",
          rowData,
        },
      });
    } catch (error) {
      console.error("Edit Error:", error);
    }
  };

  // ================================
  // Delete Handler
  // ================================
  const handleDelete = async (ref_id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3080/api/client-advt-request",
        {
          action: "delete",
          ref_id,
          financial_year,
          user_id,
        }
      );

      if (res.data.success) {
        alert("Request deleted successfully!");
        fetchData(); // reload table
      } else {
        alert("Failed to delete!");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Error deleting request.");
    }
  };

  return (
    <div className="container p-4">
      <h4 className="text-white mb-3">All Requests</h4>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-custom table-bordered">
          <thead>
            <tr>
              <th>Ref ID</th>
              <th>Subject</th>
              <th>Letter No</th>
              <th>Category</th>
              <th>Letter Date</th>
              <th>Scheduled Publish Date</th>
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
                <td>{row.letter_date}</td>
                <td>{row.schedule_date}</td>
                <td>—</td>

                <td>
                  <span
                    className="btn btn-warning btn-sm action-btn me-2"
                    onClick={() => handleEdit(row.ref_id)}
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

export default ViewRequests;
