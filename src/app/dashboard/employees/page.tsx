import React from "react";
import EmployeeList from "./EmployeeList";


const TaskPage = () => {
  return (
    <div className="my-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-custom-green">Employees</h1>
      </div>
      <EmployeeList/>
    </div>
  );
};

export default TaskPage;
