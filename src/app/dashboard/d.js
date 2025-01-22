// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { TaskCard } from '@/components/TaskCard';

// const Dashboard = () => {
//   const [tasks, setTasks] = useState<any[]>([]);

//   const fetchTasks = async () => {
//     // Get the session to access the user
//     const { data: { session } } = await supabase.auth.getSession();
//     const userId = session?.user?.id;  // Access user ID from session

//     if (userId) {
//       const { data, error } = await supabase
//         .from('tasks')
//         .select('*')
//         .eq('user_id', userId);

//       if (error) {
//         alert(error.message);
//       } else {
//         setTasks(data);
//       }
//     } else {
//       // Handle the case where user is not authenticated
//       alert('User not authenticated');
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   return (
//     <div>
//       <h1>Your Tasks</h1>
//       <button onClick={() => window.location.href = '/dashboard/tasks'}>Add New Task</button>
//       <div>
//         {tasks.map((task) => (
//           <TaskCard key={task.id} task={task} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
