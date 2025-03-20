// M-Pesa API integration
export const initiateMpesaPayment = async (phoneNumber, amount) => {
  try {
    // This would be your actual M-Pesa API endpoint
    const response = await fetch('/api/mpesa/stkpush', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber.replace(/^0/, '254'), // Convert to international format
        amount: amount,
      }),
    });

    if (!response.ok) {
      throw new Error('Payment initiation failed');
    }

    const data = await response.json();
    return {
      success: true,
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID,
    };
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const checkPaymentStatus = async (checkoutRequestId) => {
  try {
    const response = await fetch('/api/mpesa/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkoutRequestId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const data = await response.json();
    return {
      success: true,
      status: data.status,
      message: data.message,
    };
  } catch (error) {
    console.error('Payment status check error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
