/**
 * Firebase를 초기화하고, Auth 관련 리스너를 등록하는 모듈
 * - 기존 firebaseConfig는 script.js 상단에 이미 있으므로 재활용
 * - 인증 상태가 변경될 때마다 stateObserver 콜백 호출
 */

// 이 파일에서 initializeApp 호출하지 않음
// 이미 index.html에서 초기화 완료

(function(){
  // 리다이렉트 로그인 결과 처리
  firebase.auth().getRedirectResult()
    .then((result) => {
      if (result.user) {
        console.log('✅ 리다이렉트 로그인 성공:', result.user.uid);
        localStorage.setItem('userKey', result.user.uid);
        updateHeaderUI();
      }
    })
    .catch((error) => {
      console.error('🔴 리다이렉트 오류:', error);
    });

  // 인증 상태 감지 리스너
  firebase.auth().onAuthStateChanged((user) => {
    console.log('[AuthState] Current user:', user ? user.uid : 'null');
    if (user) {
      console.log('로그인 확인:', user.uid);
      localStorage.setItem('userKey', user.uid);
      if (!user.displayName) {
        const newNickname = generateRandomNickname();
        user.updateProfile({ displayName: newNickname })
          .then(() => {
            localStorage.setItem('myNickname', newNickname);
            updateHeaderUI();
          });
      } else {
        localStorage.setItem('myNickname', user.displayName);
      }
    } else {
      console.log('로그아웃 상태 확인');
      localStorage.removeItem('userKey');
      localStorage.removeItem('myNickname');
    }
    updateHeaderUI();
  });

})(); 