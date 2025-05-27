// server/src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../utils/db'); // SQLite DB 인스턴스 가져오기

// 회원가입 API
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    // 사용자명 또는 이메일 중복 확인
    const checkUserSql = `SELECT * FROM Users WHERE username = ? OR email = ?`;
    db.get(checkUserSql, [username, email], async (err, row) => {
      if (err) {
        console.error('Signup DB check error:', err.message);
        return res.status(500).json({ message: '서버 오류가 발생했습니다. (DB 확인 실패)' });
      }
      if (row) {
        return res.status(409).json({ message: '이미 사용 중인 사용자 이름 또는 이메일입니다.' });
      }

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);

      // 사용자 생성
      const insertUserSql = `INSERT INTO Users (username, email, password) VALUES (?, ?, ?)`;
      db.run(insertUserSql, [username, email, hashedPassword], function (err) {
        // function 키워드 사용해야 this.lastID 접근 가능
        if (err) {
          console.error('Signup DB insert error:', err.message);
          return res.status(500).json({ message: '서버 오류가 발생했습니다. (DB 저장 실패)' });
        }
        // this.lastID는 방금 삽입된 행의 ID
        const userResponse = { id: this.lastID, username, email };
        res.status(201).json({ message: '회원가입 성공!', user: userResponse });
      });
    });
  } catch (error) {
    // bcrypt.hash 등에서 발생하는 동기적 에러 처리
    console.error('Signup bcrypt error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다. (암호화 실패)' });
  }
});

// 로그인 API
router.post('/login', (req, res) => {
  // async/await 제거, 콜백 사용
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: '아이디(또는 이메일)와 비밀번호를 입력해주세요.' });
  }

  const findUserSql = `SELECT * FROM Users WHERE username = ? OR email = ?`;
  db.get(findUserSql, [identifier, identifier], async (err, user) => {
    // async는 bcrypt.compare 때문에 필요
    if (err) {
      console.error('Login DB find error:', err.message);
      return res.status(500).json({ message: '서버 오류가 발생했습니다. (DB 조회 실패)' });
    }
    if (!user) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    try {
      // 비밀번호 비교
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
      }

      // 로그인 성공
      const userResponse = { id: user.id, username: user.username, email: user.email };
      res.status(200).json({ message: '로그인 성공!', user: userResponse });
    } catch (bcryptError) {
      // bcrypt.compare 에서 발생하는 에러 처리
      console.error('Login bcrypt error:', bcryptError);
      res.status(500).json({ message: '서버 오류가 발생했습니다. (로그인 처리 실패)' });
    }
  });
});

module.exports = router;
