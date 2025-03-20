import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Sample products - replace with actual data from your backend
const sampleProducts = [
  {
    id: 1,
    name: 'Premium Laptop',
    image: 'https://source.unsplash.com/800x600/?laptop',
    price: 'Ksh 999',
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    image: 'https://source.unsplash.com/800x600/?headphones',
    price: 'Ksh 199',
  },
  {
    id: 3,
    name: 'Smart Watch',
    image: 'https://source.unsplash.com/800x600/?smartwatch',
    price: 'Ksh 299',
  },
  {
    id: 4,
    name: 'Digital Camera',
    image: 'https://source.unsplash.com/800x600/?camera',
    price: 'Ksh 599',
  },
];

const ProductCard = styled(motion.div)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: '20px',
  overflow: 'hidden',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[10],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[20],
  },
}));

const ProductImage = styled('img')({
  width: '100%',
  height: '70%',
  objectFit: 'cover',
});

const ProductInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
};

const Home = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            NCMTC Entrepreneurship Centre
          </Typography>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Discover Amazing Products
          </Typography>
        </motion.div>
      </Box>

      <Box sx={{ maxWidth: '1200px', margin: '0 auto', px: 2 }}>
        <Slider {...sliderSettings}>
          {sampleProducts.map((product, index) => (
            <Box key={product.id} sx={{ px: 1 }}>
              <ProductCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                onClick={() => handleProductClick(product.id)}
              >
                <ProductImage src={product.image} alt={product.name} />
                <ProductInfo>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {product.price}
                  </Typography>
                </ProductInfo>
              </ProductCard>
            </Box>
          ))}
        </Slider>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography variant="h4" gutterBottom>
            Featured Products
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Click on any product to view details
          </Typography>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Home;
