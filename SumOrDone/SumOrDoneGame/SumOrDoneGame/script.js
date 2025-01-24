/***************************************************
 * 0. i18n 번역
 ***************************************************/
const translations = {
  en: {
    title: "Sum! or Done!",
    startGame: "Start Game",
    selectRound: "Select Round",
    round: "Round",
    goal: "Goal",
    score: "Score",
    myScore: "Score",
    time: "Time",
    noMore: "Done!",
    hint: "Hint",
    restartMenu: "Restart Round",
    backToTitle: "Go to Title",
    policy: "Privacy Policy",
    policyLink: "pp.html",
    noCombinationToast: "No more combinations, please press 'Done!' button.",
    cancelSelection: "Selection Cancelled",
    success: "Success",
    failSum: "Sum of numbers is not {target}",
    hintMessage: "Drag to select multiple numbers",
    overlayClear: "Round Clear! Score=",
    overlayNext: "Go to next round",
    overlayFail: "There are still combinations! Score -100",
    statusStart: "Round {round} Start! (Target={target}, Score={score})",
    ok: "OK",
    invalidPath: "Invalid path!",
    countdownGuide: "Drag tiles to make the target sum!",
    timeOverMsg: "Time Over!",
    finalScoreMsg: "Your final score:"
  },
  ko: {
    title: "결!합!",
    startGame: "게임 시작",
    selectRound: "시작 라운드 선택",
    round: "라운드",
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
    failSum: "숫자들의 합이 {target} 이 아니예요.",
    hintMessage: "드래그하여 여러 숫자를 선택하세요",
    overlayClear: "라운드 클리어! 점수=",
    overlayNext: "다음 라운드 진행",
    overlayFail: "아직 조합이 남아있어요! 점수 -100",
    statusStart: "Round {round} 시작! (Target={target}, 누적점수={score})",
    ok: "확인",
    invalidPath: "잘못된 경로!",
    countdownGuide: "드래그하여 목표점수를 만들어보세요!",
    timeOverMsg: "시간 종료!",
    finalScoreMsg: "최종 점수:"
  },
  ja: {
    title: "合計！または完了！",
    startGame: "ゲーム開始",
    selectRound: "ラウンド選択",
    round: "ラウンド",
    goal: "目標スコア",
    score: "スコア",
    myScore: "スコア",
    time: "残り時間",
    noMore: "完了！",
    hint: "ヒント",
    restartMenu: "再スタート",
    backToTitle: "タイトルに戻る",
    policy: "プライバシーポリシー",
    policyLink: "pp.html",
    noCombinationToast: "これ以上の組み合わせがないので「完了！」を押してください。",
    cancelSelection: "選択キャンセル",
    success: "成功",
    failSum: "数の合計が {target} ではありません",
    hintMessage: "ドラッグして複数の数字を選択してください",
    overlayClear: "ラウンドクリア！ スコア=",
    overlayNext: "次のラウンドに進む",
    overlayFail: "まだ組み合わせが残っています！ スコア -100",
    statusStart: "Round {round} 開始 (Target={target}, Score={score})",
    ok: "確認",
    invalidPath: "無効なパス!",
    countdownGuide: "ドラッグして目標スコアを作りましょう！",
    timeOverMsg: "時間切れ！",
    finalScoreMsg: "最終スコア:"
  },
  zh: {
    title: "合！或完成！",
    startGame: "开始游戏",
    selectRound: "选择回合",
    round: "回合",
    goal: "目标分数",
    score: "得分",
    myScore: "我的分数",
    time: "剩余时间",
    noMore: "完成！",
    hint: "提示",
    restartMenu: "重新开始",
    backToTitle: "返回首页",
    policy: "隐私政策",
    policyLink: "pp.html",
    noCombinationToast: "没有其他组合，请按“完成”按钮",
    cancelSelection: "取消选择",
    success: "成功",
    failSum: "数字的总和不等于 {target}",
    hintMessage: "拖动选择多个数字",
    overlayClear: "回合完成！ 得分=",
    overlayNext: "进入下一回合",
    overlayFail: "仍有组合存在！得分 -100",
    statusStart: "Round {round} 开始 (Target={target}, Score={score})",
    ok: "确认",
    invalidPath: "无效路径！",
    countdownGuide: "拖动方块来组成目标分数！",
    timeOverMsg: "时间到！",
    finalScoreMsg: "最终得分:"
  }
};

