// 대신 router.js를 일반 스크립트로 로드

/***************************************************
 * Firebase 초기화 
 ***************************************************/
// [1] Firebase config - Firebase 콘솔에서 발급받은 값으로 교체
const firebaseConfig = {
  apiKey: "AIzaSyA98GLfDWJiLMwqnnHiFCqV9ptfwyyXNrk",
  authDomain: "dadanddotgames.firebaseapp.com",
  databaseURL: "https://dadanddotgames-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dadanddotgames",
  storageBucket: "dadanddotgames.firebasestorage.app",
  messagingSenderId: "205533056842",
  appId: "1:205533056842:web:059897d5da4ab626c6bbb3",
  measurementId: "G-4F9B3DMB67"
};
// [2] 초기화
firebase.initializeApp(firebaseConfig);
// [3] 실시간 DB 참조
const db = firebase.database();

/***************************************************
 * i18n (다국어)
 ***************************************************/
const translations = {
  en: {
    mainTitle: "Number Merge Game",
    gameCount: "Total Played",
    startGame: "Start Now >",
    goal: "Goal",
    score: "Score",
    time: "Time",
    home: "Home",
    hint: "Hint",
    done: "Done!",
    scoreboards: "Scoreboards",
    today: "Today",
    week: "This Week",
    all: "All",
    howToPlay: "How to Play",
    faq: "FAQ",
    about: "About & Updates",
    privacyPolicy: "Privacy Policy",
    footerText: "© 2025 Dadanddot.com",
    // 추가/수정된 key들
    rank: "Rank",
    playCountSubtitle1: "A number puzzle game with a total of ",
    playCountSubtitle2: "plays",
    level1_label: "Level 1 (10pts)",
    level2_label: "Level 2 (11pts)",
    level3_label: "Level 3 (12pts)",
    level4_label: "Level 4 (13pts)",
    level5_label: "Level 5 (14pts)",
    level6_label: "Level 6 (15pts)",
    level7_label: "Level 7 (16pts)",
    level8_label: "Level 8 (17pts)",
    level9_label: "Level 9 (18pts)",
    level10_label: "Level 10 (19pts)",
    levelFinal_label: "Final Level (20pts)",
    howToPlayDetail1: "1. Drag to select numbers in a straight line",
    howToPlayDetail2: "2. If you cannot make the TargetSum, press Done!",
    howToPlayDetail3: "3. Longer lines earn more bonus points!"
  },
  ko: {
    mainTitle: "숫자 결합 게임",
    gameCount: "총 플레이 횟수",
    startGame: "지금 시작하기 >",
    goal: "목표합",
    score: "점수",
    time: "시간",
    home: "홈으로",
    hint: "힌트",
    done: "결!",
    scoreboards: "스코어보드",
    today: "오늘",
    week: "일주일",
    all: "전체",
    howToPlay: "게임 방법",
    faq: "FAQ",
    about: "소개 & 업데이트",
    privacyPolicy: "개인정보 처리방침",
    footerText: "© 2025 Dadanddot.com",
    // 추가/수정된 key들
    rank: "순위",
    playCountSubtitl1: "총 ",
    playCountSubtitl2: "번 플레이를 기록한 숫자 퍼즐게임",
    level1_label: "Level 1 (10점)",
    level2_label: "Level 2 (11점)",
    level3_label: "Level 3 (12점)",
    level4_label: "Level 4 (13점)",
    level5_label: "Level 5 (14점)",
    level6_label: "Level 6 (15점)",
    level7_label: "Level 7 (16점)",
    level8_label: "Level 8 (17점)",
    level9_label: "Level 9 (18점)",
    level10_label: "Level 10 (19점)",
    levelFinal_label: "최종 Level (20점)",
    howToPlayDetail1: "1. 드래그해서 일렬로 숫자들을 선택하세요",
    howToPlayDetail2: "2. 더이상 목표합을 만들 수 없으면 Done!을 누르세요.",
    howToPlayDetail3: "3. 숫자칸이 길수록 보너스점수를 얻을 수 있어요."
  },
  ja: {
    mainTitle: "数字結合ゲーム",
    version: "v.0.7.15",
    gameCount: "総プレイ回数",
    startGame: "今すぐ始める >",
    goal: "目標値",
    score: "スコア",
    time: "時間",
    home: "ホーム",
    hint: "ヒント",
    done: "完了！",
    scoreboards: "スコアボード",
    today: "今日",
    week: "今週",
    all: "全体",
    howToPlay: "遊び方",
    faq: "FAQ",
    about: "紹介 & 更新",
    privacyPolicy: "プライバシーポリシー",
    footerText: "© 2025 Dadanddot.com",
    // 추가분
    rank: "順位",
    playCountSubtitle1: "全",
    playCountSubtitle2: "回遊ばれた数字パズルゲーム",
    level1_label: "Level 1 (10点)",
    level2_label: "Level 2 (11点)",
    level3_label: "Level 3 (12点)",
    level4_label: "Level 4 (13点)",
    level5_label: "Level 5 (14点)",
    level6_label: "Level 6 (15点)",
    level7_label: "Level 7 (16点)",
    level8_label: "Level 8 (17点)",
    level9_label: "Level 9 (18点)",
    level10_label: "Level 10 (19点)",
    levelFinal_label: "最終 Level (20点)",
    howToPlayDetail1: "1. 直線で数字をドラッグして選択",
    howToPlayDetail2: "2. もう合計が作れなければDone!を押す",
    howToPlayDetail3: "3. 長いラインほどボーナス点を獲得"
  },
  zh: {
    mainTitle: "数字合并游戏",
    gameCount: "总游戏次数",
    startGame: "立即开始 >",
    goal: "目标值",
    score: "分数",
    time: "时间",
    home: "首页",
    hint: "提示",
    done: "完成！",
    scoreboards: "排行榜",
    today: "今天",
    week: "本周",
    all: "全部",
    howToPlay: "游戏玩法",
    faq: "常见问题",
    about: "关于 & 更新",
    privacyPolicy: "隐私政策",
    footerText: "© 2025 Dadanddot.com",
    // 추가분
    rank: "排名",
    playCountSubtitle1: "一款总共可玩 ", 
    playCountSubtitle2: " 次游玩的数字益智游戏",
    level1_label: "Level 1 (10分)",
    level2_label: "Level 2 (11分)",
    level3_label: "Level 3 (12分)",
    level4_label: "Level 4 (13分)",
    level5_label: "Level 5 (14分)",
    level6_label: "Level 6 (15分)",
    level7_label: "Level 7 (16分)",
    level8_label: "Level 8 (17分)",
    level9_label: "Level 9 (18分)",
    level10_label: "Level 10 (19分)",
    levelFinal_label: "最终 Level (20分)",
    howToPlayDetail1: "1. 拖动数字成一条线连接",
    howToPlayDetail2: "2. 如果无法再组成目标值，请按Done!",
    howToPlayDetail3: "3. 数字越长，获得的奖励分数越高"
  }
};
let currentLanguage = "ko";

