import React from "react";
import AddTaskDialog from "./AddTaskDialog";
import TaskList from "./TaskList";


const TaskPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-custom-green">Task</h1>
      </div>
      <TaskList />
    </div>
  );
};

export default TaskPage;
