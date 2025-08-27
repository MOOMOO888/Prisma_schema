// api/index.js
const { send } = require("micro"); // หรือ ใช้ native handler แบบ simple
// ถ้าต้องการใช้ express-like, ให้ใช้ `serverless-http` (ตัวอย่างด้านล่าง)

module.exports = async (req, res) => {
  // ตัวอย่าง simple endpoint
  if (req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Hello from Vercel Function" }));
    return;
  }
  res.statusCode = 405;
  res.end();
};
