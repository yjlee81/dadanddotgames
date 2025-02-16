// 대신 router.js를 일반 스크립트로 로드

/***************************************************
 * Firebase 초기화 및 DB 설정
 ***************************************************/
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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/***************************************************
 * i18n (다국어 설정)
 ***************************************************/
const translations = {
  en: {
    mainTitle: "Sum or Done",
    gameCount: "Total Played",
    startGame: "Start Now >",
    goal: "TargetSum",
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
    about: "About",
    privacyPolicy: "Privacy Policy",
    footerText: "© 2025 Dadanddot.com",
    // 추가/수정된 key들
    rank: "Rank",
    playCountSubtitle1: "A number puzzle game with a total of ",
    playCountSubtitle2: " plays",
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
    howToPlayHeader1: "1) Drag & Select",
    howToPlayDetail1: "Swipe horizontally, vertically, or diagonally to connect numbers",
    howToPlayHeader2: "2) Strategic Finish",
    howToPlayDetail2: "Press Done! when you can't find more combinations",
    howToPlayHeader3: "3) Boost Your Score",
    howToPlayDetail3: "Longer chains = More bonuses! Empty tiles add extra points",
    gameInstruction: "Drag to select numbers to find the TargetSum, and press Done! if you cannot make it.",
    // 새로 추가된 tos 관련 항목
    tos_consent1: "By selecting the \"Start Now >\" button above,",
    tos: "Terms of Service",
    tos_consent2: "agree to the",
    no_more_hints: "You cannot get any more hints.",
    lengthBonusLabel: "Length",
    emptyBonusLabel: "Empty",
    nickname: "Name",
    cumulativeScore: "Total Score",
    aboutDetail: "Dadanddot is a game development company that creates fun and engaging games for all ages.",
    gameInstruction: "Drag to select numbers to find the TargetSum, and press Done! if you cannot make it.",
    finalRoundTitle: "🎉 Congratulations! 🎉",
    finalRoundMessage: "You succeeded in the final round!",
    roundSuccessTitle: "Success!",
    baseScoreLabel: "Base Score",
    bonusScoreLabel: "Bonus Score",
    timeBonusLabel: "Time Bonus",
    earnedScoreLabel: "Earned Score",
    finalScoreLabel: "Final Score",
    homeButton: "Home",
    continueButton: "Continue",
    nextRoundButton: "Next Round",
    globalRanking: "Global Rank",
    rankingSuffix: "th",
    settings: "Settings",
    settingsTitle: "Settings",
    languageLabel: "Language",
    termsPrivacyLabel: "Terms & Privacy",
    creditsLabel: "Credits",
    iconsBy: "Icons by",
    madeBy: "Made with ♥ by Dadanddot",
    editNicknameTitle: "Edit Nickname",
    newNicknamePlaceholder: "New Nickname",
    saveButton: "Save",
    cancelButton: "Cancel",
    // 랭킹 관련
    noDataMessage: "No data to display",
    rankColumn: "Rank",
    nicknameColumn: "Nickname",
    scoreColumn: "Score",
    targetScoreBadge: "Target",
    
    // 탭 관련
    playersTab: "Players",
    roundTab: "Round",
    
    // 튜토리얼 관련
    masterTheGame: "Master the Game",
    
    // 모달 관련
    closeModal: "Close",
    
    // 점수 표시
    points: "pts",
    
    // 힌트 메시지
    remainingHints: "Remaining hints: ",
    
    // 닉네임 변경
    changeNickname: "Change Nickname",
    newRecord: "New Record!",
    personalBest: "Personal Best",
    gameCenter: "Game Center",
    leaderboard: "Leaderboard",
    achievements: "Achievements",
  },
  ko: {
    mainTitle: "숫자 결합",
    welcome: " 님,",
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
    about: "About",
    privacyPolicy: "개인정보 처리방침",
    footerText: "© 2025 Dadanddot.com",
    // 추가/수정된 key들
    rank: "순위",
    playCountSubtitle1: "총 ",
    playCountSubtitle2: "번 플레이를 기록한 숫자 퍼즐게임",
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
    howToPlayHeader1: "1) 드래그로 숫자 선택",
    howToPlayHeader2: "2) 결! 누르기",
    howToPlayHeader3: "3) 보너스 점수 얻기",
    howToPlayDetail1: "드래그로 일렬/대각선 숫자들을 선택해요.",
    howToPlayDetail2: "목표합을 만들수 없으면 결!을 눌러요.",
    howToPlayDetail3: "숫자칸이 길수록 보너스점수를 얻어요.",
    gameInstruction: "숫자들을 드래그해 위의 목표합을 만드세요",
    hintMessage: "드래그하여 숫자를 선택하세요.",
    noCombinationToast: "더이상 없어요. 결!을 선택하세요",
    tos_consent1: "위의 [지금 시작하기 >] 버튼을 선택함으로써",
    tos: "이용약관",
    tos_consent2: "에 동의해요.",
    no_more_hints: "힌트가 모두 소진되었어요.",
    lengthBonusLabel: "길이",
    emptyBonusLabel: "빈칸",
    nickname: "이름",
    cumulativeScore: "누적점수",
    aboutDetail: "Dadanddot는 모든 연령대를 위한 재미있고 몰입감 있는 게임을 제작하는 게임 개발 회사입니다.",
    gameInstruction: "숫자들을 드래그해 목표합을 찾고, 더이상 없으면 결!을 눌러요.",
    finalRoundTitle: "🎉 축하합니다! 🎉",
    finalRoundMessage: "마지막 라운드에서 성공했어요!",
    roundSuccessTitle: "성공!",
    baseScoreLabel: "기본 점수",
    bonusScoreLabel: "결 성공 보너스",
    timeBonusLabel: "남은 시간 보너스",
    earnedScoreLabel: "최종 점수",
    finalScoreLabel: "최종 점수",
    homeButton: "홈으로",
    continueButton: "계속 더 진행하기",
    nextRoundButton: "다음 라운드",
    globalRanking: "전체 랭킹",
    rankingSuffix: "위",
    settings: "설정",
    settingsTitle: "설정",
    languageLabel: "언어",
    termsPrivacyLabel: "약관 및 개인정보",
    creditsLabel: "크레딧",
    iconsBy: "아이콘 제공:",
    madeBy: "Dadanddot이 ♥으로 만들었습니다",
    tos: "이용약관",
    privacyPolicy: "개인정보처리방침",
    editNicknameTitle: "닉네임 수정",
    newNicknamePlaceholder: "새 닉네임",
    saveButton: "확인",
    cancelButton: "취소",
    // 랭킹 관련
    noDataMessage: "표시할 데이터가 없습니다",
    rankColumn: "순위",
    nicknameColumn: "닉네임",
    scoreColumn: "점수",
    targetScoreBadge: "목표합",
    
    // 탭 관련
    playersTab: "플레이어",
    roundTab: "라운드",
    
    // 튜토리얼 관련
    masterTheGame: "게임 마스터하기",
    
    // 모달 관련
    closeModal: "닫기",
    
    // 점수 표시
    points: "점",
    
    // 힌트 메시지
    remainingHints: "남은 힌트: ",
    
    // 닉네임 변경
    changeNickname: "닉네임 변경",
    newRecord: "신기록!",
    personalBest: "최고 기록",
    gameCenter: "게임센터",
    leaderboard: "리더보드",
    achievements: "도전과제",
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
    about: "紹介",
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
    howToPlayHeader1: "1. ドラッグで数字を選択",
    howToPlayHeader2: "2. 完了！を押す",
    howToPlayHeader3: "3. ボーナスポイントを獲得",
    howToPlayDetail1: "直線で数字をドラッグして選択",
    howToPlayDetail2: "もう合計が作れなければ 完了！を押す",
    howToPlayDetail3: "長いラインほどボーナス点を獲得",
    gameInstruction: "数字をドラッグして目標値を見つけ、できない場合は完了！を押してください。",
    hintMessage: "ドラッグして数字を選択",
    noCombinationToast: "もうないよ。Done!を押す",
    // 새로 추가된 tos 관련 항목
    tos_consent1: "上記の「今すぐ始める >」ボタンを選択することで、",
    tos: "利用規約",
    tos_consent2: "に同意します。",
    no_more_hints: "ヒントを取得できません。",
    lengthBonusLabel: "長さ",
    emptyBonusLabel: "空き",
    nickname: "名前",
    cumulativeScore: "累積スコア",
    aboutDetail: "Dadanddotは、あらゆる年齢層のために楽しく魅力的なゲームを制作するゲーム開発会社です。",
    gameInstruction: "数字をドラッグして目標値を見つけ、できない場合はDone!を押してください。",
    finalRoundTitle: "🎉 おめでとうございます! 🎉",
    finalRoundMessage: "最終ラウンドで成功しました!",
    roundSuccessTitle: "成功!",
    baseScoreLabel: "基本スコア",
    bonusScoreLabel: "完了ボーナス",
    timeBonusLabel: "残り時間ボーナス",
    earnedScoreLabel: "獲得スコア",
    finalScoreLabel: "最終スコア",
    homeButton: "ホーム",
    continueButton: "続ける",
    nextRoundButton: "次のラウンド",
    globalRanking: "総合ランキング",
    rankingSuffix: "位",
    settings: "設定",
    settingsTitle: "設定",
    languageLabel: "言語",
    termsPrivacyLabel: "利用規約とプライバシー",
    creditsLabel: "クレジット",
    iconsBy: "アイコン提供：",
    madeBy: "Dadanddotが♥を込めて制作",
    editNicknameTitle: "ニックネーム編集",
    newNicknamePlaceholder: "新しいニックネーム",
    saveButton: "確認",
    cancelButton: "キャンセル",
    // 랭킹 관련
    noDataMessage: "表示するデータがありません",
    rankColumn: "順位",
    nicknameColumn: "ニックネーム",
    scoreColumn: "スコア",
    targetScoreBadge: "目標",
    
    // 탭 관련
    playersTab: "プレイヤー",
    roundTab: "ラウンド",
    
    // 튜토리얼 관련
    masterTheGame: "ゲームをマスターする",
    
    // 모달 관련
    closeModal: "閉じる",
    
    // 점수 표시
    points: "点",
    
    // 힌트 메시지
    remainingHints: "残りヒント：",
    
    // 닉네임 변경
    changeNickname: "ニックネーム変更",
    newRecord: "新記録!",
    personalBest: "自己ベスト",
    gameCenter: "ゲームセンター",
    leaderboard: "リーダーボード",
    achievements: "実績",
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
    about: "关于",
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
    howToPlayHeader1: "1. 拖动选择数字",
    howToPlayHeader2: "2. 点击 '完成！'",
    howToPlayHeader3: "3. 获得奖励分数",
    howToPlayDetail1: "拖动数字成一条线连接", 
    howToPlayDetail2: "如果无法再组成目标值，请点击 '完成！'",
    howToPlayDetail3: "数字越长，获得的奖励分数越高",
    gameInstruction: "拖动数字成一条线连接",
    hintMessage: "拖动数字成一条线连接",
    noCombinationToast: "没有更多了。请点击 '完成！'",
    // 새로 추가된 tos 관련 항목
    tos_consent1: "上記の「今すぐ始める >」ボタンを選択することで、",
    tos: "利用規約",
    tos_consent2: "に同意します。",
    no_more_hints: "ヒントを取得できません。",
    lengthBonusLabel: "長さ",
    emptyBonusLabel: "空き",
    nickname: "名前",
    cumulativeScore: "累计分数",
    aboutDetail: "Dadanddot是一家游戏开发公司，致力于为各个年龄段创造有趣且引人入胜的游戏。",
    gameInstruction: "数字をドラッグして目標値を見つけ、できない場合はDone!を押してください。",
    finalRoundTitle: "🎉 おめでとうございます! 🎉",
    finalRoundMessage: "最終ラウンドで成功しました!",
    roundSuccessTitle: "成功!",
    baseScoreLabel: "基本スコア",
    bonusScoreLabel: "完了ボーナス",
    timeBonusLabel: "残り時間ボーナス",
    earnedScoreLabel: "獲得スコア",
    finalScoreLabel: "最終スコア",
    homeButton: "ホーム",
    continueButton: "続ける",
    nextRoundButton: "次のラウンド",
    globalRanking: "总排名",
    rankingSuffix: "名",
    settings: "设置",
    settingsTitle: "设置",
    languageLabel: "语言",
    termsPrivacyLabel: "条款和隐私",
    creditsLabel: "制作信息",
    iconsBy: "图标来源：",
    madeBy: "由 Dadanddot 用♥制作",
    editNicknameTitle: "修改昵称",
    newNicknamePlaceholder: "新昵称",
    saveButton: "确认",
    cancelButton: "取消",
    // 랭킹 관련
    noDataMessage: "没有可显示的数据",
    rankColumn: "排名",
    nicknameColumn: "昵称",
    scoreColumn: "分数",
    targetScoreBadge: "目标",
    
    // 탭 관련
    playersTab: "玩家",
    roundTab: "回合",
    
    // 튜토리얼 관련
    masterTheGame: "掌握游戏",
    
    // 모달 관련
    closeModal: "关闭",
    
    // 점수 표시
    points: "分",
    
    // 힌트 메시지
    remainingHints: "剩余提示：",
    
    // 닉네임 변경
    changeNickname: "更改昵称",
    newRecord: "新纪录！",
    personalBest: "个人最佳",
    gameCenter: "游戏中心",
    leaderboard: "排行榜",
    achievements: "成就",
  },
  
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

// 전역 변수: 기본 필터 값이 'all'이 되도록 설정
let currentPeriodFilter = "all";  // 기간 필터 기본값
let currentGoalFilter = "all";    // 목표합 필터 기본값

/** 
 * 최초 보드 렌더링 여부 확인 플래그 
 * true면 첫 렌더에서만 샤라락 효과 적용 후 false로 바뀜
 */
let isFirstRender = true;
let hintsLeft = 3; //  힌트남은 횟수 3

/***************************************************
 * 게임 카운트 관련 (Firebase)
 ***************************************************/
// 게임 카운트 가져오기 및 표시
function fetchAndDisplayGameCount() {
  const scoresRef = db.ref('scores');
  
  scoresRef.once('value')
    .then((snapshot) => {
      // scores 컬렉션의 총 개수를 카운트
      const count = snapshot.numChildren() || 0;
      const gameCountEl = document.getElementById("game-count-value");
      if (gameCountEl) {
        animateNumber(gameCountEl, 0, count, 1000);
      }
    })
    .catch((error) => {
      console.error("게임 카운트 가져오기 실패:", error);
    });
}

// 게임 플레이 시 게임 카운트는 scores에 기록될 때 자동으로 증가
function incrementGameCount() {
  // scores 컬렉션에 기록이 추가될 때 자동으로 카운트가 증가하므로
  // 별도의 카운트 증가 로직이 필요 없음
  fetchAndDisplayGameCount();
}



/***************************************************
 * 스코어 관련 (Firebase)
 ***************************************************/

function fetchScoresFromFirebase(callback) {
  const scoresRef = db.ref('scores');
  scoresRef.on('value', (snapshot) => {
    const scores = [];
    snapshot.forEach((childSnapshot) => {
      const scoreData = childSnapshot.val();
      scores.push({
        nickname: scoreData.nickname || 'Guest',
        score: scoreData.score || 0,
        target: scoreData.target || 0,
        timestamp: scoreData.timestamp || Date.now()
      });
    });
    callback(scores);
  }, (error) => {
    console.error('Firebase 데이터 가져오기 실패:', error);
  });
}

// 헬퍼 함수: 타임스탬프를 MM/DD HH:mm 형식으로 반환
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}

