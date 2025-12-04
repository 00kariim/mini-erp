import React from 'react';
import { Table, Tag, Button } from 'antd';

const ProductsTable = ({ products, onDelete, onEdit, onAssign, loading = false }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) =>
        price ? `$${parseFloat(price).toFixed(2)}` : 'N/A',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {onEdit && (
            <Button
              type="link"
              size="small"
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          )}

          {onAssign && (
            <Button
              type="link"
              size="small"
              onClick={() => onAssign(record.id)}
            >
              Assign
            </Button>
          )}

          {onDelete && (
            <Button
              type="link"
              danger
              size="small"
              onClick={() => onDelete(record.id)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey="id"
      loading={loading}
    />
  );
};

export default ProductsTable;
