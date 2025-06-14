
import { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import { MenuUnfoldOutlined, MenuOutlined } from '@ant-design/icons';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
// import { Router } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/LogIn';
import Reserve from './pages/Reserve';
import Search from './pages/Search';
import Profile from './pages/Profile';
import FAQs from './pages/FAQs';

const { Header, Sider, Content } = Layout;

// for now lang
const mockUser = {
  username: 'test_user',
  profilePic: 'https://i.pravatar.cc/150?u=test_user'
};

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {colorBgContainer},
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider 
        collapsed={collapsed}
        collapsible 
        trigger={null}
        className='sidebar'> 
          <Logo />
          <MenuList />
        </Sider>

        <Layout>
          <Header style={{padding: 0, background: colorBgContainer}}>
            <Button 
            type="text" 
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuOutlined /> : <MenuUnfoldOutlined />} />
          </Header>

          <Content style={{ margin: '16px', padding: '16px', background: colorBgContainer }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reserve" element={<Reserve />} />
              <Route path="/search" element={<Search user={mockUser} />}  />
              <Route path="/profile" element={<Profile user={{ ...mockUser, role: "user" }} />} />
              <Route path="/faqs" element={<FAQs />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App
