import React from "react";
import Header from "../Components/Header";
import Rightcontainer from "../Components/Rightcontainer";

const Support = () => {
  return (
    <div>
      <div
        className="leftContainer"
        style={{ minHeight: "100vh", height: "100%" }}
      >
        <div className="cxy flex-column " style={{ paddingTop: "16%" }}>
          <img
            src={process.env.PUBLIC_URL + "/Images/contact_us.png"}
            width="280px"
            alt=""
          />
          <div
            className="games-section-title mt-4"
            style={{ fontSize: "1.2em", fontWeight: "700", color: "2c2c2c" }}
          >
            Contact us at below platforms.
          </div>
          <div
            className="games-section-title mt-4"
            style={{ fontSize: "1.2em", fontWeight: "700", color: "2c2c2c" }}
          >
            Beting,Kyc,Support
          </div>
          <div className="row justify-content-center">
            <div className="col-4  d-flex justify-content-around w-80">
              <a className="cxy flex-column" href="https://shorturl.at/ADJKZ">
                <img
                  width="140px"
                  src={process.env.PUBLIC_URL + "/Images/whatsapp-button.png"}
                  alt=""
                />
              </a>
            </div>
          </div>{" "}
          <div className="row justify-content-center">
            <div className="col-4  d-flex justify-content-around w-80">
              <a
                className="cxy flex-column"
                href="https://instagram.com/ludo57official?igshid=MzMyNGUyNmU2YQ%3D%3D&utm_source=qr"
              >
                INSTAGRAM
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </div>
  );
};

export default Support;
