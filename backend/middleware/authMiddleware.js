const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  
  // If no tokens at all
  if (!accessToken && !refreshToken) {
    return res.status(401).json({
      success: false, 
      message: "Authentication required"
    });
  }

  try {
    // Verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (accessTokenError) {
    // Access token is invalid or expired
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again"
      });
    }

    try {
      // Verify refresh token
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      
      // Generate new access token
      const newAccessToken = jwt.sign(
        { userId: decodedRefresh.userId },
        process.env.ACCESS_SECRET,
        { expiresIn: '15m' }
      );

      // Set new access token cookie
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      // Attach user ID to request
      req.userId = decodedRefresh.userId;
      
      // Optionally attach the new token to the response locals
      res.locals.newAccessToken = newAccessToken;
      
      return next();
    } catch (refreshTokenError) {
      // Refresh token is invalid or expired
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again"
      });
    }
  }
};

module.exports = authMiddleware;