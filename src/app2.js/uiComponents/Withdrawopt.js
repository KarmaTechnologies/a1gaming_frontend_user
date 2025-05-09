import React, { useState, useEffect } from "react";
import "../css/layout.css";
import "../css/homepage.css";
import css from "../css/with.css";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Loader.css";
import findGif from "../css/loading.gif";
import Header from "../Components/Header";
import "../Components/Component-css/Common.css";
import withdrawClose from '../images/withdrawclose.png'

const Withdrawopt = ({ walletUpdate }) => {
  const history = useHistory();
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const access_token = localStorage.getItem("token");
  const [Id, setId] = useState(null);
  const [user, setUser] = useState();
  const [holder_name, setHolder_name] = useState();
  const [account_number, setAccount_number] = useState();
  const [ifsc_code, setIfsc_code] = useState();
  const [upi_id, setUpi_id] = useState();
  const [next, setNext] = useState(false);

  const [WebSitesettings, setWebsiteSettings] = useState("");
  const fetchData = async () => {
    const response = await fetch(baseUrl + "settings/data");
    const data = await response.json();
    return setWebsiteSettings(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [isCashFreePayoutActive, setCashFreePayoutActive] = useState(false);
  const [isRazorPayPayoutActive, setRazorPayPayoutActive] = useState(false);
  const [isDecentroPayoutActive, setDecentroPayoutActive] = useState(false);
  const [isManualPayoutActive, setManualPayoutActive] = useState(false);
  const [isManualBankPayoutActive, setManualBankPayoutActive] = useState(false);
  const [isMypayPayoutActive, setMypayPayoutActive] = useState(false);
  const [isMypayPayoutBankActive, setMypayPayoutBankActive] = useState(false);
  const [isMypayzonePayoutBankActive, setMypayzonePayoutBankActive] =
    useState(false);
  const [isMypayzone2PayoutBankActive, setMypayzone2PayoutBankActive] =
    useState(false);
  const [isRazorPayPayoutAuto, setRazorPayPayoutAuto] = useState(false);
  const [isDecentroPayoutAuto, setDecentroPayoutAuto] = useState(false);
  const [maxAutopayAmt, setMaxAutopayAmt] = useState(0);

  const [submitBtn, setSubmitBtn] = useState(true);

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(baseUrl + `me`, { headers })
      .then((res) => {
        setUser(res.data);
        setId(res.data._id);
        setHolder_name(res.data.holder_name);
        setAccount_number(res.data.account_number);
        setIfsc_code(res.data.ifsc_code);
        setUpi_id(res.data.upi_id);
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });

    axios
      .get(baseUrl + `website/setting`)
      .then((res) => {
        //console.log(res);
        setCashFreePayoutActive(res.data.isCashFreePayoutActive);
        setRazorPayPayoutActive(res.data.isRazorPayPayoutActive);
        setDecentroPayoutActive(res.data.isDecentroPayoutActive);
        setManualPayoutActive(res.data.isManualPayoutActive);
        setManualBankPayoutActive(res.data.isManualBankPayoutActive);

        setRazorPayPayoutAuto(res.data.isRazorPayPayoutAuto);
        setDecentroPayoutAuto(res.data.isDecentroPayoutAuto);
        setMaxAutopayAmt(res.data.maxAutopayAmt);
        setMypayPayoutActive(res.data.isMypayPayoutActive);
        setMypayPayoutBankActive(res.data.isMypayPayoutBankActive);
        setMypayzonePayoutBankActive(res.data.mypaypayout);
        setMypayzone2PayoutBankActive(res?.data?.mypayzone2 || false);
      })
      .catch((e) => {
        setManualPayoutActive(false);
        setCashFreePayoutActive(false);
        setRazorPayPayoutActive(false);
        setDecentroPayoutActive(false);
        setMaxAutopayAmt(0);
      });
  }, []);

  const updateBankDetails = async () => {
    setMount(true);
    setSubmitBtn(false);
    // e.preventDefault();
    let confirm = false;
    if (type == "upi" || type == "manualupi" || type == "mypayupi") {
      let regex = /^[\w.-]+@[\w.-]+$/.test(upi_id);

      if (regex == true) {
        Swal.fire({
          title: `Is your UPI ID  is correct ? ` + upi_id,
          icon: "success",
          confirmButtonText: "OK",
        });
        confirm = true;
      } else {
        Swal.fire({
          title: "Invalid UPI ID: " + upi_id,
          icon: "error",
          confirmButtonText: "OK",
        });
        confirm = false;
        setSubmitBtn(true);
      }
    } else {
      if (!holder_name || !account_number || !ifsc_code) {
        setMount(false);
        setSubmitBtn(true);
        Swal.fire({
          title: "Invalid Bank Details",
          icon: "error",
          confirmButtonText: "OK",
        });
        confirm = false;
      } else {
        confirm = true;
      }
      //var confirmMsg = `Is your Bank Account Number is correct ? `+account_number;
    }

    let isBT = false;
    let isUPIT = false;
    if (type == "upi" || type == "manualupi" || type == "mypayupi") {
      isUPIT = true;
      isBT = false;
    } else {
      isBT = true;
      isUPIT = false;
    }

    if (confirm) {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const data = await axios
        .patch(
          baseUrl + `user/edit`,
          {
            holder_name,
            account_number,
            ifsc_code,
            upi_id,
            bankDetails: isBT,
            upiDetails: isUPIT,
          },
          { headers }
        )
        .then((res) => {
          console.log("updata bank details", res);
          if (res.data.subCode === "200") {
            let calculatedWallet =
              user.wonAmount -
              user.loseAmount +
              user.totalDeposit +
              user.referral_earning +
              user.hold_balance +
              user.totalBonus -
              (user.totalWithdrawl + user.referral_wallet + user.totalPenalty);
            calculatedWallet == user.Wallet_balance
              ? withReqComes()
              : withReqComes();
          } else {
            setMount(false);
            setSubmitBtn(true);
            Swal.fire({
              title: res.data.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((e) => {
          console.log(e);
          if (e.response.status == 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("token");
            window.location.reload();
            history.push("/login");
          }
        });
    } else {
      setMount(false);
      setSubmitBtn(true);
    }
  };

  const [amount, setAmount] = useState();
  const [type, setType] = useState(undefined);
  const [mount, setMount] = useState(false);
  // const [accunt, setUpi] = useState()
  // const [account_no, setAccount_no] = useState()
  // const [IFSC, setIFSC] = useState();

  //this function for handleAuto payout service with payment gateway

  const doAutoPayout = () => {
    if (isRazorPayPayoutAuto && type == "upi") {
      //alert('payoutFromRazorpay');
      if (amount <= maxAutopayAmt) {
        payoutFromRazorpay();
      } else {
        payoutFromRazorpay();
      }
    } else if (isDecentroPayoutAuto && type == "banktransfer") {
      //alert('payoutFromDecentro');
      if (amount <= maxAutopayAmt) {
        payoutFromDecentro();
      } else {
        withReqComes();
      }
    } else if (isDecentroPayoutAuto && type == "mypaybank") {
      //alert('payoutFromDecentro');
      if (amount <= maxAutopayAmt) {
        // withReqComes();
        payoutFromDecentro();
      } else {
        withReqComes();
      }
    }
    else if (isDecentroPayoutAuto && type == "mypayzone") {
      //alert('payoutFromDecentro');
      if (amount <= maxAutopayAmt) {
        // withReqComes();
        payoutFromPayZone();
      } else {
        withReqComes();
      }
    } else if (isDecentroPayoutAuto && type == "mypayupi") {
      //alert('payoutFromDecentro');
      if (amount <= maxAutopayAmt) {
        payoutFromDecentro();
      } else {
        withReqComes();
      }
    } else if (isManualPayoutActive && type == "manualupi") {
      //alert('payoutFromDecentro');
      if (amount <= maxAutopayAmt) {
        payoutFromManual();
      } else {
        payoutFromManual();
      }
    } else if (isManualBankPayoutActive && type == "manualbanktransfer") {
      //alert('payoutFromDecentro');
      if (amount <= maxAutopayAmt) {
        payoutFromManual();
      } else {
        payoutFromManual();
      }
    } else {
      //alert('withReqComes');
      withReqComes();
    }
  };

  //use for Razorpay payout

  const payoutFromManual = () => {
    if (amount && amount >= 95 && amount <= 100000 && type) {
      // e.preventDefault();
      var withdraw_type = "UPI";
      if (type === "manualbanktransfer") {
        withdraw_type = "banktransfer";
      } else {
        withdraw_type = "UPI";
      }
      const payment_gatway = "manualupi";
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `withdraw/payoutmanualupi`,
          {
            amount,
            withdraw_type,
            payment_gatway,
          },
          { headers }
        )
        .then((response) => {
          walletUpdate();
          setMount(false);
          console.log(response.data);
          if (response.data.status === "Processing") {
            setTimeout(() => {
              axios
                .get(baseUrl + `manual/payoutstatus/${response.data._id}`, {
                  headers,
                })
                .then((res) => {
                  //console.log(res);
                  const icon =
                    res.data.status === "SUCCESS" ? "success" : "danger";
                  var title = "";
                  if (res.data && res.data.status === "SUCCESS") {
                    title = "Withdraw successfully done";
                  } else if (res.data && res.data.status === "Processing") {
                    title = "Withdrawal transaction in proccess.";
                  } else if (!res.data.status) {
                    title = "Withdraw request transaction Rejected";
                  }

                  history.push("/");
                  setTimeout(() => {
                    setMount(false);
                    Swal.fire({
                      title: title,
                      icon: icon,
                      confirmButtonText: "OK",
                    });
                  }, 1000);
                });
            }, 30000);
            setMount(true);
          } else {
            Swal.fire({
              title: response.data.message,
              icon: "danger",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((e) => {
          setMount(false);
          Swal.fire({
            title: "Error! try after sometime.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.log(e);
        });
    } else {
      setMount(false);
      let msg = "Enter all fields";
      if (!amount || !type) {
        let msg = "Enter all fields";
      } else if (95 <= amount) {
        msg = "amount should be more than 95";
      } else if (amount <= 100000) {
        msg = "amount should be less than 100000";
      }
      Swal.fire({
        title: msg,
        icon: "Error",
        confirmButtonText: "OK",
      });
    }
  };

  const payoutFromRazorpay = () => {
    if (amount && amount >= 95 && amount <= 100000 && type) {
      // e.preventDefault();
      const payment_gatway = "razorpay";
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `withdraw/payoutrazorpaybank`,
          {
            amount,
            type,
            payment_gatway,
          },
          { headers }
        )
        .then((res) => {
          walletUpdate();
          setMount(false);
          console.log(res.data);
          if (res.data.subCode === "200") {
            console.log("cash res", res);
            Swal.fire({
              title: res.data.message,
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: res.data.message,
              icon: "danger",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((e) => {
          setMount(false);
          Swal.fire({
            title: "Error! try after sometime.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.log(e);
        });
    } else {
      setMount(false);
      let msg = "Enter all fields";
      if (!amount || !type) {
        let msg = "Enter all fields";
      } else if (95 <= amount) {
        msg = "amount should be more than 95 ";
      } else if (amount <= 100000) {
        msg = "amount should be less than 100000";
      }
      Swal.fire({
        title: msg,
        icon: "Error",
        confirmButtonText: "OK",
      });
    }
  };

  //use for Razorpay payout end

  //use for decentro payout

  const payoutFromDecentro = () => {
    if (amount && amount >= 95 && amount <= 100000 && type) {
      // e.preventDefault();
      const payment_gatway = "kvm";
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `withdraw/mypaybankpayout/user`,
          {
            amount,
            type,
            payment_gatway,
          },
          { headers }
        )
        .then((res) => {
          setTimeout(() => {
            walletUpdate();
          }, 5000);
          setMount(false);
          console.log(res.data);
          if (res.data.subCode === "200") {
            console.log("cash res", res);
            Swal.fire({
              title: res.data.message,
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: res.data.message,
              icon: "danger",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((e) => {
          setMount(false);
          Swal.fire({
            title: "Error! try after sometime.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.log(e);
        });
    } else {
      setMount(false);
      let msg = "Enter all fields";
      if (!amount || !type) {
        let msg = "Enter all fields";
      } else if (95 <= amount) {
        msg = "amount should be more than 95 ";
      } else if (amount <= 100000) {
        msg = "amount should be less than 100000";
      }
      Swal.fire({
        title: msg,
        icon: "Error",
        confirmButtonText: "OK",
      });
    }
  };

  const payoutFromPayZone = () => {
    if (amount && amount >= 95 && amount <= 100000 && type) {
      // e.preventDefault();
      const payment_gatway = "mypayzone";
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `withdraw/mypaypayout/user`,
          {
            amount,
            type,
            payment_gatway,
          },
          { headers }
        )
        .then((res) => {
          setTimeout(() => {
            walletUpdate();
          }, 5000);
          setMount(false);
          console.log(res.data);
          if (res.data.subCode === "200") {
            console.log("cash res", res);
            Swal.fire({
              title: res.data.message,
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: res.data.message,
              icon: "danger",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((e) => {
          setMount(false);
          Swal.fire({
            title: "Error! try after sometime.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.log(e);
        });
    } else {
      setMount(false);
      let msg = "Enter all fields";
      if (!amount || !type) {
        let msg = "Enter all fields";
      } else if (95 <= amount) {
        msg = "amount should be more than 95 ";
      } else if (amount <= 100000) {
        msg = "amount should be less than 100000";
      }
      Swal.fire({
        title: msg,
        icon: "Error",
        confirmButtonText: "OK",
      });
    }
  };

  //use for decentro payout end

  const handleSubmitdata = () => {
    if (amount && amount >= 95 && amount <= 100000 && type) {
      // e.preventDefault();
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `withdraw/bank`,
          {
            amount,
            type,
          },
          { headers }
        )
        .then((res) => {
          setTimeout(() => {
            walletUpdate();
          }, 5000);
          setMount(false);
          console.log(res.data);
          if (res.data.subCode === "200") {
            console.log("cash res", res);
            Swal.fire({
              title: res.data.message,
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: res.data.message,
              icon: "danger",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((e) => {
          setMount(false);
          Swal.fire({
            title: "Error! try after sometime.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.log(e);
        });
    } else {
      setMount(false);
      let msg = "Enter all fields";
      if (!amount || !type) {
        let msg = "Enter all fields";
      } else if (amount && amount >= 95) {
        msg = "amount should be more than 95 ";
      } else if (amount <= 100000) {
        msg = "amount should be less than 100000";
      }
      Swal.fire({
        title: msg,
        icon: "Error",
        confirmButtonText: "OK",
      });
    }
  };

  const withReqComes = async () => {
    try {
      // if ( amount && amount >= 95 && amount <= 5000) {
      setMount(true);

      if (type == "upi") {
        var payment_gatway = "razorpay";
      } else if (type == "manualupi") {
        var payment_gatway = "manualupi";
      } else if (type == "mypayupi") {
        var payment_gatway = "mypayupi";
      } else if (type == "mypaybank") {
        var payment_gatway = "mypaybank";
      } else if (type == "mypayzone") {
        var payment_gatway = "mypayzone";
      } else {
        var payment_gatway = "decentro";
      }

      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      await axios
        .post(
          baseUrl + `withdraw/request`,
          {
            amount,
            type,
            payment_gatway,
          },
          { headers }
        )
        .then((res) => {
          walletUpdate();
          if (res.data.success) {
            Swal.fire({
              title: res.data.msg,
              icon: "success",
              confirmButtonText: "OK",
            });
            setSubmitBtn(true)
          } else {
            Swal.fire({
              title: res.data.msg,
              icon: "error",
              confirmButtonText: "OK",
            });
            setSubmitBtn(true)
          }
          setMount(false);
        })
        .catch((e) => {
          console.log(e);
        });
      // }
      // else{
      //      setMount(false);
      //      Swal.fire({
      //           title: "amount should be more than 95 and less then 5000.",
      //           icon: "error",
      //           confirmButtonText: "OK",
      //         });
      // }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header user={user} />

      <div
        className="leftContainer withdrawl_section"
        style={{ minHeight: "105vh", height: "100%" }}
      >
<p className="pt-5 mt-5">सर्वर डाउन होने की वजह से withdrawal सेवाए कुछ समय ⏱️ के लिए बंद है कुछ समय मैं जल्द ही withdrawal शुरू हो जाएगा ।
धन्यवाद 🙏</p>

        {
          (isMypayPayoutActive === false && isManualPayoutActive === false && isMypayPayoutBankActive === false && isMypayzonePayoutBankActive === false && isMypayzone2PayoutBankActive === false && isManualBankPayoutActive === false && isRazorPayPayoutActive === false && isDecentroPayoutActive === false) ?

            <div className="w-100">
              <div className="mt-4 pt-5 d-flex align-items-center text-justify" style={{ fontWeight: 500 }}>
                Withdraw is Currently Disable beacuse of Security Reasons. Please Come Back Later. It will be Available Soon.
              </div>
              <div>
                <img src={withdrawClose} alt="Scan this QR code with Google Authenticator" className="w-100" />
              </div>

            </div>
            :
            <>

              <div className="mt-4 pt-5">
                अब आप अपनी पूरी राशि (100%) बिना किसी सीमा के निकाल सकते हैं। अनलिमिटेड विदड्रॉल की सुविधा शुरू हो चुकी है। 🙏</div>
              <div className="mt-4 ">
                You can now withdraw unlimited amounts without any restrictions. 🙏
              </div>
            </>

        }






        <div className="bank_transfer_container">
          <div className="transfer_form_section">
            <div className="">
              <div className="text-center mt-3">
                {user && user.verified === "verified" && (
                  <div>
                    <h4>
                      <p className="withdrawl_option">
                        {type == undefined
                          ? "Choose Withdrawal Option."
                          : "Withdraw Through"}
                      </p>
                    </h4>

                    {Boolean(!next) && (
                      <div>
                        {Boolean(isMypayPayoutActive) && (
                          <div
                            onClick={() => {
                              setType("mypayupi");
                              setNext(true);
                            }}
                            className="first_bank_transfer_btn"
                            style={{
                              paddingTop: "0px",
                              //pointerEvents: "none", opacity: "0.6"
                            }}
                          >
                            <div
                              className=""
                              style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "0.3rem",
                                padding: "1rem",
                                zIndex: "3",
                                width: "100%",
                              }}
                            >
                              <div>
                                <img
                                  width="60px"
                                  src={
                                    process.env.PUBLIC_URL +
                                    "Images/kd_ludo/upi_logo.png"
                                  }
                                  alt=""
                                  style={{ marginBottom: "1rem" }}
                                />
                              </div>
                              <div className="justify-content-center">
                                <div>
                                  <strong className="bank_title">
                                    Withdraw through UPI
                                  </strong>
                                </div>
                                <div className="jss31"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {Boolean(isManualPayoutActive) && (
                          <div
                            onClick={() => {
                              setType("manualupi");
                              setNext(true);
                            }}
                            className="first_bank_transfer_btn"
                            style={{
                              paddingTop: "0px",
                              //pointerEvents: "none", opacity: "0.6"
                            }}
                          >
                            <div
                              className=""
                              style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "0.3rem",
                                padding: "1rem",
                                zIndex: "3",
                                width: "100%",
                              }}
                            >
                              <div>
                                <img
                                  width="60px"
                                  src={
                                    process.env.PUBLIC_URL +
                                    "Images/kd_ludo/upi_logo.png"
                                  }
                                  alt=""
                                  style={{ marginBottom: "1rem" }}
                                />
                              </div>
                              <div className="justify-content-center">
                                <div>
                                  <strong className="bank_title">
                                    Withdraw through UPI
                                  </strong>
                                </div>
                                <div className="jss31"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {Boolean(isMypayPayoutBankActive) && (
                          <div
                            onClick={() => {
                              setType("mypaybank");
                              setNext(true);
                            }}
                            className="first_bank_transfer_btn"
                            style={{ paddingTop: "0px" }}
                          >
                            <div
                              className=""
                              style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "0.3rem",
                                padding: "1rem",
                                width: "100%",
                                cursor: "pointer",
                              }}
                            >
                              <div>
                                <img
                                  width="45px"
                                  src={
                                    process.env.PUBLIC_URL +
                                    "Images/kd_ludo/bank.png"
                                  }
                                  alt=""
                                  style={{ marginBottom: "1rem" }}
                                />
                              </div>
                              <div className="justify-content-center">
                                <div>
                                  <strong className="bank_title">
                                    Bank Transfer
                                  </strong>
                                  <br />
                                  <small className="bank_title_caption">
                                    Minimum withdrawal amount ₹95
                                  </small>
                                  <br />
                                  {/* <small className="text-danger">Direct Bank Transaction will take 1-2 hour</small> */}
                                  <span>Click Here</span>
                                </div>
                                <div className="jss31"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {(Boolean(isMypayzonePayoutBankActive) || Boolean(isMypayzone2PayoutBankActive)) && (
                          <div
                            onClick={() => {
                              setType("mypayzone");
                              setNext(true);
                            }}
                            className="first_bank_transfer_btn"
                            style={{ paddingTop: "0px" }}
                          >
                            <div
                              className=""
                              style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "0.3rem",
                                padding: "1rem",
                                width: "100%",
                                cursor: "pointer",
                              }}
                            >
                              <div>
                                <img
                                  width="45px"
                                  src={
                                    process.env.PUBLIC_URL +
                                    "Images/kd_ludo/bank.png"
                                  }
                                  alt=""
                                  style={{ marginBottom: "1rem" }}
                                />
                              </div>
                              <div className="justify-content-center">
                                <div>
                                  <strong className="bank_title">
                                    Bank Transfer
                                  </strong>
                                  <br />
                                  <small className="bank_title_caption">
                                    Minimum withdrawal amount ₹95
                                  </small>
                                  <br />
                                  {/* <small className="text-danger">Direct Bank Transaction will take 1-2 hour</small> */}
                                  <span>Click Here</span>
                                </div>
                                <div className="jss31"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {Boolean(isManualBankPayoutActive) && (
                          <div
                            onClick={() => {
                              setType("manualbanktransfer");
                              setNext(true);
                            }}
                            className="first_bank_transfer_btn"
                            style={{ paddingTop: "0px" }}
                          >
                            <div
                              className=""
                              style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "0.3rem",
                                padding: "1rem",
                                width: "100%",
                              }}
                            >
                              <div>
                                <img
                                  width="45px"
                                  src={
                                    process.env.PUBLIC_URL +
                                    "Images/kd_ludo/bank.png"
                                  }
                                  alt=""
                                  style={{ marginBottom: "1rem" }}
                                />
                              </div>
                              <div
                                className="justify-content-center 
                        "
                              >
                                <div>
                                  <strong className="bank_title">
                                    Bank Transfer
                                  </strong>
                                  <br />
                                  <small className="bank_title_caption">
                                    Minimum withdrawal amount ₹95
                                  </small>
                                  <br />
                                  <small className="bank_title_caption">
                                    Direct Bank Transaction will take 1-2 hour
                                  </small>
                                </div>
                                <div className="jss31"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ================================= START :  Bank Transfer First Page ================================= */}

                        {Boolean(isRazorPayPayoutActive) && (
                          <div
                            onClick={() => {
                              setType("upi");
                              setNext(true);
                            }}
                            className="first_bank_transfer_btn"
                            style={{
                              paddingTop: "0px",
                              //pointerEvents: "none", opacity: "0.6"
                            }}
                          >
                            <div
                              className=""
                              style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "0.3rem",
                                padding: "1rem",
                                zIndex: "3",
                                width: "100%",
                              }}
                            >
                              <div>
                                <img
                                  width="60px"
                                  src={
                                    process.env.PUBLIC_URL +
                                    "Images/kd_ludo/upi_logo.png"
                                  }
                                  alt=""
                                  style={{ marginBottom: "1rem" }}
                                />
                              </div>
                              <div className="justify-content-center">
                                <div>
                                  <strong className="bank_title">
                                    Withdraw through UPI
                                  </strong>
                                  <br />
                                  <small className="bank_title_caption">
                                    Minimum withdrawal amount ₹95
                                  </small>
                                  <br />
                                  <small className="bank_title_caption">
                                    Instant withdrawal within 30sec.
                                  </small>
                                </div>
                                <div className="jss31"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {Boolean(isDecentroPayoutActive) && (
                          <div
                            onClick={() => {
                              setType("banktransfer");
                              setNext(true);
                            }}
                            className="first_bank_transfer_btn"
                            style={{ paddingTop: "0px" }}
                          >
                            <div
                              className=""
                              style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "0.3rem",
                                padding: "1rem",
                                width: "100%",
                              }}
                            >
                              <div>
                                <img
                                  width="45px"
                                  src={
                                    process.env.PUBLIC_URL +
                                    "Images/kd_ludo/bank.png"
                                  }
                                  alt=""
                                  style={{ marginBottom: "1rem" }}
                                />
                              </div>
                              <div className="justify-content-center">
                                <div>
                                  <strong className="bank_title">
                                    Bank Transfer
                                  </strong>
                                  <br />
                                  <small className="bank_title_caption">
                                    Minimum withdrawal amount ₹95
                                  </small>
                                  <br />
                                  <small className="bank_title_caption">
                                    Direct Bank Transaction will take 1-2 hour
                                  </small>
                                </div>
                                <div className="jss31"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ================================= END :  Bank Transfer First Page ================================= */}

                    {Boolean(next) && (
                      <div>
                        <div>
                          <div className="">
                            {Boolean(isMypayPayoutActive) &&
                              Boolean(type == "mypayupi") && (
                                <div
                                  className="add-fund-box my-3"
                                  style={{ paddingTop: "0px", height: "60px" }}
                                >
                                  <div
                                    className="d-flex align-items-center"
                                    style={{
                                      backgroundColor: "#fafafa",
                                      border: "1px solid grey",
                                      borderRadius: "7px",
                                    }}
                                  >
                                    <div
                                      className="d-flex align-items-center"
                                      style={{
                                        height: "60px",
                                        display: "flex",
                                        textAlign: "center",
                                      }}
                                    >
                                      <img
                                        width="45px"
                                        src={
                                          process.env.PUBLIC_URL + "/UPI.png"
                                        }
                                        alt=""
                                        style={{
                                          marginLeft: "7px",
                                          paddingBottom: "10px",
                                          paddingLeft: "3px",
                                          paddingTop: "5px",
                                        }}
                                      />
                                    </div>
                                    <div className="d-flex justify-content-center flex-column ml-4">
                                      <div className="text-left">
                                        <strong>Withdraw through UPI</strong>
                                      </div>
                                      <div className="jss31"></div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setNext(false);
                                      }}
                                      className="btn btn-info text-white font-weight-bold  ml-auto mr-3"
                                      style={{ fontSize: "0.5rem" }}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              )}

                            {Boolean(isManualPayoutActive) &&
                              Boolean(type == "manualupi") && (
                                <div
                                  className="add-fund-box my-3"
                                  style={{ paddingTop: "0px", height: "60px" }}
                                >
                                  <div
                                    className="d-flex align-items-center"
                                    style={{
                                      backgroundColor: "#fafafa",
                                      border: "1px solid grey",
                                      borderRadius: "7px",
                                    }}
                                  >
                                    <div
                                      className="d-flex align-items-center"
                                      style={{
                                        height: "60px",
                                        display: "flex",
                                        textAlign: "center",
                                      }}
                                    >
                                      <img
                                        width="45px"
                                        src={
                                          process.env.PUBLIC_URL + "/UPI.png"
                                        }
                                        alt=""
                                        style={{
                                          marginLeft: "7px",
                                          paddingBottom: "10px",
                                          paddingLeft: "3px",
                                          paddingTop: "5px",
                                        }}
                                      />
                                    </div>
                                    <div className="d-flex justify-content-center flex-column ml-4">
                                      <div className="text-left">
                                        <strong>Withdraw through UPI</strong>
                                      </div>
                                      <div className="jss31"></div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setNext(false);
                                      }}
                                      className="btn btn-info text-white font-weight-bold  ml-auto mr-3"
                                      style={{ fontSize: "0.5rem" }}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              )}

                            {Boolean(isManualBankPayoutActive) &&
                              Boolean(type == "manualbanktransfer") && (
                                <div
                                  className="transfer_btn_container"
                                  style={{ paddingTop: "0px" }}
                                >
                                  <button
                                    className="transfer_back_btn"
                                    onClick={() => {
                                      setType(undefined);
                                      setNext(false);
                                      console.log(type);
                                    }}
                                  >
                                    Back
                                  </button>
                                </div>
                              )}

                            {/* Boolean(isManualPayoutActive) && Boolean(type == "manualbanktransfer") && <div className="add-fund-box my-3" style={{ paddingTop: "0px", height: "60px" }}>
                          <div
                            className=""
                            style={{ backgroundColor: "#fafafa", border: "1px solid red", borderRadius: "7px" }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{ height: "60px", display: "flex", textAlign: "center" }}
                            >
                              <img
                                width="45px"
                                src={process.env.PUBLIC_URL + '/Bank.png'}
                                alt=""
                                style={{
                                  marginLeft: "7px",
                                  paddingBottom: "10px",
                                  paddingLeft: "3px",
                                  paddingTop: "5px",
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-center flex-column ml-4">
                              <div className="text-left">
                                <strong style={{color: 'pink'}}>Bank Transfer</strong>
                                <br />
                                <small className="text-warning">Minimum withdrawal amount ₹95</small>
                                <br/>
                                <small className="text-danger">Direct Bank Transaction will take 1-2 hour</small>
                              </div>
                              <div className="jss31"></div>
                            </div>
                            <button onClick={() => { setType(undefined); setNext(false); console.log(type) }} className="btn btn-info text-white font-weight-bold ml-auto mr-3" style={{ fontSize: '0.5rem' }}>Edit</button>
                          </div>
                        </div>
                            
                        */}

                            {Boolean(isRazorPayPayoutActive) &&
                              Boolean(type == "upi") && (
                                <div
                                  className="add-fund-box my-3"
                                  style={{ paddingTop: "0px", height: "60px" }}
                                >
                                  <div
                                    className="d-flex align-items-center"
                                    style={{
                                      backgroundColor: "#fafafa",
                                      border: "1px solid grey",
                                      borderRadius: "7px",
                                    }}
                                  >
                                    <div
                                      className="d-flex align-items-center"
                                      style={{
                                        height: "60px",
                                        display: "flex",
                                        textAlign: "center",
                                      }}
                                    >
                                      <img
                                        width="45px"
                                        src={
                                          process.env.PUBLIC_URL + "/UPI.png"
                                        }
                                        alt=""
                                        style={{
                                          marginLeft: "7px",
                                          paddingBottom: "10px",
                                          paddingLeft: "3px",
                                          paddingTop: "5px",
                                        }}
                                      />
                                    </div>
                                    <div className="d-flex justify-content-center flex-column ml-4">
                                      <div className="text-left">
                                        <strong>Withdraw through UPI</strong>
                                        <br />
                                        <small className="text-warning">
                                          Minimum withdrawal amount ₹95
                                        </small>
                                        <br />
                                        <small className="text-danger">
                                          Instant withdrawal within 30sec.
                                        </small>
                                      </div>
                                      <div className="jss31"></div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setNext(false);
                                      }}
                                      className="btn btn-info text-white font-weight-bold  ml-auto mr-3"
                                      style={{ fontSize: "0.5rem" }}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              )}

                            {/* ================================= START :  Bank Transfer First Page ================================= */}

                            {
                              Boolean(isDecentroPayoutActive) &&
                              Boolean(type == "banktransfer") && (
                                <div
                                  className="transfer_btn_container"
                                  style={{ paddingTop: "0px" }}
                                >
                                  <button
                                    className="transfer_back_btn"
                                    onClick={() => {
                                      setType(undefined);
                                      setNext(false);
                                      console.log(type);
                                    }}
                                  >
                                    Back
                                  </button>
                                </div>
                              )
                              // </div>
                            }

                            {
                              Boolean(isMypayPayoutBankActive) &&
                              Boolean(type == "mypaybank") && (
                                <div
                                  className="transfer_btn_container"
                                  style={{ paddingTop: "0px" }}
                                >
                                  <button
                                    className="transfer_back_btn"
                                    onClick={() => {
                                      setType(undefined);
                                      setNext(false);
                                      console.log(type);
                                    }}
                                  >
                                    Back
                                  </button>
                                </div>
                              )
                              // </div>
                            }
                            {
                              (Boolean(isMypayzonePayoutBankActive) || Boolean(isMypayzone2PayoutBankActive)) &&
                              Boolean(type == "mypayzone") && (
                                <div
                                  className="transfer_btn_container"
                                  style={{ paddingTop: "0px" }}
                                >
                                  <button
                                    className="transfer_back_btn"
                                    onClick={() => {
                                      setType(undefined);
                                      setNext(false);
                                      console.log(type);
                                    }}
                                  >
                                    Back
                                  </button>
                                </div>
                              )
                              // </div>
                            }

                            <div className="account_details">
                              {Boolean(isMypayPayoutBankActive) &&
                                type == "mypaybank" && (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i class="fa-solid fa-user"></i>
                                        Account Holder Name
                                      </label>
                                      <center>
                                        <div className="field col-12 p-0 mt-1 mb-3">
                                          <input
                                            type="text"
                                            className="bank_account_form"
                                            id="account_no"
                                            placeholder="Enter Account Name"
                                            name="ifsc"
                                            value={holder_name}
                                            onChange={(e) =>
                                              setHolder_name(e.target.value)
                                            }
                                            required
                                          />
                                        </div>
                                      </center>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i class="fa-solid fa-money-check"></i>
                                        Account number
                                      </label>
                                      <center>
                                        <div className="field col-12 p-0 mt-1 mb-3">
                                          <input
                                            type="text"
                                            className="bank_account_form"
                                            id="account_no"
                                            placeholder="Bank Account Number"
                                            name="upi"
                                            value={account_number}
                                            onChange={(e) =>
                                              setAccount_number(e.target.value)
                                            }
                                          />
                                        </div>
                                      </center>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>IFSC
                                        code
                                      </label>
                                      <center>
                                        <div className="field col-12 p-0 mt-1 mb-3">
                                          <input
                                            type="text"
                                            className="bank_account_form"
                                            id="account_no"
                                            placeholder="Enter IFSC code"
                                            name="ifsc"
                                            value={ifsc_code}
                                            onChange={(e) =>
                                              setIfsc_code(e.target.value)
                                            }
                                          />
                                        </div>
                                      </center>
                                    </div>
                                  </div>
                                )}
                              {(Boolean(isMypayzonePayoutBankActive) || Boolean(isMypayzone2PayoutBankActive)) &&
                                type == "mypayzone" && (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i class="fa-solid fa-user"></i>
                                        Account Holder Name
                                      </label>
                                      <center>
                                        <div className="field col-12 p-0 mt-1 mb-3">
                                          <input
                                            type="text"
                                            className="bank_account_form"
                                            id="account_no"
                                            placeholder="Enter Account Name"
                                            name="ifsc"
                                            value={holder_name}
                                            onChange={(e) =>
                                              setHolder_name(e.target.value)
                                            }
                                            required
                                          />
                                        </div>
                                      </center>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i class="fa-solid fa-money-check"></i>
                                        Account number
                                      </label>
                                      <center>
                                        <div className="field col-12 p-0 mt-1 mb-3">
                                          <input
                                            type="text"
                                            className="bank_account_form"
                                            id="account_no"
                                            placeholder="Bank Account Number"
                                            name="upi"
                                            value={account_number}
                                            onChange={(e) =>
                                              setAccount_number(e.target.value)
                                            }
                                          />
                                        </div>
                                      </center>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>IFSC
                                        code
                                      </label>
                                      <center>
                                        <div className="field col-12 p-0 mt-1 mb-3">
                                          <input
                                            type="text"
                                            className="bank_account_form"
                                            id="account_no"
                                            placeholder="Enter IFSC code"
                                            name="ifsc"
                                            value={ifsc_code}
                                            onChange={(e) =>
                                              setIfsc_code(e.target.value)
                                            }
                                          />
                                        </div>
                                      </center>
                                    </div>
                                  </div>
                                )}

                              {Boolean(isDecentroPayoutActive) &&
                                type == "banktransfer" && (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i class="fa-solid fa-user"></i>
                                        Account Holder Name
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Enter Account Name"
                                          name="ifsc"
                                          value={holder_name}
                                          onChange={(e) =>
                                            setHolder_name(e.target.value)
                                          }
                                          required
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i class="fa-solid fa-money-check"></i>
                                        Account number
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Bank Account Number"
                                          name="upi"
                                          value={account_number}
                                          onChange={(e) =>
                                            setAccount_number(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>IFSC
                                        code
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Enter IFSC code"
                                          name="ifsc"
                                          value={ifsc_code}
                                          onChange={(e) =>
                                            setIfsc_code(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                              {Boolean(isMypayPayoutActive) &&
                                type == "mypayupi" && (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>
                                        Account holder name
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Enter Account Name"
                                          name="ifsc"
                                          value={holder_name}
                                          onChange={(e) =>
                                            setHolder_name(e.target.value)
                                          }
                                          required
                                        />
                                      </div>
                                    </div>

                                    <label
                                      htmlFor="username "
                                      className="bank_account_title text-dark"
                                    >
                                      <i className="far fa-bank mr-2"></i>UPI ID
                                    </label>
                                    <div className="col-12  p-0">
                                      <input
                                        type="text"
                                        className="bank_account_form"
                                        id="account_no"
                                        placeholder="Enter UPI ID (9999999999@xyz)"
                                        name="ifsc"
                                        value={upi_id}
                                        onChange={(e) =>
                                          setUpi_id(e.target.value)
                                        }
                                      />
                                    </div>

                                    <small className="text-danger">
                                      कृपया सही UPI आईडी (9999999999@xyz) दर्ज
                                      करें।*
                                    </small>
                                  </div>
                                )}

                              {Boolean(isManualPayoutActive) &&
                                type == "manualupi" && (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>
                                        Account holder name
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Enter Account Name"
                                          name="ifsc"
                                          value={holder_name}
                                          onChange={(e) =>
                                            setHolder_name(e.target.value)
                                          }
                                          required
                                        />
                                      </div>
                                    </div>

                                    <label
                                      htmlFor="username "
                                      className="bank_account_title text-dark"
                                    >
                                      <i className="far fa-bank mr-2"></i>UPI ID
                                    </label>
                                    <div className="col-12  p-0">
                                      <input
                                        type="text"
                                        className="bank_account_form"
                                        id="account_no"
                                        placeholder="Enter UPI ID (9999999999@xyz)"
                                        name="ifsc"
                                        value={upi_id}
                                        onChange={(e) =>
                                          setUpi_id(e.target.value)
                                        }
                                      />
                                    </div>

                                    <small className="text-danger">
                                      कृपया सही UPI आईडी (9999999999@xyz) दर्ज
                                      करें।*
                                    </small>
                                  </div>
                                )}

                              {Boolean(isManualBankPayoutActive) &&
                                type == "manualbanktransfer" && (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>
                                        Account holder name
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Enter Account Name"
                                          name="ifsc"
                                          value={holder_name}
                                          onChange={(e) =>
                                            setHolder_name(e.target.value)
                                          }
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>
                                        Account number
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Bank Account Number"
                                          name="upi"
                                          value={account_number}
                                          onChange={(e) =>
                                            setAccount_number(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>IFSC
                                        code
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Enter IFSC code"
                                          name="ifsc"
                                          value={ifsc_code}
                                          onChange={(e) =>
                                            setIfsc_code(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                              {Boolean(isRazorPayPayoutActive) &&
                                type == "upi" && (
                                  <div>
                                    <div>
                                      <label
                                        htmlFor="username "
                                        className="bank_account_title text-dark"
                                      >
                                        <i className="far fa-bank mr-2"></i>
                                        Account holder name
                                      </label>
                                      <div className="field col-12 p-0 mt-1 mb-3">
                                        <input
                                          type="text"
                                          className="bank_account_form"
                                          id="account_no"
                                          placeholder="Enter Account Name1"
                                          name="ifsc"
                                          value={holder_name}
                                          onChange={(e) =>
                                            setHolder_name(e.target.value)
                                          }
                                          required
                                        />
                                      </div>
                                    </div>

                                    <label
                                      htmlFor="username "
                                      className="bank_account_title text-dark"
                                    >
                                      <i className="far fa-bank mr-2"></i>UPI ID
                                    </label>
                                    <div className="col-12  p-0">
                                      <input
                                        type="text"
                                        className="bank_account_form"
                                        id="account_no"
                                        placeholder="Enter UPI ID (9999999999@xyz)"
                                        name="ifsc"
                                        value={upi_id}
                                        onChange={(e) =>
                                          setUpi_id(e.target.value)
                                        }
                                      />
                                    </div>

                                    <small className="text-danger">
                                      कृपया सही UPI आईडी (9999999999@xyz) दर्ज
                                      करें।*
                                    </small>
                                  </div>
                                )}
                              {/* <button type="submit" className="btn w-50 d-block m-auto text-white btn-primary">Submit</button> */}
                            </div>
                            {/* ================================= Bank Transfer First Page ================================= */}
                          </div>

                          <div style={{ textAlign: "left" }}>
                            <label
                              htmlFor="username "
                              className="bank_account_title text-dark"
                            >
                              <i className="far fa-money mr-2"></i>Amount
                            </label>
                          </div>
                          <div className="field col-12 p-0 mt-1 mb-3">
                            <input
                              type="tel"
                              className="bank_account_form"
                              name="amount"
                              placeholder="Amount"
                              onChange={(e) => setAmount(e.target.value)}
                            />
                          </div>
                          <div className="col-12 withdrawal_btn_container">
                            <button
                              type="button"
                              className="withdrawl_btn"
                              disabled={Boolean(submitBtn) ? false : true}
                              onClick={() => updateBankDetails()}
                            >
                              {
                                submitBtn ? "Withdraw" :
                                  <>
                                    <div class="spinner-border" role="status">
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  </>
                              }
                            </button>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {user && user?.verified === "unverified" && (
                  <div
                    className="mt-5 text-center"
                    style={{
                      height: "100px",
                      border: "1px solid red",
                      background: "var(--bg-back)",
                    }}
                  >
                    <Link to="/kyc2">
                      <picture className="ml-3">
                        <img
                          src="/images/alert.svg"
                          alt=""
                          width="32px"
                          className="mt-4"
                        />
                      </picture>

                      <div className="mytext text-muted">
                        Complete KYC to take Withdrawls
                      </div>
                    </Link>
                  </div>
                )}

                {user && user.verified === "pending" && (
                  <div style={{ height: "100px" }} className="mt-5 text-center">
                    <picture className="ml-3">
                      <img
                        src="/images/alert.svg"
                        alt=""
                        width="32px"
                        className="mt-4"
                      />
                    </picture>
                    <div className="mytext text-muted ">
                      Please wait your kyc under process
                    </div>
                  </div>
                )}

                {WebSitesettings.withdrawMsg && (
                  <div
                    className="kyc_banner"
                    style={{
                      background:
                        "linear-gradient(90deg, #420808, #a40909 47%, #8c0a0a) !important",
                    }}
                  >
                    ◉ {WebSitesettings.withdrawMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Withdrawopt;
