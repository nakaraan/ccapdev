import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from 'react-icons/io';

export function getSidebarData(role) {
  if (role === 'Admin') {
    return [
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
  } else {
    // Student/user sidebar order
    return [
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
      }
    ];
  }
}
