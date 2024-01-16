const mongoose = require("mongoose");
const Task = require("./modal");
const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const url = process.env.MONGOURL;

app.use(express.json());
app.use(cors());

app.get("/fetchTask", async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ message: tasks });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addTask", async (req, res, next) => {
  try {
    const data = req.body;
    const { title, description } = data;
    const updatedData = {
      ...data,
      taskStatus: {
        status: "-",
        startTime: "000",
        endTime: "000",
      },
    };
    if (title.length === 0 || description.length === 0) {
      return res
        .status(204)
        .json({ message: "No Cotent found (title or description are empty)" });
    }
    const newTask = new Task(updatedData);
    await newTask.save();
    res.status(201).json({ message: "Task added successful." });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/editTask", async (req, res, next) => {
  try {
    const data = req.body;
    const filter = { id: data.id };
    const update = {
      $set: { title: data.title, description: data.description },
    };
    const result = await Task.updateOne(filter, update);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Task Edited successful." });
    } else {
      res.status(404).json("Error edting task:");
    }
  } catch (error) {
    console.error("Error Editing task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/startTask", async (req, res, next) => {
  try {
    const { id, startTime, status } = req.body;
    const object = await Task.findOne({ id });
    let { endTime } = object.taskStatus;
    if (!endTime) {
      endTime = "000";
    }
    const filter = { id };
    const update = {
      $set: { taskStatus: { startTime, status, endTime } },
    };
    await Task.updateOne(filter, update);

    res.status(200).json({ message: "Task started successful." });
  } catch (error) {
    console.error("Error Editing task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/endTask", async (req, res, next) => {
  try {
    const { id, endTime, status } = req.body;
    const object = await Task.findOne({ id });
    let { startTime } = object.taskStatus;
    if (!startTime) {
      startTime = "000";
    }
    const filter = { id };
    const update = {
      $set: {
        taskStatus: { endTime, status, startTime },
      },
    };
    await Task.updateOne(filter, update);

    res.status(200).json({ message: "Task Ended successful." });
  } catch (error) {
    console.error("Error Editing task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteTask", async (req, res, next) => {
  try {
    const { id } = req.body;
    const deletedTask = await Task.findOneAndDelete({ id });
    if (deletedTask) {
      res.status(200).json({ message: "Task deleted successful." });
    } else {
      res.status(403).json({ message: "Task deletion failed." });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/setAsImportant", async (req, res, next) => {
  try {
    const { id } = req.body;
    const update = {
      $set: { isImportant: true },
    };
    const result = await Task.updateOne({ id }, update);
    if (result) {
      res
        .status(200)
        .json({ message: "Task setted for important successful." });
    } else {
      res.status(403).json({ message: "Task setting for important failed." });
    }
  } catch (error) {
    console.error("Error setting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/clearImportant", async (req, res, next) => {
  try {
    const { id } = req.body;
    const update = {
      $set: { isImportant: false },
    };
    const result = await Task.updateOne({ id }, update);
    if (result) {
      res
        .status(200)
        .json({ message: "Task reseted for important successful." });
    } else {
      res.status(403).json({ message: "Task reseting for important failed." });
    }
  } catch (error) {
    console.error("Error resetting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000);

mongoose
  .connect(url, {
    dbName: "TODO",
  })
  .then((res) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("errrr", err);
  });
