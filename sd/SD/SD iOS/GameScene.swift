import SpriteKit
import GameplayKit

class GameScene: SKScene {
    
    // 보드 행/열 개수
    private let boardRows = 6
    private let boardCols = 6
    
    // 숫자 범위
    private let minNumber = 1
    private let maxNumber = 9
    
    // 목표합 (예시 기본값)
    private var targetSum: Int = 10
    
    // 실제 보드 상의 숫자 정보를 저장할 2차원 배열
    private var boardData: [[Int?]] = []
    
    // 드래그로 선택 중인지 여부
    private var isDragging = false
    
    // 드래그로 선택한 위치들
    private var dragPositions: [(row: Int, col: Int)] = []
    
    // 점수 관련
    private var totalScore: Int = 0
    
    // UI 노드들
    private var scoreLabel: SKLabelNode!
    private var targetLabel: SKLabelNode!
    private var boardNode: SKNode!
    
    // 타이머
    private var remainingSeconds = 150
    private var timerLabel: SKLabelNode!
    private var timerActionKey = "timerAction"
    
    // "Done!" 버튼, "Hint" 버튼 등
    private var doneButton: SKLabelNode!
    private var hintButton: SKLabelNode!
    private var hintsLeft: Int = 3

    override func didMove(to view: SKView) {
        // 만약 .sks 파일에 "Hello, World!" 라벨 노드가 있다면 텍스트를 "hi there"로 변경합니다.
        if let helloNode = self.childNode(withName: "helloLabel") as? SKLabelNode {
            helloNode.text = "hi there"
        }
        
        backgroundColor = .white
        createUI()
        initBoardData()
        renderBoard()
        startTimer()
    }
    
    // MARK: - UI 구성 
    private func createUI() {
        // (1) 목표합 라벨
        targetLabel = SKLabelNode(fontNamed: "HelveticaNeue-Bold")
        targetLabel.text = "목표: \(targetSum)"
        targetLabel.fontSize = 20
        targetLabel.fontColor = .black
        targetLabel.position = CGPoint(x: size.width * 0.5, y: size.height - 50)
        addChild(targetLabel)
        
        // (2) 점수 라벨
        scoreLabel = SKLabelNode(fontNamed: "HelveticaNeue")
        scoreLabel.text = "점수: 0"
        scoreLabel.fontSize = 20
        scoreLabel.fontColor = .black
        scoreLabel.position = CGPoint(x: size.width * 0.3, y: size.height - 80)
        addChild(scoreLabel)
        
        // (3) 타이머 라벨
        timerLabel = SKLabelNode(fontNamed: "HelveticaNeue")
        timerLabel.text = "150s"
        timerLabel.fontSize = 20
        timerLabel.fontColor = .black
        timerLabel.position = CGPoint(x: size.width * 0.7, y: size.height - 80)
        addChild(timerLabel)
        
        // (4) Done 버튼
        doneButton = SKLabelNode(fontNamed: "HelveticaNeue-Bold")
        doneButton.text = "결!"
        doneButton.fontSize = 24
        doneButton.fontColor = .blue
        doneButton.position = CGPoint(x: size.width * 0.8, y: 40)
        doneButton.name = "doneButton"
        addChild(doneButton)
        
        // (5) Hint 버튼
        hintButton = SKLabelNode(fontNamed: "HelveticaNeue-Bold")
        hintButton.text = "힌트(\(hintsLeft))"
        hintButton.fontSize = 20
        hintButton.fontColor = .blue
        hintButton.position = CGPoint(x: size.width * 0.2, y: 40)
        hintButton.name = "hintButton"
        addChild(hintButton)
        
        // 보드 컨테이너 노드
        boardNode = SKNode()
        addChild(boardNode)
    }
    
    // MARK: - 보드 초기화
    private func initBoardData() {
        boardData = []
        for _ in 0..<boardRows {
            var rowArr: [Int?] = []
            for _ in 0..<boardCols {
                let val = Int.random(in: minNumber...maxNumber)
                rowArr.append(val)
            }
            boardData.append(rowArr)
        }
    }
    