/***************************************************
 * 전역 변수 & DOM 참조
 ***************************************************/
let currentLanguage = "ko";  // 기본 한국어
let currentRound = 1;
let totalScore = 0;
let targetSum = 10;
const BOARD_ROWS = 6;
const BOARD_COLS = 6;
const MIN_NUM = 1;
const MAX_NUM = 9;

let boardData = [];
let startPos = null;
let hintLinePositions = null;
let remainingSeconds = 180; // 3분(180초)
let timerInterval = null;
let isTimerPaused = false;

// DOM 변수
let titleScreenEl,
    countdownOverlayEl,
    countdownNumberEl,
    guideMessageEl,
    gameContainerEl,
    roundLabelEl,
    targetNumberEl,
    scoreEl,
    timerEl,
    boardEl,
    noMoreBtn,
    hintBtn,
    overlayEl,
    overlayMsgEl,
    menuButtonEl,
    menuPopupEl,
    adModalEl,
    toastEl,
    gameOverOverlayEl,
    gameOverMessageEl;

/***************************************************
 * 초기 DOM 로드 후
 ***************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // HTML 내 요소 참조
  titleScreenEl = document.getElementById("titleScreen");
  countdownOverlayEl = document.getElementById("countdownOverlay");
  countdownNumberEl = document.getElementById("countdownNumber");
  guideMessageEl = document.getElementById("guideMessage");
  gameContainerEl = document.getElementById("gameContainer");

  roundLabelEl = document.getElementById("round-label");
  targetNumberEl = document.getElementById("target-number");
  scoreEl = document.getElementById("score");
  timerEl = document.getElementById("timer");
  boardEl = document.getElementById("game-board");

  noMoreBtn = document.getElementById("no-more");
  hintBtn = document.getElementById("hint-btn");
  overlayEl = document.getElementById("overlay");
  overlayMsgEl = document.getElementById("overlay-message");

  menuButtonEl = document.getElementById("menu-button");
  menuPopupEl = document.getElementById("menu-popup");

  adModalEl = document.getElementById("ad-modal");
  toastEl = document.getElementById("toast-message");

  // 게임오버 오버레이 (타이머 종료 시 표시)
  gameOverOverlayEl = document.getElementById("gameOverOverlay");
  gameOverMessageEl = document.getElementById("gameOverMessage");

  // 언어 셀렉트
  const languageSelect = document.getElementById("language-select");
  languageSelect.addEventListener("change", (event) => {
    setLanguage(event.target.value);
  });
  setLanguage(languageSelect.value); // 초기 언어 설정

  // 첫화면 “게임 시작” 버튼
  const startGameBtn = document.getElementById("start-game-btn");
  startGameBtn.addEventListener("click", onStartGame);

  // 3-dot 메뉴 버튼
  menuButtonEl.addEventListener("click", toggleMenuPopup);

  // 서브메뉴 항목
  menuPopupEl.querySelector("#menu-restart").addEventListener("click", () => {
    toggleMenuPopup();
    initRound(currentRound);
  });
  menuPopupEl.querySelector("#menu-backToTitle").addEventListener("click", () => {
    toggleMenuPopup();
    backToTitleScreen();
  });
  menuPopupEl.querySelector("#menu-policy").addEventListener("click", () => {
  toggleMenuPopup();
    location.href = translations[currentLanguage].policyLink;
  });

  // 결(“Done!”) 버튼
  noMoreBtn.addEventListener("click", onNoMoreClick);

  // 힌트 버튼
  hintBtn.addEventListener("click", onHintClick);

  // 광고 모달 닫기 버튼(있다면)
  const adCloseBtn = document.getElementById("ad-close-btn");
  if (adCloseBtn) {
    adCloseBtn.addEventListener("click", () => {
      adModalEl.style.display = "none";
      resumeTimer(); // 광고 종료 후 타이머 재개
    });
  }

  // Ripple 효과 등
  initRippleEffect();

  // 첫화면 기본 노출
  titleScreenEl.style.display = "flex";
  gameContainerEl.style.display = "none";
  countdownOverlayEl.style.display = "none";

  // 라운드 선택 초기값
  const roundSelect = document.getElementById("round-select");
  roundSelect.value = "1";

  // "홈" 버튼 클릭 시 첫화면으로 이동
  document.getElementById('home-button').addEventListener('click', function() {
    document.getElementById('gameOverOverlay').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('countdownOverlay').style.display = 'none';
    // 추가적으로 필요하다면 게임 상태 초기화
  });

  // "다시 시작하기" 버튼 클릭 시 게임을 재시작
  document.getElementById('menu-restart').addEventListener('click', function() {
    document.getElementById('gameOverOverlay').style.display = 'none';
    resetGame(); // 기존의 게임 초기화 함수 호출
  });
});

/***************************************************
 * 언어 설정
 ***************************************************/
