import React from "react";
import _api from "../../../utils/apis/_api";

export default function Table({ data, questions, setQuestions }) {
  // Extract unique questions for header columns
  const uniqueQuestions = Array.from(new Set(data.map((item) => item.question)));

  const FilterChartByQuestion = (question) => {
    setQuestions(question);
  };

  const GetReviews = async () => {
    try {
      const res = await _api.get("/triec-survey/admin/1/feedback/categories/2/reviews");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

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
                <div className={`innerDiv `}>{question}</div>
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
              return (
                <td
                  key={index}
                  // className={questions === question ? "active-col" : ""}
                >
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
                  onClick={() => FilterChartByQuestion(question)}
                >
                  {item.question === question ? item.occurances : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
