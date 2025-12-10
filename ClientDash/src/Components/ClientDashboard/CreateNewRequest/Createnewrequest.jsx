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
    <div className="container ">
      <h4 className="text-center mb-4 fw-bold text-primary">
      Choose Job Request Type
      </h4>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading categories...</p>
        </div>
      ) : (
        <div className=" ">
       


  {/* <div className="d-flex align-items-center justify-content-center flex-wrap gap-4 mt-3 mb-3 ">

  {categories.map((item, index) => (
    <div
      key={index}
      className="d-flex align-items-center me-4"
      style={{ cursor: "pointer" }}
      onClick={() => setSelectedCategory(item)}
    >
      <input
        type="radio"
        name="categorySelect"
        className="form-check-input"
        checked={selectedCategory?.cat_id === item.cat_id}
        onChange={() => setSelectedCategory(item)}
      />

      <span className="ms-2 fw-semibold" style={{ fontSize: "14px" }}>
        {item.cat_text ? item.cat_text.split("-")[0].trim() : ""}
      </span>
    </div>
  ))}

</div> */}


<div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mt-4 mb-4">
  {categories.map((item, index) => {
    // 1. Check if the current item is the selected one
    const isSelected = selectedCategory?.cat_id === item.cat_id;
    
    // 2. Extract the display text (e.g., "Category A" from "Category A-details")
    const displayText = item.cat_text ? item.cat_text.split("-")[0].trim() : "";
    
   
    const buttonClasses = isSelected 
      ? 'btn btn-primary shadow-sm' 
      : 'btn btn-dark'; 

    return (
      <button
        key={index}
        // Use a standard Bootstrap button structure
        className={`${buttonClasses} rounded-pill fw-semibold`}
        style={{ fontSize: "14px", transition: "all 0.2s" }} // Add a smooth transition
        onClick={() => setSelectedCategory(item)}
      >
        {displayText}
      </button>
    );
  })}
</div>



          {/* Right Column: Selected category details */}
          <div className="row">
          
            {selectedCategory && (
  <div className="card shadow-sm border-0 text-center pt-3">
    <div className="">
      <h5 className="fs-6 card-header rounded-5 fw-bold" style={{color:"white", background:"#000000ff"}}>{selectedCategory.cat_text}</h5>
   <RequestForm category={selectedCategory} />
    </div>
  </div>
)}

{/* request form start*/}



{/* request form end */}


          </div>

        </div>
      )}
    </div>
  );
  
};

export default CreateNewRequest;