// 기존 점수 데이터 전체 출력 함수 (예시)
function displayScores(scoreList) {
  console.log('받은 점수 데이터:', scores); // 데이터 구조 확인
  const tbody = document.querySelector("#score-table tbody");
  tbody.innerHTML = ""; // 기존 점수 목록 초기화

  scoreList
    .sort((a, b) => b.score - a.score) // 점수 내림차순 정렬
    .slice(0, 5) // 상위 100개 선택
    .forEach((score, index) => {
      const row = document.createElement("tr");
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${score.nickname ? score.nickname : "Guest"}</td>
        <td>${score.score}</td>
        <td>${score.target}</td>
        <td>${formatTimestamp(score.timestamp)}</td>
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
  // 게임 기록 데이터 구성
  const newRecord = {
    nickname: currentNickname ? currentNickname : "Guest",
    score: score,
    diff: diff,
    target: target,
    timestamp: Date.now()
  };
  
  // 1. 일반 점수 저장
  db.ref("scores").push(newRecord)
    .then(() => {
      console.log("점수 저장 성공:", newRecord);
      
      // 2. 누적 점수 업데이트 (파라미터 수정)
      return updateCumulativeScore(score); // 닉네임 파라미터 제거
    })
    .then(newScore => {
      console.log("새로운 누적점수:", newScore);
      showCumulativeScore(newScore); // UI 업데이트
    })
    .catch((error) => {
      console.error("점수 저장 실패:", error);
    });
}

// 스코어보드 렌더링
function renderScoreTable(scoreRecords) {
  if (!scoreTableBody) return;
  scoreTableBody.innerHTML = "";
  
  // 점수 내림차순 정렬 후 상위 5개 선택
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
  // 언어 설정 표시
  loadLanguagePreference();

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

  // 누적점수를 화면에 표시하려면 아래처럼 DOM에 표시 가능
  document.getElementById('cumulative-score').textContent = newScore;

  const nicknameChangeBtn = document.getElementById("nickname-change-btn");
  if (nicknameChangeBtn) {
    nicknameChangeBtn.addEventListener("click", () => {
      // 모달 열기
      document.getElementById("changeNicknameModal").style.display = "block";
    });
  }

  // "확인" 버튼 로직
  const saveNicknameBtn = document.getElementById("saveNicknameBtn");
  if (saveNicknameBtn) {
    saveNicknameBtn.addEventListener("click", () => {
      const newNicknameInput = document.getElementById("newNicknameInput");
      const newNickname = newNicknameInput.value.trim();

      if (newNickname) {
        // 새 닉네임 저장 로직 (예: Firebase / localStorage / 화면 반영)
        console.log("새 닉네임:", newNickname);

        // 여기서 localStorage에 저장하거나, firebase DB에 업데이트 가능
        // 예시)
        localStorage.setItem("customNickname", newNickname);

        // 화면에 즉시 반영 (index.html에서 nickname 요소가 있다면)
        const nicknameEl = document.getElementById("nickname");
        if (nicknameEl) {
          nicknameEl.textContent = newNickname;
        }

        // 모달 닫기
        closeModal("changeNicknameModal");
      } else {
        alert("닉네임을 입력해주세요.");
      }
    });
  }

  // 기존 displayCurrentUserScore(), onGameOver() 등...
});

/***************************************************
 * 게임 초기화
 ***************************************************/
function initializeGame() {
  // DOM 요소 바인딩
  gameOverOverlayEl = document.getElementById('game-over-overlay');
  gameOverMessageEl = document.getElementById('game-over-message');
  
  // start-game-btn에도 이벤트 리스너 추가
  const startGameBtn = document.getElementById("start-game-btn");
  if (startGameBtn) {
    startGameBtn.addEventListener("click", window.onStartGame);
  }
}

/***************************************************
 * 게임 시작 핸들러 (롤백된 카운트다운 버전)
 ***************************************************/
window.onStartGame = function() {
  // 헤더 숨기기
  document.querySelector('.main-header').style.display = 'none';
  
  const selectedGoal = parseInt(document.getElementById("round-select").value, 10) || 10;
  targetSum = selectedGoal;

  // 게임 카운트 표시 업데이트
  incrementGameCount();  // 주석 해제

  // 난이도(6x6)는 고정
  BOARD_ROWS = 6;
  BOARD_COLS = 6;

  // (1) 먼저 타이틀 숨기고 로딩바 오버레이 표시
  titleScreenEl.style.display = "none";
  countdownOverlayEl.style.display = "flex";
  gameContainerEl.style.display = "none";

  showGoalOnCountdownOverlay(targetSum);
}

/***************************************************
 * 카운트다운 오버레이에서 목표점수를 표시하는 헬퍼 함수
 ***************************************************/
function showGoalOnCountdownOverlay(value, delay = 2000) {
  const goalNumEl = document.getElementById("goal-value");
  if (goalNumEl) {
    goalNumEl.textContent = value; 
  }

  // 로딩바 초기화 → 0%에서 시작
  const loadingBarEl = document.getElementById("loading-bar");
  loadingBarEl.style.width = "0%";

  // 아주 살짝 지연 후 로딩바 애니메이션 시작
  setTimeout(() => {
    loadingBarEl.style.width = "100%";
  }, 50);

  // 지정된 delay 후 오버레이를 닫고, 보드 구성 (initRound호출)
  setTimeout(() => {
    countdownOverlayEl.style.display = "none";
    gameContainerEl.style.display = "flex";
    initRound();  // initRound() 내부에서 startTimer()를 호출하므로 중복 호출 방지됨
  }, delay);
}

/***************************************************
 * 라운드 초기화
 ***************************************************/
function initRound() {
  // 기존 타이머 정리 추가
  stopTimer(); // ★ 추가 필요
  
  const loadingBar = document.getElementById('loading-bar');

  // 기존 transition 제거 후 width를 0%로 리셋
  loadingBar.style.transition = 'none';
  loadingBar.style.width = '0%';

  // 강제로 reflow를 발생시켜서 style 변경을 적용
  void loadingBar.offsetWidth;

  // transition을 재설정하고, 애니메이션이 시작되도록 width를 100%로 변경
  loadingBar.style.transition = 'width 3s linear';
  loadingBar.style.width = '100%';

  // 나머지 라운드 초기화 로직이 있다면 이어서 진행
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
  hintsLeft = 3;
  isTimerPaused = false;
  startTimer();
  updateTimerDisplay();
  updateHintButtonLabel()

  // 보드 렌더
  renderBoard();

  // 힌트 횟수 초기화 및 버튼 텍스트 업데이트
  hintsLeft = 3;
  updateHintButtonLabel();
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

    const gapBonus = gapCount * 5;
    const lengthBonus = (linePositions.length >= 3) ? (linePositions.length - 2) * 5 : 0;
    const addScore = sumVal + gapBonus + lengthBonus;
    
    const scoreEl = document.getElementById("score");
    const previousScore = parseInt(scoreEl.textContent, 10) || 0;
    const newScore = previousScore + addScore;
    
    // 애니메이션 적용
    animateNumber(scoreEl, previousScore, newScore, 500, () => {
      totalScore = newScore;
    });

    // ------------------------------------------------------------
    // [중요] 보드 데이터에서 즉시 타일 제거 (논리적 제거)
    for (const [r, c] of linePositions) {
      boardData[r][c] = null;
    }
    // ------------------------------------------------------------

    markLine(linePositions, "success-line");
    showFloatingScore(sumVal, lengthBonus, gapBonus, document.getElementById("game-board").rows[end[0]].cells[end[1]]);

    // 시각적 효과(애니메이션)는 조금 뒤에 제거
    setTimeout(() => {
      removeLineTiles(linePositions);
    }, 300);
  } else {
    markLine(linePositions, "fail-line");
    const failMessage = translations[currentLanguage]?.failSum 
                      || `목표합이 ${targetSum}이어야 합니다!`;
    showIOSToastMessage(failMessage.replace("{target}", targetSum), 1500);

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
  // (애니메이션을 위해 css 클래스를 부여)
  const trList = document.querySelectorAll("#game-board tr");
  for (const [r, c] of linePositions) {
    const td = trList[r].children[c];
    td.classList.remove("success-line");
    td.classList.add("removing"); // 사라지는 스타일
  }

  // 600ms 뒤 실제로 renderBoard() 실행
  setTimeout(() => {
    renderBoard();
  }, 300);
}

/***************************************************
 * Done 버튼
 ***************************************************/
async function onNoMoreClick() {
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
    await showFinalSuccessOverlay(timeBonus, isFinalRound);
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
    <button class="primary-button" onclick="closeOverlay()">확인</button>
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
  stopTimer(); // ★ 기존 타이머 정리 후 새로 시작
  timerInterval = setInterval(() => {
    // ----------------------------------------------
    // 1. 힌트가 표시되는 동안 광고 정지 로직 (광고 요소 ad-container가 존재한다고 가정)
    if (window.isHintVisible) {
      const adContainer = document.getElementById("ad-container");
      if (adContainer) {
        adContainer.style.display = "none";
      }
    } else {
      const adContainer = document.getElementById("ad-container");
      if (adContainer) {
        adContainer.style.display = "block";
      }
    }
    // ----------------------------------------------
    
    // 2. 남은 시간 감소
    remainingSeconds--;
    
    // 3. 타이머 텍스트 업데이트 (초 단위, 항상 한 줄로 표시)
    const timerEl = document.getElementById("timer");
    if (timerEl) {
      timerEl.textContent = remainingSeconds + "s";
    }
    
    // 4. 타이머 바 업데이트: 남은 시간에 따라 오른쪽부터 채워진 상태에서 왼쪽으로 줄어듦
    const timerBar = document.getElementById("timer-bar");
    if (timerBar) {
      let percentage = (remainingSeconds / totalTime) * 100;
      percentage = percentage < 0 ? 0 : percentage;
      timerBar.style.width = percentage + "%";
      
      // 남은 시간이 30초 이하일 때 low-time 클래스로 빨간색 pulse 효과 적용
      if (remainingSeconds <= 30) {
        timerEl && timerEl.classList.add("low-time");
        timerBar.classList.add("low-time");
      } else {
        timerEl && timerEl.classList.remove("low-time");
        timerBar.classList.remove("low-time");
      }
    }
    
    // 5. 남은 시간이 0 이하가 되면 타이머 종료 및 게임 오버 처리
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      // 게임 오버 관련 처리 함수 호출 (예: gameOver())
      showGameOver();
      stopTimer();
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

// 전체 시간을 지정합니다. (예: 150초)
const totalTime = 150;

function updateTimerDisplay() {
  const timerEl = document.getElementById("timer");
  if (!timerEl) {
    console.warn("타이머 요소('#timer')가 존재하지 않습니다.");
    return;
  }
  
  // 남은 시간을 초단위 문자열로 설정 (예: "150초")
  timerEl.textContent = remainingSeconds + "s";
  
  // 타이머 바 width 업데이트 (전체 시간 대비 남은 초 퍼센트)
  const timerBar = document.getElementById("timer-bar");
  if (timerBar) {
    let percentage = (remainingSeconds / totalTime) * 100;
    percentage = percentage < 0 ? 0 : percentage;
    timerBar.style.width = percentage + "%";
    
    // 남은 시간이 30초 이하이면 low-time 클래스 추가하여 pulse 효과 적용
    if (remainingSeconds <= 30) {
      timerEl.classList.add("low-time");
      timerBar.classList.add("low-time");
    } else {
      timerEl.classList.remove("low-time");
      timerBar.classList.remove("low-time");
    }
  }
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

  // 3초 카운트다운을 위해 showGoalOnCountdownOverlay에 delay 인자로 3000ms 전달
  showGoalOnCountdownOverlay(targetSum, 3000);
  
  // (삭제됨) 별도의 setTimeout 블록 내에서 initRound()와 startTimer() 호출 제거
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
        <tr class="final-row"><th>최종 획득 점수</th><td><span id="finalScoreValue">${totalScore}</span></td></tr>
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
  // 헤더 다시 표시
  document.querySelector('.main-header').style.display = 'flex';
  
  // 게임화면 숨기고, 타이머 중지
  gameContainerEl.style.display = "none";
  document.getElementById("game-over-overlay").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  titleScreenEl.style.display = "block";
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
    toastEl.style.top = "30px";
  }
  
  // 애플 아일랜드 박스 효과를 위한 클래스 추가
  toastEl.classList.add("show", "island-effect");

  setTimeout(() => {
    toastEl.classList.remove("show", "island-effect");
  }, duration);
}

/**
 * showFloatingScore - 오른쪽으로 이동하는 점수 이펙트 버전
 */
function showFloatingScore(baseScore, lengthBonus, emptyBonus, tileElement) {
  
  // 타일의 위치
  const rect = tileElement.getBoundingClientRect();

  // 점수 컨테이너
  const container = document.createElement('div');
  container.className = 'floating-score-container';
  container.style.position = 'absolute';
  container.style.left = `45%`;
  container.style.top = `75`;
  container.style.transform = 'translate(-50%, -50%)';
  container.style.zIndex = '9999';
  container.style.flexWrap = 'wrap';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.width = '100%';

  // 점수 박스 생성 함수
  function createScoreBox(text, extraClass) {
    const box = document.createElement('div');
    box.classList.add('floating-score-box', extraClass);
    box.textContent = text;
    return box;
  }


  // 점수들을 담는 컨테이너 (가로 방향)
  const stack = document.createElement('div');
  stack.style.display = 'flex';
  stack.style.flexDirection = 'row';   // ← 수평 배열
  stack.style.alignItems = 'center';
  stack.style.gap = '8px';            // 점수 박스 간격(가로)
  stack.style.flexWrap = 'wrap';
  container.appendChild(stack);

  // 기본 점수
  if (baseScore > 0) {
    const baseBox = createScoreBox(`+${baseScore}`, 'base-score');
    stack.appendChild(baseBox);
  }

  // 길이 보너스
  if (lengthBonus > 0) {
    const lengthBox = createScoreBox(`${translations[currentLanguage].lengthBonusLabel} +${lengthBonus}`, 'length-bonus');
    stack.appendChild(lengthBox);
  }

  // 빈칸 보너스
  if (emptyBonus > 0) {
    const emptyBox = createScoreBox(`${translations[currentLanguage].emptyBonusLabel} +${emptyBonus}`, 'empty-bonus');
    stack.appendChild(emptyBox);
  }

  document.body.appendChild(container);

  // 애니메이션 클래스 부여 (간격을 두고 순차로 등장)
  stack.querySelectorAll('.floating-score-box').forEach((box, index) => {
    const delay = index * 0.15; 
    box.style.animationDelay = `${delay}s`;
    box.classList.add('score-slide-right'); // ← 오른쪽 이동용 CSS 애니메이션
  });

  // 일정 시간 후 컨테이너 제거
  setTimeout(() => {
    container.remove();
  }, 3000);

  // info-box의 스코어 업데이트 시 강조 효과
  const scoreEl = document.getElementById('score');
  if (scoreEl) {
    scoreEl.classList.add('score-update-highlight');
    setTimeout(() => {
      scoreEl.classList.remove('score-update-highlight');
    }, 1000);
  }
}


// 확인필요
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
async function showFinalSuccessOverlay(timeBonus, isFinalRound = false) {
  const overlayEl = document.getElementById("overlay");
  const overlayMsgEl = document.getElementById("overlay-message");

  const baseScore = totalScore - 100;
  const previousBestScore = await getUserBestScore(targetSum);
  const isNewRecord = totalScore > previousBestScore;
  
  if (isFinalRound) {
    // 마지막 라운드인 경우
    overlayEl.classList.add('final-round');
    overlayMsgEl.innerHTML = `
      <h2 data-i18n="finalRoundTitle">🎉 축하합니다! 🎉</h2>
      <p data-i18n="finalRoundMessage">마지막 라운드에서 성공했어요!</p>
      <table id="score-summary-table">
        <tbody>
          <tr><th data-i18n="baseScoreLabel">기본 점수</th><td>${baseScore}</td></tr>
          <tr><th data-i18n="bonusScoreLabel">결 성공 보너스</th><td>+ 100</td></tr>
          <tr><th data-i18n="timeBonusLabel">남은 시간 보너스</th><td>+ <span id="time-bonus-anim">0</span></td></tr>
          <tr class="final-row">
            <th data-i18n="earnedScoreLabel">최종 획득 점수</th>
            <td>
              <span id="finalScoreValue">${totalScore}</span>
              ${isNewRecord ? `<span class="new-record-badge" data-i18n="newRecord">신기록!</span>` : ''}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="game-over-buttons">
        <button id="home-button" class="tertiary-button" onclick="backToTitleScreen()" data-i18n="homeButton">홈으로</button>
        <button class="modal-button" onclick="restartGame()" data-i18n="continueButton">계속 더 진행하기</button>
      </div>
    `;
  } else {
    // 일반 라운드인 경우
    overlayEl.classList.remove('final-round');
    overlayMsgEl.innerHTML = `
      <h2 data-i18n="roundSuccessTitle">성공!</h2>
      <table id="score-summary-table">
        <tbody>
          <tr><th data-i18n="baseScoreLabel">기본 점수</th><td>${baseScore}</td></tr>
          <tr><th data-i18n="bonusScoreLabel">결 성공 보너스</th><td>+ 100</td></tr>
          <tr><th data-i18n="timeBonusLabel">남은 시간 보너스</th><td>+ <span id="time-bonus-anim">0</span></td></tr>
          <tr class="final-row">
            <th data-i18n="earnedScoreLabel">최종 획득 점수</th>
            <td>
              <span id="finalScoreValue">${totalScore}</span>
              ${isNewRecord ? `<span class="new-record-badge" data-i18n="newRecord">신기록!</span>` : ''}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="game-over-buttons">
        <button id="home-button" class="tertiary-button" onclick="backToTitleScreen()" data-i18n="homeButton">홈으로</button>
        <button class="modal-button" onclick="nextRound()" data-i18n="nextRoundButton">다음 라운드</button>
      </div>
    `;
  }

  overlayEl.style.display = "flex";

  // 시간 보너스 애니메이션
  const timeBonusEl = document.getElementById("time-bonus-anim");
  animateNumber(timeBonusEl, 0, timeBonus, 1000, () => {
    totalScore += timeBonus;
    const finalScoreEl = document.getElementById("finalScoreValue");
    if (finalScoreEl) {
      finalScoreEl.textContent = totalScore;
    }
  });
}

function restartGame() {
  // 게임 초기화 로직
  currentRound = 1;
  hintsLeft = 3;
  updateHintButtonLabel(); // (3) 재시작 시 힌트 버튼 표시 업데이트
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
  }, 3000); // 1초 후 게임 시작

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
  
  // start-game-btn에도 이벤트 리스너 추가
  const startGameBtn = document.getElementById("start-game-btn");
  if (startGameBtn) {
    startGameBtn.addEventListener("click", window.onStartGame);
  }
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
// 탭의 활성화 상태 유지
document.querySelectorAll('.tab-link').forEach(tab => {
  tab.addEventListener('click', () => {
    // 모든 탭에서 active 제거
    document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
    // 클릭한 탭에 active 추가
    tab.classList.add('active');
    
    // (추가) data-link 값을 이용하여 해당 화면으로 라우팅하는 로직이 있다면 호출
    // 예: router.navigate(tab.getAttribute('data-link'));
    const route = tab.dataset.link;
    handleRouteChange(route);
  });
});


// 초기 로드 시 현재 경로에 맞는 탭 활성화
const currentPath = window.location.pathname;
updateTabState(currentPath);

// 날짜 필터 설정 함수
function setDateFilter(period) {
  // 모든 탭에서 active 클래스 제거
  const tabs = document.querySelectorAll('.tab-link');
  tabs.forEach(tab => tab.classList.remove('active'));

  // 클릭한 탭에 active 클래스 추가
  const clickedTab = document.querySelector(`.tab-link[data-period="${period}"]`);
  if (clickedTab) {
    clickedTab.classList.add('active');
  }

  // 필터 적용
  applyFilters();
}

// 초기화 시 기본 탭 활성화
function initTabs() {
  const defaultTab = document.querySelector('.tab-link[data-period="all"]');
  if (defaultTab) {
    defaultTab.classList.add('active');
  }
}

// 페이지 로드 시 탭 초기화
document.addEventListener('DOMContentLoaded', initTabs);

// 필터 적용 함수 수정
function applyFilters() {
  const dateFilter = document.querySelector('.tab-link.active')?.dataset.period || 'all';
  const goalFilter = document.querySelector('.chips-container .chip.active')?.dataset.goal || 'all';

  const filteredData = scores.filter(item => {
    // 날짜 필터링
    const itemDate = new Date(item.timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dateMatch = true;
    if (dateFilter === 'today') {
      dateMatch = itemDate >= today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      dateMatch = itemDate >= weekAgo;
    }

    // 목표합 필터링
    const goalMatch = goalFilter === 'all' || item.target === parseInt(goalFilter, 10);

    return dateMatch && goalMatch;
  });

  console.log('필터링된 데이터:', filteredData);
  renderRanking(filteredData);
}

// 필터(기간/목표합) 적용 후 테이블 렌더링 함수
function renderRanking(filteredData) {
  const tbody = document.querySelector("#rankingTableBody");
  if (!tbody) return;
  
  tbody.innerHTML = "";

  if (!filteredData || filteredData.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.classList.add("empty-message");
    emptyRow.innerHTML = `<td colspan="3" data-i18n="noDataMessage"></td>`;
    tbody.appendChild(emptyRow);
    return;
  }

  const sortedData = filteredData.sort((a, b) => b.score - a.score);
  const limitedData = sortedData.slice(0, 10);

  limitedData.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nickname}</td>
      <td>${item.score}<span data-i18n="points"></span></td>
    `;
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


/***************************************************
 * 힌트 버튼 클릭 핸들러
 ***************************************************/
function onHintClick(isInitialHint = false) {
  // 남은 힌트 횟수가 0 이하라면 사용 불가
  if (hintsLeft <= 0) {
    showIOSToastMessage(translations[currentLanguage].no_more_hints);
    return;
  }

  hintsLeft--; // 힌트 1회 차감
  updateHintButtonLabel(); // (1) 힌트 버튼에 남은 횟수 표시

  // 기존 힌트 로직
  let lines = findAllPossibleLines();
  if (lines.length === 0) {
    showIOSToastMessage(translations[currentLanguage].noCombinationToast);
    return;
  }

  if (hintLinePositions) {
    markLine(hintLinePositions, null, "hint-line");
    showIOSToastMessage(translations[currentLanguage].hintMessage);
    hintLinePositions = null;
  }
  let picked = lines[0];
  hintLinePositions = picked;
  markLine(picked, "hint-line");
  showIOSToastMessage(translations[currentLanguage].hintMessage + '(남은 힌트: ' + hintsLeft + '회)');

}

function updateHintButtonLabel() {
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) {
    // 현재 언어에 맞는 "힌트" 텍스트 가져오기
    const hintText = translations[currentLanguage]?.hint || "힌트";
    hintBtn.innerHTML = `${hintText} (${hintsLeft})`;
  }
}

/***************************************************
 * 닉네임 관련 로직 (페이지 새로고침해도 유지)
 ***************************************************/

// 랜덤 단어 목록 (형용사/동물)
const adjectives = ["Sunny", "Flying", "Brave", "Happy", "Swift", "Crazy", "Tiny"];
const animals = ["Tiger", "Elephant", "Lion", "Panda", "Fox", "Rabbit", "Koala"];

// 전역 닉네임 변수
let currentNickname = "";

/**
 * 랜덤 닉네임 생성 함수
 */
function generateRandomNickname() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const ani = animals[Math.floor(Math.random() * animals.length)];
  const num = Math.floor(1000 + Math.random() * 9000); // 4자리
  return `${adj}${ani}${num}`;
}

/**
 * 닉네임 중복 여부 확인 함수
 */
async function isNicknameDuplicated(nickname) {
  const snapshot = await firebase.database().ref('nicknames').orderByValue().equalTo(nickname).once('value');
  return snapshot.exists(); // 해당 닉네임이 있으면 true
}

/**
 * 닉네임을 Firebase에 저장 (중복 없을 시)
 * 닉네임과 함께 초기 누적 점수도 저장
 */
async function saveNicknameToFirebase(nickname) {
  const newRef = firebase.database().ref('nicknames').push();
  await newRef.set({
    nickname: nickname,
    cumulativeScore: 0,
    createdAt: Date.now()
  });
  return true; // 항상 성공 반환
}

/**
 * 페이지 로드시 닉네임 초기화
 *  1) localStorage에서 닉네임을 꺼냄.
 *  2) 만약 없으면 새 닉네임 생성 후 Firebase & localStorage에 저장.
 */
async function initializeNickname() {
  const storedNickname = localStorage.getItem("myNickname");
  const storedUserKey = localStorage.getItem("userKey"); // 추가: Firebase 키 저장

  if (storedNickname && storedUserKey) {
    currentNickname = storedNickname;
    document.getElementById("nickname").textContent = currentNickname;
    
    // 기존 누적점수 조회
    const userRef = firebase.database().ref(`nicknames/${storedUserKey}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();
    showCumulativeScore(userData.cumulativeScore || 0);
    
    return;
  }

  let tempNickname = generateRandomNickname();
  const newRef = firebase.database().ref('nicknames').push();
  const userKey = newRef.key; // 추가: Firebase 고유 키 획득

  await newRef.set({
    nickname: tempNickname,
    cumulativeScore: 0,
    createdAt: Date.now()
  });

  currentNickname = tempNickname;
  document.getElementById("nickname").textContent = currentNickname;
  localStorage.setItem("myNickname", currentNickname);
  localStorage.setItem("userKey", userKey); // 추가: Firebase 키 저장
}

/**
 * "닉네임 변경" 버튼 클릭 이벤트 설정
 *  1) prompt로 새 닉네임 입력
 *  2) 중복 확인
 *  3) 통과 시 기존 닉네임 별도 처리 없이 Firebase·localStorage에 새로 저장
 */
function setupNicknameChangeEvent() {
  const changeBtn = document.getElementById('nickname-change-btn');
  
  // 기존 이벤트 리스너 제거 후 새로 등록
  changeBtn.removeEventListener('click', handleNicknameChange);
  changeBtn.addEventListener('click', handleNicknameChange);
}

// 별도의 핸들러 함수로 분리
async function handleNicknameChange() {
  const newName = prompt("새 닉네임을 입력하세요:", currentNickname);
  if (!newName || newName.trim() === "") return;

  const userKey = localStorage.getItem("userKey");
  if (!userKey) {
    alert("사용자 정보를 찾을 수 없습니다.");
    return;
  }

  const userRef = firebase.database().ref(`nicknames/${userKey}`);
  await userRef.update({ nickname: newName });

  currentNickname = newName;
  document.getElementById('nickname').textContent = currentNickname;
  localStorage.setItem("myNickname", currentNickname);
  alert("닉네임이 변경되었습니다!");
  await displayCurrentUserScore(); // 누적 점수 새로고침
}

// DOMContentLoaded 이후에 닉네임 초기화, 버튼 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  initializeNickname();
  setupNicknameChangeEvent();
});

