// 모듈 시스템 대응을 위해 IIFE(즉시 실행 함수 표현식)로 래핑
(function() {
  // 동적 라우팅 처리
  window.initRouter = function() {  // export 제거 후 전역 객체로 노출
    // popstate 이벤트 리스너 (뒤로가기/앞으로가기 처리)
    window.addEventListener('popstate', handleRoute);

    // DOM 로드 시 초기 라우팅 처리
    document.addEventListener('DOMContentLoaded', handleRoute);

    // 탭 클릭 이벤트 리스너
    document.querySelectorAll('.tab-link').forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault();
        const route = tab.dataset.link;
        navigateTo(route);
      });
    });

    document.body.addEventListener('click', e => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        navigateTo(e.target.href);
      }
    });
  };

  const navigateTo = url => {
    window.history.pushState(null, null, url);
    handleRoute();
  };

  const handleRoute = async () => {
    // 경로 정규화: /sd를 제거하지 않고 그대로 사용
    let path = window.location.pathname;
    path = path.endsWith('/SumOrDoneGame/') ? path.slice(0, -1) : path; // 마지막 슬래시 제거
    path = path || '/'; // 빈 경로는 홈으로 처리

    // 프리렌더링을 위한 서버측 렌더링 대응
    if (isCrawler()) {
      return; // 프리렌더 서비스가 처리
    }

    // 클라이언트 측 라우팅
    if (path.startsWith('/SumOrDoneGame/play/')) {
      const targetSum = parseInt(path.split('/').pop(), 10);
      if (targetSum >= 10 && targetSum <= 20) {
        startGameDirectly(targetSum);
      } else {
        window.location.href = '/SumOrDoneGame/';
      }
    } else if (path === '/SumOrDoneGame/ranking') {
      showRankingPage();
    } else if (path === '/SumOrDoneGame/tutorial') {
      showTutorialPage();
    } else {
      showHomePage();
    }

    // 탭 상태 업데이트
    updateTabState(path);
  };

  const isCrawler = () => 
    /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

  const showSection = (id) => {
    document.querySelectorAll('[data-route]').forEach(section => {
      section.style.display = section.id === id ? 'block' : 'none';
    });
  };

  // 직접 게임 시작
  function startGameDirectly(targetSum) {
    const roundSelect = document.getElementById('round-select');
    if (roundSelect) {
      roundSelect.value = targetSum;
      onStartGame();
    }
  }

  // 홈 페이지 표시
  function showHomePage() {
    const homePage = document.getElementById('title-screen');
    const gamePage = document.getElementById('game-container');
    const rankingPage = document.getElementById('ranking');
    const tutorialPage = document.getElementById('tutorial');
    const settingsPage = document.getElementById('settings');

    // 모든 페이지 숨기기
    if (homePage) homePage.style.display = 'block';
    if (gamePage) gamePage.style.display = 'none';
    if (rankingPage) rankingPage.style.display = 'none';
    if (tutorialPage) tutorialPage.style.display = 'none';
    if (settingsPage) settingsPage.style.display = 'none';
  }

  // 랭킹 페이지 표시
  function showRankingPage() {
    const homePage = document.getElementById('title-screen');
    const gamePage = document.getElementById('game-container');
    const rankingPage = document.getElementById('ranking');
    const tutorialPage = document.getElementById('tutorial');
    const settingsPage = document.getElementById('settings');

    // 모든 페이지 숨기기
    if (homePage) homePage.style.display = 'none';
    if (gamePage) gamePage.style.display = 'none';
    if (rankingPage) rankingPage.style.display = 'block';
    if (tutorialPage) tutorialPage.style.display = 'none';
    if (settingsPage) settingsPage.style.display = 'none';

    // Firebase에서 스코어 데이터를 불러와 표시
    fetchScoresFromFirebase(displayScores);
  }

  // How-to-play 페이지 표시
  function showTutorialPage() {
    const homePage = document.getElementById('title-screen');
    const gamePage = document.getElementById('game-container');
    const rankingPage = document.getElementById('ranking');
    const tutorialPage = document.getElementById('tutorial');
    const settingsPage = document.getElementById('settings');

    // 모든 페이지 숨기기
    if (homePage) homePage.style.display = 'none';
    if (gamePage) gamePage.style.display = 'none';
    if (rankingPage) rankingPage.style.display = 'none';
    if (tutorialPage) tutorialPage.style.display = 'block';
    if (settingsPage) settingsPage.style.display = 'none';
  }

  // 라우터 변경 시 탭 상태 업데이트
  function updateTabState(route) {
    const tabs = document.querySelectorAll('.tab-link');
    tabs.forEach(tab => {
      if (tab.dataset.link === route) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  // 초기 로드 시 현재 경로에 맞는 탭 활성화
  const currentPath = window.location.pathname;
  updateTabState(currentPath);

  function navigate(route) {
    // 모든 컨텐츠 숨김 처리
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('ranking').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';
    
    switch (route) {
      case 'ranking':
        document.getElementById('ranking').style.display = 'block';
        break;
      case 'how':
        document.getElementById('tutorial').style.display = 'block';
        break;
      default:
        document.getElementById('title-screen').style.display = 'block';
        break;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/sd/')[1] || '';
    navigate(path);
  });

  // popstate 이벤트를 통해 브라우저 뒤로가기 등에 대응
  window.addEventListener('popstate', () => {
    const path = window.location.pathname.split('/sd/')[1] || '';
    navigate(path);
  });
})();
