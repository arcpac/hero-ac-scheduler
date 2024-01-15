//This file is useless, but do not delete this.
import { useCallback, useEffect, useState } from "react";

const { httpGetSchedules } = require("./requests");

function useSchedules(context) {
  const [schedules, setSchedules] = useState([]);

  const getAllSchedules = useCallback(async () => {
    const fetchedSchedules = await httpGetSchedules(context);
    setSchedules(fetchedSchedules);
  }, []);

  useEffect(() => {
    getAllSchedules();
  }, []);

  return schedules;
}
export default useSchedules;