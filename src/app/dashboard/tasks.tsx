'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const TaskCRUD = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) console.error(error);
    else setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    const { data, error } = await supabase.from('tasks').insert([{ title, completed }]);
    if (error) console.error(error);
    else fetchTasks();
  };

  const updateTask = async (id: number, completed: boolean) => {
    const { error } = await supabase.from('tasks').update({ completed }).eq('id', id);
    if (error) console.error(error);
    else fetchTasks();
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) console.error(error);
    else fetchTasks();
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <div className="space-y-4 mb-8">
        <Input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
        <Button onClick={createTask} variant="default">
          Create Task
        </Button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
            <div className="flex items-center">
              <Checkbox
                checked={task.completed}
                onChange={() => updateTask(task.id, !task.completed)}
                className="mr-2"
              />
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
            </div>
            <Button variant="secondary" onClick={() => deleteTask(task.id)} size="sm">
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskCRUD;
