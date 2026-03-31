const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const levels = require('./levels');

const app = express();
app.use(cors());
app.use(express.json());

const BLOCKED = [/rm\s+-rf\s+\//, /mkfs/, /dd\s+if=/, /shutdown/, /reboot/, /halt/, /poweroff/, /init\s+[06]/, /:\(\)\{/, /fork\s*bomb/, />\s*\/dev\/sd/, /chmod\s+-R\s+000\s+\//, /chown\s+-R.*\/$/];

function isDangerous(code) {
  return BLOCKED.some(r => r.test(code));
}

app.post('/api/execute', (req, res) => {
  const { code } = req.body;
  if (!code) return res.json({ stdout: '', stderr: 'No code provided', success: false });
  if (isDangerous(code)) return res.json({ stdout: '', stderr: 'Dangerous command blocked', success: false });
  try {
    const stdout = execSync(code, { timeout: 5000, shell: '/bin/bash', encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    res.json({ stdout, stderr: '', success: true });
  } catch (e) {
    res.json({ stdout: e.stdout || '', stderr: e.stderr || e.message, success: false });
  }
});

app.get('/api/levels', (req, res) => res.json(levels));

app.get('/api/levels/:id', (req, res) => {
  const level = levels.find(l => l.id === parseInt(req.params.id));
  level ? res.json(level) : res.status(404).json({ error: 'Level not found' });
});

app.post('/api/validate/:id', (req, res) => {
  const level = levels.find(l => l.id === parseInt(req.params.id));
  if (!level) return res.status(404).json({ error: 'Level not found' });
  const { code } = req.body;
  if (!code) return res.json({ passed: false, output: '', expected: level.expectedOutput });
  if (isDangerous(code)) return res.json({ passed: false, output: 'Dangerous command blocked', expected: level.expectedOutput });
  try {
    const output = execSync(code, { timeout: 5000, shell: '/bin/bash', encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    const expected = level.expectedOutput.trim();
    let passed = false;
    if (level.validationType === 'exact') passed = output === expected;
    else if (level.validationType === 'contains') passed = output.includes(expected);
    else if (level.validationType === 'regex') passed = new RegExp(expected).test(output);
    res.json({ passed, output, expected: level.expectedOutput });
  } catch (e) {
    res.json({ passed: false, output: e.stderr || e.message, expected: level.expectedOutput });
  }
});

app.listen(3001, () => console.log('ShellQuest backend running on port 3001'));
