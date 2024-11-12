import React from "react";
import LoginLogo from "../../assets/img/triec-logo.svg";
const Header = () => {
  return (
    <header>
      <div className="cntnt-wraper ">
        <div className="dflx flx-algn-cntr flx-jstfy-btween">
          <div className="header-logo">
            <img width="105" height="81" src={LoginLogo} alt="LoginLogo" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
