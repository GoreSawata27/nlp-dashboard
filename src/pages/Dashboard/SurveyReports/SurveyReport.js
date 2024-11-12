import React, { useState, useEffect } from "react";
import _api from "../../../utils/apis/_api";
import Table from "./Table";
import SurveyChart from "./SurveyChart";
import Date from "./Date";

export default function SurveyReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSurveyReports = async () => {
    setLoading(true);
    try {
      const res = await _api.get("/triec-survey/admin/1/feedback/categories");
      setData(res.data.data.attribites);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const UpdateReports = async () => {
    setLoading(true);
    try {
      await _api.post("/triec-survey/admin/1/process-survey-responses");
      getSurveyReports();
    } catch (error) {
      console.log(error);
    }
  };
  const GetReviews = async () => {
    setLoading(true);
    try {
      const res = await _api.get("/triec-survey/admin/1/feedback/categories/2/reviews");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSurveyReports();
    GetReviews();
  }, []);

  return (
    <div>
      <div className="head-container">
        <div className="main-title">Mentee Employment Outcome and Mentor Exit Survey Dashboard</div>
        <div className="filter-section">
          <div className="date-picker-container">{/* <Date /> */}</div>
          <div className="update-report-btn">
            <button disabled={loading} className="btn btn-orange" onClick={UpdateReports}>
              Update Report
            </button>
          </div>
        </div>
      </div>

      <div className="data-container">
        <div className="table-container">
          {loading ? (
            <div className="load center-loading">
              <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>
          ) : (
            <Table data={data} />
          )}
        </div>
        <div className="chart-container">
          {loading ? (
            <div className="load">
              <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
              </svg>
            </div>
          ) : (
            <SurveyChart data={data} />
          )}
        </div>
      </div>
    </div>
  );
}
