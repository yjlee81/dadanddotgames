/***************************************************
 * i18n (게임명, 라운드→난이도, etc.)
 ***************************************************/
const translations = {
  en: {
    title: "Number Gyeol!Hab!",
    startGame: "Start Game",
    selectRound: "Goal",
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
    statusStart: "Difficulty {round} Start (Target={target}, Score={score})",
    ok: "OK",
    invalidPath: "Invalid path!",
    countdownGuide: "Form {target} in lines or diagonals. Bonus for length!",
    timeOverMsg: "Time Over! 😵",
    finalScoreMsg: "Final Score:",
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
    noCombinationToast: "더 이상의 조합이 없으니 '결!' 버튼을 누르세요.",
    cancelSelection: "선택 취소",
    success: "성공",
    failSum: "숫자들의 합이 {target}이 아니에요",
    hintMessage: "드래그하여 숫자를 선택해보세요",
    overlayClear: "🎉 성공! 점수=",
    overlayNext: "다음 단계 진행",
    overlayFail: "⚠️ 아직 가능한 조합이 남아있어요! 점수 -100",
    statusStart: "난이도 {round} 시작 (목표={target}, 점수={score})",
    ok: "확인",
    invalidPath: "잘못된 경로!",
    countdownGuide: "드래그로 일렬/대각선을 만들어 목표점수를 달성하세요",
    timeOverMsg: "시간 종료! 😵",
    finalScoreMsg: "최종 점수:",
  },
  // (이하 ja, zh 생략 or 기존)
};

/***************************************************
 * 전역 변수
 ***************************************************/
let currentLanguage = "ko";
let currentRound = 1;
let totalScore = 0;
let targetSum = 10;
let BOARD_ROWS = 6;
let BOARD_COLS = 6;
const MIN_NUM = 1;
const MAX_NUM = 9;

let boardData = [];
let startPos = [0, 0];
let hintLinePositions = null;
let remainingSeconds = 120;
let timerInterval = null;
let isTimerPaused = false;

// 오늘(브라우저 세션) 최고 기록, 전체(로컬) 최고 기록
let todayBest = { score: 0, difficulty: "-", target: "-" };
let myBest = { score: 0, difficulty: "-", target: "-" };

/***************************************************
 * DOM 참조
 ***************************************************/
let titleScreenEl,
    countdownOverlayEl,
    countdownNumberEl,
    guideMessageEl,
    gameContainerEl,
    difficultyLabelEl,
    targetNumberEl,
    scoreEl,
    timerEl,
    boardEl,
    noMoreBtn,
    hintBtn,
    overlayEl,
    overlayMsgEl,
    adModalEl,
    toastEl,
    gameOverOverlayEl,
    gameOverMessageEl;

document.addEventListener("DOMContentLoaded", () => {
  // 요소 참조
  titleScreenEl = document.getElementById("titleScreen");
  countdownOverlayEl = document.getElementById("countdownOverlay");
  countdownNumberEl = document.getElementById("countdownNumber");
  guideMessageEl = document.getElementById("guideMessage");
  gameContainerEl = document.getElementById("gameContainer");

  difficultyLabelEl = document.getElementById("difficultyLabel");
  targetNumberEl = document.getElementById("target-number");
  scoreEl = document.getElementById("score");
  timerEl = document.getElementById("timer");
  boardEl = document.getElementById("game-board");

  noMoreBtn = document.getElementById("no-more");
  hintBtn = document.getElementById("hint-btn");
  overlayEl = document.getElementById("overlay");
  overlayMsgEl = document.getElementById("overlay-message");
  
  adModalEl = document.getElementById("ad-modal");
  toastEl = document.getElementById("toast-message");
  
  gameOverOverlayEl = document.getElementById("gameOverOverlay");
  gameOverMessageEl = document.getElementById("gameOverMessage");

  // 언어
  const languageSelect = document.getElementById("language-select");
  languageSelect.addEventListener("change", (event) => {
    setLanguage(event.target.value);
  });
  setLanguage(languageSelect.value);

  // 첫화면 "게임 시작"
  const startGameBtn = document.getElementById("start-game-btn");
  startGameBtn.addEventListener("click", onStartGame);

  // 홈 버튼 (3dot → 홈아이콘)
  const homeButtonEl = document.getElementById("home-button");
  homeButtonEl.addEventListener("click", () => {
    backToTitleScreen();
  });

  // 결(Done), 힌트 버튼
  noMoreBtn.addEventListener("click", onNoMoreClick);
  hintBtn.addEventListener("click", onHintClick);

  // 광고 닫기
  const adCloseBtn = document.getElementById("ad-close-btn");
  if (adCloseBtn) {
    adCloseBtn.addEventListener("click", () => {
      adModalEl.style.display = "none";
      resumeTimer();
    });
  }

  // Ripple
  initRippleEffect();

  // 첫화면 노출
  titleScreenEl.style.display = "flex";
  gameContainerEl.style.display = "none";
  countdownOverlayEl.style.display = "none";

  // 최고기록 초기 세팅
  initBestScoresUI();
});

