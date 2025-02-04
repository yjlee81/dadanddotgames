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

// 만약 서버 사이드의 라우터 외에도 클라이언트 사이드 라우팅을 지원하려면
// (예: SPA일 경우) 모든 경로에 대해 index.html을 반환하도록 설정
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});