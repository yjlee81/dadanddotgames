import SwiftUI

struct ContentView: View {
    @StateObject private var gameCenterManager = GameCenterManager()
    
    var body: some View {
        WebView(gameCenterManager: gameCenterManager)
            .edgesIgnoringSafeArea(.all)
            .onAppear {
                // 현재 뷰 컨트롤러 설정
                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                   let viewController = windowScene.windows.first?.rootViewController {
                    gameCenterManager.setViewController(viewController)
                }
            }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
