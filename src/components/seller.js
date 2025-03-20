import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Modal, Typography } from '@mui/material';

const SellerDashboard = () => {
  const [profile, setProfile] = useState({ name: '', email: '', contact: '' });
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchProducts();
    fetchMessages();
    fetchRatings();
  }, []);

  const fetchProfile = async () => {
    const response = await axios.get('/api/seller/profile'); // Adjust endpoint as necessary
    setProfile(response.data);
  };

  const fetchProducts = async () => {
    const response = await axios.get('/api/products');
    setProducts(response.data);
  };

  const fetchMessages = async () => {
    const response = await axios.get('/api/messages'); // Adjust endpoint as necessary
    setMessages(response.data);
  };

  const fetchRatings = async () => {
    const response = await axios.get('/api/ratings'); // Adjust endpoint as necessary
    setRatings(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put('/api/seller/profile', profile); // Adjust endpoint as necessary
    setOpenModal(false);
  };

  const handleAddEditProduct = async (e) => {
    e.preventDefault();
    if (selectedProduct) {
      await axios.put(`/api/products/${selectedProduct.id}`, selectedProduct);
    } else {
      await axios.post('/api/products', selectedProduct);
    }
    setOpenProductModal(false);
    fetchProducts();
  };

  const handleDeleteProduct = async (productId) => {
    await axios.delete(`/api/products/${productId}`);
    fetchProducts();
  };

  const handleOpenProductModal = (product = null) => {
    setSelectedProduct(product);
    setOpenProductModal(true);
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    await axios.post(`/api/messages/${selectedMessage.id}/reply`, { reply }); // Adjust endpoint as necessary
    setOpenMessageModal(false);
    fetchMessages();
  };

  const handleOpenMessageModal = (message) => {
    setSelectedMessage(message);
    setOpenMessageModal(true);
  };

  return (
    <div>
      <h1>Seller Dashboard</h1>
      <Button variant="outlined" onClick={() => setOpenModal(true)}>Edit Profile</Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={{ padding: '20px' }}>
          <Typography variant="h6">Edit Profile</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Name"
              value={profile.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={profile.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="contact"
              label="Contact"
              value={profile.contact}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">Save</Button>
          </form>
        </div>
      </Modal>
      <Button variant="outlined" onClick={() => handleOpenProductModal()}>Add Product</Button>
      <Modal open={openProductModal} onClose={() => setOpenProductModal(false)}>
        <div style={{ padding: '20px' }}>
          <Typography variant="h6">{selectedProduct ? 'Edit Product' : 'Add Product'}</Typography>
          <form onSubmit={handleAddEditProduct}>
            <TextField
              name="name"
              label="Product Name"
              value={selectedProduct ? selectedProduct.name : ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              name="price"
              label="Price"
              value={selectedProduct ? selectedProduct.price : ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">{selectedProduct ? 'Update' : 'Add'}</Button>
          </form>
        </div>
      </Modal>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <Button onClick={() => handleOpenProductModal(product)}>Edit</Button>
            <Button onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
          </li>
        ))}
      </ul>
      <h2>Ratings</h2>
      <ul>
        {ratings.map(rating => (
          <li key={rating.id}>
            Product: {rating.productName} - Rating: {rating.value}
          </li>
        ))}
      </ul>
      <h2>Messages</h2>
      <ul>
        {messages.map(message => (
          <li key={message.id}>
            {message.content}
            <Button onClick={() => handleOpenMessageModal(message)}>Reply</Button>
          </li>
        ))}
      </ul>
      <Modal open={openMessageModal} onClose={() => setOpenMessageModal(false)}>
        <div style={{ padding: '20px' }}>
          <Typography variant="h6">Reply to Message</Typography>
          <form onSubmit={handleSendReply}>
            <TextField
              label="Your Reply"
              value={reply}
              onChange={handleReplyChange}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">Send Reply</Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SellerDashboard;