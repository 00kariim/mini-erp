import React, { useEffect, useState } from 'react';
import ClientsTable from '../../../components/Tables/ClientsTable';
import { getClients, getClient } from '../../../api/clients';
import { getProducts } from '../../../api/products';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsRes, productsRes] = await Promise.all([
        getClients(),
        getProducts()
      ]);
      
      // Fetch full client data with products
      const clientsWithProducts = await Promise.all(
        clientsRes.data.map(async (client) => {
          try {
            const clientDetail = await getClient(client.id);
            return clientDetail.data;
          } catch (err) {
            return client;
          }
        })
      );
      
      setClients(clientsWithProducts);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Clients</h1>
      <ClientsTable 
        clients={clients} 
        basePath="/admin" 
        loading={loading}
        products={products}
      />
    </div>
  );
};

export default AdminClients;

