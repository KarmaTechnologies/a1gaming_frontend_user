import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';



const App3 = () => {

 
    return (


      <>
        <title>Server Maintenance</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css?family=Teko" rel="stylesheet" />
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html:
              "\n      body{\n      font-family: 'Teko', sans-serif;\n      background-color: #f2f2f2;\n      margin: 0px;\n      }\n      section{\n\n      text-align: center;\n      height: 100vh;\n      width: 100%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      flex-direction: column;\n\n      }\n      h2,p{\n      color: #3867d6;\n      margin: 0px;\n      }\n      h2{\n      font-size: 62px;\n      padding-top: 20px;\n      }\n      p{\n      font-size: 40px;\n      padding-bottom: 20px;\n      }\n      img{\n      max-width: 100%;\n      }\n      a{\n      background: #3867d6;\n      border-radius:4px;\n      outline: none;\n      border: 0px;\n      color: #fff;\n      font-size: 34px;\n      cursor: pointer;\n      text-decoration: none;\n      padding: 5px 25px;\n      }\n      a:hover{\n      background-color: #1d56de;\n      }\n      @media(max-width: 625px){\n      h2{\n      font-size: 50px;\n      }\n      p{\n      font-size: 30px;\n    \n      }\n      }\n      @media(max-width: 492px){\n      h2{\n      font-size: 30px;\n      }\n      a{\n      \tfont-size: 25px;\n      }\n      p{\n      font-size: 25px;\n        line-height: 26px;\n      }\n      }\n    "
          }}
        />
        <section>
          <img src={process.env.PUBLIC_URL + "/Maintenance.jpg"} />
          <h2>Under Maintenance</h2>
          <p className="alert alert-danger mt-5 pt-5" role="alert">
        <strong>
   माफी चाहते है आपको जो इतनी अधिक परेशानी हुई उसके लिए तकनीकी समस्या के कारण वेबसाइट पर काम चल रहा है कोशिश करेंगे दुबारा भविष्य मैं आपको इस प्रकार की समस्या ना आए ।
👉🏻जल्द से जल्द लाइव होंगे ।
👉🏻🅰️1 परिवार कभी भी     आपके साथ फ्रॉड नहीं करेगा ।
👉🏻अगर ज्यादा समय लगेगा तो आपका विथड्रावल कर दिया जाएगा ।
👉🏻दिल से शुक्रिया जो आज तक आपने हमे इतना ज्यादा सहयोग दिया 🙏🏻

धन्यवाद🙏🏻
🅰️1Gamingर  गाई है I  </strong>
      </p>
        </section>W





      </>
    )

  
}
export default App3;