/**
 * 누적점수를 업데이트하는 함수
 * @param {string} nickname - 사용자 닉네임
 * @param {number} additionalScore - 이번 게임에서 획득한 점수
 * @returns {Promise<number>} 업데이트 후의 새로운 누적점수
 */
async function updateCumulativeScore(additionalScore) {
  const userKey = localStorage.getItem("userKey");
  if (!userKey) return 0;

  const userRef = firebase.database().ref(`nicknames/${userKey}`);
  
  try {
    // 누적 점수 업데이트
    const newScore = await new Promise((resolve, reject) => {
      userRef.child('cumulativeScore').transaction((currentScore) => {
        const current = Number(currentScore) || 0;
        const additional = Number(additionalScore) || 0;
        return current + additional;
      }, (error, committed, snapshot) => {
        if (error) {
          console.error('누적 점수 업데이트 실패:', error);
          reject(error);
        } else if (committed) {
          resolve(Number(snapshot.val()) || 0);
        }
      });
    });

    // 점수 표시 업데이트
    showCumulativeScore(newScore);
    
    // 1000점 이상 달성 시 업적 호출
    if (newScore >= 1000) {
      console.log("1000점 달성 - 업적 호출");
      window.webkit.messageHandlers.unlock1000PointsAchievement.postMessage({});
    }
    
    // 랭킹 위치 업데이트
    const newRankingPosition = await getUserRankingPosition(newScore);
    showRankingPosition(newRankingPosition);

    return newScore;
  } catch (error) {
    console.error('점수 업데이트 중 오류 발생:', error);
    return 0;
  }
}

