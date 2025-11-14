import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ClientDashboardLayout from "./Components/ClientDashboard/ClientDashboardLayout";
import Createnewrequest from "./Components/ClientDashboard/CreateNewRequest/Createnewrequest";
import ClientAdvtRequest from "./Components/ClientDashboard/CreateNewRequest/form";
import ClientNoticeBoard from "./Components/ClientDashboard/ClientNoticeBoard";
import NewsRatesList from "./Components/ClientDashboard/NewsRateList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<ClientDashboardLayout />} />
        <Route path="/" element={<ClientAdvtRequest />} />
        <Route path="/notice" element={<ClientNoticeBoard />} />
        <Route path="/newsratelist" element={<NewsRatesList />} />
      </Routes>
    </Router>
  );
};

export default App;
