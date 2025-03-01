//
//  WebView.swift
//  SumOrDoneGame
//
//  Created by Young Jae Lee on 1/16/25.
//

import SwiftUI
import WebKit
import GameKit

// UIViewRepresentable: SwiftUI에서 UIKit의 UIView를 사용할 수 있게 해주는 프로토콜
struct WebView: UIViewRepresentable {
    // GameCenter 관련 기능을 관리하는 객체를 관찰 가능한 객체로 선언
    @ObservedObject var gameCenterManager: GameCenterManager
    
    // UIView(여기서는 WKWebView)를 생성하고 초기 설정하는 메서드
    func makeUIView(context: Context) -> WKWebView {
        // JavaScript와 Swift 간의 통신을 관리하는 컨트롤러
        let contentController = WKUserContentController()
        
        // JavaScript에서 호출할 수 있는 메시지 핸들러들을 등록
        contentController.add(context.coordinator, name: "hapticFeedback")
        contentController.add(context.coordinator, name: "submitScore")
        contentController.add(context.coordinator, name: "openModal")
        contentController.add(context.coordinator, name: "getGameCenterNickname")
        contentController.add(context.coordinator, name: "unlock10PointsAchievement")
        contentController.add(context.coordinator, name: "unlock1000PointsAchievement")
        contentController.add(context.coordinator, name: "showGameCenter")

        // WebView의 설정을 담당하는 객체
        let webViewConfig = WKWebViewConfiguration()
        // 로컬 파일 접근 권한 설정
        webViewConfig.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        webViewConfig.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
        webViewConfig.preferences.setValue(true, forKey: "developerExtrasEnabled")
        webViewConfig.websiteDataStore = WKWebsiteDataStore.nonPersistent()

        // ⬇️ 'contentController'를 WKWebViewConfiguration에 연결
        webViewConfig.userContentController = contentController

        // WKWebView 인스턴스 생성
        let webView = WKWebView(
            frame: .zero, 
            configuration: webViewConfig
        )

        // Coordinator에 webView 참조 설정
        context.coordinator.webView = webView

        // 파일 로드 시 반드시 디렉토리 접근 권한 부여
        if let htmlPath = Bundle.main.path(
            forResource: "index", 
            ofType: "html", 
            inDirectory: "SumOrDoneGame"
        ) {
            let url = URL(fileURLWithPath: htmlPath)
            let directoryURL = url.deletingLastPathComponent()
            webView.loadFileURL(url, allowingReadAccessTo: directoryURL)
        }

        return webView
    }

    // UIView가 업데이트될 때 호출되는 메서드
    func updateUIView(_ webView: WKWebView, context: Context) {
        if let path = Bundle.main.path(forResource: "index", ofType: "html") {
            let fileURL = URL(fileURLWithPath: path)
            // ⬇️ 로컬 파일 로드시 'allowingReadAccessTo'를 꼭 설정
            webView.loadFileURL(fileURL, allowingReadAccessTo: fileURL.deletingLastPathComponent())
        } else {
            print("index.html 파일을 찾을 수 없습니다.")
        }
    }

    // WebView와 JavaScript 간의 통신을 관리하는 Coordinator 생성
    func makeCoordinator() -> Coordinator {
        Coordinator(self, gameCenterManager: gameCenterManager)
    }

    // WebView와 JavaScript 간의 통신을 처리하는 Coordinator 클래스
    class Coordinator: NSObject, WKScriptMessageHandler {
        var parent: WebView
        var gameCenterManager: GameCenterManager
        var modalVC: UIViewController?
        var webView: WKWebView?
        
        init(_ parent: WebView, gameCenterManager: GameCenterManager) {
            self.parent = parent
            self.gameCenterManager = gameCenterManager
        }

        // JavaScript에서 보낸 메시지를 처리하는 메서드
        func userContentController(_ userContentController: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            if message.name == "hapticFeedback" {
                if let type = message.body as? String {
                    handleHapticFeedback(type: type)
                }
            } else if message.name == "submitScore" {
                if let body = message.body as? [String: Any],
                   let score = body["score"] as? Int {
                    gameCenterManager.submitScore(score)
                }
            } else if message.name == "openModal" {
                showNicknameChangeModal()
            } else if message.name == "getGameCenterNickname" {
                getGameCenterNickname { [weak self] nickname in
                    guard let webView = self?.webView else { return }
                    
                    let jsCallback: String
                    if let nickname = nickname {
                        jsCallback = "window.updateNicknameFromGameCenter('\(nickname)');"
                    } else {
                        jsCallback = "window.updateNicknameFromGameCenter(null);"
                    }
                    
                    DispatchQueue.main.async {
                        webView.evaluateJavaScript(jsCallback, completionHandler: nil)
                    }
                }
            } else if message.name == "unlock10PointsAchievement" {
                gameCenterManager.unlock10PointsAchievement()
            } else if message.name == "unlock1000PointsAchievement" {
                gameCenterManager.unlock1000PointsAchievement()
            } else if message.name == "showGameCenter" {
                showGameCenter()
            } else if message.name == "unlockIAPPointsAchievement" {
                print("unlockIAPPointsAchievement 메서드가 GameCenterManager에 없습니다.")
            }
        }

