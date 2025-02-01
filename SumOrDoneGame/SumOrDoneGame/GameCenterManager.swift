import GameKit
import SwiftUI

class GameCenterManager: NSObject, ObservableObject, GKGameCenterControllerDelegate {
    @Published var isAuthenticated: Bool = false
    
    override init() {
        super.init()
        authenticateUser()
    }
    
    func authenticateUser() {
        GKLocalPlayer.local.authenticateHandler = { viewController, error in
            if let viewController = viewController {
                // Game Center 로그인 화면 표시
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let rootViewController = windowScene.windows.first?.rootViewController {
                    rootViewController.present(viewController, animated: true, completion: nil)
                }
            } else if GKLocalPlayer.local.isAuthenticated {
                // 인증 성공
                self.isAuthenticated = true
                print("Game Center 인증 성공")
            } else {
                // 인증 실패
                self.isAuthenticated = false
                print("Game Center 인증 실패: \(error?.localizedDescription ?? "알 수 없는 오류")")
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
} 
