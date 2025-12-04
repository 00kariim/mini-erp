import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  RiseOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roles } = useSelector((state) => state.auth);

  const isAdmin = roles.includes('Admin');
  const isSupervisor = roles.includes('Supervisor');
  const isOperator = roles.includes('Operator');
  const isClient = roles.includes('Client');

  const getMenuItems = () => {
    if (isAdmin) {
      // Admin navbar: 6 pages
      return [
        {
          key: '/admin/dashboard',
          icon: <DashboardOutlined />,
          label: 'Dashboard',
        },
        {
          key: '/admin/users',
          icon: <UserOutlined />,
          label: 'User Management',
        },
        {
          key: '/admin/leads',
          icon: <RiseOutlined />,
          label: 'Leads Management',
        },
        {
          key: '/admin/clients',
          icon: <TeamOutlined />,
          label: 'Clients Management',
        },
        {
          key: '/admin/products',
          icon: <ShoppingOutlined />,
          label: 'Products Management',
        },
        {
          key: '/admin/claims',
          icon: <FileTextOutlined />,
          label: 'Claims Management',
        },
      ];
    }

    if (isSupervisor) {
      // Supervisor navbar: Dashboard, Claims, Leads, Products
      return [
        {
          key: '/supervisor/dashboard',
          icon: <DashboardOutlined />,
          label: 'Dashboard',
        },
        {
          key: '/supervisor/claims',
          icon: <FileTextOutlined />,
          label: 'Claims Management',
        },
        {
          key: '/supervisor/leads',
          icon: <RiseOutlined />,
          label: 'Leads Management',
        },
        {
          key: '/supervisor/products',
          icon: <ShoppingOutlined />,
          label: 'Products',
        },
      ];
    }

    if (isOperator) {
      // Operator navbar: Leads, Clients, Claims
      return [
        {
          key: '/operator/leads',
          icon: <RiseOutlined />,
          label: 'Leads Management',
        },
        {
          key: '/operator/clients',
          icon: <TeamOutlined />,
          label: 'Clients Management',
        },
        {
          key: '/operator/claims',
          icon: <FileTextOutlined />,
          label: 'Claims Management',
        },
      ];
    }

    if (isClient) {
      // Client navbar: Profile, Claims, Products
      return [
        {
          key: '/client/profile',
          icon: <UserOutlined />,
          label: 'Profile',
        },
        {
          key: '/client/claims',
          icon: <FileTextOutlined />,
          label: 'Claims',
        },
        {
          key: '/client/products',
          icon: <ShoppingOutlined />,
          label: 'Products',
        },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const selectedKeys = [location.pathname];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={selectedKeys}
      items={menuItems}
      onClick={handleMenuClick}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
};

export default Sidebar;

