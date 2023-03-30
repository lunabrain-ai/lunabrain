from concurrent import futures
import ffmpeg
import numpy as np
from pyannote.audio import Pipeline

import python_pb2
from python_pb2_grpc import PythonServicer
import python_pb2_grpc

from langchain.chains.summarize import load_summarize_chain
from langchain.llms import OpenAI
from langchain.docstore.document import Document
import os
import grpc
import wave
import whisper

from speechbrain.pretrained import SepformerSeparation as separator
import torchaudio

llm = OpenAI(temperature=0.9)

model = whisper.load_model("base.en")
sep_model = separator.from_hparams(source="speechbrain/resepformer-wsj02mix", savedir='pretrained_models/resepformer-wsj02mix')
enhance_model = separator.from_hparams(source="speechbrain/sepformer-wham16k-enhancement", savedir='pretrained_models/sepformer-wham16k-enhancement')
enhance_model_8k = separator.from_hparams(source="speechbrain/sepformer-wham-enhancement", savedir='pretrained_models/sepformer-wham-enhancement')


# Check if environment variable HUGGING_FACE_API_KEY is set
# If not, throw an error
# If so, set the environment variable to HUGGING_FACE_API_KEY
# This is required for the summarizer to work
if "HUGGING_FACE_API_KEY" not in os.environ:
    raise Exception("Please set the environment variable HUGGING_FACE_API_KEY to your Hugging Face API key")

HUGGING_FACE_API_KEY = os.environ["HUGGING_FACE_API_KEY"]

pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization",
                                    use_auth_token=HUGGING_FACE_API_KEY)
# hard-coded audio hyperparameters
SAMPLE_RATE = 16000


def load_audio_slice(file: str, start_time: float, end_time: float):
    """
    Open an audio file and read as mono waveform, resampling as necessary
    Parameters
    ----------
    file: str
        The audio file to open
    start_time: float
        The start time of the audio to extract, in seconds
    end_time: float
        The end time of the audio to extract, in seconds
    sr: int
        The sample rate to resample the audio if necessary
    Returns
    -------
    A NumPy array containing the audio waveform, in float32 dtype.
    """
    start_time = max(start_time, 0)
    end_time = max(end_time, 0)

    if end_time <= start_time:
        raise ValueError(f"end_time ({end_time}) must be greater than start_time ({start_time})")

    try:
        # This launches a subprocess to decode audio while down-mixing and resampling as necessary.
        # Requires the ffmpeg CLI and `ffmpeg-python` package to be installed.
        out, _ = (
            ffmpeg.input(file, ss=start_time - 0.05, to=end_time + 0.05, threads=0)
            .output("-", format="s16le", acodec="pcm_s16le", ac=1, ar=SAMPLE_RATE)
            .run(cmd=["ffmpeg", "-nostdin"], capture_stdout=True, capture_stderr=True)
        )
    except ffmpeg.Error as e:
        raise RuntimeError(f"Failed to load audio: {e.stderr.decode()}") from e

    return out


class PythonService(PythonServicer):
    def Transcribe(self, req: python_pb2.TranscribeRequest, context):
        # TODO: Add a flow that doesn't include Diarization.
        # It's in the proto already but I don't know how to regen the files.
        print(f"Transcribing {req.file}")

        enhanced_est_sources = enhance_model.separate_file(path=req.file)
        torchaudio.save(f"temp-output3/enhanced16k_source1hat.wav", enhanced_est_sources[:, :, 0].detach().cpu(), 16000)
        # torchaudio.save(f"temp-output/enhanced16k_source2hat.wav", enhanced_est_sources[:, :, 1].detach().cpu(), 16000)

        print("Enhanced sources")

        est_sources = sep_model.separate_file(path=f"temp-output3/enhanced16k_source1hat.wav")

        # diarization = pipeline(req.file)

        chunk_num = 0

        results = []

        # print(est_sources)
        # print(est_sources[:, :, 0])

        torchaudio.save(f"temp-output3/source1hat.wav", est_sources[:, :, 0].detach().cpu(), 8000)
        torchaudio.save(f"temp-output3/source2hat.wav", est_sources[:, :, 1].detach().cpu(), 8000)
        # torchaudio.save(f"temp-output/source3hat.wav", est_sources[:, :, 2].detach().cpu(), 16000)
        print(f"done processing {req.file}")

        # enhanced_sep_sources1 = enhance_model.separate_file(path=f"temp-output3/source1hat.wav")
        # torchaudio.save(f"temp-output3/enhanced16k_source1hat_sep.wav", enhanced_sep_sources1[:, :, 0].detach().cpu(), 16000)
        # enhanced_sep_sources2 = enhance_model.separate_file(path=f"temp-output3/source2hat.wav")
        # torchaudio.save(f"temp-output3/enhanced16k_source2hat_sep.wav", enhanced_sep_sources2[:, :, 0].detach().cpu(), 16000)

        # for output in est_sources:
        #     print(f"Speaker {speaker} speaks between t={turn.start:.1f}s and t={turn.end:.1f}s")
        #
        #     try:
        #         # Split chunk out of the file
        #         audio_slice = load_audio_slice(req.file, turn.start, turn.end)
        #     except Exception as e:
        #         print(f"Failed to load audio slice: {e}")
        #         raise e
        #
        #     print(f"Loaded {len(audio_slice)} samples")
        #
        #     slice_file_path = f"temp-output/{req.file.replace('/', '_')}_{chunk_num}_{speaker}.wav"
        #
        #     # Open the output WAV file
        #     with wave.open(slice_file_path, "wb") as f:
        #         # Set the WAV file parameters
        #         f.setnchannels(1)
        #         f.setsampwidth(2)
        #         f.setframerate(SAMPLE_RATE)
        #
        #         # Write the audio to the output file
        #         f.writeframes(audio_slice)
        #         print(f"Saved {slice_file_path} ({len(audio_slice)} samples)")
        #
        #     result = model.transcribe(slice_file_path)
        #
        #     print(f"Transcription: {result['text']}")
        #
        #     chunk_num += 1
        #
        #     results.append(f"{speaker}: {result['text']}")

        concat_results = "\n".join(results)

        return python_pb2.TranscribeResponse(transcription=concat_results)

    def Summarize(self, req: python_pb2.SummarizeRequest, context):
        chain = load_summarize_chain(llm, chain_type="map_reduce")
        doc = Document(page_content=req.content)
        result = chain.run([doc])
        return python_pb2.SummarizeResponse(summary=result)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    python_pb2_grpc.add_PythonServicer_to_server(
        PythonService(), server)
    server.add_insecure_port('[::]:50051')
    print("Server started on port 50051")
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
