const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const userMiddleware = async (req, res, next) => {
  try {
  
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token is missing" });
    }

    // Ensure the format is "Bearer <token>"
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = tokenParts[1]; // Extract token after "Bearer"

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach the user ID to the request for later use
    req.userId = decoded.userId;
        req.user = { id: decoded.userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { userMiddleware };

