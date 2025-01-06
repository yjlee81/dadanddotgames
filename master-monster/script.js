/******************************************************
 *  Master Monster: 메인 게임 로직 + UI 제어
 *  (별 생성, 패럴랙스, 헤더/푸터 등은 common.js에서)
 ******************************************************/

// 주요 DOM 요소
const gameBoard        = document.getElementById('game-board');
const scoreDisplay     = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const restartButton    = document.getElementById('restart-button');
const mergeSound       = document.getElementById('mergeSound');
const gameGuide        = document.getElementById('game-guide');
const startButton      = document.getElementById('start-button');
const languageSelect   = document.getElementById('language-select');

// 게임 상태
let grid            = [];
let score           = 0;
let bestScore       = 0;  // 로컬 스토리지에서 불러온 최고 점수
let gameStarted     = false;
let difficultyLevel = 'normal';
let currentGameMaxLevel = 1;
let tileIdCounter   = 0; // 타일 ID 카운터
let nextTileValue   = 2; // 기본값
let gameStates      = []; // undo를 위한 게임 히스토리
let undoCount       = 3;  
let currentBestLevel = 1; // 게임 중 달성한 최고 레벨
let finalMaxLevel = 1;    // 게임 종료 시점의 최고 레벨

// (1) 게임 진행 시간 측정
let startTime;  // 게임 시작 시간
let endTime;    // 게임 종료 시간

// 초기화
function initGrid() {
  grid = [];
  for (let row = 0; row < 4; row++) {
    grid[row] = [];
    for (let col = 0; col < 4; col++) {
      grid[row][col] = null;
    }
  }
}

function init() {
  // 로컬스토리지에서 최고 점수 불러오기
  bestScore = getBestScore().score;

  initGrid();
  score               = 0;
  currentGameMaxLevel = 1;
  currentBestLevel   = 1; 
  finalMaxLevel      = 1;
  undoCount           = 3;
  gameStates          = [];

  scoreDisplay.innerText = score;
  updateBestScoreDisplay();
  updateBestLevelDisplay();
  gameBoard.innerHTML = '';

  createPlaceholders();
  addStartingTiles();
  updateBoard();
  updateNextTileDisplay();
  updateUndoButton();

  // Undo 버튼 이벤트
  const undoButton = document.getElementById('undo-button');
  if (undoButton) {
    undoButton.removeEventListener('click', undoMove);
    undoButton.addEventListener('click', undoMove);
  }

  // 게임 시작 시간 기록
  startTime = Date.now();
}

// 게임판 placeholder 생성
function createPlaceholders() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const placeholder = document.createElement('div');
      placeholder.classList.add('tile-placeholder');
      placeholder.style.left = (col * 110 + 10) + 'px';
      placeholder.style.top  = (row * 110 + 10) + 'px';
      gameBoard.appendChild(placeholder);
    }
  }
}

// 시작 타일 배치
function addStartingTiles() {
  let startingTiles = 2; 
  if (difficultyLevel === 'easy')   startingTiles = 4;
  if (difficultyLevel === 'hard')   startingTiles = 2;
  if (difficultyLevel === 'expert') startingTiles = 1;
  if (difficultyLevel === 'master') startingTiles = 1;

  for (let i = 0; i < startingTiles; i++) {
    addNewTile();
  }
}

function addNewTile() {
  const emptyPositions = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!grid[row][col]) {
        emptyPositions.push({ row, col });
      }
    }
  }
  if (emptyPositions.length === 0) return;

  const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  
  // 현재 nextTileValue 사용
  const newValue = nextTileValue;
  grid[randomPos.row][randomPos.col] = {
    value: newValue,
    isNew: true,
    merged: false,
    id: tileIdCounter++
  };

  // 다음 타일 값은 2,4,8 중 랜덤
  const possibleValues = [2, 4, 8];
  nextTileValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
  updateNextTileDisplay();
}

