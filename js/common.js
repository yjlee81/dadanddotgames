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
const langSelect = document.getElementById('language-select');
if (langSelect) {
  langSelect.addEventListener('change', (e) => {
    const newLang = e.target.value;
    console.log('Language changed to:', newLang);
    // TODO: 실제 다국어 처리 로직
  });
}
