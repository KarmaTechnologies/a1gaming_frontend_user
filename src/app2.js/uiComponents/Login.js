import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Rightcontainer from "../Components/Rightcontainer";
import "../css/layout.css";
import "../css/login.css";
import loginss from "./sss.png";
export default function Login() {
  const history = useHistory();

  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const [WebSitesettings, setWebsiteSettings] = useState("");
    const [loadStatus, setLoadStatus] = useState(false);


  const fetchData = async () => {
    const response = await fetch(baseUrl + "settings/data");
    const data = await response.json();
    return setWebsiteSettings(data);
  };
  //console.log(WebSitesettings);
  useEffect(() => {
    fetchData();
  }, []);

  const [Phone, setPhone] = useState();
  const [twofactor_code, settwofactor_code] = useState();
  const [otp, setOtp] = useState(false);
  const [isButtonDisabled, setisButtonDisabled] = useState(true);
  const [counter, setCounter] = useState(0);
  const [secretCode, setSecretCode] = useState();
  const [referral, setReferral] = useState(
    useLocation().pathname.split("/")[2]
  );

  const handleClick = async (e) => {
    e.preventDefault();
    setLoadStatus(true)
    setCounter(15);
setTimeout(() =>  {setisButtonDisabled(false) }, 15000);
    if (!Phone) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your phone number",
      });
      setLoadStatus(false)
    } else if (Phone.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please  enter currect phone number",
      });
      setLoadStatus(false)
    } else {
      await axios
        .post(baseUrl + `login`, {
          Phone,
          referral,
        })
        .then((respone) => {
          if (respone.data.status === 101) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: respone.data.msg,
            });
            setLoadStatus(false)
          } else if (respone.data.status === 200) {
            setOtp(true);
           
            // setSecretCode(respone.data.secret);
            if (respone.data.myToken) {
              Swal.fire({
                icon: "success",
                title: "OTP",
                text: "Demo Account Testing OTP " ,
              });
            }
            setLoadStatus(false)
          }
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong",
            // width: '20%',
            // height:'20%',
          });
          setLoadStatus(false)
        });
    }
  };

  const resendClick = async (e) => {
      setLoadStatus(true)
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "OTP resend",
      text: "Successfully",
    });

    if (!Phone) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your phone number",
      });
      setLoadStatus(false)
    } else if (Phone.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please  enter currect phone number",
      });
      setLoadStatus(false)
    } else {
      await axios
        .post(baseUrl + `login`, {
          Phone,
          referral,
        })
        .then((respone) => {
          if (respone.data.status === 101) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: respone.data.msg,
            });
            setLoadStatus(false)
          } else if (respone.data.status === 200) {
            setOtp(true);
           setLoadStatus(false)
            // setSecretCode(respone.data.secret);
            if (respone.data.myToken) {
              Swal.fire({
                icon: "success",
                title: "OTP",
                text: "Demo Account Testing OTP: " + respone.data.myToken,
              });
            }
          }
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong",
            // width: '20%',
            // height:'20%',
          });
          setLoadStatus(false)
        });
    }
  };

  const varifyOtp = async (e) => {
    e.preventDefault();
 setLoadStatus(true)
    if (!Phone) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your phone number",
      });
      setLoadStatus(false)
    } else {
      await axios
        .post(baseUrl + `login/finish`, {
          Phone,
          twofactor_code,
          referral,
        //   secretCode,
        })
        .then((respone) => {
          if (respone.data.status === 101) {
                setLoadStatus(false)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: respone.data.msg,
            });
          } else if (respone.data.status === 200) {
            const token = respone.data.token;
              setLoadStatus(false)
            localStorage.setItem("token", token);
            window.location.reload(true);
            setTimeout(function () {
              history.push("/Games");
            }, 1000);
          } else {
                setLoadStatus(false)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            
          }
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
            setLoadStatus(false)
        });
    }
  };

  const setError = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Invalid Number",
      confirmation: true,
    });
  };
  
useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return (
    <>
      <div className="leftContainer">
        <div className="main-area">
          <div style={{ overflowY: "hidden" }}>
            <div className="splash-overlay" />
            <div className="splash-screen">
              <figure>
                <img width="100%" height="100%" src={loginss} alt="" />
              </figure>
            </div>
            <div
              className="position-absolute w-100 center-xy mx-auto"
              style={{ top: "30%", zIndex: 9 }}
            >
              <div className="d-flex text-white font-15 mb-4">Sign in</div>
              <div
                className="bg-white px-3 cxy flex-column"
                style={{
                  width: "85%",
                  height: "60px",
                  borderRadius: "5px",
                }}
              >
                <div
                  className="input-group mb-2 "
                  style={{ transition: "top 0.5s ease 0s", top: "5px" }}
                >
                  <div className="input-group-prepend">
                    <div
                      className="input-group-text"
                      style={{
                        width: "100px",
                        backgroundColor: "#e9ecef",
                        border: "1px solid #d8d6de",
                      }}
                    >
                      +91
                    </div>
                  </div>
                  <input
                    className="form-control"
                    name="mobile"
                    type="tel"
                    placeholder="Mobile number"
                    // onChange={(e) => setPhone(e.target.value)}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (e.target.value.length > 10) {
                        setError(true);
                      }
                    }}
                    style={{
                      transition: "all 3s ease-out 0s",
                      borderRadius: "4px",
                    }}
                  />
                  {/* <div className="invalid-feedback">Enter a valid mobile number</div> */}
                </div>
              </div>
              {otp && (
                <div
                  className="bg-white px-3 cxy flex-column"
                  style={{
                    width: "85%",
                    height: "60px",
                    borderRadius: "5px",
                    marginTop: "10px",
                  }}
                >
                  <div
                    className="input-group mb-2"
                    style={{ transition: "top 0.5s ease 0s", top: "5px" }}
                  >
                    <div className="input-group-prepend">
                      <div
                        className="input-group-text"
                        style={{
                          width: "100px",
                          backgroundColor: "#e9ecef",
                          border: "1px solid #d8d6de",
                        }}
                      >
                        OTP
                      </div>
                    </div>
                    <input
                      className="form-control"
                      name="password"
                      type="tel"
                      placeholder="Enter OTP"
                      onChange={(e) => settwofactor_code(e.target.value)}
                      style={{
                        transition: "all 3s ease-out 0s",
                        borderRadius: "4px",
                        border: "1px solid #d8d6de",
                      }}
                    />
                    {/* <div className="invalid-feedback">Enter a valid mobile number</div> */}
                  </div>
                </div>
              )}
              {!otp && (
              loadStatus ?  <button
                  className="Login-button cxy mt-4"
                //   onClick={(e) => handleClick(e)}
                >
                  Wait
                </button>:
                <button
                  className="Login-button cxy mt-4"
                  onClick={(e) => handleClick(e)}
                >
                  Continue
                </button>
              )}
              {otp && (
                <>
                  <button
                    className="Login-button cxy mt-4"
                    onClick={(e) => varifyOtp(e)}
                  >
                    Verify
                  </button>
                  <button
                  disabled={isButtonDisabled}
                    className="Login-button cxy mt-4"
                    onClick={(e) => resendClick(e)}
                  >
                    RESEND {counter!=0 && counter ||"" }
                  </button>
                </>
              )}
            </div>
            <div className="login-footer text-white">
              By continuing I agree that{" "}
              {WebSitesettings ? WebSitesettings.CompanyName : ""}. may store
              and process my data in accordance with the{" "}
              <Link to="/term-condition">Terms of Use</Link>,{" "}
              <Link to="/PrivacyPolicy">Privacy Policy</Link> and that I am 18
              years or older. I am not playing from Assam, Odisha, Nagaland,
              Sikkim, Meghalaya, Andhra Pradesh, or Telangana.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
