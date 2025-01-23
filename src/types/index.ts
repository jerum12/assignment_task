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
  }
  