import Foundation
import Speech
import WatchConnectivity

class TranscriptionViewModel: NSObject, ObservableObject {
    @Published var transcriptionSegments: [String] {
        didSet {
            saveToUserDefaults()
        }
    }
    @Published var liveTranscription: String = ""
    @Published var isTranscribing: Bool = false
    
    private let speechRecognizer = SFSpeechRecognizer()
    private let audioEngine = AVAudioEngine()
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private var session: WCSession?

    private static let userDefaultsKey = "TranscriptionViewModel.transcriptionSegments"
    
    private static func loadFromUserDefaults() -> [String]? {
        guard let data = UserDefaults.standard.data(forKey: userDefaultsKey) else { return nil }
        
        do {
            let stringList = try JSONDecoder().decode([String].self, from: data)
            return stringList
        } catch {
            print("Failed to load string list from UserDefaults: \(error)")
            return nil
        }
    }
    
    private func saveToUserDefaults() {
        do {
            let data = try JSONEncoder().encode(self.transcriptionSegments)
            UserDefaults.standard.set(data, forKey: Self.userDefaultsKey)
        } catch {
            print("Failed to save string list to UserDefaults: \(error)")
        }
    }
    
    override init() {
        self.transcriptionSegments = Self.loadFromUserDefaults() ?? []

        super.init()
        
        SFSpeechRecognizer.requestAuthorization { (authStatus) in
            // Handle authorization status here
        }
        if WCSession.isSupported() {
            session = WCSession.default
            session?.delegate = self
            session?.activate()
        }
    }

    func startLiveTranscription() {
        do {
            try startSpeechRecognition()
        } catch {
            print("An error occurred: \(error.localizedDescription)")
        }
    }
    
    private func startSpeechRecognition() throws {
        let audioSession = AVAudioSession.sharedInstance()
        try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
        try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
        
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        
        let inputNode = audioEngine.inputNode
        
        guard let recognitionRequest = recognitionRequest else {
            fatalError("Unable to create a SFSpeechAudioBufferRecognitionRequest object")
        }
        
        self.isTranscribing = true
        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            if let result = result {
                self?.liveTranscription = result.bestTranscription.formattedString
                let messageDict = ["transcription": result.bestTranscription.formattedString]
                WCSession.default.transferUserInfo(messageDict)
                print("sent message")
                if result.isFinal && result.bestTranscription.formattedString != "" {
                    self?.transcriptionSegments.append(result.bestTranscription.formattedString)
                }
            } else if let error = error {
                print(error)
            }
        }
        
        let recordingFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { (buffer, _) in
            self.recognitionRequest?.append(buffer)
        }
        
        audioEngine.prepare()
        try audioEngine.start()
    }
    
    func stopLiveTranscription() {
        if self.liveTranscription != "" {
            self.transcriptionSegments.append(self.liveTranscription)
        }
        self.isTranscribing = false
        
        audioEngine.inputNode.removeTap(onBus: 0)
        recognitionRequest?.endAudio()
        recognitionRequest = nil
        recognitionTask?.cancel()
        recognitionTask = nil
        audioEngine.stop()

        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setActive(false)
        } catch {
            print("An error occurred while deactivating the audio session: \(error.localizedDescription)")
        }
    }
}

extension TranscriptionViewModel: WCSessionDelegate {
    func sessionDidBecomeInactive(_ session: WCSession) {
        print("inactivate")
    }
    
    func sessionDidDeactivate(_ session: WCSession) {
        print("deactivate")
    }
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        if activationState == .activated {
            let messageDict = ["message": "The iOS app has successfully connected!"]
            session.sendMessage(messageDict, replyHandler: { reply in
                print("Received reply: \(reply)")
            }, errorHandler: { error in
                print("Error sending message: \(error.localizedDescription)")
            })
        } else if let error = error {
            print("WCSession activation failed with error: \(error.localizedDescription)")
        }
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
        print(message)
        if let transcription = message["transcription"] as? String {
            DispatchQueue.main.async {
                self.liveTranscription = transcription
            }
        }
    }
}
