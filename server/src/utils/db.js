// server/src/utils/db.js
const sqlite3 = require('sqlite3').verbose(); // .verbose()는 더 자세한 에러 메시지 제공
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') }); // .env 파일 경로 주의

// SQLite 데이터베이스 파일 경로 (server 디렉토리 루트에 생성됨)
const DB_FILE = process.env.SQLITE_DB_FILE || 'cbt_database.sqlite';
const dbPath = path.resolve(__dirname, '..', '..', DB_FILE); // server 디렉토리 루트

// 데이터베이스 인스턴스 생성
// 파일이 없으면 새로 생성
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log(`SQLite database connected at ${dbPath}`);
    initializeDb(); // DB 연결 성공 시 테이블 초기화
  }
});

// Users 테이블 생성 함수
const initializeDb = () => {
  const createUserTableSql = `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // SQLite에서는 EMAIL 형식 검증을 위한 CHECK 제약 조건 추가 가능 (선택)
  // 예: CHECK(email LIKE '%_@__%.__%')

  db.run(createUserTableSql, (err) => {
    if (err) {
      console.error('Error creating Users table', err.message);
    } else {
      console.log('Users table checked/created successfully.');
    }
  });

  // 다른 테이블 초기화도 이곳에 추가 가능
};

module.exports = db; // 데이터베이스 인스턴스 export
