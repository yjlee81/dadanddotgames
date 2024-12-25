class Game {
    constructor() {
        this.size = 4;
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.gameBoard = document.getElementById('game-board');
        this.tileSize = (this.gameBoard.offsetWidth - 50) / 4;
        this.isAnimating = false;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.threshold = 50;
        this.setupModalEvents();
        this.setupEventListeners();
    }

    setupModalEvents() {
        const modal = document.getElementById('start-modal');
        const startButton = document.getElementById('start-button');

        const startGame = () => {
            modal.style.display = 'none';
            this.init();
        };

        // 엔터키 이벤트
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && modal.style.display !== 'none') {
                e.preventDefault();
                startGame();
            }
        });

        startButton.addEventListener('click', startGame);
    }

    handleStart(e) {
        if (e.type.includes('touch')) e.preventDefault();
        if (this.isAnimating) return;
        
        this.isDragging = true;
        const pos = this.getPosition(e);
        this.startX = pos.x;
        this.startY = pos.y;
        this.moveX = 0;
        this.moveY = 0;

        // 드래그 시작 시 트랜지션 제거
        document.querySelectorAll('.tile').forEach(tile => {
            tile.style.transition = 'none';
        });
    }

    handleMove(e) {
        if (!this.isDragging || this.isAnimating) return;
        if (e.type.includes('touch')) e.preventDefault();

        const pos = this.getPosition(e);
        this.moveX = pos.x - this.startX;
        this.moveY = pos.y - this.startY;

        const absX = Math.abs(this.moveX);
        const absY = Math.abs(this.moveY);

        // 주 이동 방향으로만 이동하도록 제한
        if (absX > absY) {
            this.moveY = 0;
        } else {
            this.moveX = 0;
        }

        // 실시간 타일 이동
        requestAnimationFrame(() => {
            this.updateTilesTransform(this.moveX, this.moveY);
        });
    }

    updateTilesTransform(moveX, moveY) {
        const tiles = document.querySelectorAll('.tile');
        const tileSize = this.tileSize;
        
        // 이동 거리를 타일 크기의 비율로 계산 (더 부드러운 이동을 위해 계수 조정)
        const ratioX = (moveX / tileSize) * 0.8;
        const ratioY = (moveY / tileSize) * 0.8;

        tiles.forEach(tile => {
            // 현재 타일의 기본 위치 가져오기
            const x = parseInt(tile.style.left) || 0;
            const y = parseInt(tile.style.top) || 0;
            
            // 실시간 변환 적용
            tile.style.transform = `translate(${ratioX * 100}%, ${ratioY * 100}%)`;
        });
    }

    handleEnd(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        const absX = Math.abs(this.moveX);
        const absY = Math.abs(this.moveY);

        // 트랜지션 복원
        document.querySelectorAll('.tile').forEach(tile => {
            tile.style.transition = 'transform 0.15s ease';
            tile.style.transform = 'none';
        });

        if (Math.max(absX, absY) >= this.threshold) {
            const direction = absX > absY ? 
                (this.moveX > 0 ? 'right' : 'left') : 
                (this.moveY > 0 ? 'down' : 'up');
            this.move(direction);
        } else {
            this.resetTilesPosition();
        }
    }

    resetTilesPosition() {
        document.querySelectorAll('.tile').forEach(tile => {
            tile.style.transform = 'none';
        });
    }

    addPressEffect() {
        this.gameBoard.classList.add('pressed');
        setTimeout(() => this.gameBoard.classList.remove('pressed'), 100);
    }

    getPosition(e) {
        return {
            x: e.type.includes('mouse') ? e.pageX : e.touches[0].pageX,
            y: e.type.includes('mouse') ? e.pageY : e.touches[0].pageY
        };
    }

    mergeTiles(tile1, tile2) {
        const newLevel = tile1.level + 1;
        this.score += newLevel;
        this.updateScore();
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
            this.updateBestScore();
        }

        // 단순히 타일 제거 및 레벨 업데이트
        tile2.level = newLevel;
        this.updateTileValue(tile2);
        tile1.element.remove();
    }

    move(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const moved = this.moveInDirection(direction);
        
        if (moved) {
            setTimeout(() => {
                this.addNewTile();
                this.isAnimating = false;
            }, 150);
        } else {
            this.isAnimating = false;
        }
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});