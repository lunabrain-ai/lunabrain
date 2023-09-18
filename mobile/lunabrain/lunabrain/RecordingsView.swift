import SwiftUI
import Foundation

struct RecordingsView: View {
    @StateObject var audioRecorder = AudioRecorder()
    @StateObject var player = RecordingPlayer()
    
    var body: some View {
        VStack {
            List {
                ForEach(audioRecorder.recordings.sorted(by: { $0.createdAt > $1.createdAt }) , id: \.id) { recording in
                    HStack {
                        Text("\(recording.createdAt)")
                        Spacer()
                        Button(action: {
                            if player.isPlaying && player.current?.id == recording.id {
                                player.stop()
                            } else {
                                player.play(with: recording)
                            }
                        }) {
                            Image(systemName: player.isPlaying && player.current?.id == recording.id ? "stop.circle" : "play.circle")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 30, height: 30)
                        }
                    }
                }
            }
            .onAppear(perform: {
                audioRecorder.fetchRecordings()
            })
        }
    }
}


struct RecordingsView_Previews: PreviewProvider {
    static var previews: some View {
        RecordingsView()
    }
}
