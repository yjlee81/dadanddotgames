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
    noCombinationToast: "더 이상의 조합이 없으니 'Done!' 버튼을 누르세요.",
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
  },
  // 다른 언어(ja, zh 등)도 필요시 추가
};
let currentLanguage = "ko";

/***************************************************
 * 전역 변수
 ***************************************************/
let currentRound = 1;
let totalScore = 0;
let targetSum = 10;
let BOARD_ROWS = 6;
let BOARD_COLS = 6;
const MIN_NUM = 1;
const MAX_NUM = 9;

let boardData = [];
let startPos = [0,0];
let hintLinePositions = null;
let remainingSeconds = 120;
let timerInterval = null;
let isTimerPaused = false;

// 드래그
let isDragging = false;
let dragPositions = [];

/***************************************************
 * [예시] 내 점수 테이블(가상 데이터)
 ***************************************************/
const scoreRecords = [
  { score: 250, diff: 6, target: 10 },
  { score: 220, diff: 6, target: 11 },
  { score: 190, diff: 8, target: 10 },
  { score: 180, diff: 8, target: 15 },
  { score: 170, diff: 10, target: 20 },
  { score: 160, diff: 6, target: 14 },
  { score: 150, diff: 10, target: 10 },
  { score: 140, diff: 8, target: 11 },
  { score: 120, diff: 8, target: 13 },
  { score: 100, diff: 6, target: 10 }
];
let selectedDiff = "all";
let selectedTarget = "all";

/***************************************************
 * DOMContentLoaded
 ***************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // 언어 선택
  const languageSelect = document.getElementById("language-select");
  languageSelect.addEventListener("change", (event) => {
    setLanguage(event.target.value);
  });
  setLanguage(languageSelect.value);

  // 첫화면 "게임 시작"
  const startGameBtn = document.getElementById("start-game-btn");
  startGameBtn.addEventListener("click", onStartGame);

  // 홈 버튼
  const homeButtonEl = document.getElementById("home-button");
  homeButtonEl.addEventListener("click", () => {
    backToTitleScreen();
  });

  // Done, Hint 버튼
  document.getElementById("no-more").addEventListener("click", onNoMoreClick);
  document.getElementById("hint-btn").addEventListener("click", onHintClick);

  // 광고 모달 닫기
  document.getElementById("ad-close-btn").addEventListener("click", () => {
    document.getElementById("ad-modal").style.display = "none";
    resumeTimer();
    useHint();
  });

  // 칩(난이도/목표) 클릭 이벤트
  document.querySelectorAll(".chip[data-diff]").forEach(chip => {
    chip.addEventListener("click", (e) => {
      document.querySelectorAll(".chip[data-diff]").forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");
      selectedDiff = e.target.dataset.diff;
      renderScoreTable();
    });
  });
  document.querySelectorAll(".chip[data-target]").forEach(chip => {
    chip.addEventListener("click", (e) => {
      document.querySelectorAll(".chip[data-target]").forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");
      selectedTarget = e.target.dataset.target;
      renderScoreTable();
    });
  });

  // 점수테이블 초기 렌더
  renderScoreTable();

  // 윈도우 리사이즈 이벤트 → 동적 보드 리사이즈
  window.addEventListener("resize", resizeBoard);
});

/***************************************************
 * 언어 설정
 ***************************************************/
function setLanguage(lang) {
  currentLanguage = lang;
  document.title = translations[lang].title;
  // 필요한 텍스트 변경(여기서는 최소화)
}

/***************************************************
 * 내 점수 테이블 렌더
 ***************************************************/
function renderScoreTable() {
  const tbody = document.querySelector("#score-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  // 필터 적용
  const filtered = scoreRecords.filter(rec => {
    const diffOk = (selectedDiff === "all") || (rec.diff === parseInt(selectedDiff));
    const tgtOk = (selectedTarget === "all") || (rec.target === parseInt(selectedTarget));
    return diffOk && tgtOk;
  });

  // 내림차순 정렬 후 상위 10개
  const sorted = filtered.sort((a, b) => b.score - a.score).slice(0, 10);

  sorted.forEach((rec, idx) => {
    const tr = document.createElement("tr");
    const rankTd = document.createElement("td");
    rankTd.textContent = (idx + 1);
    const scoreTd = document.createElement("td");
    scoreTd.textContent = rec.score;
    const diffTd = document.createElement("td");
    diffTd.textContent = `${rec.diff}x${rec.diff}`;
    const tgtTd = document.createElement("td");
    tgtTd.textContent = rec.target;

    tr.appendChild(rankTd);
    tr.appendChild(scoreTd);
    tr.appendChild(diffTd);
    tr.appendChild(tgtTd);
    tbody.appendChild(tr);
  });
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

  // 첫화면 숨기고 카운트다운 시작
  document.getElementById("titleScreen").style.display = "none";
  document.getElementById("countdownOverlay").style.display = "flex";
  document.getElementById("gameContainer").style.display = "none";

  let count = 3;
  document.getElementById("countdownNumber").textContent = count;
  const countdownTimer = setInterval(() => {
    count--;
    document.getElementById("countdownNumber").textContent = count;
    if (count <= 0) {
      clearInterval(countdownTimer);
      document.getElementById("countdownOverlay").style.display = "none";
      document.getElementById("gameContainer").style.display = "flex";
      initRound(currentRound);
      startTimer();
    }
  }, 1000);
}

/***************************************************
 * 라운드 초기화
 ***************************************************/
function initRound(round) {
  currentRound = round;
  totalScore = 0;
  targetSum = 10 + (round - 1);
  
  boardData = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    let rowArr = [];
    for (let c = 0; c < BOARD_COLS; c++) {
      let val = Math.floor(Math.random() * (MAX_NUM - MIN_NUM + 1)) + MIN_NUM;
      rowArr.push(val);
    }
    boardData.push(rowArr);
  }

  // UI 업데이트
  document.getElementById("difficulty-label").textContent =
    `라운드 ${round} (${BOARD_ROWS}x${BOARD_COLS})`;
  document.getElementById("target-number").textContent = targetSum;
  document.getElementById("score").textContent = totalScore;

  // 타이머 설정
  remainingSeconds = 120;
  updateTimerDisplay();
  isTimerPaused = false;

  renderBoard();
}

