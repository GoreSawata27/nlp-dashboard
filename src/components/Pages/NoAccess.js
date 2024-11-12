import React from "react";
import { Link } from "react-router-dom";

export default function NoAccess() {
  return (
    <div className="cntnt-wraper">
      <div className="triec-form txt-cntr full-height flex-center" style={{ maxWidth: "45rem" }}>
        <h1>You don't have permission to access this page</h1>

        <Link to="/" className="back-btn-white">
          Go to Registration Page
        </Link>
      </div>
    </div>
  );
}