    // MARK: - 보드 렌더링
    private func renderBoard() {
        boardNode.removeAllChildren()
        
        // 보드 크기를 화면 크기에 맞춰서 배치
        let cellSize: CGFloat = min(size.width, size.height) / CGFloat(max(boardRows, boardCols) + 2)
        let startX = (size.width - cellSize * CGFloat(boardCols)) / 2
        let startY = (size.height - cellSize * CGFloat(boardRows)) / 2
        
        for r in 0..<boardRows {
            for c in 0..<boardCols {
                let val = boardData[r][c]
                
                // 사각형 노드
                let cell = SKShapeNode(rectOf: CGSize(width: cellSize - 2, height: cellSize - 2), cornerRadius: 4)
                cell.strokeColor = .black
                cell.lineWidth = 1
                cell.fillColor = val != nil ? UIColor(red: 0.95, green: 0.95, blue: 1.0, alpha: 1.0) : .lightGray
                let xPos = startX + CGFloat(c) * cellSize + cellSize/2
                let yPos = startY + CGFloat(boardRows - 1 - r) * cellSize + cellSize/2
                cell.position = CGPoint(x: xPos, y: yPos)
                cell.name = "cell_\(r)_\(c)"
                
                boardNode.addChild(cell)
                
                // 숫자 라벨
                if let realVal = val {
                    let label = SKLabelNode(fontNamed: "HelveticaNeue-Bold")
                    label.text = "\(realVal)"
                    label.fontSize = cellSize * 0.4
                    label.fontColor = .black
                    label.verticalAlignmentMode = .center
                    label.position = .zero
                    cell.addChild(label)
                }
            }
        }
    }
    
    // MARK: - 터치 이벤트 처리 (드래그 선택)
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first else { return }
        let location = touch.location(in: self)
        
        // 버튼 터치 확인
        let touchedNodes = nodes(at: location)
        if let nodeName = touchedNodes.first?.name {
            if nodeName == "doneButton" {
                onDoneButtonTapped()
                return
            } else if nodeName == "hintButton" {
                onHintButtonTapped()
                return
            }
        }
        
        // 드래그 시작
        isDragging = true
        dragPositions.removeAll()
        
