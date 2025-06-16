import { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import { MenuUnfoldOutlined, MenuOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Logo from './components/Logo';
import MenuList from './components/MenuList';

import Home from './pages/Home';
import Login from './pages/LogIn';
import Reserve from './pages/Reserve';
import Search from './pages/Search';
import Profile from './pages/Profile';
import FAQs from './pages/FAQs';

const { Header, Sider, Content } = Layout;

// Mock user for now (student view only)
const mockUser = {
  username: 'user',
  role: 'student',
  profilePic: './profile.png'
};

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider 
          collapsed={collapsed}
          collapsible 
          trigger={null}
          className='sidebar'
        > 
          <Logo />
          <MenuList />
        </Sider>

        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button 
              type="text" 
              className="toggle"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuOutlined /> : <MenuUnfoldOutlined />} 
            />
          </Header>

          <Content style={{ margin: '16px', padding: '16px', background: colorBgContainer }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reserve" element={<Reserve />} />
              <Route path="/search" element={<Search user={mockUser} />} />
              <Route path="/profile" element={<Profile user={mockUser} />} />
              <Route path="/faqs" element={<FAQs />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
