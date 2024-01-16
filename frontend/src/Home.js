import React, { useEffect, useState } from "react";
import TaskForm from "./features/Task/TaskForm";
import Tasks from "./features/Task/Tasks";
import buttonClickSound from "./assets/notify2.mp3";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "./features/Task/taskSlice";

const Home = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks);
  const [loadingTask, setLoadingTask] = useState(true);
  const [taskEditing, setTaskEditing] = useState();

  let content;

  const addTask = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 204) {
        console.log(response.statusText);
        return;
      }

      if (response.ok) {
        dispatch(setTasks([...tasks, data]));
        const audio = new Audio(buttonClickSound);
        audio.play();

        const resData = await response.json();
        console.log(resData);
      } else {
        throw new Error("Error adding task");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/fetchTask", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        const importantTasks = data.message.filter((task) => task.isImportant);
        const otherTasks = data.message.filter((task) => !task.isImportant);
        const tasks = importantTasks.concat(otherTasks);
        dispatch(setTasks(tasks));
        setLoadingTask(false);
      } else {
        throw new Error("Error fetching task");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const editTask = (id) => {
    setTaskEditing(id);
  };

  if (loadingTask) {
    content = <h1 className="sub-heading loader-no-content">Loading...</h1>;
  } else {
    content = <Tasks tasks={tasks} onEdit={editTask} />;
  }
  return (
    <>
      <div className="main-heading">To Do App</div>
      <TaskForm
        onAdd={addTask}
        taskEditing={taskEditing}
        setTaskEditing={setTaskEditing}
      />
      {content}
    </>
  );
};

export default Home;
