const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const fs = require("fs");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());
const DATA_FILE = "./attendance.json";

function readCount() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ count: 0 }));
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data).count;
}

function writeCount(count) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ count }));
}

app.get("/scan", (req, res) => {
  let currentCount = readCount();
  currentCount += 1;
  writeCount(currentCount);
  res.send(`✅ Attendance marked! Total attendance is: ${currentCount}`);
});

app.get("/count", (req, res) => {
  res.json({ count: readCount() });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.get("/", (req, res) => {
  res.send("🎉 Backend server is live and running!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
