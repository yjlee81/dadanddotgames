import Foundation

/// 보드 상태를 관리하기 위한 구조체.
/// 6x6, 8x8 등 다양한 크기의 보드를 지원할 수 있음.
struct GameBoard {
    private(set) var rows: Int
    private(set) var columns: Int
    private(set) var cells: [[Int]]
    
    /// 보드 난이도에 따라 초기화
    init(difficulty: BoardDifficulty) {
        switch difficulty {
        case .easy:
            rows = 6
            columns = 6
        case .hard:
            rows = 8
            columns = 8
        }

        cells = []
        for _ in 0..<rows {
            var rowData: [Int] = []
            for _ in 0..<columns {
                // 1~9 범위의 난수
                let randomNum = Int.random(in: 1...9)
                rowData.append(randomNum)
            }
            cells.append(rowData)
        }
    }
    
    /// 특정 위치의 숫자를 업데이트(칸 제거 등)할 수 있는 메서드
    mutating func updateCell(row: Int, column: Int, newValue: Int) {
        guard row >= 0, row < rows,
              column >= 0, column < columns else {
            return
        }
        cells[row][column] = newValue
    }
    
    /// 콘솔 디버그용 출력 (테스트하기 편리)
    func printBoard() {
        for row in cells {
            print(row.map { String($0) }.joined(separator: " "))
        }
    }
}

// 보드 난이도에 따라 초기화
enum BoardDifficulty {
    case easy  // 6x6
    case hard  // 8x8
    // 추후 다른 난이도 추가 가능
} 