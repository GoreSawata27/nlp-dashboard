import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

export default function SurveyChart({ data, questions, setQuestions }) {
  const [barChartData, setBarChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("top10");

  const barHeight = 80;
  const minHeight = 200;
  const containerHeight = Math.max(filteredData.length * barHeight, minHeight);

  const handleChange = (event) => {
    setQuestions(event.target.value);
  };

  const applyFilter = (data, filter, selectedQuestion) => {
    let newFilteredData = data;

    // Apply question filter if a question is selected
    if (selectedQuestion) {
      newFilteredData = newFilteredData.filter((item) => item.question === selectedQuestion);
    }

    if (filter === "top10") {
      newFilteredData = newFilteredData.slice(0, 10);
    }

    setFilteredData(newFilteredData);
  };
  useEffect(() => {
    const transformedData =
      data?.map((item) => ({
        name: item.categoryName,
        occurances: parseInt(item.occurances, 10),
        question: item.question,
      })) || [];

    setBarChartData(transformedData);
    applyFilter(transformedData, filter, questions);
  }, [data, questions, filter]); ///////////////////////////////////////////////////////check

  // Apply filter whenever the filter option or selected question changes
  useEffect(() => {
    applyFilter(barChartData, filter, questions);
  }, [filter, barChartData, questions]);

  const uniqueQuestions = Array.from(new Set(data.map((item) => item.question)));

  return (
    <>
      <div style={{ width: "100%", height: 1000, maxHeight: 1000, overflowY: "auto" }}>
        <div className="filter-data-btns">
          <div style={{ display: "flex", gap: "5px" }}>
            <div className={`filter-btn ${filter === "top10" && "active"}`}>
              <button onClick={() => setFilter("top10")}>Top 10 Categories</button>
            </div>

            <div className={`filter-btn ${filter === "all" && "active"}`}>
              <button onClick={() => setFilter("all")}>Show All Categories</button>
            </div>
          </div>
          <div className={`filter-btn  ${questions !== "" && "active"} `}>
            <button onClick={() => setQuestions("")}>Reset Question</button>
          </div>
        </div>
        <div className="sidebar">
          <div className="chart-header">
            <h3>Categories</h3>
            <div className="dropdown">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Questions</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={questions}
                    label="Questions"
                    onChange={handleChange}
                    renderValue={(selected) => `${selected.slice(0, 25)}${selected.length > 25 ? "..." : ""}`} // Truncate selected display
                  >
                    {uniqueQuestions?.map((question, index) => (
                      <MenuItem key={index} value={question}>
                        {question}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={containerHeight}>
            <BarChart data={filteredData} layout="vertical" barCategoryGap="10%">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={200} tick={{ fill: "#888888", fontSize: 14 }} />
              <Tooltip />
              <Bar dataKey="occurances" fill="#82ca9d" barSize={20}>
                <LabelList
                  dataKey="occurances"
                  position="right"
                  offset={10}
                  style={{ fill: "#888888", fontSize: 14 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
