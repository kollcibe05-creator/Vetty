
import { Link, useLocation } from 'react-router-dom';
import React from 'react';

const NavLink = ({ children, className = '', to, ...props }) => {
  const location = useLocation();

  const isActive =
    location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(to + '/'));

  return (
    <Link
      to={to}
      className={`${className} ${
        isActive ? 'text-yellow-300 font-semibold' : ''
      }`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
