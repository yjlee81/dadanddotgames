class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'ko';
        this.init();
    }

    init() {
        // 언어 선택기 초기화
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }

        // 저장된 언어로 초기 설정
        this.setLanguage(this.currentLanguage);
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);

        // i18n 요소들 업데이트
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // 언어 변경 이벤트 발생
        const event = new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        });
        document.dispatchEvent(event);
    }
}

// 번역 데이터
const translations = {
    ko: {
        title: '마스터몬스터',
        welcome: '마스터몬스터에 오신 것을 환영합니다!',
        instructions: '몬스터를 합쳐서 마스터 레벨에 도달하세요!',
        startGame: '게임 시작',
        restart: '다시하기',
        currentScore: '현재 점수',
        bestScore: '최고점수',
        masterMonsterTitle: '마스터몬스터',
        masterMonsterDesc: '몬스터를 합쳐 최강의 마스터를 만들어보세요!',
        loginSignup: 'Login / Sign up'
    },
    en: {
        title: 'Master Monster',
        welcome: 'Welcome to Master Monster!',
        instructions: 'Merge monsters to reach the master level!',
        startGame: 'Start Game',
        restart: 'Restart',
        currentScore: 'Score',
        bestScore: 'Best',
        masterMonsterTitle: 'Master Monster',
        masterMonsterDesc: 'Merge monsters to create the ultimate master!',
        loginSignup: 'Login / Sign up'
    },
    ja: {
        title: 'マスターモンスター',
        welcome: 'マスターモンスターへようこそ！',
        instructions: 'モンスターを合体させてマスターレベルに到達しよう！',
        startGame: 'ゲームスタート',
        restart: 'リスタート',
        currentScore: 'スコア',
        bestScore: 'ベスト',
        masterMonsterTitle: 'マスターモンスター',
        masterMonsterDesc: 'モンスターを合体させて最強のマスターを目指そう！',
        loginSignup: 'ログイン / 登録'
    },
    zh: {
        title: '怪兽大师',
        welcome: '欢迎来到怪兽大师！',
        instructions: '合并怪兽以达到大师等级！',
        startGame: '开始游戏',
        restart: '重新开始',
        currentScore: '当前分数',
        bestScore: '最高分',
        masterMonsterTitle: '怪兽大师',
        masterMonsterDesc: '合并怪兽，创造终极大师！',
        loginSignup: '登录 / 注册'
    }
};

// 페이지 로드 시 언어 관리자 초기화
document.addEventListener('DOMContentLoaded', () => {
    const languageManager = new LanguageManager();
}); 