/**
 * 사용자의 랭킹 위치를 가져오는 함수 최적화
 */
async function getUserRankingPosition(userScore) {
  try {
    const playersRef = firebase.database().ref('nicknames');
    const snapshot = await playersRef.orderByChild('cumulativeScore').once('value');
    
    const players = [];
    snapshot.forEach((childSnapshot) => {
      const playerData = childSnapshot.val();
      if (playerData && playerData.cumulativeScore !== undefined) {
        players.push({
          cumulativeScore: Number(playerData.cumulativeScore) || 0
        });
      }
    });

    // 내림차순 정렬
    players.sort((a, b) => b.cumulativeScore - a.cumulativeScore);
    
    // 동일 점수 처리를 포함한 랭킹 계산
    const rankingPosition = players.findIndex(player => 
      player.cumulativeScore <= userScore) + 1;
    
    return rankingPosition || players.length + 1;
  } catch (error) {
    console.error('랭킹 위치 조회 실패:', error);
    return '-';
  }
}

/**
 * 페이지 로드시 현재 사용자의 누적 점수와 랭킹 표시
 */
async function displayCurrentUserScore() {
  const userKey = localStorage.getItem("userKey");
  if (!userKey) return;

  try {
    const userRef = firebase.database().ref(`nicknames/${userKey}`);
    const snapshot = await userRef.once('value');

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const cumulativeScore = Number(userData.cumulativeScore) || 0;
      
      // 점수와 랭킹 동시에 업데이트
      showCumulativeScore(cumulativeScore);
      const rankingPosition = await getUserRankingPosition(cumulativeScore);
      showRankingPosition(rankingPosition);
    }
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error);
  }
}

