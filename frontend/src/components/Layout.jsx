import React from 'react';
import { Layout } from 'antd';
import Navbar from './Navbar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Navbar />

      <Content
        style={{
          margin: '0',          // remove side margin
          padding: '24px',      // keep internal padding
          background: '#f0f2f5', // optional: light background like AntD
          minHeight: 'calc(100vh - 64px)', // 64px is default Header height
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;
