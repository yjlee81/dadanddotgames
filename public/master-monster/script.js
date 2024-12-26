const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const restartButton = document.getElementById('restart-button');
const modal = document.getElementById('modal');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const mergeSound = document.getElementById('mergeSound');

let grid = [];
let score = 0;
let bestScore = 0;
let gameStarted = false;
let difficultyLevel = 'normal';
let currentGameMaxLevel = 1;
let tileIdCounter = 0; // 타일 ID를 위한 카운터 추가
let nextTileValue = 2; // 기본값 설정

// Initialize the grid with null values
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
  initGrid();
  score = 0;
  currentGameMaxLevel = 1;
  scoreDisplay.innerText = score;
  updateBestScoreDisplay();
  gameBoard.innerHTML = '';
  createPlaceholders();
  addStartingTiles();
  updateBoard();
  updateNextTileDisplay();
}

function createPlaceholders() {
  // Create placeholders for the grid background
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const placeholder = document.createElement('div');
      placeholder.classList.add('tile-placeholder');
      placeholder.style.left = (col * 110 + 10) + 'px';
      placeholder.style.top = (row * 110 + 10) + 'px';
      gameBoard.appendChild(placeholder);
    }
  }
}

function addStartingTiles() {
  let startingTiles = 2;
  if (difficultyLevel === 'easy') startingTiles = 4;
  if (difficultyLevel === 'hard') startingTiles = 2;
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
  
  // 다음 타일 값 설정: Lv.1, Lv.2, Lv.3 중 하나
  const possibleValues = [2, 4, 8];
  const newValue = nextTileValue;
  grid[randomPos.row][randomPos.col] = {
    value: newValue,
    isNew: true,
    merged: false,
    id: tileIdCounter++
  };

  // 다음에 나올 타일 값 설정
  nextTileValue = possibleValues[Math.floor(Math.random() * possibleValues.length)];
  updateNextTileDisplay();
}

function updateNextTileDisplay() {
  const nextTileElement = document.querySelector('.next-tile');
  const nextTileLevelElement = document.querySelector('.tile-level');
  const level = Math.log2(nextTileValue);
  const emojis = ["🥚", "🐣", "🐥", "🐤", "🦅", "🦉", "🦇", "🐲", "🐉", "🌟", "👑"];
  
  // 타일 미리보기 업데이트
  const previewElement = nextTileElement.querySelector('.tile-preview');
  previewElement.textContent = emojis[level - 1];
  
  // 레벨 표시 업데이트
  nextTileLevelElement.textContent = `Lv.${level}`;
  
  // 배경색 업데이트
  nextTileElement.setAttribute('data-level', level);
  nextTileElement.style.backgroundColor = getTileColor(nextTileValue);
}

function getTileColor(value) {
  switch (value) {
    case 2: return '#FFF5E6';
    case 4: return '#FFE4CC';
    case 8: return '#FFD4B3';
    case 16: return '#FFC299';
    case 32: return '#FFB380';
    case 64: return '#FFA366';
    case 128: return '#FF944D';
    case 256: return '#FF8533';
    case 512: return '#FF751A';
    case 1024: return '#FF6600';
    case 2048: return '#FF4D00';
    default: return '#CCC0B3';
  }
}

// 초기화 시 다음 타일 표시 업데이트
updateNextTileDisplay();

