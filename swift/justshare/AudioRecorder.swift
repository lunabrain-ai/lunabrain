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
    @Published var isRecording = false
    
    func startRecording() {
        let recordingSession = AVAudioSession.sharedInstance()
        do {
            try recordingSession.setCategory(.playAndRecord, mode: .default)
            try recordingSession.setActive(true)
        } catch {
            print("Could not set active: \(error)")
            return
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
            print("Could not record: \(error)")
            return
        }
        isRecording = true
    }
    
    func stopRecording() {
        audioRecorder.stop()
        isRecording = false
        
        let recording = Recording(fileURL: audioRecorder.url, createdAt: Date())
        recordings.append(recording)
    }
    
    func fetchRecordings() {
        let documentPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        
        do {
            let urls = try FileManager.default.contentsOfDirectory(at: documentPath, includingPropertiesForKeys: nil, options: .skipsHiddenFiles)
            recordings = urls.filter({ $0.pathExtension == "m4a" }).map({ Recording(fileURL: $0, createdAt: FileManager.default.creationDate(atPath: $0.path) ?? Date()) })
        } catch {
            print("error fetching recordings: \(error)")
        }
    }
}

class RecordingPlayer: NSObject, AVAudioPlayerDelegate, ObservableObject {
    @Published var isPlaying: Bool = false
    @Published var current: Recording? = nil
    
    var audioPlayer: AVAudioPlayer?

    override init() {
        super.init()
    }
    
    func play(with recording: Recording) {
        if audioPlayer != nil {
            audioPlayer?.stop()
            audioPlayer = nil
        }
        do {
            try AVAudioSession.sharedInstance().setCategory(.playAndRecord, mode: .default, options: [.allowBluetooth, .defaultToSpeaker])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to setup audio: \(error)")
        }
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: recording.fileURL)
            audioPlayer?.delegate = self
            audioPlayer?.prepareToPlay()
        } catch {
            print("Error setting up audio player: \(error)")
        }
        current = recording

        audioPlayer?.play()
        isPlaying = true
    }
    
    func stop() {
        audioPlayer?.stop()
        reset()
    }
    
    func reset() {
        isPlaying = false
        audioPlayer = nil
        current = nil
    }
    
    // MARK: - AVAudioPlayerDelegate Methods
    
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        print("Audio player finished playing")
        reset()
    }
    
    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        if let error = error {
            print("Audio player decode error: \(error)")
        } else {
            print("Audio player decode error: unknown error")
        }
        reset()
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
