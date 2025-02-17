import Foundation

/// 게임 전체 상태를 관리하기 위한 구조체.
/// 보드와 점수 정보 등을 포함.
struct GameState {
    // 현재 라운드의 목표합
    private(set) var targetSum: Int
    
    // 현재 플레이어의 총 점수
    private(set) var totalScore: Int
    
    // 현재 라운드
    private(set) var round: Int
    
    // 추후 힌트, 광고 시청 여부 등 다양한 속성을 추가할 수 있음
    
    var isClassicMode: Bool
    
    init(isClassicMode: Bool = false, initialTarget: Int? = nil) {
        self.isClassicMode = isClassicMode
        
        // 클래식 모드라면 플레이어가 10~20 중 선택 가능
        // 선택된 값이 없다면 default = 10
        if isClassicMode, let chosenTarget = initialTarget {
            self.targetSum = chosenTarget
        } else {
            self.targetSum = 10 // 기본 레벨1 = 10
        }
        
        self.totalScore = 0
        self.round = 1
    }
    
    /// 목표합 달성 후, 다음 라운드로 넘어갈 때 호출
    mutating func advanceRound() {
        round += 1
        targetSum += 1
    }
    
    /// 점수를 추가하는 메서드
    mutating func addScore(_ amount: Int) {
        totalScore += amount
    }
    
    /// "결!" 버튼으로 보너스 혹은 패널티를 적용할 때 사용
    mutating func applyEndRoundBonus(isSuccess: Bool) {
        totalScore += isSuccess ? 100 : -50
    }
    
    func roundCleared() {
        // 라운드 클리어 시 다음 라운드로 넘어가며 targetSum +1
        round += 1
        targetSum += 1
    }
    
    func calculateScore(forTileCount count: Int) -> Int {
        // 예: 기본 점수 = count * 10, 길이 보너스 = 4칸 이상일 경우 + 20
        var baseScore = count * 10
        if count >= 4 {
            baseScore += 20
        }
        return baseScore
    }
} 