



/******************************************************
 * 다국어 (i18n)
 ******************************************************/
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

/******************************************************
 * 언어 선택
 ******************************************************/
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

/******************************************************
 * 게임 시작
 ******************************************************/
function startGame() {
  gameStarted = true;
  difficultyLevel = 'normal';
  init();
}

/******************************************************
 * 엔터키로 게임 시작
 ******************************************************/
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && gameGuide.style.display !== 'none') {
    startButton.click();
  }
});

/******************************************************
 * start-button 클릭 시 : 본격 실행 + 볼륨 컨트롤 초기화
 ******************************************************/
startButton.addEventListener('click', function() {
  initVolumeControl();
  gameGuide.style.display = 'none';
  startGame();
});

/******************************************************
 * 볼륨 컨트롤 초기화
 ******************************************************/
function initVolumeControl() {
  const volumeToggle = document.getElementById('volume-toggle');
  let isMuted = localStorage.getItem('isMuted') === 'true';
  
  // 초기 상태 설정
  mergeSound.muted = isMuted;
  updateVolumeIcon(isMuted);

  volumeToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    mergeSound.muted = isMuted;
    updateVolumeIcon(isMuted);
    localStorage.setItem('isMuted', isMuted);
  });
}

function updateVolumeIcon(isMuted) {
  const volumeToggle = document.getElementById('volume-toggle');
  volumeToggle.textContent = isMuted ? '🔇' : '🔈';
}

document.addEventListener('DOMContentLoaded', function() {
    createStars(10); // 원하는 별의 개수

    function createStars(count) {
        const container = document.querySelector('.star-container');
        if (!container) return; // Ensure the container exists
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            container.appendChild(star);
        }
    }
});