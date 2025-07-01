import { Menu } from 'antd';
import {
  HomeOutlined,
  LoginOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  BarsOutlined,
  RightOutlined,
} from '@ant-design/icons';

const MenuList = ({ onNavigate }) => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      className="menu-bar"
      onClick={({ key }) => {
        // Route based on the key
        switch (key) {
          case 'home':
            onNavigate('/');
            break;
          case 'login':
            onNavigate('/login');
            break;
          case 'search':
            onNavigate('/search');
            break;
          case 'reserve':
            onNavigate('/reserve');
            break;
          case 'edit':
            onNavigate('/edit');
            break;
          case 'delete':
            onNavigate('/delete');
            break;
          default:
            break;
        }
      }}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        Home
      </Menu.Item>
      <Menu.Item key="login" icon={<LoginOutlined />}>
        Log In
      </Menu.Item>
      <Menu.Item key="search" icon={<SearchOutlined />}>
        View Users
      </Menu.Item>
      <Menu.SubMenu key="reservations" icon={<PlusCircleOutlined />} title="Reservations">
        <Menu.SubMenu key="manage" icon={<BarsOutlined />} title="Manage">
          <Menu.Item key="reserve" icon={<RightOutlined />}>
            Reserve
          </Menu.Item>
          <Menu.Item key="edit" icon={<RightOutlined />}>
            Edit
          </Menu.Item>
          <Menu.Item key="delete" icon={<RightOutlined />}>
            Delete
          </Menu.Item>
        </Menu.SubMenu>
      </Menu.SubMenu>
    </Menu>
  );
};

export default MenuList;
