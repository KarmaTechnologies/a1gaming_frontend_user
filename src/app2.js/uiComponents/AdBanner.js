import React, { useEffect, useState } from 'react'
import { Interweave } from "interweave";
import "../css/AdBanner.css";
import axios from "axios";

function AdBanner({WebSitesettings}) {
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    if (nodeMode === "development") {
      var baseUrl = beckendLocalApiUrl;
    } else {
      baseUrl = beckendLiveApiUrl;
    }

    const [data, setData] = useState()
    const getdata = () => {

        axios.get(baseUrl+`api/term/condition/About-Us`)
            .then((res) => {

                setData(res.data[0].Desc);
                // console.log(res.data[0].Type);
            })
    }

    useEffect(() => {
        getdata()
    }, [])


    return (
      <div className="collapseCard-container pt-2">
      <div id="carouselExampleControls" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
        
     
       {WebSitesettings?.mainBannerAlert&&     <p className='p-2'>{WebSitesettings?.mainBannerAlert}</p>}
{/*
<a href="https://www.instagram.com/a1gamingofficial_/" target="_blank">
         <img src="/ads/instagram.webp" height="80" className="d-block w-100" alt="..." /> 
          </a>-->
    */}
        </div>
        
          {/***
        <div className="carousel-item">
        <a href="/refer">
          <img src="/ads/refer-a-friend-bnr.webp" height="80" className="d-block w-100" alt="..." />
          </a>
        </div>
        
        <div className="carousel-item">
        <a href="http://google.com" target="_blank">
          <img src="/ads/ads-bnr-3.png" height="80" className="d-block w-100" alt="..." />
          </a>
        </div>
       */}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden"></span>
      </button>
    </div>
    </div>
    )
}

export default AdBanner