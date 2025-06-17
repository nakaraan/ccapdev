import React, {useState} from 'react';
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from 'react-icons/io';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons'

export default function Navbar() {
  const [sidebar, setSideBar] = useState(false)

  const showSidebar = () => setSideBar(!sidebar)
  return (
    <>
    <IconContext.Provider value={{color: '#fff'}}>
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
        {SidebarData.map((item, index) => {
          return (
            <>
            <div className="item-box">
            <li key={index} className={item.cName}>
              <Link to={item.path}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
            </div>
            </>
          )
        })}
      </ul>
    </nav>
    </IconContext.Provider>
    </>
  );
}