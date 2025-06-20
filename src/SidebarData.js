import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/Home',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Users',
    path: '/viewusers',
    icon: <FaIcons.FaUsers />,
    cName: 'nav-text'
  },
  {
    title: 'Booking',
    path: '/reserve',
    icon: <FaIcons.FaBook />,
    cName: 'nav-text'
  },
  {
    title: 'Reservations',
    path: '/reservations',
    icon: <FaIcons.FaCalendarAlt />,
    cName: 'nav-text'
  },
  {
    title: 'Profile',
    path: '/userprofile',
    icon: <FaIcons.FaUser />,
    cName: 'nav-text'
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <IoIcons.IoIosSettings />,
    cName: 'nav-text'
  },
  
]