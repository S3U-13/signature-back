const jwt = require("jsonwebtoken");

// 🔐 ตรวจสอบ token
function authenticateToken(req, res, next) {
  let token = null;

  const authHeader = req.headers["authorization"];

  // 👉 header
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  // 👉 cookie
  if (!token && req.cookies) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
}

// 🔑 ตรวจสอบ role
function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
