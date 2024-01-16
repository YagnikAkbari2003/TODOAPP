const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  taskType: {
    type: String,
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  time: {
    type: String,
  },
  taskStatus: {
    type: Object,
    required: true,
    default: {
      endTime: "000",
      startTime: "000",
      status: "",
    },
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
