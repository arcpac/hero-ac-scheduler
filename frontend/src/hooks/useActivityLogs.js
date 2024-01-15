import { useCallback, useEffect, useState } from "react";
import Swal from 'sweetalert2'

const { httpGetActivityLogs } = require("./requests");

function useActivityLogs(context) {
  const [activityLogs, setActivityLogs] = useState([]);

  const getAllActivityLogs = useCallback(async () => {
    const fetchedActivityLogs = await httpGetActivityLogs(context);
    if (fetchedActivityLogs.responseCode === 404) {
      Swal.fire({
        title: "Error",
        text: `${fetchedActivityLogs.message}`,
        icon: "error"
      });
      return setActivityLogs([]);
    }
    return setActivityLogs(fetchedActivityLogs);
  }, [activityLogs]);

  useEffect(() => {
    getAllActivityLogs();
  }, []);

  return activityLogs;
}
export default useActivityLogs;

