import SwiftUI

struct ContentView: View {
    @StateObject private var gameCenterManager = GameCenterManager()
    
    var body: some View {
        WebView(gameCenterManager: gameCenterManager)
            .edgesIgnoringSafeArea(.all)
            .onAppear {
                if gameCenterManager.isAuthenticated {
                    print("Game Center 인증 완료")
                }
            }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