function updateNextTileDisplay() {
  const nextTileElement      = document.querySelector('.next-tile');
  const nextTileLevelElement = document.querySelector('.tile-level');
  const level = Math.log2(nextTileValue);
  const emojis = ["🥚", "🐣", "🐥", "🐤", "🦅", "🦉", "🦇", "🐲", "🐉", "🌟", "👑"];

  // 이모지
  const previewElement = nextTileElement.querySelector('.tile-preview');
  previewElement.textContent = emojis[level - 1] || "🦄"; // 예외 처리

  // 레벨 표시
  nextTileLevelElement.textContent = `Lv.${level}`;

  // 배경색
  nextTileElement.setAttribute('data-level', level);
  nextTileElement.style.backgroundColor = getTileColor(nextTileValue);
}

// 타일 컬러 함수
function getTileColor(value) {
  switch (value) {
    case 2:    return '#FFF5E6';
    case 4:    return '#FFE4CC';
    case 8:    return '#FFD4B3';
    case 16:   return '#FFC299';
    case 32:   return '#FFB380';
    case 64:   return '#FFA366';
    case 128:  return '#FF944D';
    case 256:  return '#FF8533';
    case 512:  return '#FF751A';
    case 1024: return '#FF6600';
    case 2048: return '#FF4D00';
    default:   return '#CCC0B3';
  }
}

function updateBoard() {
  if (!gameStarted) return;
  const currentTileIds = new Set();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col]) {
        const id    = grid[row][col].id;
        const value = grid[row][col].value;
        currentTileIds.add(id);

        let tile = document.querySelector(`.tile[data-id="${id}"]`);
        if (!tile) {
          // 새로운 타일 생성
          tile = document.createElement('div');
          tile.classList.add('tile', `tile-${value}`);
          tile.setAttribute('data-id', id);

          const level = Math.log2(value);
          if (level === 11) {
            tile.innerHTML = '<span class="level-text">Master</span>';
          } else {
            tile.innerHTML = `<span class="level-text">Lv.${level}</span>`;
          }

          if (grid[row][col].isNew) {
            tile.classList.add('new-tile');
            grid[row][col].isNew = false;
          }
          gameBoard.appendChild(tile);
        }

        // 타일 위치 업데이트
        const targetLeft = (col * 110 + 10) + 'px';
        const targetTop  = (row * 110 + 10) + 'px';

        if (tile.style.left !== targetLeft || tile.style.top !== targetTop) {
          tile.classList.add('moving');
        }
        tile.style.left = targetLeft;
        tile.style.top  = targetTop;

        // 이동이 완료된 후 moving 클래스 제거
        setTimeout(() => {
          tile.classList.remove('moving');
        }, 150);

        // merge 효과
        if (grid[row][col].merged) {
          tile.classList.add('merge');
          createParticles(col * 110 + 60, row * 110 + 60);
          grid[row][col].merged = false;
        }
      }
    }
  }

  // 그리드에 없는 타일 제거
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => {
    const id = parseInt(tile.getAttribute('data-id'));
    if (!currentTileIds.has(id)) {
      tile.style.opacity = '0';
      tile.style.transform = 'scale(0.8)';
      setTimeout(() => {
        if (tile.parentNode === gameBoard) {
          gameBoard.removeChild(tile);
        }
      }, 150);
    }
  });
}

function moveTiles(direction) {
  if (!gameStarted) return;

  // 이동 전 상태 저장
  saveGameState();

  let moved = false;
  for (let i = 0; i < 4; i++) {
    let line = [];
    for (let j = 0; j < 4; j++) {
      let row = (direction === 'ArrowUp'   || direction === 'ArrowDown') ? j : i;
      let col = (direction === 'ArrowUp'   || direction === 'ArrowDown') ? i : j;
      if (direction === 'ArrowDown')  row = 3 - j;
      if (direction === 'ArrowRight') col = 3 - j;
      if (grid[row][col]) line.push({ ...grid[row][col] });
    }

    let mergedLine = [];
    let skip = false;
    for (let k = 0; k < line.length; k++) {
      if (skip) {
        skip = false;
        continue;
      }
      if (line[k + 1] && line[k].value === line[k + 1].value) {
        let newValue = line[k].value * 2;
        // 점수 (간단 계산)
        let points = Math.log2(newValue) - 1;
        score += points;

        const level = Math.log2(newValue);
        if (level > currentBestLevel) {
          currentBestLevel = level; 
          updateBestLevelDisplay();
        }

        mergedLine.push({
          value: newValue,
          merged: true,
          isNew: false,
          id: tileIdCounter++
        });
        // 사운드
        playMergeSound();
        skip = true;
      } else {
        mergedLine.push({
          value: line[k].value,
          merged: false,
          isNew: false,
          id: line[k].id
        });
      }
    }
    while (mergedLine.length < 4) {
      mergedLine.push(null);
    }

    for (let j = 0; j < 4; j++) {
      let row = (direction === 'ArrowUp' || direction === 'ArrowDown') ? j : i;
      let col = (direction === 'ArrowUp' || direction === 'ArrowDown') ? i : j;
      if (direction === 'ArrowDown')  row = 3 - j;
      if (direction === 'ArrowRight') col = 3 - j;

      const newCell = mergedLine[j];
      const oldCell = grid[row][col];
      if (oldCell && (!newCell || oldCell.id !== (newCell?.id) || oldCell.value !== (newCell?.value))) {
        moved = true;
      }
      grid[row][col] = newCell;
    }
  }

  if (moved) {
    addNewTile();
    updateBoard();
    scoreDisplay.innerText = score;
    updateBestScore();  // <-- 이동 후에 최고 점수 갱신 체크
    if (isGameOver()) {
      // Game Over 시 모달
    }
  } else {
    // 이동이 없었다면 상태 복원
    gameStates.pop();
  }
}

