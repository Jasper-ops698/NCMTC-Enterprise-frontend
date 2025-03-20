import React, { useState } from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
  ButtonGroup,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  TextField,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  BookmarkBorder as SaveIcon,
  ShoppingCart as CartIcon,
  Phone as PhoneIcon,
  CreditCard as CardIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { initiateMpesaPayment, checkPaymentStatus } from '../services/PaymentService';
import { sendOrderConfirmation, sendPaymentConfirmation } from '../services/EmailService';

const CheckoutSteps = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

const Cart = () => {
  const {
    items,
    savedItems,
    removeItem,
    updateQuantity,
    getTotal,
    getSubtotal,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    checkoutStep,
    setCheckoutStep,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);

  const formatPrice = (price) => `Ksh ${price.toLocaleString()}`;

  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
    setCheckoutStep(1);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    setCheckoutStep(0);
    setPaymentStatus('pending');
    setPaymentError('');
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep(2);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setPaymentError('');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      if (paymentMethod === 'mpesa') {
        const response = await initiateMpesaPayment(shippingInfo.phone, getTotal());
        
        if (response.success) {
          // Start polling for payment status
          const checkStatus = async () => {
            const statusResponse = await checkPaymentStatus(response.checkoutRequestId);
            
            if (statusResponse.success) {
              if (statusResponse.status === 'COMPLETED') {
                await handlePaymentSuccess();
              } else if (statusResponse.status === 'FAILED') {
                setPaymentError('Payment failed. Please try again.');
                setPaymentStatus('failed');
              } else {
                // Continue polling
                setTimeout(checkStatus, 5000);
              }
            }
          };
          
          checkStatus();
        } else {
          setPaymentError(response.error || 'Payment failed. Please try again.');
          setPaymentStatus('failed');
        }
      } else {
        // Placeholder for card payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        await handlePaymentSuccess();
      }
    } catch (error) {
      setPaymentError('Payment failed. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Send order confirmation email
      await sendOrderConfirmation({
        items,
        total: getTotal(),
        shipping: shippingInfo,
      }, shippingInfo.email);

      // Send payment confirmation email
      await sendPaymentConfirmation({
        amount: getTotal(),
        method: paymentMethod,
        date: new Date().toISOString(),
      }, shippingInfo.email);

      setPaymentStatus('success');
      setCheckoutStep(3);
    } catch (error) {
      console.error('Failed to send confirmation emails:', error);
    }
  };

  const renderCartItems = () => (
    <List>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <ListItem
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => saveForLater(item.id)}
                  color="primary"
                  size="small"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  onClick={() => removeItem(item.id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={item.name}
              secondary={formatPrice(item.price)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 4 }}>
              <ButtonGroup size="small">
                <IconButton
                  onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Button disabled sx={{ px: 2 }}>
                  {item.quantity}
                </Button>
                <IconButton
                  onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </ButtonGroup>
              <Typography>
                {formatPrice(item.price * item.quantity)}
              </Typography>
            </Box>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );

  const renderSavedItems = () => (
    savedItems.length > 0 && (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Saved for Later</Typography>
        <List>
          {savedItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => moveToCart(item.id)}
                      color="primary"
                      size="small"
                    >
                      <CartIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removeSavedItem(item.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={item.name}
                  secondary={formatPrice(item.price)}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    )
  );

  const renderPaymentSection = () => (
    <Box sx={{ mt: 2 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel
            value="mpesa"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                <Typography>M-Pesa</Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="card"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CardIcon color="primary" />
                <Typography>Credit/Debit Card</Typography>
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {paymentError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {paymentError}
        </Alert>
      )}

      {isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <CircularProgress size={20} />
          <Typography>Processing payment...</Typography>
        </Box>
      )}
    </Box>
  );

  const renderCheckoutDialog = () => (
    <Dialog open={checkoutOpen} onClose={handleCloseCheckout} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stepper activeStep={checkoutStep - 1}>
          {CheckoutSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent>
        {checkoutStep === 1 && (
          <form onSubmit={handleShippingSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  required
                  helperText="Format: 07XXXXXXXX"
                />
              </Grid>
            </Grid>
          </form>
        )}
        {checkoutStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography>Subtotal: {formatPrice(getSubtotal())}</Typography>
              <Typography>Shipping: {formatPrice(500)}</Typography>
              <Typography variant="h6">Total: {formatPrice(getTotal())}</Typography>
            </Box>
            {renderPaymentSection()}
          </Box>
        )}
        {checkoutStep === 3 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Order Confirmed!
            </Typography>
            <Typography>
              Thank you for your purchase. Your order has been received and will be processed shortly.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Order confirmation and payment receipt have been sent to your email.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCheckout}>Cancel</Button>
        {checkoutStep === 1 && (
          <Button onClick={handleShippingSubmit} variant="contained" color="primary">
            Continue to Payment
          </Button>
        )}
        {checkoutStep === 2 && (
          <Button
            onClick={handlePayment}
            variant="contained"
            color="primary"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ${formatPrice(getTotal())}`}
          </Button>
        )}
        {checkoutStep === 3 && (
          <Button
            onClick={() => {
              handleCloseCheckout();
              clearCart();
            }}
            variant="contained"
            color="primary"
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const togglePaymentStatus = () => {
    setShowPaymentStatus(!showPaymentStatus);
  };

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <Box sx={{ p: 2, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Shopping Cart</Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Your cart is empty
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Shopping Cart</Typography>
        {items.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        )}
      </Box>

      {items.length > 0 && (
        <>
          {renderCartItems()}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Subtotal: {formatPrice(getSubtotal())}</Typography>
                <Typography variant="subtitle1">Shipping: {formatPrice(500)}</Typography>
                <Typography variant="h6">Total: {formatPrice(getTotal())}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {renderSavedItems()}
      {renderCheckoutDialog()}

      {showPaymentStatus && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Payment Status</Typography>
          <Typography>Status: {paymentStatus}</Typography>
        </Box>
      )}

      <Button
        variant="outlined"
        color="primary"
        onClick={togglePaymentStatus}
        sx={{ mt: 2 }}
      >
        {showPaymentStatus ? 'Hide Payment Status' : 'Show Payment Status'}
      </Button>
    </Box>
  );
};

export default Cart;