/***************************************************
 * 언어 설정
 ***************************************************/
function setLanguage(lang) {
  currentLanguage = lang;
  document.title = translations[lang].title;

  const titleLabelEl = document.getElementById("titleLabel");
  const startBtnEl = document.getElementById("start-game-btn");
  const roundSelectLabelEl = document.getElementById("roundSelectLabel");
  const difficultyLabelEl = document.getElementById("difficultyLabel");
  
  if (titleLabelEl) titleLabelEl.textContent = translations[lang].title;
  if (startBtnEl) startBtnEl.textContent = translations[lang].startGame;
  if (roundSelectLabelEl) roundSelectLabelEl.textContent = translations[lang].selectRound;
  if (difficultyLabelEl) difficultyLabelEl.textContent = translations[lang].round;

  // 상단바
  const targetLabelEl = document.getElementById("target-label");
  const scoreLabelEl = document.getElementById("score-label");
  const timerLabelEl = document.getElementById("timer-label");
  if (targetLabelEl) targetLabelEl.textContent = translations[lang].goal;
  if (scoreLabelEl) scoreLabelEl.textContent = translations[lang].myScore;
  if (timerLabelEl) timerLabelEl.textContent = translations[lang].time;

  // 하단 버튼
  if (noMoreBtn) noMoreBtn.textContent = translations[lang].noMore;
  if (hintBtn) hintBtn.textContent = translations[lang].hint;

  // 카운트다운
  if (guideMessageEl) guideMessageEl.textContent = translations[lang].countdownGuide;
}

/***************************************************
 * 최고기록 카드 UI 초기화
 ***************************************************/
function initBestScoresUI() {
  // 간단히 localStorage로부터 'myBestScore' 등 가져와서 설정 가능
  // 여기서는 예시로 'myBestScore', 'myBestDiff', 'myBestTarget' 값만
  let savedMyBestScore = parseInt(localStorage.getItem("myBestScore") || "0", 10);
  let savedMyBestDiff = localStorage.getItem("myBestDifficulty") || "-";
  let savedMyBestTarget = localStorage.getItem("myBestTarget") || "-";
  
  myBest = {
    score: savedMyBestScore,
    difficulty: savedMyBestDiff,
    target: savedMyBestTarget
  };

  // 오늘 최고기록은 세션(날짜 달라지면 초기화) or 그냥 메모리에서 관리
  todayBest = { score: 0, difficulty: "-", target: "-" };

  updateBestScoreCards();
}

function updateBestScoreCards() {
  // 오늘의 최고 기록
  document.getElementById("today-best-score").textContent = `점수: ${todayBest.score}`;
  document.getElementById("today-best-difficulty").textContent = `난이도: ${todayBest.difficulty}`;
  document.getElementById("today-best-target").textContent = `목표점수: ${todayBest.target}`;

  // 내 최고 기록
  document.getElementById("my-best-score").textContent = `점수: ${myBest.score}`;
  document.getElementById("my-best-difficulty").textContent = `난이도: ${myBest.difficulty}`;
  document.getElementById("my-best-target").textContent = `목표점수: ${myBest.target}`;
}

