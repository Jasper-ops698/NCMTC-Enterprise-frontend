import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchActivityLogs();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('/api/users');
    setUsers(response.data);
  };

  const fetchActivityLogs = async () => {
    const response = await axios.get('/api/activity-logs');
    setActivityLogs(response.data);
  };

  const fetchProducts = async () => {
    const response = await axios.get('/api/products');
    setProducts(response.data);
  };

  const activityData = {
    labels: activityLogs.map(log => log.activity),
    datasets: [{
      data: activityLogs.map(log => log.count),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.role}</li>
        ))}
      </ul>
      <h2>Activity Logs</h2>
      <Pie data={activityData} />
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;