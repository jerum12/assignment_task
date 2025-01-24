import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake, faCalendar, faNetworkWired, faTasks } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabase";
import { Loader } from "react-feather";
import toast from "react-hot-toast";

const DashboardCards = () => {
  const [totalTasks, setTotalTasks] = useState(0); 
  const [completedTasks, setCompletedTasks] = useState(0); 
  const [notCompletedTasks, setNotCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch total tasks from Supabase
  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Fetch total tasks
      const { count: totalCount, error: totalError } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true });

      if (totalError) {
        toast.error(`Error fetching total tasks: ${totalError.message}`);
      } else {
        setTotalTasks(totalCount || 0);
      }

       // Fetch total tasks
       const { count: totalCountComp, error: totalCompError } = await supabase
       .from("tasks")
       .select("*", { count: "exact", head: true })
       .eq("is_completed", true);
       
     if (totalCompError) {
      toast.error(`Error fetching total tasks: ${totalCompError.message}`);
     } else {
      setCompletedTasks(totalCountComp || 0);
     }

      // Fetch not completed tasks
      const { count: notCompletedCount, error: notCompletedError } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("is_completed", false); // Filter for tasks that are not completed

      if (notCompletedError) {
        toast.error(`Error fetching total tasks: ${notCompletedError.message}`);
      } else {
        setNotCompletedTasks(notCompletedCount || 0);
      }
    } catch (error) {
      console.error("Unexpected error fetching tasks:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const cards = [
    {
      icon: faNetworkWired,
      title: "Total Task",
      value: totalTasks,
      bgColor: "bg-blue-500",
    },
    {
      icon: faTasks,
      title: "Total Task Completed",
      value: completedTasks, // Use the fetched total tasks
      bgColor: "bg-pink-500",
    },
    {
      icon: faHandshake,
      title: "Total Task Not Completed",
      value: notCompletedTasks,
      bgColor: "bg-green-500",
    },
    {
      icon: faCalendar,
      title: "Upcoming Meetings",
      value: "10",
      bgColor: "bg-purple-500",
    },
  ];

  return (
      <>
      {loading ?
        <div className="flex justify-center items-center mt-4">
          <Loader className="animate-spin" size={50} />
        </div>  
        :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex items-center bg-white shadow-md rounded-lg p-4"
          >
            {/* Icon Container */}
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full text-white text-xl ${card.bgColor}`}
            >
              <FontAwesomeIcon icon={card.icon} />
            </div>
            {/* Details */}
            <div className="ml-4">
              <p className="text-sm text-gray-500">{card.title}</p>
              <h3 className="text-lg font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
        </div>
      }
     
    </>
  );
};

export default DashboardCards;
