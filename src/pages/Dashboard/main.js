import React, { useState } from "react";
import SurveyReport from "./SurveyReports/SurveyReport";
import Reviews from "./PerformanceMonitoring/Reviews";

export default function Dashboard() {
  const [active, setActive] = useState(true);

  const HandelSurveyReports = () => {
    setActive(true);
  };

  const HandelPerformanceMonitoring = () => {
    setActive(false);
  };

  return (
    <div>
      <div className="header">
        <div className={`title ${active && "active"}`} onClick={HandelSurveyReports}>
          Survey Reports
        </div>
        <span className="dashboard-space"></span>
        <div className={`title ${!active && "active"}`} onClick={HandelPerformanceMonitoring}>
          Performance Monitoring
        </div>
      </div>
      {!active && <Reviews />}
      {active && <SurveyReport />}
    </div>
  );
}
