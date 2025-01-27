export interface Task {
    id: string; // UUID for the task
    user_id: string; // ID of the user who created the task
    title: string; // Task title
    description: string; // Task description
    is_completed: boolean; // Indicates if the task is completed
    created_at: string; // Timestamp of when the task was created
  }

export interface FormErrors {
    email?: string;
    password?: string;
    title?: string;
    description?: string;
    name?:string;
    address?:string;
    contact?:string;
    age?:string;
    gender?:string;
  }
  

  export interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
  }


  export interface User {
    id: string; // or number, depending on your backend
    user_id?: string; // optional fields
    email?: string;
  };

  export type Employee = {
    id?: string;
    name?: string;
    address?: string;
    age?: string;
    contact?: string;
    gender?: string;
  };

  export interface EmployeeTableProps {
    employees: Employee[]; // Specify the type of employees prop
  }

  export type ColumnProps = {
    column: {
      id: string; // or number, depending on the actual type of column.id
    };
  };