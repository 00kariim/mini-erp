import React, { useEffect, useState } from 'react';
import LeadsTable from '../../../components/Tables/LeadsTable';
import { getLeads } from '../../../api/leads';

const SupervisorLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await getLeads();
        setLeads(response.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div>
      <h1>Leads</h1>
      <LeadsTable leads={leads} basePath="/supervisor" loading={loading} />
    </div>
  );
};

export default SupervisorLeads;