        // 햅틱 피드백을 처리하는 메서드
        func handleHapticFeedback(type: String) {
            switch type {
            case "selection":
                let generator = UIImpactFeedbackGenerator(style: .light)
                generator.prepare()
                generator.impactOccurred()
            case "success":
                let generator = UINotificationFeedbackGenerator()
                generator.prepare()
                generator.notificationOccurred(.success)
            case "done":
                let generator = UINotificationFeedbackGenerator()
                generator.prepare()
                generator.notificationOccurred(.success)
            default:
                break
            }
        }

        // 닉네임 변경 모달을 표시하는 메서드
        private func showNicknameChangeModal() {
            DispatchQueue.main.async {
                guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                      let rootViewController = windowScene.windows.first?.rootViewController else {
                    return
                }
                
                let modalVC = UIViewController()
                modalVC.view.backgroundColor = .white
                modalVC.modalPresentationStyle = .formSheet
                
                // 스크롤뷰 추가
                let scrollView = UIScrollView()
                scrollView.translatesAutoresizingMaskIntoConstraints = false
                modalVC.view.addSubview(scrollView)
                
                // 컨텐츠 컨테이너 뷰
                let containerView = UIView()
                containerView.translatesAutoresizingMaskIntoConstraints = false
                scrollView.addSubview(containerView)
                
                // 모달 UI 구성
                let titleLabel = UILabel()
                titleLabel.text = "Edit Nickname"
                titleLabel.font = UIFont.boldSystemFont(ofSize: 20)
                titleLabel.translatesAutoresizingMaskIntoConstraints = false
                
                let textField = UITextField()
                textField.placeholder = "New Nickname"
                textField.borderStyle = .roundedRect
                textField.autocapitalizationType = .words
                textField.returnKeyType = .done
                textField.translatesAutoresizingMaskIntoConstraints = false
                
                // 현재 닉네임 가져오기
                if let webView = self.webView {
                    webView.evaluateJavaScript("document.getElementById('nickname').textContent") { (result, error) in
                        if let currentNickname = result as? String {
                            DispatchQueue.main.async {
                                textField.text = currentNickname
                            }
                        }
                    }
                }
                
                let errorLabel = UILabel()
                errorLabel.textColor = .red
                errorLabel.isHidden = true
                errorLabel.translatesAutoresizingMaskIntoConstraints = false
                
                let buttonStack = UIStackView()
                buttonStack.axis = .horizontal
                buttonStack.spacing = 8
                buttonStack.distribution = .fillEqually
                buttonStack.translatesAutoresizingMaskIntoConstraints = false
                
                let saveButton = UIButton(type: .system)
                saveButton.setTitle("Save", for: .normal)
                saveButton.backgroundColor = .systemBlue
                saveButton.setTitleColor(.white, for: .normal)
                saveButton.layer.cornerRadius = 8
                
                let cancelButton = UIButton(type: .system)
                cancelButton.setTitle("Cancel", for: .normal)
                cancelButton.backgroundColor = .systemGray5
                cancelButton.layer.cornerRadius = 8
                
                buttonStack.addArrangedSubview(cancelButton)
                buttonStack.addArrangedSubview(saveButton)
                
                // 컨테이너에 뷰들 추가
                containerView.addSubview(titleLabel)
                containerView.addSubview(textField)
                containerView.addSubview(errorLabel)
                containerView.addSubview(buttonStack)
                
                // 키보드 툴바 추가
                let toolbar = UIToolbar()
                toolbar.sizeToFit()
                let flexSpace = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)
                let doneButton = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(self.dismissKeyboard))
                toolbar.items = [flexSpace, doneButton]
                textField.inputAccessoryView = toolbar
                
                // 오토레이아웃 설정
                NSLayoutConstraint.activate([
                    scrollView.topAnchor.constraint(equalTo: modalVC.view.topAnchor),
                    scrollView.leadingAnchor.constraint(equalTo: modalVC.view.leadingAnchor),
                    scrollView.trailingAnchor.constraint(equalTo: modalVC.view.trailingAnchor),
                    scrollView.bottomAnchor.constraint(equalTo: modalVC.view.bottomAnchor),
                    
                    containerView.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 20),
                    containerView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
                    containerView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
                    containerView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
                    containerView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
                    
                    titleLabel.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 20),
                    titleLabel.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
                    