/***************************************************
 * 전역 변수
 ***************************************************/
let totalScore = 0;
let targetSum = 10;   // select에서 읽어온 목표값을 저장
let BOARD_ROWS = 6;   // select에서 읽어온 난이도(행,열) 크기
let BOARD_COLS = 6;
const MIN_NUM = 1;
const MAX_NUM = 9;

let boardData = [];
let startPos = [0,0];
let hintLinePositions = null;
let remainingSeconds = 150;
let timerInterval = null;
let isTimerPaused = false;

// 드래그
let isDragging = false;
let dragPositions = [];

// DOM 캐시
const titleScreenEl = document.getElementById("title-screen");
const countdownOverlayEl = document.getElementById("countdown-overlay");
const countdownNumberEl = document.getElementById("countdown-number");
const gameContainerEl = document.getElementById("game-container");
const scoreTableBody = document.querySelector("#score-table tbody");
const timerEl = document.getElementById("timer");

let scores = []; // 전체 점수 데이터를 저장할 배열

// 전역 변수: 기본 필터 값을 전체로 변경
let currentPeriodFilter = "all";  // 기본 기간 필터 (전체)
let currentGoalFilter = "all";    // 기본 목표합 필터 (전체)

/** 
 * 최초 보드 렌더링 여부 확인 플래그 
 * true면 첫 렌더에서만 샤라락 효과 적용 후 false로 바뀜
 */
let isFirstRender = true;

/***************************************************
 * 게임 카운트 관련 (Firebase)
 ***************************************************/
// 게임 카운트 가져오기 및 표시
function fetchAndDisplayGameCount() {
  const gameCountRef = db.ref('gameCount');
  
  gameCountRef.once('value')
    .then((snapshot) => {
      const count = snapshot.val() || 0;
      const gameCountEl = document.getElementById("game-count-value");
      animateNumber(gameCountEl, 0, count, 1000);
    })
    .catch((error) => {
      console.error("게임 카운트 가져오기 실패:", error);
    });
}

// 게임 플레이 시 게임 카운트 증가
function incrementGameCount() {
  const gameCountRef = db.ref('gameCount');
  
  gameCountRef.transaction((currentCount) => {
    return (currentCount || 0) + 1;
  }, (error, committed, snapshot) => {
    if (error) {
      console.error("게임 카운트 증가 실패:", error);
    } else if (committed) {
      const newCount = snapshot.val();
      const gameCountEl = document.getElementById("game-count-value");
      animateNumber(gameCountEl, gameCountEl.textContent, newCount, 1000);
    }
  });
}



/***************************************************
 * 스코어 관련 (Firebase)
 ***************************************************/

function fetchScoresFromFirebase(callback) {
  db.ref("scores").on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      console.log("저장된 점수가 없습니다.");
      callback([]);
      return;
    }
    scores = Object.values(data);
    callback(scores);
  });
  
}

function displayScores(scoreList) {
  const tbody = document.querySelector("#score-table tbody");
  tbody.innerHTML = ""; // 기존 점수 목록 초기화

  scoreList
    .sort((a, b) => b.score - a.score) // 점수 내림차순 정렬
    .slice(0, 100) // 상위 10개 선택
    .forEach((score, index) => {
      const row = document.createElement("tr");
      
      // Firebase 데이터의 target 값을 데이터 속성으로 설정
      row.setAttribute("data-target", score.target);
      
      // 만약 기간 필터도 사용하려면 timestamp로부터 기간을 계산하여 data-period를 설정하세요.
      // 예) row.setAttribute("data-period", computePeriod(score.timestamp));
      
      const date = new Date(score.timestamp);
      const formattedTime = `${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ` +
                            `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${score.score}</td>
        <td>${score.target}</td>
        <td>${formattedTime}</td>
      `;
      tbody.appendChild(row);
    });
}

// 복합 필터 함수: 두 필터(기간과 목표합)를 모두 반영하여 테이블 행을 보이거나 숨김 처리
function updateCompositeFiltering() {
  const tbody = document.querySelector('#score-table tbody');
  const rows = tbody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let showRow = true;

    // 목표합 필터: data-target 값은 숫자 형태 (예: 10, 11, ...)로 설정되어 있다고 가정합니다.
    const rowTarget = Number(row.getAttribute('data-target'));
    // 현재 목표합 필터가 "all"이 아닐 경우에만 비교합니다.
    if (currentGoalFilter !== 'all') {
      if (!isNaN(rowTarget) && rowTarget !== Number(currentGoalFilter)) {
        showRow = false;
      }
    }

    // 기간 필터 검사 ('all'이면 기간 조건 무시)
    if (showRow && currentPeriodFilter !== 'all') {
      const rowPeriod = row.getAttribute('data-period');
      if (rowPeriod !== currentPeriodFilter) {
        showRow = false;
      }
    }

    row.style.display = showRow ? '' : 'none';
    console.log(`Row ${i} display: ${row.style.display}`);
  }
}
  

