/*************************************
 * 1) 별(이미지) 8개 랜덤 생성 + 패럴랙스
 *************************************/
const stars = [];
const starPositions = [];

(function createStars() {
  const starCount = 8;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const starImg = document.createElement('img');
    starImg.src = '/images/star.png'; // 별 이미지
    starImg.alt = '별';

    // 랜덤 크기 (20~40px)
    const randSize = Math.floor(Math.random() * 21) + 20;
    starImg.style.width = randSize + 'px';
    starImg.style.height = 'auto';

    // 별 위치 & 속도
    const randTop = Math.random() * 100;
    const randLeft = Math.random() * 100;
    const randSpeed = Math.random() * 0.3 + 0.05;

    star.style.top = randTop + '%';
    star.style.left = randLeft + '%';
    starPositions.push({ top: randTop, left: randLeft, speed: randSpeed });

    star.appendChild(starImg);
    document.body.appendChild(star);
    stars.push(star);
  }
})();

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  stars.forEach((star, idx) => {
    const { top, left, speed } = starPositions[idx];
    star.style.transform = `translate(${left}%, calc(${top}% - ${scrollY * speed}px))`;
  });
});

/*************************************
 * 2) dadanddot.png 패럴랙스
 *************************************/
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const floating = document.querySelector('.dad-dot-floating');
  if (floating) {
    floating.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.1}px))`;
  }
});

/*************************************
 * 3) Carousel 기능
 *************************************/
const track = document.getElementById('carouselTrack');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let currentIndex = 0;

function updateCarousel() {
  if (!track) return;
  const cardWidth = track.querySelector('.game-card').offsetWidth;
  // margin-right: 1rem => 16px
  track.style.transform = `translateX(-${currentIndex * (cardWidth + 16)}px)`;
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < track.children.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });
}

/***************************************************
 * 4) "무료 게임 시작" 버튼 -> Carousel 첫 슬라이드
 ***************************************************/
const btnFreeGameStart = document.getElementById('btnFreeGameStart');
if (btnFreeGameStart) {
  btnFreeGameStart.addEventListener('click', (e) => {
    e.preventDefault();
    currentIndex = 0;
    updateCarousel();

    const carouselSection = document.getElementById('carousel-section');
    if (carouselSection) {
      carouselSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/***************************************************
 * 5) 언어 선택 셀렉트
 ***************************************************/
const translations = {
    ko: {
        welcome: "Welcome to Dad and Dot Games",
        description: "귀여운 우주 속에서 만나는 집중력·두뇌발달 게임!<br>아빠와 함께 손잡고 떠나 볼까요?",
        startFreeGame: "무료 게임 시작",
        pickGame: "Pick Your Game",
        masterMonsterTitle: "마스터몬스터",
        masterMonsterDesc: "몬스터를 합쳐 최강의 마스터를 만들어보세요!",
        gameFeatures: {
            puzzle: "퍼즐",
            strategy: "전략",
            casual: "캐주얼"
        },
        playTime: "플레이 시간: 5-10분",
        difficulty: "난이도: ★★☆☆☆"
    },
    en: {
        welcome: "Welcome to Dad and Dot Games",
        description: "Discover concentration & brain development games in a cute space!<br>Let's go on an adventure with Dad!",
        startFreeGame: "Start Free Games",
        pickGame: "Pick Your Game",
        masterMonsterTitle: "Master Monster",
        masterMonsterDesc: "Merge monsters to create the ultimate master!",
        gameFeatures: {
            puzzle: "Puzzle",
            strategy: "Strategy",
            casual: "Casual"
        },
        playTime: "Play Time: 5-10min",
        difficulty: "Difficulty: ★★☆☆☆"
    },
    ja: {
        welcome: "Dad and Dot Gamesへようこそ",
        description: "かわいい宇宙で出会う集中力・脳開発ゲーム！<br>お父さんと一緒に冒険に出かけましょう！",
        startFreeGame: "無料ゲームを始める",
        pickGame: "ゲームを選ぶ",
        masterMonsterTitle: "マスターモンスター",
        masterMonsterDesc: "モンスターを合体させて最強のマスターを目指そう！",
        gameFeatures: {
            puzzle: "パズル",
            strategy: "戦略",
            casual: "カジュアル"
        },
        playTime: "プレイ時間：5-10分",
        difficulty: "難易度：★★☆☆☆"
    },
    zh: {
        welcome: "欢迎来到 Dad and Dot Games",
        description: "在可爱的太空中体验专注力和脑力开发游戏！<br>让我们和爸爸一起去冒险吧！",
        startFreeGame: "开始免费游戏",
        pickGame: "选择游戏",
        masterMonsterTitle: "怪兽大师",
        masterMonsterDesc: "合并怪兽，创造终极大师！",
        gameFeatures: {
            puzzle: "益智",
            strategy: "策略",
            casual: "休闲"
        },
        playTime: "游戏时长：5-10分钟",
        difficulty: "难度：★★☆☆☆"
    }
};

function updateTranslations(lang) {
    document.querySelector('.hero-content h1').textContent = translations[lang].welcome;
    document.querySelector('.hero-content p').innerHTML = translations[lang].description;
    document.querySelector('#btnFreeGameStart').textContent = translations[lang].startFreeGame;
    document.querySelector('.carousel-section h2').textContent = translations[lang].pickGame;
    
    // 게임 카드 번역
    document.querySelector('.game-card .game-title').textContent = translations[lang].masterMonsterTitle;
    document.querySelector('.game-card .game-description').textContent = translations[lang].masterMonsterDesc;
    
    // 게임 특징 번역
    const features = document.querySelectorAll('.game-features .feature');
    features[0].textContent = translations[lang].gameFeatures.puzzle;
    features[1].textContent = translations[lang].gameFeatures.strategy;
    features[2].textContent = translations[lang].gameFeatures.casual;
    
    // 게임 통계 번역
    const stats = document.querySelector('.game-stats');
    stats.innerHTML = `<span>${translations[lang].playTime}</span> / <span>${translations[lang].difficulty}</span>`;
}

const langSelect = document.getElementById('language-select');
if (langSelect) {
    langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        updateTranslations(newLang);
        localStorage.setItem('preferred-language', newLang);
    });
}

window.addEventListener('load', () => {
    const savedLanguage = localStorage.getItem('preferred-language') || 'ko';
    langSelect.value = savedLanguage;
    updateTranslations(savedLanguage);
});
