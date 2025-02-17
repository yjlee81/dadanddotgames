import SwiftUI

struct ContentView: View {
    @State private var gameBoard = GameBoard(difficulty: .easy)  // 6x6 보드로 시작
    @State private var gameState = GameState()
    @State private var selectedPositions: [(row: Int, col: Int)] = []
    @State private var showHint: Bool = false
    
    var body: some View {
        VStack(spacing: 20) {
            Text("목표합: \(gameState.targetSum)")
                .font(.title)
            
            Text("현재 점수: \(gameState.totalScore)")
                .font(.title2)
            
            VStack(spacing: 4) {
                ForEach(0..<gameBoard.rows, id: \.self) { row in
                    HStack(spacing: 4) {
                        ForEach(0..<gameBoard.columns, id: \.self) { column in
                            TileView(
                                row: row,
                                col: column,
                                isHint: showHint,
                                number: gameBoard.cells[row][column]
                            )
                            .onTapGesture {
                                selectedPositions.append((row, column))
                            }
                        }
                    }
                }
            }
            .padding()
            
            HStack(spacing: 20) {
                Button("확인") {
                    checkSelection()
                }
                .buttonStyle(.borderedProminent)
                
                Button("결!") {
                    checkNoMoreMoves()
                }
                .buttonStyle(.bordered)
                
                Button("힌트") {
                    showHint = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                        showHint = false
                    }
                }
                .buttonStyle(.bordered)
            }
        }
        .padding()
    }
    
    private func checkSelection() {
        let sum = selectedPositions.reduce(0) { partialResult, pos in
            partialResult + gameBoard.cells[pos.row][pos.col]
        }
        
        if sum == gameState.targetSum {
            let score = gameState.calculateScore(forTileCount: selectedPositions.count)
            gameState.addScore(score)
            selectedPositions.removeAll()
        }
    }
    
    private func checkNoMoreMoves() {
        // 실제로는 여기서 가능한 조합이 있는지 체크
        let hasCombinationLeft = false
        gameState.applyEndRoundBonus(isSuccess: !hasCombinationLeft)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
} 