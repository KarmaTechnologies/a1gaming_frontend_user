import React, { useEffect, useRef, useState } from "react";
import Header from "../Components/Header";
import "../css/kyc.css";
import Rightcontainer from "../Components/Rightcontainer";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import css from '../css/Pan.module.css'
import Swal from "sweetalert2";
import '../css/Loader.css'

const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
const nodeMode = process.env.NODE_ENV;
if (nodeMode === "development") {
  var baseUrl = beckendLocalApiUrl;
} else {
  baseUrl = beckendLiveApiUrl;
}
const Kyc2 = ({ user }) => {
  const history = useHistory()


  const [Number, setNumber] = useState()
  const [isotp, setIsOtp] = useState(false)
  const [otpval, setOTPval] = useState("")
  const [refid, setrefid] = useState("")
  const [process, setProcess] = useState(false);
  const [closeKyc, setCloseKyc] = useState(false);


  let aadharProcess = useRef(false);
  const handleSubmitotp = (e) => {
    const formData2 = { otp: otpval, ref_id: refid };


    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }

    axios.post(baseUrl + `aadharcardverifyotp`, formData2, { headers })
      .then((res) => {
        console.log(res.data);
        if (res.data.code != 200) {
          Swal.fire({
            title: res.data.message,
            icon: "error",
            confirmButtonText: "error",
          });
        }
        else {
          Swal.fire({
            title: "Your Kyc done Successfully",
            icon: "success",
            confirmButtonText: "ok",


          });
          // setIsOtp(true);
          // setrefid(res.data.data.ref_id)
          history.push("/Profile")
        }
        // console.log(res.data)
        //
        aadharProcess.current = false;
        setProcess(false)
      }).catch((e) => {
        console.log(e);
        if (e.response.code == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
          history.push("/login")
        }
      })


  }

  const handleSubmitdata = (e) => {

    if (user.verified == "unverified") {
      e.preventDefault();
      if (isotp) {
        const formData2 = { otp: otpval, ref_id: refid };


        const access_token = localStorage.getItem('token')
        const headers = {
          Authorization: `Bearer ${access_token}`,
        }

        axios.post(baseUrl + `aadharcardverifyotp`, formData2, { headers })
          .then((res) => {
            console.log(res.data);
            if (res.data.code != 200) {
              Swal.fire({
                title: "Invalid OTP",
                icon: "error",
                confirmButtonText: "ok",
              });
            }
            else {
              Swal.fire({
                title: res.data.msg,
                icon: "success",
                confirmButtonText: "ok",


              });
              // setIsOtp(true);
              // setrefid(res.data.data.ref_id)
              history.push("/Profile")
            }
            // console.log(res.data)
            //
            aadharProcess.current = false;
            setProcess(false)
          }).catch((e) => {
            console.log(e);
            Swal.fire({
              title: "Invalid aadhar number",
              icon: "warning",
              confirmButtonText: "ok",


            });
            //   if (e.response.status == 401) {
            //     localStorage.removeItem('token');
            //     localStorage.removeItem('token');
            window.location.reload()
            //     // history.push("/login")
            //   }
          })


      } else {


        if (aadharProcess.current === false) {
          setProcess(true);
          aadharProcess.current = true;
          e.preventDefault();
          const formData = { aadhaar_number: Number };

          let gox = true;
          if (gox) {
            const access_token = localStorage.getItem('token')
            const headers = {
              Authorization: `Bearer ${access_token}`,
            }

            axios.post(baseUrl + `aadharcardotp`, formData, { headers })
              .then((res) => {
                console.log(res.data);
                if (res.data.code != 200) {
                  Swal.fire({
                    title: res.data.message ? res.data.data.message : "Invalid aadhar card",
                    icon: "danger",
                    confirmButtonText: "ok"
                  });
                }
                else {
                  if (res.data && res.data.data && res.data.data.reference_id) {
                    Swal.fire({
                      title: res.data.data.message,
                      icon: "success",
                      confirmButtonText: "ok"
                    });
                    setIsOtp(true);
                    setrefid(res.data.data.reference_id)
                  } else {
                    if (res.data.data.message)
                      console.log(res.data.data.message);
                    else
                      console.log("hhhhhhhhhhhhhh");

                    Swal.fire({
                      title: res.data.data.message ? res.data.data.message : "Invalid aadhar card1",
                      icon: "error",
                      confirmButtonText: "ok",
                    });
                  }

                  //                history.push("/Profile")
                }
                // console.log(res.data)
                //
                aadharProcess.current = false;
                setProcess(false)
              }).catch((e) => {
                console.log(e);
                Swal.fire({
                  title: "Invalid aadhar number",
                  icon: "warning",
                  confirmButtonText: "ok",


                });

                //   if (e.response.status == 401) {
                //     localStorage.removeItem('token');
                //     localStorage.removeItem('token');
                window.location.reload()
                //     history.push("/login")
                //   }
              })
          }
          else {
            aadharProcess.current = false;
            setProcess(false)
            alert('please fill all field')
          }
        }
        else {
          alert('You have submited request already.')
        }

      }
    }
    else {
      alert('You request in Process.')
    }
  }
  useEffect(() => {
    console.log(user)
    let access_token = localStorage.getItem('token');
    access_token = localStorage.getItem('token');
    if (!access_token) {
      window.location.reload()
      history.push("/login");
    }
  }, [])
  return (
    <div>
      <div className="leftContainer">


        <div className="kycPage mt-5 py-4 px-3">
          {
            closeKyc ?
              <>
                <div className='d-flex flex-column align-items-center'>

                  <h4 className="mt-3 text-center text-dark text-justify">
                    KYC service is close for now ‼️
                  </h4>
                  <h4 className="mt-3 text-center text-dark text-justify">
                    KYC सेवा फिलहाल बंद है ‼️
                  </h4>
                  <h4 className="mt-3  text-center text-dark text-justify">
                    धन्यवाद 🙏
                  </h4>
                </div>
              </>
              :
              <>
                <p className="mt-2" style={{ color: "rgb(149, 149, 149)" }}>
                  You need to submit a document that shows that you are{" "}
                  <span style={{ fontWeight: 500 }}>above 18 years</span> of age and not a
                  resident of{" "}
                  <span style={{ fontWeight: 500 }}>
                    Assam, Odisha, Sikkim, Nagaland, Telangana, Andhra Pradesh, Tamil Nadu and
                    Karnataka.
                  </span>
                </p>
                {/* <br /> */}
                {/* <div>
            <span style={{ fontSize: "1.5em" }}>Step 2</span> of 3
          </div> */}
                <p className="mt-2" style={{ color: "rgb(149, 149, 149)" }}>
                  Enter details of Aadhar Card:{" "}
                  {/* <span style={{ fontWeight: 500 }}>098765432212</span> */}
                </p>
                {/* <br /> */}
                <form onSubmit={handleSubmitdata}>

                  <div style={{ marginTop: "10px" }}>

                    <div className="kyc-doc-input mt-4">
                      <div className="label">Aadhar Number</div>
                      <input type="text"
                        maxLength={12}
                        name="Name"
                        placeholder=' Aadhar Number'
                        onChange={(e) => setNumber(e.target.value)} required
                      />
                    </div>

                    {isotp &&

                      <div className="kyc-doc-input mt-4">
                        <div className="label">OTP </div>
                        <input type="text"
                          maxLength={12}
                          name="otp"
                          placeholder=' OTP'
                          onChange={(e) => setOTPval(e.target.value)} required
                        />
                      </div>

                    }

                  </div>
                  <div style={{ paddingBottom: "25%" }} />
                  <div className="refer-footer p-0">

                    {!isotp &&

                      <button type="submit" className="w-100 btn-success bg-success" style={{
                        border: 'none', borderRadius: '5px',
                        fontSize: '1em',
                        fontWeight: '700',
                        height: '48px',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}>
                        {/* <Link  >Next</Link> */}
                        SEND OTP
                      </button>
                      ||
                      <button type="submit" className="w-100 btn-success bg-success" style={{
                        border: 'none', borderRadius: '5px',
                        fontSize: '1em',
                        fontWeight: '700',
                        height: '48px',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}>
                        Verify OTP
                      </button>

                    }
                  </div>
                </form>
              </>
          }

        </div>
        {Boolean(process) &&
          <div className="loaderReturn" style={{ zIndex: '99' }}>
            <img
              src={'https://a1gaming.co.in/Images/LandingPage_img/loader_change.gif'}
              style={{ width: "100%", maxWidth: "125px" }}
            />
          </div>
        }
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </div>
  );
};

export default Kyc2;
