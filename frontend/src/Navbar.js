import React, {useState} from 'react';
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { getSidebarData } from './SidebarData';

import './Navbar.css';
import { IconContext } from 'react-icons'
import { useUser } from './pages/UserContext';

export default function Navbar() {
  const [sidebar, setSideBar] = useState(false);
  const { user } = useUser();
  const role = user?.user_role || 'Student';
  const sidebarData = getSidebarData(role);

  const showSidebar = () => setSideBar(!sidebar);
  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className="navbar">
          <div className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </div>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {sidebarData.map((item, index) => {
              return (
                <div className="item-box" key={index}>
                  <li className={item.cName}>
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                </div>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}