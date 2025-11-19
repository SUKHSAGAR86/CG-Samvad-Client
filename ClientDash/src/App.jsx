import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ClientDashboardLayout from "./Components/ClientDashboard/ClientDashboardLayout";
import ClientNoticeBoard from "./Components/ClientDashboard/ClientNoticeBoard";
import CreateNewRequest from "./Components/ClientDashboard/CreateNewRequest/Createnewrequest";
import RequestForm from "./Components/ClientDashboard/CreateNewRequest/requestForm";
import ViewRequests from "./Components/ClientDashboard/CreateNewRequest/get";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientDashboardLayout />} />
        <Route path="/requestform" element={<RequestForm />} />
        <Route path="/notice" element={<ClientNoticeBoard />} />
        <Route path="/newrequest" element={<CreateNewRequest />} />
        <Route path="/get" element={<ViewRequests/>}/>
        {/* <Route path="/newsratelist" element={<NewsRatesList />} /> */}

        
      </Routes>
    </Router>
  );
};

export default App;