/***************************************************
 * 게임 시작
 ***************************************************/
function onStartGame() {
  const roundSelect = document.getElementById("round-select");
  const selectedRound = parseInt(roundSelect.value, 10) || 1;
  currentRound = selectedRound;

  const difficultySelect = document.getElementById("difficulty-select");
  const selectedDifficulty = parseInt(difficultySelect.value, 10) || 6;

  BOARD_ROWS = selectedDifficulty;
  BOARD_COLS = selectedDifficulty;

  titleScreenEl.style.display = "none";
  countdownOverlayEl.style.display = "flex";
  gameContainerEl.style.display = "none";

  let count = 3;
  countdownNumberEl.textContent = count;
  const countdownTimer = setInterval(() => {
    count--;
    countdownNumberEl.textContent = count;
    if (count <= 0) {
      clearInterval(countdownTimer);
      countdownOverlayEl.style.display = "none";
      gameContainerEl.style.display = "flex";
      initRound(currentRound);
      startTimer();
    }
  }, 1000);
}

function backToTitleScreen() {
  gameContainerEl.style.display = "none";
  titleScreenEl.style.display = "flex";
  stopTimer();
  currentRound = 1;
  totalScore = 0;
}

/***************************************************
 * 라운드 초기화
 ***************************************************/
function initRound(round) {
  currentRound = round;
  totalScore = 0;
  targetSum = getTargetForRound(round);

  boardData = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    let rowArr = [];
    for (let c = 0; c < BOARD_COLS; c++) {
      let val = Math.floor(Math.random() * (MAX_NUM - MIN_NUM + 1)) + MIN_NUM;
      rowArr.push(val);
    }
    boardData.push(rowArr);
  }

  updateInfoBar();
  renderBoard();

  remainingSeconds = 120;
  updateTimerDisplay();
  hintLinePositions = null;
  startPos = null;
}

function getTargetForRound(round) {
  return 10 + (round - 1);
}

function updateInfoBar() {
  difficultyLabelEl.textContent =
    translations[currentLanguage].round + " " + currentRound + ` (${BOARD_ROWS}x${BOARD_COLS})`;

  targetNumberEl.textContent = targetSum;
  scoreEl.textContent = totalScore;
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < BOARD_ROWS; r++) {
    let tr = document.createElement("tr");
    for (let c = 0; c < BOARD_COLS; c++) {
      let td = document.createElement("td");
      let val = boardData[r][c];
      if (val === null) {
        td.textContent = "";
        td.classList.add("hidden-tile");
      } else {
        td.textContent = val;
      }

      td.addEventListener("mousedown", () => startDragSelect(r, c));
      td.addEventListener("mousemove", () => continueDragSelect(r, c));
      td.addEventListener("mouseup", () => stopDragSelect());

      // 터치
      td.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startDragSelect(r, c);
      }, { passive: false });
      td.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
        if (targetEl && targetEl.tagName === "TD") {
          const rowIndex = [...boardEl.querySelectorAll("tr")].indexOf(targetEl.parentNode);
          const colIndex = [...targetEl.parentNode.children].indexOf(targetEl);
          continueDragSelect(rowIndex, colIndex);
        }
      }, { passive: false });
      td.addEventListener("touchend", (e) => {
        e.preventDefault();
        stopDragSelect();
      }, { passive: false });

      tr.appendChild(td);
    }
    boardEl.appendChild(tr);
  }

  // 힌트 라인
  if (hintLinePositions) {
    markLine(hintLinePositions, "hint-line");
  }
}

/***************************************************
 * 드래그 선택
 ***************************************************/
let isDragging = false;
let dragPositions = [];

function startDragSelect(r, c) {
  isDragging = true;
  dragPositions = [[r, c]];
  startPos = [r, c];
  markDragSelection(dragPositions);
}

