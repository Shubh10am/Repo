import React, { useEffect, useState } from "react";
import { AiOutlineStop } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Table() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [yearMonths, setYearMonths] = useState(0); // Initialize with 0
  const [excludedDates, setExcludedDates] = useState([]);
  const [numberOfLeads, setNumberOfLeads] = useState("");
  const [expectedLeadCount, setExpectedLeadCount] = useState("");
  const [daysNumber, setDaysNumber] = useState(0); // Initialize with 0
  const [submittedData, setSubmittedData] = useState([]);
  const [check, setCheck] = useState(false);

  function calculateMonthsAndYear(start, end) {
    if (start && end) {
      const startYear = start.getFullYear();
      const startMonth = start.getMonth();
      const endYear = end.getFullYear();
      const endMonth = end.getMonth();

      console.log(startYear);
      console.log(startMonth);
      console.log(endYear);
      console.log(endMonth);

      const months = (endYear - startYear) * 12 + (endMonth - startMonth);
      setYearMonths(months);
    }
  }

  const calculateNumberOfDays = () => {
    if (startDate && endDate) {
      const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
      const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay));

      const excludedDayCount = excludedDates
        .map((excludedDate) => new Date(excludedDate))
        .filter(
          (excludedDate) => excludedDate >= startDate && excludedDate <= endDate
        ).length;

      // Calculate the number of full months between start and end
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth();
      const months = (endYear - startYear) * 12 + (endMonth - startMonth);

      // Calculate the number of days in the remaining partial months
      const remainingStartDays =
        (new Date(startYear, startMonth + months + 1, 1) - startDate) / oneDay;
      const remainingEndDays =
        (endDate - new Date(endYear, endMonth, 1)) / oneDay;

      const days = totalDays - excludedDayCount;
      console.log(totalDays);
      // If there's only 1 full month and no excluded days, set days to 30
      if (months === 1 && excludedDayCount === 0) {
        setDaysNumber(30);
      } else {
        setDaysNumber(days);
      }
    }
  };

  const calculateExpectedLeadCount = () => {
    if (numberOfLeads) {
      setExpectedLeadCount(numberOfLeads * daysNumber);
    }
  };

  useEffect(() => {
    calculateMonthsAndYear(startDate, endDate);
    calculateNumberOfDays();
    calculateExpectedLeadCount();
  }, [startDate, endDate, excludedDates, numberOfLeads, daysNumber]);

  const handleSubmit = () => {
    const data = {
      startDate,
      endDate,
      yearMonths,
      excludedDates,
      daysNumber,
      numberOfLeads,
      expectedLeadCount
    };
    setSubmittedData((prevData) => [...prevData, data]);

    setStartDate(null);
    setEndDate(null);
    setYearMonths(0);
    setExcludedDates([]);
    setDaysNumber(0);
    setNumberOfLeads("");
    setExpectedLeadCount("");
  };

  const clicked = () => {
    setCheck(true);
  };
  return (
    <>
      <div className="mx-3 my-1">
        <button className="btn btn-primary" onClick={clicked}>
          Create New
        </button>
      </div>
      <div style={{ width: "90%", margin: "1rem auto" }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Action</th>
              <th scope="col">ID</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Months, Year</th>
              <th scope="col">Dates Excluded</th>
              <th scope="col">Number Of Days</th>
              <th scope="col">Lead Count</th>
              <th scope="col">Expected Lead Count</th>
              <th scope="col">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {check ? (
              <tr>
                <td>N/A</td>
                <td>N/A</td>
                <td>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="form-control"
                  />
                </td>
                <td>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="form-control"
                  />
                </td>
                <td>{yearMonths}</td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    value={excludedDates.join(", ")}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setExcludedDates((prevExcludedDates) => [
                        ...prevExcludedDates,
                        selectedDate
                      ]);
                    }}
                  />
                </td>
                <td>{daysNumber}</td>
                <td>
                  <input
                    type="number"
                    value={numberOfLeads}
                    onChange={(e) => setNumberOfLeads(e.target.value)}
                  />
                </td>
                <td>{expectedLeadCount}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setCheck(false)}
                  >
                    <AiOutlineStop /> Cancel
                  </button>
                </td>
              </tr>
            ) : (
              ""
            )}
            {submittedData.map((data, index) => (
              <tr key={index}>
                <td>N/A</td>
                <td>{index + 1}</td>
                <td>{data.startDate.toDateString()}</td>
                <td>{data.endDate.toDateString()}</td>
                <td>{data.yearMonths}</td>
                <td>{data.excludedDates.join(", ")}</td>
                <td>{data.daysNumber}</td>
                <td>{data.numberOfLeads}</td>
                <td>{data.expectedLeadCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
