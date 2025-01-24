import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faClock, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ConfirmationModal from './Confirmation';
import { SidebarProps } from '@/types';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [active, setActive] = useState("Dashboard");
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
    { name: "Task", icon: <FontAwesomeIcon icon={faClock} />, link: "/dashboard/tasks" },
    { name: "Logout", icon: <FontAwesomeIcon icon={faSignOutAlt} />, action: "logout" },
  ], []);

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.link === pathname);
    if (currentItem) {
      setActive(currentItem.name);
    }
  }, [pathname,menuItems]);

  return (
    <>
      <aside
        className={cn(
          "fixed top-4 left-4 z-50 h-[95vh] bg-white shadow-lg rounded-xl border border-gray-200 overflow-y-auto transition-all duration-300",
          isOpen ? "w-64" : "w-20"
        )}
      >
        <div className="px-6 pt-6">
          <h2 className={`text-green-800 font-semibold ${isOpen ? 'text-sm ' : 'hidden'}`}>Task Management System</h2>
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
                    {isOpen && item.name}
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
                    {isOpen && item.name}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
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