        if let (row, col) = findCellRowCol(at: location) {
            dragPositions.append((row, col))
            highlightCell(row: row, col: col, highlight: true)
        }
    }
    
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard let touch = touches.first, isDragging else { return }
        let location = touch.location(in: self)
        
        if let (row, col) = findCellRowCol(at: location) {
            if (row, col) != dragPositions.last {
                // 라인 검사 (직선/대각선인지 간단히 처리 가능)
                // 여기서는 간단히 "이미 방문한 칸이 아니면 추가" 로 처리
                if !dragPositions.contains(where: { $0.row == row && $0.col == col }) {
                    dragPositions.append((row, col))
                    highlightCell(row: row, col: col, highlight: true)
                }
            }
        }
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        guard isDragging else { return }
        isDragging = false
        
        // 드래그 끝났을 때, 선택된 라인을 체크
        if dragPositions.count < 2 {
            // 너무 짧으면 취소
            unhighlightAllDraggedCells()
            dragPositions.removeAll()
            return
        }
        
        checkLine(dragPositions)
    }
    
    // MARK: - 선택 라인 검사
    private func checkLine(_ linePositions: [(row: Int, col: Int)]) {
        let sumVal = linePositions.reduce(0) { partialSum, pos in
            let val = boardData[pos.row][pos.col] ?? 0
            return partialSum + val
        }
        // gapCount (null인 칸)도 체크 가능
        let gapCount = linePositions.filter { boardData[$0.row][$0.col] == nil }.count
        
        if sumVal == targetSum {
            // 성공
            let lengthBonus = linePositions.count >= 3 ? (linePositions.count - 2) * 5 : 0
            let gapBonus = gapCount * 5
            let gainedScore = sumVal + lengthBonus + gapBonus
            
            totalScore += gainedScore
            scoreLabel.text = "점수: \(totalScore)"
            
            // 칸 제거
            for pos in linePositions {
                boardData[pos.row][pos.col] = nil
            }
            showFloatingScore(gainedScore, endPos: linePositions.last!)
        } else {
            // 실패
            showToast("목표합 \(targetSum)이어야 합니다!")
        }
        unhighlightAllDraggedCells()
        dragPositions.removeAll()
        renderBoard()
    }
    
    // MARK: - "Done!" 버튼 처리
    private func onDoneButtonTapped() {
        // 보드 상에 가능한 조합이 남아있는지 스캔
        if hasAnyMatchingLine() {
            // 남아있으면 -50
            totalScore = max(0, totalScore - 50)
            scoreLabel.text = "점수: \(totalScore)"
            showToast("아직 만들 수 있는 조합이 있습니다! -50점")
        } else {
            // 없으면 +100
            totalScore += 100
            scoreLabel.text = "점수: \(totalScore)"
            showToast("조합이 없어요! +100점")
            // 여기서 보너스 계산, 라운드 진행 등 구현 가능
        }
    }
    
    // 간단히 한 라인이라도 완성 가능한지 스캔
    private func hasAnyMatchingLine() -> Bool {
        // (간단 스캔 구현: 모든 라인/대각선 체크)
        // 여기서는 예시로 완전 탐색
        let directions = [ (1,0), (0,1), (1,1), (1,-1), (-1,1), (0,-1), (-1,0), (-1,-1)]
        
        for r in 0..<boardRows {
            for c in 0..<boardCols {
                for (dr, dc) in directions {
                    var sumVal = 0
                    var tmps: [(Int,Int)] = []
                    
                    var nr = r, nc = c
                    // 길게 가보되, 보드 범위 내에서만 
                    while nr >= 0 && nr < boardRows && nc >= 0 && nc < boardCols {
                        sumVal += boardData[nr][nc] ?? 0
                        tmps.append((nr,nc))
                        if sumVal == targetSum && tmps.count >= 2 {
                            return true
                        }
                        nr += dr
                        nc += dc
                    }
                }
            }
        }
        return false
    }
    
    // MARK: - 힌트 버튼 처리
    private func onHintButtonTapped() {
        guard hintsLeft > 0 else {
            showToast("더 이상 힌트 사용 불가!")
            return
        }
        hintsLeft -= 1
        hintButton.text = "힌트(\(hintsLeft))"
        
        // 아주 간단한 힌트: 맨 처음 발견된 가능한 라인 하이라이트
        if let line = findAnyMatchingLine() {
            // 하이라이트
            for (r, c) in line {
                highlightCell(row: r, col: c, highlight: true, color: .yellow)
            }
            run(SKAction.sequence([
                SKAction.wait(forDuration: 1.5),
                SKAction.run {
                    for (r, c) in line {
                        self.highlightCell(row: r, col: c, highlight: false)
                    }
                }
            ]))
        } else {
            showToast("가능한 조합이 없어요!")
        }
    }
    private func findAnyMatchingLine() -> [(Int,Int)]? {
        let directions = [ (1,0), (0,1), (1,1), (1,-1), (-1,1), (0,-1), (-1,0), (-1,-1)]
        
        for r in 0..<boardRows {
            for c in 0..<boardCols {
                for (dr, dc) in directions {
                    var sumVal = 0
                    var tmps: [(Int,Int)] = []
                    
                    var nr = r, nc = c
                    while nr >= 0 && nr < boardRows && nc >= 0 && nc < boardCols {
                        sumVal += boardData[nr][nc] ?? 0
                        tmps.append((nr,nc))
                        if sumVal == targetSum && tmps.count >= 2 {
                            return tmps
                        }
                        nr += dr
                        nc += dc
                    }
                }
            }
        }
        return nil
    }
    
    // MARK: - 셀 찾기 & 하이라이트 등
    private func findCellRowCol(at point: CGPoint) -> (Int, Int)? {
        let nodesUnderPoint = nodes(at: point)
        if let cellNode = nodesUnderPoint.first(where: { $0.name?.starts(with: "cell_") == true }) {
            let nameComponents = cellNode.name!.components(separatedBy: "_")
            if nameComponents.count == 3 {
                if let row = Int(nameComponents[1]), let col = Int(nameComponents[2]) {
                    return (row, col)
                }
            }
        }
        return nil
    }
    
    private func highlightCell(row: Int, col: Int, highlight: Bool, color: UIColor = .orange) {
        if let shape = boardNode.childNode(withName: "cell_\(row)_\(col)") as? SKShapeNode {
            shape.strokeColor = highlight ? color : .black
            shape.lineWidth = highlight ? 3 : 1
        }
    }
    
    private func unhighlightAllDraggedCells() {
        for (r, c) in dragPositions {
            highlightCell(row: r, col: c, highlight: false)
        }
    }
    
    // MARK: - 플로팅 점수 & 토스트
    private func showFloatingScore(_ score: Int, endPos: (row: Int, col: Int)) {
        guard let cellNode = boardNode.childNode(withName: "cell_\(endPos.row)_\(endPos.col)") else { return }
        
        let label = SKLabelNode(fontNamed: "HelveticaNeue-Bold")
        label.text = "+\(score)"
        label.fontColor = .red
        label.fontSize = 24
        label.position = .zero
        label.zPosition = 100
        cellNode.addChild(label)
        
        let moveUp = SKAction.moveBy(x: 0, y: 50, duration: 1.0)
        let fadeOut = SKAction.fadeOut(withDuration: 0.5)
        let remove = SKAction.removeFromParent()
        let seq = SKAction.sequence([moveUp, fadeOut, remove])
        label.run(seq)
    }
    
    private func showToast(_ message: String) {
        let toastLabel = SKLabelNode(fontNamed: "HelveticaNeue")
        toastLabel.text = message
        toastLabel.fontSize = 18
        toastLabel.fontColor = .white
        toastLabel.position = CGPoint(x: size.width/2, y: size.height/2)
        toastLabel.zPosition = 1000
        
        let bgNode = SKShapeNode(rectOf: CGSize(width: toastLabel.frame.width + 40, height: toastLabel.frame.height + 20), cornerRadius: 10)
        bgNode.fillColor = .black
        bgNode.alpha = 0.8
        bgNode.position = toastLabel.position
        bgNode.zPosition = 999
        
        addChild(bgNode)
        addChild(toastLabel)
        
        let fadeIn = SKAction.fadeIn(withDuration: 0.2)
        let wait = SKAction.wait(forDuration: 1.5)
        let fadeOut = SKAction.fadeOut(withDuration: 0.5)
        let remove = SKAction.removeFromParent()
        let seq = SKAction.sequence([fadeIn, wait, fadeOut, remove])
        bgNode.run(seq)
        toastLabel.run(seq.copy() as! SKAction)
    }
    
    // MARK: - 타이머
    private func startTimer() {
        // 타이머 액션이 이미 있다면 제거
        removeAction(forKey: timerActionKey)
        
        let wait = SKAction.wait(forDuration: 1.0)
        let tick = SKAction.run {
            self.remainingSeconds -= 1
            if self.remainingSeconds <= 0 {
                // 타임아웃
                self.timerLabel.text = "0s"
                self.onTimeOver()
            } else {
                self.timerLabel.text = "\(self.remainingSeconds)s"
            }
        }
        let seq = SKAction.sequence([wait, tick])
        let repeatAction = SKAction.repeatForever(seq)
        
        run(repeatAction, withKey: timerActionKey)
    }
    
    private func onTimeOver() {
        removeAction(forKey: timerActionKey)
        showToast("시간 종료! 최종 점수: \(totalScore)")
        // 추가로 게임 종료 처리를 할 수 있음
    }
} 