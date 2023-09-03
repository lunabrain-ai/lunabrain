#include "wrap_stream.hxx"
#include "stream.hxx"

int stream() {
    whisper_params params;
    return whisper_stream(params);
}