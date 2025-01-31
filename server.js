const express = require('express');
const path = require('path');
const app = express();

// 정적 파일 서빈
app.use(express.static(path.join(__dirname, 'public')));

// 모든 라우트에 대해 index.html 반환
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 