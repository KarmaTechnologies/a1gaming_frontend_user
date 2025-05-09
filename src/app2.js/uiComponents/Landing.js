import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Link,
  //    NavLink, useHistory, useLocation
} from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

//import Swal from "sweetalert2";
import "../css/landing.css";
import {Collapse } from "react-bootstrap";
//import Rightcontainer from "../Components/Rightcontainer";
import Downloadbutton from "../Components/Downloadbutton";
import Header from "../Components/Header";
import AdBanner from "../uiComponents/AdBanner";

export default function Landing() {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState("");
  var baseUrl;
  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }
  const [open, setOpen] = useState(false);
  const [userAllData, setUserAllData] = useState();
  const [WebSitesettings, setWebsiteSettings] = useState("");
  const fetchData = async () => {
    const response = await fetch(baseUrl + "settings/data");
    const data = await response.json();
    return setWebsiteSettings(data);
  };

  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(baseUrl + `me`, { headers })
      .then((res) => {
        setUserAllData(res.data);
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          //window.location.href = "/login";
          //window.location.reload()
          //history.push("/login")
        }
      });
  };

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    access_token = localStorage.getItem("token");
    if (!access_token) {
      //window.location.reload()
    }
    role();
    fetchData();
  }, []);
  const handleWhatsAppClick = () => {
    setShowModal(true);
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    const number = WebSitesettings.whatsapp || "9588958166"; // Fallback to default number if not in settings
    let message = "";

    switch (issue) {
      case "deposit":
        message = `A1Gaming 🆔 Number - ${userAllData.Phone}\n\nपेमेंट जमा करने मैं समस्या/ Deposit Problem`;
        break;
      case "withdraw":
        message = `A1Gaming 🆔 Number - ${userAllData.Phone}\n\nपेमेंट निकालने मैं समस्या/ Withdrawal Problem`;
        break;
      case "game":
        message = `A1Gaming 🆔 Number - ${userAllData.Phone}\n\nगेम क्लियर नही हुआ / Game Problem`;
        break;
      default:
        break;
    }

    const whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
    setShowModal(false); // Close the modal after selection
  };
  return (
    <>
      <Header user={userAllData} />
     <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Your Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            variant="outline-primary"
            className="mb-3 w-100"
            onClick={() => handleIssueSelect("deposit")}
          >
         पेमेंट जमा करने मैं समस्या/ Deposit Problem
          </Button>
          <Button
            variant="outline-primary"
            className="mb-3 w-100"
            onClick={() => handleIssueSelect("withdraw")}
          >
           पेमेंट निकालने  मैं समस्या/ Withdrawal Problem
          </Button>
          <Button
            variant="outline-primary"
            className="mb-3 w-100"
            onClick={() => handleIssueSelect("game")}
          >
            गेम क्लियर नही हुआ / Game Problem
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="leftContainer">
     
        <div className="main-area" style={{ paddingTop: "60px" }}>
          <div className="collapseCard-container">
     
            <div className="collapseCard">
              <Link to={"#"} style={{ textDecoration: "none" }}>
                <div
                  className="collapseCard-body"
                  style={{
                    height: "64px",
                    opacity: 1,
                    transition: "height 0.3s ease 0s, opacity 0.3s ease 0s",
                  }}
                >
                  <div className=" collapseCard-text text-dark">
                    {" "}
                    <span className=" text-success">
                        1% Referral Commission
                    </span>
                  </div>
                  
                  
                </div>

              </Link>

              <div
                className="collapseCard-header"
                style={{ left: "22px", transition: "left 0.3s ease 0s" }}
              >
                <picture>
                  <img
                    height="10px"
                    width="14px"
                    src="/Images/LandingPage_img/global-rupeeIcon.png"
                    alt=""
                  />
                </picture>
                
                <div className="collapseCard-title ml-1 mt-1">Refer & Earn</div>
                
              </div>
              
            </div>
           
          </div>
          
          
        
         <AdBanner  WebSitesettings={WebSitesettings} />
        
{/*
          <div className="gameCard pt-2 " >
                    <h5 className="d-none pt-2  text-danger d-block text-center">
                   सभी प्लेयर ध्यान दे क्लासिक वाले रूम कोड क्लासिक में दे पॉपुलर वाले रूम कोड पॉपुलं में दे धन्यवाद

        |  किसी भी समस्या के लिए व्हाट्सप्प पर कांटेक्ट करे। 8595014114  
        </h5>
                </div>
                
   */}       
  
          <section className="games-section p-3">
          
            <div className="d-flex align-items-center games-section-title">
              Our Tournaments
            </div>
            <div className="games-section-headline mt-2 mb-1">
              <div className="games-window ">
                 {/*  /Homepage/Ludo%20Classics*/}
                <Link
                  className="gameCard-container mb-2" to={`/Homepage/ludo-classic-light-mode`} >
                  <span className="d-none blink text-danger d-block text-right">
                    ◉ LIVE
                  </span>
                  <picture className="gameCard-image">
                    <img
                      width="100%"
                      src={
                        process.env.PUBLIC_URL +
                        "/Images/LandingPage_img/ludo-classic-lite.webp"
                      }
                      alt=""
                    />
                  </picture>
                  <div className="gameCard-title">
                    <span className="d-none  text-success d-block text-right">
                      ◉ Lite Mode (₹10 से ₹25,000)
                    </span>
                  </div>
                  <div className="goverlay">
                    <div className="text">Comming Soon</div>
                  </div>
                </Link>

                {/* <Link className="gameCard-container" to={`/Homepage/Ludo%20Popular`}> */}
                <Link className="gameCard-container mb-2" to={`/Homepage/ludo-classic-rich-mode`}>
                  <span className="d-none blink text-danger d-block text-right">
                    ◉ LIVE
                  </span>
                  <picture className="gameCard-image">
                    <img
                      width="100%"
                      src={
                        process.env.PUBLIC_URL +
                        "/Images/LandingPage_img/ludo-classic-rich.webp"
                      }
                      alt=""
                    />
                  </picture>
                  <div className="gameCard-title">
                    <span className="d-none  text-success  d-block text-right">
                      ◉ Rich Mode (₹25k से ₹100k)
                    </span>
                  </div>
                  <div className="goverlay">
                    <div className="text">Comming Soon</div>
                  </div>
                </Link>

                {/* <Link className="gameCard-container" to={`/Homepage/Ludo%201%20Goti`}> */}
                
                <Link className="gameCard-container mt-4" to={``}>
                                        <span className="d-none blink text-danger d-block text-right">◉ Comming soon</span>
                                        <picture className="gameCard-image">
                                            <img width="100%" src={process.env.PUBLIC_URL + '/Images/LandingPage_img/a1-ludo.webp'} alt="" />
                                        </picture>
                                       
                    <div className="gameCard-title">
                                            <span className="d-none  text-success d-block text-right">◉ A1 Ludo </span>

                                        </div>
                                        <div className="goverlay">
                                            <div className="text">Comming Soon</div>
                                        </div>
                                    </Link> 

                {/* <Link className="gameCard-container" to={`/Homepage/Ludo%20Ulta`} > */}
                
                 <Link className="gameCard-container mt-4" to={``} >
                                        <span className="d-none blink text-danger d-block text-right">◉ Comming soon </span>
                                        <picture className="gameCard-image">
                                            <img width="100%" src={process.env.PUBLIC_URL + '/Images/LandingPage_img/a1-rummy.webp'} alt="" />

                                        </picture>
                                        <div className="gameCard-title">
                                            <span className="d-none  text-success d-block text-right">◉ A1 Rummy </span>

                                        </div>

                                        <div className="goverlay">
                                            <div className="text">Comming Soon</div>
                                        </div>

                                    </Link> 
              </div>
                 <div
        
        target="_blank"
        onClick={handleWhatsAppClick}
    
        className="whatsapp-fixed"
      >
        <img
          src={process.env.PUBLIC_URL + "/Images/whatsapp.png"}
          alt="WhatsApp"
          width="50px"
          height="50px"
        />
      </div>
            </div>
               
          </section>
          
          <section className="footer">
            <div className="footer-divider" />
            <a
              className="px-3 py-4 d-flex align-items-center"
              href="#!"
              style={{ textDecoration: "none" }}
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              <picture className="icon">
                <img
                  src="/a1gaming-logo.webp"
                  width="56px"
                  height="56px"
                  alt="profile"
                  style={{ width: "56px", height: "56px" }}
                />
              </picture>
              <span
                style={{
                  color: "rgb(149, 149, 149)",
                  fontSize: "1em",
                  fontWeight: 400,
                }}
                className={!open ? "d-block" : "d-none"}
              >
                {" "}
                . Terms, Privacy, Support
              </span>

              {open ? (
                <i
                  className="mdi mdi-chevron-up ml-auto"
                  style={{ fontSize: "1.7em", color: "rgb(103, 103, 103)" }}
                ></i>
              ) : (
                <i
                  style={{ fontSize: "1.7em", color: "rgb(103, 103, 103)" }}
                  className="mdi mdi-chevron-down ml-auto"
                ></i>
              )}
            </a>
            <Collapse in={open}>
              <div id="example-collapse-text" className="px-3 overflow-hidden">
                <div className="row footer-links">
                  <Link className="col-6" to="/term-condition">
                    Terms &amp; Condition
                  </Link>
                  <Link className="col-6" to="/PrivacyPolicy">
                    Privacy Policy
                  </Link>
                  <Link className="col-6" to="/RefundPolicy">
                    Refund/Cancellation Policy
                  </Link>
                  <Link className="col-6" to="/contact-us">
                    Contact Us
                  </Link>
                  <Link className="col-6" to="/responsible-gaming">
                    Responsible Gaming
                  </Link>
                  <Link className="col-6" to="/about">
                    About Us
                  </Link>
                </div>
              </div>
            </Collapse>
            
            {/*
            <div className="footer-divider" />
            <div className="px-3 py-4">
              <div className="footer-text-bold">About Us</div>
              <br />
              <div className="footer-text">
                {WebSitesettings ? WebSitesettings.WebsiteName : ""} is a
                real-money gaming product owned and operated by{" "}
                {WebSitesettings ? WebSitesettings.CompanyName : ""} ("
                {WebSitesettings ? WebSitesettings.WebsiteName : ""}" or "We" or
                "Us" or "Our").
              </div>
              <br />
              <div className="footer-text-bold">
                Our Business &amp; Products
              </div>
              <br />
              <div className="footer-text">
                We are an HTML5 game-publishing company and our mission is to
                make accessing games fast and easy by removing the friction of
                app-installs.
              </div>
              <br />
              <div className="footer-text">
                {WebSitesettings ? WebSitesettings.WebsiteName : ""} is a
                skill-based real-money gaming platform accessible only for our
                users in India. It is accessible on{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={WebSitesettings ? WebSitesettings.CompanyWebsite : ""}
                >
                  {WebSitesettings ? WebSitesettings.CompanyWebsite : ""}
                </a>
                . On {WebSitesettings ? WebSitesettings.WebsiteName : ""}, users
                can compete for real cash in Tournaments and Battles. They can
                encash their winnings via popular options such as Paytm Wallet,
                Amazon Pay, Bank Transfer, Mobile Recharges etc.
              </div>
              <br />
              <div className="footer-text-bold">Our Games</div>
              <br />
              <div className="footer-text">
                {WebSitesettings ? WebSitesettings.WebsiteName : ""} has a
                wide-variety of high-quality, premium HTML5 games. Our games are
                especially compressed and optimised to work on low-end devices,
                uncommon browsers, and patchy internet speeds.
              </div>
              <br />
              <div className="footer-text">
                We have games across several popular categories: Arcade, Action,
                Adventure, Sports &amp; Racing, Strategy, Puzzle &amp; Logic. We
                also have a strong portfolio of multiplayer games such as Ludo,
                Chess, 8 Ball Pool, Carrom, Tic Tac Toe, Archery, Quiz, Chinese
                Checkers and more! Some of our popular titles are: Escape Run,
                Bubble Wipeout, Tower Twist, Cricket Gunda, Ludo With Friends.
                If you have any suggestions around new games that we should add
                or if you are a game developer yourself and want to work with
                us, don't hesitate to drop in a line at{" "}
                <a
                  href={
                    WebSitesettings
                      ? "mailto:" + WebSitesettings.CompanyEmail
                      : ""
                  }
                >
                  {WebSitesettings ? WebSitesettings.CompanyEmail : ""}
                </a>
                !
              </div>
            </div>
             */}
          </section>
        
        </div>
      </div>
           {/* WhatsApp Icon Fixed at Bottom-Right */}
  

      {/* WhatsApp Icon Styles */}
      <style jsx="true">{`
        .whatsapp-fixed {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
      `}</style>
      {/* // <div className='rightContainer'>
            //     <Rightcontainer/>
            // </div> */}
    </>
  );
}
