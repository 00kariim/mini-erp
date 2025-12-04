import React, { useEffect, useState } from 'react';
import ClientsTable from '../../components/Tables/ClientsTable';
import { getClients } from '../../api/clients';

const SupervisorClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Clients</h1>
      <ClientsTable clients={clients} basePath="/supervisor" loading={loading} />
    </div>
  );
};

export default SupervisorClients;

