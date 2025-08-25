const express = require('express');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();
app.use(express.json());

// ให้เข้าถึงไฟล์รูปได้
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => res.json({ message: "API Running" }));
app.use("/api/users", userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));