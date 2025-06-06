import * as React from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaHome } from "react-icons/fa";

const Sidenavbar = () => {
  const [sidenavopen, setSidenavopen] = React.useState(true);
  const currentUrl = window.location.href;
  const match = currentUrl.match(/sites\/([^/]+)/);
  const siteName = match ? match[1] : "IITIQ"; // fallback to iitiq

  const baseUrl = `https://smalsusinfolabs.sharepoint.com/sites/${siteName}/SitePages`;
  return (
    <>
      {sidenavopen ? (
        <div
          className="sidebar"
          style={{
            backgroundColor: "#103e3e",
            fontSize: "18px",
            width: "170px",
            // marginLeft: "-12px",
            // marginTop: "-56px",
            marginBottom: "10px",
            height: "100%",
          }}
        >
          <IoIosCloseCircle
            className="mt-2"
            onClick={() => setSidenavopen(false)}
            style={{
              color: "white",
              fontSize: "30px",
              marginLeft: "75%",
              cursor: "pointer",
              zIndex: "1",
            }}
          />

          <a
            href={`${baseUrl}/Admin-Dashboard.aspx`}
            target="_blank"
            data-interception="off"
          >
            Home <FaHome style={{ marginTop: "-5px" }} />
          </a>

          <a href={`${baseUrl}/Students-Referral.aspx`}>Referral</a>

          <a
            href={`${baseUrl}/Staff-Members.aspx`}
            target="_blank"
            data-interception="off"
          >
            Staff Dashboard
          </a>

          <a
            href={`${baseUrl}/MyDashboard.aspx`}
            target="_blank"
            data-interception="off"
          >
            My Dashboard
          </a>
          {/* <a
            href="https://smalsusinfolabs.sharepoint.com/sites/IITIQ/SitePages/Admin-Dashboard.aspx"
            target="_blank"
            data-interception="off"
          >
            Home <FaHome style={{ marginTop: "-5px" }} />
          </a>
          <a href="https://smalsusinfolabs.sharepoint.com/sites/IITIQ/SitePages/Students-Referral.aspx">
            Referal
          </a>
          <a
            href="https://smalsusinfolabs.sharepoint.com/sites/IITIQ/SitePages/Staff-Members.aspx"
            target="_blank"
            data-interception="off"
          >
            Staff Dashboard
          </a>
          <a
            href="https://smalsusinfolabs.sharepoint.com/sites/IITIQ/SitePages/MyDashboard.aspx"
            target="_blank"
            data-interception="off"
          >
            My Dashboard
          </a> */}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#103e3e",
            fontSize: "30px",
            textAlign: "center",
            width: "50px",
            // height: "15%",
            // marginLeft: "-12px",
            // marginTop: "-56px",
            marginBottom: "10px",
            // zIndex: "1",
          }}
        >
          <GiHamburgerMenu
            onClick={() => setSidenavopen(true)}
            style={{ color: "white", cursor: "pointer" }}
          />
        </div>
      )}
    </>
  );
};

export default Sidenavbar;
