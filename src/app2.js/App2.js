import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Homepage from './uiComponents/Homepage';

import Landing from './uiComponents/Landing';
import userLogin from './uiComponents/Login';
import Mywallet from './uiComponents/Mywallet';
import Addcase from './uiComponents/Addcase';
import TopUser from './uiComponents/TopUser';
import Withdrawopt from './uiComponents/Withdrawopt';
import Profile1 from './uiComponents/Profile1';
import ViewGame1 from './uiComponents/ViewGame1';
import Gamehistory from './uiComponents/Gamehistory'
import 'animate.css';
import axios from 'axios';

import Transactionhistory from './uiComponents/Transactionhistory';
import Referralhis from './uiComponents/Referralhis';
import Refer from './uiComponents/Refer';
import Notification from './uiComponents/Notification';
import Support from './uiComponents/Support';

// import Games from './uiComponents/Games';
// import Kyc from './uiComponents/Kyc';
import Kyc2 from './uiComponents/Kyc2';
// import kyc3 from './uiComponents/kyc3';
import RefundPolicy from './uiComponents/RefundPolicy';
import terms_condition from './uiComponents/terms_condition';
import PrivacyPolicy from './uiComponents/PrivacyPolicy';
import Gamerules from './uiComponents/Gamerules';
import ResponsibleGaming from './uiComponents/ResponsibleGaming';
import Return from './uiComponents/Return';
import Notify from './uiComponents/Notify';
import Header from './Components/Header';
import Rightcontainer from "./Components/Rightcontainer";
// import Downloadbutton from "./Components/Downloadbutton";
import Redeem from "./uiComponents/Redeem"
import Chat from './uiComponents/Chat/Chat';

import AboutUs from './uiComponents/AboutUs';
import { Toaster } from "react-hot-toast";
const App2 = () => {
        //const [mount, setMount] = useState(true)
        //const history = useHistory()
        const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
        const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
        const nodeMode = process.env.NODE_ENV;
        if (nodeMode === "development") {
                var baseUrl = beckendLocalApiUrl;
        } else {
                baseUrl = beckendLiveApiUrl;
        }

        const access_token = localStorage.getItem("token")
        const [user, setUser] = useState()
        const getUser = () => {
                const headers = {
                        Authorization: `Bearer ${access_token}`
                }
                axios.get(baseUrl + `me`, { headers })
                        .then((res) => {
                                setUser(res.data)
                        }).catch((e) => {
                                if (e.response.status === 401) {
                                        localStorage.removeItem('token');
                                        // history.pushState("/login")
                                }
                        })
        }
        useEffect(() => {
                getUser()
                // eslint-disable-next-line 
        }, [])
        return (
                <>
                        <div className="leftContainer">
                                <div><Header user={user} /></div>
                        </div>

                        {!access_token ? <Switch>

                                <Route exact path="/" component={Landing} />
                                <Route path="/landing" component={Landing} />
                                <Route path="/login" component={userLogin} />
                                <Route path="/RefundPolicy" component={RefundPolicy} />
                                <Route path="/PrivacyPolicy" component={PrivacyPolicy} />
                                <Route path="/term-condition" component={terms_condition} />
                                <Route path="/about" component={AboutUs} />
                                <Route path="/refund-policy" component={RefundPolicy} />
                                <Route path="/contact-us" component={Support} />
                                <Route path="/Gamerules" component={Gamerules} />
                                <Route path="/responsible-gaming" component={ResponsibleGaming} />
                                <Redirect to="/login" />

                        </Switch > :
                                <Switch>
                                        <Route path="/transaction-history" component={Transactionhistory} />
                                        {/* <Route exact path="/transaction" component={Transactionhistory} /> */}
                                        <Route exact path="/Referral-history" component={Referralhis} />
                                        <Route exact path="/landing" component={Landing} />
                                        <Route exact path="/Gamehistory" component={Gamehistory} />
                                        {/* <Route exact path="/profile" component={Profile} /> */}
                                        <Route exact path="/HomePage/:Game" render={() => <Homepage walletUpdate={getUser} />} />
                                        <Route exact path="/refer" component={Refer} />
                                        <Route exact path="/Notification" component={Notification} />
                                        <Route exact path="/" component={Landing} />
                                        <Route path="/profile" component={Profile1} />
                                         <Route path="/dashboard" component={TopUser} />
                                        <Route path="/viewgame1/:id" component={ViewGame1} />
                                        <Route path="/addcase" render={() => <Addcase walletUpdate={getUser} />} />

                                        <Route path="/Withdrawopt" render={() => <Withdrawopt walletUpdate={getUser} />} />
                                        <Route path="/wallet" component={Mywallet} />
                                     <Route path="/support" render={() => <Support user={user} />} />

                                        {/* <Route path="/Games" component={Games} /> */}
                                        <Route exact path="/landing/:id" component={Landing} />
                                        <Route path="/kyc2" render={() => <Kyc2 user={user} />} />
                                        <Route path="/Rules" component={Gamerules} />
                                        <Route path="/RefundPolicy" component={RefundPolicy} />
                                        <Route path="/PrivacyPolicy" component={PrivacyPolicy} />
                                        <Route path="/term-condition" component={terms_condition} />
                                        {/* <Route path="/timer" component={Timer}/> */}
                                        <Route path="/return" render={() => <Return walletUpdate={getUser} />} />
                                        <Route path="/notify" component={Notify} />

                                        <Route path="/Redeem" render={() => <Redeem walletUpdate={getUser} />} />
                                        <Route path="/contact-us" component={Support} />
                                        <Route path="/refund-policy" component={RefundPolicy} />
                                        <Route path="/Gamerules" component={Gamerules} />
                                        <Route path="/responsible-gaming" component={ResponsibleGaming} />
                                        <Route path="/about" component={AboutUs} />
     <Route path="/chat" render={() => <Chat user={user} />} />
                                        <Redirect to="/landing" />
                                </Switch>


                        }
                        <div className="rightContainer">
                                <Rightcontainer />
                        </div>
      <Toaster position="top-center" toastOptions={{duration: 2000}} />

                        {/* <h2>Install Demo</h2> */}
                </>
        )
}
export default App2;