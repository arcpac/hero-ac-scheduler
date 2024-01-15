export function formatDescription(rowData) {
  try {
    const parsedData =
      typeof rowData.description === "string"
        ? JSON.parse(rowData.description)
        : rowData.description;

    const message = parsedData.message || parsedData;
    const userData = message["userId"];

    //schedule
    if (rowData.category === "schedule" && rowData.action === "Created") {
      const holidayName = message["Holiday Name"];

      return `User "${message.embeddedUser.email}" has created a new schedule with holiday name "${holidayName}"`;
    }

    //user
    if (rowData.category === "user" && rowData.action === "Created") {
      return `User "${rowData.email}" has created a new account with email address "${message.email}"`;
    }
    if (rowData.category === "user" && rowData.action === "Updated") {
      return `User "${rowData.email}" has updated user "${message.email}"`;
    }
    if (rowData.category === "user") {
      const action = rowData.action === "Deactivate User" ? "deactivated" : "deleted";
      return `User "${rowData.email}" has ${action} user "${message.email}"`;
    }

    //login
    if (rowData.category === "login") {
      return `The user with email "${parsedData.email}" has logged in.`;
    }
  } catch (error) {
    console.error("Error parsing data:", error);
  }

  return "";
}