// 기간 필터 버튼 클릭 시 호출되는 함수
function filterScores(period) {
  currentPeriodFilter = period;
  // 날짜 필터 그룹의 버튼 active 처리 (data-filter 속성 사용)
  const periodChips = document.querySelectorAll('.ranking-filters .filter-group:first-child .chip');
  periodChips.forEach(chip => {
    if (chip.getAttribute('data-filter') === period) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
  // 두 필터가 모두 반영되도록 업데이트 호출
  updateCompositeFiltering();
}

// 목표합 필터 버튼 클릭 시 호출되는 함수
function filterScoresByGoal(goal) {
  currentGoalFilter = goal;
  // 목표합 필터 그룹의 버튼 active 처리
  const goalChips = document.querySelectorAll('.ranking-filters .filter-group:last-child .chip');
  goalChips.forEach(chip => {
    if (Number(chip.textContent.trim()) === goal) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
  // 두 필터가 모두 반영되도록 업데이트 호출
  updateCompositeFiltering();
}

// 점수 저장
function saveScoreToFirebase(score, diff, target) {
  const newRecord = {
    score: score,
    diff: diff,
    target: target,
    timestamp: Date.now()
  };
  db.ref("scores").push(newRecord)
    .then(() => {
      console.log("점수 저장 성공:", newRecord);
    })
    .catch((error) => {
      console.error("점수 저장 실패:", error);
    });
}

// 스코어보드 렌더링
function renderScoreTable(scoreRecords) {
  if (!scoreTableBody) return;
  scoreTableBody.innerHTML = "";
  
  // 점수 내림차순
  const sorted = scoreRecords.sort((a, b) => b.score - a.score).slice(0, 5);
  
  sorted.forEach((rec, idx) => {
    const tr = document.createElement("tr");
    
    // 순위 셀
    const rankTd = document.createElement("td");
    rankTd.textContent = idx + 1;
    tr.appendChild(rankTd);
    
    // 점수 셀
    const scoreTd = document.createElement("td");
    scoreTd.textContent = rec.score;
    tr.appendChild(scoreTd);
    
    // 타입 셀 (난이도와 목표를 합친 형태)
    const typeTd = document.createElement("td");
    typeTd.textContent = /* `${rec.diff}x${rec.diff},` */ `${rec.target}`;
    tr.appendChild(typeTd);
    
    // 테이블에 행 추가
    scoreTableBody.appendChild(tr);
  });
}

/***************************************************
 * 언어 설정(간단)
 ***************************************************/
function setLanguage(lang) {
  currentLanguage = Object.keys(translations).includes(lang) 
                  ? lang 
                  : 'en'; // 기본값 설정
  applyTranslations();
}

/***************************************************
 * DOMContentLoaded
 ***************************************************/
document.addEventListener("DOMContentLoaded", () => {
  if (window.initRouter) {
    window.initRouter();
  }
  initializeGame(); // 추가된 초기화 함수 호출

  // 언어 선택
  const languageSelect = document.getElementById("language-select");
  languageSelect.addEventListener("change", (e) => {
    setLanguage(e.target.value);
  });

  
  
  // 게임 시작 버튼
  const startGameBtn = document.getElementById("start-game-btn");
  startGameBtn.addEventListener("click", onStartGame);

  

  // Done, Hint 버튼
  document.getElementById("no-more").addEventListener("click", onNoMoreClick);
  document.getElementById("hint-btn").addEventListener("click", onHintClick);

  // 광고 닫기
  document.getElementById("ad-close-btn").addEventListener("click", () => {
    document.getElementById("ad-modal").style.display = "none";
    resumeTimer();
    useHint();
  });

  // 윈도우 리사이즈 -> 보드 사이즈 재조정
  window.addEventListener("resize", resizeBoard);

  // DOM 변수 초기화 (DOMContentLoaded 내부)
  gameOverOverlayEl = document.getElementById('game-over-overlay');
  gameOverMessageEl = document.getElementById('game-over-message');


  fetchAndDisplayGameCount();


  // Firebase에서 스코어 데이터를 불러와 표시
  // fetchScoresFromFirebase(displayScores);

  // 기본 필터 설정: 전체기간, 전체 라운드
  const dateFilterElement = document.getElementById("dateFilter");
  if (dateFilterElement) {
    dateFilterElement.value = "all";
  }
  
  const goalFilterElement = document.getElementById("goalFilter");
  if (goalFilterElement) {
    goalFilterElement.value = "all";
  }
  
  // 페이지 로드 시 기본 필터에 맞게 필터 적용
  applyFilters();
});


// 스코어 데이터 불러오기 + 테이블 렌더
fetchScoresFromFirebase((scores) => {
  document.getElementById("dateFilter").value = "all";
  document.getElementById("goalFilter").value = "all";
  applyFilters();
  displayScores(scores);
});
/***************************************************
 * 게임 초기화
 ***************************************************/
function initializeGame() {
  // DOM 요소 바인딩
  gameOverOverlayEl = document.getElementById('game-over-overlay');
  gameOverMessageEl = document.getElementById('game-over-message');
  
  // 이벤트 리스너 초기화
  document.getElementById("start-game-btn").addEventListener("click", onStartGame);
}

/***************************************************
 * 게임 시작 핸들러 (롤백된 카운트다운 버전)
 ***************************************************/
window.onStartGame = function() {
  const selectedGoal = parseInt(document.getElementById("round-select").value, 10) || 10;
  targetSum = selectedGoal;
  
  // URL 업데이트(옵션)
  window.history.pushState(null, '', `/sd/play/${targetSum}`);

  incrementGameCount();

  // 난이도(6x6)는 고정
  BOARD_ROWS = 6;
  BOARD_COLS = 6;

  // (1) 먼저 타이틀 숨기고 로딩바 오버레이 표시
  titleScreenEl.style.display = "none";
  countdownOverlayEl.style.display = "flex";
  gameContainerEl.style.display = "none";

  showGoalOnCountdownOverlay(targetSum);

  // (2) 로딩바 초기화 → 0%에서 시작
  const loadingBarEl = document.getElementById("loading-bar");
  loadingBarEl.style.width = "0%";

  // (3) 아주 살짝 지연 후 3초 동안 0% → 100%
  setTimeout(() => {
    loadingBarEl.style.width = "100%";
  }, 50);

  /** 
   * (4) 3초 뒤에 오버레이를 닫고, 
   *     그 시점에 initRound()를 호출해야 '최초 렌더링' 시점과 화면 표출 시점 맞춤
   */
  setTimeout(() => {
    countdownOverlayEl.style.display = "none";
    gameContainerEl.style.display = "flex";

    // 이 시점에 보드를 실제로 구성 (최초 렌더) → 샤라락
    initRound();   // ← 여기서 처음 renderBoard()가 실행됨
    startTimer();

  }, 3000);
};

/**
 * 카운트다운 오버레이에서 목표점수를 표시하는 헬퍼 함수
 */
function showGoalOnCountdownOverlay(value) {
  const goalNumEl = document.getElementById("goal-value");
  if (goalNumEl) {
    goalNumEl.textContent = value; 
  }
}

/***************************************************
 * 라운드 초기화
 ***************************************************/
function initRound() {
  totalScore = 0;

  boardData = [];
  for (let r=0; r<BOARD_ROWS; r++){
    let rowArr = [];
    for (let c=0; c<BOARD_COLS; c++){
      let val = Math.floor(Math.random()*(MAX_NUM - MIN_NUM +1)) + MIN_NUM;
      rowArr.push(val);
    }
    boardData.push(rowArr);
  }

  // UI 표시
  document.getElementById("target-number").textContent = targetSum;
  document.getElementById("score").textContent = totalScore;

  // 타이머 리셋
  remainingSeconds = 150;
  isTimerPaused = false;
  updateTimerDisplay();

  // 보드 렌더
  renderBoard();
}

/***************************************************
 * 보드 렌더링 & 셀 이벤트
 ***************************************************/
function renderBoard() {
  const boardEl = document.getElementById("game-board");
  boardEl.innerHTML = "";

  for (let r = 0; r < BOARD_ROWS; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < BOARD_COLS; c++) {
      const td = document.createElement("td");
      const val = boardData[r][c];
      td.textContent = (val !== null) ? val : "";

      // 드래그 이벤트
      td.addEventListener("mousedown", () => startDragSelect(r, c));
      td.addEventListener("mousemove", () => continueDragSelect(r, c));
      td.addEventListener("mouseup", stopDragSelect);

      td.addEventListener("touchstart", (e)=>{
         // 힌트 라인 제거
          if (hintLinePositions) {
            markLine(hintLinePositions, null, "hint-line");
            hintLinePositions = null;
          }
        e.preventDefault();
        startDragSelect(r,c);
      }, {passive:false});
      td.addEventListener("touchmove", (e)=>{
        e.preventDefault();
        const touch = e.touches[0];
        const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
        if (targetEl && targetEl.tagName==="TD") {
          const rowIndex = [...boardEl.querySelectorAll("tr")].indexOf(targetEl.parentNode);
          const colIndex = [...targetEl.parentNode.children].indexOf(targetEl);
          continueDragSelect(rowIndex, colIndex);
        }
      }, {passive:false});
      td.addEventListener("touchend", (e)=>{
        e.preventDefault();
        stopDragSelect();
      }, {passive:false});

      // [핵심] isFirstRender가 true면 샤라락 클래스 부여
      if (isFirstRender) {
        td.classList.add("cell-appear");
        // 순차 딜레이(선택)
        const delay = 0.02 * (r * BOARD_COLS + c);
        td.style.animationDelay = `${delay}s`;
      }

      tr.appendChild(td);
    }
    boardEl.appendChild(tr);
  }

  // 렌더 종료 후 플래그 OFF → 이후에는 샤라락 없음
  if (isFirstRender) {
    isFirstRender = false;
  }

  // 힌트 라인 제거
  if (hintLinePositions) {
    markLine(hintLinePositions, null, "hint-line");
    hintLinePositions = null;
  }

  resizeBoard();
}

/** 보드 리사이즈 계산 */
function resizeBoard() {
  const container = document.querySelector(".board-container");
  if (!container) return;
  
  // (1) .board-container의 실제 픽셀 크기
  const containerWidth = container.clientWidth - 40;
  const containerHeight = container.clientHeight - 40;
  
  // (2) 정사각형 한 변으로 사용할 크기: 화면에서 가능한 공간 중 작은 쪽
  const size = Math.min(containerWidth, containerHeight);

  // (3) 테이블 크기를 직접 지정해서 정사각형 만들기
  const boardEl = document.getElementById("game-board");
  boardEl.style.width = size + "px";
  boardEl.style.height = size + "px";

  // (4) 각 셀의 폭/높이를 계산
  //     borderSpacing, 보더 등을 고려해 최대 셀 크기를 구해줍니다.
  const borderSpacing = 2; // or 1, 원하는 값
  const totalHorizontalSpacing = (BOARD_COLS + 1) * borderSpacing;
  const totalVerticalSpacing = (BOARD_ROWS + 1) * borderSpacing;

  // 만약 행/열이 같은 값이라면 그냥 BOARD_COLS를 쓰셔도 되고,
  // 혹은 열과 행이 다를 수도 있으니 Math.max(...) 를 써도 무방합니다.
  const maxCellSize = Math.floor(
    (size - Math.max(totalHorizontalSpacing, totalVerticalSpacing))
      / Math.max(BOARD_ROWS, BOARD_COLS)
  );

  // (5) 모든 셀에 width/height를 적용하여 "정사각형" 셀 배치
  const tdList = boardEl.querySelectorAll("td");
  tdList.forEach(td => {
    td.style.width = maxCellSize + "px";
    td.style.height = maxCellSize + "px";
  });
}

/***************************************************
 * 드래그 선택
 ***************************************************/
function startDragSelect(r, c) {
  isDragging = true;
  dragPositions = [[r, c]];
  startPos = [r, c];
  markDragSelection(dragPositions);
}
function continueDragSelect(r, c) {
  if (!isDragging) return;
  const newLine = getLinePositions(startPos, [r, c]);
  if (newLine) {
    clearDragSelection();
    dragPositions = newLine;
    markDragSelection(dragPositions);
  }
}
function stopDragSelect() {
  if (!isDragging) return;
  isDragging = false;

  if (dragPositions.length < 2) {
    clearDragSelection();
    showIOSToastMessage(translations[currentLanguage].hintMessage);
  } else {
    const start = dragPositions[0];
    const end = dragPositions[dragPositions.length - 1];
    clearDragSelection();
    checkLine(start, end);
  }
}
function markDragSelection(positions) {
  const trList = document.querySelectorAll("#game-board tr");
  positions.forEach(([r, c], index) => {
    trList[r].children[c].classList.add("drag-select-highlight");
    // 첫 번째 칸 제외, 이후 칸 선택 시마다 햅틱
    if (index > 0) {
      triggerHapticFeedback("selection");
    }
  });
}
function clearDragSelection() {
  const trList = document.querySelectorAll("#game-board tr");
  dragPositions.forEach(([r, c]) => {
    trList[r].children[c].classList.remove("drag-select-highlight");
  });
  dragPositions = [];
}

/***************************************************
 * 라인 검사
 ***************************************************/
function getLinePositions([r1, c1], [r2, c2]) {
  let rd = r2 - r1;
  let cd = c2 - c1;
  if (rd === 0 && cd === 0) return [[r1, c1]];
  // 가로/세로/대각선만
  if (!(rd === 0 || cd === 0 || Math.abs(rd) === Math.abs(cd))) return null;

  function gcd(a, b){return b===0?a:gcd(b,a%b);}
  let g = gcd(Math.abs(rd), Math.abs(cd));
  let stepR = rd / g;
  let stepC = cd / g;

  let pos = [];
  let curR = r1, curC = c1;
  pos.push([curR, curC]);
  let steps = Math.max(Math.abs(rd), Math.abs(cd));
  for (let i=0; i<steps; i++){
    curR += stepR;
    curC += stepC;
    if (curR<0||curR>=BOARD_ROWS||curC<0||curC>=BOARD_COLS) break;
    pos.push([curR, curC]);
  }
  return pos;
}

function checkLine(start, end) {
  const linePositions = getLinePositions(start, end);
  if (!linePositions || linePositions.length < 2) {
    showIOSToastMessage("잘못된 경로!");
    return;
  }

  let sumVal = 0, gapCount = 0;
  linePositions.forEach(([r, c]) => {
    if (boardData[r][c] === null) gapCount++;
    else sumVal += boardData[r][c];
  });

  if (sumVal === targetSum) {
    // 성공 시 햅틱
    triggerHapticFeedback('success');

    const gapBonus = gapCount * 10;
    const lengthBonus = (linePositions.length >= 3) ? (linePositions.length - 2) * 5 : 0;
    const addScore = sumVal + gapBonus + lengthBonus;
    
    const scoreEl = document.getElementById("score");
    const previousScore = parseInt(scoreEl.textContent, 10) || 0;
    const newScore = previousScore + addScore;
    
    // 애니메이션 적용
    animateNumber(scoreEl, previousScore, newScore, 500, () => {
      totalScore = newScore;
    });

    markLine(linePositions, "success-line");
    showFloatingScore(sumVal, lengthBonus, gapBonus, document.getElementById("game-board").rows[end[0]].cells[end[1]]);

    setTimeout(() => {
      removeLineTiles(linePositions);
    }, 600);
  } else {
    markLine(linePositions, "fail-line");
    const failMessage = translations[currentLanguage]?.failSum 
                      || `목표합이 ${targetSum}이어야 합니다!`;
    showIOSToastMessage(failMessage.replace("{target}", targetSum), 1500);
    // 실패시 감점 제거
    /* totalScore = Math.max(0, totalScore  - targetSum );
    document.getElementById("score").textContent = totalScore;
    showFloatingScore("-" + targetSum, end[0], end[1], true); */

    setTimeout(() => {
      markLine(linePositions, null, "fail-line");
    }, 600);
  }
}

function markLine(positions, addClass=null, removeClass=null) {
  const trList = document.querySelectorAll("#game-board tr");
  positions.forEach(([r,c]) => {
    const td = trList[r].children[c];
    if (removeClass) td.classList.remove(removeClass);
    if (addClass) td.classList.add(addClass);
  });
}

function removeLineTiles(linePositions) {
  const trList = document.querySelectorAll("#game-board tr");
  // 애니메이션
  for (const [r,c] of linePositions) {
    let td = trList[r].children[c];
    td.classList.remove("success-line");
    td.classList.add("removing");
  }
  setTimeout(() => {
    for (const [r,c] of linePositions) {
      boardData[r][c] = null;
    }
    renderBoard();
  }, 600);
}

/***************************************************
 * Done 버튼
 ***************************************************/
function onNoMoreClick() {
  let found = findAllPossibleLines();
  if (found.length > 0) {
    // 아직 만들 조합이 남아있을 때: -50점
    totalScore = Math.max(0, totalScore - 50);
    document.getElementById("score").textContent = totalScore;
    showOverlay("아직 조합이 남았습니다! -50점", false);
  } else {
    // 더 이상 조합이 없을 때: 성공!
    // 1) 일단 +100점
    totalScore += 100;

    // 2) 남은 시간 보너스(예: 1초당 10점)
    stopTimer();  // 시간을 멈추고
    const timeBonus = remainingSeconds * 10;

    // 마지막 라운드인지 확인 (목표점수가 20일 때)
    const isFinalRound = targetSum === 20;

    // 오버레이 표시
    showFinalSuccessOverlay(timeBonus, isFinalRound);
  }
}

// 가능한 라인 찾기(간단 brute force)
function findAllPossibleLines() {
  let results = [];
  for (let r=0; r<BOARD_ROWS; r++){
    for (let c=0; c<BOARD_COLS; c++){
      for (let dr=-1; dr<=1; dr++){
        for (let dc=-1; dc<=1; dc++){
          if (dr===0 && dc===0) continue;
          let sumVal = 0, tmpPos=[];
          let nr=r, nc=c;
          for (let step=0; step<BOARD_ROWS*BOARD_COLS; step++){
            if (nr<0||nr>=BOARD_ROWS||nc<0||nc>=BOARD_COLS) break;
            sumVal += (boardData[nr][nc] === null ? 0 : boardData[nr][nc]);
            tmpPos.push([nr,nc]);
            if (sumVal===targetSum && tmpPos.length>1) {
              results.push([...tmpPos]);
            }
            nr+=dr; nc+=dc;
          }
        }
      }
    }
  }
  return results;
}

/***************************************************
 * 오버레이 + Firebase 스코어 저장
 ***************************************************/
function showOverlay(msg, isSuccess){
  const overlayEl = document.getElementById("overlay");
  const overlayMsgEl = document.getElementById("overlay-message");

  overlayMsgEl.innerHTML = `
    <h2>${isSuccess?"결 성공!":"조합 남음!"}</h2>
    <p>${isSuccess?"+100 포인트!":"-50 포인트!"}</p>
    <div style="margin:15px 0;">현재 점수: ${totalScore}</div>
    <button class="modal-button" onclick="closeOverlay()">확인</button>
  `;
  overlayEl.style.display = "flex";

  if(isSuccess){
    // 성공 시 햅틱
    triggerHapticFeedback('done');

    // 스코어 저장
    saveScoreToFirebase(totalScore, BOARD_ROWS, targetSum);
    // 게임센터에 점수 제출
    submitScoreToGameCenter(totalScore);
  }
}

function closeOverlay(){
  document.getElementById("overlay").style.display="none";
  // 추가 조합 검사
  if(findAllPossibleLines().length===0){
    // 라운드 증가 → 새 라운드 init
    currentRound++;
    targetSum = 9 + currentRound;
    initRound();
  }
}

/***************************************************
 * 힌트 (광고 모달)
 ***************************************************/
function onHintClick() {
  pauseTimer();
  document.getElementById("ad-modal").style.display = "flex";
}
function useHint() {
  let lines = findAllPossibleLines();
  if (!lines.length) {
    showIOSToastMessage(translations[currentLanguage].noCombinationToast);
    return;
  }
  hintLinePositions = lines[0];
  markLine(hintLinePositions, "hint-line");
  showIOSToastMessage(translations[currentLanguage].hintMessage);
}

/***************************************************
 * 타이머
 ***************************************************/
function startTimer() {
  stopTimer();
  remainingSeconds = 150;
  isTimerPaused = false;
  timerEl.classList.remove("time-warning");

  timerInterval = setInterval(() => {
    if (!isTimerPaused) {
      remainingSeconds--;
      updateTimerDisplay();

      // 30초 남았을 때 경고
      if (remainingSeconds === 30) {
        timerEl.classList.add("time-warning");
      }

      if (remainingSeconds <= 0) {
        stopTimer();
        remainingSeconds = 0;
        updateTimerDisplay();
        timerEl.classList.remove("time-warning");
        showGameOver();
      }
    }
  }, 1000);
}
function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}
function pauseTimer() {
  isTimerPaused = true;
}
function resumeTimer() {
  isTimerPaused = false;
}
function updateTimerDisplay() {
  const m = Math.floor(remainingSeconds/60);
  const s = remainingSeconds % 60;
  const mm = (m<10 ? "0"+m : m);
  const ss = (s<10 ? "0"+s : s);
  timerEl.textContent = mm+":"+ss;
}

/***************************************************
 * 게임오버
 ***************************************************/
function restartCurrentRound() {
  // 게임 오버 모달 숨기기
  gameOverOverlayEl.style.display = "none";

  // 첫 화면 숨기고 카운트다운 오버레이 보이기
  titleScreenEl.style.display = "none";
  countdownOverlayEl.style.display = "flex";
  gameContainerEl.style.display = "none";

  // **목표점수 동적 표시** (카운트다운 오버레이 내부)
  showGoalOnCountdownOverlay(targetSum);

  // 4) 3초 카운트다운
  setTimeout(() => {
    countdownOverlayEl.style.display = "none";
    gameContainerEl.style.display = "flex";
    initRound();
    startTimer();
  }, 3000); // 3초 후 게임 시작
}

function showGameOver() {
  gameOverOverlayEl.style.display = "flex";
  stopTimer();
  const gameOverEl = document.getElementById("game-over-overlay");
  const gameOverMsg = document.getElementById("game-over-message");
  gameOverMsg.innerHTML = `
    <h2>시간 종료!</h2>
    <table id="score-summary-table">
      <tbody>
        <tr><th>기본 점수</th><td>${totalScore}</td></tr>
        <tr><th>결 성공 보너스</th><td>+ 0</td></tr>
        <tr><th>남은 시간 보너스</th><td>+ <span id="time-bonus-anim">0</span></td></tr>
        <tr class="final-row"><th>최종 점수</th><td><span id="finalScoreValue">${totalScore}</span></td></tr>
      </tbody>
    </table>
    <div class="game-over-buttons">
      <button id="home-button" class="tertiary-button" onclick="backToTitleScreen()">홈으로</button>
      <button id="restart-button" class="primary-button" onclick="restartCurrentRound()">다시 하기</button>
    </div>
  `;

  // 여기서도 스코어 저장
  saveScoreToFirebase(totalScore, BOARD_ROWS, targetSum);
  gameOverEl.style.display = "flex";
}

/***************************************************
 * 첫화면 복귀
 ***************************************************/
function backToTitleScreen() {
  const overlayEl = document.getElementById("overlay");
  const overlayMsgEl = document.getElementById("overlay-message");
  // 게임화면 숨기고, 타이머 중지
  gameContainerEl.style.display = "none";
  document.getElementById("game-over-overlay").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  titleScreenEl.style.display = "flex";
  overlayEl.classList.remove('final-round');
  stopTimer();
  
  const gameOverOverlay = document.getElementById('overlay');
  if (gameOverOverlay) {
    gameOverOverlay.style.display = 'none';
  }
}

/***************************************************
 * 토스트 & 플로팅 점수
 ***************************************************/
function showIOSToastMessage(msg, duration = 2000) {
  const toastEl = document.getElementById("toast-message");
  toastEl.textContent = msg;
  
  // info-box 엘리먼트 위치를 기준으로 top 값을 설정 (없으면 기본 10px)
  const infoBox = document.getElementById("info-box");
  if (infoBox) {
    const infoBoxRect = infoBox.getBoundingClientRect();
    // 인포박스 바로 아래(예: 10px 간격)로 설정
    toastEl.style.top = `${infoBoxRect.bottom + 10}px`;
  } else {
    toastEl.style.top = "10px";
  }
  
  // 슬라이드 다운 효과를 위한 .show 클래스 추가
  toastEl.classList.add("show");
  
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, duration);
}

function showFloatingScore(baseScore, lengthBonus, emptyBonus, tileElement) {
  // 타일의 위치 정보를 가져옵니다.
  const rect = tileElement.getBoundingClientRect();

  // floating score들을 감싸는 컨테이너 생성 (타일 위 중앙에 위치)
  const container = document.createElement('div');
  container.className = 'floating-score-container';
  container.style.position = 'absolute';
  container.style.left = (rect.left + rect.width / 2) + 'px';
  container.style.top = (rect.top - 50) + 'px'; // 타일 위쪽에 약간 더 띄워서 표시
  container.style.transform = 'translateX(-50%)';
  container.style.zIndex = '9999';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';

  // 각 박스가 순차적으로 나타나기 위한 딜레이 (ms)
  const delayIncrement = 300;
  let currentDelay = 0;

  // 기본 획득 점수 박스 생성
  const baseBox = document.createElement('div');
  baseBox.className = 'floating-score-box base';
  baseBox.textContent = baseScore;
  baseBox.style.animationDelay = currentDelay + 'ms';
  container.appendChild(baseBox);
  currentDelay += delayIncrement;

  // 길이 보너스 박스 (문구 없이 '+ 점수'만 표시)
  if (lengthBonus > 0) {
    const bonusBox = document.createElement('div');
    bonusBox.className = 'floating-score-box bonus';
    bonusBox.textContent = /*'+ ' + */ lengthBonus;
    bonusBox.style.animationDelay = currentDelay + 'ms';
    container.appendChild(bonusBox);
    currentDelay += delayIncrement;
  }

  // 빈칸 보너스 박스 (문구 없이 '+ 점수'만 표시)
  if (emptyBonus > 0) {
    const bonusBox = document.createElement('div');
    bonusBox.className = 'floating-score-box bonus';
    bonusBox.textContent = /*'+ ' + */ emptyBonus;
    bonusBox.style.animationDelay = currentDelay + 'ms';
    container.appendChild(bonusBox);
    currentDelay += delayIncrement;
    triggerHapticFeedback("selection");
  }

  // 문서에 추가
  document.body.appendChild(container);

  // 애니메이션 완료 후 컨테이너 제거 (총 애니메이션 기간 1.5초 정도)
  setTimeout(() => {
    container.remove();
  }, 5000);
}

function showFinalScore(score) {
  const finalScoreElement = document.getElementById('final-score-value');
  finalScoreElement.textContent = score;
  finalScoreElement.classList.add('animated');
  
  // 애니메이션이 끝난 후 클래스 제거
  setTimeout(() => {
    finalScoreElement.classList.remove('animated');
  }, 300);
}

// ----------------------------------------------
// [추가1] 남은 시간 보너스 애니메이션용 유틸 함수
// ----------------------------------------------
/**
 * 특정 DOM Element의 숫자를 startValue -> endValue로 일정 시간 동안 서서히 증가시키는 함수
 * @param {HTMLElement} element 
 * @param {number} startValue 
 * @param {number} endValue 
 * @param {number} duration ms 단위
 * @param {function} callback 완료 후 콜백(옵션)
 */
function animateNumber(element, startValue, endValue, duration, callback) {
  const startTime = performance.now();
  
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    let progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);
    const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
    
    element.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      if (callback) callback();
    }
  };

  requestAnimationFrame(animate);
}