// Undo
function undoMove() {
  if (undoCount > 0 && gameStates.length > 0) {
    const previousState = gameStates.pop();
    grid          = previousState.grid.map(row => row.map(cell => cell ? {...cell} : null));
    score         = previousState.score;
    nextTileValue = previousState.nextTileValue;
    undoCount--;

    updateBoard();
    updateUndoButton();
    scoreDisplay.innerText = score;
    updateNextTileDisplay();
  }
}

// Undo 버튼 상태 업데이트
function updateUndoButton() {
  const undoButton = document.getElementById('undo-button');
  if (undoButton) {
    undoButton.textContent = `Undo (${undoCount})`;
    undoButton.disabled    = (undoCount === 0);
    undoButton.style.opacity = (undoCount === 0) ? '0.5' : '1';
  }
}

// 이전 상태 저장
function saveGameState() {
  const currentState = {
    grid: grid.map(row => row.map(cell => cell ? {...cell} : null)),
    score,
    nextTileValue
  };
  gameStates.push(currentState);
  if (gameStates.length > 10) {
    gameStates.shift();
  }
}

// 게임 오버 여부
function isGameOver() {
  // 빈칸이 있는지
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!grid[row][col]) return false;
    }
  }
  // 인접 동일
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const currentValue = grid[row][col].value;
      // 오른쪽
      if (col < 3 && grid[row][col + 1].value === currentValue) return false;
      // 아래
      if (row < 3 && grid[row + 1][col].value === currentValue) return false;
    }
  }
  // Game Over 처리
  setTimeout(() => {
    showGameOverModal(score, 0 );
  }, 300);
  return true;
}

function showGameOverModal(finalScore, playTime) {
    const gameOverModal = document.getElementById('gameOverModal');
    if (!gameOverModal) return;

    const finalScoreElement = document.getElementById('final-score');
    const bestLevelElement = document.getElementById('current-best-level');
    const playTimeElement = document.getElementById('play-time');

    if (finalScoreElement) {
        finalScoreElement.innerText = finalScore || 0;
    }
    if (bestLevelElement) {
        bestLevelElement.innerText = `Lv.${currentBestLevel || 1}`;
    }
    if (playTimeElement) {
        playTimeElement.innerText = formatTime(playTime || 0);
    }

    gameOverModal.classList.add('show');
}

function closeGameOverModal() {
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
        gameOverModal.classList.remove('show');
    }
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 스코어 관련 (최고점 갱신)
function updateBestScore() {
  const bestRecord = getBestScore(); 
  if (score > bestRecord.score) {
    let maxLevel = currentGameMaxLevel;  
    const newRecord = { score, level: maxLevel };
    localStorage.setItem('bestScore', JSON.stringify(newRecord));
    bestScore = score; // 전역 변수 갱신
    updateBestScoreDisplay();
  }
}