/**
 * 누적 점수를 화면에 표시
 */
function showCumulativeScore(newScore) {
  const scoreEl = document.getElementById('cumulative-score');
  if (scoreEl) {
    const formattedScore = Number(newScore).toLocaleString();
    animateNumber(scoreEl, 0, newScore, 200);
    scoreEl.textContent = formattedScore; // 'pts' 제거
  }
}

/**
 * 페이지 로드시 현재 사용자의 누적 점수 표시
 */
async function displayCurrentUserScore() {
  const userKey = localStorage.getItem("userKey");
  if (!userKey) return;

  const userRef = firebase.database().ref(`nicknames/${userKey}`);
  const snapshot = await userRef.once('value');

  if (snapshot.exists()) {
    const userData = snapshot.val();
    // 숫자 강제 변환 추가
    const cumulativeScore = Number(userData.cumulativeScore) || 0;
    showCumulativeScore(cumulativeScore);

    // 랭킹 정보 표시
    const rankingPosition = await getUserRankingPosition(cumulativeScore);
    showRankingPosition(rankingPosition);
  }
}

// 사용자의 랭킹 위치를 가져오는 함수
async function getUserRankingPosition(userScore) {
  const playersRef = firebase.database().ref('nicknames');
  const snapshot = await playersRef.once('value');
  const players = [];

  snapshot.forEach((childSnapshot) => {
    const playerData = childSnapshot.val();
    if (playerData && playerData.cumulativeScore !== undefined) {
      players.push({
        nickname: playerData.nickname,
        cumulativeScore: Number(playerData.cumulativeScore) || 0
      });
    }
  });

  // 누적 점수 기준으로 정렬
  const sortedPlayers = players.sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  // 사용자의 순위 찾기
  const userIndex = sortedPlayers.findIndex(player => player.cumulativeScore === userScore);
  return userIndex !== -1 ? userIndex + 1 : '-';
}