function updateBoard() {
    const currentTileIds = new Set();

    if (!gameStarted) return;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col]) {
                const id = grid[row][col].id;
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
                const targetTop = (row * 110 + 10) + 'px';

                // 재 위치와 목표 위치가 다른 경우에만 이동 클래스 추가
                if (tile.style.left !== targetLeft || tile.style.top !== targetTop) {
                    tile.classList.add('moving');
                }

                tile.style.left = targetLeft;
                tile.style.top = targetTop;

                // 이동이 완료된 후 moving 클래스 제거
                setTimeout(() => {
                    tile.classList.remove('moving');
                }, 150);

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
  let moved = false;

  for (let i = 0; i < 4; i++) {
    let line = [];
    for (let j = 0; j < 4; j++) {
      let row = direction === 'ArrowUp' || direction === 'ArrowDown' ? j : i;
      let col = direction === 'ArrowUp' || direction === 'ArrowDown' ? i : j;
      if (direction === 'ArrowDown') row = 3 - j;
      if (direction === 'ArrowRight') col = 3 - j;
      let cell = grid[row][col];
      if (cell) {
        line.push({ ...cell });
      }
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
        
        // 점수 계산을 단순화
        let points = Math.log2(newValue) - 1; // 2 -> 1점, 4 -> 2점, 8 -> 3점, 16 -> 4점
        score += points;

        mergedLine.push({
          value: newValue,
          merged: true,
          isNew: false,
          id: tileIdCounter++ // 병합된 타일에 새로운 ID 할당
        });
        if (mergeSound) {
          mergeSound.currentTime = 0; // 소리를 처음부터 재생
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
      let row = direction === 'ArrowUp' || direction === 'ArrowDown' ? j : i;
      let col = direction === 'ArrowUp' || direction === 'ArrowDown' ? i : j;
      if (direction === 'ArrowDown') row = 3 - j;
      if (direction === 'ArrowRight') col = 3 - j;

      const newCell = mergedLine[j];
      const oldCell = grid[row][col];

      if (oldCell && (!newCell || oldCell.id !== newCell.id || oldCell.value !== newCell.value)) {
        moved = true;
      }

      grid[row][col] = newCell;
    }
  }

  if (moved) {
    addNewTile();
    updateBoard();
    scoreDisplay.innerText = score;
    updateBestScore();

    if (isGameOver()) {
      setTimeout(() => {
        alert('Game Over!');
      }, 300);
    }
  }
}


function isGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!grid[row][col]) return false;
      let currentValue = grid[row][col].value;
      if (
        (col < 3 && grid[row][col + 1] && grid[row][col + 1].value === currentValue) ||
        (row < 3 && grid[row + 1][col] && grid[row + 1][col].value === currentValue)
      ) {
        return false;
      }
    }
  }
  return true;
}

function updateBestScore() {
  const bestRecord = getBestScore();
  if (score > bestRecord.score) {
    // 현재 게임의 최고 레벨 계산
    let maxLevel = currentGameMaxLevel;  // 현재 게임의 최고 레벨 사용
    
    // 최고 기록 저장
    const newRecord = {
      score: score,
      level: maxLevel
    };
    localStorage.setItem('bestScore', JSON.stringify(newRecord));
    updateBestScoreDisplay(newRecord);
  }
}

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

function updateBestScoreDisplay(record = getBestScore()) {
  if (!record || record.score === 0) {
    bestScoreDisplay.innerHTML = '- <span class="best-level">(-)</span>';
  } else {
    bestScoreDisplay.innerHTML = `${record.score} <span class="best-level">(Lv.${record.level})</span>`;
  }
}

document.addEventListener('keydown', event => {
  if (!gameStarted) return;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    moveTiles(event.key);
  }
});

restartButton.addEventListener('click', () => {
  init();
});

// Touch controls
let touchStartX;
let touchStartY;

document.addEventListener('touchstart', function(e) {
  if (!gameStarted) return;
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
  if (!gameStarted) return;
  let touchEndX = e.changedTouches[0].screenX;
  let touchEndY = e.changedTouches[0].screenY;
  handleGesture(touchStartX, touchStartY, touchEndX, touchEndY);
});

function handleGesture(startX, startY, endX, endY) {
  let dx = endX - startX;
  let dy = endY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) {
      moveTiles('ArrowRight');
    } else if (dx < -30) {
      moveTiles('ArrowLeft');
    }
  } else {
    if (dy > 30) {
      moveTiles('ArrowDown');
    } else if (dy < -30) {
      moveTiles('ArrowUp');
    }
  }
}

// Particle effects
function createParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = particle.style.height = Math.random() * 10 + 'px';
    particle.style.background = 'rgba(255, 255, 255,' + Math.random() + ')';
    gameBoard.appendChild(particle);

    // Remove particle after animation
    particle.addEventListener('animationend', () => {
      gameBoard.removeChild(particle);
    });
  }
}

// Show the modal on load
window.onload = () => {
    modal.style.display = 'block';
    initSound();
  };

// 다국어 지원을 위한 텍스트 데이터
const translations = {
  en: {
    title: "Monster Master",
    currentScore: "Score",
    bestScore: "Best",
    restart: "Restart",
    welcome: "How to Play",
    instructions: "Use arrow keys to merge monsters and reach the master level!",
    startGame: "Start Game ⏎"
  },
  ko: {
    title: "Monster Master",
    currentScore: "현재 점수",
    bestScore: "최고점수",
    restart: "다시하기",
    welcome: "게임방법",
    instructions: "키를 이용해 몬스터를 합쳐 마스터 레벨에 도달하세요!",
    startGame: "게임 시작 ⏎"
  },
  ja: {
    title: "Monster Master",
    currentScore: "スコア",
    bestScore: "ベスト",
    restart: "リスタート",
    welcome: "遊び方",
    instructions: "キーを使ってモンスターをマージしてマスターレベルに到達しよう！",
    startGame: "ゲームスタート ⏎"
  },
  zh: {
    title: "Monster Master",
    currentScore: "当前分数",
    bestScore: "最高分",
    restart: "重新开始",
    welcome: "游戏方法",
    instructions: "使用方向键合并怪物，达到大师级别！",
    startGame: "开始游戏 ⏎"
  }
};

