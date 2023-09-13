import SwiftUI
import Foundation

struct RecordingsView: View {
    @StateObject var audioRecorder = AudioRecorder()
    
    var body: some View {
        VStack {
            Button(action: {
                if audioRecorder.audioRecorder == nil {
                    audioRecorder.startRecording()
                } else {
                    audioRecorder.stopRecording()
                }
            }) {
                Image(systemName: audioRecorder.audioRecorder == nil ? "circle.fill" : "stop.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 50, height: 50)
            }
            .padding()
            
            List {
                ForEach(audioRecorder.recordings, id: \.id) { recording in
                    HStack {
                        Text(recording.fileURL.lastPathComponent)
                        Spacer()
                        Text("\(recording.createdAt)")
                        Spacer()
                        Button(action: {
                            audioRecorder.playRecording(recording)
                        }) {
                            Image(systemName: "play.circle")
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
