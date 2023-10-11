import Combine
import Connect
import Dispatch
import os.log

class AIViewModel: ObservableObject {
    private let client: Protoflow_ProtoflowServiceClientInterface
    @Published var phoneNumber: String? = nil
    @Published var text: String? = nil

    init() {
        //let host = "http://10.0.0.201:8081"
        let host = "https://demo.lunabrain.com"
        let protocolClient = ProtocolClient(
            httpClient: URLSessionHTTPClient(),
            config: ProtocolClientConfig(
                host: host,
                codec: JSONCodec()
            )
        )
        self.client = Protoflow_ProtoflowServiceClient(client: protocolClient)
    }
    
    func send(text: String) async -> String {
//        let req = Protoflow_AnalyzeConversationRequest.with { $0.text = text }
//        let res = await self.client.analyzeConversation(request: req, headers: [:])
//        if let err = res.error {
//            print("error analyzing conversation \(err)")
//            return "none"
//        }
//        if (res.message?.phoneNumbers.count)! > 0 {
//            self.phoneNumber = res.message?.phoneNumbers[0]
//        }
//        self.text = res.message?.summary
//        print("ai summary: \(res.message)")
        return "none"
    }
    
//    func send(text: String) async {
//        let stream = self.client.infer(headers: [:], onResult: { result in
//            switch result {
//            case .headers(let headers):
//                os_log(.debug, "infer headers: %@", headers)
//
//            case .message(let message):
//                os_log(.debug, "infer message: %@", message.text)
//                let split = message.text.components(separatedBy: " ")
//                self.phoneNumber = split[0].replacingOccurrences(of: "\n", with: "")
//                self.text = split.dropFirst().joined(separator: " ")
//                print("phone: \(self.phoneNumber) text: \(self.text)")
//
//            case .complete(_, let error, let trailers):
//                os_log(.debug, "infer completed with trailers: %@", trailers ?? [:])
//                if let error = error {
//                    os_log(.error, "infer error: %@", error.localizedDescription)
//                } else {
//                    os_log(.debug, "infer complete")
//                }
//            }
//        })
//        let request = Protoflow_InferRequest.with { $0.call = true; $0.text = [text] }
//        do {
//            try stream.send(request)
//        } catch {
//            print("failed to stream infer: \(error)")
//        }
//     }
}
