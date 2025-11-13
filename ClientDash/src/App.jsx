import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ClientDashboardLayout from "./Components/ClientDashboard/ClientDashboardLayout";
import Createnewrequest from "./Components/ClientDashboard/CreateNewRequest/Createnewrequest";
import ClientAdvtRequest from "./Components/ClientDashboard/CreateNewRequest/form";
import ClientNoticeBoard from "./Components/ClientDashboard/ClientNoticeBoard/ClientNoticeBoard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<ClientDashboardLayout/>} />
        <Route path="/" element={<ClientAdvtRequest/>}/>
        <Route path="noticeboard"element={<ClientNoticeBoard/>}/>
      </Routes>
    </Router>
  );
};

export default App;
