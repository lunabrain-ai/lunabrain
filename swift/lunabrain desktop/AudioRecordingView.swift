import Foundation
import SwiftUI

struct AudioRecordingView: View {
    @ObservedObject var recorder = AudioRecorder()

    var body: some View {
        VStack(spacing: 20) {
            if !recorder.isRecording {
                Button(action: {
                    self.recorder.startRecording()
                }) {
                    Text("Start Recording")
                        .padding()
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
            } else {
                Button(action: {
                    self.recorder.stopRecording(successful: true)
                }) {
                    Text("Stop Recording")
                        .padding()
                        .background(Color.red)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
            }
        }
    }
}

struct AudioRecordingView_Previews: PreviewProvider {
    static var previews: some View {
        AudioRecordingView()
    }
}
