import React, { useState } from "react";
import _api from "../../../utils/apis/_api";
import { Popover, Typography } from "@mui/material";

export default function Table({ data, questions, setQuestions }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [reviewData, setReviewData] = useState(null);

  // Extract unique questions for header columns
  const uniqueQuestions = Array.from(new Set(data.map((item) => item.question)));

  const FilterChartByQuestion = (question) => {
    setQuestions(question);
  };

  const GetReviews = async () => {
    try {
      const res = await _api.get("/triec-survey/admin/1/feedback/categories/2/reviews");

      const firstReview = res.data.data.attribites[0]?.review;
      setReviewData(firstReview);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCellClick = (event, item, question) => {
    if (item.question === question && item.occurances) {
      setAnchorEl(event.currentTarget);
      FilterChartByQuestion(question);
      GetReviews();
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
      <table className="angled-headers-table">
        <thead>
          <tr>
            <th>
              <div className="innerDiv">Categories</div>
            </th>
            {uniqueQuestions.map((question, index) => (
              <th key={index} onClick={() => FilterChartByQuestion(question)}>
                <div className="innerDiv">{question}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Count</td>
            {uniqueQuestions.map((question, index) => {
              const totalOccurrences = data
                .filter((item) => item.question === question)
                .reduce((acc, item) => acc + parseInt(item.occurances, 10), 0);
              return <td key={index}>{totalOccurrences}</td>;
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
    </div>
  );
}
