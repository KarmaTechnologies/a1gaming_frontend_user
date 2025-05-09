// import { width } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';


import "../Components/Component-css/Header.css";
import css from "./Component-css/Nav.module.css";


const w3_close = () => {
  const width = document.getElementById("mySidebar").offsetWidth;
  document.getElementById("mySidebar").style.left = `-${width}px`;
  document.getElementById('sidebarOverlay').style.display = 'none';

};
const w3_open = () => {
  document.getElementById("mySidebar").style.left = "0";
  document.getElementById('sidebarOverlay').style.display = 'block';
};

const Header = ({ user, loggedIn }) => {

  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }


  const history = useHistory()

  let access_token = localStorage.getItem("token")
  access_token = localStorage.getItem("token")

  const [WebSitesettings, setWebsiteSettings] = useState("");

  const fetchData = async () => {
    const response = await fetch(baseUrl + "settings/data");
    const data = await response.json();
    return setWebsiteSettings(data);
  }
  document.title=(WebSitesettings)?WebSitesettings.WebTitle:'Play LudoKing And Win Real Cash';
  //console.log(WebSitesettings);
  useEffect(() => {
    fetchData();
  },[])

  const logout = () => {

    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.post(baseUrl + `logout`, {
      headers: headers
    }, { headers })
      .then((res) => {
        // setUser(res.data)
        localStorage.removeItem("token")
        window.location.reload()
        history.push('/')
      }).catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');

        }
      })

  }

  return (
    <div>

      {access_token ? (
        <React.Fragment>
          <div id='sidebarOverlay' onClick={w3_close}></div>
          <div className="w3-sidebar w3-bar-block" id="mySidebar" style={{ paddingBottom: '70px' }}>

            <Link to={"/Profile"} className="w3-bar-item w3-button" onClick={w3_close}>
               <picture className="icon">
                {user && user.avatar ? (<img width="30px" height="30px" src={baseUrl+`${user && user.avatar}`} alt="profile" style={{ borderRadius: "50px" }} />) : 
                (<img src={process.env.PUBLIC_URL +`/user.png`} width="30px" height="30px" alt="profile" />)}
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                My Profile
              </div>
            </Link>
               <Link to={"/dashboard"} className="w3-bar-item w3-button" onClick={w3_close}>
                <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/LandingPage_img/cup-icon.png'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                Dashboard
              </div>
            </Link>
            <Link to={"/landing"} className="w3-bar-item w3-button" onClick={w3_close}>
              <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/Header/gamepad.png'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                Win cash
              </div>

            </Link>
            <Link to={"/wallet"} className="w3-bar-item w3-button" onClick={w3_close}>
              <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/Header/wallet.png'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                My wallet
              </div>

            </Link>

            <Link to={"/Gamehistory"} className="w3-bar-item w3-button" onClick={w3_close}>
              <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/Header/gamesHistory.png'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                Game History
              </div>

            </Link>




            <Link to="/transaction-history" className="w3-bar-item w3-button" onClick={w3_close}>
              <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/Header/order-history.png'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                Transaction History
              </div>

            </Link>

            <Link to={"/refer"} className="w3-bar-item w3-button" onClick={w3_close}>
              <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/Header/sreferEarn.png'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                Refer and Earn
              </div>

            </Link>

           
            <Link to={"/Referral-history"} className="w3-bar-item w3-button" onClick={w3_close}>
              <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/Header/refer-history.webp'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                Refer History
              </div>

            </Link>
             


            <Link to={"/Notification"} className="w3-bar-item w3-button" onClick={w3_close}>
              <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/Header/notifications.png'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                Notification
              </div>

            </Link>



            <Link to={"/support"} className="w3-bar-item w3-button" onClick={w3_close}>
              <picture className="icon">
                <img alt="img" src={process.env.PUBLIC_URL + '/Images/Header/support.png'} />
              </picture>
              <div style={{ marginLeft: '.5rem' }}>
                Support
              </div>

            </Link>
            {/*   <Link className="w3-bar-item w3-button" to="!/" onClick={(e) => logout(e)}>
          <picture className="icon">
            <img alt="img" src={process.env.PUBLIC_URL + '/Images/logout.png'} />
          </picture>
          <div style={{ marginLeft: '.5rem' }}>
            Logout
          </div>

        </Link> */}
          </div>


          <div className="w3-teal">
            <div className="w3-container ">
              <div className={`${css.headerContainer} `}>
                <button
                  className="w3-button w3-teal w3-large float-left"
                  onClick={w3_open} id="hambergar"
                >
                  <picture className={`${css.sideNavIcon} mr-0`}>
                    <img
                      src='/Images/LandingPage_img/sidebar.png'
                      className="snip-img"
                      alt=''
                    />
                  </picture>
                </button>
                <Link to="/" >
                  <picture className={`ml-2 ${css.navLogo} d-flex`}>
                  <img
                  src='/a1gaming-logo.webp'
                  className="snip-img"
                  width="50px"
                  height="50px"
                  alt='Logo'
                />
                  </picture>
                </Link>
                <div >
                  <div className={`${css.menu_items}`}>
                    <Link className={`${css.box}`} to="/Addcase">
                      <picture className={`${css.moneyIcon_container}`}>
                        <img
                          src={process.env.PUBLIC_URL + "/Images/LandingPage_img/global-rupeeIcon.png"}
                          className="snip-img"
                          alt=''
                        />
                      </picture>
                      <div className="mt-1 ml-1">
                        <div className={`${css.moneyBox_header}`}>Cash</div>
                        <div className={`${css.moneyBox_text}`}>{user && user.Wallet_balance}</div>
                      </div>
                      <picture className={`${css.moneyBox_add}`}>
                        <img
                          src={process.env.PUBLIC_URL + '/Images/LandingPage_img/addSign.png'}
                          className="snip-img"
                          alt=''
                        />
                      </picture>
                    </Link>
                    <Link
                      className={`${css.box} ml-2`}
                      to="/redeem/refer"
                      style={{ width: "80px" }}
                    >
                      <picture className={`${css.moneyIcon_container}`}>
                        <img
                          src={process.env.PUBLIC_URL + '/Images/LandingPage_img/notification-activity-reward.png'}
                          className="snip-img"
                          alt=''
                        />
                      </picture>
                      <div className="mt-1 ml-1">
                        <div className={`${css.moneyBox_header}`}>Earning</div>
                        <div className={`${css.moneyBox_text}`}>{user && user.referral_wallet}</div>
                      </div>
                    </Link>
                  </div>
                  <span className="mx-5"></span>
                </div>
                <span className="mx-5"></span>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className="w3-teal " >
          <div className="w3-container ">
            <div className={`${css.headerContainer} justify-content-between`}>

              <Link to="/" >
                <picture className={`ml-2 ${css.navLogo} d-flex`}>
                <img
                  src="/a1gaming-logo.webp"
                  className="snip-img"
                  width="50px"
                  height="50px"
                  alt='Logo'
                />
                </picture>
              </Link>

              <div className={`ml-5`}>
                <Link type="button" className="login-btn" to="/login">LOGIN</Link>
              </div>
            </div>
          </div>
        </div>
      )
      }

      { /*
      <div className="alert alert-danger mt-5 pt-5" role="alert">
        <strong>
      असुविधा के लिए खेद है,हमारे पेमेंट गेटवे पार्टनर की तकनीकी खामियों की वजह से डिपॉजिट और विड्रवाल मैं  समस्या आ रही है । कृपया सभी प्लेयर्स से अनुरोध है की धैर्य बनाए रखे आपका अमाउंट सेफ है और समस्या के निवारण मैं 48 से 72 घंटे लग सकते
        </strong>
      </div>
      */}
    </div>
  );
};

export default Header;
