import Foundation
import AVFoundation

struct Recording: Identifiable {
    var id = UUID()
    var fileURL: URL
    var createdAt: Date
}

class AudioRecorder: ObservableObject {
    var audioRecorder: AVAudioRecorder!
    @Published var recordings = [Recording]()
    
    func startRecording() {
        let recordingSession = AVAudioSession.sharedInstance()
        do {
            try recordingSession.setCategory(.playAndRecord, mode: .default)
            try recordingSession.setActive(true)
        } catch {
            // Handle error
        }
        
        let documentPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let audioFilename = documentPath.appendingPathComponent(UUID().uuidString + ".m4a")
        
        let settings = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 12000,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
        ]
        
        do {
            audioRecorder = try AVAudioRecorder(url: audioFilename, settings: settings)
            audioRecorder.record()
        } catch {
            // Handle error
        }
    }
    
    func stopRecording() {
        audioRecorder.stop()
        let recording = Recording(fileURL: audioRecorder.url, createdAt: Date())
        recordings.append(recording)
    }
    
    func fetchRecordings() {
        let documentPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        
        do {
            let urls = try FileManager.default.contentsOfDirectory(at: documentPath, includingPropertiesForKeys: nil, options: .skipsHiddenFiles)
            recordings = urls.filter({ $0.pathExtension == "m4a" }).map({ Recording(fileURL: $0, createdAt: FileManager.default.creationDate(atPath: $0.path) ?? Date()) })
        } catch {
            print("error fetching recordings")
        }
    }
    
    func playRecording(_ recording: Recording) {
        do {
            let audioPlayer = try AVAudioPlayer(contentsOf: recording.fileURL)
            audioPlayer.play()
        } catch {
            // Handle error
            print("Could not play recording: \(error)")
        }
    }
}

extension FileManager {
    func creationDate(atPath path: String) -> Date? {
        do {
            let attributes = try attributesOfItem(atPath: path)
            return attributes[.creationDate] as? Date
        } catch {
            return nil
        }
    }
}
