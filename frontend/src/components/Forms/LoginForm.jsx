import React, { useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token, roles } = useSelector((state) => state.auth);

  const onFinish = (values) => {
    dispatch(login(values));
  };

  // Redirect when login succeeds
  useEffect(() => {
    if (token && roles.length > 0) {
      // Choose first role as main navigation
      const role = roles[0];

      const roleRedirects = {
        Admin: '/admin/dashboard',
        Supervisor: '/supervisor/dashboard',
        Operator: '/operator/dashboard',
        Client: '/client/dashboard',
      };

      navigate(roleRedirects[role] || '/login');
    }
  }, [token, roles, navigate]);

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={status === 'loading'}>
          Log in
        </Button>
      </Form.Item>

      {error && <Alert message={error} type="error" />}
    </Form>
  );
};

export default LoginForm;