/***************************************************
 * 최종 성공 시 (showFinalSuccessOverlay)
 ***************************************************/
function showFinalSuccessOverlay(timeBonus, isFinalRound = false) {
  const overlayEl = document.getElementById("overlay");
  const overlayMsgEl = document.getElementById("overlay-message");

  const baseScore = totalScore - 100; // 이미 +100 더해졌으므로
  
  if (isFinalRound) {
    // 마지막 라운드인 경우
    overlayEl.classList.add('final-round');
    overlayMsgEl.innerHTML = `
      <h2>🎉 축하합니다! 🎉</h2>
      <p>마지막 라운드에서 성공했어요!</p>
      <table id="score-summary-table">
        <tbody>
          <tr><th>기본 점수</th><td>${baseScore}</td></tr>
          <tr><th>결 성공 보너스</th><td>+ 100</td></tr>
          <tr><th>남은 시간 보너스</th><td>+ <span id="time-bonus-anim">0</span></td></tr>
          <tr class="final-row"><th>최종 점수</th><td><span id="finalScoreValue">${totalScore}</span></td></tr>
        </tbody>
      </table>
      <div class="game-over-buttons">
      <button id="home-button" class="tertiary-button" onclick="backToTitleScreen()">홈으로</button>
      <button class="modal-button" onclick="restartGame()">계속 더 진행하기</button>
    </div>
      
    `;
  } else {
    // 일반 라운드인 경우
    overlayEl.classList.remove('final-round');
    overlayMsgEl.innerHTML = `
      <h2>결 성공!</h2>
      <table id="score-summary-table">
        <tbody>
          <tr><th>기본 점수</th><td>${baseScore}</td></tr>
          <tr><th>결 성공 보너스</th><td>+ 100</td></tr>
          <tr><th>남은 시간 보너스</th><td>+ <span id="time-bonus-anim">0</span></td></tr>
          <tr class="final-row"><th>최종 점수</th><td><span id="finalScoreValue">${totalScore}</span></td></tr>
        </tbody>
      </table>
      <button class="modal-button" onclick="closeFinalOverlay()">다음 라운드</button>
    `;
  }

  overlayEl.style.display = "flex";

  // 1) 남은시간 보너스 숫자 애니메이션
  const timeBonusEl = document.getElementById("time-bonus-anim");
  animateNumber(timeBonusEl, 0, timeBonus, 1000, () => {
    // 2) 최종점수 애니메이션 (timeBonus만큼 추가)
    const finalScoreEl = document.getElementById("finalScoreValue");
    const startScore = totalScore;
    const endScore = totalScore + timeBonus;

    animateNumber(finalScoreEl, startScore, endScore, 1000, () => {
      totalScore = endScore;
      document.getElementById("score").textContent = totalScore;
      finalScoreEl.classList.add('animated');
      setTimeout(() => finalScoreEl.classList.remove('animated'), 600);

      // DB에 스코어 저장
      saveScoreToFirebase(totalScore, BOARD_ROWS, targetSum);
    });
  });
}

