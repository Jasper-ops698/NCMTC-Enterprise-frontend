import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';

const sampleProducts = [
  {
    id: 1,
    name: 'Premium Laptop',
    image: 'https://source.unsplash.com/800x600/?laptop',
    price: 'Ksh 999',
    description: 'A high-performance laptop for all your needs.',
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    image: 'https://source.unsplash.com/800x600/?headphones',
    price: 'Ksh 199',
    description: 'Experience the best sound quality with these wireless headphones.',
  },
  {
    id: 3,
    name: 'Smart Watch',
    image: 'https://source.unsplash.com/800x600/?smartwatch',
    price: 'Ksh 299',
    description: 'Stay connected and track your fitness with this smart watch.',
  },
  {
    id: 4,
    name: 'Digital Camera',
    image: 'https://source.unsplash.com/800x600/?camera',
    price: 'Ksh 599',
    description: 'Capture stunning photos with this digital camera.',
  },
];

const ProductImage = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
});

const ProductDetails = () => {
  const { productId } = useParams();
  const product = sampleProducts.find((p) => p.id === parseInt(productId));

  if (!product) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Product not found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ProductImage src={product.image} alt={product.name} />
        <Typography variant="h4" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          {product.price}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {product.description}
        </Typography>
      </Box>
    </Container>
  );
};

export default ProductDetails;