// 랭킹 위치를 화면에 표시
function showRankingPosition(position) {
  const rankingPositionEl = document.getElementById('ranking-position');
  if (rankingPositionEl) {
    rankingPositionEl.textContent = position;
  }
}

// DOMContentLoaded 이벤트 핸들러 수정
document.addEventListener("DOMContentLoaded", async () => {
  await initializeNickname();
  setupNicknameChangeEvent();
  displayCurrentUserScore(); // 누적 점수 표시 추가
});

// onGameOver 함수에서 사용 예시:
function onGameOver(finalScore) {
  updateCumulativeScore(finalScore)
    .then(newScore => {
      console.log("새로운 누적점수:", newScore);
      showCumulativeScore(newScore);
    });
}

// scrim영역 클릭 시 모달 닫기
function onScrimClick(e) {
  if (e.target.classList.contains('modal-scrim')) {
    e.target.style.display = 'none';
    
    // 추가: 모달 내부 컨테이너 클릭 시 닫기 방지
    const modalContainer = e.target.querySelector('.modal-container');
    if (modalContainer && modalContainer.contains(e.target)) {
      return;
    }
  }
}

// 특정 모달 닫기
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// 모달 열기 버튼 클릭 시
document.querySelectorAll('.open-modal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    if (modalId === 'rankingModal') {
      document.getElementById(modalId).style.display = 'block';
      // 모달이 표시된 후에 Players 탭 활성화
      setTimeout(() => {
        setMainTab('players');
      }, 0);
    } else {
      document.getElementById(modalId).style.display = 'block';
    }
  });
});

// Players 탭 활성화 함수
function setMainTab(tabName) {
  // 1. 모든 탭 버튼 가져오기
  const tabs = document.querySelectorAll('.tab-link');
  
  // 2. 테이블 요소 가져오기
  const rankingTable = document.getElementById('rankingTable');
  const scoreTable = document.getElementById('scoreTable');
  
  // 3. 모든 탭에서 active 클래스 제거
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  if (tabName === 'players') {
    // 4. Players 탭 활성화
    document.querySelector('.tab-link[data-period="players"]').classList.add('active');
    
    // 5. 테이블 표시/숨김
    rankingTable.style.display = 'table';
    scoreTable.style.display = 'none';
    
    // 6. Players 데이터 로드
    fetchPlayersData((players) => {
      if (rankingTable.style.display === 'table') {
        renderPlayersRanking(players);
      }
    });
  } else if (tabName === 'round') {
    // 7. Round 탭 활성화
    document.querySelector('.tab-link[data-period="round"]').classList.add('active');
    
    // 8. 테이블 표시/숨김
    rankingTable.style.display = 'none';
    scoreTable.style.display = 'table';
    
    // 9. Round 데이터 로드
    fetchScoresData((scores) => {
      if (scoreTable.style.display === 'table') {
        renderRoundRanking(scores);
      }
    });
  }
}

// 탭 클릭 이벤트 리스너 수정
document.addEventListener('DOMContentLoaded', function() {
  // 탭 클릭 이벤트 설정
  const tabs = document.querySelectorAll('.tab-link');
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault(); // 기본 동작 방지
      const period = this.getAttribute('data-period');
      
      // 모든 탭에서 active 제거
      tabs.forEach(t => t.classList.remove('active'));
      
      // 클릭한 탭에 active 추가
      this.classList.add('active');
      
      // 탭 전환 실행
      setMainTab(period);
    });
  });
});

// 모달 열기 버튼 클릭 이벤트는 그대로 유지
document.querySelectorAll('.open-modal-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    if (modalId === 'rankingModal') {
      document.getElementById(modalId).style.display = 'block';
      setTimeout(() => {
        setMainTab('players');
      }, 0);
    } else {
      document.getElementById(modalId).style.display = 'block';
    }
  });
});

// Firebase에서 데이터를 가져오는 함수 수정
function fetchScoresFromFirebase(callback) {
  const scoresRef = db.ref('scores');
  scoresRef.on('value', (snapshot) => {
    const scores = [];
    snapshot.forEach((childSnapshot) => {
      const scoreData = childSnapshot.val();
      scores.push({
        nickname: scoreData.nickname || 'Guest',
        score: scoreData.score || 0,
        target: scoreData.target || 0,
        timestamp: scoreData.timestamp || Date.now()
      });
    });
    callback(scores);
  }, (error) => {
    console.error('Firebase 데이터 가져오기 실패:', error);
  });
}

// 필터링 로직 수정
function applyFilters() {
  const dateFilter = document.querySelector('.tab-link.active')?.dataset.period || 'all';
  const goalFilter = document.querySelector('.chips-container .chip.active')?.dataset.goal || 'all';

  const filteredData = scores.filter(item => {
    // 날짜 필터링
    const itemDate = new Date(item.timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dateMatch = true;
    if (dateFilter === 'today') {
      dateMatch = itemDate >= today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      dateMatch = itemDate >= weekAgo;
    }

    // 목표합 필터링
    const goalMatch = goalFilter === 'all' || item.target === parseInt(goalFilter, 10);

    return dateMatch && goalMatch;
  });

  console.log('필터링된 데이터:', filteredData);
  renderRanking(filteredData);
}

// 모달 닫기 버튼 이벤트 연결 추가
document.querySelectorAll('.close-modal-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modalId = e.target.closest('.modal-scrim').id;
    closeModal(modalId);
  });
});

// Scrim 클릭 이벤트 핸들러 연결
document.querySelectorAll('.modal-scrim').forEach(scrim => {
  scrim.addEventListener('click', onScrimClick);
});




// script.js 파일 상단에 추가
function initApp() {
  console.log('App initialized');
  
  // 버튼 이벤트 리스너 설정
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn) {
    startGameBtn.addEventListener('click', onStartGame);
  }

  // 기타 초기화 코드...
}

// 튜토리얼 프로그레스 버튼 클릭 시 해당 섹션으로 이동
document.addEventListener('DOMContentLoaded', () => {
  // 튜토리얼 컨텐츠가 id "tutorial" 내부에 있다고 가정
  const dots = document.querySelectorAll('.tutorial-progress-dot');
  const infoSections = document.querySelectorAll('#tutorial-steps .tutorial-card');


  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (infoSections[index]) {
        infoSections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.error('인덱스에 해당하는 infoSection을 찾을 수 없습니다:', index);
      }
    });
  });
});

// 칩 클릭 핸들러 추가
function handleGoalFilter(clickedElement, goalValue) {
  // 모든 칩에서 active 클래스 제거
  document.querySelectorAll('.chips-container .chip').forEach(chip => {
    chip.classList.remove('active');
  });
  
  // 클릭한 칩에 active 클래스 추가
  clickedElement.classList.add('active');
  
  // 필터 적용
  applyFilters();
}

// 탭 클릭 이벤트 리스너 (단일화)
document.querySelectorAll('.tab-link').forEach(tab => {
  tab.addEventListener('click', () => {
    const period = tab.dataset.period;
    setDateFilter(period);
  });
});

