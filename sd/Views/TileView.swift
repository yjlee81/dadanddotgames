import SwiftUI

struct TileView: View {
    let row: Int
    let col: Int
    let isHint: Bool
    let number: Int
    
    var body: some View {
        Text("\(number)")
            .frame(minWidth: 40, minHeight: 40)
            .background(isHint ? Color.yellow : Color.blue.opacity(0.3))
            .foregroundColor(.black)
            .cornerRadius(8)
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.gray, lineWidth: 1)
            )
    }
} 