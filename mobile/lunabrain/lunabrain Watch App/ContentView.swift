import SwiftUI
import WatchConnectivity
import Combine

struct ContentView: View {
    @State private var isRecording = false

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