document.getElementById('nickname-change-btn').addEventListener('click', function() {
    window.webkit.messageHandlers.openModal.postMessage('changeNicknameModal');
});

document.addEventListener('DOMContentLoaded', function() {
  // DOM이 완전히 로드된 후에 실행될 코드
  if (document.getElementById('scoreTableBody')) {
    renderRanking([]); // 빈 배열 전달
  } else {
    console.error('Score table body not found');
  }
});

// Players 탭: 전체 유저 누적 점수 순위
function renderPlayersRanking(playersData) {
  const tbody = document.querySelector("#rankingTableBody");
  if (!tbody) {
    console.error("Ranking table body not found");
    return;
  }
  
  tbody.innerHTML = "";

  if (!playersData || !Array.isArray(playersData) || playersData.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.classList.add("empty-message");
    emptyRow.innerHTML = `<td colspan="3">표시할 데이터가 없습니다</td>`;
    tbody.appendChild(emptyRow);
    return;
  }

  // 누적 점수 기준으로 정렬
  const sortedData = playersData
    .filter(player => player && player.nickname && player.cumulativeScore !== undefined)
    .sort((a, b) => b.cumulativeScore - a.cumulativeScore);
  const limitedData = sortedData.slice(0, 30); // 5에서 30으로 변경

  limitedData.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nickname}</td>
      <td>${item.cumulativeScore}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Round 탭 렌더링 함수 수정
function renderRoundRanking(scoresData) {
  const tbody = document.querySelector("#scoreTableBody");
  const thead = document.querySelector("#scoreTable thead tr");
  if (!tbody || !thead) {
    console.error("Score table elements not found");
    return;
  }
  
  // 헤더 업데이트
  thead.innerHTML = `
    <th>순위</th>
    <th>닉네임</th>
    <th>
      <span class="header-text">점수</span>
      <span class="target-badge">목표합</span>
    </th>
  `;
  
  tbody.innerHTML = "";

  if (!scoresData || !Array.isArray(scoresData) || scoresData.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.classList.add("empty-message");
    emptyRow.innerHTML = `<td colspan="3">표시할 데이터가 없습니다</td>`;
    tbody.appendChild(emptyRow);
    return;
  }

  // 점수 기준으로 정렬
  const sortedData = scoresData
    .filter(score => score && score.nickname && score.score !== undefined && score.target !== undefined)
    .sort((a, b) => b.score - a.score);
  const limitedData = sortedData.slice(0, 30);

  limitedData.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nickname}</td>
      <td>
        <span class="score-value">${item.score}</span>
        <span class="target-badge">${item.target}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Firebase에서 데이터 가져오기
function fetchPlayersData(callback) {
  const playersRef = firebase.database().ref('nicknames');
  playersRef.once('value')  // 'on' 대신 'once' 사용
    .then((snapshot) => {
      const players = [];
      snapshot.forEach((childSnapshot) => {
        const playerData = childSnapshot.val();
        if (playerData && playerData.nickname && playerData.cumulativeScore !== undefined) {
          players.push({
            nickname: playerData.nickname,
            cumulativeScore: playerData.cumulativeScore
          });
        }
      });
      callback(players);
    })
    .catch((error) => {
      console.error('Firebase 플레이어 데이터 가져오기 실패:', error);
      callback([]);  // 에러 시 빈 배열 전달
    });
}

function fetchScoresData(callback) {
  const scoresRef = firebase.database().ref('scores');
  scoresRef.once('value')  // 'on' 대신 'once' 사용
    .then((snapshot) => {
      const scores = [];
      snapshot.forEach((childSnapshot) => {
        const scoreData = childSnapshot.val();
        if (scoreData && scoreData.nickname && scoreData.score !== undefined) {
          scores.push({
            nickname: scoreData.nickname,
            score: scoreData.score,
            target: scoreData.target || 0
          });
        }
      });
      callback(scores);
    })
    .catch((error) => {
      console.error('Firebase 스코어 데이터 가져오기 실패:', error);
      callback([]);  // 에러 시 빈 배열 전달
    });
}

function displayScores(scoresData) {
  const scoreTableBody = document.getElementById('scoreTable').getElementsByTagName('tbody')[0];
  const rankingTableBody = document.getElementById('rankingTable').getElementsByTagName('tbody')[0];
  
  // 현재 사용자의 닉네임과 누적 점수
  const currentUserNickname = localStorage.getItem('myNickname');
  const currentUserCumulativeScore = parseInt(localStorage.getItem('cumulativeScore') || '0');

  // Players 탭 데이터 처리
  const sortedPlayers = playersData
    .filter(player => player && player.nickname && player.cumulativeScore !== undefined)
    .sort((a, b) => b.cumulativeScore - a.cumulativeScore);
  
  // 현재 사용자의 순위 찾기
  const userRankingIndex = sortedPlayers.findIndex(player => player.nickname === currentUserNickname);
  const userRanking = userRankingIndex + 1;
  
  // 표시할 데이터 준비 (상위 10개)
  let displayPlayers = sortedPlayers.slice(0, 30);
  
  // 사용자가 10위 밖이면 마지막 항목을 사용자 데이터로 교체
  if (userRanking > 10) {
    displayPlayers[9] = {
      nickname: currentUserNickname,
      cumulativeScore: currentUserCumulativeScore,
      ranking: userRanking
    };
  }

  // Players 탭 랭킹 표시
  rankingTableBody.innerHTML = displayPlayers.map((player, index) => {
    const isCurrentUser = player.nickname === currentUserNickname;
    const rankingNumber = player.ranking || index + 1;
    return `
      <tr class="${isCurrentUser ? 'current-user-row' : ''}">
        <td>${rankingNumber}</td>
        <td>${player.nickname} ${isCurrentUser ? '<span class="player-chip">ME</span>' : ''}</td>
        <td>${player.cumulativeScore}</td>
      </tr>
    `;
  }).join('');

  // Rounds 탭 데이터 처리
  const sortedScores = scoresData
    .filter(score => score && score.nickname && score.score !== undefined && score.target !== undefined)
    .sort((a, b) => b.score - a.score);
  
  // 현재 사용자의 최고 점수 찾기
  const userBestScore = sortedScores.find(score => score.nickname === currentUserNickname);
  const userScoreRankingIndex = sortedScores.findIndex(score => score.nickname === currentUserNickname);
  const userScoreRanking = userScoreRankingIndex + 1;
  
  // 표시할 데이터 준비 (상위 10개)
  let displayScores = sortedScores.slice(0, 30);
  
  // 사용자가 10위 밖이면 마지막 항목을 사용자 데이터로 교체
  if (userScoreRanking > 10 && userBestScore) {
    displayScores[9] = {
      ...userBestScore,
      ranking: userScoreRanking
    };
  }

  // Rounds 탭 랭킹 표시
  scoreTableBody.innerHTML = displayScores.map((score, index) => {
    const isCurrentUser = score.nickname === currentUserNickname;
    const rankingNumber = score.ranking || index + 1;
    return `
      <tr class="${isCurrentUser ? 'current-user-row' : ''}">
        <td>${rankingNumber}</td>
        <td>${score.nickname} ${isCurrentUser ? '<span class="player-chip">ME</span>' : ''}</td>
        <td>${score.score}</td>
        <td>${score.target}</td>
      </tr>
    `;
  }).join('');
}

// 닉네임 관련 함수들 수정
async function initNickname() {
  const userKey = localStorage.getItem("userKey");
  
  // iOS 환경인지 확인
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS) {
    // iOS에서는 게임센터 닉네임을 먼저 확인
    try {
      window.webkit.messageHandlers.getGameCenterNickname.postMessage("");
    } catch (error) {
      console.log("게임센터 닉네임 가져오기 실패:", error);
      await loadNicknameFromFirebase(userKey);
    }
  } else {
    // 웹 환경에서는 기존 방식대로 처리
    await loadNicknameFromFirebase(userKey);
  }
}

// 게임센터에서 닉네임을 받아서 처리하는 함수
window.updateNicknameFromGameCenter = async function(gameCenterNickname) {
  if (gameCenterNickname) {
    // 게임센터 닉네임이 있는 경우
    const userKey = localStorage.getItem("userKey");
    if (userKey) {
      const userRef = firebase.database().ref(`nicknames/${userKey}`);
      await userRef.update({
        nickname: gameCenterNickname
      });
      
      // UI 업데이트
      document.getElementById("nickname").textContent = gameCenterNickname;
      
      // 누적 점수와 랭킹 정보 갱신
      const snapshot = await userRef.once('value');
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // 누적 점수 표시 업데이트
        const cumulativeScoreEl = document.getElementById('cumulative-score');
        if (cumulativeScoreEl) {
          cumulativeScoreEl.textContent = userData.cumulativeScore || 0;
        }
        
        // 랭킹 정보 업데이트
        const rankingPosition = await getUserRankingPosition(userData.cumulativeScore || 0);
        const rankingPositionEl = document.getElementById('ranking-position');
        if (rankingPositionEl) {
          rankingPositionEl.textContent = rankingPosition;
        }
      }
    }
    
    // 닉네임 변경 버튼 비활성화 (게임센터 사용자는 변경 불가)
    const nicknameChangeBtn = document.getElementById("nickname-change-btn");
    if (nicknameChangeBtn) {
      nicknameChangeBtn.style.display = "none";
    }
  } else {
    // 게임센터 닉네임이 없는 경우 닉네임 변경 모달 표시
    window.webkit.messageHandlers.openModal.postMessage('changeNicknameModal');
  }
}

