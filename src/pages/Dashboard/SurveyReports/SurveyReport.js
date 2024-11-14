import React, { useState, useEffect } from "react";
import _api from "../../../utils/apis/_api";
import Table from "./Table";
import SurveyChart from "./SurveyChart";
import DateRangePicker from "./Date";
import toast from "react-hot-toast";

export default function SurveyReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState("");
  const [dateRange, setDateRange] = useState({ fromDate: null, toDate: null });

  const getSurveyReports = async (startDate = null, endDate = null) => {
    setLoading(true);
    try {
      const url =
        startDate && endDate
          ? `/triec-survey/admin/${sessionStorage.getItem(
              "userID"
            )}/feedback/categories?from-date=${startDate}&to-date=${endDate}`
          : `/triec-survey/admin/${sessionStorage.getItem("userID")}/feedback/categories`;

      const res = await _api.get(url);
      setData(res.data.data.attribites);
    } catch (error) {
      if (error?.response?.data?.errors) {
        const apiErrors = error?.response?.data?.errors;
        const errorMessage = apiErrors?.map((err) => err.detail)?.join(", ");
        toast.error(errorMessage, {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
        return;
      }
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
        return;
      } else {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const UpdateReports = async () => {
    if (!dateRange.fromDate || !dateRange.toDate) {
      toast.error("Please select both 'From Date' and 'To Date' before updating the report.", {
        duration: 3000,
        position: "top-center",
        className: "custom-toast",
        iconTheme: {
          primary: "#ffc107",
        },
      });
      return;
    }

    setLoading(true);
    try {
      await _api.post(`/triec-survey/admin/${sessionStorage.getItem("userID")}/process-survey-responses`, {
        data: {
          type: "surveys",
          attributes: {
            "from-date": dateRange.fromDate,
            "to-date": dateRange.toDate,
          },
        },
      });
      getSurveyReports(dateRange.fromDate, dateRange.toDate);
    } catch (error) {
      if (error?.response?.data?.errors) {
        const apiErrors = error?.response?.data?.errors;
        const errorMessage = apiErrors?.map((err) => err.detail)?.join(", ");
        toast.error(errorMessage, {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
        return;
      }
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
        return;
      } else {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
      }
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSurveyReports();
  }, []);

  return (
    <div>
      <div className="head-container">
        <div className="main-title">Mentee Employment Outcome and Mentor Exit Survey Dashboard</div>
        <div className="filter-section">
          <div className="date-picker-container">
            <DateRangePicker onDateChange={setDateRange} />
          </div>
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
            <Table data={data} questions={questions} setQuestions={setQuestions} />
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
            <SurveyChart data={data} questions={questions} setQuestions={setQuestions} />
          )}
        </div>
      </div>
    </div>
  );
}
