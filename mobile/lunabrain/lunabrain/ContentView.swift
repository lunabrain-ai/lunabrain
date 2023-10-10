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
                if let res = viewModel.aiModel.text {
                    Text(res)
                        .contextMenu {
                            Button(action: {
                                UIPasteboard.general.string = res
                            }) {
                                Text("Copy")
                            }
                        }
                        .padding()
                    Button(action: {
                        let u = "sms:" + (viewModel.aiModel.phoneNumber ?? "") + "&body=" + (res.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "hello")
                        print(u)
                        if let url = URL(string: u) {
                            UIApplication.shared.open(url)
                        }
                    }) {
                        Image(systemName: "paperplane")
                    }
                }
                List(viewModel.transcriptionSegments.reversed(), id: \.self) { segment in
                    Text(segment)
                        .onTapGesture {
                            self.viewModel.liveTranscription = segment
                        }
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
                        if viewModel.isTranscribing {
                            viewModel.stopLiveTranscription()
                        } else {
                            viewModel.startLiveTranscription()
                        }
                    }) {
                        Image(systemName: viewModel.audioRecorder.isRecording ? "stop.fill" : "circle.fill")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 50, height: 50)
                    }
                    .padding()
                    Button(action: {
                        Task { await viewModel.aiModel.send(text: viewModel.liveTranscription) }
                    }) {
                        Image(systemName: "brain")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 50, height: 50)
                    }
                }
            }.tabItem {
                Label("Record", systemImage: "square.and.pencil").padding()
            }
            EditableListView().tabItem {
                Label("Markdown", systemImage: "list.dash").padding()
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
