export const editTaskById = async (id, title, description) => {
  try {
    const response = await fetch("http://localhost:5000/editTask/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title,
        description,
      }),
    });
    if (response.ok) {
      const resData = await response.json();
      console.log(resData);
    } else {
      throw new Error("Error while editing.");
    }
  } catch (err) {
    console.error(err.message);
  }
};

export const taskStarted = async (taskid, status, time) => {
  try {
    const response = await fetch("http://localhost:5000/startTask", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startTime: time,
        status: status,
        id: taskid,
      }),
    });
    if (response.ok) {
      const resData = await response.json();
      console.log(resData);
    } else {
      throw new Error("Error while starting task.");
    }
  } catch (err) {
    console.error(err.message);
  }
};

export const taskEnded = async (taskid, status, time) => {
  try {
    const response = await fetch("http://localhost:5000/endTask", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endTime: time,
        status: status,
        id: taskid,
      }),
    });
    if (response.ok) {
      const resData = await response.json();
      console.log(resData);
    } else {
      throw new Error("Error while ending task.");
    }
  } catch (err) {
    console.error(err.message);
  }
};
