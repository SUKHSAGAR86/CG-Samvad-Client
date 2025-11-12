import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NICLOGO from "../../assets/images/256px-NIC_logo.svg.png";

const ClientFooter = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = "v1.0.0"; // Can be dynamic from package.json or env later

  return (
    <footer className="bg-dark text-white shadow-sm mt-auto py-3">
      <div className="container-fluid">
        <div className="row align-items-center text-center text-lg-start g-3">
          
          {/* Left - Copyright */}
          <div className="col-12 col-lg-4 d-flex justify-content-center justify-content-lg-start">
            <small>
              &copy; {currentYear} creativeLabs.{" "}
              <span className="ms-2">Version {appVersion}</span>
            </small>
          </div>

          {/* Center - Logo */}
          <div className="col-12 col-lg-4 d-flex justify-content-center">
            <img
              src={NICLOGO}
              alt="NIC Logo"
              className="footer-logo"
              style={{ height: "3rem", width: "auto" }}
            />
          </div>

          {/* Right - Powered by */}
          <div className="col-12 col-lg-4 d-flex justify-content-center justify-content-lg-end">
            <small>
              Powered by{" "}
              <a
                href="https://coreui.io/react"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none fw-semibold"
              >
                CoreUI React Client Template
              </a>
            </small>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default ClientFooter;
