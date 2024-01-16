import React, { useEffect, useState } from "react";
import { dateConverter, generateUID } from "../../utils/helpers";
import { editTaskById } from "../../services/apiTask";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "./taskSlice";

const TaskForm = ({ onAdd, taskEditing, setTaskEditing }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("personal");
  const tasks = useSelector((state) => state.task.tasks);
  const dispatch = useDispatch();
  let content;

  useEffect(() => {
    if (taskEditing) {
      setFormOpen(true);
    }
  }, [taskEditing]);

  const addTaskToList = async (e) => {
    e.preventDefault();
    if (taskEditing) {
      await editTaskById(taskEditing, title, description);

      const updatedTasks = tasks.map((task) =>
        task.id === taskEditing ? { ...task, title, description } : task
      );
      dispatch(setTasks(updatedTasks));
      setTitle("");
      setDescription("");
      setFormOpen(false);
      return;
    }

    const data = {
      id: generateUID(title, description),
      title,
      description,
      taskType,
      time: dateConverter(new Date()),
      taskStatus: {
        status: "-",
        startTime: "000",
        endTime: "000",
      },
    };
    onAdd(data);
    setFormOpen(false);
    setTitle("");
    setDescription("");
  };

  if (formOpen) {
    content = (
      <form onSubmit={(e) => addTaskToList(e)}>
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          type="text"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <select
          className="taskType"
          name="taskType"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="grocery list">Grocery List</option>
        </select>
        <div className="buttons-section">
          <input
            type="submit"
            value={`${!taskEditing ? "Add Task" : "Edit Task"} `}
          />
          <button
            className="special-button"
            onClick={() => {
              setFormOpen(false);
              setTaskEditing("");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  } else {
    content = <button onClick={() => setFormOpen(true)}>Add Task</button>;
  }
  return <>{content}</>;
};

export default TaskForm;