function setLanguage(lang) {
  currentLanguage = lang;
  document.title = translations[lang].title;

  // 첫화면 텍스트
  const titleLabelEl = document.getElementById("titleLabel");
  const startBtnEl = document.getElementById("start-game-btn");
  const roundSelectLabelEl = document.getElementById("roundSelectLabel");

  if (titleLabelEl) titleLabelEl.textContent = translations[lang].title;
  if (startBtnEl) startBtnEl.textContent = translations[lang].startGame;
  if (roundSelectLabelEl) roundSelectLabelEl.textContent = translations[lang].selectRound;

  // GNB 헤더
  const gameTitleEl = document.querySelector(".game-title");
  if (gameTitleEl) gameTitleEl.textContent = translations[lang].title;

  // 3-dot 메뉴
  if (menuPopupEl) {
    const elRestart = menuPopupEl.querySelector("#menu-restart");
    const elBackToTitle = menuPopupEl.querySelector("#menu-backToTitle");
    const elPolicy = menuPopupEl.querySelector("#menu-policy");
    if (elRestart) elRestart.textContent = translations[lang].restartMenu;
    if (elBackToTitle) elBackToTitle.textContent = translations[lang].backToTitle;
    if (elPolicy) elPolicy.textContent = translations[lang].policy;
  }

  // 상단바 레이블
  const targetLabelEl = document.getElementById("target-label");
  const scoreLabelEl = document.getElementById("score-label");
  const timerLabelEl = document.getElementById("timer-label");
  if (targetLabelEl) targetLabelEl.textContent = translations[lang].goal;
  if (scoreLabelEl) scoreLabelEl.textContent = translations[lang].myScore;
  if (timerLabelEl) timerLabelEl.textContent = translations[lang].time;

  // 하단 버튼
  if (noMoreBtn) noMoreBtn.textContent = translations[lang].noMore;
  if (hintBtn) hintBtn.textContent = translations[lang].hint;

  // 카운트다운 가이드 메시지
  if (guideMessageEl) guideMessageEl.textContent = translations[lang].countdownGuide;
}

/***************************************************
 * [A] 첫화면 → “게임 시작” 버튼
 ***************************************************/
function onStartGame() {
  const roundSelect = document.getElementById("round-select");
  const selectedRound = parseInt(roundSelect.value, 10) || 1;
  currentRound = selectedRound;

  // 첫화면 숨기고 카운트다운
  titleScreenEl.style.display = "none";
  countdownOverlayEl.style.display = "flex";
  gameContainerEl.style.display = "none";

  // 3,2,1 카운트다운
  let count = 3;
  countdownNumberEl.textContent = count;
  const countdownTimer = setInterval(() => {
    count--;
    countdownNumberEl.textContent = count;
    if (count <= 0) {
      clearInterval(countdownTimer);
      // 카운트다운 끝 -> 게임화면 표시 + 라운드 시작
      countdownOverlayEl.style.display = "none";
      gameContainerEl.style.display = "flex";
      initRound(currentRound);
      startTimer();
    }
  }, 1000);
}

/***************************************************
 * [B] 첫화면으로 돌아가기
 ***************************************************/
function backToTitleScreen() {
  gameContainerEl.style.display = "none";
  titleScreenEl.style.display = "flex";
  stopTimer();

  currentRound = 1;
  totalScore = 0;
}

