import SwiftUI
import WatchConnectivity
import Combine
import Speech

class TranscriptionViewModel: NSObject, ObservableObject, WCSessionDelegate {
    func sessionDidBecomeInactive(_ session: WCSession) {
        print("inactivate")
    }
    
    func sessionDidDeactivate(_ session: WCSession) {
        print("deactivate")
    }
    
    @Published var transcriptionSegments: [String] = []
    @Published var liveTranscription: String = ""
    
    private let speechRecognizer = SFSpeechRecognizer()
    private let audioEngine = AVAudioEngine()
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private var session: WCSession?
    
    override init() {
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
            // Handle errors here
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
        
        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            if let result = result {
                self?.liveTranscription = result.bestTranscription.formattedString
                let messageDict = ["transcription": result.bestTranscription.formattedString]
                WCSession.default.sendMessage(messageDict, replyHandler: nil, errorHandler: {error in
                    print(error)
                })
                print("sent message")
                if result.isFinal {
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
        audioEngine.stop()
        recognitionRequest?.endAudio()
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
        if let transcription = message["transcription"] as? String {
            DispatchQueue.main.async {
                self.liveTranscription = transcription
            }
        }
    }
    
    // ... other WCSessionDelegate methods
}

struct ContentView: View {
    @ObservedObject var viewModel: TranscriptionViewModel

    var body: some View {
        VStack {
            Text("Live Transcription")
                .font(.largeTitle)
            Text(viewModel.liveTranscription)
                .padding()
            List(viewModel.transcriptionSegments, id: \.self) { segment in
                Text(segment)
            }
            HStack {
                Button(action: {
                    viewModel.startLiveTranscription()
                }, label: {
                    Text("Start Transcription")
                })
                .padding()
                
                Button(action: {
                    viewModel.stopLiveTranscription()
                }, label: {
                    Text("Stop Transcription")
                })
                .padding()
            }
        }
    }
}


struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(viewModel: TranscriptionViewModel())
    }
}
