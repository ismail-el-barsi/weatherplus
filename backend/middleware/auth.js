import jwt from 'jsonwebtoken';

export const checkTokenExpiration = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return true; // Token has expired
    } else {
      return false; // Token is not expired
    }
  } catch (error) {
    return true; // Token is invalid or expired
  }
};

export const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
