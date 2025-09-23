const express = require('express');
const router = express.Router();

// Simple endpoint to verify the router is mounted
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;

