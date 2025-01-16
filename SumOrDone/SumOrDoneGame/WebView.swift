//
//  WebView.swift
//  SumOrDoneGame
//
//  Created by Young Jae Lee on 1/16/25.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let htmlFileName: String

    func makeUIView(context: Context) -> WKWebView {
        return WKWebView()
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if let path = Bundle.main.path(forResource: htmlFileName, ofType: "html") {
            let url = URL(fileURLWithPath: path)
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
}
