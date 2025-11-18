import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import RequestForm from "./requestForm";

const CreateNewRequest = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3080/api/createnewrequest");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold text-primary">
      Create New Request/Upload Your Work Order
      </h2>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading categories...</p>
        </div>
      ) : (
        <div className="row ">
          {/* Left Column: List of categories */}
          <div className="col-md-4 mt-4">
            <div className="list-group shadow-sm">
              {categories.map((item, index) => (
                <button
                  key={index}
                  className={`list-group-item list-group-item-action ${
                    selectedCategory?.cat_id === item.cat_id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(item)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold" style={{fontSize:"13px"}}>{item.cat_text}</span>
               
                  </div>
                </button>
              ))}
            </div>

          </div>

          {/* Right Column: Selected category details */}
          <div className="col-md-8">
          
            {selectedCategory && (
  <div className="card shadow-sm border-0 text-center">
    <div className="">
      <p className="fs-6">{selectedCategory.cat_text}</p>
      {/* <p>{selectedCategory.cat_id}</p> */}
    </div>
  </div>
)}

{/* request form start*/}

<RequestForm category={selectedCategory} />

{/* request form end */}


          </div>

        </div>
      )}
    </div>
  );
  
};

export default CreateNewRequest;
