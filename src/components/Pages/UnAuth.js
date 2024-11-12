import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function UnAuth() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return (
    <div className="cntnt-wraper">
      <div className="triec-form txt-cntr full-height flex-center" style={{ maxWidth: "43rem" }}>
        <h1>Your session has expired. Please login again.</h1>

        <Link to="/" className="back-btn-white">
          Go to Registration Page
        </Link>
      </div>
    </div>
  );
}
