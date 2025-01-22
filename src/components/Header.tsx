import { FaBars } from 'react-icons/fa'; // Import the hamburger icon (FaBars) from React Icons

const Header = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  return (
    <header className="h-16 flex items-center justify-between p-4 bg-white relative">
      {/* Hamburger Icon for mobile */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Avatar and user name */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <span className="text-gray-800">Welcome, John Doe</span> {/* Username on the left side */}
        <img
          src="https://randomuser.me/api/portraits/men/44.jpg"
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
