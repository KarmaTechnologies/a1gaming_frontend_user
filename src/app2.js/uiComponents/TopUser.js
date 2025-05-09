import React, { useEffect, useState } from 'react';
import  '../css/dashboard.css';
import Rightcontainer from '../Components/Rightcontainer'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios';
import Swal from "sweetalert2";

const TopUser = () => {
     const history = useHistory()
     const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
     const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
     const nodeMode = process.env.NODE_ENV;
     if (nodeMode === "development") {
       var baseUrl = beckendLocalApiUrl;
     } else {
       baseUrl = beckendLiveApiUrl;
     }
    let access_token = localStorage.getItem("token");
     access_token = localStorage.getItem("token")
    const [user, setUser] = useState([])
   
    useEffect(() => {
         let access_token = localStorage.getItem('token');
        access_token = localStorage.getItem('token');
        if(!access_token)
        {
            window.location.reload()
            history.push("/login");
        }
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseUrl+`top-users`, { headers })
            .then((res) => {
               
                setUser(res?.data?.data)
            }).catch((e) => {
                console.log(e)
                
            })
    }, [])


    return (
        <>
        <div  class="leftContainer">
         <div class="tournament-leaderboard mt-5 pt-4" >
         <h4 class="text-center">Leaderboard</h4>
    <table class="table">
        <thead>
            <tr class="">
                <th class="leaderboard-item-image"></th>
                <th class="leaderboard-item-id">Rank</th>
                <th class="leaderboard-item-name">Name</th>
                <th class="leaderboard-item-score">Amount</th>
            </tr>
        </thead>
        <tbody>
        {user && user.map((data,index)=>{
            return(
            <>
             <tr class="leaderboard-item">
                <td class="leaderboard-item-image">{data?.avatar ?<img src={baseUrl + data?.avatar} alt="" />:<img  src={process.env.PUBLIC_URL +`/user.png`} alt=""  />}</td>
                <td class="leaderboard-item-id">{index+1}</td>
                <td class="leaderboard-item-name">{data?.name}</td>
                <td class="leaderboard-item-score"> {new Intl.NumberFormat('en-IN').format(data?.totalGameAmount || 0)}</td>
            </tr>
           
            </>)
        })}
           
           
        </tbody>
    </table>
    
</div>
</div>

          </>
      )
}
export default TopUser;