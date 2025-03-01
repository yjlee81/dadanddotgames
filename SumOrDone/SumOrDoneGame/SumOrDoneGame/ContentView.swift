import SwiftUI
import WebKit
import GameKit

struct ContentView: View {
    @StateObject private var gameCenterManager = GameCenterManager()
    
    var body: some View {
        WebViewContainer(gameCenterManager: gameCenterManager)
            .edgesIgnoringSafeArea(.all)
            .onAppear {
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let rootVC = windowScene.windows.first?.rootViewController {
                    gameCenterManager.setViewController(rootVC)
                }
            }
    }
}

struct WebViewContainer: UIViewRepresentable {
    @ObservedObject var gameCenterManager: GameCenterManager
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self, gameCenterManager: gameCenterManager)
    }
    
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        let contentController = WKUserContentController()
        
        // JavaScript 메시지 핸들러 등록
        contentController.add(context.coordinator, name: "getGameCenterNickname")
        contentController.add(context.coordinator, name: "hapticFeedback")
        contentController.add(context.coordinator, name: "submitScore")
        contentController.add(context.coordinator, name: "showGameCenter")
        
        config.userContentController = contentController
        
        let webView = WKWebView(frame: .zero, configuration: config)
        context.coordinator.webView = webView
        
        // 로컬 파일 로드
        if let htmlPath = Bundle.main.path(forResource: "index", ofType: "html") {
            let url = URL(fileURLWithPath: htmlPath)
            let directoryURL = url.deletingLastPathComponent()
            webView.loadFileURL(url, allowingReadAccessTo: directoryURL)
        }
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {}
    
    class Coordinator: NSObject, WKScriptMessageHandler, GKGameCenterControllerDelegate {
        var parent: WebViewContainer
        var gameCenterManager: GameCenterManager
        weak var webView: WKWebView?
        
        init(_ parent: WebViewContainer, gameCenterManager: GameCenterManager) {
            self.parent = parent
            self.gameCenterManager = gameCenterManager
            super.init()
        }
        
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            switch message.name {
            case "getGameCenterNickname":
                handleGameCenterAuth()
            case "hapticFeedback":
                if let type = message.body as? String {
                    handleHapticFeedback(type: type)
                }
            case "submitScore":
                if let scoreData = message.body as? [String: Any],
                   let score = scoreData["score"] as? Int {
                    gameCenterManager.submitScore(score)
                }
            case "showGameCenter":
                showGameCenter()
            default:
                break
            }
        }
        
       private func handleGameCenterAuth() {
            gameCenterManager.authenticatePlayer()
            if GKLocalPlayer.local.isAuthenticated {
                let playerData: [String: Any] = ["isAuthenticated": true,
                                               "nickname": GKLocalPlayer.local.displayName]
                if let jsonData = try? JSONSerialization.data(withJSONObject: playerData),
                   let jsonString = String(data: jsonData, encoding: .utf8) {
                    DispatchQueue.main.async {
                        self.webView?.evaluateJavaScript("handleGameCenterAuth(\(jsonString.jsonStringEscaped))", completionHandler: nil)
                    }
                }
            } else {
                let failureData: [String: Any] = ["isAuthenticated": false]
                if let jsonData = try? JSONSerialization.data(withJSONObject: failureData),
                   let jsonString = String(data: jsonData, encoding: .utf8) {
                    DispatchQueue.main.async {
                        self.webView?.evaluateJavaScript("handleGameCenterAuth(\(jsonString.jsonStringEscaped))", completionHandler: nil)
                    }
                }
            }
        }
        
        func handleHapticFeedback(type: String) {
            // 햅틱 피드백 구현...
        }
        
        func showGameCenter() {
            // 게임센터 표시 구현...
        }
        
        func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
            gameCenterViewController.dismiss(animated: true)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

extension String {
    var jsonStringEscaped: String {
        return self.replacingOccurrences(of: "'", with: "\\'")
                  .replacingOccurrences(of: "\"", with: "\\\"")
                  .replacingOccurrences(of: "\n", with: "\\n")
    }
}