function continueDragSelect(r, c) {
  if (!isDragging) return;
  const newLinePositions = getLinePositions(startPos, [r, c]);
  if (newLinePositions) {
    clearDragSelection();
    dragPositions = newLinePositions;
    markDragSelection(dragPositions);
  }
}

function stopDragSelect() {
  if (!isDragging) return;
  isDragging = false;

  if (!dragPositions || dragPositions.length < 1) {
    clearDragSelection();
    showIOSToastMessage(translations[currentLanguage].hintMessage);
  } else if (dragPositions.length === 1) {
    clearDragSelection();
    showIOSToastMessage(translations[currentLanguage].hintMessage);
  } else {
    const start = dragPositions[0];
    const end = dragPositions[dragPositions.length - 1];
    clearDragSelection();
    checkLine(start, end);
  }
}

function clearDragSelection() {
  const trList = boardEl.querySelectorAll("tr");
  dragPositions.forEach(([r, c]) => {
    const td = trList[r].querySelectorAll("td")[c];
    td.classList.remove("drag-select-highlight");
  });
  dragPositions = [];
}

function markDragSelection(linePositions) {
  const trList = boardEl.querySelectorAll("tr");
  linePositions.forEach(([r, c]) => {
    const td = trList[r].querySelectorAll("td")[c];
    td.classList.add("drag-select-highlight");
  });
}

/***************************************************
 * 라인 검사
 ***************************************************/
function checkLine(start, end) {
  const linePositions = getLinePositions(start, end);
  if (!linePositions || linePositions.length < 2) {
    showIOSToastMessage(translations[currentLanguage].invalidPath);
    return;
  }
  if (hintLinePositions) {
    markLine(hintLinePositions, null, "hint-line");
    hintLinePositions = null;
  }

  let sumVal = 0;
  let gapCount = 0;
  for (const [rr, cc] of linePositions) {
    if (boardData[rr][cc] === null) {
      gapCount++;
    } else {
      sumVal += boardData[rr][cc];
    }
  }

  if (sumVal === targetSum) {
    let gapBonus = gapCount * 10;
    let lengthBonus = (linePositions.length >= 3) ? (linePositions.length - 2) * 5 : 0;
    let addScore = sumVal + gapBonus + lengthBonus;

    markLine(linePositions, "success-line");
    totalScore += addScore;
    updateInfoBar();
    showFloatingScore("+" + addScore, end[0], end[1], false);

    setTimeout(() => {
      removeLineTiles(linePositions);
    }, 600);
  } else {
    const failMessage = translations[currentLanguage].failSum.replace("{target}", targetSum);
    showIOSToastMessage(failMessage, 1500);
    markLine(linePositions, "fail-line");
    setTimeout(() => {
      markLine(linePositions, null, "fail-line");
    }, 600);
    totalScore = Math.max(0, totalScore - targetSum);
    updateInfoBar();
    showFloatingScore("-" + targetSum, end[0], end[1], true);
  }
}

function getLinePositions([r1, c1], [r2, c2]) {
  let rd = r2 - r1;
  let cd = c2 - c1;
  if (rd === 0 && cd === 0) {
    return [[r1, c1]];
  }
  if (!(rd === 0 || cd === 0 || Math.abs(rd) === Math.abs(cd))) {
    return null;
  }
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  let g = gcd(Math.abs(rd), Math.abs(cd));
  let stepR = rd / g;
  let stepC = cd / g;
  let pos = [];
  let curR = r1, curC = c1;
  pos.push([curR, curC]);
  let steps = Math.max(Math.abs(rd), Math.abs(cd));
  for (let i = 0; i < steps; i++) {
    curR += stepR;
    curC += stepC;
    if (curR < 0 || curR >= BOARD_ROWS || curC < 0 || curC >= BOARD_COLS) {
      return null;
    }
    pos.push([curR, curC]);
  }
  return pos;
}

function markLine(positions, addClass = null, removeClass = null) {
  let trList = boardEl.querySelectorAll("tr");
  positions.forEach(([r, c]) => {
    let td = trList[r].querySelectorAll("td")[c];
    if (removeClass) {
      td.classList.remove(removeClass);
    }
    if (addClass) {
      td.classList.add(addClass);
    }
  });
}

