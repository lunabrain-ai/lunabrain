package whisper

import (
	"fmt"
	"github.com/go-audio/wav"
	"github.com/hajimehoshi/go-mp3"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/pkg/errors"
	"io"
	"math"
	"os"
	"path"
)

func splitWAVFile(fileStore *bucket.Bucket, id string, filepath string, maxFileSize int, cb func(string) error) error {
	// average header size plus some padding
	// TODO breadchris figure out how to calculate this
	headerSize := 44 + 1024
	file, err := os.Open(filepath)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := wav.NewDecoder(file)

	buf, err := decoder.FullPCMBuffer()
	if err != nil {
		return err
	}

	frameCount := buf.NumFrames()
	sampleSize := (buf.SourceBitDepth / 8) * buf.Format.NumChannels
	maxSamplesPerChunk := (maxFileSize - headerSize) / sampleSize

	chunks := int(math.Ceil(float64(frameCount) / float64(maxSamplesPerChunk)))

	d, err := fileStore.NewDir(id + "_chunks")
	if err != nil {
		return errors.Wrapf(err, "failed to create bucket dir for file %s", filepath)
	}

	for i := 0; i < chunks; i++ {
		start := i * maxSamplesPerChunk
		end := start + maxSamplesPerChunk
		if end > frameCount {
			end = frameCount
		}

		bucketFile := path.Join(d, fmt.Sprintf("chunk_%d.wav", i))
		outFile, err := os.Create(bucketFile)
		if err != nil {
			return errors.Wrapf(err, "failed to create file")
		}

		enc := wav.NewEncoder(outFile, buf.Format.SampleRate, buf.SourceBitDepth, buf.Format.NumChannels, 1)

		// take a slice of the audio buffer for the chunk
		b := buf.Clone().AsIntBuffer()
		b.Data = buf.Data[start*buf.Format.NumChannels : end*buf.Format.NumChannels]

		err = enc.Write(b)
		if err != nil {
			return err
		}

		if err := enc.Close(); err != nil {
			return err
		}

		err = cb(bucketFile)
		if err != nil {
			return err
		}
	}
	return nil
}

func splitMP3File(fileStore *bucket.Bucket, id string, filepath string, maxFileSize int, cb func(string) error) error {
	const headerSize = 128 // approximate header size (in bytes), adjust as necessary
	file, err := os.Open(filepath)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder, err := mp3.NewDecoder(file)
	if err != nil {
		return err
	}

	frameCount := int(decoder.Length())
	channelNum := 1              // assuming stereo, adjust as necessary
	sampleSize := 2 * channelNum // 16-bit stereo
	maxSamplesPerChunk := (maxFileSize - headerSize) / sampleSize

	chunks := int(math.Ceil(float64(frameCount) / float64(maxSamplesPerChunk)))

	d, err := fileStore.NewDir(id + "_chunks")
	if err != nil {
		return errors.Wrapf(err, "failed to create bucket dir for file %s", filepath)
	}

	buf := make([]byte, maxSamplesPerChunk*sampleSize)
	for i := 0; i < chunks; i++ {
		start := i * maxSamplesPerChunk * sampleSize
		end := start + maxSamplesPerChunk*sampleSize
		if end > frameCount {
			end = frameCount
		}

		bucketFile := path.Join(d, fmt.Sprintf("chunk_%d.mp3", i))
		outFile, err := os.Create(bucketFile)
		if err != nil {
			return errors.Wrapf(err, "failed to create file")
		}

		// Calculate how much data to read based on start and end
		readSize := end - start
		if readSize > len(buf) {
			readSize = len(buf)
		}

		// Read data from the decoder
		n, err := decoder.Read(buf[:readSize])
		if n > 0 {
			// Write data to the output file
			if _, err := outFile.Write(buf[:n]); err != nil {
				return err
			}
		}

		if err != nil {
			if err == io.EOF {
				break
			}
			return err
		}

		// Close the output file
		if err := outFile.Close(); err != nil {
			return err
		}

		// Callback with the output file path
		err = cb(bucketFile)
		if err != nil {
			return err
		}
	}
	return nil
}
