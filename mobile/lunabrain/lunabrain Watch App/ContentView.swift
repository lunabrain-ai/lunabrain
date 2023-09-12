import SwiftUI
import WatchConnectivity
import Combine

class WatchTranscriptionViewModel: NSObject, ObservableObject, WCSessionDelegate {
    @Published var liveTranscription: String = ""
    
    private var session: WCSession?
    
    override init() {
        super.init()
        if WCSession.isSupported() {
            session = WCSession.default
            session?.delegate = self
            session?.activate()
        }
    }
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        print(error)
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
        print(message)
        if let transcription = message["transcription"] as? String {
            DispatchQueue.main.async {
                self.liveTranscription = transcription
            }
        }
    }
    
    // ... other WCSessionDelegate methods
}

struct ContentView: View {
    @ObservedObject var viewModel = WatchTranscriptionViewModel()
    
    var body: some View {
        VStack {
            Text("Live Transcription")
                .font(.headline)
            ScrollView {
                Text(viewModel.liveTranscription)
                    .padding()
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