function restartGame() {
  // 게임 초기화 로직
  currentRound = 1;
  totalScore = 0;
  document.getElementById("score").textContent = totalScore;
  closeFinalOverlay();
  initRound(currentRound);
}

/**
 * 다음 라운드로 넘어가는 로직
 * (closeFinalOverlay → 카운트다운 다시 시작)
 */
function closeFinalOverlay() {
  document.getElementById("overlay").style.display = "none";

  // 목표점수 +1 증가
  targetSum += 1;

  // 첫 화면 숨기고 카운트다운 오버레이 보이기
  titleScreenEl.style.display = "none";
  countdownOverlayEl.style.display = "flex";
  gameContainerEl.style.display = "none";

  // **목표점수 동적 표시** (카운트다운 오버레이 내부)
  showGoalOnCountdownOverlay(targetSum);

  // 4) 3초 카운트다운
  setTimeout(() => {
    countdownOverlayEl.style.display = "none";
    gameContainerEl.style.display = "flex";
    initRound();
    startTimer();
  }, 3000); // 3초 후 게임 시작

}


/**
 * 네이티브 iOS 코드로 햅틱 피드백 메시지를 전송합니다.
 * @param {string} type - 햅틱 타입('selection', 'success', 'done' 등)
 */
function triggerHapticFeedback(type) {
  if (
    window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.hapticFeedback
  ) {
    window.webkit.messageHandlers.hapticFeedback.postMessage(type);
  } else {
    console.warn("Haptic feedback is not supported on this device.");
  }
}

