import React, { useEffect, useState, useRef } from "react";
import "../css/viewGame1.css";
import "../css/layout.css";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import css from "../css/Pan.module.css";
import playSound from "./play.mp3";
//import Rightcontainer from '../Components/Rightcontainer';
import Swal from "sweetalert2";
import "../css/Loader.css";
import RadioButton from "./RadioButton";
import RadioGroup from "./RadioGroup";
import io from "socket.io-client";
import toast from "react-hot-toast";

export default function ViewGame1(props) {
  const history = useHistory();
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const location = useLocation();
  const path = location.pathname.split("/")[2];

  const [Game, setGame] = useState();
  const [ludoGameId, setLudoGameId] = useState();
  const [status, setStatus] = useState(null);
  const [fecthStatus, setFecthStatus] = useState();
  const [scrnshot, setScrnshot] = useState(null);
  const [scrnshot1, setScrnshot1] = useState(""); // ADDED BY TEAM

  const [reason, setReason] = useState("other");
  const [socket, setSocket] = useState();
  const [roomcode, setRoomcode] = useState("");
  const [loading, setLoading] = useState(false);
  let submitReq = useRef(false);
  const isMounted = useRef(true);

  const [submitProcess, setProcess] = useState(true);

  const getPost = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    try {
      const res = await axios.get(
        `${baseUrl}checkroomcode?roomcode=${roomcode}&gameId=${path}`
      );

      if (res.data.type === "cancelled") {
        await Swal.fire({
          position: "center",
          icon: "error",
          title: "Game was cancelled by acceptor. Please cancel the game",
          showConfirmButton: false,
          timer: 1200,
        });
        return; // Stop execution
      }

      if (res.data.type !== "classic") {
        await Swal.fire({
          position: "center",
          icon: "error",
          title: "Room Code is not classic",
          showConfirmButton: false,
          timer: 1200,
        });
        return; // Stop execution
      }

      const gameid = res?.data?.gameid || "";
      setLudoGameId(gameid);

      const patchRes = await axios.patch(
        `${baseUrl}challange/roomcode/${path}/${gameid}`,
        { Room_code: roomcode },
        { headers }
      );

      setGame(patchRes?.data);
      socket.emit("sendGameData", patchRes?.data);
      socket.emit("challengeOngoing");
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.reload();
        history.push("/login");
      }
    }
  };
  
  /// user details start

  const [user, setUser] = useState();
  const [userAllData, setUserAllData] = useState();

  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(baseUrl + `me`, { headers })
      .then((res) => {
        setUser(res.data._id);
        setUserAllData(res.data);
        // // console.log(res.data._id)
        Allgames(res.data._id);
        getCode(res.data._id);
        // setTimeout(() => {
        // }, 1000);
        // checkExpire();
        // if(!res.data.Room_join)
        // {
        // }
      })
      .catch((e) => {
        if (e?.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });
  };

  /// user details end

  const [ALL, setALL] = useState();

  const Allgames = async (userId) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios
      .get(baseUrl + `challange/${path}`, { headers })
      .then(async(res) => {
        if (res.data.Status == "new" || res.data.Status == "requested") {
        //   setTimeout(async () => {
            await axios
              .get(baseUrl + `challange/${path}`, { headers })
              .then((res) => {
                if (
                  res.data.Status == "new" ||
                  res.data.Status == "requested"
                ) {
                //   history.push(props.location.state.prevPath);
                  setProcess(false)
                } else {
                  setProcess(false);
                }
              })
              .catch((error) => {
                console.error(error);
                history.push(props.location.state.prevPath);
              });
        //   }, 10000);
        } else {
          setProcess(false);
        }
        setALL(res?.data);
        setGame(res?.data);        // // console.log(res.data.Accepetd_By._id)
        if (userId == res.data.Accepetd_By._id)
          setFecthStatus(res.data.Acceptor_status);

        if (userId == res.data.Created_by._id)
          setFecthStatus(res.data.Creator_Status);
      })
      .catch((e) => {
        if (e?.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });
  };
  const getCode = async (userId) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(baseUrl + `game/roomcode/get/${path}`, { headers })
      .then((res) => {
        //setALL(res.data)
        Allgames(userId);
        if (res.data.Accepetd_By == userId && res.data.Room_code == 0) {
        //   setTimeout(async () => {
        //     window.location.reload();
        //   }, 10000);
        }
      });
  };
  const checkExpire = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios
      .get(baseUrl + `game/roomcode/expire/${path}`, { headers })
      .then((res) => {
        history.goBack();
      });
  };

  useEffect(() => {
    // const socket = io("https://socket.a1gaming.co.in");
    const socket = io( "http://localhost:6001");


    socket.on("connect", () => {
      console.log("Socket.io is connected 👍");
      setSocket(socket);
      
      socket.on("getGameData", (data) => {
         Allgames(user)
      });
      
      socket.emit("ping");

      socket.on("pong", () => {
        console.log("Received pong from server");
      });

      socket.on("disconnect", () => {
        console.log("Socket.io disconnected 😡");
        if (isMounted.current) {
          setSocket(null);
        }
      });

      socket.on("ping", (message) => {
       socket.emit("pong")
      });
    });

    return () => {
      isMounted.current = false;
      if (socket) {
        // socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    if (!access_token) {
      window.location.reload();
      history.push("/login");
    }
    role();
  }, []);
  const eventHandlers = {
    // Define your event handlers here
    ping: (data) => {
      socket.emit("pong");
    },
  };
//   useEffect(() => {
//     let access_token = localStorage.getItem("token");
//     access_token = localStorage.getItem("token");
//     if (!access_token) {
//       window.location.reload();
//       history.push("/login");
//     }
//     // console.log(history.location)

//     role();
//   }, []);

  const clearImage = (e) => {
    setScrnshot1(null);
    setScrnshot(null);
    setStatus(null);
  };

  // Result

  const Result = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (submitReq.current == false) {
      submitReq.current = true;
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      if (status) {
        setProcess(true);
        const formData = new FormData();
        formData.append("file", scrnshot);
        formData.append("status", status);
        if (status == "cancelled") {
          formData.append("reason", reason);
        }

        await axios({
          method: "post",
          url: baseUrl + `challange/result/${path}`,
          data: formData,
          headers: headers,
        })
          .then((res) => {
            // socket.emit('resultAPI');
            submitReq.current = false;
            setProcess(false);
                        setLoading(false)
                         toast.success('Successfully Submit!')
            history.push(props.location.state.prevPath);
          })
          .catch((e) => {
            console.log(e);
            if (e?.response?.status === 400) {
              Swal.fire({
                title: e.response.data.message,
                icon: "error",
                confirmButtonText: "OK",
              });
              submitReq.current = false;
              setProcess(false);
               setLoading(false)
              history.push(props.location.state.prevPath);
            }
            if (e?.response?.status == 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("token");
              window.location.reload();
              history.push("/login");
            }
          });
      } else {
        submitReq.current = false;
                setLoading(false)
        alert("please fill all field or Re-Select result status");
      }
    }
            setLoading(false)

  };

  const copyCode = (e) => {
    // console.log(Game.Room_code);
    navigator.clipboard.writeText(Game.Room_code);

    Swal.fire({
      position: "center",
      icon: "success",
      type: "success",
      title: "Room Code Copied",
      showConfirmButton: false,
      timer: 1200,
    });
  };
  const Completionist = () => <span>You are good to go!</span>;

  // ADDED BY TEAM
  const handleChange = (e) => {
    setScrnshot1(URL.createObjectURL(e.target.files[0]));
    setScrnshot(e.target.files[0]);
  };

  // ADDED BY TEAM
 /// user details end
