import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import { taskStarted } from "../../services/apiTask";
import { taskEnded } from "../../services/apiTask";
import { dateConverter } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "./taskSlice";

const Task = ({ task, onEdit }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.tasks);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch("http://localhost:5000/deleteTask", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });
      if (response.status === 403) {
        console.error("Error deleting task");
        return;
      }

      if (response.ok) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        dispatch(setTasks(updatedTasks));
        const resData = await response.json();
        console.log(resData);
      } else {
        throw new Error("Error deleting task");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const endTask = (taskid) => {
    if (task.taskStatus?.status === "-") {
      return;
    }
    const time = dateConverter(new Date());
    const status = "completed";
    taskEnded(taskid, status, time);
    const updatedTasks = tasks.map((task) =>
      task.id === taskid
        ? {
            ...task,
            taskStatus: { ...task.taskStatus, status, endTime: time },
          }
        : task
    );
    dispatch(setTasks(updatedTasks));
  };

  const startTask = (taskid) => {
    const time = dateConverter(new Date());
    const status = "pending";
    taskStarted(taskid, status, time);
    const updatedTasks = tasks.map((task) =>
      task.id === taskid
        ? {
            ...task,
            taskStatus: { ...task.taskStatus, status, startTime: time },
          }
        : task
    );
    dispatch(setTasks(updatedTasks));
  };

  const setAsImportant = async (taskid) => {
    try {
      const response = await fetch("http://localhost:5000/setAsImportant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskid }),
      });

      if (response.status === 403) {
        console.log("Error setting task");
        return;
      }

      if (response.ok) {
        const newtask = tasks.filter((task) => task.id === taskid)[0];
        const oldTasks = tasks.filter((task) => task.id !== taskid);
        const updatedTasks = [].concat({ ...newtask, isImportant: true });
        const finalTasks = updatedTasks.concat(oldTasks);
        dispatch(setTasks(finalTasks));
        const resData = await response.json();
        console.log(resData);
      } else {
        throw new Error("Error setting task");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const clearImportance = async (taskid) => {
    try {
      const response = await fetch("http://localhost:5000/clearImportant", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskid }),
      });

      if (response.status === 403) {
        console.log("Error setting task");
        return;
      }

      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskid ? { ...task, isImportant: false } : task
        );
        dispatch(setTasks(updatedTasks));
        const resData = await response.json();
        console.log(resData);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const editTask = async (taskid) => {
    onEdit(taskid);
  };

  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <button
        type="button"
        onClick={decoratedOnClick}
        className="toggle-button"
      >
        {children}
      </button>
    );
  };

  return (
    <>
      <Accordion>
        <Card className="card">
          <Card.Header className="card-header">
            <div className="task-card" key={task.id}>
              <i
                className={`fas fa-map-pin ${
                  task.isImportant ? "fa-blue-pin fa-pin-fixed" : "fa-pin"
                }`}
                onClick={() =>
                  task.isImportant
                    ? clearImportance(task.id)
                    : setAsImportant(task.id)
                }
              ></i>
              {task.taskStatus?.status !== "completed" && <p>{task.title}</p>}
              {task.taskStatus?.status === "completed" && (
                <del>{task.title}</del>
              )}

              <div>
                <div className="grid">
                  {task.taskStatus?.status !== "completed" &&
                    task.taskStatus?.status !== "pending" && (
                      <button
                        className="special-button"
                        onClick={() => startTask(task.id)}
                      >
                        Start Task
                      </button>
                    )}
                  {task.taskStatus?.status !== "completed" &&
                    task.taskStatus?.status !== "-" && (
                      <button
                        className="special-button"
                        onClick={() => endTask(task.id)}
                      >
                        End Task
                      </button>
                    )}
                  {task.taskStatus?.status !== "completed" &&
                    task.taskStatus?.status !== "pending" && (
                      <button
                        className="special-button"
                        onClick={() => editTask(task.id)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}

                  <Button onClick={handleShow}>
                    <i className="fa-regular fa-trash-can"></i>
                  </Button>
                  <Modal show={show} onHide={handleClose} className="modal">
                    <Modal.Header closeButton>
                      <Modal.Title className="modal-title">
                        Are you Sure You want to delete it?
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      You won't be able to undo this action.
                    </Modal.Body>
                    <Modal.Footer className="footer-modal-button">
                      <Button variant="secondary" onClick={handleClose}>
                        cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => deleteTask(task.id)}
                        className="delete-button"
                      >
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
              <div className="task-status">{task.taskStatus?.status}</div>
            </div>
            <CustomToggle eventKey={task.id}>
              <i className="fa-solid fa-arrow-down"></i>
            </CustomToggle>
          </Card.Header>
          <Accordion.Collapse eventKey={task.id}>
            <Card.Body className="card-body">
              <div>
                <p>Task Details:</p>
                {task.taskStatus?.status !== "completed" && (
                  <p>Title:- {task.title}</p>
                )}
                {task.taskStatus?.status === "completed" && (
                  <p>
                    Title:- <del>{task.title}</del>
                  </p>
                )}
                <p>TaskType:- {task.taskType}</p>
                <p>Description:- {task.description}</p>
                <p>Status:- {task.taskStatus?.status}</p>
              </div>
              <div>
                <p>Task Timings:</p>
                <p>Created At :- {task.time.toLocaleString()}</p>

                <p>
                  Started At :-{" "}
                  {task.taskStatus?.startTime
                    ? task.taskStatus.startTime.toLocaleString()
                    : ""}
                </p>
                <p>
                  Completed At :-{" "}
                  {task.taskStatus?.endTime
                    ? task.taskStatus.endTime.toLocaleString()
                    : ""}
                </p>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
};

export default Task;
