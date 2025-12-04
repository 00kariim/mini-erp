import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import ProductsTable from '../../../components/Tables/ProductsTable';
import { getProducts } from '../../../api/products';

const SupervisorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <ProductsTable
        products={products}
        loading={loading}
      />
    </div>
  );
};

export default SupervisorProducts;