// 로컬 스토리지에서 불러오기
function getBestScore() {
  try {
    const savedRecord = localStorage.getItem('bestScore');
    if (!savedRecord) return { score: 0, level: 0 };
    const record = JSON.parse(savedRecord);
    return {
      score: Number(record.score) || 0,
      level: Number(record.level) || 0
    };
  } catch (e) {
    console.error('Error loading best score:', e);
    return { score: 0, level: 0 };
  }
}

// 화면에 최고 점수 표시
function updateBestScoreDisplay() {
  if (bestScoreDisplay) {
    bestScoreDisplay.innerText = bestScore; 
  }
}

// 키보드 이벤트 (화살표)
document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
    moveTiles(e.key);
  }
});

// 리스타트
restartButton.addEventListener('click', () => {
  init(); // 게임을 다시 시작할 때만 초기화
});

// 터치 이벤트
let touchStartX, touchStartY;

document.addEventListener('touchstart', (e) => {
  if (!gameStarted) return;
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
  if (!gameStarted) return;
  let touchEndX = e.changedTouches[0].screenX;
  let touchEndY = e.changedTouches[0].screenY;
  handleGesture(touchStartX, touchStartY, touchEndX, touchEndY);
});

function handleGesture(startX, startY, endX, endY) {
  let dx = endX - startX;
  let dy = endY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    // 수평
    if (dx > 30)       moveTiles('ArrowRight');
    else if (dx < -30) moveTiles('ArrowLeft');
  } else {
    // 수직
    if (dy > 30)       moveTiles('ArrowDown');
    else if (dy < -30) moveTiles('ArrowUp');
  }
}

// 파티클 이펙트
function createParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left   = x + 'px';
    particle.style.top    = y + 'px';
    particle.style.width  = Math.random() * 10 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'rgba(255, 255, 255,' + Math.random() + ')';

    gameBoard.appendChild(particle);
    particle.addEventListener('animationend', () => {
      gameBoard.removeChild(particle);
    });
  }
}

// 사운드 초기화 (모바일 대응)
function initSound() {
  document.addEventListener('touchstart', function() {
    if (mergeSound) {
      mergeSound.play().then(() => {
        mergeSound.pause();
        mergeSound.currentTime = 0;
      }).catch(e => console.log('Sound init failed:', e));
    }
  }, { once: true });
}

// 언어
const translations = {
  en: {
    title: "Master Monster",
    currentScore: "Score",
    bestScore: "Best",
    restart: "Restart",
    undo: "Undo",
    welcome: "How to Play Master Monster",
    instructions: "Use arrow keys to merge monsters and reach the master level!",
    startGame: "Start Game ⏎"
  },
  ko: {
    title: "Master Monster",
    currentScore: "현재 점수",
    bestScore: "최고 점수",
    restart: "새로하기",
    undo: "되돌리기",
    welcome: "Master Monster 게임방법",
    instructions: "키를 이용해 몬스터를 합쳐 마스터 레벨에 도달하세요!",
    startGame: "게임 시작 ⏎"
  },
  ja: {
    title: "Master Monster",
    currentScore: "スコア",
    bestScore: "ベスト",
    restart: "リスタート",
    undo: "元に戻す",
    welcome: "Master Monster 遊び方",
    instructions: "キーを使ってモンスターをマージしてマスターレベルに到達しよう！",
    startGame: "ゲームスタート ⏎"
  },
  zh: {
    title: "Master Monster",
    currentScore: "当前分数",
    bestScore: "最高分",
    restart: "重新开始",
    undo: "撤销",
    welcome: "Master Monster 游戏方法",
    instructions: "使用方向键合并怪物，达到大师级别！",
    startGame: "开始游戏 ⏎"
  }
};

function updateTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    element.textContent = translations[lang][key] || element.textContent;
  });
}

// 언어 선택
document.getElementById("language-select").addEventListener("change", (event) => {
  const selectedLang = event.target.value;
  updateTranslations(selectedLang);
  localStorage.setItem('preferred-language', selectedLang);
});

// 페이지 로드 시 저장된 언어 적용
window.addEventListener('load', () => {
  const savedLanguage = localStorage.getItem('preferred-language') || 'ko';
  languageSelect.value = savedLanguage;
  updateTranslations(savedLanguage);

  // 시작 버튼 포커스
  startButton.focus();

  // Undo 버튼 초기화
  updateUndoButton();
});

