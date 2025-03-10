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
      const anchorTag = e.target.closest('a[data-link]');
      if (anchorTag) {
        e.preventDefault();
        const route = anchorTag.getAttribute('data-link');
        navigateTo(route);
      }
    });
  };

  const navigateTo = url => {
    window.history.pushState(null, null, url);
    handleRoute();
  };

  const handleRoute = async () => {
    // 경로 정규화: /sd와 /sd/를 동일하게 처리
    let path = window.location.pathname.replace('/sd', '');
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    path = path || '/';

    // 프리렌더링을 위한 서버측 렌더링 대응
    if (isCrawler()) {
      return;
    }

    // 클라이언트 측 라우팅 (모달은 라우팅에서 제외)
    if (path.startsWith('/play/')) {
      const targetSum = parseInt(path.split('/').pop(), 10);
      if (targetSum >= 10 && targetSum <= 20) {
        startGameDirectly(targetSum);
      } else {
        window.location.href = '/sd';
      }
    } else { // 불필요한 else if 제거
      // 기본 화면 표시
      document.getElementById('title-screen').style.display = 'block';
      document.getElementById('game-container').style.display = 'none';
    }

    // 탭 상태 업데이트 (모달 관련 탭은 상태 업데이트 제외)
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
    document.getElementById('title-screen').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('ranking').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('settings').style.display = 'none';
    
  }

  // 랭킹 페이지 표시
  function showRankingPage() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('ranking').style.display = 'block';
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('settings').style.display = 'none';

    // Firebase에서 스코어 데이터를 불러와 표시
    fetchScoresFromFirebase(displayScores);
  }

  // How-to-play 페이지 표시
  function showTutorialPage() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('ranking').style.display = 'none';
    document.getElementById('tutorial').style.display = 'block';
    document.getElementById('settings').style.display = 'none';
    
  }

  // 설정 페이지 표시
  function showSettingsPage() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('ranking').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('settings').style.display = 'block';
    
  }
  // 라우터 변경 시 탭 상태 업데이트 (모달 관련 경로 처리 제거)
  function updateTabState(route) {
    const tabs = document.querySelectorAll('.tab-link');
    tabs.forEach(tab => {
      const isActive = tab.dataset.link === route && route !== '/tutorial' && route !== '/settings';
      tab.classList.toggle('active', isActive);
    });
  }

  // 초기 로드 시 현재 경로에 맞는 탭 활성화
  const currentPath = window.location.pathname;
  updateTabState(currentPath);

  function navigate(route) {
    // 모달 화면은 라우팅에서 제외
    document.getElementById('title-screen').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 모달 관련 경로는 초기 로드에서 무시
    const path = window.location.pathname.split('/sd/')[1] || '';
    if(!['tutorial', 'settings', 'ranking'].includes(path)) {
      navigate(path);
    }
  });

  // popstate 이벤트 핸들러 수정
  window.addEventListener('popstate', () => {
    const path = window.location.pathname.split('/sd/')[1] || '';
    if(!['tutorial', 'settings', 'ranking'].includes(path)) {
      navigate(path);
    }
  });
})();
