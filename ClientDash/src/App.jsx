import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ClientDashboardLayout from "./Components/ClientDashboard/ClientDashboardLayout";
import ClientNoticeBoard from "./Components/ClientDashboard/ClientNoticeBoard";
import CreateNewRequest from "./Components/ClientDashboard/CreateNewRequest/Createnewrequest";
import RequestForm from "./Components/ClientDashboard/CreateNewRequest/requestForm";

import ForwardTo from "./Components/ClientDashboard/CreateNewRequest/forwordTo";
import NewsRatesList from "./Components/ClientDashboard/NewsRateList";
import ClientFileUpload from "./Components/ClientDashboard/CreateNewRequest/ClientFileUpload";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientDashboardLayout />} />
        <Route path="/requestform" element={<RequestForm />} />
        <Route path="/notice" element={<ClientNoticeBoard />} />
        <Route path="/newrequest" element={<CreateNewRequest />} />
        <Route path="/forwardto" element={<ForwardTo />} />
        <Route path="/newsratelist" element={<NewsRatesList />} />
        {/* <Route path="/"element={<ClientFileUpload/>}/> */}
      </Routes>
    </Router>
  );
};

export default App;
