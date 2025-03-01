import GameKit
import SwiftUI
import WebKit

enum GameCenterAchievement: String {
    case oneKPointsEarned = "com.dadanddot.SumOrDoneGame.1kptsearned"     // 1000점 달성
    case firstSuccess = "com.dadanddot.SumOrDoneGame.10ptsearned"         // 첫 목표합 성공
    case firstStart = "com.dadanddot.SumOrDoneGame.justgotstarted"        // 첫 게임 시작
}

class GameCenterManager: NSObject, ObservableObject, GKGameCenterControllerDelegate {
    @Published var isAuthenticated: Bool = false
    weak var webView: WKWebView?
    weak var viewController: UIViewController?
    
    // 추가: 게임센터 상태 변경 알림을 위한 NotificationCenter 키
    static let gameCenterStatusChanged = Notification.Name("GameCenterStatusChanged")
    
    static let shared = GameCenterManager()
    
    override init() {
        super.init()
        authenticatePlayer()
        
        // 앱이 포그라운드로 돌아올 때마다 게임센터 상태 확인
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(checkAuthenticationStatus),
            name: UIApplication.willEnterForegroundNotification,
            object: nil
        )
    }
    
    // 추가: authenticatePlayer 메서드
    func authenticatePlayer() {
        GKLocalPlayer.local.authenticateHandler = { [weak self] vc, error in
            guard let self = self else { return }
            if let vc = vc {
                DispatchQueue.main.async {
                    self.viewController?.present(vc, animated: true)
                }
            } else if let error = error {
                print("Game Center 인증 실패: \(error.localizedDescription)")
                self.isAuthenticated = false
                self.notifyGameCenterStatus(authenticated: false)
            } else {
                print("Game Center 인증 성공")
                self.isAuthenticated = true
                self.updateGameCenterNickname()
            }
        }
    }
    
    // 뷰 컨트롤러 설정 메서드 추가
    func setViewController(_ controller: UIViewController) {
        self.viewController = controller
    }
    
    @objc private func checkAuthenticationStatus() {
        if GKLocalPlayer.local.isAuthenticated {
            self.isAuthenticated = true
            self.updateGameCenterNickname()
        } else {
            self.isAuthenticated = false
            self.notifyGameCenterStatus(authenticated: false)
        }
    }
    
    private func notifyGameCenterStatus(authenticated: Bool) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self, let webView = self.webView else { return }
            let status = authenticated ? "authenticated" : "failed"
            let nickname = authenticated ? GKLocalPlayer.local.displayName : ""
            let response: [String: Any] = [
                "status": status,
                "nickname": nickname,
                "isAuthenticated": authenticated
            ]
            if let jsonData = try? JSONSerialization.data(withJSONObject: response),
               let jsonString = String(data: jsonData, encoding: .utf8) {
                webView.evaluateJavaScript("window.onGameCenterStatus('\(jsonString.jsonStringEscaped)')", completionHandler: nil)
            }
        }
    }
    
    private func updateGameCenterNickname() {
        let localPlayer = GKLocalPlayer.local
        if localPlayer.isAuthenticated {
            DispatchQueue.main.async { [weak self] in
                guard let self = self,
                      let webView = self.webView else { return }
                
                let response = [
                    "nickname": localPlayer.displayName,
                    "isAuthenticated": true,
                    "photoURL": "" // 프로필 이미지 URL (필요한 경우 추가)
                ]
                
                if let jsonData = try? JSONSerialization.data(withJSONObject: response),
                   let jsonString = String(data: jsonData, encoding: .utf8) {
                    webView.evaluateJavaScript("window.updateNicknameFromGameCenter('\(jsonString)')") { _, error in
                        if let error = error {
                            print("닉네임 업데이트 실패:", error)
                        }
                    }
                }
            }
        }
    }
    
    func submitScore(_ score: Int) {
        guard isAuthenticated else { return }
        let leaderboardID = "com.dadanddot.SumOrDoneGame.leaderboard"
        GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [leaderboardID]) { error in
            if let error = error {
                print("점수 제출 실패: \(error.localizedDescription)")
            } else {
                print("점수 제출 성공")
            }
        }
    }
    
    func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true, completion: nil)
    }
    
    func fetchLocalPlayerProfile(completion: @escaping (String?, UIImage?) -> Void) {
        let player = GKLocalPlayer.local
        let alias = player.alias // 게임센터별명
        
        // 사진(프로필 이미지) 가져오기
        player.loadPhoto(for: .small) { image, error in
            if let error = error {
                print("프로필 이미지 불러오기 실패: \(error)")
                completion(alias, nil)
                return
            }
            completion(alias, image)
        }
    }
    
    func reportAchievement(identifier: String, percentComplete: Double) {
        guard isAuthenticated else {
            print("Game Center 인증되지 않음")
            return
        }
        
        print("업적 보고 시도 - ID: \(identifier), 달성도: \(percentComplete)%")
        
        let achievement = GKAchievement(identifier: identifier)
        achievement.percentComplete = percentComplete
        achievement.showsCompletionBanner = true
        
        GKAchievement.report([achievement]) { error in
            if let error = error {
                print("업적 보고 실패: \(error.localizedDescription)")
            } else {
                print("업적 보고 성공: \(identifier)")
            }
        }
    }
    
    func unlock10PointsAchievement() {
        // 업적 ID 수정 및 디버그 로그 추가
        print("10점 업적 달성 시도")
        reportAchievement(identifier: "com.dadanddot.SumOrDoneGame.achievement", percentComplete: 100.0)
    }
    
    func unlock1000PointsAchievement() {
        // 업적 ID 수정 및 디버그 로그 추가
        print("1000점 업적 달성 시도")
        reportAchievement(identifier: "0002", percentComplete: 100.0)
    }
    
    func checkAndUnlockAchievements(score: Int, isFirstSuccess: Bool, isFirstStart: Bool) {
        // 1000점 달성 체크
        if score >= 1000 {
            unlockAchievement(GameCenterAchievement.oneKPointsEarned.rawValue)
        }
        
        // 첫 목표합 성공 체크
        if isFirstSuccess {
            unlockAchievement(GameCenterAchievement.firstSuccess.rawValue)
        }
        
        // 첫 게임 시작 체크
        if isFirstStart {
            unlockAchievement(GameCenterAchievement.firstStart.rawValue)
        }
    }
    
    private func unlockAchievement(_ identifier: String) {
        let achievement = GKAchievement(identifier: identifier)
        achievement.percentComplete = 100
        achievement.showsCompletionBanner = true
        
        GKAchievement.report([achievement]) { error in
            if let error = error {
                print("업적 해제 실패: \(error.localizedDescription)")
            } else {
                print("업적 해제 성공: \(identifier)")
            }
        }
    }
    
    // checkGameCenterStatus 수정
    func checkGameCenterStatus() {
        GKLocalPlayer.local.authenticateHandler = { [weak self] viewController, error in
            guard let self = self else { return }
            
            if let viewController = viewController {
                // 인증 필요 - 게임센터 로그인 화면 표시
                DispatchQueue.main.async {
                    self.viewController?.present(viewController, animated: true)
                }
            } else if error != nil {
                // 인증 실패
                self.webView?.evaluateJavaScript("window.onGameCenterStatus('failed')")
            } else {
                // 인증 성공
                let nickname = GKLocalPlayer.local.displayName
                self.webView?.evaluateJavaScript("window.onGameCenterStatus('authenticated', '\(nickname)')")
            }
        }
    }
}

// 리더보드 ID 관리 개선
enum LeaderboardID: String {
    case target10 = "com.dadanddot.SumOrDoneGame.target10"
    case target15 = "com.dadanddot.SumOrDoneGame.target15"
    case target20 = "com.dadanddot.SumOrDoneGame.target20"
    
    static func forTarget(_ target: Int) -> String {
        switch target {
        case 10...14: return LeaderboardID.target10.rawValue
        case 15...19: return LeaderboardID.target15.rawValue
        case 20: return LeaderboardID.target20.rawValue
        default: return LeaderboardID.target10.rawValue
        }
    }
} 