/***************************************************
 * [C] 메뉴 팝업 토글
 ***************************************************/
function toggleMenuPopup() {
  if (menuPopupEl.style.display === "block") {
    menuPopupEl.style.display = "none";
  } else {
    menuPopupEl.style.display = "block";
  }
}

/***************************************************
 * 라운드 초기화
 ***************************************************/
function initRound(round) {
  currentRound = round;
  totalScore = 0;
  targetSum = getTargetForRound(round);

  // 보드 생성
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
  updateInfoBar();
  renderBoard();

  // 타이머 재설정(3분)
  remainingSeconds = 180;
  updateTimerDisplay();

  // 힌트 라인, 시작칸 해제
  hintLinePositions = null;
  startPos = null;
}

function getTargetForRound(round) {
  // 1라운드=10, 2라운드=11, ...
  return 10 + (round - 1);
}

/***************************************************
 * 상단 정보 업데이트
 ***************************************************/
function updateInfoBar() {
  roundLabelEl.textContent = translations[currentLanguage].round + " " + currentRound;
  targetNumberEl.textContent = targetSum;
  scoreEl.textContent = totalScore;
}

/***************************************************
 * 보드 렌더링
 ***************************************************/
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

      // 마우스 이벤트
      td.addEventListener("mousedown", () => startDragSelect(r, c));
      td.addEventListener("mousemove", () => continueDragSelect(r, c));
      td.addEventListener("mouseup", () => stopDragSelect());

      // 터치 이벤트
      td.addEventListener("touchstart", (e) => {
        // 화면 스크롤 방지
        e.preventDefault();
        startDragSelect(r, c);
      }, { passive: false });

      td.addEventListener("touchmove", (e) => {
        // 화면 스크롤 방지
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

      // 시작칸 표시
      if (startPos && startPos[0] === r && startPos[1] === c) {
        td.classList.add("selected");
      }
      tr.appendChild(td);
    }
    boardEl.appendChild(tr);
  }

  // 힌트 라인 표시
  if (hintLinePositions) {
    markLine(hintLinePositions, "hint-line");
  }
}

/***************************************************
 * 드래그 선택 로직
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

  // 새로운 라인(가로/세로/대각) 계산
  const newLinePositions = getLinePositions(startPos, [r, c]);
  if (newLinePositions) {
    // 이전 하이라이트 제거
    clearDragSelection();
    // 새 라인 표시
    dragPositions = newLinePositions;
    markDragSelection(dragPositions);
  }
}

function stopDragSelect() {
  if (!isDragging) return;
  isDragging = false;

  if (!dragPositions || dragPositions.length < 2) {
    clearDragSelection();
    showIOSToastMessage(translations[currentLanguage].hintMessage);
  } else {
    const start = dragPositions[0];
    const end = dragPositions[dragPositions.length - 1];
    clearDragSelection();
    checkLine(start, end);
  }
}

/** 기존 하이라이트 지우기 */
function clearDragSelection() {
  const trList = boardEl.querySelectorAll("tr");
  dragPositions.forEach(([r, c]) => {
    const td = trList[r].querySelectorAll("td")[c];
    td.classList.remove("drag-select-highlight");
  });
  dragPositions = [];
}

/** 새 하이라이트 적용 */
function markDragSelection(linePositions) {
  const trList = boardEl.querySelectorAll("tr");
  linePositions.forEach(([r, c]) => {
    const td = trList[r].querySelectorAll("td")[c];
    td.classList.add("drag-select-highlight");
  });
}

/***************************************************
 * 라인 검사(checkLine)
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

    // 감점
    totalScore = Math.max(0, totalScore - targetSum);
    updateInfoBar();
    showFloatingScore("-" + targetSum, end[0], end[1], true);
  }
}

/** (r1,c1)~(r2,c2)가 일렬(가로, 세로, 대각)인지 확인 후 라인 좌표 반환 */
function getLinePositions([r1, c1], [r2, c2]) {
  let rd = r2 - r1;
  let cd = c2 - c1;
  if (rd === 0 && cd === 0) return null;
  // 가로/세로/대각 검사
  if (!(rd === 0 || cd === 0 || Math.abs(rd) === Math.abs(cd))) return null;

  // 최대공약수
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
    if (curR < 0 || curR >= BOARD_ROWS || curC < 0 || curC >= BOARD_COLS) return null;
    pos.push([curR, curC]);
  }
  return pos;
}

