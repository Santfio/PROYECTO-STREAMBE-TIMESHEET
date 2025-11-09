const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, init } = require('./db');
const SECRET = 'dev_secret_key_change_me';
init();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    bcrypt.compare(password, user.password, (err, same) => {
      if (same) {
        const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET, { expiresIn: '8h' });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    });
  });
});
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = payload;
    next();
  });
}
app.get('/projects', auth, (req, res) => {
  db.all('SELECT * FROM projects', (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows);
  });
});
app.post('/entries', auth, (req, res) => {
  const { date, startTime, endTime, projectId, description } = req.body;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let total = (eh + em/60) - (sh + sm/60);
  if (total < 0) total += 24;
  db.run(`INSERT INTO entries (userId, projectId, date, startTime, endTime, totalHours, description) VALUES (?,?,?,?,?,?,?)`,
    [req.user.id, projectId || null, date, startTime, endTime, total, description || null], function(err) {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ id: this.lastID });
    });
});
app.get('/entries', auth, (req, res) => {
  if (req.user.role === 'admin') {
    db.all(`SELECT e.*, u.name as userName, p.name as projectName FROM entries e LEFT JOIN users u ON e.userId=u.id LEFT JOIN projects p ON e.projectId=p.id ORDER BY date DESC`, (err, rows) => {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json(rows);
    });
  } else {
    db.all(`SELECT e.*, u.name as userName, p.name as projectName FROM entries e LEFT JOIN users u ON e.userId=u.id LEFT JOIN projects p ON e.projectId=p.id WHERE e.userId=? ORDER BY date DESC`, [req.user.id], (err, rows) => {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json(rows);
    });
  }
});
app.get('/metrics/hours-by-project', auth, (req, res) => {
  db.all(`SELECT p.name as project, SUM(e.totalHours) as totalHours FROM entries e LEFT JOIN projects p ON e.projectId=p.id GROUP BY p.id`, (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows);
  });
});
app.post('/simulate-email', auth, (req, res) => {
  const { to, subject, body } = req.body;
  console.log('--- SIMULATED EMAIL ---');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Body:', body);
  console.log('-----------------------');
  res.json({ ok: true });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Timesheet backend listening on ${PORT}`));