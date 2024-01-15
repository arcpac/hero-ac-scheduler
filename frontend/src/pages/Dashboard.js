import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { Button } from "primereact/button";
import { Calendar, Whisper, Popover, Badge } from "rsuite";
import { AuthContext } from "../context/auth-context";
import CreateScheduleModal from "../components/UIElements/Schedules/CreateScheduleModal";
import { jurisdictions } from "../utils/jurisdictions";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { httpGetUsersCount, httpGetSchedules } from "../hooks/requests";
import { Doughnut } from "react-chartjs-2";
import * as dayjs from "dayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import "../styles/Dashboard.css";
import { Chart as ChartJS, registerables } from "chart.js";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BarGraph from "../components/Dashboard/BarGraph";
import getScheduleDataCounts from "../utils/getScheduleDataCounts";
import JurisdictionTable from "../components/Dashboard/JurisdictionTable";
ChartJS.register(...registerables);

function Dashboard({ userType }) {
  const authCtx = useContext(AuthContext);
  const activeUser = authCtx.activeUser;
  const [showModal, setShowModal] = useState(false);

  const [totalUserCount, setTotalUserCount] = useState(0);
  const [userData, setUserData] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [nextHoliday, setNextHoliday] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    document.title = "Dashboard - Airconnect";
  }, []);

  useLayoutEffect(() => {
    document.body.style.backgroundImage = `url(../images/white-bg.svg)`;
  });

  const getCurrentDate = () => {
    const currentDate = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return currentDate.toLocaleDateString("en-AU", options);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [mqttConnected, setMqttConnected] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMqttConnected((prev) => !prev);
    }, 50000000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await httpGetUsersCount(authCtx);
        setUserData(fetchedUsers);
        const activeCount = fetchedUsers.activeCount;
        const inactiveCount = fetchedUsers.inactiveCount;
        const totalUsers = activeCount + inactiveCount;
        setTotalUserCount(totalUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [authCtx]);

  const chartData = {
    labels: [`Active`, `Inactive`],
    datasets: [
      {
        data: [userData.activeCount, userData.inactiveCount],
        backgroundColor: ["rgba(27, 89, 248, 1)", "rgba(0,0,0, 0.2)"],
      },
    ],
  };

  const chartOptions = {
    cutout: "50%",
    responsive: true,
    maintainAspectRatio: false,
  };

  const getAllSchedules = useCallback(async () => {
    const fetchedSchedules = await httpGetSchedules(authCtx);
    setSchedules(fetchedSchedules);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedSchedules = await httpGetSchedules(authCtx);
        setSchedules(fetchedSchedules);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getAllSchedules();
  }, [getAllSchedules]);

  const [sameHolidayJurisdictions, setSameHolidayJurisdictions] = useState([]);

  useEffect(() => {
    const groupedHolidays = groupHolidays();
    const currentDate = dayjs();
    const sortedHolidays = [...groupedHolidays]
      .filter((holiday) => dayjs(holiday.date).isAfter(currentDate))
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

    const nextHoliday = sortedHolidays[0];

    if (nextHoliday) {
      setNextHoliday(nextHoliday);

      const holidayDate = dayjs(nextHoliday.date);

      const countdownDuration = holidayDate.diff(currentDate);

      const days = Math.floor(countdownDuration / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (countdownDuration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const minutes = Math.floor(
        (countdownDuration % (60 * 60 * 1000)) / (60 * 1000)
      );
      setCountdown({ days, hours, minutes });

      const sameHolidaySchedules = groupedHolidays.filter(
        (holiday) => holiday.name === nextHoliday.name
      );

      const uniqueJurisdictions = [
        ...new Set(
          sameHolidaySchedules.flatMap((holiday) => holiday.jurisdictions)
        ),
      ];
      setSameHolidayJurisdictions(uniqueJurisdictions);

      const index = filteredGroupedHolidays.findIndex(
        (holiday) => holiday.name === nextHoliday.name
      );
      setCurrentDisplayedHolidayIndex(index >= 0 ? index : 0);
    } else {
      setCountdown(null);
      setSameHolidayJurisdictions([]);
      setCurrentDisplayedHolidayIndex(0);
    }
  }, [schedules]);

  const [holidaysPerJurisdiction, setHolidaysPerJurisdiction] = useState([]);
  useEffect(() => {
    const fetchSchedulesAndGenerateDataset = async () => {
      try {
        const fetchedSchedules = await httpGetSchedules(authCtx);
        const dataset = await getScheduleDataCounts(
          fetchedSchedules,
          selectedYear
        );
        setHolidaysPerJurisdiction(dataset);
      } catch (error) {
        setHolidaysPerJurisdiction({});
      }
    };
    fetchSchedulesAndGenerateDataset();
  }, [authCtx, selectedYear]);

  const [currentDisplayedHolidayIndex, setCurrentDisplayedHolidayIndex] =
    useState(0);

  const showPrevHoliday = () => {
    if (currentDisplayedHolidayIndex > 0) {
      setCurrentDisplayedHolidayIndex((prevIndex) => prevIndex - 1);
    }
  };

  const showNextHoliday = () => {
    if (currentDisplayedHolidayIndex < filteredGroupedHolidays.length - 1) {
      setCurrentDisplayedHolidayIndex((prevIndex) => prevIndex + 1);
    }
  };

  const groupHolidays = () => {
    const groupedHolidays = {};

    schedules.forEach((schedule) => {
      const holidayName = schedule["Holiday Name"];
      const holidayDate = schedule["Date"];
      const sourceDate = schedule["source"];

      const key = `${holidayName}_${holidayDate}`;

      if (!groupedHolidays[key]) {
        groupedHolidays[key] = {
          name: holidayName,
          date: holidayDate,
          jurisdictions: [schedule["Jurisdiction"]],
          source: sourceDate,
        };
      } else {
        groupedHolidays[key].jurisdictions.push(schedule["Jurisdiction"]);
      }
    });

    return Object.values(groupedHolidays);
  };

  const filteredGroupedHolidays = groupHolidays()
    .filter((holiday) => dayjs(holiday.date).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  const [isSmallerScreen, setIsSmallerScreen] = useState(
    window.innerWidth <= 1440
  );

  const filteredAllGroupedHolidays = groupHolidays()
    .filter((holiday) => dayjs(holiday.date))
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  useEffect(() => {
    const handleResize = () => {
      setIsSmallerScreen(window.innerWidth <= 1440);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="my-4">
      <div className="first-row d-flex justify-content-between align-items-top mb-4">
        <div className="dashboard">
          <h2>Dashboard</h2>
          <p className="text-dark mb-1">
            Hello <b>{activeUser.firstName}</b>, welcome back. Today is{" "}
            {getCurrentDate()}
          </p>
          <div className="mqtt-indicator-container">
            <span
              className={`mqtt-indicator ${mqttConnected ? "green" : "red"}`}
            ></span>
            <p className="text-dark mb-0">MQTT connected</p>
          </div>
        </div>
        <div className="mt-3 d-grid col-6">
          {["super_admin", "administrator", "moderator"].includes(userType) && (
            <Button
              label={
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h4">
                    <b>Add new holiday schedule</b>
                  </span>
                  <AddBoxIcon style={{ fontSize: 40 }} />
                </div>
              }
              className="big-blue-button py-4"
              onClick={handleShowModal}
            />
          )}
        </div>
      </div>

      <div className="second-row d-flex justify-content-between align-items-top my-4 gap-4">
        <div className="custom-calendar-container mt-2">
          <Calendar
            compact
            className="text-dark border custom-date-calendar"
            style={{
              width: isSmallerScreen ? "400px" : "600px",
              height: "350px",
            }}
            renderCell={(date, _dateState) => {
              const holiday = filteredAllGroupedHolidays.find((holiday) =>
                dayjs(holiday.date).isSame(date, "day")
              );

              const cellKey = date.toISOString();

              return (
                <div
                  key={cellKey}
                  style={{ position: "relative", height: "100%" }}
                >
                  {holiday && (
                    <Whisper
                      placement="top"
                      trigger="hover"
                      speaker={
                        <Popover>
                          <p className="text-secondary">{holiday.name}</p>
                        </Popover>
                      }
                    >
                      <Badge
                        style={{
                          backgroundColor:
                            holiday["source"] === "au" ? "#3C50E0" : "#80CAEE",
                          color: "#ffffff",
                          top: "0",
                          right: "0",
                        }}
                      />
                    </Whisper>
                  )}
                </div>
              );
            }}
          />
        </div>
        <div className="row mt-2">
          <div className="col-md-6">
            <div className="next-holiday-container pb-3">
              <h4 className="text-light fw-bold">Next holiday in</h4>
              {nextHoliday ? (
                <>
                  <div id="countdown" className=" text-end">
                    <ul>
                      <li>
                        <span className="h1">
                          {countdown && `${countdown.days}`}
                        </span>
                        days
                      </li>
                      <li>
                        <span className="h1">
                          {" "}
                          {countdown && `${countdown.hours}`}
                        </span>
                        Hours
                      </li>
                      <li className="px-0">
                        <span className="h1">
                          {countdown && `${countdown.minutes}`}
                        </span>
                        Minutes
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-light mb-5">No upcoming holidays</p>
              )}
            </div>
          </div>
          <div className="col-md-6 mt-0">
            <div className="next-holiday-container text-end">
              {nextHoliday ? (
                <>
                  <h4 className="text-light fw-bold mb-4">
                    {nextHoliday.name}
                  </h4>
                  <p className="h6 fw-bold">
                    {dayjs(nextHoliday.date).format("dddd, DD MMMM YYYY")}
                  </p>
                  <p>
                    {nextHoliday.jurisdictions
                      .map((jurisdiction) => jurisdiction.toUpperCase())
                      .join(", ")}
                  </p>
                </>
              ) : (
                <p className="mb-4 pb-5">No upcoming holidays</p>
              )}
            </div>
          </div>

          <div className="row mt-0">
            <div className="col-md-5">
              <div className="border bd-radius d-flex align-items-center mt-4">
                <div className="mx-2 p-2 py-4">
                  <p className="text-dark">Total Users:</p>
                  <h2 className="fw-bold">{totalUserCount}</h2>
                </div>
                <div className="ms-auto mx-2">
                  <Doughnut
                    data={chartData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="bd-radius d-flex align-items-center mt-4 text-dark upcoming-holidays-container">
                <div className="pb-3 mx-2 p-3 w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="text-dark fw-bold">Upcoming holidays</h6>
                    <div className="d-flex justify-content-between align-items-center mt-0">
                      <Button
                        icon={<ChevronLeftIcon />}
                        onClick={showPrevHoliday}
                        disabled={
                          currentDisplayedHolidayIndex === 0 ||
                          filteredGroupedHolidays.length === 0
                        }
                        outlined
                      />
                      <Button
                        icon={<ChevronRightIcon />}
                        onClick={showNextHoliday}
                        disabled={
                          currentDisplayedHolidayIndex ===
                            filteredGroupedHolidays.length - 1 ||
                          filteredGroupedHolidays.length === 0
                        }
                        outlined
                      />
                    </div>
                  </div>
                  {filteredGroupedHolidays.length > 0 ? (
                    <div
                      key={`${filteredGroupedHolidays[currentDisplayedHolidayIndex].name}_${filteredGroupedHolidays[currentDisplayedHolidayIndex].date}`}
                      className="mb-3"
                    >
                      <p className="text-dark fw-bold">
                        {dayjs(
                          filteredGroupedHolidays[currentDisplayedHolidayIndex]
                            .date
                        ).format(
                          isSmallerScreen
                            ? "DD MMMM YYYY"
                            : "dddd, DD MMMM YYYY"
                        )}
                        :{" "}
                        {
                          filteredGroupedHolidays[currentDisplayedHolidayIndex]
                            .name
                        }
                      </p>
                      <p>
                        {!isSmallerScreen ? "Jurisdictions: " : ""}
                        {filteredGroupedHolidays[
                          currentDisplayedHolidayIndex
                        ].jurisdictions
                          .join(", ")
                          .toUpperCase()}
                      </p>
                    </div>
                  ) : (
                    <p className="mb-5">No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="third-row d-flex justify-content-between align-items-top gap-4 text-dark">
        <BarGraph
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          schedules={schedules}
          holidaysPerJurisdiction={holidaysPerJurisdiction}
        />
        <JurisdictionTable holidaysPerJurisdiction={holidaysPerJurisdiction} />
      </div>
      <CreateScheduleModal
        show={showModal}
        jurisdictions={jurisdictions()}
        handleClose={handleCloseModal}
      />
    </div>
  );
}

export default Dashboard;
