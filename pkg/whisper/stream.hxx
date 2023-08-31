#ifndef STREAM_H
#define STREAM_H

#include "common.h"
#include "common-sdl.h"
#include "whisper.h"
#include <cassert>
#include <cstdio>
#include <string>
#include <thread>
#include <vector>
#include <fstream>

struct whisper_params {
    // number of threads to use during computation
    int32_t n_threads  = std::min(4, (int32_t) std::thread::hardware_concurrency());
    // audio step size in milliseconds
    int32_t step_ms    = 3000;
    // audio length in milliseconds
    int32_t length_ms  = 10000;
    // audio to keep from previous step in ms
    int32_t keep_ms    = 200;
    // capture device ID
    int32_t capture_id = -1;
    // maximum number of tokens per audio chunk
    int32_t max_tokens = 32;
    // audio context size (0 - all)
    int32_t audio_ctx  = 0;

    // voice activity detection threshold
    float vad_thold    = 0.6f;
    // high-pass frequency cutoff
    float freq_thold   = 100.0f;

    // speed up audio by x2 (reduced accuracy)
    bool speed_up      = false;
    // translate from source language to english
    bool translate     = false;
    // do not use temperature fallback while decoding
    bool no_fallback   = false;
    // print special tokens
    bool print_special = false;
    // keep context between audio chunks
    bool no_context    = true;
    bool no_timestamps = false;

    // spoken language
    std::string language  = "en";
    // model path
    std::string model     = "models/ggml-base.en.bin";
    // text output file name
    std::string fname_out;
};

int whisper_stream(whisper_params params);

#endif