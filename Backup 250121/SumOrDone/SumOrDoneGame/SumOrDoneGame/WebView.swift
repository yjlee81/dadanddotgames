//
//  WebView.swift
//  SumOrDoneGame
//
//  Created by Young Jae Lee on 1/16/25.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    func makeUIView(context: Context) -> WKWebView {
        WKWebView()
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        // 항상 index.html 파일을 로드
        if let path = Bundle.main.path(forResource: "index", ofType: "html") {
            let url = URL(fileURLWithPath: path)
            let request = URLRequest(url: url)
            webView.load(request)
        } else {
            print("index.html 파일을 찾을 수 없습니다.")
        }
    }
}
