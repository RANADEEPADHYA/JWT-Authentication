require('dotenv').config();


const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
  { username: 'user1', title: 'Post 1', content: 'This is the first post.' },
  { username: 'user2', title: 'Post 2', content: 'This is the second post.' },
];

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name));
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