                    textField.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 20),
                    textField.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 20),
                    textField.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -20),
                    
                    errorLabel.topAnchor.constraint(equalTo: textField.bottomAnchor, constant: 8),
                    errorLabel.leadingAnchor.constraint(equalTo: textField.leadingAnchor),
                    errorLabel.trailingAnchor.constraint(equalTo: textField.trailingAnchor),
                    
                    buttonStack.topAnchor.constraint(equalTo: errorLabel.bottomAnchor, constant: 20),
                    buttonStack.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 20),
                    buttonStack.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -20),
                    buttonStack.heightAnchor.constraint(equalToConstant: 44),
                    buttonStack.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: -20)
                ])
                
                // 키보드 노티피케이션 등록
                NotificationCenter.default.addObserver(modalVC, selector: #selector(self.keyboardWillShow),
                                                         name: UIResponder.keyboardWillShowNotification, object: nil)
                NotificationCenter.default.addObserver(modalVC, selector: #selector(self.keyboardWillHide),
                                                         name: UIResponder.keyboardWillHideNotification, object: nil)
                
                // 버튼 액션 설정
                saveButton.addTarget(self, action: #selector(self.saveNickname), for: .touchUpInside)
                cancelButton.addTarget(self, action: #selector(self.closeModal), for: .touchUpInside)
                
                self.modalVC = modalVC
                rootViewController.present(modalVC, animated: true)
            }
        }
        
        @objc private func dismissKeyboard() {
            modalVC?.view.endEditing(true)
        }
        
        @objc private func keyboardWillShow(notification: NSNotification) {
            guard let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue,
                  let scrollView = modalVC?.view.subviews.first(where: { $0 is UIScrollView }) as? UIScrollView else {
                return
            }
            
            let contentInsets = UIEdgeInsets(top: 0, left: 0, bottom: keyboardSize.height, right: 0)
            scrollView.contentInset = contentInsets
            scrollView.scrollIndicatorInsets = contentInsets
        }
        
        @objc private func keyboardWillHide(notification: NSNotification) {
            guard let scrollView = modalVC?.view.subviews.first(where: { $0 is UIScrollView }) as? UIScrollView else {
                return
            }
            
            scrollView.contentInset = .zero
            scrollView.scrollIndicatorInsets = .zero
        }

        @objc private func saveNickname() {
            guard let modalVC = modalVC,
                  let textField = modalVC.view.subviews.first(where: { $0 is UITextField }) as? UITextField,
                  let errorLabel = modalVC.view.subviews.first(where: { $0 is UILabel && ($0 as! UILabel).textColor == .red }) as? UILabel,
                  let newNickname = textField.text?.trimmingCharacters(in: .whitespacesAndNewlines) else {
                return
            }
            
            if newNickname.isEmpty {
                errorLabel.text = "닉네임을 입력해주세요."
                errorLabel.isHidden = false
                return
            }
            
            if newNickname.count > 10 {
                errorLabel.text = "닉네임은 10자 이내로 입력해주세요."
                errorLabel.isHidden = false
                return
            }
            
            // 새 닉네임 저장 로직
            UserDefaults.standard.set(newNickname, forKey: "customNickname")
            
            // 모달 닫기
            modalVC.dismiss(animated: true) {
                self.showAlert(title: "성공", message: "닉네임이 변경되었습니다.")
            }
        }
        
        private func showAlert(title: String, message: String) {
            guard let modalVC = modalVC else { return }
            
            let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "확인", style: .default))
            modalVC.present(alert, animated: true)
        }
        
        @objc private func closeModal() {
            modalVC?.dismiss(animated: true)
        }

        func getGameCenterNickname(completion: @escaping (String?) -> Void) {
            let localPlayer = GKLocalPlayer.local
            if localPlayer.isAuthenticated {
                completion(localPlayer.displayName)
            } else {
                completion(nil)
            }
        }

        private func showGameCenter() {
            let gameCenterVC = GKGameCenterViewController()
            gameCenterVC.gameCenterDelegate = self
            if let rootViewController = UIApplication.shared.windows.first?.rootViewController {
                rootViewController.present(gameCenterVC, animated: true)
            }
        }

        // GameCenter 인증 상태 체크 추가
        func checkGameCenterAuthentication() {
            GKLocalPlayer.local.authenticateHandler = { [weak self] (viewController, error) in
                guard let self = self else { return }
                
                if let error = error {
                    print("GameCenter Auth Error: \(error.localizedDescription)")
                    self.sendAuthStatusToWeb(isAuthenticated: false)
                    return
                }
                
                if let vc = viewController {
                    self.present(vc, animated: true)
                } else {
                    let isAuthenticated = GKLocalPlayer.local.isAuthenticated
                    self.sendAuthStatusToWeb(isAuthenticated: isAuthenticated)
                }
            }
        }

        private func sendAuthStatusToWeb(isAuthenticated: Bool) {
            let script = "handleGameCenterAuth(\(isAuthenticated))"
            webView.evaluateJavaScript(script) { _, error in
                if let error = error {
                    print("JavaScript 실행 오류: \(error.localizedDescription)")
                }
            }
        }
    }
}

// GameCenter 뷰컨트롤러 종료 처리를 위한 델리게이트
extension WebView.Coordinator: GKGameCenterControllerDelegate {
    func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}
