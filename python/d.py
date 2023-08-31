def split_audio():
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
