const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// middleware ตรวจสอบ JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // จะมี req.user.userId และ req.user.role
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// middleware ตรวจสอบ admin
const adminMiddleware = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Forbidden: Admin only" });
  next();
};

// export ทั้งสอง
module.exports = { authMiddleware, adminMiddleware };
