import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ClientDashboardLayout from "./Components/ClientDashboard/ClientDashboardLayout";
import Createnewrequest from "./Components/ClientDashboard/CreateNewRequest/Createnewrequest";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<ClientDashboardLayout/>} />
        <Route path="/" element={<Createnewrequest/>}/>
      </Routes>
    </Router>
  );
};

export default App;
