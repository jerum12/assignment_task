
'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useEffect, useState } from 'react';

const Header =  () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData).email : 'Guest';
      setUser(user);
    }
  }, []);

  return (
    <header className=" flex items-center justify-between p-4  relative">
      {/* Hamburger Icon for mobile
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
      >
        <FaBars className="w-6 h-6" />
      </button> */}

      {/* Avatar and user name */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <span className="text-gray-800">{user}</span> 
  
        <div className="relative w-full h-full rounded-l-lg">
        <Avatar>
        <AvatarImage src="/assets/avatar.jpg" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
              </div>
      </div>
    </header>
  );
};

export default Header;
