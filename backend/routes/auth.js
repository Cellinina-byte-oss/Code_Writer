const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const USERS_DIR = path.join(__dirname, '..', 'users');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

const generateUserId = () => {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const getUserFilePath = (userId) => path.join(USERS_DIR, `${userId}.json`);

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未授权访问' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '无效的令牌' });
    }
    req.user = user;
    next();
  });
};

const checkUserExists = async (username, email) => {
  const users = await fs.promises.readdir(USERS_DIR);
  for (const file of users) {
    if (file.endsWith('.json')) {
      const content = await fs.promises.readFile(path.join(USERS_DIR, file), 'utf8');
      const user = JSON.parse(content);
      if (user.username === username || user.email === email) {
        return user;
      }
    }
  }
  return null;
};

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const existingUser = await checkUserExists(username, email);
    if (existingUser) {
      return res.status(400).json({ error: '用户名或邮箱已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUserId();
    const userData = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    await fs.promises.writeFile(getUserFilePath(userId), JSON.stringify(userData, null, 2));

    const token = generateToken({ userId, username });

    res.status(201).json({
      message: '注册成功',
      token,
      user: { id: userId, username, email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const users = await fs.promises.readdir(USERS_DIR);
    let foundUser = null;

    for (const file of users) {
      if (file.endsWith('.json')) {
        const content = await fs.promises.readFile(path.join(USERS_DIR, file), 'utf8');
        const user = JSON.parse(content);
        if (user.username === username || user.email === username) {
          foundUser = user;
          break;
        }
      }
    }

    if (!foundUser) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = generateToken({ userId: foundUser.id, username: foundUser.username });

    res.json({
      message: '登录成功',
      token,
      user: { id: foundUser.id, username: foundUser.username, email: foundUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    user: { id: req.user.userId, username: req.user.username }
  });
});

module.exports = router;