function removeLineTiles(linePositions) {
  let trList = boardEl.querySelectorAll("tr");
  for (const [r, c] of linePositions) {
    let td = trList[r].querySelectorAll("td")[c];
    td.classList.remove("success-line");
    td.classList.add("removing");
  }
  setTimeout(() => {
    for (const [r, c] of linePositions) {
      boardData[r][c] = null;
    }
    renderBoard();
  }, 600);
}

/***************************************************
 * 결(Done) 버튼
 ***************************************************/
function onNoMoreClick() {
  let found = findAllPossibleLines();
  if (found.length > 0) {
    totalScore = Math.max(0, totalScore - 100);
    updateInfoBar();
    showOverlay(translations[currentLanguage].overlayFail, false);
  } else {
    totalScore += 100;
    updateInfoBar();
    showOverlay(translations[currentLanguage].overlayClear + totalScore + "<br>" + translations[currentLanguage].overlayNext, true);
  }
}

function findAllPossibleLines() {
  let results = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          let linePos = [[r, c]];
          let sumVal = (boardData[r][c] === null ? 0 : boardData[r][c]);
          let nr = r, nc = c;
          for (let step = 1; step < 8; step++) {
            nr += dr;
            nc += dc;
            if (nr < 0 || nr >= BOARD_ROWS || nc < 0 || nc >= BOARD_COLS) break;
            sumVal += (boardData[nr][nc] === null ? 0 : boardData[nr][nc]);
            linePos.push([nr, nc]);
            if (sumVal === targetSum) {
              results.push([...linePos]);
            }
          }
        }
      }
    }
  }
  return results;
}

/***************************************************
 * 오버레이(성공/실패) → 카드 획득 표시
 ***************************************************/
function showOverlay(msg, isSuccess) {
  // isSuccess = true → 성공 모달, false → 실패 모달
  // 여기에 간단한 카드 모양을 띄워주거나, 현재 난이도/목표/점수 등을 표시
  // 예: "카드 획득!" 느낌
  overlayMsgEl.innerHTML = `
    <div class="modal-header" style="margin-bottom:16px;">
      ${isSuccess ? "✨ 결 성공 ! ✨" : "아직 조합이 안되었어요..."}
    </div>
    <div class="score-card">
      <h3>현재 기록</h3>
      <p class="score-info">점수: ${totalScore}</p>
      <p class="score-info-small">난이도: ${BOARD_ROWS}x${BOARD_COLS}</p>
      <p class="score-info-small">목표점수: ${targetSum}</p>
    </div>
    <button class="modal-button" onclick="closeOverlay()">
      ${translations[currentLanguage].ok}
    </button>
  `;
  overlayEl.style.display = "flex";
}

function closeOverlay() {
  overlayEl.style.display = "none";
  let lines = findAllPossibleLines();
  if (lines.length === 0) {
    // 라운드 클리어 -> 다음 라운드
    currentRound++;
    initRound(currentRound);
  }
}

/***************************************************
 * 점수 카드 갱신 (오늘 최고, 내 최고)
 ***************************************************/
function updateBestScoresIfNeeded(score, difficulty, target) {
  // 오늘 최고
  if (score > todayBest.score) {
    todayBest.score = score;
    todayBest.difficulty = difficulty;
    todayBest.target = target;
  }
  // 전체 최고
  if (score > myBest.score) {
    myBest.score = score;
    myBest.difficulty = difficulty;
    myBest.target = target;

    // 로컬스토리지에 저장
    localStorage.setItem("myBestScore", myBest.score);
    localStorage.setItem("myBestDifficulty", myBest.difficulty);
    localStorage.setItem("myBestTarget", myBest.target);
  }
  updateBestScoreCards();
}

/***************************************************
 * Floating Score
 ***************************************************/
