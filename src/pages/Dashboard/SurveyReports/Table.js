import React, { useState } from "react";
import _api from "../../../utils/apis/_api";
import { Popover, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { Tooltip as ReactTooltip } from "react-tooltip";
export default function Table({ data, questions, setQuestions }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  // Extract unique questions for header columns
  const uniqueQuestions = Array.from(new Set(data.map((item) => item.question)));

  const FilterChartByQuestion = (question) => {
    setQuestions(question);
  };

  const GetReviews = async (categoryId) => {
    try {
      const res = await _api.get(
        `/triec-survey/admin/${sessionStorage.getItem("userID")}/feedback/categories/${categoryId}/reviews`
      );
      const firstReview = res.data.data.attribites[0]?.review;
      setReviewData(firstReview);
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
    }
  };

  const handleCellClick = (event, item, question) => {
    if (item.question === question && item.occurances) {
      setAnchorEl(event.currentTarget);
      FilterChartByQuestion(question);
      GetReviews(item.categoryId);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setReviewData(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "review-popover" : undefined;

  return (
    <div>
      {uniqueQuestions?.length > 0 ? (
        <>
          <table className="angled-headers-table">
            <thead>
              <tr>
                <th>
                  <div className="innerDiv">Categories</div>
                </th>
                {uniqueQuestions.map((question, index) => (
                  <th
                    key={index}
                    onClick={() => FilterChartByQuestion(question)}
                    data-tooltip-id="questionTooltip"
                    data-tooltip-html={`<div class="innerDiv">${question}</div>`}
                    className={questions === question ? "active-col question-th " : "question-th"}
                  >
                    <div className="innerDiv">{question}</div>
                  </th>
                ))}
                <ReactTooltip id="questionTooltip" place="top" style={{ maxWidth: "300px" }} />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Count</td>
                {uniqueQuestions.map((question, index) => {
                  const totalOccurrences = data
                    .filter((item) => item.question === question)
                    .reduce((acc, item) => acc + parseInt(item.occurances, 10), 0);
                  return (
                    <td className={questions === question ? "active-col " : ""} key={index}>
                      {totalOccurrences}
                    </td>
                  );
                })}
              </tr>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.categoryName}</td>
                  {uniqueQuestions.map((question, qIndex) => (
                    <td
                      key={qIndex}
                      className={questions === question ? "active-col td-data" : "td-data"}
                      onClick={(event) => handleCellClick(event, item, question)}
                    >
                      {item.question === question ? item.occurances : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Typography
              sx={{
                p: 2,
                maxWidth: "350px",
                overflowY: "auto",
              }}
            >
              {reviewData || "Loading..."}
            </Typography>
          </Popover>
        </>
      ) : (
        <h4>An error occurred or No Data Available</h4>
      )}
    </div>
  );
}
