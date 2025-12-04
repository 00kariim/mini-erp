import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Button } from 'antd';
import { getClaims } from '../../../api/claims';
import ClaimsTable from '../../../components/Tables/ClaimsTable';

const ClientClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const response = await getClaims();
        setClaims(response.data);
      } catch (error) {
        console.error('Error fetching claims:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div>
      <h1>My Claims</h1>
      <ClaimsTable claims={claims} loading={loading} />
    </div>
  );
};

export default ClientClaims;

