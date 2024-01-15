import { useCallback, useEffect, useState } from "react";

const { httpGetUsers } = require("./requests");

function useUsers(context) {
  const [users, setUsers] = useState([]);
  
  const getAllUsers = useCallback(async () => {
    const fetchedUsers = await httpGetUsers(context);
    setUsers(fetchedUsers);
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  return users;
}
export default useUsers;

