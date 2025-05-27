// server/src/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const db = require('../models'); // Sequelize용이었음, 이제 사용 안 함
const dbInstance = require('./utils/db'); // SQLite DB 인스턴스 직접 가져오기
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.json({ message: '👋 Hello from backend server (using raw SQL)!' });
});

// 인증 API 라우트 연결
app.use('/api/auth', authRoutes);

// 서버 시작 (DB 연결은 db.js에서 이미 처리됨)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  // dbInstance는 이미 utils/db.js에서 연결 및 테이블 생성을 시도함
  // 별도의 연결 테스트가 필요하다면 dbInstance.get("SELECT 1", ...) 등을 사용할 수 있음
});

// 서버 종료 시 DB 닫기 (선택 사항, graceful shutdown)
process.on('SIGINT', () => {
  dbInstance.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});
