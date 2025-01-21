const translations = {
  en: {
    title: "Sum! or Done!",
    round: "Round",
    sum: "Sum",
    score: "Score",
    time: "Time",
    noMore: "Done!",
    hint: "Hint",
    startTile: "Start Tile",
    cancelSelection: "Selection Cancelled",
    success: "Success",
    fail: "Fail",
    failSum: "The sum of the numbers does not equal {target}.",
    hintMessage: "Drag to select multiple numbers",
    overlayClear: "Round Clear! Score=",
    overlayNext: "Proceed to the next round",
    overlayFail: "Combinations still exist! Score -100",
    statusStart: "Round {round} start! (Target={target}, Score={score})",
    ok: "OK"
  },
  ko: {
    title: "합! or 결!",
    round: "라운드",
    sum: "합",
    score: "점수",
    time: "시간",
    noMore: "결!",
    hint: "힌트",
    startTile: "시작칸",
    cancelSelection: "선택 취소",
    success: "성공",
    fail: "실패: 숫자들의 합이 {target} 이 아니예요.",
    failSum: "숫자들의 합이 {target} 이 아니예요.",
    hintMessage: "드래그해서 여러 숫자들을 선택하세요",
    overlayClear: "라운드 클리어! 점수=",
    overlayNext: "다음 라운드 진행",
    overlayFail: "아직 조합이 남아있어요. Score -100",
    statusStart: "Round {round} 시작! (Target={target}, 누적점수={score})",
    ok: "확인"
  },
  ja: {
    title: "合計！または完了！",
    round: "ラウンド",
    sum: "合計",
    score: "スコア",
    time: "時間",
    noMore: "完了！",
    hint: "ヒント",
    startTile: "開始タイル",
    cancelSelection: "選択キャンセル",
    success: "成功",
    fail: "失敗",
    failSum: "数の合計が {target} ではありません",
    hintMessage: "ドラッグして複数の数字を選択してください",
    overlayClear: "ラウンドクリア！スコア=",
    overlayNext: "次のラウンドに進む",
    overlayFail: "まだ組み合わせが残っています！スコア -100",
    statusStart: "Round {round} 開始！ (Target={target}, 累積スコア={score})",
    ok: "確認"
  },
  zh: {
    title: "合！或完成！",
    round: "回合",
    sum: "合计",
    score: "得分",
    time: "时间",
    noMore: "完成!",
    hint: "提示",
    startTile: "起始方块",
    cancelSelection: "取消选择",
    success: "成功",
    fail: "失败",
    failSum: "数字的总和不等于 {target}",
    hintMessage: "请拖动选择多个数字",
    overlayClear: "回合清除！得分=",
    overlayNext: "进行下一回合",
    overlayFail: "仍有组合存在！得分 -100",
    statusStart: "Round {round} 开始！ (Target={target}, 累积得分={score})",
    ok: "确认"
  }
};

function updateLanguage(lang) {
  document.title = translations[lang].title;
  const gameTitleEl = document.querySelector('.game-title');
  if (gameTitleEl) {
    gameTitleEl.textContent = translations[lang].title;
  }
  const roundLabelEl = document.getElementById('round-label');
  if (roundLabelEl) {
    roundLabelEl.textContent = `${translations[lang].round} ${currentRound}`;
  }
  const scoreLabelEl = document.getElementById('score-label');
  if (scoreLabelEl) {
    scoreLabelEl.textContent = `${translations[lang].score}`;
  }
  const timerLabelEl = document.getElementById('timer-label');
  if (timerLabelEl) {
    timerLabelEl.textContent = `${translations[lang].time}`;
  }
  const noMoreEl = document.getElementById('no-more');
  if (noMoreEl) {
    noMoreEl.textContent = translations[lang].noMore;
  }
  /* 힌트버튼은 카운트를 포함하여 별도로 처리
  const hintBtnEl = document.getElementById('hint-btn');
  if (hintBtnEl) {
    hintBtnEl.textContent = translations[lang].hint;
  } */
  // 추가적인 요소들의 텍스트 설정
  updateHintButton();
}

