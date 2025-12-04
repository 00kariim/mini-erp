import React, { useEffect } from 'react';
import { Card, List, Tag, Spin } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientByUserId } from '../../redux/slices/clientsSlice';
import { fetchClientProducts } from '../../redux/slices/clientsSlice';

const ClientProducts = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    currentClient,
    currentClientProducts,
    status
  } = useSelector((state) => state.clients);
  const { items: allProducts, status: productStatus } = useSelector((state) => state.products);

  // Load client profile based on user_id
  useEffect(() => {
    if (user?.id && !currentClient) {
      dispatch(fetchClientByUserId(user.id));
    }
  }, [dispatch, user, currentClient]);

  // Load product catalog
  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchClientProducts(user.client_id));
    }
  }, [productStatus, dispatch]);


  if (status === 'loading' || productStatus === 'loading' || !currentClient) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  // map assigned products to product details
  const productsWithDetails = currentClientProducts.map((cp) => {
    const product = allProducts.find((p) => p.id === cp.product_id);

    return {
      ...cp,
      product: product || { name: "Unknown Product", type: "N/A", price: null },
    };
  });

  return (
    <div>
      <h1>My Products</h1>

      {productsWithDetails.length === 0 ? (
        <Card>
          <p>You don't have any products assigned yet.</p>
        </Card>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={productsWithDetails}
          renderItem={(item) => (
            <List.Item>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3>{item.product.name}</h3>
                    <Tag color="blue">{item.product.type}</Tag>

                    {item.product.price && (
                      <span style={{ marginLeft: 8 }}>
                        ${parseFloat(item.product.price).toFixed(2)}
                      </span>
                    )}

                    <p style={{ marginTop: 8, color: "#666" }}>
                      Assigned: {new Date(item.assigned_at).toLocaleDateString()}
                    </p>
                  </div>

                  <ShoppingOutlined
                    style={{ fontSize: "32px", color: "#1890ff" }}
                  />
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ClientProducts;