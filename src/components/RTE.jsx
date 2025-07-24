import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  AiFillHome, 
  AiOutlineLogin, 
  AiOutlinePlusSquare, 
  AiOutlineMenu,
  AiOutlineClose
} from 'react-icons/ai';
import { MdAppRegistration } from 'react-icons/md';
import { FaRegNewspaper } from 'react-icons/fa';
import { LogoutBtn } from '../index';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', slug: '/', active: true, icon: <AiFillHome size={20} /> },
    { name: 'Login', slug: '/login', active: !authStatus, icon: <AiOutlineLogin size={20} /> },
    { name: 'Signup', slug: '/signup', active: !authStatus, icon: <MdAppRegistration size={20} /> },
    {
      name: 'All Posts',
      slug: '/all-posts',
      active: authStatus,
      match: ['/all-posts', '/post'],
      icon: <FaRegNewspaper size={18} />,
    },
    {
      name: 'Add Post',
      slug: '/add-post',
      active: authStatus,
      match: ['/add-post', '/edit-post'],
      icon: <AiOutlinePlusSquare size={20} />,
    },
  ];

  const handleNavigation = (slug) => {
    navigate(slug);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-blue-600 text-xl font-bold italic">DB</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-4">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name} className="group relative">
                    <button
                      onClick={() => handleNavigation(item.slug)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        item.match?.some((m) => location.pathname.startsWith(m)) ||
                        location.pathname === item.slug
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="text-sm">{item.name}</span>
                    </button>
                  </li>
                )
            )}
          </ul>

          {/* Logout - Desktop */}
          {authStatus && (
            <div className="ml-4">
              <LogoutBtn />
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 py-4 px-4 shadow-lg">
            <ul className="flex flex-col gap-2">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                        onClick={() => handleNavigation(item.slug)}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
                          item.match?.some((m) => location.pathname.startsWith(m)) ||
                          location.pathname === item.slug
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </button>
                    </li>
                  )
              )}
              {/* Logout - Mobile */}
              {authStatus && (
                <li>
                  <div className="px-4 py-3">
                    <LogoutBtn className="w-full" />
                  </div>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
