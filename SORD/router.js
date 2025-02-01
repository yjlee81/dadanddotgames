// 모듈 시스템 대응을 위해 IIFE(즉시 실행 함수 표현식)로 래핑
(function() {
  // 동적 라우팅 처리
  window.initRouter = function() {  // export 제거 후 전역 객체로 노출
    window.addEventListener('popstate', handleRoute);
    document.addEventListener('DOMContentLoaded', handleRoute);
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
    const path = window.location.pathname;
    
    // 프리렌더링을 위한 서버측 렌더링 대응
    if (isCrawler()) {
      return; // 프리렌더 서비스가 처리
    }

    // 클라이언트 측 라우팅
    switch(path) {
      case '/':
        showSection('title-screen');
        break;
      case '/game':
        await onStartGame();
        break;
      case '/pp.html':
        window.location.href = '/pp.html'; // 정적 페이지
        break;
      case '/help':
        window.location.href = '/static-content.html'; // 정적 페이지
        break;
      default:
        showSection('title-screen');
    }
  };

  const isCrawler = () => 
    /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

  const showSection = (id) => {
    document.querySelectorAll('[data-route]').forEach(section => {
      section.style.display = section.id === id ? 'block' : 'none';
    });
  };
})();
