import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export function authRequired(req, res, next) {
  // Check for token in Authorization header first
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } 
  // Fall back to cookie if not in header
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}