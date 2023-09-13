import SwiftUI
import WatchConnectivity
import Combine
import Speech

struct ContentView: View {
    @ObservedObject var viewModel: TranscriptionViewModel

    var body: some View {
        TabView {
            VStack {
                Text(viewModel.liveTranscription)
                    .padding()
                List(viewModel.transcriptionSegments, id: \.self) { segment in
                    Text(segment)
                        .contextMenu {
                            Button(action: {
                                UIPasteboard.general.string = segment
                            }) {
                                Text("Copy")
                            }
                        }
                }
                HStack {
                    Button(action: {
                        viewModel.isTranscribing ? viewModel.stopLiveTranscription() : viewModel.startLiveTranscription()
                    }, label: {
                        Text(viewModel.isTranscribing ? "Stop" : "Record")
                    })
                    .padding()
                }
            }.tabItem {
                Label("Record", systemImage: "square.and.pencil").padding()
            }
            RecordingsView().tabItem {
                Label("History", systemImage: "list.dash").padding()
            }
        }
    }
}


struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(viewModel: TranscriptionViewModel())
    }
}
