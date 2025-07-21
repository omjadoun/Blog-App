import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiFillHome, AiOutlineLogin, AiOutlinePlusSquare } from 'react-icons/ai';
import { MdAppRegistration } from 'react-icons/md';
import { FaRegNewspaper } from 'react-icons/fa';
import { LogoutBtn } from '../index';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', slug: '/', active: true, icon: <AiFillHome size={24} /> },
    { name: 'Login', slug: '/login', active: !authStatus, icon: <AiOutlineLogin size={24} /> },
    { name: 'Signup', slug: '/signup', active: !authStatus, icon: <MdAppRegistration size={24} /> },
    {
      name: 'All Posts',
      slug: '/all-posts',
      active: authStatus,
      match: ['/all-posts', '/post'],
      icon: <FaRegNewspaper size={22} />,
    },
    {
      name: 'Add Post',
      slug: '/add-post',
      active: authStatus,
      match: ['/add-post', '/edit-post'],
      icon: <AiOutlinePlusSquare size={24} />,
    },
  ];

  const handleNavigation = (slug) => {
    navigate(slug);
  };

  return (
    <aside className="fixed top-0 left-0 z-50 flex h-screen w-16 flex-col items-center border-r bg-white py-8 shadow-lg justify-between">
      {/* Top logo/title */}
      <div className="text-blue-600 text-xl font-bold italic">DB</div>

      {/* Middle nav icons */}
      <ul className="flex flex-col items-center gap-8">
        {navItems.map(
          (item) =>
            item.active && (
              <li key={item.name} className="group relative">
                <button
                  onClick={() => handleNavigation(item.slug)}
                  className={`p-2 rounded-lg transition-colors ${
                    item.match?.some((m) => location.pathname.startsWith(m)) ||
                    location.pathname === item.slug
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {item.icon}
                </button>
                <span className="absolute left-14 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap shadow-lg">
                  {item.name}
                </span>
              </li>
            )
        )}
      </ul>

      {/* Bottom logout */}
      {authStatus && (
        <div className="mb-4">
          <LogoutBtn />
        </div>
      )}
    </aside>
  );
}

export default Header;