function showFloatingScore(txt, r, c, isPenalty = false) {
  const trList = boardEl.querySelectorAll("tr");
  const td = trList[r].querySelectorAll("td")[c];
  let rect = td.getBoundingClientRect();
  let floatEl = document.createElement("div");
  floatEl.classList.add("floating-score");
  floatEl.textContent = txt;
  floatEl.style.color = isPenalty ? "red" : "blue";
  document.body.appendChild(floatEl);

  let x = rect.left + rect.width / 2;
  let y = rect.top + rect.height / 2;
  floatEl.style.left = x + "px";
  floatEl.style.top = y + "px";

  setTimeout(() => {
    if (floatEl.parentNode) {
      floatEl.parentNode.removeChild(floatEl);
    }
  }, 1000);
}

/***************************************************
 * 힌트 버튼
 ***************************************************/
let hintCount = 3;
const maxHints = 3;
function onHintClick() {
  if (hintLinePositions) {
    showIOSToastMessage(translations[currentLanguage].noCombinationToast);
    return;
  }
  pauseTimer();
  showAdModal();
}

function showAdModal() {
  adModalEl.style.display = "flex";
  setTimeout(() => {
    adModalEl.style.display = "none";
    resumeTimer();
    useHint();
  }, 1000);
}

function useHint() {
  let lines = findAllPossibleLines();
  if (lines.length === 0) {
    showIOSToastMessage(translations[currentLanguage].noCombinationToast);
    return;
  }
  let picked = lines[0];
  hintLinePositions = picked;
  markLine(picked, "hint-line");
  showIOSToastMessage(translations[currentLanguage].hintMessage);

  hintCount--;
  if (hintCount <= 0) {
    hintCount = maxHints;
  }
}

/***************************************************
 * 타이머
 ***************************************************/
function startTimer() {
  stopTimer();
  remainingSeconds = 120;
  isTimerPaused = false;
  timerEl.classList.remove("time-warning");
  
  timerInterval = setInterval(() => {
    if (!isTimerPaused) {
      remainingSeconds--;
      updateTimerDisplay();
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
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
function pauseTimer() {
  isTimerPaused = true;
}
function resumeTimer() {
  isTimerPaused = false;
}
function updateTimerDisplay() {
  timerEl.textContent = formatTime(remainingSeconds);
}
function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  let mm = (m < 10) ? "0" + m : m;
  let ss = (s < 10) ? "0" + s : s;
  return mm + ":" + ss;
}

/***************************************************
 * 게임오버
 ***************************************************/
function showGameOver() {
  // 최고기록 갱신
  updateBestScoresIfNeeded(totalScore, BOARD_ROWS + "x" + BOARD_COLS, targetSum);

  gameOverMessageEl.innerHTML = `
    <h2>${translations[currentLanguage].timeOverMsg}</h2>
    <p>${translations[currentLanguage].finalScoreMsg} <strong>${totalScore}</strong></p>
    <!-- 카드 느낌 표시 -->
    <div class="score-card">
      <h3>결과 카드</h3>
      <p class="score-info">점수: ${totalScore}</p>
      <p class="score-info">난이도: ${BOARD_ROWS}x${BOARD_COLS}</p>
      <p class="score-info">목표점수: ${targetSum}</p>
    </div>

    <div class="game-over-buttons">
      <button id="home-button2" class="primary-button">홈</button>
    </div>
  `;
  gameOverOverlayEl.style.display = "flex";
  gameOverMessageEl.style.display = "flex";

  // 홈 버튼
  document.getElementById('home-button2').addEventListener('click', function() {
    gameOverOverlayEl.style.display = 'none';
    titleScreenEl.style.display = 'flex';
    gameContainerEl.style.display = 'none';
  });
}

/***************************************************
 * 토스트 메시지
 ***************************************************/
function showIOSToastMessage(message, duration = 2000) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, duration);
}

/***************************************************
 * Ripple
 ***************************************************/
function initRippleEffect() {
  const allButtons = document.querySelectorAll("button");
  allButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const circle = document.createElement("span");
      circle.classList.add("ripple");
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      circle.style.left = x + "px";
      circle.style.top = y + "px";
      btn.appendChild(circle);
      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });
}