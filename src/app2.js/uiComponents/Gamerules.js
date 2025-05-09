import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Rightcontainer from "../Components/Rightcontainer";
const Gamerules = () => {
  return (
    <div>
        <div className="leftContainer" style={{minHeight:'100vh',height:'100%'}}>
            
      <div className="m-3 py-5 pt-3 px-3">
        <h1><strong>Ludo Rules</strong></h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              Home
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Ludo Rules
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-12">
            <h4><strong>Game Rules:</strong></h4>
            <ol className="rules-list">
            ✅ नोट✅

<br/>
<br/>
✅अगर कोई गलत रिजल्ट डालता है  या किसी भी प्रकार का froud करता है तो 🆔 को 0 कर दिया जाएगा और ब्लॉक भी की जा सकती 
है।
<br/>
              <li><b>Game Exit करने पर :</b> <br/>
             ✓ यदि एक टोकन बाहर है तो 30% Loss दिया जायेगा लेकिन यदि गेम खेला गया है और 2 काटी बहार आयी हो तो गेम को लेफ्ट करने वाले को 100% Loss कर दिया जायेगा !

 ✓ यदि आप  Game Exit   करते है तो आपको 100% Loss कर दिया जायेगा चाहे आपका Auto Exit हो या जान बुझकर Exit किया हो !
यदि दोनों प्लेयर में किसी की काटी खुली नहीं तो उसे हम कैंसिल कर सकते है !
              </li>
            <br/>
              <li><b>रिजल्ट पोस्ट करने का समय :</b> <br/>
             ✓ Game समाप्त होने के 15 मिनट के अंदर रिजल्ट डालना आवश्यक है। अन्यथा, सामने वाले प्लेयर के रिजल्ट के आधार पर गेम अपडेट कर दिया जाएगा चाहे आप जीते या हारे । इसके बाद में कोई बदलाव नहीं किया जाएगा। सकते है !
              </li>
              
              <br/>
              <li><b>गलत स्क्रीनशॉट पोस्ट रना::</b> <br/>
         ✓ Win होने के बाद आप गलत  स्क्रीनशॉट डालते है तो गेम को सीधा Cancel कर दिया जायेगा !
 इसलिए यदि आप स्क्रीनशॉट लेना भूल गए है तो पहले Live Chat में एडमिन को संपर्क करे उसके बाद ही उनके बताये अनुसार रिजल्ट पोस्ट करे !
इसके बाद में कोई बदलाव नहीं किया जाएगा ।ते है !
              </li>
              
              
              <br/>
              <li><b>गेम कैंसिल ✖️ करने की स्थिति :</b> <br/>
           
✓ दोनों प्लेयर की टोकन (काटी) घर से बाहर न आयी हो तो लेफ्ट होकर गेम कैंसिल ✖️किया जा सकता है ! [कैंसिल प्रूफ करने के लिए वीडियो आवश्यक होगा]

✓ 'कैंसिल' रिजल्ट डालने के बाद गेम प्ले करके जीत जाते है तो उसमे हमारी कोई ज़िम्मेदारी नहीं होगी अतः गेम कैंसिल करने के बाद स्टार्ट न करे अन्यथा वो कैंसिल ✖️ ही माना जायेगा !कते है !
              </li>
              
              
              <br/>
              <li><b>रिजल्टरिजल्ट पोस्ट करने के बाद बदलाव नहीं:
</b> <br/>
            ✓एक बार रिजल्ट डालने के बाद बदला नहीं जा सकता है इसलिए सोच समझकर रिजल्ट पोस्ट करे

✓ गलत रिजल्ट डालने पर पेनल्टी भी लगायी जाएगी चाहे आपने वो गलती से डाला हो या जान भुजकर।ते है !
              </li>
              
              
              <br/>
              <li><b>नेटवर्क समस्या :</b> <br/>
            ✓ अपने नेटवर्क की समस्या चेक करके खेलना चाहिए, यह  स्वयं की जिम्मेदारी होगी।कते है !
              </li>
              
             
            </ol>
            <h4><strong>Commission Rates:</strong></h4>
            <table className="table table-bordered">
              <tr className="bg-gray">
                <th>बेट कॉइन</th>
                <th>कमीशन चार्ज</th>
              </tr>
              <tr>
                <th>50 से 250 तक </th>
                <th>10%</th>
              </tr>
              <tr>
                <th>251 से 500 तक </th>
                <th>25 रुपए (फिक्स)</th>
              </tr>
              <tr>
                <th>500 से ज्यादा</th>
                <th>6%</th>
              </tr>
            </table>
           
          </div>
        </div>
      </div>
      </div>
      <div className="rightContainer">
          <Rightcontainer/>
      </div>
    </div>
  );
};
export default Gamerules;