import User from '../models/user.models.js';

export const checkAdmin = async (req, res, next) => {
  try {
    // Get user ID from request body or query params
    const userId = req.body.userId || req.query.userId || req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ message: 'No user ID provided, authorization denied' });
    }

    // Get user from database
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if user has admin role
    if (!user.roles || !user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(401).json({ message: 'Authorization failed' });
  }
}; 