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
                    
                }) {
                    Image(systemName: viewModel.isRecording ? "stop.fill" : "circle.fill")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 50, height: 50)
                }
                .padding()
                Button(action: {
                }) {
                    Image(systemName: "brain")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 50, height: 50)
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
