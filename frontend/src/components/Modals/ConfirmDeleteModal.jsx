import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ConfirmDeleteModal = ({ visible, onCancel, onConfirm, title, content, loading }) => {
  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          {title || 'Confirm Delete'}
        </span>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          loading={loading}
          onClick={onConfirm}
        >
          Delete
        </Button>,
      ]}
    >
      <p>{content || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>
    </Modal>
  );
};

export default ConfirmDeleteModal;

