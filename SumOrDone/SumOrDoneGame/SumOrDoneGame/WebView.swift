//
//  WebView.swift
//  SumOrDoneGame
//
//  Created by Young Jae Lee on 1/16/25.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    @ObservedObject var gameCenterManager: GameCenterManager
    
    func makeUIView(context: Context) -> WKWebView {
        let contentController = WKUserContentController()
        contentController.add(context.coordinator, name: "hapticFeedback")
        contentController.add(context.coordinator, name: "submitScore")

        let webViewConfig = WKWebViewConfiguration()
        webViewConfig.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        webViewConfig.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
        webViewConfig.preferences.setValue(true, forKey: "developerExtrasEnabled")

        let webView = WKWebView(
            frame: .zero, 
            configuration: webViewConfig
        )

        // 파일 로드 시 반드시 디렉토리 접근 권한 부여
        if let htmlPath = Bundle.main.path(
            forResource: "index", 
            ofType: "html", 
            inDirectory: "SumOrDoneGame"
        ) {
            let url = URL(fileURLWithPath: htmlPath)
            let directoryURL = url.deletingLastPathComponent()
            webView.loadFileURL(url, allowingReadAccessTo: directoryURL)
        }

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if let path = Bundle.main.path(forResource: "index", ofType: "html") {
            let fileURL = URL(fileURLWithPath: path)
            // ⬇️ 로컬 파일 로드시 'allowingReadAccessTo'를 꼭 설정
            webView.loadFileURL(fileURL, allowingReadAccessTo: fileURL.deletingLastPathComponent())
        } else {
            print("index.html 파일을 찾을 수 없습니다.")
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self, gameCenterManager: gameCenterManager)
    }

    class Coordinator: NSObject, WKScriptMessageHandler {
        var parent: WebView
        var gameCenterManager: GameCenterManager

        init(_ parent: WebView, gameCenterManager: GameCenterManager) {
            self.parent = parent
            self.gameCenterManager = gameCenterManager
        }

        func userContentController(_ userContentController: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            if message.name == "hapticFeedback" {
                if let type = message.body as? String {
                    handleHapticFeedback(type: type)
                }
            } else if message.name == "submitScore", let score = message.body as? Int {
                gameCenterManager.submitScore(score: score, leaderboardID: "com.dadanddot.SumOrDoneGame.leaderboard")
            }
        }

        func handleHapticFeedback(type: String) {
            switch type {
            case "selection":
                let generator = UIImpactFeedbackGenerator(style: .light)
                generator.prepare()
                generator.impactOccurred()
            case "success":
                let generator = UINotificationFeedbackGenerator()
                generator.prepare()
                generator.notificationOccurred(.success)
            case "done":
                let generator = UINotificationFeedbackGenerator()
                generator.prepare()
                generator.notificationOccurred(.success)
            default:
                break
            }
        }
    }
}
