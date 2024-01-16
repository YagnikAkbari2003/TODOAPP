import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    setTasks(state, action) {
      state.tasks = action.payload;
    },
  },
});

export const { addTaskaa, setTasks } = taskSlice.actions;

export default taskSlice.reducer;
