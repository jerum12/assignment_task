import { Button } from "./ui/button";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`fixed inset-0 top-0 left-0 bg-custom-green z-10 transition-all transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:block md:w-64 md:h-full`}
    >
      {/* Logo at the top of the sidebar */}
      <div className="flex items-center justify-center p-2 bg-custom-green">
        <img
          src={'/assets/login.jpg'}
          alt="Logo"
          className="w-16 h-16 object-contain"
        />
      </div>


      {/* Sidebar Links */}
      <aside className="w-64 bg-custom-green text-white p-6">
        
        <nav>
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded hover:bg-green-500"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded hover:bg-green-500"
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded hover:bg-green-500"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-4 rounded hover:bg-green-500"
             
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};


export default Sidebar;