/***************************************************
 * 보드 렌더링
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

      // 마우스 & 터치 드래그 이벤트
      td.addEventListener("mousedown", () => startDragSelect(r, c));
      td.addEventListener("mousemove", () => continueDragSelect(r, c));
      td.addEventListener("mouseup", stopDragSelect);

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

  // 힌트 라인 제거
  if (hintLinePositions) {
    markLine(hintLinePositions, null, "hint-line");
    hintLinePositions = null;
  }

  // 마지막에 셀 크기 동적 조정
  resizeBoard();
}

/** 화면 리사이즈에 맞춰 각 셀 크기 동적으로 조정 */
function resizeBoard() {
  const container = document.querySelector(".board-container");
  if (!container) return;

  // 보드 컨테이너의 실제 가용 크기
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // CSS에서 border-spacing: 4px; 이므로,
  // 1행(열) 더 많은 '간격'이 생깁니다. (좌/우 + 각 셀 사이)
  // => 가로 방향 스페이싱: (BOARD_COLS+1)*4
  // => 세로 방향 스페이싱: (BOARD_ROWS+1)*4
  const borderSpacing = 4;
  const totalHorizontalSpacing = (BOARD_COLS + 1) * borderSpacing;
  const totalVerticalSpacing = (BOARD_ROWS + 1) * borderSpacing;

  // 하나의 셀이 차지할 수 있는 최대폭/최대높이
  const maxCellWidth =
    (containerWidth - totalHorizontalSpacing) / BOARD_COLS;
  const maxCellHeight =
    (containerHeight - totalVerticalSpacing) / BOARD_ROWS;

  // 가로/세로 중 더 작은 값으로 셀 크기를 지정
  const cellSize = Math.floor(Math.min(maxCellWidth, maxCellHeight));

  // 모든 td에 적용
  const tdList = document.querySelectorAll("#game-board td");
  tdList.forEach(td => {
    td.style.width = cellSize + "px";
    td.style.height = cellSize + "px";
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
  positions.forEach(([r, c]) => {
    trList[r].children[c].classList.add("drag-select-highlight");
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
  // 가로/세로/대각선만 가능
  if (!(rd === 0 || cd === 0 || Math.abs(rd) === Math.abs(cd))) return null;

  function gcd(a, b){return b===0?a:gcd(b,a%b);}
  let g = gcd(Math.abs(rd), Math.abs(cd));
  let stepR = rd / g;
  let stepC = cd / g;
  
  let pos = [];
  let curR = r1, curC = c1;
  pos.push([curR, curC]);
  let steps = Math.max(Math.abs(rd), Math.abs(cd));
  for (let i=0;i<steps;i++){
    curR += stepR;
    curC += stepC;
    if (curR<0 || curR>=BOARD_ROWS || curC<0 || curC>=BOARD_COLS) return null;
    pos.push([curR, curC]);
  }
  return pos;
}

function checkLine(start, end) {
  const linePositions = getLinePositions(start, end);
  if (!linePositions || linePositions.length<2) {
    showIOSToastMessage(translations[currentLanguage].invalidPath);
    return;
  }
  let sumVal = 0, gapCount=0;
  linePositions.forEach(([r,c]) => {
    if (boardData[r][c] === null) gapCount++;
    else sumVal += boardData[r][c];
  });

  if (sumVal === targetSum) {
    const gapBonus = gapCount * 10;
    const lengthBonus = (linePositions.length>=3)? (linePositions.length-2)*5 : 0;
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
  if (found.length>0) {
    totalScore = Math.max(0, totalScore - 100);
    document.getElementById("score").textContent = totalScore;
    showOverlay(translations[currentLanguage].overlayFail, false);
  } else {
    totalScore += 100;
    document.getElementById("score").textContent = totalScore;
    showOverlay(translations[currentLanguage].overlayClear + totalScore + "<br>" + translations[currentLanguage].overlayNext, true);
  }
}

/** 가능한 모든 라인 찾기(간단 브루트포스) */
function findAllPossibleLines() {
  let results = [];
  for (let r=0; r<BOARD_ROWS; r++){
    for (let c=0; c<BOARD_COLS; c++){
      for (let dr=-1; dr<=1; dr++){
        for (let dc=-1; dc<=1; dc++){
          if (dr===0 && dc===0) continue;
          let sumVal=0;
          let tmpPos=[];
          let nr=r, nc=c;
          for (let step=0; step<BOARD_ROWS*BOARD_COLS; step++){
            if(nr<0||nr>=BOARD_ROWS||nc<0||nc>=BOARD_COLS) break;
            sumVal += (boardData[nr][nc]===null? 0 : boardData[nr][nc]);
            tmpPos.push([nr,nc]);
            if(sumVal===targetSum && tmpPos.length>1){
              results.push([...tmpPos]);
            }
            nr += dr; nc += dc;
          }
        }
      }
    }
  }
  return results;
}

/***************************************************
 * 오버레이(성공/실패)
 ***************************************************/
function showOverlay(msg, isSuccess) {
  const overlayEl = document.getElementById("overlay");
  const overlayMsgEl = document.getElementById("overlay-message");
  overlayMsgEl.innerHTML = `
    <h2>${isSuccess ? "결 성공!" : "아직 조합 있음!"}</h2>
    <p>${isSuccess ? "축하합니다!" : "-100 포인트 차감되었습니다."}</p>
    <div style="margin:15px 0;">
      현재 점수: ${totalScore}
    </div>
    <button class="modal-button" onclick="closeOverlay()">
      ${translations[currentLanguage].ok}
    </button>
  `;
  overlayEl.style.display = "flex";
}
function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
  // 가능한 조합이 없으면 다음 라운드로
  if (findAllPossibleLines().length === 0) {
    currentRound++;
    initRound(currentRound);
  }
}

/***************************************************
 * 힌트 버튼
 ***************************************************/
function onHintClick() {
  pauseTimer();
  // 광고 모달 표시(닫으면 useHint() 호출)
  document.getElementById("ad-modal").style.display = "flex";
}
/** 힌트 적용 */
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
  remainingSeconds = 120;
  isTimerPaused = false;
  timerInterval = setInterval(() => {
    if (!isTimerPaused) {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        remainingSeconds = 0;
        stopTimer();
        showGameOver();
      }
      updateTimerDisplay();
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
  const s = remainingSeconds%60;
  const mm = (m<10 ? "0"+m : m);
  const ss = (s<10 ? "0"+s : s);
  document.getElementById("timer").textContent = mm+":"+ss;
}

/***************************************************
 * 게임 오버
 ***************************************************/
function showGameOver() {
  // 게임오버 모달
  stopTimer();
  const gameOverEl = document.getElementById("gameOverOverlay");
  const gameOverMsg = document.getElementById("gameOverMessage");
  gameOverMsg.innerHTML = `
    <h2>${translations[currentLanguage].timeOverMsg}</h2>
    <div style="border:none;box-shadow:none;">
      <h3>${translations[currentLanguage].finalScoreMsg}</h3>
      <p style="font-size:2rem;font-weight:bold;margin:10px 0;">${totalScore}</p>
      <p>${BOARD_ROWS}x${BOARD_COLS}, Goal ${targetSum}</p>
    </div>
    <div class="game-over-buttons">
      <button class="primary-button" onclick="backToTitleScreen()">홈으로</button>
    </div>
  `;
  gameOverEl.style.display = "flex";
}

/***************************************************
 * 첫화면 복귀
 ***************************************************/
function backToTitleScreen() {
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("titleScreen").style.display = "flex";
  document.getElementById("gameOverOverlay").style.display = "none";
  stopTimer();
}

/***************************************************
 * 토스트 메시지
 ***************************************************/
function showIOSToastMessage(msg, duration=2000) {
  const toastEl = document.getElementById("toast-message");
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, duration);
}

/***************************************************
 * 플로팅 점수
 ***************************************************/
function showFloatingScore(txt, r, c, isPenalty=false) {
  const boardEl = document.getElementById("game-board");
  const trList = boardEl.querySelectorAll("tr");
  const td = trList[r].children[c];
  let rect = td.getBoundingClientRect();

  let floatEl = document.createElement("div");
  floatEl.classList.add("floating-score");
  floatEl.textContent = txt;
  floatEl.style.color = isPenalty ? "red" : "blue";
  document.body.appendChild(floatEl);

  let x = rect.left + rect.width/2;
  let y = rect.top + rect.height/2;
  floatEl.style.left = x + "px";
  floatEl.style.top = y + "px";

  setTimeout(() => {
    if (floatEl.parentNode) {
      floatEl.parentNode.removeChild(floatEl);
    }
  }, 1000);
}