const ADMIN_URL = "http://localhost:8000/admin"

async function httpGetUser(context, id) {
  const response = await fetch(`${ADMIN_URL}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${context.token}`
    }
  });
  const responseData = await response.json()
  return await responseData
}

async function httpGetUsers(context) {
  const response = await fetch(`${ADMIN_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${context.token}`
    }
  });
  const responseData = await response.json()
  return responseData;
}
async function httpGetUsersCount(context) {
  const response = await fetch(`${ADMIN_URL}/users/users-stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${context.token}`
    }
  });
  const responseData = await response.json()
  return responseData;
}

async function httpGetSchedule(context, id) {
  const response = await fetch(`${ADMIN_URL}/schedule`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${context.token}`
    }
  });
  const responseData = await response.json()
  return responseData;
}
async function httpGetSchedules(context) {
  const response = await fetch(`${ADMIN_URL}/schedules`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${context.token}`
    }
  });
  const responseData = await response.json()
  return responseData;
}

async function httpGetActivityLogs(context) {
  const response = await fetch(`${ADMIN_URL}/activities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${context.token}`
    }
  });
  const responseData = await response.json()
  return responseData;
}

async function httpGetNodeRed(context) {
  const response = await fetch("http://127.0.0.1:8000/admin/node-red/", {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + context.token
    },
  });
  const responseData = await response.json()
  return responseData;
}

async function httpActivityLogs(context, action, category, object) {
  const response = await fetch("http://127.0.0.1:8000/admin/activities/", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + context.token
    },
    body: JSON.stringify({
      email: context.activeUser.email,
      action: action,
      category: category,
      object: object
    })
  });
  // const responseData = await response.json()
}

export async function httpPutNodeRed(authContext, updatedConfig) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/admin/node-red/${updatedConfig._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authContext.token,
      },
      body: JSON.stringify(updatedConfig),
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Error updating Node-RED configuration:", error);
    return {
      responseCode: 500,
      message: "Internal Server Error",
    };
  }
}



export { httpGetUser, httpGetUsers, httpGetSchedules, httpGetSchedule, httpGetActivityLogs, httpGetNodeRed, httpActivityLogs, httpGetUsersCount };