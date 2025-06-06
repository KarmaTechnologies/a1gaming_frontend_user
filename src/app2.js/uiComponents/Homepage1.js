import React, { useEffect, useRef, useState } from "react";
import "../css/layout.css";
import css from "../Modulecss/Home.module.css";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
//import Rightcontainer from "../Components/Rightcontainer";
import io from "socket.io-client";
import BetCard from "./BetCard";
import RunningCard from "./RunningCard";
import Header from "../Components/Header";
//import { Alert } from "@mui/material";

export default function Homepage({walletUpdate}) {
  //const history = useHistory();
  let userID=useRef();
  const isMounted= useRef(true);
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }
  /// user details start

  const [user, setUser] = useState();
  const [created,setCreated]=useState([]);
  const [socket, setSocket] = useState();
  
  const [userAllData, setUserAllData] = useState()

  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios.get(baseUrl+`me`, { headers }).then((res) => {
      setUser(res.data._id);
      setUserAllData(res.data)
      userID.current=res.data._id;
      setMount(true);
    })
    .catch(e=>{
      if (e.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('token');
        window.location.reload()
        setTimeout(() => {
          //  history.push("/login")
        }, 500);
      }
      if (e.response.status === 400 || e.response.status === 429) {
        Swal.fire({
          title: 'Please refresh!',
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    })
  };


  /// user details end

  const [game_type, setGame_type] = useState(
    useLocation().pathname.split("/")[2]
  );
  const [Game_Ammount, setGame_Ammount] = useState();

  //   console.log(game_type);

  const ChallengeCreate = (e) => {
    if(game_type == "ludo-classic-light-mode" && (Game_Ammount < 10 || Game_Ammount > 25000)){
      Swal.fire({
        title: 'Game amount should be Greater then ₹10 and less then ₹500.',
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if(game_type == "ludo-classic-rich-mode" && (Game_Ammount < 25000 || Game_Ammount > 100000)){
      Swal.fire({
        title: 'Game amount should be Greater then ₹25000 and less then ₹1,00,000.',
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .post(
        baseUrl+`challange/create`,
        {
          Game_Ammount,
          Game_type: game_type,
        },
        { headers }
      )
      .then((res) => {
        if(res.data.msg==='you can not create same amount challenge.')
        {
          Swal.fire({
            title: 'you can not create same amount challenge.',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (res.data.msg === "you have already enrolled") {
          Swal.fire({
            title: "You have already enrolled",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }else if (res.data.msg === "You can set maximum 2 battle.") {
          Swal.fire({
            title: "You can set maximum 2 battle.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (res.data.msg === "Insufficient balance") {
          Swal.fire({
            title: "Insufficient balance",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (
          res.data.msg ===
          "Game amount should be Greater then 50 and less then 25000"
        ) {
          Swal.fire({
            title: "Game amount should be Greater then 50 and less then 25000",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (
          res.data.msg ===
          "Set Battle in denomination of 10"
        ) {
          Swal.fire({
            title: "Set Battle in denomination of 10",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (
          res.data.msg ===
          "Technical Issue, Try after an hour!"
        ) {
          Swal.fire({
            title: "Technical Issue, Try after an hour!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else {
          // Allgames();
          socket.emit("gameCreated");

        }
      })
      .catch((e) => {
        if (e.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response.status === 400 || e.response.status === 429) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        console.log(e)
      });
  };

  const [allgame, setAllGame] = useState([]);
  const [mount,setMount]=useState(false);
  //const [ALL, setALL] = useState();
  const [runningGames, setRunningGames] = useState();
  const [ownRunning,setOwnRunning]=useState([]);

  const Allgames = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(baseUrl+`challange/all`, { headers })
      .then((res) => {
        let owenedCreated=[],remainingGame=[];
        res.data.forEach(function (ele) {
            if((ele.Created_by._id===user)&&(ele.Status==="new"||ele.Status==="requested"))
            {
              owenedCreated.push(ele);
            }
            else{
              remainingGame.push(ele);
            }
          })
        setCreated(owenedCreated);
        setAllGame(remainingGame);
      })
      .catch(e=>{
        /*
        if (e.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response.status === 400 || e.response.status === 429) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        */
      })
  };

  const runningGame = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(baseUrl+`challange/running/all`, { headers })
      .then((res) => {
        let owenedRunning=[],remainingRunning=[];
        res.data.forEach(function (ele) {
          if(ele.Created_by&&ele.Accepetd_By)
          if((ele.Created_by._id === userID.current) || (ele.Accepetd_By._id === userID.current))
          {
            owenedRunning.push(ele);
          }
          else{
            remainingRunning.push(ele);
          }
        });
        setOwnRunning(owenedRunning);
        setRunningGames(remainingRunning);
      })
      .catch((e)=>{
        console.log('errror',e)
        if (e.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
          //    setTimeout(() => {
          // //  history.push("/login")
          // }, 500);
        }
          if (e.response.status === 400||e.response.status === 429) {
            Swal.fire({
              title: 'Please refresh!',
              icon: "warning",
              confirmButtonText: "OK",
            });
          }
      })
  };
  
  function winnAmount(gameAmount) {
    let profit = null;
    if (gameAmount >= 10 && gameAmount <= 250)
      profit = gameAmount * 10 / 100;
    else if (gameAmount > 250 && gameAmount <= 500)
    profit = 25;
    else if (gameAmount > 500)
      profit = gameAmount * 6 / 100;
    return gameAmount - profit;
  }

  const SOCKET_SERVER_URL = "https://socket.a1gaming.co.in";
  // const SOCKET_SERVER_URL = "https://socket.a1adda.com"; 

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      extraHeaders: {
    
      }
    });

    setSocket(socket);

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected: ", reason);
      if (reason === "ping timeout" && isMounted.current) {
        setSocket(io(SOCKET_SERVER_URL)); // Reconnect on timeout
      }
    });

    socket.on("recieveGame", (data) => {
      
      const ownedCreated = [];
      const remainingGame = [];
      data.forEach((ele) => {
        if (ele.Created_by) {
          if (ele.Created_by._id === userID.current && (ele.Status === "new" || ele.Status === "requested")) {
            ownedCreated.push(ele);
          } else {
            remainingGame.push(ele);
          }
        }
      });
      setCreated(ownedCreated);
      setAllGame(remainingGame);
    });

    socket.on("updateRunning", (data) => {
      const ownedCreated = [];
      const remainingGame = [];
      data.forEach((ele) => {
        if (ele.Created_by) {
          if (ele.Created_by._id === userID.current && (ele.Status === "new" || ele.Status === "requested")) {
            ownedCreated.push(ele);
          } else {
            remainingGame.push(ele);
          }
        }
      });
      setCreated(ownedCreated);
      setAllGame(remainingGame);
      walletUpdate(); // Assuming walletUpdate is a function you have defined
    });

    socket.on("acceptor_seen", (data) => {
      const ownedCreated = [];
      const remainingGame = [];
      data.openBattle.forEach((ele) => {
        if (ele.Created_by) {
          if (ele.Created_by._id === userID.current && (ele.Status === "new" || ele.Status === "requested")) {
            ownedCreated.push(ele);
          } else {
            remainingGame.push(ele);
          }
        }
      });
      setCreated(ownedCreated);
      setAllGame(remainingGame);
      const ownedRunning = [];
      const remainingRunning = [];
      data.runningBattle.forEach((ele) => {
        if (ele.Created_by && ele.Accepetd_By) {
          if (ele.Created_by._id === userID.current || ele.Accepetd_By._id === userID.current) {
            ownedRunning.push(ele);
          } else {
            remainingRunning.push(ele);
          }
        }
      });
      setOwnRunning(ownedRunning);
      setRunningGames(remainingRunning);
      walletUpdate();
    });
    socket.on("resultUpdateReq", (data) => {
      let owenedRunning=[],remainingRunning=[];
      data.forEach(function (ele) {
          if(ele.Created_by&&ele.Accepetd_By)
        if((ele.Created_by._id==userID.current)||(ele.Accepetd_By._id==userID.current))
        {
          owenedRunning.push(ele);
        }
        else{
          remainingRunning.push(ele);
        }
      });
      setOwnRunning(owenedRunning);
      setRunningGames(remainingRunning);
        walletUpdate();
    });
  
    socket.on("startAcepptor", (data) => {
        let owenedCreated=[],remainingGame=[];
        data.forEach(function (ele) {
            if(ele.Created_by)
            if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
            {
              owenedCreated.push(ele);
            }
            else{
              remainingGame.push(ele);
            }
          })
        setCreated(owenedCreated);
        setAllGame(remainingGame);
        walletUpdate();
    });
  
    socket.on("challengeAccepted", (data) => {
        let owenedCreated=[],remainingGame=[];
        data.forEach(function (ele) {
            if(ele.Created_by)
          if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
          {
              owenedCreated.push(ele);
            }
            else{
              remainingGame.push(ele);
            }
          })
        setCreated(owenedCreated);
        setAllGame(remainingGame);
    });
  
    socket.on("updateReject", (data) => {
        let owenedCreated=[],remainingGame=[];
        data.forEach(function (ele) {
            if(ele.Created_by)
          if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
          {
              owenedCreated.push(ele);
            }
            else{
              remainingGame.push(ele);
            }
          })
        setCreated(owenedCreated);
        setAllGame(remainingGame);
    });
  
    socket.on("ongoingChallenge", (data) => {
      let owenedCreated=[],remainingGame=[];
      data.openBattle.forEach(function (ele) {
          if(ele.Created_by)
        if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
        {
            owenedCreated.push(ele);
          }
          else{
            remainingGame.push(ele);
          }
        });
      setCreated(owenedCreated);
      setAllGame(remainingGame);
      let owenedRunning=[],remainingRunning=[];
      data.runningBattle.forEach(function (ele) {
          if(ele.Created_by&&ele.Accepetd_By)
        if((ele.Created_by._id==userID.current)||(ele.Accepetd_By._id==userID.current))
        {
          owenedRunning.push(ele);
        }
        else{
          remainingRunning.push(ele);
        }
      });
      setOwnRunning(owenedRunning);
      setRunningGames(remainingRunning);
    });
    
    socket.on("updateDelete", (data) => {
        let owenedCreated=[],remainingGame=[];
        data.forEach(function (ele) {
            if(ele.Created_by)
          if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
          {
              owenedCreated.push(ele);
            }
            else{
              remainingGame.push(ele);
            }
          })
        setCreated(owenedCreated);
        setAllGame(remainingGame);
    });
    // Add all other event listeners similarly...

    return () => {
      isMounted.current = false;
      socket.disconnect();
      setSocket(null);
    };
  }, []);
  
  useEffect(() => {

    let access_token = localStorage.getItem('token');
    access_token = localStorage.getItem('token');
    if(!access_token)
    {
        window.location.reload()
           setTimeout(() => {
          //  history.push("/login")
        }, 500);;
    }
    role();
    if(mount)
    {
      Allgames();
      runningGame();
    }
   
  }, [mount]);
  //accept Challange
  const AcceptChallang = (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .put(
        baseUrl+`challange/accept/${id}`,
        {
          Accepetd_By: headers,
          Acceptor_by_Creator_at: Date.now(),
        },
        {
          headers,
        }
      )
      .then((res) => {
        if (res.data.msg === "you have already enrolled") {
          Swal.fire({
            title: "You have already enrolled",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        if (res.data.msg === "Insufficient balance") {
          Swal.fire({
            title: "Insufficient balance",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          Allgames(res.data);
          socket.emit("acceptGame");
        }
      })
      .catch((e) => {
        console.log(e)
        if (e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response.status == 400||e.response.status==429) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  //reject Game
  const RejectGame = (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .put(
        baseUrl+`challange/reject/${id}`,
        {
          Accepetd_By: null,
          Status: "new",
          Acceptor_by_Creator_at: null,
        },
        { headers }
      )
      .then((res) => {
        socket.emit("gameRejected");
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response.status == 400||e.response.status==429) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  //delete
  const deleteChallenge = (_id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .delete(baseUrl+`challange/delete/${_id}`, { headers })
      .then((res) => {
        socket.emit("deleteGame", _id);
      })
      .catch((e) => {
        //console.log(e);
        if (e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response.status == 400||e.response.status==429) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  ///challange/running/update/

  const updateChallenge = (_id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .put(
        baseUrl+`challange/running/update/${_id}`,
        {
          Acceptor_seen: true,
        },
        { headers }
      )
      .then((res) => {
        socket.emit("game_seen");
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response.status == 400||e.response.status==429) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }        
        console.log(e)
      });
  };

  // const [roomCode, setRoomCode] = useState()

  const getPost = async (Id) => {
    if (game_type === 'ludo-classic-light-mode' || game_type === 'ludo-classic-rich-mode' || game_type === 'Ludo Ulta') {
      socket.emit('roomCode', { game_id: Id, status: 'running' })
      
    }
    else if(game_type==='Ludo Popular') {
      socket.emit('popularroomCode', { game_id: Id, status: 'running' })

     
    }
  }

  return (
    <>
        <Header user={userAllData} />
      <div className="leftContainer" style={{ minHeight:'100vh' }}>

        <div className={css.mainArea} style={{ paddingTop: "60px",minHeight:'100vh' }}>
      {/*  <div className="alert alert-danger text-center" role="alert">
🙏प्लेयर्स कृपया ध्यान दे Popular का code सिर्फ Popular वाले गेम में ही दे अगर आप Classic वाले में Popular का कोड देते है तो आपकी बेट कैंसिल मानी जायगी 🙏


        </div> 
        */}
        {game_type == "ludo-classic-light-mode" && <div className="text-center">
        <h4 className="mt-3 text-center text-dark">Ludo Classic Lite Mode</h4>
        <p>शर्त राशि: ₹10 से ₹25,000/-</p>
        </div>}

        {game_type == "ludo-classic-rich-mode" && <div className="text-center">
        <h4 className="mt-3 text-center text-dark">Ludo Classic Rich Mode</h4>
        <p>शर्त राशि: ₹25,000 से ₹1,00,000/-</p>
        </div>}

          <span className={`${css.cxy} ${css.battleInputHeader} mt-4`}>
            Create a Battle! 
          </span>

          <div className="mx-auto d-flex my-2 w-50">
            <div>
              <input
                className={css.formControl}
                type="tel"
                min="10"
                max="100000"
                placeholder="Amount"
                onChange={(e) => setGame_Ammount(e.target.value)}
              />
            </div>

            <div className="set ml-1 ">
              {" "}
              <button
                className={`bg-green ${css.playButton} cxy m-1 position-static `}
                style={{ margin: "20px !important" }}
                onClick={(e) => {
                  e.preventDefault();
                  ChallengeCreate();
                }}
              >
                Set
              </button>
            </div>

           
          </div>
          <div className={css.dividerX}></div>

          <div className="px-4 py-3">
            <div className="mb-3">
              <img
                src={process.env.PUBLIC_URL + "/Images/Homepage/battleIcon.png"}
                alt=""
                width="20px"
              />
              <span className={`ml-2 ${css.gamesSectionTitle}`}>
                Open Battles
              </span>
              <span
                className={`${css.gamesSectionHeadline} text-uppercase position-absolute mt-2 font-weight-bold`}
                style={{ right: "1.5rem" }}
              >
                Rules
                <NavLink to="/Rules">
                  <img
                    className="ml-2"
                    src={process.env.PUBLIC_URL + "/Images/Homepage/info.png"}
                    alt=""
                  />
                </NavLink>
              </span>
            </div>
            
           
            {created &&
              created.map((allgame) => 
              (allgame.Game_type == game_type)&&
                 (
                    <BetCard key={allgame?._id} allgame={allgame} user={user} deleteChallenge={deleteChallenge} getPost={getPost} RejectGame={RejectGame} winnAmount={winnAmount} AcceptChallang={AcceptChallang} updateChallenge={updateChallenge} />
                  )
                )}
            {allgame &&
              allgame.map((allgame) => 
               (
                  (allgame.Status=="new"||
                  (allgame.Status == "requested" && (user == allgame.Created_by?._id || user == allgame.Accepetd_By?._id))||
                  (allgame.Status == "running" && user == allgame.Accepetd_By?._id && allgame.Acceptor_seen == false)) 
                  && allgame.Game_type == game_type
                )&&
                 (
                  <BetCard key={allgame?._id} allgame={allgame} user={user} deleteChallenge={deleteChallenge} getPost={getPost} RejectGame={RejectGame} winnAmount={winnAmount} AcceptChallang={AcceptChallang} updateChallenge={updateChallenge} />
                  )
                )}
          </div>
          <div className={css.dividerX}></div>
          <div className="px-4 py-3">
            <div className="mb-2">
              <img
                src={
                  process.env.PUBLIC_URL + "/Images/Homepage/battleIcon.png"
                }
                alt=""
                width="20px"
              />
              <span className={`ml-2 ${css.gamesSectionTitle}`}>
                Running Battles
              </span>
            </div>
            {ownRunning&&ownRunning.map((runnig)=>{
              //if (((user == runnig.Accepetd_By._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending")) : ((runnig.Status === "running" && user == runnig.Created_by._id) || (runnig.Status === "pending" )))||runnig.Status=="conflict") && runnig.Game_type == game_type)
              if (((user == runnig.Accepetd_By?._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By?._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending")) : ((runnig.Status === "running" && user == runnig.Created_by?._id) || (runnig.Status === "pending" )))||runnig.Status=="conflict"))
              return (
                <RunningCard key={runnig?._id} runnig={runnig} user={user} winnAmount={winnAmount} />
              );
            })}
           
            {runningGames &&
              runningGames.map((runnig) => {
                //if (((user == runnig.Accepetd_By._id || user == runnig.Created_by._id) ? (user == runnig.Accepetd_By._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending" && runnig.Acceptor_status == null)) : ((runnig.Status === "running" && user == runnig.Created_by._id) || (runnig.Status === "pending" && runnig.Creator_Status == null))) : (runnig.Status === "running" || runnig.Status === "pending")) && runnig.Game_type == game_type)
                if (((user == runnig.Accepetd_By?._id || user == runnig.Created_by?._id) ? (user == runnig.Accepetd_By?._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By?._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending" && runnig.Acceptor_status == null)) : ((runnig.Status === "running" && user == runnig.Created_by?._id) || (runnig.Status === "pending" && runnig.Creator_Status == null))) : (runnig.Status === "running" || runnig.Status === "pending")))  
                return (
                    <RunningCard key={runnig?._id} runnig={runnig} user={user} winnAmount={winnAmount} />
                  );
              })}
          </div>
        </div>
      </div>
      {/* <div className="rightContainer">
        <Rightcontainer />
      </div> */}
    </>
  );
}