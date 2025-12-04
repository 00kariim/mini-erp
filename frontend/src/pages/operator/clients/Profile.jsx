import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClient, addClientComment } from '../../../api/clients';
import { getClientClaims } from '../../../api/clients';

const OperatorClientProfile = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [claims, setClaims] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, claimsRes] = await Promise.all([
          getClient(id),
          getClientClaims(id)
        ]);
        setClient(clientRes.data);
        setClaims(claimsRes.data);
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
      const clientRes = await getClient(id);
      setClient(clientRes.data);
    } catch (error) {
      console.error('Error adding comment:', error);
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
        <h2>Claims</h2>
        <ul>
          {claims.map((claim) => (
            <li key={claim.id}>
              <a href={`/operator/claims/${claim.id}`}>Claim #{claim.id} - {claim.status}</a>
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

export default OperatorClientProfile;

