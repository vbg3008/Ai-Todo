// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Check if the error is from OpenAI API
  if (err.name === 'OpenAIError') {
    return res.status(500).json({
      message: 'Error with AI service',
      error: err.message
    });
  }
  
  // Check if the error is from Slack API
  if (err.message && err.message.includes('Slack')) {
    return res.status(500).json({
      message: 'Error with Slack service',
      error: err.message
    });
  }
  
  // Default error response
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export default errorHandler;
