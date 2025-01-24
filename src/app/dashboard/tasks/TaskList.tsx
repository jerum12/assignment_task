'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AddTaskDialog from './AddTaskDialog';
import { FormErrors, Task } from '@/types';
import toast from 'react-hot-toast';
import { Loader } from 'react-feather';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ConfirmationModal from '@/components/Confirmation';


const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    console.log(editingTask)
    if (!editingTask?.title) newErrors.title = 'Title is required';
    if (!editingTask?.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTask = (task : Task) => {
    if (validateForm()) {
      setShowSaveModal(true);
      setEditingTask(task);
    }
    
  };

  // Delete task
  const deleteTask = async () => {
    setIsLoading(true);
    const { error } = await supabase.from('tasks').delete().eq('id', taskToDelete);
    if (!error) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete));
      toast.success('Task deleted successfully!');
    } else {
      toast.error('Error deleting task');
    }

    setShowDeleteModal(false);
    setIsLoading(true);
  };

  // Edit task
  const editTask = async () => {
    setIsLoading(true);

            const { error } = await supabase
            .from('tasks')
            .update({ title: editingTask?.title, description: editingTask?.description })
            .eq('id', editingTask?.id);
      
          if (!error) {
            setTasks((prevTasks) =>
              prevTasks.map((t) => (t.id === editingTask?.id ? editingTask : t))
            );
            toast.success('Task updated successfully!');
            setEditingTask(null); // Exit editing mode
          } else {
            toast.error('Failed to update task');
          }
          setShowSaveModal(false);
      //handleDialogChange(false);
    
    setIsLoading(false);
    
  };


  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tasks').select('*');
    if (!error && data) {
      setTasks(data);
    } else {
      toast.error(`Error fetching tasks: ${error?.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async (title: string, description: string) => {
    if (!user || !user.id) {
      toast.error('User not found');
      return false;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, description, is_completed: false, user_id: user.id })
      .select();

    if (!error && data) {
      setTasks((prevTasks) => [...prevTasks, ...data]);
      toast.success('Task added successfully!');
      return true;
    } else {
      toast.error(error?.message || 'Error adding task');
      return false;
    }
  };

  // Update task completion status
  const toggleTaskCompletion = async (task: Task) => {
    console.log('jere')
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !task.is_completed })
      .eq('id', task.id);

    if (!error) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, is_completed: !task.is_completed } : t
        )
      );
      toast.success(`Task marked as ${!task.is_completed ? 'completed' : 'incomplete'}`);
    } else {
      toast.error('Failed to update task status');
    }
  };

  

  return (
    <div className="p-6">

      <AddTaskDialog onAddTask={handleAddTask} />
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Loader className="animate-spin" size={50} />
        </div>
      ) : 
        tasks.length === 0 ? 
            <div className='flex justify-center text-2xl text-custom-green'>No records retrieve!</div>
        :
        (
            <ul className="mt-6 space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white flex shadow-lg rounded-lg items-center justify-between p-4 bg-gray-100 shadow-sm"
              >
                <div className="flex items-center w-full">
                  {/* Switch */}
                  <Switch
                    checked={task.is_completed}
                    onCheckedChange={() => toggleTaskCompletion(task)}
                    className={`${
                      task.is_completed ? 'bg-green-500' : 'bg-gray-300'
                    } relative inline-flex items-center h-6 rounded-full w-11`}
                  >
                    <span className="sr-only">Mark as completed</span>
                    <span
                      className={`${
                        task.is_completed ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition`}
                    />
                  </Switch>
          
                  {/* Title and Details */}
                  <div className="flex-grow pl-4">
                    {editingTask?.id === task.id ? (
                      <div className="flex flex-col space-y-2">
                        <Input
                          className={`p-2 border rounded-lg ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={editingTask.title}
                          onChange={(e) =>
                            setEditingTask({ ...editingTask, title: e.target.value })
                          }
                        />
                         {errors.title && (
                          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                        <Textarea
                          className={`p-2 border rounded-lg ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={editingTask.description}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              description: e.target.value,
                            })
                          }
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveTask(editingTask)}
                            className="px-4 py-2 bg-custom-green text-white rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTask(null)}
                            className="px-4 py-2 bg-gray-300 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2
                          className={`font-semibold ${
                            task.is_completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {task.title}
                        </h2>
                        <p
                          className={`${
                            task.is_completed ? 'line-through text-gray-400' : ''
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    )}
                  </div>
          
                  {/* Buttons */}
                  <div className="flex space-x-2 ml-4">
                    {!editingTask && (
                      <button
                        onClick={() => setEditingTask(task)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
      )}

       {/* Delete Confirmation Modal */}
       {showDeleteModal && (
        <ConfirmationModal
          title="Delete Task"
          isLoading={isLoading}
          open={showDeleteModal}
          setShowModal={() => setShowDeleteModal(false)}
          description="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={deleteTask}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <ConfirmationModal
          title="Save Changes"
          isLoading={isLoading}
          open={showSaveModal}
          setShowModal={() => setShowSaveModal(false)}
          description="Are you sure you want to save changes to this task?"
          onConfirm={editTask}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
};

export default TasksPage;
