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
let bestLevel       = 1;

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
  bestLevel           = 1; 
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
  if (!nextTileElement) return; // 혹시 해당 요소가 없다면 안전 처리

  const nextTileLevelElement = nextTileElement.querySelector('.tile-level');
  const level = Math.log2(nextTileValue);
  const emojis = ["🥚", "🐣", "🐥", "🐤", "🦅", "🦉", "🦇", "🐲", "🐉", "🌟", "👑"];

  // 이모지
  const previewElement = nextTileElement.querySelector('.tile-preview');
  if (previewElement) {
    previewElement.textContent = emojis[level - 1] || "🦄"; // 예외 처리
  }

  // 레벨 표시
  if (nextTileLevelElement) {
    nextTileLevelElement.textContent = `Lv.${level}`;
  }

  // 배경색
  if (nextTileElement) {
    nextTileElement.setAttribute('data-level', level);
    nextTileElement.style.backgroundColor = getTileColor(nextTileValue);
  }
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
        if (level > bestLevel) {
          bestLevel = level; 
          updateBestLevelDisplay();
        }

        mergedLine.push({
          value: newValue,
          merged: true,
          isNew: false,
          id: tileIdCounter++
        });
        // 사운드
        if (mergeSound) {
          mergeSound.currentTime = 0;
          mergeSound.play().catch(e => console.log('Sound play failed:', e));
        }
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
    showGameOverModal();
  }, 300);
  return true;
}

function showGameOverModal() {
  // 모달 생성
  const gameOverModal = document.createElement('div');
  gameOverModal.className = 'modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.innerHTML = `
    <h2>Game Over!</h2>
    <p>Score: ${score}</p>
    <div class="ad-container-result">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-8718440574316852"
             data-ad-slot="5815422742"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
    </div>
    <div class="modal-buttons"></div>
  `;
  gameOverModal.appendChild(modalContent);
  document.body.appendChild(gameOverModal);

  // Undo/Restart 버튼
  const buttonContainer  = modalContent.querySelector('.modal-buttons');
  const modalUndoButton  = document.createElement('button');
  modalUndoButton.id     = 'modal-undo-button';
  modalUndoButton.className = 'action-button';
  modalUndoButton.textContent = `Undo (${undoCount})`; // 남은 Undo 횟수 동기화

  modalUndoButton.addEventListener('click', () => {
    undoMove();
    if (!isGameOver()) {
      document.body.removeChild(gameOverModal);
    }
  });
  buttonContainer.appendChild(modalUndoButton);

  const restartButton = document.createElement('button');
  restartButton.id    = 'modal-restart-button';
  restartButton.className = 'action-button';
  restartButton.textContent = '새로시작 ⏎';
  
  restartButton.addEventListener('click', () => {
    document.body.removeChild(gameOverModal);
    init();
    gameStarted = true;
  });
  buttonContainer.appendChild(restartButton);

  // AdSense
  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.log('AdSense refresh failed:', e);
  }
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

// 최고 레벨 업데이트
function updateBestLevelDisplay() {
  const bestLevelDisplay = document.getElementById('best-level');
  if (bestLevelDisplay) {
    bestLevelDisplay.innerText = bestLevel;
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
  init();
});

// 터치/스와이프 이벤트 리스너 제거
document.removeEventListener('touchstart', handleTouchStart);
document.removeEventListener('touchend', handleTouchEnd);

// 캐로셀 관련 함수들 제거
function handleGesture() {} // 제거
function handleTouchStart() {} // 제거
function handleTouchEnd() {} // 제거

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