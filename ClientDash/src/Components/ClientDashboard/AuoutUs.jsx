// import React from "react";

// import "./Styles/AboutUs.css"
// function AboutUs() {
//   return (
//     <>

// {/* Hero Section */}
// <section className="about-hero d-flex align-items-center text-center text-white">
//   <div>
//     <h1 className="display-4 fw-bold mb-3">About Us</h1>
//     <p className="lead fw-medium">
//       Chhattisgarh Samvad is a State Autonomous Body functioning under the
//       Public Relations Department, Government of Chhattisgarh. We serve as a
//       vital communication bridge between the government and the people,
//       delivering information with clarity, creativity, and credibility.
//     </p>
//   </div>
// </section>

// {/* Content Section */}
// <section>
//   <div className="bg-white p-4 p-md-5 rounded-4">

//     <h5 className="mb-3 fw-bold">Who We Are</h5>
//     <p className="text-muted fs-6 mb-4">
//       Chhattisgarh Samvad works across diverse sectors of advertising and
//       publication, combining strategic planning with creative innovation
//       to effectively communicate government initiatives to the public.
//     </p>

//     <h5 className="mb-3 fw-bold">What We Do</h5>
//     <ul className="text-muted fs-6 mb-4">
//       <li className="mb-2">Classified Advertisements for targeted and effective outreach</li>
//       <li className="mb-2">Display Advertisements with impactful visual communication</li>
//       <li className="mb-2">Hoardings &amp; Billboard Advertisements for large-scale public visibility</li>
//       <li className="mb-2">
//         Publication Services including newspapers, calendars, books,
//         advertorials, and pamphlets — from design to final publication
//       </li>
//       <li>
//         Video and Ad-Film Production to bring stories and messages to life
//         through powerful visuals
//       </li>
//     </ul>

//     <p className="text-muted fs-6">
//       With a strong commitment to transparency, reliability, and public
//       interest, Chhattisgarh Samvad continues to strengthen government
//       communication through innovative and impactful media solutions.
//     </p>

//   </div>
// </section>

//     </>
//   );
// }

// export default AboutUs;

import React from "react";
import "./Styles/AboutUs.css";

function AboutUs() {
  const services = [
    {
      title: "Classified",
      description:
        "Classified Advertisements for targeted and effective outreach",
      bgImage:
        "https://media.geeksforgeeks.org/wp-content/uploads/20240311171916/classified-advertising-copy.webp",
    },
    {
      title: "Display",
      description: "Display Advertisements with impactful visual communication",
      bgImage:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPg_XjcwML2RXgTolN7uXXNQeVvkFfRzXAHA&s",
    },
    {
      title: "Hoardings & Billboard",
      description:
        "Hoardings & Billboard Advertisements for large-scale public visibility",

      bgImage: "https://cdn.downtoearth.org.in/dte/userfiles/images/57.jpg",
    },

    {
      title: "Publication",
      description:
        "Publication Services including newspapers, calendars, books, advertorials,and pamphlets — from design to final publication",
      bgImage:
        "https://hariomad.com/blog/wp-content/uploads/2022/02/newspaper-advertising-service-500x500-1.png",
    },
    {
      title: "Video and Ad-Film Production",
      description:
        "Video and Ad-Film Production to bring stories and messages to life through powerful visuals",
      bgImage: "https://i.ytimg.com/vi/a1RlMXYXfyE/hqdefault.jpg?v=6800634e",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="about-hero d-flex align-items-center text-center text-white">
        <div>
          <h1 className="display-4 fw-bold mb-3">About Us</h1>
          <p className="lead fw-medium">
            Chhattisgarh Samvad is a State Autonomous Body functioning under the
            Public Relations Department, Government of Chhattisgarh. We serve as
            a vital communication bridge between the government and the people,
            delivering information with clarity, creativity, and credibility.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section>
        <div className="bg-white p-md-5 rounded-4">
          <h5 className="mb-3 fw-bold">Who We Are</h5>
          <p className="text-muted fs-6 mb-4">
            Chhattisgarh Samvad works across diverse sectors of advertising and
            publication, combining strategic planning with creative innovation
            to effectively communicate government initiatives to the public.
          </p>

          <h5 className="mb-3 fw-bold">What We Do</h5>

          {/* Cards Section */}
          <div className="row g-4 mb-4">
            {services.map((service, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div
                  className="card text-white shadow service-card "
                  style={{
                    backgroundImage: `url('${service.bgImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="card-header text-center fw-bold fs-6">
                    {service.title}
                  </div>
                  <div className="card-body service-body d-flex align-items-center justify-content-center">
                    <p className="card-text text-center">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-muted fs-6 text-center mt-5">
            With a strong commitment to transparency, reliability, and public
            interest, Chhattisgarh Samvad continues to strengthen government
            communication through innovative and impactful media solutions.
          </p>
        </div>
      </section>
    </>
  );
}

export default AboutUs;