// Function to update translations based on selected language
function updateTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    element.textContent = translations[lang][key];
  });
}

// Event listener for language selection
document.getElementById("language-select").addEventListener("change", (event) => {
  const selectedLang = event.target.value;
  updateTranslations(selectedLang);
});

// Initialize with default language
updateTranslations("ko");

// 언어 변경 함수
function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    localStorage.setItem('preferred-language', lang);
}

// 어 선택 이벤트 리스너
document.getElementById('language-select').addEventListener('change', (e) => {
    changeLanguage(e.target.value);
});

// 페이지 로드 시 저장된 언어 설정 적용
window.addEventListener('load', () => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'en';
    document.getElementById('language-select').value = savedLanguage;
    changeLanguage(savedLanguage);
});

// 게임 시작 버튼 이벤트 리너
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('game-guide').style.display = 'none';
    startGame();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && modal.style.display !== 'none') {
        startGame();
    }
});

function startGame() {
    gameStarted = true;
    difficultyLevel = 'normal'; // 기본 난이도 설정
    init();
}

// 방향키 UI 클릭 이벤트 추가
document.querySelectorAll('.arrow-key').forEach(key => {
  key.addEventListener('click', () => {
    if (!gameStarted) return;
    
    const direction = key.classList.contains('up') ? 'ArrowUp'
      : key.classList.contains('down') ? 'ArrowDown'
      : key.classList.contains('left') ? 'ArrowLeft'
      : 'ArrowRight';
      
    moveTiles(direction);
  });
});

// 레벨 달성 알림을 위한 함수 추가
function showLevelAchievement(level) {
    const achievementModal = document.createElement('div');
    achievementModal.className = 'achievement-modal';
    
    const content = document.createElement('div');
    content.className = 'achievement-content';
    
    const emoji = document.createElement('div');
    emoji.className = 'achievement-emoji';
    // 레벨에 따른 이모지 설정
    const emojis = ["🥚", "🐣", "🐥", "🐤", "🦅", "🦉", "🦇", "🐲", "🐉", "🌟", "👑"];
    emoji.textContent = emojis[level - 1];
    
    const text = document.createElement('div');
    text.className = 'achievement-text';
    text.textContent = `Level ${level} ${level === 11 ? 'Master' : 'Monster'}!`;
    
    content.appendChild(emoji);
    content.appendChild(text);
    achievementModal.appendChild(content);
    document.body.appendChild(achievementModal);
    
    // 애니메이션 클래스 추가
    setTimeout(() => achievementModal.classList.add('show'), 100);
    
    // 1.5초 후 제거
    setTimeout(() => {
        achievementModal.classList.remove('show');
        setTimeout(() => achievementModal.remove(), 300);
    }, 1500);
}

// 게임 시작 시 운드 초기화 함수 추가
function initSound() {
  // iOS 등 모바일에서 소리 재생을 위한 처리
  document.addEventListener('touchstart', function() {
    if (mergeSound) {
      mergeSound.play().then(() => {
        mergeSound.pause();
        mergeSound.currentTime = 0;
      }).catch(e => console.log('Sound initialization failed:', e));
    }
  }, { once: true });
}

// 게임 가이드 관련 요소
const gameGuide = document.getElementById('game-guide');
const startButton = document.getElementById('start-button');

// 엔터키 이벤트 리스너 추가
document.addEventListener('keydown', function(event) {
    // 게임 가이드가 표시되어 있을 때만 엔터키 동작
    if (gameGuide.style.display !== 'none' && event.key === 'Enter') {
        startButton.click(); // 시작 버튼 클릭 이벤트 발생
    }
});

// 시작 버튼 클릭 이벤트
startButton.addEventListener('click', function() {
    gameGuide.style.display = 'none';
    startGame();
});

// 페이지 로드 시 시작 버튼에 포커스
window.addEventListener('load', function() {
    startButton.focus();
});