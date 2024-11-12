import React from "react";

export default function Table({ data }) {
  // Extract unique questions for header columns
  const uniqueQuestions = Array.from(new Set(data.map((item) => item.question)));

  return (
    <div>
      <table className="angled-headers-table">
        <thead>
          <tr>
            <th>
              <div className="innerDiv">Categories</div>
            </th>
            {uniqueQuestions?.map((question, index) => (
              <th key={index}>
                <div className="innerDiv">{question}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Row for count */}
          <tr>
            <td>Count</td>
            {uniqueQuestions?.map((question, index) => {
              const totalOccurrences = data
                .filter((item) => item.question === question)
                .reduce((acc, item) => acc + parseInt(item.occurances, 10), 0);
              return <td key={index}>{totalOccurrences}</td>;
            })}
          </tr>

          {/* Rows for each categoryName */}
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{item.categoryName}</td>
              {uniqueQuestions.map((question, qIndex) => (
                <td key={qIndex}>{item.question === question ? item.occurances : ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
