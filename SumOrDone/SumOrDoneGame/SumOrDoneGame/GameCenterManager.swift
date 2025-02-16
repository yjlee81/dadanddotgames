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
    
    static let shared = GameCenterManager()
    
    override init() {
        super.init()
        authenticatePlayer()
    }
    
    func authenticatePlayer() {
        GKLocalPlayer.local.authenticateHandler = { [weak self] viewController, error in
            if let viewController = viewController {
                // 인증 화면이 필요한 경우
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let rootViewController = windowScene.windows.first?.rootViewController {
                    rootViewController.present(viewController, animated: true)
                }
            } else if error != nil {
                // 인증 실패
                self?.isAuthenticated = false
            } else {
                // 인증 성공
                self?.isAuthenticated = true
                // 게임센터 닉네임으로 UI 업데이트
                self?.updateGameCenterNickname()
            }
        }
    }
    
    private func updateGameCenterNickname() {
        let localPlayer = GKLocalPlayer.local
        if localPlayer.isAuthenticated {
            DispatchQueue.main.async {
                // 모든 WebView 인스턴스에 JavaScript 실행
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let rootViewController = windowScene.windows.first?.rootViewController {
                    for case let webView as WKWebView in rootViewController.view.subviews {
                        let jsCallback = "window.updateNicknameFromGameCenter('\(localPlayer.displayName)');"
                        webView.evaluateJavaScript(jsCallback, completionHandler: nil)
                    }
                }
            }
        }
    }
    
    func submitScore(score: Int, leaderboardID: String) {
        if isAuthenticated {
            GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: ["com.dadanddot.SumOrDoneGame.leaderboard"]) { error in
                if let error = error {
                    print("점수 제출 실패: \(error.localizedDescription)")
                } else {
                    print("점수 제출 성공")
                }
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
} 
