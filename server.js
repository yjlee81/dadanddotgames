const express = require('express');
const path = require('path');
const app = express();
/*
// 정적 파일 서빙
app.use(express.static('public'));  // 메인 홈페이지
app.use('/sd', express.static('sd'));  // 숫자결합 게임
app.use('/mm', express.static('mm'));  // 마스터몬스터 게임
// 정적 파일 제공 경로 지정 (예: 'sd' 폴더)
app.use(express.static(path.join(__dirname, 'sd')));

// 메인 홈페이지 라우팅
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// 숫자결합 게임 라우팅
app.get('/sd*', (req, res) => {
  res.sendFile(path.join(__dirname, 'pubic/sd/index.html'));
});

// 마스터몬스터 게임 라우팅
app.get('/mm', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/mm/index.html'));
});

// /mm/ranking 경로에 대한 요청 처리
app.get('/mm/ranking', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/mm/index.html'));
});

// 모든 다른 경로에 대해 index.html을 서빙 (클라이언트 측 라우팅을 위해)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/mm/index.html'));
});

// (필요하다면) /public 전체를 정적 파일 제공 경로로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 사용자 정의 라우터를 해당 경로에 등록
app.use('/sd', require('./public/sd/router'));
app.use('/mm', require('./public/mm/router'));
*/

// public 폴더를 정적 파일 제공 폴더로 설정
app.use(express.static(path.join(__dirname, 'public')));

// SD 게임의 SPA 라우팅 fallback 처리
app.get('/sd/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sd', 'index.html'));
});

// MM 게임의 SPA 라우팅 fallback 처리
app.get('/mm/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mm', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});