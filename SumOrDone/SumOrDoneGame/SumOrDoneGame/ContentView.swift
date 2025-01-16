//
//  ContentView.swift
//  SumOrDoneGame
//
//  Created by Young Jae Lee on 1/16/25.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        WebView(htmlFileName: "index") // index.html 파일 로드
            .edgesIgnoringSafeArea(.all) // 화면 전체에 WebView 표시
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
