import Combine
import Connect
import Dispatch
import os.log

class AIViewModel: ObservableObject {
    private let client: Protoflow_ProtoflowServiceClientInterface
    @Published var result: String? = nil

    init() {
        //let host = "http://192.168.1.88:8081"
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
    
    func send(text: String) async {
        let stream = self.client.infer(headers: [:], onResult: { result in
            switch result {
            case .headers(let headers):
                os_log(.debug, "infer headers: %@", headers)

            case .message(let message):
                os_log(.debug, "infer message: %@", String(describing: message))
                self.result = message.text

            case .complete(_, let error, let trailers):
                os_log(.debug, "infer completed with trailers: %@", trailers ?? [:])
                if let error = error {
                    os_log(.error, "infer error: %@", error.localizedDescription)
                } else {
                    os_log(.debug, "infer complete")
                }
            }
        })
        let request = Protoflow_InferRequest.with { $0.call = true; $0.text = [text] }
        do {
            try stream.send(request)
        } catch {
            print("failed to stream infer: \(error)")
        }
     }
}
