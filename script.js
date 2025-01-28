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
    title: "Number Gyeol!Hab!",
    startGame: "Start Game",
    selectRound: "Target Sum",
    round: "Difficulty",
    goal: "Goal",
    score: "Score",
    myScore: "Score",
    time: "Time",
    noMore: "Done!",
    hint: "Hint",
    restartMenu: "Restart",
    backToTitle: "Go to Title",
    policy: "Privacy Policy",
    policyLink: "pp.html",
    noCombinationToast: "No more combinations, press 'Done!'",
    cancelSelection: "Selection Cancelled",
    success: "Success",
    failSum: "Sum is not {target}",
    hintMessage: "Drag to select multiple numbers",
    overlayClear: "🎉 Success! Score=",
    overlayNext: "Next Step",
    overlayFail: "⚠️ Moves left! Score -100",
    countdownGuide: "Form {target} in lines or diagonals. Bonus for length!",
    timeOverMsg: "Time Over! 😵",
    finalScoreMsg: "Final Score:",
    ok: "OK",
    invalidPath: "Invalid path!",
    mainTitle: "Number Combine!",
    welcomeMessage: "Welcome to the fun and challenging number puzzle game.",
    rules: "Rules",
    scores: "Scores",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    footerText: "&copy; 2023 Number Combine Game. <a href=\"#privacy\">Privacy Policy</a>",
    privacyPolicy: "Privacy Policy"
  },
  ko: {
    title: "숫자 결!합!",
    startGame: "게임 시작",
    selectRound: "목표점수",
    round: "난이도",
    goal: "목표점수",
    score: "점수",
    myScore: "내 점수",
    time: "남은 시간",
    noMore: "결!",
    hint: "힌트",
    restartMenu: "다시 시작하기",
    backToTitle: "첫화면으로 돌아가기",
    policy: "개인정보 취급방침",
    policyLink: "pp.html",
    noCombinationToast: "더 이상의 조합이 없으니 'Done!'버튼을 누르세요",
    cancelSelection: "선택 취소",
    success: "성공",
    failSum: "숫자들의 합이 {target}이 아니에요",
    hintMessage: "드래그하여 숫자를 선택해보세요",
    overlayClear: "🎉 성공! 점수=",
    overlayNext: "다음 단계 진행",
    overlayFail: "⚠️ 아직 가능한 조합이 남아있어요! 점수 -100",
    countdownGuide: "드래그하여 목표합을 만들어보세요!",
    timeOverMsg: "시간 종료! 😵",
    finalScoreMsg: "최종 점수:",
    ok: "확인",
    invalidPath: "잘못된 경로!",
    mainTitle: "숫자 결!합!",
    welcomeMessage: "간단하지만 연산과 집중력이 필요한 숫자 퍼즐 게임",
    rules: "규칙",
    scores: "스코어",
    difficulty: "난이도",
    easy: "쉬움",
    medium: "보통",
    hard: "어려움",
    footerText: "&copy; 2023 숫자 결!합! 게임. 개인정보 보호정책",
    privacyPolicy: "개인정보 보호정책"
  },
  ja: {
    mainTitle: "数字結合!",
    welcomeMessage: "楽しく挑戦的な数字パズルゲームへようこそ。",
    rules: "ルール",
    scores: "スコア",
    difficulty: "難易度",
    easy: "簡単",
    medium: "普通",
    hard: "難しい",
    startGame: "ゲーム開始",
    footerText: "&copy; 2023 数字結合ゲーム. <a href=\"#privacy\">プライバシーポリシー</a>",
    privacyPolicy: "プライバシーポリシー"
  },
  zh: {
    mainTitle: "数字结合!",
    welcomeMessage: "欢迎来到有趣且具有挑战性的数字拼图游戏。",
    rules: "规则",
    scores: "分数",
    difficulty: "难度",
    easy: "简单",
    medium: "中等",
    hard: "困难",
    startGame: "开始游戏",
    footerText: "&copy; 2023 数字结合游戏。<a href=\"#privacy\">隐私政策</a>",
    privacyPolicy: "隐私政策"
  },
  // 다른 언어(ja, zh 등)도 필요시 추가
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
    .slice(0, 5) // 상위 5개 선택
    .forEach((score, index) => {
      const row = document.createElement("tr");
      const date = new Date(score.timestamp);
      const formattedTime = 
        `${(date.getMonth()+1).toString().padStart(2, '')}/${date.getDate().toString().padStart(2, '0')} ` +
        `${date.getHours().toString().padStart(2, '')}:${date.getMinutes().toString().padStart(2, '0')}`;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${score.score}</td>
        <td>${score.target}</td>
        <td>${formattedTime}</td>
      `;
      tbody.appendChild(row);
    });
}




function filterScores(filter) {
  const now = Date.now();
  let filteredScores = [];

  if (filter === 'today') {
    filteredScores = scores.filter(score => {
      const oneDay = 24 * 60 * 60 * 1000;
      return now - score.timestamp < oneDay;
    });
  } else if (filter === 'week') {
    filteredScores = scores.filter(score => {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      return now - score.timestamp < oneWeek;
    });
  } else {
    filteredScores = scores;
  }

  displayScores(filteredScores);
  updateActiveChip(filter);
}

function updateActiveChip(filter) {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.classList.remove('active');
    if (chip.getAttribute('data-filter') === filter) {
      chip.classList.add('active');
    }
  });
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
  currentLanguage = lang;
  document.title = translations[lang].title;
  // 필요시 텍스트들 갱신
}

/***************************************************
 * DOMContentLoaded
 ***************************************************/
document.addEventListener("DOMContentLoaded", () => {
  

  // 언어 선택
  const languageSelect = document.getElementById("language-select");
  languageSelect.addEventListener("change", (e) => {
    setLanguage(e.target.value);
  });

  
// 스코어 데이터 불러오기 + 테이블 렌더
  fetchScoresFromFirebase((scores) => {
    filterScores('today'); // 초기 로드 시 '오늘' 필터 적용
  });
  // 게임 시작 버튼
  const startGameBtn = document.getElementById("start-game-btn");
  startGameBtn.addEventListener("click", onStartGame);

  // 홈으로 돌아가기
  const homeLink = document.getElementById("home-btn");
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    backToTitleScreen();
  });

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

  filterScores('today'); // 기본으로 '오늘'의 기록을 표시
});


/***************************************************
 * 게임 시작 로직
 *  - select에서 선택된 목표점수(예: 10, 11...)를 그대로 targetSum에 넣는다
 *  - select에서 선택된 난이도(6,8,10...)를 BOARD_ROWS/COLS에 넣는다
 ***************************************************/
function onStartGame() {
  // 1) 목표점수
  const selectedGoal = parseInt(document.getElementById("round-select").value, 10) || 10;
  targetSum = selectedGoal;

  // 2) 난이도(보드 크기)
  const diffValue = 6;

  BOARD_ROWS = diffValue;
  BOARD_COLS = diffValue;

  // 3) 첫 화면 숨기고 카운트다운 오버레이 보이기
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

  for (let r=0; r<BOARD_ROWS; r++){
    const tr = document.createElement("tr");
    for (let c=0; c<BOARD_COLS; c++){
      const td = document.createElement("td");
      const val = boardData[r][c];
      td.textContent = (val !== null) ? val : "";

      // 드래그 이벤트
      td.addEventListener("mousedown", () => startDragSelect(r, c));
      td.addEventListener("mousemove", () => continueDragSelect(r, c));
      td.addEventListener("mouseup", stopDragSelect);

      td.addEventListener("touchstart", (e)=>{
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

      tr.appendChild(td);
    }
    boardEl.appendChild(tr);
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
    if (curR<0||curR>=BOARD_ROWS||curC<0||curC>=BOARD_COLS) return null;
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
  linePositions.forEach(([r,c]) => {
    if (boardData[r][c] === null) gapCount++;
    else sumVal += boardData[r][c];
  });

  if (sumVal === targetSum) {
    // 성공 시 햅틱
    triggerHapticFeedback('success');

    const gapBonus = gapCount * 10;
    const lengthBonus = (linePositions.length >= 3)? (linePositions.length - 2) * 5 : 0;
    const addScore = sumVal + gapBonus + lengthBonus;
    totalScore += addScore;

    markLine(linePositions, "success-line");
    document.getElementById("score").textContent = totalScore;
    showFloatingScore("+" + addScore, end[0], end[1], false);

    setTimeout(() => {
      removeLineTiles(linePositions);
    }, 600);
  } else {
    markLine(linePositions, "fail-line");
    const failMsg = translations[currentLanguage].failSum.replace("{target}", targetSum);
    showIOSToastMessage(failMsg, 1500);

    totalScore = Math.max(0, totalScore - targetSum);
    document.getElementById("score").textContent = totalScore;
    showFloatingScore("-" + targetSum, end[0], end[1], true);

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

  // 카운트다운 오버레이 표시
  titleScreenEl.style.display = "none";
  countdownOverlayEl.style.display = "flex";
  gameContainerEl.style.display = "none";

  // 목표점수는 그대로 유지
  showGoalOnCountdownOverlay(targetSum);

  // 3초 카운트다운 시작
  let count = 3;
  countdownNumberEl.textContent = count;
  const countdownTimer = setInterval(() => {
    count--;
    countdownNumberEl.textContent = count;
    if (count <= 0) {
      clearInterval(countdownTimer);
      countdownOverlayEl.style.display = "none";
      gameContainerEl.style.display = "flex";
      initRound();
      startTimer();
    }
  }, 1000);
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
      <button id="home-button" class="secondary-button" onclick="backToTitleScreen()">홈으로</button>
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
  // 게임화면 숨기고, 타이머 중지
  gameContainerEl.style.display = "none";
  document.getElementById("game-over-overlay").style.display = "none";
  titleScreenEl.style.display = "flex";
  stopTimer();
}

/***************************************************
 * 토스트 & 플로팅 점수
 ***************************************************/
function showIOSToastMessage(msg, duration=2000) {
  const toastEl = document.getElementById("toast-message");
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, duration);
}

function showFloatingScore(txt, r, c, isPenalty=false) {
  const boardEl = document.getElementById("game-board");
  const trList = boardEl.querySelectorAll("tr");
  const td = trList[r].children[c];
  const rect = td.getBoundingClientRect();

  const floatEl = document.createElement("div");
  floatEl.classList.add("floating-score");
  floatEl.textContent = txt;
  floatEl.style.color = isPenalty ? "red" : "blue";
  document.body.appendChild(floatEl);

  let x = rect.left + rect.width/2;
  let y = rect.top + rect.height/2;
  floatEl.style.left = x + "px";
  floatEl.style.top  = y + "px";

  setTimeout(() => {
    if(floatEl.parentNode){
      floatEl.parentNode.removeChild(floatEl);
    }
  }, 1000);
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
  let current = startValue;
  const increment = (endValue - startValue) / (duration / 30); // 대략 30 FPS
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= endValue) || (increment < 0 && current <= endValue)) {
      current = endValue;
      clearInterval(timer);
      element.textContent = Math.round(current);
      if (callback) callback();
    } else {
      element.textContent = Math.round(current);
    }
  }, 30);
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
      <button class="modal-button" onclick="restartGame()">계속 더 진행하기</button>
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

  // 다시 카운트다운 오버레이
  titleScreenEl.style.display = "none";
  countdownOverlayEl.style.display = "flex";
  gameContainerEl.style.display = "none";

  // **새로운 targetSum 반영**
  showGoalOnCountdownOverlay(targetSum);

  let count = 3;
  countdownNumberEl.textContent = count;
  const countdownTimer = setInterval(() => {
    count--;
    countdownNumberEl.textContent = count;
    if (count <= 0) {
      clearInterval(countdownTimer);
      countdownOverlayEl.style.display = "none";
      gameContainerEl.style.display = "flex";
      initRound();
      startTimer();
    }
  }, 1000);
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