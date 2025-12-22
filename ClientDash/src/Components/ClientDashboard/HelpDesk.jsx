import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/Helpdesk.css";

const HelpDesk = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="contact-hero text-white d-flex align-items-center rounded">
        <div className="container text-center rounded-2">
          {/* <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <h6 className="fw-bold display-4 mb-3">Contact Us</h6>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </p>
            </div>

            <div className="col-md-6 d-flex justify-content-center justify-content-md-end mt-4 mt-md-0">
              <div className=""></div>
            </div>
          </div> */}

          <h4 className="display-6 fw-bold mb-3">Help Desk</h4>
          <p className="">
            Chhattisgarh Samvad is a State Autonomous Body functioning under the
            Public Relations Department, Government of Chhattisgarh. We serve as
            a vital communication bridge between the government and the people,
            delivering information with clarity, creativity, and credibility.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-fluid my-5">
        <div className="contact-card row g-5">
          {/* Map Section */}
          <div className="col-md-6">
            <h4 className="section-title">Get in Touch</h4>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13225.522867424197!2d81.78542175306981!3d21.162642099053688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dda41095263b%3A0x89e7badb08640628!2sChhattisgarh%20Samvad!5e1!3m2!1sen!2sin!4v1766402370339!5m2!1sen!2sin"
              className="map"
            ></iframe>
          </div>

          {/* Contact Info + Form */}
          <div className="col-md-6">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>

            {/* Contact Info */}
            <div className="contact-info mb-4">
              <div className="contact-item">
                <i class="bi-geo-alt-fill me-2"></i>
                North Block Sector-19, Atal Nagar(New Raipur),Chhattisgarh
              </div>
              <div className="contact-item">
                <span className="contact-icon"></span>
                <span>+1 (331) 456 7890</span>
              </div>
              <div className="contact-item">
                <span className="bi bi-envelope-at-fill me-2"></span>
                <span>cgsamvad[at]gmail[dot]com</span>
              </div>

              <div className="contact-item">
                <span className="contact-icon"></span>
                <span>Mon - Fri (10: AM - 5:00 PM)</span>
              </div>
            </div>

            {/* Form */}
            <h5 className="mb-3">Send us a message</h5>
            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-control" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows="4"></textarea>
              </div>

              <button type="submit" className="btn submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpDesk;
