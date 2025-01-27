//
//  WebView.swift
//  SumOrDoneGame
//
//  Created by Young Jae Lee on 1/16/25.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {

    // SwiftUI에서 UIViewRepresentable을 사용할 때,
    // 메시지 핸들러 등 UIKit의 델리게이트/프로토콜 처리에 필요한
    // Coordinator 객체를 생성
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    // WKWebView를 생성해서 반환
    func makeUIView(context: Context) -> WKWebView {
        // 1) UserContentController & 메시지 핸들러 등록
        let contentController = WKUserContentController()
        contentController.add(context.coordinator, name: "hapticFeedback")
        
        // 2) WKWebViewConfiguration에 연결
        let config = WKWebViewConfiguration()
        config.userContentController = contentController
        
        // 3) 구성된 config로 WKWebView 생성
        let webView = WKWebView(frame: .zero, configuration: config)
        
        return webView
    }

    // SwiftUI의 View가 업데이트될 때 (재랜더링) 호출
    func updateUIView(_ uiView: WKWebView, context: Context) {
        // index.html 파일 로드
        if let path = Bundle.main.path(forResource: "index", ofType: "html") {
            let url = URL(fileURLWithPath: path)
            let request = URLRequest(url: url)
            uiView.load(request)
        } else {
            print("index.html 파일을 찾을 수 없습니다.")
        }
    }
    
    // SwiftUI에서 사용할 Coordinator
    class Coordinator: NSObject, WKScriptMessageHandler {
        var parent: WebView
        
        init(_ parent: WebView) {
            self.parent = parent
        }
        
        // JavaScript에서 메시지를 받았을 때 호출되는 메서드
        func userContentController(_ userContentController: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            if message.name == "hapticFeedback" {
                if let type = message.body as? String {
                    handleHapticFeedback(type: type)
                }
            }
        }
        
        // 실제로 iOS 햅틱 피드백을 발생시키는 메서드
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
        
        deinit {
            // 만약 WKUserContentController에서 메시지 핸들러 제거가 필요하다면 여기서 해도 됩니다
        }
    }
}
