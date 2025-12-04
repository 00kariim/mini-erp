import React, { useEffect, useState } from 'react';
import ClaimsTable from '../../../components/Tables/ClaimsTable';
import { getClaims } from '../../../api/claims';

const Claims = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      const response = await getClaims();
      setClaims(response.data);
    };
    fetchClaims();
  }, []);

  return (
    <div>
      <h1>Claims</h1>
      <ClaimsTable claims={claims} basePath="/admin" />
    </div>
  );
};

export default Claims;
