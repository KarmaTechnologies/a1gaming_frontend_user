import React, { useEffect, useState } from "react";
import Rightcontainer from "../Components/Rightcontainer";
import { Modal, Button } from "react-bootstrap";
import axios from 'axios'
import Chat from "./Chat/Chat";
const Support = ({user}) => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
const chatStore = JSON.parse(localStorage.getItem("chatOpen")) || false;
  const [showChat, setShowChat] = useState(chatStore);

  const chatoption = (show = false) => {
    localStorage.setItem("chatOpen", JSON.stringify(show));
    setShowChat(show);
  };


  var baseUrl;
  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl
  }

  const [WebSitesettings, setWebsiteSettings] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState("");
const [userAllData, setUserAllData] = useState()
    const role = async () => {
        const access_token = localStorage.getItem("token")
        const headers = {
          Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseUrl+`me`, { headers })
          .then((res) => {
            //console.log(res.data);
            setUserAllData(res.data)
          })
          .catch(e => {
            if (e.response.status == 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('token');
            }
          })
    
      }
    const fetchData = async () => {
      const response = await fetch(baseUrl + "settings/data");
      const data = await response.json();
      return setWebsiteSettings(data);
    }

  useEffect(() => {
    fetchData();
    role()
  }, [])
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
    <div>
   
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
      <div className="leftContainer" style={{ minHeight: '100vh', height: '100%' }}>



        <div className="cxy flex-column " style={{ paddingTop: "16%" }}>
          <img src={process.env.PUBLIC_URL + '/Images/contact_us.png'} width="280px" alt="" />
          <div className="games-section-title mt-4" style={{ fontSize: "1.2em", fontWeight: '700', color: '2c2c2c' }}>
            Contact us at below platforms.
          </div>
          {/* {user && (
            <div className="row justify-content-center">
              <div className="col-4  d-flex justify-content-around w-80">
                <a className="cxy flex-column pt-2" target="_blank" onClick={() => chatoption(true)}>
                  <img width="50px" src={process.env.PUBLIC_URL + "/Images/livechat.png"} alt="" />
                </a>
              </div>
            </div>
          )}*/}

          <div className="row justify-content-center">
          <div className="col-4  d-flex justify-content-around w-80">

          <a className="cxy flex-column" target="_blank" href="https://t.me/+fpMSUsllA2gwZTM9">
            <img width="50px" src={process.env.PUBLIC_URL + '/Images/tel.png'} alt="" />
            <span className="footer-text-bold">{(WebSitesettings.telegram) ? WebSitesettings.telegram : ''}</span>
          </a>

          {/**
            <a className="cxy flex-column" href={(WebSitesettings.telegram) ? "https://t.me/"+WebSitesettings.telegram : ''}>
            <img width="50px" src={process.env.PUBLIC_URL + '/Images/tel.png'} alt="" />
            <span className="footer-text-bold">{(WebSitesettings.telegram) ? WebSitesettings.telegram : ''}</span>
          </a>
           */}
         
          
        </div>
          </div>
          <div className="row justify-content-center">
          <div className="col-4  d-flex justify-content-around w-80">
              <a className="cxy flex-column pt-2" target="_blank" href="https://www.instagram.com/a1gamingofficial_/"
              >
              <img width="50px" src={process.env.PUBLIC_URL + '/Images/instagram.png'} alt="" />
              <span className="footer-text-bold">{(WebSitesettings.instagram) ? WebSitesettings.instagram : ''}</span>

              </a>
            </div>
          </div>

         {
           
          
          <div className="col-4 my-2 text-center font-weight-bold">
          <a className="cxy flex-column"  href="#" onClick={handleWhatsAppClick}> 
              <img width="50px" src={process.env.PUBLIC_URL + '/Images/whatsapp.png'} alt="" />
              <span className="footer-text-bold">{(WebSitesettings.whatsapp) ? WebSitesettings.whatsapp : ''}</span>
            </a>
          </div>

           }

         {/**
         <div className="col-12 my-2 text-center font-weight-bold">
            <a className="cxy flex-column" href={(WebSitesettings.CompanyEmail) ? 'mailto:'+WebSitesettings.CompanyEmail : ''}>
              <img width="50px" src={process.env.PUBLIC_URL + '/Images/mail.png'} alt="" />
              <span className="footer-text-bold">{(WebSitesettings.CompanyEmail) ? WebSitesettings.CompanyEmail : ''}</span>
            </a>
          </div>
          */}
          
          {/**
          <div className="col-12 my-2 text-center font-weight-bold">
            <a className="cxy flex-column" href="#">
            <span className="footer-text-bold"><a href={(WebSitesettings.CompanyMobile) ? 'tel:'+WebSitesettings.CompanyMobile : ''}>{(WebSitesettings.CompanyMobile) ? WebSitesettings.CompanyMobile : ''}</a></span>
              <span className="footer-text-bold">{(WebSitesettings) ? WebSitesettings.CompanyName : ''}</span>
              <span className="footer-text-bold">
              {(WebSitesettings) ? WebSitesettings.CompanyAddress : ''}</span>
            </a>
          </div>

          */}
        </div>
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
      <div
        // style={{
        //   maxWidth: "500px",
        //   width: "100%",
        //   position: "fixed",
        //   bottom: "2%",
        //   right: "0",
        //   zIndex: 99999,
        //   display: showChat ? "block" : "none",
        // }}
        style={{
          maxWidth: "500px",
          width: "100%",
          position: "fixed",
          bottom: showChat ? "2%" : "-100%", // Slide in/out effect
          right: "0",
          zIndex: 99999,
          transition: "bottom 0.5s ease-in-out", // Smooth transition
          background: '#0000'
        }}
      >
        <span
          style={{
            width: 30,
            height: 30,
            padding: 5,
            position: "absolute",
            right: 35,
            top: -35,
            background: "white",
            borderRadius: 50,
            zIndex: 99999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => chatoption(false)}
        >
          <img width="15px" src={process.env.PUBLIC_URL + "/Images/global-cross.png"} alt="" />
        </span>
        <Chat user={user} chatoption={chatoption} />
      </div>


    </div>
  );
};

export default Support;