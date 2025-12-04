import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Tag } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { getClient, getClients } from '../../api/clients';
import { getProducts } from '../../api/products';
import { useSelector } from 'react-redux';

const ClientProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [client, setClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        // Get current user's client profile
        const clientsResponse = await getClients();
        const clientProfile = clientsResponse.data?.find(c => c.user_id === user?.id);
        
        if (clientProfile) {
          const response = await getClient(clientProfile.id);
          setClient(response.data);
          
          // Get product details
          if (response.data.products) {
            const allProductsResponse = await getProducts();
            const allProducts = allProductsResponse.data || [];
            
            const productsWithDetails = response.data.products.map(cp => {
              const product = allProducts.find(p => p.id === (cp.product_id || cp.id));
              return product || { name: 'Unknown Product', type: 'N/A', price: null };
            });
            
            setProducts(productsWithDetails);
          }
        }
      } catch (error) {
        console.error('Error fetching client profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchClient();
    }
  }, [user]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!client) {
    return <div>Client profile not found</div>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <Card style={{ marginBottom: 16 }}>
        <Descriptions title="Personal Information" bordered column={1}>
          <Descriptions.Item label={<><UserOutlined /> Name</>}>
            {client.full_name}
          </Descriptions.Item>
          <Descriptions.Item label={<><MailOutlined /> Email</>}>
            {client.email}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="My Products">
        {products.length === 0 ? (
          <p>You don't have any products assigned yet.</p>
        ) : (
          <div>
            {products.map((product, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{product.name}</h3>
                    <Tag color="blue" style={{ marginTop: 4 }}>{product.type}</Tag>
                    {product.price && (
                      <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClientProfile;