/***************************************************
 * 게임 초기화
 ***************************************************/
function initializeGame() {
  // DOM 요소 바인딩
  gameOverOverlayEl = document.getElementById('game-over-overlay');
  gameOverMessageEl = document.getElementById('game-over-message');
  
  // 이벤트 리스너 초기화
  document.getElementById("start-game-btn").addEventListener("click", onStartGame);
}
// 뒤로가기/앞으로가기 처리
window.addEventListener('popstate', () => {
  initRouter();
});

// 탭 상태 관리 함수 추가
function updateTabState(activeTab) {
  const tabs = document.querySelectorAll('.tab-link');
  tabs.forEach(tab => {
    if (tab.dataset.link === activeTab) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

// 라우터 변경 시 탭 상태 업데이트
function handleRouteChange(route) {
  updateTabState(route);
  // ... 기존 라우터 로직 ...
}

// 탭 클릭 이벤트 리스너 추가
document.querySelectorAll('.tab-link').forEach(tab => {
  tab.addEventListener('click', () => {
    const route = tab.dataset.link;
    handleRouteChange(route);
  });
});

// 초기 로드 시 현재 경로에 맞는 탭 활성화
const currentPath = window.location.pathname;
updateTabState(currentPath);

function applyFilters() {
  const dateFilter = document.getElementById("dateFilter").value;
  const goalFilter = document.getElementById("goalFilter").value;

  // 필터 실행
  const filteredData = scores.filter(function(item) {
    // 1. 기간 필터
    let dateMatch = false;
    const itemDate = new Date(item.timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 00:00으로 초기화해 당일 비교
    const itemDateOnly = new Date(
      itemDate.getFullYear(),
      itemDate.getMonth(),
      itemDate.getDate()
    );
    
    if (dateFilter === "today") {
      // 오늘과 같은 날짜만
      dateMatch = (itemDateOnly.getTime() === today.getTime());
    } else if (dateFilter === "week") {
      // 최근 7일 이내 (오늘 포함)
      const weekAgo = new Date(today);
      // 6일 빼면 오늘 포함 7일간
      weekAgo.setDate(today.getDate() - 6);
      dateMatch = (itemDateOnly >= weekAgo && itemDateOnly <= today);
    } else {
      // 'all'인 경우
      dateMatch = true;
    }

    // 2. 목표합 필터
    let goalMatch = (goalFilter === "all") 
                    || (item.target === parseInt(goalFilter, 10));

    return dateMatch && goalMatch;
  });

  // 필터링된 데이터를 테이블에 렌더
  renderRanking(filteredData);
}

function renderRanking(filteredData) {
  const tbody = document.querySelector("#score-table tbody");
  if (!tbody) {
    console.error("Score table body not found");
    return;
  }
  // 기존 행 초기화
  tbody.innerHTML = "";

  // 점수 높은 순으로 정렬
  const sortedData = filteredData.sort((a, b) => b.score - a.score);

  // 상위 n개만 표시 (예: 100개 또는 필요 개수)
  const limitedData = sortedData.slice(0, 100);

  limitedData.forEach((item, index) => {
    const tr = document.createElement("tr");

    // 순위
    const tdRank = document.createElement("td");
    tdRank.textContent = index + 1;
    tr.appendChild(tdRank);

    // 점수
    const tdScore = document.createElement("td");
    tdScore.textContent = item.score;
    tr.appendChild(tdScore);

    // 목표합
    const tdTarget = document.createElement("td");
    tdTarget.textContent = item.target;
    tr.appendChild(tdTarget);

    // 등록 시간 (item.timestamp)
    const tdTime = document.createElement("td");
    const time = new Date(item.timestamp);
    tdTime.textContent = time.toLocaleString(); 
    tr.appendChild(tdTime);

    tbody.appendChild(tr);
  });
}

function setFilter(filterType, value) {
  if (filterType === 'date') {
    currentPeriodFilter = value;
    // 필요하다면 날짜 필터 UI 업데이트 코드 추가
  } else if (filterType === 'goal') {
    currentGoalFilter = value;
    // 필요하다면 목표합 필터 UI 업데이트 코드 추가
  }
  updateCompositeFiltering();
}

function applyTranslations() {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    } else {
      console.warn(`번역 키 "${key}"가 ${currentLanguage} 언어에 존재하지 않습니다.`);
    }
  });
}

document.addEventListener("DOMContentLoaded", applyTranslations);

// 언어 변경 이벤트 리스너 추가
document.getElementById('language-select').addEventListener('change', function(event) {
  const selectedLanguage = event.target.value;
  changeLanguage(selectedLanguage);
});

// 언어 변경 함수
function changeLanguage(lang) {
  currentLanguage = lang;
  applyTranslations(); // 번역 적용
  saveLanguagePreference(lang); // 언어 설정 저장 (옵션)
}

// 언어 설정 저장 (옵션: localStorage 사용)
function saveLanguagePreference(lang) {
  localStorage.setItem('preferredLanguage', lang);
}

// 초기 언어 설정 로드 (옵션: localStorage 사용)
function loadLanguagePreference() {
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
    document.getElementById('language-select').value = savedLanguage;
    applyTranslations();
  }
}

// DOM 로드 시 초기 언어 설정 적용
document.addEventListener('DOMContentLoaded', function() {
  loadLanguagePreference();
});

