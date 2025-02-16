/**
 * 구글 로그인 메서드 (Popup → Redirect 변경)
 */
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  // 리다이렉트 방식으로 변경
  firebase.auth().signInWithRedirect(provider)
    .then(() => {
      console.log('리다이렉트 시작');
    })
    .catch((error) => {
      console.error('리다이렉트 오류:', error);
    });
}

/**
 * 로그아웃 메서드
 */
function signOut() {
  firebase.auth().signOut()
    .then(() => {
      console.log('로그아웃 성공');
      // 로그아웃 시 localStorage에서 userKey, myNickname 등을 정리해도 됨
    })
    .catch((error) => {
      console.error('로그아웃 실패:', error);
    });
}

/**
 * Game Center 로그인 커스텀 토큰 수령 후, Firebase 인증
 * @param {string} customToken - Native iOS 코드에서 넘겨주는 커스텀 토큰
 */
function signInWithGameCenterToken(customToken) {
  firebase.auth().signInWithCustomToken(customToken)
    .then((result) => {
      console.log('Game Center 커스텀 토큰 로그인 성공:', result.user);
    })
    .catch((error) => {
      console.error('Game Center 로그인 오류:', error);
    });
}

// 필요한 경우 export or window 전역 할당
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.signInWithGameCenterToken = signInWithGameCenterToken; 

// 사용자 헤더 영역 갱신
function updateHeaderUI() {
  const headerLeft = document.getElementById('header-left');
  if (!headerLeft) {
    console.error('header-left 요소 없음');
    return;
  }

  const user = firebase.auth().currentUser;
  console.log('UI 갱신 시 사용자 상태:', user ? user.uid : 'null');

  headerLeft.innerHTML = '';

  if (user) {
    const nickname = user.displayName || '게스트';
    const cumScore = localStorage.getItem('cumulativeScore') || 0;
    
    headerLeft.innerHTML = `
      <div class="profile-area" onclick="openProfileModal()">
        <span>${nickname}</span>
        <span class="score">${cumScore}pts</span>
      </div>
    `;
  } else {
    headerLeft.innerHTML = `
      <button class="login-btn" onclick="signInWithGoogle()">
        <i class="fi fi-brands-google"></i> 구글 로그인
      </button>
    `;
  }
}

function openProfileModal() {
  const profileModal = document.getElementById('profile-modal');
  
  // 모달내용 업데이트
  document.getElementById('profile-nickname').textContent =
    localStorage.getItem('myNickname') || '게스트';
  document.getElementById('cumulative-score').textContent =
    localStorage.getItem('cumulativeScore') || 0;

  profileModal.style.display = 'block';
}

// 닉네임 변경 모달 표시
document.getElementById('nickname-change-btn').addEventListener('click', () => {
  // 프로필 모달 닫기(옵션)
  document.getElementById('profile-modal').style.display = 'none';
  // 닉네임 변경 모달 열기
  document.getElementById('changeNicknameModal').style.display = 'block';
});

// 닉네임 변경 저장
document.getElementById('saveNicknameBtn').addEventListener('click', () => {
  const newNickname = document.getElementById('newNicknameInput').value.trim();
  if (newNickname) {
    const user = firebase.auth().currentUser;
    
    // Firebase Realtime DB 업데이트
    if (user) {
      const updates = {};
      updates[`nicknames/${user.uid}/nickname`] = newNickname;
      firebase.database().ref().update(updates);
    }
    
    // 로컬스토리지 업데이트
    localStorage.setItem("myNickname", newNickname);
    
    // UI 동기화
    updateHeaderUI();
    displayCurrentUserScore();
  }
});

// 공통: .close-modal-btn 클릭 시 모달 닫기
document.querySelectorAll('.close-modal-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const modalScrim = e.target.closest('.modal-scrim');
    if (modalScrim) {
      modalScrim.style.display = 'none';
    }
  });
});

// onAuthStateChanged 후 헤더 표시 갱신
firebase.auth().onAuthStateChanged(() => {
  updateHeaderUI();
});

// 페이지 로드 시 한번 헤더 갱신
window.addEventListener('load', updateHeaderUI);