document.addEventListener('DOMContentLoaded', () => {
  const languageSelect = document.getElementById('language-select');
  languageSelect.addEventListener('change', (event) => {
    const selectedLang = event.target.value;
    updateLanguage(selectedLang);
  });

  // 초기 언어 설정
  updateLanguage(languageSelect.value);

  // 다시 시작 버튼 이벤트 리스너 추가
  const restartBtn = document.getElementById('restart-btn');
  restartBtn.addEventListener('click', () => {
    initRound(1); // 게임을 처음부터 다시 시작
  });
});

// 버튼 Ripple 효과 예시 (선택)
document.addEventListener("DOMContentLoaded", () => {
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
});

function showIOSToastMessage(message, duration = 2000) {
  const toastEl = document.getElementById('toast-message');
  toastEl.textContent = message;
  toastEl.classList.add('show');

  setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

/****************************************************************
 * 1. 전역 설정
 ****************************************************************/
const BOARD_ROWS = 6;
const BOARD_COLS = 6;
const MIN_NUM = 1;
const MAX_NUM = 9;

// 라운드 & 타겟
let currentRound = 1;
function getTargetForRound(round){
  return 10 + (round-1); // Round1=10, Round2=11,...
}
let targetSum = 10;
let totalScore = 0;  
// 2D array for board
let boardData = [];
// 첫 칸 선택
let startPos = null;
// 힌트 표시 중인 라인
let hintLinePositions = null;

// 타이머 관련 (한 번만 선언)
let timerInterval = null;  
let elapsedSeconds = 0;

/****************************************************************
 * 2. 라운드 초기화
 ****************************************************************/
function initRound(round=1){
  currentRound = round;
  targetSum = getTargetForRound(currentRound);

  // 점수 초기화
  totalScore = 0;

  // 보드 생성
  boardData = [];
  for(let r=0;r<BOARD_ROWS;r++){
    let rowArr=[];
    for(let c=0;c<BOARD_COLS;c++){
      let val= Math.floor(Math.random()*(MAX_NUM - MIN_NUM +1))+MIN_NUM;
      rowArr.push(val);
    }
    boardData.push(rowArr);
  }

  startPos=null;
  hintLinePositions=null;

  updateInfoBar();
  renderBoard();
}

/****************************************************************
 * 3. DOM 참조
 ****************************************************************/
const roundLabelEl = document.getElementById("round-label");
const targetNumberEl = document.getElementById("target-number");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

const boardEl = document.getElementById("game-board");
const noMoreBtn = document.getElementById("no-more");
const hintBtn = document.getElementById("hint-btn");

const overlayEl = document.getElementById("overlay");
const overlayMsgEl = document.getElementById("overlay-message");

// 현재 언어 저장
let currentLanguage = document.getElementById('language-select').value;

/****************************************************************
 * 4. 상단 정보 업데이트
 ****************************************************************/
function updateInfoBar(){
  roundLabelEl.textContent = `${translations[currentLanguage].round} ${currentRound}`;
  targetNumberEl.textContent = targetSum;
  scoreEl.textContent = totalScore;
}

/****************************************************************
 * 5. 보드 렌더링
 ****************************************************************/
function renderBoard(){
  boardEl.innerHTML="";
  for(let r=0;r<BOARD_ROWS;r++){
    let tr = document.createElement("tr");
    for(let c=0;c<BOARD_COLS;c++){
      let td=document.createElement("td");
      let val= boardData[r][c];
      if(val===null){
        td.textContent="";
        td.classList.add("hidden-tile");
      } else {
        td.textContent=val;
      }

      // 클릭 이벤트
      td.addEventListener("click", ()=> onTileClick(r,c));

      // 시작칸 강조
      if(startPos && startPos[0]===r && startPos[1]===c){
        td.classList.add("selected");
      }

      tr.appendChild(td);
    }
    boardEl.appendChild(tr);
  }

  // 힌트 라인이 있으면 다시 표시
  if(hintLinePositions){
    markLine(hintLinePositions, "hint-line");
  }
}

/****************************************************************
 * 6. 타일 클릭 로직
 ****************************************************************/
function onTileClick(r,c){
  // 첫 클릭
  if(!startPos){
    startPos=[r,c];
    statusBarEl.textContent=`${translations[currentLanguage].startTile}: (${r},${c}) val=${
      boardData[r][c]===null?0:boardData[r][c]
    }`;
    renderBoard();
    return;
  }

  // 같은 칸 클릭->취소
  if(startPos[0]===r && startPos[1]===c){
    startPos=null;
    statusBarEl.textContent=translations[currentLanguage].cancelSelection;
    renderBoard();
    return;
  }

  // 두 번째 클릭
  const endPos=[r,c];
  checkLine(startPos,endPos);

  startPos=null;
  renderBoard();
}

/****************************************************************
 * 7. 라인 검사
 ****************************************************************/
function checkLine(start, end) {
  const linePositions = getLinePositions(start, end);
  
  // 선택한 타일이 하나뿐인 경우 토스트 메시지 표시
  if (linePositions.length === 1) {
    showIOSToastMessage(translations[currentLanguage].hintMessage);
    return;
  }

  if (!linePositions) {
    showIOSToastMessage("잘못된 경로!");
    return;
  }

  // 힌트 표시 중이면 해제
  if (hintLinePositions) {
    markLine(hintLinePositions, null, "hint-line");
    hintLinePositions = null;
  }

  // sumVal: 실제 숫자합, gapCount: null칸
  let sumVal = 0;
  let gapCount = 0;
  for (const [rr, cc] of linePositions) {
    if (boardData[rr][cc] === null) {
      gapCount++;
    } else {
      sumVal += boardData[rr][cc];
    }
  }
  let length = linePositions.length;

  // 합이 targetSum인지 확인
  if (sumVal === targetSum) {
    // 점수 계산
    let gapBonus = gapCount * 10;
    let lengthBonus = length >= 3 ? (length - 2) * 5 : 0;
    let addScore = sumVal + gapBonus + lengthBonus;

    markLine(linePositions, "success-line");
    totalScore += addScore;
    updateInfoBar();

    showFloatingScore(`+${addScore}`, end[0], end[1]);

    setTimeout(() => {
      removeLineTiles(linePositions);
    }, 600);

  } else {
    // 실패 처리: 메시지 수정
    const failMessage = translations[currentLanguage].failSum.replace("{target}", targetSum);
    showIOSToastMessage(failMessage, 1500);
    markLine(linePositions, "fail-line");

    setTimeout(() => {
      markLine(linePositions, null, "fail-line");
    }, 600);

    // 타겟 점수만큼 감점
    totalScore = Math.max(0, totalScore - targetSum);
    updateInfoBar();

    // 점수 감점 효과 표시
    showFloatingScore(`-${targetSum}`, end[0], end[1], true);
  }
}

/** 일렬(가로/세로/대각) or null */
function getLinePositions([r1,c1],[r2,c2]){
  let rd=r2-r1, cd=c2-c1;
  if(rd===0 && cd===0)return null;
  if(!(rd===0||cd===0||Math.abs(rd)===Math.abs(cd)))return null;

  function gcd(a,b){return b===0?a:gcd(b,a%b);}
  let g= gcd(Math.abs(rd),Math.abs(cd));
  let stepR= rd/g, stepC= cd/g;

  let pos=[];
  let curR=r1,curC=c1;
  pos.push([curR, curC]);

  let steps = Math.max(Math.abs(rd), Math.abs(cd));
  for(let i=0;i<steps;i++){
    curR+=stepR; curC+=stepC;
    if(curR<0||curR>=BOARD_ROWS||curC<0||curC>=BOARD_COLS)return null;
    pos.push([curR, curC]);
  }
  return pos;
}

/** 특정 라인에 클래스 부여/제거 */
function markLine(positions, addClass=null, removeClass=null){
  let trList=boardEl.querySelectorAll("tr");
  positions.forEach(([r,c])=>{
    let td= trList[r].querySelectorAll("td")[c];
    if(removeClass){
      td.classList.remove(removeClass);
    }
    if(addClass){
      td.classList.add(addClass);
    }
  });
}

/** 타일 제거 */
function removeLineTiles(linePositions){
  let trList=boardEl.querySelectorAll("tr");
  for(const [r,c] of linePositions){
    let td=trList[r].querySelectorAll("td")[c];
    td.classList.remove("success-line");
    td.classList.add("removing");
  }
  setTimeout(()=>{
    for(const [r,c] of linePositions){
      boardData[r][c]=null;
    }
    renderBoard();
  },600);
}

/****************************************************************
 * 8. "결" 버튼
 ****************************************************************/
noMoreBtn.addEventListener("click", () => {
  let found = findAllPossibleLines();
  if (found.length > 0) {
    // 실패 -> -100
    totalScore = Math.max(0, totalScore - 100);
    updateInfoBar();
    showOverlay(`${translations[currentLanguage].overlayFail}`);
  } else {
    // 라운드 클리어 -> 다음 라운드
    totalScore += 100; // 성공 시 +100점
    updateInfoBar();
    showOverlay(`${translations[currentLanguage].overlayClear}${totalScore}<br>${translations[currentLanguage].overlayNext}`);
  }
});

/** 남은 라인 찾기 (합만 비교) */
function findAllPossibleLines(){
  let results=[];
  for(let r=0;r<BOARD_ROWS;r++){
    for(let c=0;c<BOARD_COLS;c++){
      for(let dr=-1;dr<=1;dr++){
        for(let dc=-1;dc<=1;dc++){
          if(dr===0 && dc===0) continue;
          let linePos=[[r,c]];
          let sumVal= boardData[r][c]===null?0:boardData[r][c];
          let nr=r,nc=c;
          for(let step=1;step<8;step++){
            nr+=dr;nc+=dc;
            if(nr<0||nr>=BOARD_ROWS||nc<0||nc>=BOARD_COLS) break;
            sumVal+= (boardData[nr][nc]===null?0:boardData[nr][nc]);
            linePos.push([nr,nc]);
            if(sumVal===targetSum){
              results.push([...linePos]);
            }
          }
        }
      }
    }
  }
  return results;
}

/****************************************************************
 * 9. Floating Score
 ****************************************************************/
function showFloatingScore(txt, r, c, isPenalty = false) {
  const trList = boardEl.querySelectorAll("tr");
  const td = trList[r].querySelectorAll("td")[c];
  let rect = td.getBoundingClientRect();

  let floatEl = document.createElement("div");
  floatEl.classList.add("floating-score");
  floatEl.textContent = txt;
  floatEl.style.color = isPenalty ? "#ff0000" : "#0000ff"; // 감점 시 빨간색, 점수 추가 시 파란색
  document.body.appendChild(floatEl);

  let x = rect.left + rect.width / 2;
  let y = rect.top + rect.height / 2;
  floatEl.style.left = `${x}px`;
  floatEl.style.top = `${y}px`;

  setTimeout(() => {
    if (floatEl.parentNode) {
      floatEl.parentNode.removeChild(floatEl);
    }
  }, 1000);
}

/****************************************************************
 * 10. 힌트 버튼
 ****************************************************************/
let hintCount = 4;
const maxHints = 3;

hintBtn.addEventListener("click", onHintClick);

function onHintClick(isInitialHint = false) {
  // 힌트 버튼 비활성화
  hintBtn.disabled = true;
  let lines = findAllPossibleLines();
  if (lines.length === 0) {
    statusBarEl.textContent = translations[currentLanguage].hintMessage;
    return;
  }
  // 기존 힌트 있으면 제거
  if (hintLinePositions) {
    markLine(hintLinePositions, null, "hint-line");
    hintLinePositions = null;
  }
  // 하나 선택 (예: 첫 번째)
  let picked = lines[0];
  hintLinePositions = picked;
  // 표시
  markLine(picked, "hint-line");  
  
  useHint();
  // 힌트 메시지를 ios-toast로 표시
  showIOSToastMessage(translations[currentLanguage].hintMessage);

  setTimeout(() => {
    hintBtn.disabled = false;
  }, 3000); // 3초
}

/**
 * 힌트 사용 함수
 */
function useHint() {
  if (hintCount > 1) {
    hintCount--;
    updateHintButton();
  } else if (hintCount === 1) {
    // 광고 보기 모드로 변경
    showAdAndResetHints();
    hintCount = maxHints;
    updateHintButton();
  }
}

/**
 * 힌트 버튼 레이블 업데이트
 */
function updateHintButton() {
  if (hintCount > 1) {
    hintBtn.textContent = `${translations[currentLanguage].hint} (${hintCount})`;
    hintBtn.classList.remove("ad-mode");
  } else if (hintCount === 1) {
    hintBtn.textContent = `${translations[currentLanguage].hint} (Ad)`;
    hintBtn.classList.add("ad-mode");
  }
}
function showAdAndResetHints() {
  // 실제 Google AdSense 광고 통합 필요
  // 여기서는 모의로 광고 시청을 구현합니다.
  const adModal = document.getElementById("ad-modal");
  if (adModal) {
    adModal.style.display = "flex";
  }

  // 광고 시청이 완료되면 힌트 카운트 리셋
  setTimeout(() => {
    if (adModal) {
      adModal.style.display = "none";
    }
    hintCount = maxHints;
    updateHintButton();
    alert("힌트가 리셋되었습니다! 힌트를 다시 사용할 수 있습니다.");
  }, 5000); // 5초 후 리셋 (예시)
}


/****************************************************************
 * 11. 모달
 ****************************************************************/
function showOverlay(msg){
  overlayMsgEl.innerHTML = 
    `<div style="font-size:1.4rem; font-weight:600; margin-bottom:16px;">
        ${translations[currentLanguage].round} ${currentRound}
     </div>` 
     + msg 
     + `<br><button class="modal-button" onclick="closeOverlay()">${translations[currentLanguage].ok}</button>`;
  overlayEl.style.display = "flex";
}
function closeOverlay(){
  overlayEl.style.display = "none";
  let lines= findAllPossibleLines();
  if(lines.length===0){
    // 라운드 클리어 -> 다음 라운드
    currentRound++;
    initRound(currentRound);
  }
}

/****************************************************************
 * 12. 타이머(HH:MM:SS)
 ****************************************************************/
function startTimer(){
  timerInterval = setInterval(()=>{
    elapsedSeconds++;
    timerEl.textContent = formatTime(elapsedSeconds);
  },1000);
}
function formatTime(sec){
  let h = Math.floor(sec/3600);
  let m = Math.floor((sec%3600)/60);
  let s = sec%60;
  let hh = (h<10)?"0"+h:h;
  let mm = (m<10)?"0"+m:m;
  let ss = (s<10)?"0"+s:s;
  return `${hh}:${mm}:${ss}`;
}

/****************************************************************
 * 13. 게임 시작
 ****************************************************************/
window.onload=()=>{
  // 타이머 시작(중복 선언 없이 한번만)
  startTimer();

  // 첫 라운드 시작
  initRound(1);

  // 첫 번째 힌트 자동 표시
  onHintClick(true);
};

// === [추가] 드래그 선택 시 강조 효과 ===
let isDragging = false;
let dragPositions = [];
let dragDirection = null;

function startDragSelect(r, c) {
  isDragging = true;
  dragPositions = [[r, c]];
  dragDirection = null; // 'row', 'col', 'diag' 등
  startPos = [r, c];
  markDragSelection(dragPositions);
}

function continueDragSelect(r, c) {
  if (!isDragging) return;

  // 이미 동일 칸이면 무시
  let lastPos = dragPositions[dragPositions.length - 1];
  if (lastPos[0] === r && lastPos[1] === c) {
    return;
  }

  // 최초로 방향을 결정해야 하는 시점(두 번째 칸)
  if (dragDirection === null) {
    const dr = r - startPos[0];
    const dc = c - startPos[1];
    // 가로(동일 행) / 세로(동일 열) / 대각( |dr| == |dc| ) 체크
    if (dr === 0 && dc !== 0) {
      dragDirection = 'row';   // 같은 행
    } else if (dc === 0 && dr !== 0) {
      dragDirection = 'col';   // 같은 열
    } else if (Math.abs(dr) === Math.abs(dc)) {
      dragDirection = 'diag';  // 대각선
    } else {
      // 방향이 확정되지 않으면 중단
      return;
    }
  }

  // 지금 클릭/터치한 (r,c)가 dragDirection에 맞는지 확인
  if (!isInSameLine(startPos, [r, c], dragDirection)) {
    return; // 일렬이 아니면 무시
  }

  // 기존 하이라이트 지우고
  clearDragSelection();
  // 새로 (startPos)부터 (r,c)까지 라인 계산 후 하이라이트
  const linePositions = getLinePositions(startPos, [r, c]);
  if (!linePositions) return;
  dragPositions = linePositions; 
  markDragSelection(dragPositions);
}

function stopDragSelect() {
  if (!isDragging) return;
  isDragging = false;

  // 드래그로 선택된 그룹의 합산 체크
  if (!dragPositions || dragPositions.length < 2) {
    clearDragSelection();
    showIOSToastMessage(translations[currentLanguage].hintMessage);
  } else {
    checkDragSelectedTiles();
  }
}

/* [추가] 방향 검사 로직(가로/세로/대각) */
function isInSameLine([r1, c1], [r2, c2], direction) {
  if (direction === 'row') {
    return (r1 === r2);
  } else if (direction === 'col') {
    return (c1 === c2);
  } else if (direction === 'diag') {
    return (Math.abs(c2 - c1) === Math.abs(r2 - r1));
  }
  return false;
}

/* [추가] 드래그 중 라인 강조 */
function markDragSelection(linePositions) {
  const trList = boardEl.querySelectorAll("tr");
  linePositions.forEach(([r, c]) => {
    const td = trList[r].querySelectorAll("td")[c];
    td.classList.add('drag-select-highlight', 'shrink'); // 'shrink' 클래스 추가
  });
}

/* [수정] 드래그 선택 해제 */
function clearDragSelection() {
  const trList = boardEl.querySelectorAll("tr");
  dragPositions.forEach(([r, c]) => {
    const td = trList[r].querySelectorAll("td")[c];
    td.classList.remove('drag-select-highlight');
  });
  dragPositions = [];
}

/* [수정] 드래그된 타일들 합산 체크 */
function checkDragSelectedTiles() {
  const start = dragPositions[0];
  const end = dragPositions[dragPositions.length - 1];
  clearDragSelection(); 
  checkLine(start, end);
}

// === [수정] 보드 렌더링 시 mousedown, mousemove, mouseup(또는 터치 이벤트) 추가 ===
function renderBoard(){
  boardEl.innerHTML = "";
  for(let r=0; r<BOARD_ROWS; r++){
    let tr = document.createElement("tr");
    for(let c=0; c<BOARD_COLS; c++){
      let td = document.createElement("td");
      
      td.textContent = boardData[r][c] === null ? "" : boardData[r][c];

      // 기존 td.addEventListener("click", ...) ...
      td.addEventListener("mousedown", () => startDragSelect(r, c));
      td.addEventListener("mousemove", () => continueDragSelect(r, c));
      td.addEventListener("mouseup", () => stopDragSelect());
      // 터치 환경도 처리
      td.addEventListener("touchstart", () => startDragSelect(r, c), {passive: true});
      td.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
        if (targetEl && targetEl.tagName === 'TD') {
          const rowIndex = [...boardEl.querySelectorAll('tr')].indexOf(targetEl.parentNode);
          const colIndex = [...targetEl.parentNode.children].indexOf(targetEl);
          continueDragSelect(rowIndex, colIndex);
        }
      }, {passive: true});
      td.addEventListener("touchend", () => stopDragSelect());

      // 시작칸 강조
      if(startPos && startPos[0]===r && startPos[1]===c){
        td.classList.add("selected");
      }

      tr.appendChild(td);
    }
    boardEl.appendChild(tr);
  }
  if (hintLinePositions) {
    markLine(hintLinePositions, "hint-line");
  }
  // 기존 코드...
} 