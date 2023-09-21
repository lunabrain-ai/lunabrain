import SwiftUI
import WatchConnectivity
import Combine

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
            HStack {
                Button(action: {
                    if viewModel.isRecording {
                        viewModel.stopRecording()
                    } else {
                        viewModel.startRecording()
                    }
                }) {
                    Image(systemName: viewModel.isRecording ? "stop.fill" : "circle.fill")
                }
                .padding()
                Button(action: {
                    viewModel.askAI()
                }) {
                    Image(systemName: "brain")
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
