import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Set JWT token in cookie
export const setTokenCookie = (res, token) => {
  const options = {
    httpOnly: true, // Prevents XSS attacks
    secure: true, // Always true in production, and usually required for 'none'
    sameSite: 'none', // Required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  };

  res.cookie('token', token, options);
};
// Clear token cookie
export const clearTokenCookie = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
