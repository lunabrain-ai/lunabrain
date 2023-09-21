import Foundation
import WatchConnectivity

class WatchTranscriptionViewModel: NSObject, ObservableObject {
    @Published var liveTranscription: String = ""
    @Published var isRecording: Bool = false
    
    private var session: WCSession?
    
    override init() {
        super.init()
        if WCSession.isSupported() {
            session = WCSession.default
            session?.delegate = self
            session?.activate()
        }
    }
    
    func startRecording() {
        print("start recording")
        let messageDict = ["recording": true]
        WCSession.default.transferUserInfo(messageDict)
    }
    
    func stopRecording() {
        print("stop recording")
        let messageDict = ["recording": false]
        WCSession.default.transferUserInfo(messageDict)
    }
    
    func askAI() {
        let messageDict = ["ai": "conversation"]
        WCSession.default.transferUserInfo(messageDict)
    }
}

extension WatchTranscriptionViewModel: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if let error = error {
            // Error handring if need
            print(error.localizedDescription)
        } else {
            print("The session has completed activation.")
        }
    }
    
    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any] = [:]) {
        if let recording = userInfo["recording"] as? Bool {
            self.isRecording = recording;
        }
        if let data = userInfo["transcription"] as? String {
            self.liveTranscription = data;
        }
        if let data = userInfo["summary"] as? String {
            self.liveTranscription = data;
        }
    }
}
