import SwiftUI

struct ContentView: View {
    var body: some View {
        WebView()
            .edgesIgnoringSafeArea(.all) // WebView를 전체 화면에 표시
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
