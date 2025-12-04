import React from 'react';
import { List, Avatar, Typography, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CommentsList = ({ comments, loading = false }) => {
  if (!comments || comments.length === 0) {
    return <div>No comments yet.</div>;
  }

  return (
    <List
      loading={loading}
      itemLayout="horizontal"
      dataSource={comments}
      renderItem={(comment) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={
              <Space>
                <Text strong>
                  {comment.username || `User #${comment.user_id}`}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {new Date(comment.created_at).toLocaleString()}
                </Text>
              </Space>
            }
            description={comment.comment}
          />
        </List.Item>
      )}
    />
  );
};

export default CommentsList;

