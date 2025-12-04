import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import LeadsTable from '../../components/Tables/LeadsTable';
import { getLeads } from '../../api/leads';
import { useSelector } from 'react-redux';

const OperatorLeads = () => {
  const { user } = useSelector((state) => state.auth);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeads();
      // Filter leads assigned to current operator
      const myLeads = response.data?.filter(
        lead => lead.assigned_operator_id === user?.id
      ) || [];
      setLeads(myLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>My Leads</h1>
      <LeadsTable
        leads={leads}
        basePath="/operator"
        loading={loading}
      />
    </div>
  );
};

export default OperatorLeads;