/** 특정 라인에 클래스 추가/제거 */
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

/** 라인 타일 제거 */
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
 * Done! (결) 버튼
 ***************************************************/
function onNoMoreClick() {
  let found = findAllPossibleLines();
  if (found.length > 0) {
    // 조합 남음 -> -100
    totalScore = Math.max(0, totalScore - 100);
    updateInfoBar();
    showOverlay(translations[currentLanguage].overlayFail);
  } else {
    // 라운드 클리어
    totalScore += 100;
    updateInfoBar();
    showOverlay(translations[currentLanguage].overlayClear + totalScore + "<br>" + translations[currentLanguage].overlayNext);
  }
}

/** 남은 가능한 라인 전체 찾기 */
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
  // 이미 힌트가 표시되어 있다면
  if (hintLinePositions) {
    showIOSToastMessage(translations[currentLanguage].noCombinationToast);
    return;
  }
  // 광고 모달 표시 -> 타이머 일시정지
  pauseTimer();
  showAdModal();
}

function showAdModal() {
  adModalEl.style.display = "flex";
  // 5초 뒤 자동 종료(예시)
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
 * 오버레이 (라운드 종료, 실패 등)
 ***************************************************/
function showOverlay(msg) {
  overlayMsgEl.innerHTML = `
    <div style="font-size:1.4rem; font-weight:600; margin-bottom:16px;">
    ${translations[currentLanguage].noMore} - ${translations[currentLanguage].round} ${currentRound}
    </div>
  ` + msg + `
    <br>
    <button class="modal-button" onclick="closeOverlay()">
      ${translations[currentLanguage].ok}
    </button>`;
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
 * 타이머 (3분 카운트다운)
 ***************************************************/
function startTimer() {
  stopTimer(); // 혹시 이전 타이머 있으면 중단
  remainingSeconds = 180;
  isTimerPaused = false;
  timerEl.classList.remove("time-warning"); // 혹시 남아있을 수 있는 클래스 제거

  timerInterval = setInterval(() => {
    if (!isTimerPaused) {
      remainingSeconds--;
      updateTimerDisplay();

      // 1분(60초) 남았을 때 경고 애니메이션 부여
      if (remainingSeconds === 30) {
        timerEl.classList.add("time-warning");
      }

      // 시간 다 됨
      if (remainingSeconds <= 0) {
        stopTimer();
        remainingSeconds = 0;
        updateTimerDisplay();
        timerEl.classList.remove("time-warning"); // 깜빡임 해제
        showGameOver(); // 게임 종료 처리
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
 * 게임 종료 (타이머 종료 시)
 ***************************************************/
function showGameOver() {
  // 최종 점수 표시
  gameOverMessageEl.innerHTML = `
    <h2>${translations[currentLanguage].timeOverMsg}</h2>
    <p>${translations[currentLanguage].finalScoreMsg} <strong>${totalScore}</strong></p>
    <div class="game-over-buttons">
      <button id="home-button" class="primary-button">홈</button>
    </div>
  `;
  gameOverOverlayEl.style.display = "flex";
  gameOverMessageEl.style.display = "flex";

  // 버튼 기능 추가
  document.getElementById('home-button').addEventListener('click', function() {
    gameOverOverlayEl.style.display = 'none';
    document.getElementById('titleScreen').style.display = 'flex';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOverOverlay').style.display = 'none';
    document.getElementById('gameOverMessage').style.display = 'none';
    document.getElementById('buttons-container').style.display = 'none';
    
  });

}

// 게임 초기화 함수 예시
function resetGame() {
  // 게임 상태를 초기화하는 로직
  document.getElementById('score').textContent = '0';
  document.getElementById('timer').textContent = '03:00';
  // 기타 필요한 초기화 작업
  document.getElementById('gameContainer').style.display = 'block';
  gameOverOverlayEl.style.display = 'none';
  
  initRound(currentRound);

}

/***************************************************
 * 버튼 Ripple 효과
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



