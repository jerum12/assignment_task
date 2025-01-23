// components/Sidebar.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Use this for current path
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faClock, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL path

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Log out from Supabase
    localStorage.removeItem('user'); // Remove user data from localStorage
    router.push('/login'); // Redirect to login page
  };

  const menuItems = [
    { name: "Dashboard", icon: <FontAwesomeIcon icon={faHome} />, link: "/dashboard" },
    { name: "Task", icon: <FontAwesomeIcon icon={faClock} />, link: "/dashboard/tasks" },
    { name: "Logout", icon: <FontAwesomeIcon icon={faSignOutAlt} />, action: "logout" },
  ];

  // Set active menu item based on the current URL path
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.link === pathname);
    if (currentItem) {
      setActive(currentItem.name);
    }
  }, [pathname]);

  return (
    <aside
      className="fixed top-4 left-4 z-50 w-64 h-[95vh] bg-white shadow-lg rounded-xl border border-gray-200 overflow-y-auto"
    >
      <div className="px-6 pt-6">
        <h2 className="text-sm text-green-800 font-semibold">Task Management System</h2>
      </div>
      <nav className="mt-2">
        <ul className="space-y-2 p-5">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.link ? (
                <Link
                  href={item.link}
                  className={cn(
                    "flex items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md",
                    active === item.name && "bg-green-100 text-green-700"
                  )}
                  onClick={() => setActive(item.name)}
                >
                  <span className="mr-3 text-custom-green">{item.icon}</span>
                  {item.name}
                </Link>
              ) : item.action === "logout" ? (
                <button
                  className={cn(
                    "flex items-center w-full p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md",
                    active === item.name && "bg-green-100 text-green-700"
                  )}
                  onClick={handleLogout}
                >
                  <span className="mr-3 text-custom-green">{item.icon}</span>
                  {item.name}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
