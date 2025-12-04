import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClaims } from '../../../api/claims';
import ClaimsTable from '../../../components/Tables/ClaimsTable';

const OperatorClaims = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await getClaims();
        setClaims(response.data);
      } catch (error) {
        console.error('Error fetching claims:', error);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div>
      <h1>Operator Claims</h1>
      <ClaimsTable claims={claims} basePath="/operator" />
    </div>
  );
};

export default OperatorClaims;

