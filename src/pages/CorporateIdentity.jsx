import React from "react";
import logo from "/img/fairystudy-logo noBgColor.png"; // Import the logo image
import font from "/img/font2.png"; // Import the font image
import logos from "/img/font.png"; // Import the logos image
function CorporateIdentity() {
  return (
      <div className="page">
        <h1>Corporate Identity</h1>

        <h2 className="mt-4">Color Palette:</h2>

        <div className="color-palette">
          <div className="color-box" style={{backgroundColor: "#21b4c7"}}>
            #21b4c7
          </div>
          <div className="color-box" style={{backgroundColor: "#21c753"}}>
            #21c753
          </div>
          <div className="color-box" style={{backgroundColor: "#21bbc7"}}>
            #21bbc7
          </div>
          <div className="color-box" style={{backgroundColor: "cadetblue"}}>
            cadetblue
          </div>

          <div className="color-box" style={{backgroundColor: "#00847f"}}>
            Light Petrol green
          </div>


          <div className="color-box" style={{backgroundColor: "#086972"}}>
            Petrol green
          </div>
          <div className="color-box" style={{backgroundColor: "#0b3b39"}}>
            Dark Petrol green
          </div>
          <div className="color-box" style={{backgroundColor: "#f8f9fa", border: "2px solid #ccc"}}>
            Weiß
          </div>
          <div className="color-box" style={{backgroundColor: "#fff", border: "2px solid #ccc"}}>
            Klarweiß
          </div>

          <h2 className="mt-5">Alternative Farben</h2>

          <div className="row fullrow">
            <div className="col-md-6">
              <h1>cold nights Color Palette</h1>
              <div className="palettecontainer">
                <div className="palettecolordivc" title="#00b7cb" style={{backgroundColor: "#00b7cb"}}>
                </div>
                <div className="palettecolordivc" title="#007987" style={{backgroundColor: "#007987"}}>
                </div>
                <div className="palettecolordivc" title="#00555f" style={{backgroundColor: "#00555f"}}>
                </div>
                <div className="palettecolordivc" title="#00383f" style={{backgroundColor: "#00383f"}}>
                </div>
                <div className="palettecolordivc" title="#001417" style={{backgroundColor: "#001417"}}>
                </div>
                <div className="clearfix"></div>
              </div>


              <div className="col-md-6">
                <h2>Colors in Palette</h2>
                <table className="table">
                  <tbody>
                  <tr>
                    <th>Color</th>
                    <th>Hex</th>
                    <th>RGB</th>
                  </tr>
                  <tr>
                    <td style={{backgroundColor: "#00b7cb"}}></td>
                    <td><a href="/color/00b7cb" title="#00b7cb color">#00b7cb</a></td>
                    <td>(0,183,203)</td>
                  </tr>
                  <tr>
                    <td style={{backgroundColor: "#007987"}}></td>
                    <td><a href="/color/007987" title="#007987 color">#007987</a></td>
                    <td>(0,121,135)</td>
                  </tr>
                  <tr>
                    <td style={{backgroundColor: "#00555f"}}></td>
                    <td><a href="/color/00555f" title="#00555f color">#00555f</a></td>
                    <td>(0,85,95)</td>
                  </tr>
                  <tr>
                    <td style={{backgroundColor: "#00383f"}}></td>
                    <td><a href="/color/00383f" title="#00383f color">#00383f</a></td>
                    <td>(0,56,63)</td>
                  </tr>
                  <tr>
                    <td style={{backgroundColor: "#001417"}}></td>
                    <td><a href="/color/001417" title="#001417 color">#001417</a></td>
                    <td>(0,20,23)</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


        <h2 className="mt-5">Typography:</h2>

        <div className="typography">
          <h3 className="font-header">Header Font: Margon, Adonis, Scientia</h3>
          <p className="font-body">Body Font: Roboto</p>
          Vorschau:
          <img src={font} alt="Font Preview" className="font-image"/>


        </div>
        <h2>Logos:</h2>

        <img src={logo} alt="Logo" className="logo-image" width="700"/>
        <br/>


        <img src={logos} alt="Logo" className="logo-image"/>

      </div>
  );
}

export default CorporateIdentity;
