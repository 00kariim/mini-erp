import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClient, assignProductToClient } from '../../../api/clients';
import { getProducts } from '../../../api/products';

const AdminClientProducts = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [products, setProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, allProductsRes] = await Promise.all([
          getClient(id),
          getProducts()
        ]);
        setClient(clientRes.data);
        setProducts(clientRes.data.products || []);
        setAvailableProducts(allProductsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleAssignProduct = async (e) => {
    e.preventDefault();
    try {
      await assignProductToClient(id, { client_id: parseInt(id, 10), product_id: parseInt(selectedProduct, 10) });
      setSelectedProduct('');
      // Refresh products
      const clientRes = await getClient(id);
      setProducts(clientRes.data.products || []);
    } catch (error) {
      console.error('Error assigning product:', error);
    }
  };

  if (!client) return <div>Loading...</div>;

  return (
    <div>
      <h1>Client Products: {client.full_name}</h1>
      
      <div>
        <h2>Assigned Products</h2>
        <ul>
          {products.map((cp) => (
            <li key={cp.id}>
              Product ID: {cp.product_id} - Assigned: {new Date(cp.assigned_at).toLocaleDateString()}
            </li>
          ))}
        </ul>
        
        <form onSubmit={handleAssignProduct}>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">Select Product</option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          <button type="submit">Assign Product</button>
        </form>
      </div>
    </div>
  );
};

export default AdminClientProducts;

