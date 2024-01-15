import React, { useState } from "react";

const HolidayTable = ({ upcomingHolidays, selectedJurisdiction }) => {
  const [currentHolidayIndex, setCurrentHolidayIndex] = useState(0);

  const handleNext = () => {
    if (currentHolidayIndex < upcomingHolidays.length - 1) {
      setCurrentHolidayIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentHolidayIndex > 0) {
      setCurrentHolidayIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentHoliday = upcomingHolidays[currentHolidayIndex];

  return (
    <div className="d-flex flex-column mx-2">
      <h5 className="fw-bold mb-3">Upcoming Holidays</h5>
      {currentHoliday ? (
        <>
          <p className="h6 fw-bold">{currentHoliday["Holiday Name"]}</p>
          <p>{currentHoliday["Date"]}</p>
          {/* <p>
            {currentHoliday["Jurisdiction"]
              ? currentHoliday["Jurisdiction"].toUpperCase()
              : "Unknown Jurisdiction"}
          </p> */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-primary" onClick={handlePrevious}>
              Previous
            </button>
            <button className="btn btn-outline-primary" onClick={handleNext}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No upcoming holidays</p>
      )}
    </div>
  );
};

export default HolidayTable;
