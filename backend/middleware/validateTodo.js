// Middleware to validate todo data
export const validateTodo = (req, res, next) => {
  const { title } = req.body;
  
  // Check if title exists and is not empty
  if (!title || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  // Check if title is too long
  if (title.length > 100) {
    return res.status(400).json({ message: 'Title must be less than 100 characters' });
  }
  
  // If description exists, check if it's too long
  if (req.body.description && req.body.description.length > 500) {
    return res.status(400).json({ message: 'Description must be less than 500 characters' });
  }
  
  next();
};