// 게임 시작
function startGame() {
  gameStarted = true;
  difficultyLevel = 'normal';
  init();

  
}

// 엔터키로 게임 시작
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && gameGuide.style.display !== 'none') {
    startButton.click();
  }
});

// start-button 클릭
startButton.addEventListener('click', function() {
  gameGuide.style.display = 'none';
  startGame();
});

// 최고 레벨 업데이트
function updateBestLevelDisplay() {
  const bestLevelDisplay = document.getElementById('current-best-level');
  if (bestLevelDisplay) {
    bestLevelDisplay.innerText = `Lv.${currentBestLevel}`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
    const volumeToggle = document.getElementById('volume-toggle');
    const iconVolumeOn = volumeToggle.querySelector('.icon-volume-on');
    const iconVolumeOff = volumeToggle.querySelector('.icon-volume-off');
    let isMuted = localStorage.getItem('isMuted') === 'true';

    // 초기 상태 설정
    mergeSound.muted = isMuted;
    updateVolumeIcon(isMuted);

    volumeToggle.addEventListener('click', function() {
        isMuted = !isMuted;
        mergeSound.muted = isMuted;
        updateVolumeIcon(isMuted);
        localStorage.setItem('isMuted', isMuted);
    });

    function updateVolumeIcon(isMuted) {
        if (isMuted) {
            iconVolumeOn.style.display = 'none';
            iconVolumeOff.style.display = 'inline';
        } else {
            iconVolumeOn.style.display = 'inline';
            iconVolumeOff.style.display = 'none';
        }
    }

    const openGameOverModalButton = document.getElementById('open-game-over-modal');
    if (openGameOverModalButton) {
        openGameOverModalButton.addEventListener('click', function() {
            const finalScore = score;
            const playTime = Date.now() - startTime;
            showGameOverModal(finalScore, playTime);
        });
    }
});

// 사운드 재생 시 음소거 상태 확인
function playMergeSound() {
    if (!mergeSound.muted) {
        mergeSound.currentTime = 0;
        mergeSound.play().catch(e => console.log('Sound play failed:', e));
    }
}

/******************************************************
 * 랭킹 데이터 저장/로드
 ******************************************************/
function saveRanking(score, level, timeSec) {
  const rankingData = loadRankingData();

  // 새로운 기록
  const newRecord = {
    score,
    level,
    timeSec
  };
  
  // 랭킹 리스트에 추가
  rankingData.push(newRecord);

  // 정렬 기준: 스코어(desc), 레벨(desc), 시간(asc)
  rankingData.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score; // 점수가 크면 상위
    } else if (b.level !== a.level) {
      return b.level - a.level; // 레벨이 크면 상위
    } else {
      return a.timeSec - b.timeSec; // 시간이 짧을수록 상위
    }
  });

  // 상위 50개 정도만 보관 (필요에 따라 조정)
  rankingData.splice(50);

  // 로컬 스토리지에 저장
  localStorage.setItem('masterMonsterRanking', JSON.stringify(rankingData));
}

