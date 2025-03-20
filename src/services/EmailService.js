export const sendOrderConfirmation = async (orderDetails, userEmail) => {
  try {
    const response = await fetch('/api/email/order-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderDetails,
        userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send order confirmation');
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const sendPaymentConfirmation = async (paymentDetails, userEmail) => {
  try {
    const response = await fetch('/api/email/payment-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentDetails,
        userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send payment confirmation');
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
