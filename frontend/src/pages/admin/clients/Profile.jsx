import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClient, getClientClaims, addClientComment, assignProductToClient } from '../../../api/clients';
import { getProducts } from '../../../api/products';

const AdminClientProfile = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [claims, setClaims] = useState([]);
  const [products, setProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [comment, setComment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, claimsRes, productsRes, allProductsRes] = await Promise.all([
          getClient(id),
          getClientClaims(id),
          getClient(id).then(res => res.data.products || []),
          getProducts()
        ]);
        setClient(clientRes.data);
        setClaims(claimsRes.data);
        setProducts(productsRes);
        setAvailableProducts(allProductsRes.data);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await addClientComment(id, { comment });
      setComment('');
      // Refresh client data
      const clientRes = await getClient(id);
      setClient(clientRes.data);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

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
      <h1>Client Profile: {client.full_name}</h1>
      
      <div>
        <h2>Client Information</h2>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone}</p>
        <p><strong>Address:</strong> {client.address}</p>
      </div>

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

      <div>
        <h2>Claims</h2>
        <ul>
          {claims.map((claim) => (
            <li key={claim.id}>
              <a href={`/admin/claims/${claim.id}`}>Claim #{claim.id} - {claim.status}</a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Comments</h2>
        <ul>
          {client.comments?.map((comment) => (
            <li key={comment.id}>
              <p>{comment.comment}</p>
              <small>By User ID: {comment.user_id} - {new Date(comment.created_at).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
        
        <form onSubmit={handleAddComment}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
          />
          <button type="submit">Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default AdminClientProfile;

