import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Space, Dropdown, Avatar } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  RiseOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { logout } from '../redux/slices/authSlice';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, roles } = useSelector((state) => state.auth);

  const isAdmin = roles.includes('Admin');
  const isSupervisor = roles.includes('Supervisor');
  const isOperator = roles.includes('Operator');
  const isClient = roles.includes('Client');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => {
        if (isAdmin) navigate('/admin/users');
        else if (isClient) navigate('/client/profile');
        else navigate('/');
      },
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/admin/users', icon: <UserOutlined />, label: 'User Management' },
        { key: '/admin/leads', icon: <RiseOutlined />, label: 'Leads Management' },
        { key: '/admin/clients', icon: <TeamOutlined />, label: 'Clients Management' },
        { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Products Management' },
        { key: '/admin/claims', icon: <FileTextOutlined />, label: 'Claims Management' },
      ];
    }
    if (isSupervisor) {
      return [
        { key: '/supervisor/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/supervisor/claims', icon: <FileTextOutlined />, label: 'Claims' },
        { key: '/supervisor/leads', icon: <RiseOutlined />, label: 'Leads' },
        { key: '/supervisor/products', icon: <ShoppingOutlined />, label: 'Products' },
      ];
    }
    if (isOperator) {
      return [
        { key: '/operator/leads', icon: <RiseOutlined />, label: 'Leads' },
        { key: '/operator/clients', icon: <TeamOutlined />, label: 'Clients' },
        { key: '/operator/claims', icon: <FileTextOutlined />, label: 'Claims' },
      ];
    }
    if (isClient) {
      return [
        { key: '/client/profile', icon: <UserOutlined />, label: 'Profile' },
        { key: '/client/claims', icon: <FileTextOutlined />, label: 'Claims' },
        { key: '/client/products', icon: <ShoppingOutlined />, label: 'Products' },
      ];
    }
    return [];
  };

  // ensure navItems is always an array, even if roles haven't loaded yet
  const navItems = roles.length > 0 ? getNavItems() : [];

  const handleMenuClick = ({ key }) => navigate(key);

  const selectedKeys = navItems
    .map((item) => item.key)
    .filter((key) => location.pathname.startsWith(key))
    .slice(0, 1);

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo / Title */}
      <div
        style={{ fontSize: 18,margin: 10, fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => {
          if (isAdmin) navigate('/admin/dashboard');
          else if (isSupervisor) navigate('/supervisor/dashboard');
          else if (isOperator) navigate('/operator/dashboard');
          else if (isClient) navigate('/client/dashboard');
          else navigate('/');
        }}
      >
        ERP System
      </div>

      {/* Main Menu */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {navItems.length > 0 && (
          <Menu
            mode="horizontal"
            items={navItems}
            onClick={handleMenuClick}
            selectedKeys={selectedKeys}
            style={{
              borderBottom: 'none',
              minWidth: '400px', 
              flex: 1,
            }}
          />
        )}
      </div>

      {/* User Avatar / Dropdown */}
      <Space>
        {user && (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user.username || user.email}</span>
            </Space>
          </Dropdown>
        )}
      </Space>
    </Header>

  );
};

export default Navbar;