async function loadNicknameFromFirebase(userKey) {
  if (!userKey) return;
  
  const userRef = firebase.database().ref(`nicknames/${userKey}`);
  const snapshot = await userRef.once('value');
  
  if (snapshot.exists()) {
    const userData = snapshot.val();
    document.getElementById("nickname").textContent = userData.nickname;
  }
}

// 닉네임 변경 모달 이벤트 수정
document.getElementById('nickname-change-btn').addEventListener('click', function() {
  // iOS 환경인지 확인
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && window.webkit && window.webkit.messageHandlers.getGameCenterNickname) {
    // 게임센터 닉네임 확인
    window.webkit.messageHandlers.getGameCenterNickname.postMessage("");
  } else {
    // 웹 환경에서는 기존대로 닉네임 변경 모달 표시
    window.webkit.messageHandlers.openModal.postMessage('changeNicknameModal');
  }
});

function checkTargetSum(sum) {
    if (sum >= 10) {
        console.log("10점 달성 - 업적 호출");
        window.webkit.messageHandlers.unlock10PointsAchievement.postMessage({});
    }
}

// 사용자의 최고 점수를 가져오는 함수
async function getUserBestScore(targetSum) {
  const userKey = localStorage.getItem("userKey");
  if (!userKey) return 0;

  try {
    const scoresRef = firebase.database().ref('scores');
    const snapshot = await scoresRef
      .orderByChild('userKey')
      .equalTo(userKey)
      .once('value');
    
    let bestScore = 0;
    snapshot.forEach((childSnapshot) => {
      const scoreData = childSnapshot.val();
      // 동일한 목표합에서의 점수만 비교
      if (scoreData.target === targetSum && scoreData.score > bestScore) {
        bestScore = scoreData.score;
      }
    });
    
    return bestScore;
  } catch (error) {
    console.error('최고 점수 조회 실패:', error);
    return 0;
  }
}

// 게임센터 메뉴 클릭 핸들러
function handleGameCenterClick() {
  // iOS 환경인지 확인
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS && window.webkit && window.webkit.messageHandlers.showGameCenter) {
    // iOS 게임센터 모달 표시
    window.webkit.messageHandlers.showGameCenter.postMessage("");
  } else {
    // 웹 환경에서는 기본 랭킹 모달 표시
    document.getElementById('rankingModal').style.display = 'block';
  }
}

// DOMContentLoaded 이벤트에 게임센터 메뉴 초기화 추가
document.addEventListener("DOMContentLoaded", function() {
  // ... 기존 초기화 코드 ...

  // 게임센터 메뉴 추가
  const gameCenterMenu = document.createElement('div');
  gameCenterMenu.className = 'menu-item';
  gameCenterMenu.setAttribute('data-i18n', 'gameCenter');
  gameCenterMenu.textContent = translations[currentLanguage].gameCenter;
  gameCenterMenu.addEventListener('click', handleGameCenterClick);

  // GNB에 게임센터 메뉴 추가
  const gnbMenus = document.querySelector('.gnb-menus');
  if (gnbMenus) {
    gnbMenus.insertBefore(gameCenterMenu, gnbMenus.firstChild);
  }

  // 언어 변경 시 게임센터 메뉴 텍스트도 업데이트되도록 수정
  const originalApplyTranslations = applyTranslations;
  applyTranslations = function() {
    originalApplyTranslations();
    if (gameCenterMenu) {
      gameCenterMenu.textContent = translations[currentLanguage].gameCenter;
    }
  };

  // 게임센터 메뉴 아이콘 추가 (헤더 우상단)
  const iconMenus = document.querySelectorAll('.icon-menu, .right-group');
  iconMenus.forEach(menu => {
    const gameCenterBtn = document.createElement('button');
    gameCenterBtn.className = 'open-modal-btn';
    gameCenterBtn.innerHTML = '<i class="fi fi-rr-trophy"></i>';
    gameCenterBtn.addEventListener('click', handleGameCenterClick);
    
    // 첫 번째 버튼 앞에 삽입
    menu.insertBefore(gameCenterBtn, menu.firstChild);
  });
});

// iOS 게임센터 관련 콜백 함수들
window.onGameCenterAuthSuccess = function() {
  console.log("Game Center 인증 성공");
};

window.onGameCenterAuthFail = function(error) {
  console.log("Game Center 인증 실패:", error);
  // 인증 실패 시 웹 랭킹으로 폴백
  document.getElementById('rankingModal').style.display = 'block';
};

// 게임 시작 시
function startGame() {
    // ... 기존 코드 ...
    
    // 첫 게임 시작 체크
    const isFirstStart = !localStorage.getItem('hasStartedGame');
    if (isFirstStart) {
        localStorage.setItem('hasStartedGame', 'true');
        window.webkit.messageHandlers.gameCenterManager.postMessage({
            action: 'checkAchievements',
            score: 0,
            isFirstSuccess: false,
            isFirstStart: true
        });
    }
}

// 목표합 성공 시
function handleSuccess() {
    // ... 기존 코드 ...
    
    // 첫 성공 체크
    const isFirstSuccess = !localStorage.getItem('hasFirstSuccess');
    if (isFirstSuccess) {
        localStorage.setItem('hasFirstSuccess', 'true');
    }
    
    // 현재 누적 점수 체크
    const currentScore = getCurrentScore(); // 현재 누적 점수를 가져오는 함수
    
    // GameCenter 업적 체크
    window.webkit.messageHandlers.gameCenterManager.postMessage({
        action: 'checkAchievements',
        score: currentScore,
        isFirstSuccess: isFirstSuccess,
        isFirstStart: false
    });
}

// 게임센터 인증 성공 콜백 함수 수정
window.onGameCenterAuthSuccess = async function() {
  console.log("Game Center 인증 성공");
  
  // 게임센터 닉네임 가져오기
  if (window.webkit && window.webkit.messageHandlers.getGameCenterNickname) {
    window.webkit.messageHandlers.getGameCenterNickname.postMessage("");
  }
};

// 게임센터 닉네임 업데이트 콜백 함수 수정
window.updateNicknameFromGameCenter = async function(gameCenterNickname) {
  if (gameCenterNickname) {
    const userKey = localStorage.getItem("userKey");
    if (!userKey) return;

    try {
      // Firebase에 닉네임 업데이트
      const userRef = firebase.database().ref(`nicknames/${userKey}`);
      await userRef.update({
        nickname: gameCenterNickname
      });
      
      // UI 업데이트
      const nicknameEl = document.getElementById("nickname");
      if (nicknameEl) {
        nicknameEl.textContent = gameCenterNickname;
      }
      
      // 누적 점수와 랭킹 정보 가져오기
      const snapshot = await userRef.once('value');
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // 누적 점수 표시 업데이트
        const cumulativeScoreEl = document.getElementById('cumulative-score');
        if (cumulativeScoreEl) {
          const score = userData.cumulativeScore || 0;
          cumulativeScoreEl.textContent = score;
        }
        
        // 랭킹 정보 업데이트
        const rankingPosition = await getUserRankingPosition(userData.cumulativeScore || 0);
        const rankingPositionEl = document.getElementById('ranking-position');
        if (rankingPositionEl) {
          rankingPositionEl.textContent = rankingPosition;
        }
      }
      
      // 닉네임 변경 버튼 숨기기 (게임센터 사용자는 변경 불가)
      const nicknameChangeBtn = document.getElementById("nickname-change-btn");
      if (nicknameChangeBtn) {
        nicknameChangeBtn.style.display = "none";
      }
    } catch (error) {
      console.error("게임센터 닉네임 업데이트 실패:", error);
    }
  }
};

// DOMContentLoaded 이벤트 핸들러 수정
document.addEventListener("DOMContentLoaded", async function() {
  // ... 기존 초기화 코드 ...

  // iOS 환경에서 게임센터 인증 확인
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && window.webkit && window.webkit.messageHandlers.getGameCenterNickname) {
    window.webkit.messageHandlers.getGameCenterNickname.postMessage("");
  } else {
    // 웹 환경에서는 기존 방식으로 닉네임 초기화
    await initNickname();
  }
  
  // 누적 점수와 랭킹 표시 초기화
  await displayCurrentUserScore();
});

// 사용자의 랭킹 위치를 가져오는 함수 수정
async function getUserRankingPosition(userScore) {
  if (!userScore) return '-';
  
  try {
    const snapshot = await firebase.database()
      .ref('nicknames')
      .orderByChild('cumulativeScore')
      .once('value');
    
    const scores = [];
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      if (userData.cumulativeScore) {
        scores.push(userData.cumulativeScore);
      }
    });
    
    // 점수 내림차순 정렬
    scores.sort((a, b) => b - a);
    
    // 사용자 점수의 위치 찾기
    const position = scores.findIndex(score => score <= userScore) + 1;
    return position || scores.length + 1;
  } catch (error) {
    console.error('랭킹 위치 조회 실패:', error);
    return '-';
  }
}
