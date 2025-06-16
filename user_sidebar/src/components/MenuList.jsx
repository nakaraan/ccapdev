import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, LoginOutlined, PlusCircleOutlined, SearchOutlined, UserOutlined, QuestionOutlined } from '@ant-design/icons';

const MenuList = () => {
  return (
    <Menu theme='dark' mode='inline' className='menu-bar'>
        <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="">Home</Link>
        </Menu.Item>
        <Menu.Item key="log in" icon={<LoginOutlined />}>
            <Link to="/login">Log In</Link>
        </Menu.Item>
        <Menu.Item key="reserve" icon={<PlusCircleOutlined />}>
            <Link to="/reserve">Reserve</Link>
        </Menu.Item>
        <Menu.Item key="search" icon={<SearchOutlined />}>
            <Link to="/search">Search</Link>
        </Menu.Item>
        <Menu.Item key="profile" icon={<UserOutlined />}>
           <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="faqs" icon={<QuestionOutlined />}>
            <Link to="/faqs">FAQs</Link>
        </Menu.Item>
    </Menu>
  )
}

export default MenuList
