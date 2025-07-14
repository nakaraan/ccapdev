import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from 'react-icons/io';

export function getSidebarData(role) {
  const baseItems = [
    {
      title: 'Home',
      path: '/Home',
      icon: <AiIcons.AiFillHome />,
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
    }
  ];

  // Add role-specific items
  if (role === 'Admin') {
    return [
      ...baseItems.slice(0, 1), // Home
      {
        title: 'Users',
        path: '/viewusers',
        icon: <FaIcons.FaUsers />,
        cName: 'nav-text'
      },
      {
        title: 'Admin Booking',
        path: '/reserve-admin',
        icon: <FaIcons.FaBook />,
        cName: 'nav-text'
      },
      {
        title: 'Regular Booking',
        path: '/reserve',
        icon: <FaIcons.FaCalendarDay />,
        cName: 'nav-text'
      },
      ...baseItems.slice(1) // Reservations, Profile, Settings
    ];
  } else {
    // Student items
    return [
      ...baseItems.slice(0, 1), // Home
      {
        title: 'Booking',
        path: '/reserve',
        icon: <FaIcons.FaBook />,
        cName: 'nav-text'
      },
      ...baseItems.slice(1) // Reservations, Profile, Settings
    ];
  }
}