function loadRankingData() {
  try {
    const data = localStorage.getItem('masterMonsterRanking');
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (e) {
    console.error('랭킹 데이터 로드 에러:', e);
    return [];
  }
}

function getMyLatestRank(score, level, timeSec) {
  const rankingData = loadRankingData();
  // 현재 저장된 랭킹 기준으로 등수를 계산
  for (let i = 0; i < rankingData.length; i++) {
    if (rankingData[i].score === score &&
        rankingData[i].level === level &&
        rankingData[i].timeSec === timeSec) {
      return i + 1; // 인덱스가 0부터 시작하므로 +1
    }
  }
  return -1; 
}

/******************************************************
 * 전체 랭킹 표시
 ******************************************************/
function showRankingModal() {
  const rankingModal = document.getElementById('ranking-modal');
  if (rankingModal) {
    rankingModal.classList.add('show');
  }
}

function closeRankingModal() {
  const rankingModal = document.getElementById('ranking-modal');
  if (rankingModal) {
    rankingModal.classList.remove('show');
  }
}

/******************************************************
 * 이벤트 리스너
 ******************************************************/
document.addEventListener('DOMContentLoaded', function() {
  const rankingButton = document.getElementById('ranking-button');
  const closeRankingButton = document.getElementById('close-ranking-modal');
  const originalStartGame = startGame; // 기존 함수 참조

  window.startGame = function() {
    originalStartGame();  // 원래 startGame 로직 실행
    showTutorialBubble(); // 말풍선 표시
  };
  if (rankingButton) {
    rankingButton.addEventListener('click', showRankingModal);
  }
  if (closeRankingButton) {
    closeRankingButton.addEventListener('click', closeRankingModal);
  }


    // 튜토리얼 말풍선 표시 함수
    function showTutorialBubble() {
      const tutorialBubble = document.getElementById('tutorial-bubble');
      if (!tutorialBubble) return;

      // (1) 처음에는 투명 상태
      tutorialBubble.style.opacity = '0';
      tutorialBubble.style.display = 'block';

      // (1-2) 짧은 딜레이 후 fade-in
      setTimeout(() => {
        tutorialBubble.style.transition = 'opacity 0.8s';
        tutorialBubble.style.opacity = '0.9';
      }, 50);

      // (2) 5초 뒤에 사라지도록 (fade-out)
      setTimeout(() => {
        tutorialBubble.style.transition = 'opacity 0.8s';
        tutorialBubble.style.opacity = '0';
        // fade-out이 끝난 뒤 display를 none 처리
        setTimeout(() => {
          tutorialBubble.style.display = 'none';
        }, 800);
      }, 5000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');

    modals.forEach(modal => {
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    closeButtons.forEach(button => {
        // 닫기 버튼 클릭 시 닫기
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) {
      gameOverModal.classList.remove('show'); // Ensure modal is hidden on load
    }

    const modalUndoButton = document.getElementById('modal-undo-button');
    const modalRestartButton = document.getElementById('modal-restart-button');
    const undoButton = document.getElementById('undo-button');
    const restartButton = document.getElementById('restart-button');

    if (modalUndoButton && undoButton) {
        modalUndoButton.addEventListener('click', function() {
            if (gameOverModal) {
              gameOverModal.classList.remove('show'); // 모달 닫기
            }
            setTimeout(() => {
                undoButton.click(); // game-controls의 Undo 버튼과 동일한 동작
            }, 300); // 모달 닫힌 후 실행
        });
    }

    if (modalRestartButton && restartButton) {
        modalRestartButton.addEventListener('click', function() {
            if (gameOverModal) {
              gameOverModal.classList.remove('show'); // 모달 닫기
            }
            setTimeout(() => {
                restartButton.click(); // game-controls의 다시하기 버튼과 동일한 동작
            }, 300); // 모달 닫힌 후 실행
        });
    }
});

// 게임 종료 시 호출
function endGame() {
    const finalScore = score;
    const playTime = Date.now() - startTime;

    updateBestScore();
    updateBestLevelDisplay();

    showGameOverModal(finalScore, playTime);
}

// 타일 합치기 로직에서 최고 레벨 업데이트
function mergeTiles(tile1, tile2) {
    const newValue = tile1.value + tile2.value;
    tile1.value = newValue;
    tile2.value = null;
    score += newValue;

    const newLevel = Math.log2(newValue);
    if (newLevel > currentBestLevel) {
        currentBestLevel = newLevel;
        updateBestLevelDisplay(); // 최고 레벨 업데이트
    }

    updateBoard();
    updateScoreDisplay();
}

// 점수 및 레벨 업데이트 함수
function updateScoreDisplay() {
    scoreDisplay.innerText = score;
    updateBestScoreDisplay();
    updateBestLevelDisplay();
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateRealTimeStats() {
    const currentScoreElement = document.getElementById('current-score');
    const currentMaxLevelElement = document.getElementById('current-max-level');
    const currentPlayTimeElement = document.getElementById('current-play-time');

    if (currentScoreElement) {
        currentScoreElement.innerText = score;
    }
    if (currentMaxLevelElement) {
        currentMaxLevelElement.innerText = `Lv.${currentGameMaxLevel}`;
    }
    if (currentPlayTimeElement) {
        const playTime = Date.now() - startTime;
        currentPlayTimeElement.innerText = formatTime(playTime);
    }
}

// 게임 루프나 주요 이벤트에서 호출하여 실시간 업데이트
setInterval(updateRealTimeStats, 1000); // 1초마다 업데이트