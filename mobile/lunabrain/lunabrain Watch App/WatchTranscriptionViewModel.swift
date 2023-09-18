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
        let messageDict = ["recording": true]
        WCSession.default.transferUserInfo(messageDict)
        isRecording = true
    }
    
    func stopRecording() {
        let messageDict = ["recording": false]
        WCSession.default.transferUserInfo(messageDict)
        isRecording = false
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
        let data = userInfo["transcription"]
        self.liveTranscription = data as! String;
    }
}