const handleLose=()=>{
  setStatus("lose")
   setScrnshot(null)
   setScrnshot1(null)

}
const handleCancel=()=>{
  setStatus("cancelled")
   setScrnshot(null)
   setScrnshot1(null)

}


console.log("userData" , user)
console.log("userData" , Game)
  return (
    <>
      <Header user={userAllData} />
      {/* {!Game && <div class="lds-ripple"><div></div><div></div></div>} */}
      {Game && (
        <div className="leftContainer">
        
          <div className="main-area" style={{ paddingTop: "60px" }}>
            {!Boolean(submitProcess) && (
              <div className="battleCard-bg">
                <div className="battleCard">
                  <div className="players cxy pt-2">
                    <div className="flex-column cxy">
                      <h5>{Game?.Created_by && Game?.Created_by?.Name}</h5>
                      {Game?.Created_by?.avatar ? (
                        <img
                          src={baseUrl + `${Game?.Created_by?.avatar}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://a1gaming.co.in/user.png";
                          }}
                          width="50px"
                          height="50px"
                          alt=""
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            borderBottomRightRadius: "50%",
                            borderBottomLeftRadius: "50%",
                          }}
                        />
                      ) : (
                        <img
                          src={process.env.PUBLIC_URL + `/user.png`}
                          width="50px"
                          height="50px"
                          alt=""
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            borderBottomRightRadius: "50%",
                            borderBottomLeftRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                    <img
                      className="mx-3"
                      src={
                        process.env.PUBLIC_URL + "/Images/Homepage/versus.png"
                      }
                      width="23px"
                      alt=""
                    />
                    <div className="flex-column cxy ">
                      <h5> {Game?.Accepetd_By && Game?.Accepetd_By?.Name}</h5>
                      {Game?.Accepetd_By?.avatar ? (
                        <img
                          src={baseUrl + `${Game?.Accepetd_By?.avatar}`}
                          width="50px"
                          height="50px"
                          alt=""
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            borderBottomRightRadius: "50%",
                            borderBottomLeftRadius: "50%",
                          }}
                        />
                      ) : (
                        <img
                          src={process.env.PUBLIC_URL + `/user.png`}
                          width="50px"
                          height="50px"
                          alt=""
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            borderBottomRightRadius: "50%",
                            borderBottomLeftRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="amount cxy mt-2">
                    <span style={{ opacity: "0.8" }}>Playing for</span>
                    <img
                      className="mx-1"
                      src={
                        process.env.PUBLIC_URL +
                        "/Images/LandingPage_img/global-rupeeIcon.png"
                      }
                      width="25x"
                      alt=""
                    />
                    <span
                      style={{
                        fontSize: "1.2em",
                        fontWeight: 700,
                        opacity: "0.8",
                      }}
                    >
                      {Game?.Game_Ammount}
                    </span>
                  </div>
                  <div className="thin-divider-x my-3" />

                {
                // (Game.Room_code == null && (
                //     <div className="roomCode cxy flex-column">
                //       Waiting for Room Code...
                //       <h6>रूम कोड का इंतजार है।</h6>
                //       <div className="lds-spinner">
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //         <div></div>
                //       </div>
                //     </div>
                //   )) ||
                    ((Game.Room_code != 0)&& (
                      <div className="roomCode cxy flex-column">
                        <div className="text-center">
                          <div>Room Code</div>
                          <span>{Game.Room_code}</span>
                        </div>
                        <button
                          className="bg-green playButton position-static mt-2"
                          onClick={(e) => copyCode(e)}
                        >
                          Copy Code
                        </button>
                      </div>
                    )) ||
                    ((Game.Room_code == 0) &&
                      ((Game.Created_by._id == user && (
                      <>
                       <audio src={playSound} autoPlay>
            </audio>
                        <div className="roomCode cxy flex-column">
                          Set Room Code
                          <h6>लूडो किंग से रूम कोड अपलोड करें</h6>
                          <input
                            type="number"
                            className="form-control mt-1 w-75"
                            style={{
                              backgroundColor: "#e8eeee",
                              border: "1px solid #47a44780",
                            }}
                            value={roomcode}
                            onChange={(e) => setRoomcode(e.target.value)}
                          />
                          <button
                            className="bg-green playButton position-static mt-2"
                            type="button"
                            onClick={() => getPost()}
                          >
                            SET ROOM CODE
                          </button>
                        </div>
                        </>
                      )) ||
                        (Game.Accepetd_By._id == user && (
                          <div className="roomCode cxy flex-column">
                            Waiting for Room Code
                            <h6>रूम कोड का इंतजार है।</h6>
                            <div className="lds-spinner">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          </div>
                        ))))}
                  <div className="cxy app-discription flex-column">
                    <span style={{ opacity: ".8" }}>
                      {" "}
                      Play ludo game in Ludo King App
                    </span>
                    <div className="mt-2">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.ludo.king"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="mr-2"
                          src={
                            process.env.PUBLIC_URL + "/Images/google-play.jpeg"
                          }
                          width="128px"
                          height="38px"
                          alt=""
                        />
                      </a>
                      <a
                        href="https://itunes.apple.com/app/id993090598"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={
                            process.env.PUBLIC_URL + "/Images/app-store.jpeg"
                          }
                          width="128px"
                          height="38px"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                  <div className="thin-divider-x my-3" />
                  <div className="rules">
                    <span className="cxy mb-1">
                      <u>Game Rules</u>
                    </span>
                    <ol className="list-group list-group-numbered">
                      <li className="list-group-item">
                        Record every game while playing.
                      </li>
                      <li className="list-group-item">
                        For cancellation of game, video proof is necessary.
                      </li>
                      <li className="list-group-item">
                        {/* <img
                      className='mx-1'
                      src={process.env.PUBLIC_URL + 'Images/LandingPage_img/global-rupeeIcon.png'}
                      width='21px'
                      alt=''
                    /> */}
                        <h6 className="d-none  text-danger d-block text-center">
                          ◉ महत्वपूर्ण नोट:कृपया गलत गेम परिणाम अपलोड न करें,
                          अन्यथा आपके वॉलेट बैलेंस पर penalty लगाई जायगी। गलत
                          रिजल्ट अपडेट करने पर 50 रुपये पेनल्टी लगेगी।
                        </h6>
                      </li>
                      <li className="list-group-item">
                        {/* <img
                      className='mx-1'
                      src={process.env.PUBLIC_URL + 'Images/LandingPage_img/global-rupeeIcon.png'}
                      width='21px'
                      alt=''
                    /> */}
                        <h6 className="d-none  text-danger d-block text-center">
                          महत्वपूर्ण नोट: यदि आप गेम के परिणामों को अपडेट नहीं
                          करते हैं, तो आपके वॉलेट बैलेंस पर जुर्माना लगाया
                          जाएगा। रिजल्ट अपडेट नहीं करने पर 25 रुपये पेनल्टी
                          लगेगी।
                        </h6>
                      </li>
                    </ol>
                  </div>
                  <div className="match-status-border row">
                    <div className="col-6">Match Status</div>
                  </div>
                  <form
                    className="result-area"
                    onSubmit={(e) => {
                      Result(e);
                    }}
                    encType="multipart/form-data"
                  >
                    {fecthStatus !== null && fecthStatus !== undefined && (
                      <p>
                        You have already updated your battle result for{" "}
                        <h6 className="d-inline-block text-uppercase">
                          <b>{fecthStatus}</b>
                        </h6>
                      </p>
                    )}
                    {fecthStatus === null && (
                      <>
                        {" "}
                        <p>
                          After completion of your game, select the status of
                          the game and post your screenshot below.
                        </p>
                        <div
                          className="MuiFormGroup-root radios"
                          role="radiogroup"
                          aria-label="Result"
                        >
                          <label className="MuiFormControlLabel-root hidden Mui-disabled">
                            <span
                              className="MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root MuiRadio-colorSecondary jss2 Mui-checked jss3 Mui-disabled MuiIconButton-colorSecondary Mui-disabled Mui-disabled"
                              tabIndex={-1}
                              aria-disabled="true"
                            >
                              <span className="MuiIconButton-label">
                                <input
                                  className="jss4 mr-2"
                                  name="battleResult"
                                  type="radio"
                                  defaultValue="select"
                                  defaultChecked
                                  style={{ transform: "scale(1.5)" }}
                                />
                              </span>
                            </span>
                            <span
                              className="MuiTypography-root MuiFormControlLabel-label Mui-disabled MuiTypography-body1"
                              style={{ marginTop: "3px" }}
                            >
                              (Disabled option)
                            </span>
                          </label>
                          <label className="MuiFormControlLabel-root">
                            <span
                              className="MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root jss8"
                              aria-disabled="false"
                            >
                              <span className="MuiIconButton-label">
                                <input
                                  className="jss4 mr-2"
                                  name="battleResult"
                                  type="radio"
                                  defaultValue="winn"
                                  onClick={(e) => setStatus("winn")}
                                  style={{ transform: "scale(1.5)" }}
                                />
                              </span>
                              <span className="MuiTouchRipple-root" />
                            </span>
                            <span
                              className="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                              style={{ marginTop: "3px" }}
                            >
                              I Won
                            </span>
                          </label>
                          <label className="MuiFormControlLabel-root">
                            <span
                              className="MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root MuiRadio-colorSecondary MuiIconButton-colorSecondary"
                              aria-disabled="false"
                              root="[object Object]"
                            >
                              <span className="MuiIconButton-label">
                                <input
                                  className="jss4 mr-2"
                                  name="battleResult"
                                  type="radio"
                                  defaultValue="lose"
                                  onClick={(e) => handleLose()}
                                  style={{ transform: "scale(1.5)" }}
                                />
                              </span>
                              <span className="MuiTouchRipple-root" />
                            </span>
                            <span
                              className="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                              style={{ marginTop: "3px" }}
                            >
                              I Lost
                            </span>
                          </label>
                          <label className="MuiFormControlLabel-root">
                            <span
                              className="MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root"
                              aria-disabled="false"
                            >
                              <span className="MuiIconButton-label">
                                <input
                                  className="jss4 mr-2"
                                  name="battleResult"
                                  type="radio"
                                  defaultValue="cancelled"
                                  onClick={(e) => handleCancel()}
                                  style={{ transform: "scale(1.5)" }}
                                />
                              </span>
                              <span className="MuiTouchRipple-root" />
                            </span>
                            <span
                              className="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                              style={{ marginTop: "3px" }}
                            >
                              Cancel
                            </span>
                          </label>
                        </div>
                      </>
                    )}
                    {status !== null &&
                      status !== "cancelled" &&
                      status !== "lose" && (
                        <div className={`${css.doc_upload} mt-5`}>
                          {/* <input type="file" onChange={(e) => setScrnshot(e.target.files[0])} accept="image/*" required /> */}
                          {/* ADDED BY TEAM */}
                          <input
                            type="file"
                            onChange={handleChange}
                            accept="image/*"
                            required
                          />
                          {/* ADDED BY TEAM */}
                          {!scrnshot && (
                            <div className="cxy flex-column position-absolute ">
                              <i class="fa-solid fa-arrow-up"></i>
                              {/* <img src={process.env.PUBLIC_URL + '/Images/upload_icon.png'} width="17px" alt="" className="snip-img" /> */}
                              <div className={`${css.sideNav_text} mt-2 `}>
                                Upload screenshot.
                              </div>
                            </div>
                          )}
                          {scrnshot && (
                            <div className={css.uploaded}>
                              <img
                                src="/images/file-icon.png"
                                width="26px"
                                alt=""
                                style={{ marginRight: "20px" }}
                              />
                              <div
                                className="d-flex flex-column"
                                style={{ width: "80%" }}
                              >
                                <div className={`${css.name} `}>
                                  {scrnshot.name}
                                </div>
                                <div className={css.size}>
                                  {(scrnshot.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                              <div className="image-block">
                                <img
                                  src="/images/global-cross.png"
                                  width="10px"
                                  alt=""
                                  onClick={clearImage}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    {status !== null && status == "cancelled" && (
                      <div class="form-group">
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "250px",
                            bottom: "0px",
                            backgroundColor: "#fff",
                          }}
                        >
                          <button
                            style={{
                              float: "left",
                              marginRight: "50px",
                              position: "absolute",
                            }}
                            onClick={() => {
                              setStatus(null);
                            }}
                          >
                            X
                          </button>
                          <h3
                            style={{
                              margin: "auto",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            Cancel Reason
                          </h3>

                          <br />
                          <RadioGroup
                            label="Cancel Reason"
                            checkedValue="Other"
                          >
                            <RadioButton
                              label="Roomcode not found"
                              value="Roomcode not found"
                              onClick={() => {
                                setReason("Roomcode not found");
                              }}
                            />
                            <RadioButton
                              label="Popular Code"
                              value="Popular Code"
                              onClick={() => {
                                setReason("Popular Code");
                              }}
                            />
                            <RadioButton
                              label="Not Joined"
                              value="Not Joined"
                              onClick={() => {
                                setReason("Not Joined");
                              }}
                            />
                            <RadioButton
                              label="Not Playing"
                              value="Not Playing"
                              onClick={() => {
                                setReason("Not Playing");
                              }}
                            />
                            <RadioButton
                              label="Don't want to Play"
                              value="Don't want to Play"
                              onClick={() => {
                                setReason("Don't want to Play");
                              }}
                            />
                            <RadioButton
                              label="Opponment Abusing"
                              value="Opponment Abusing"
                              onClick={() => {
                                setReason("Opponment Abusing");
                              }}
                            />
                            <RadioButton
                              label="Game Not Start"
                              value="Game Not Start"
                              onClick={() => {
                                setReason("Game Not Start");
                              }}
                            />
                            <RadioButton
                              label="Other"
                              value="Other"
                              onClick={() => {
                                setReason("other");
                              }}
                            />
                          </RadioGroup>
                          <center>
                            {fecthStatus == null &&
                              fecthStatus == undefined && (
                                <input
                                disabled={loading}
                                  type="submit"
                                  className="btn btn-danger mt-3 text-white"
                                  id="post"
                                />
                              )}
                          </center>
                        </div>
                      </div>
                    )}

                    {/* ADDED BY TEAM */}
                    <div style={{ width: "100%" }}>
                      <img src={scrnshot1} style={{ width: "100%" }} />
                    </div>
                    {/* ADDED BY TEAM */}

                    {/* <button type='submit' className='btn btn-danger mt-3 text-white' id="post" onSubmit={(e) => { e.preventDefault(); Result() }}>Post Result</button> */}
                    {fecthStatus == null && fecthStatus == undefined && (
                      <input
                      disabled={loading}
                        type="submit"
                        className="btn btn-danger mt-3 text-white"
                        id="post"
                        value={loading ? "Please wait..." : "Submit"}

                      />
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {Boolean(submitProcess) && (
        <div
          className="loaderReturn"
          style={{ zIndex: "99", minHeight: "100vh" }}
        >
          <img
            src={process.env.PUBLIC_URL + "/Images/LandingPage_img/loader1.gif"}
            style={{ width: "100%" }}
          />
        </div>
      )}
      <div class="divider-y"></div>
    </>
  );
}
