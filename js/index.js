// [js/index.js]

/******************************************************
 * 메인 페이지 전용 스크립트 (다국어, 초기 세팅 등)
 ******************************************************/

// 다국어 번역 데이터
const translations = {
  en: {
    games: "Games",
    about: "About",
    share: "Share",
    welcome: "Welcome to Dad and Dot Games",
    description: "Meet concentration and brain development games in a cute universe! Shall we go hand in hand with Dad?",
    freeGames: "View Free Games ↓",
    pickGame: "Pick Your Game",
    masterMonster: "Master Monster",
    masterMonsterDesc: "Merge monsters to create the ultimate master!",
    puzzle: "Puzzle",
    strategy: "Strategy",
    casual: "Casual",
    playTime: "Play Time: 5-10min",
    difficulty: "Difficulty: ★★☆☆☆",
    starShower: "Star Shower",
    starShowerDesc: "Collect sparkling stars in the universe!",
    rhythm: "Rhythm",
    timing: "Timing",
    exercise: "Exercise",
    playTimeShort: "Play Time: 3-5min",
    difficultyMedium: "Difficulty: ★★★☆☆",
    aboutTitle: "About Dad and Dot Games",
    aboutDescription: "Hello! We are a team that creates games that Dad and kids can enjoy together. We want to provide fun and learning for children, and peace of mind and empathy for parents. Let's grow children's brains and minds with cosmic imagination! Long ago, a 'Dad' wandering in a corner of the universe met a little girl living on a small star. Then they started exploring the universe hand in hand and creating new and ingenious games!"
  },
  ko: {
    games: "게임",
    about: "소개",
    share: "공유하기",
    welcome: "Dad and Dot Games에 오신 것을 환영합니다",
    description: "귀여운 우주 속에서 만나는 집중력·두뇌발달 게임! 아빠와 함께 손잡고 떠나 볼까요?",
    freeGames: "무료 게임보기 ↓",
    pickGame: "게임을 선택하세요",
    masterMonster: "마스터 몬스터",
    masterMonsterDesc: "몬스터를 합쳐 궁극의 마스터를 만드세요!",
    puzzle: "퍼즐",
    strategy: "전략",
    casual: "캐주얼",
    playTime: "플레이 시간: 5-10분",
    difficulty: "난이도: ★★☆☆☆",
    starShower: "별샤워",
    starShowerDesc: "우주 속 반짝이는 별들을 모아보세요!",
    rhythm: "리듬",
    timing: "타이밍",
    exercise: "운동",
    playTimeShort: "플레이 시간: 3-5분",
    difficultyMedium: "난이도: ★★★☆☆",
    aboutTitle: "Dad and Dot Games 소개",
    aboutDescription: "안녕하세요! 저희는 “아빠와 아이가 함께 즐길 수 있는 게임”을 만드는 팀입니다. 아이들에게는 재미와 학습을, 부모님께는 안심과 공감을 전해드리고 싶어요. 우주적 상상력으로 아이들의 뇌와 마음을 성장시키자! 먼 옛날, 우주의 한 구석에서 떠돌던 ‘아빠’가 작은 별에서 살던 여아이를 만났습니다. 그리곤 둘이 함께 손잡고 우주를 탐험하며 새롭고 기발한 게임들을 만들기 시작했죠!"
  },
  ja: {
    games: "ゲーム",
    about: "紹介",
    share: "共有する",
    welcome: "Dad and Dot Gamesへようこそ",
    description: "かわいい宇宙で出会う集中力・脳発達ゲーム！パパと一緒に手をつないで出かけてみませんか？",
    freeGames: "無料ゲームを見る ↓",
    pickGame: "ゲームを選んでください",
    masterMonster: "マスターモンスター",
    masterMonsterDesc: "モンスターを合体させて究極のマスターを作りましょう！",
    puzzle: "パズル",
    strategy: "戦略",
    casual: "カジュアル",
    playTime: "プレイ時間: 5-10分",
    difficulty: "難易度: ★★☆☆☆",
    starShower: "スターシャワー",
    starShowerDesc: "宇宙の中で輝く星を集めてみましょう！",
    rhythm: "リズム",
    timing: "タイミング",
    exercise: "運動",
    playTimeShort: "プレイ時間: 3-5分",
    difficultyMedium: "難易度: ★★★☆☆",
    aboutTitle: "Dad and Dot Gamesについて",
    aboutDescription: "こんにちは！私たちは「パパと子供が一緒に楽しめるゲーム」を作るチームです。子供たちには楽しさと学びを、親には安心と共感を提供したいです。宇宙的な想像力で子供たちの脳と心を成長させましょう！昔、宇宙の片隅をさまよっていた「パパ」が小さな星に住んでいた女の子に出会いました。そして二人は手をつないで宇宙を探検し、新しくて独創的なゲームを作り始めました！"
  },
  zh: {
    games: "游戏",
    about: "介绍",
    share: "分享",
    welcome: "欢迎来到 Dad and Dot Games",
    description: "在可爱的宇宙中遇见专注力和脑力发展的游戏！和爸爸一起手牵手出发吧？",
    freeGames: "查看免费游戏 ↓",
    pickGame: "选择您的游戏",
    masterMonster: "大师怪物",
    masterMonsterDesc: "合并怪物以创造终极大师！",
    puzzle: "拼图",
    strategy: "策略",
    casual: "休闲",
    playTime: "游戏时间: 5-10分钟",
    difficulty: "难度: ★★☆☆☆",
    starShower: "星星雨",
    starShowerDesc: "在宇宙中收集闪闪发光的星星！",
    rhythm: "节奏",
    timing: "时机",
    exercise: "运动",
    playTimeShort: "游戏时间: 3-5分钟",
    difficultyMedium: "难度: ★★★☆☆",
    aboutTitle: "关于 Dad and Dot Games",
    aboutDescription: "你好！我们是一个创造“爸爸和孩子可以一起享受的游戏”的团队。我们希望为孩子们提供乐趣和学习，为父母提供安心和共鸣。让我们用宇宙的想象力来发展孩子们的大脑和心灵！很久以前，在宇宙的一个角落，一个“爸爸”遇到了住在小星星上的小女孩。然后他们手牵手开始探索宇宙，创造新的和独特的游戏！"
  }
};

// 번역 함수
function updateTranslations(lang) {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    element.textContent = translations[lang][key] || element.textContent;
  });
}

// 언어 선택기 초기화
const languageSelect = document.getElementById("language-select");
languageSelect.addEventListener("change", (event) => {
  const selectedLang = event.target.value;
  updateTranslations(selectedLang);
  localStorage.setItem('preferred-language', selectedLang);
});

// 페이지 로드 시 언어 복원
window.addEventListener('load', () => {
  const savedLanguage = localStorage.getItem('preferred-language') || 'ko';
  languageSelect.value = savedLanguage;
  updateTranslations(savedLanguage);
});