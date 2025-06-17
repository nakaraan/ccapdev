import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MenuUnfoldOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import { theme } from 'antd';

import Home from './pages/Home';
import Login from './pages/Login';
import ViewUsers from './pages/ViewUsers';
import Reserve from './pages/Reserve';
import Edit from './pages/Edit';
import Delete from './pages/Delete';
import UserProfile from './pages/UserProfile';

const { Header, Sider, Content } = Layout;
function App() { 
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer }, 
  } = theme.useToken();

  const navigate = useNavigate();

  return (
      <Layout>
        <Sider 
          collapsed={collapsed}
          collapsible 
          trigger={null}
          className='sidebar'
        > 
          <Logo />
          <MenuList onNavigate={(path) => navigate(path)} />
        </Sider>

        <Layout>
          <Header style ={{padding: 0, background: colorBgContainer}}>
            <Button 
              type="text" 
              className="toggle"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuOutlined /> : <MenuUnfoldOutlined />} 
            />
          </Header>

          <Content style={{ margin: '16px', padding: '16px', background: '#fff' }}>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<ViewUsers />} />
              <Route path="/reserve" element={<Reserve />} />
              <Route path="/edit" element={<Edit />} />
              <Route path="/delete" element={<Delete />} />
              <Route path="/users/:userId" element={<UserProfile />} />
          </Routes>
        </Content>

        </Layout>
      </Layout>
  );
}

export default App;
