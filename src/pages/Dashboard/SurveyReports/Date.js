import * as React from "react";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

export default function DateRangePicker({ onDateChange }) {
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);

  const handleFromDateChange = (newValue) => {
    setFromDate(newValue);
    onDateChange({
      fromDate: dayjs(newValue).format("MM-DD-YYYY"),
      toDate: toDate ? dayjs(toDate).format("MM-DD-YYYY") : null,
    });
  };

  const handleToDateChange = (newValue) => {
    setToDate(newValue);
    onDateChange({
      fromDate: fromDate ? dayjs(fromDate).format("MM-DD-YYYY") : null,
      toDate: dayjs(newValue).format("MM-DD-YYYY"),
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: "100%",
          height: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          position: "relative",
        }}
      >
        <DemoItem>
          <DesktopDatePicker
            label="From Date"
            value={fromDate}
            onChange={handleFromDateChange}
            slotProps={{
              textField: {
                sx: { height: "100%" },
                inputProps: { style: { height: "100%", boxSizing: "border-box" } },
              },
            }}
          />
        </DemoItem>

        <DemoItem>
          <DesktopDatePicker
            label="To Date"
            value={toDate}
            onChange={handleToDateChange}
            minDate={fromDate}
            slotProps={{
              textField: {
                sx: { height: "100%" },
                inputProps: { style: { height: "100%", boxSizing: "border-box" } },
              },
            }}
          />
        </DemoItem>
      </Box>
    </LocalizationProvider>
  );
}
