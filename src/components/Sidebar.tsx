import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faClock, faSignOutAlt, faPeopleGroup, faBars } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ConfirmationModal from './Confirmation';
import { SidebarProps } from '@/types';

export default function Sidebar({ isOpen }: SidebarProps) {
  const [active, setActive] = useState("Dashboard");
  const [isSidebarVisible, setSidebarVisible] = useState(false); // Mobile sidebar state
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    setLoading(false);
    router.push('/auth/login');
  };

  const menuItems = useMemo(() => [
    { name: "Dashboard", icon: <FontAwesomeIcon icon={faHome} />, link: "/dashboard" },
    { name: "Employee", icon: <FontAwesomeIcon icon={faPeopleGroup} />, link: "/dashboard/employees" },
    { name: "Task", icon: <FontAwesomeIcon icon={faClock} />, link: "/dashboard/tasks" },
    { name: "Logout", icon: <FontAwesomeIcon icon={faSignOutAlt} />, link:"", action: "logout" },
  ], []);

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.link === pathname);
    if (currentItem) {
      setActive(currentItem.name);
    }
  }, [pathname, menuItems]);

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-green-700 text-white rounded-md lg:hidden"
        onClick={() => setSidebarVisible(!isSidebarVisible)}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Sidebar */}
      <aside
  className={cn(
    "fixed top-4 left-0 z-40 h-[95vh] bg-white shadow-lg rounded-r-xl border border-gray-200 transition-transform duration-300 lg:translate-x-0",
    isSidebarVisible ? "translate-x-0" : "-translate-x-full", // Mobile sidebar toggle
    "lg:w-64 lg:block lg:translate-x-0"
  )}
>
  
  {/* Use flex and justify-between to position menu items and logout */}
  <div className="flex flex-col h-full">
  <div className="px-6 pt-6">
    <h2 className={`text-green-800 font-semibold ${isOpen ? "text-sm" : "hidden"}`}>
      Task Management System
    </h2>
  </div>
    {/* Menu items */}
    <nav className="flex-1 mt-2">
      <ul className="space-y-2 p-5">
        {menuItems.map((item) =>
          item.action !== "logout" ? (
            <li key={item.name}>
              <Link
                href={item.link}
                className={cn(
                  "flex items-center p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md",
                  active === item.name && "bg-green-100 text-green-700"
                )}
                onClick={() => {
                  setActive(item.name);
                  setSidebarVisible(false); // Close sidebar after menu click (mobile)
                }}
              >
                <span className="mr-3 text-custom-green">{item.icon}</span>
                {isOpen && item.name}
              </Link>
            </li>
          ) : null
        )}
      </ul>
    </nav>
    
    {/* Logout button at the bottom */}
    <div className="py-1 px-5 border-t border-gray-200">
      <button
        className="flex items-center w-full p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
        onClick={() => {
          handleLogout();
          setSidebarVisible(false); // Close sidebar after logout click (mobile)
        }}
      >
        <span className="mr-3 text-custom-green">{menuItems.find((item) => item.action === "logout")?.icon}</span>
        {isOpen && "Logout"}
      </button>
   </div>
  </div>
</aside>

      {showLogoutModal && (
        <ConfirmationModal
          title="Logout"
          isLoading={loading}
          open={showLogoutModal}
          setShowModal={() => setShowLogoutModal(false)}
          description="Are you sure you want to logout?"
          onConfirm={logout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
