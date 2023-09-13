package whisper

import (
	"encoding/binary"
	"fmt"
	"github.com/pkg/errors"
	"io"
	"os"
	"path"
)

type WAVHeader struct {
	RiffID        [4]byte
	RiffSize      uint32
	WaveID        [4]byte
	FmtID         [4]byte
	FmtSize       uint32
	AudioFormat   uint16
	NumChannels   uint16
	SampleRate    uint32
	ByteRate      uint32
	BlockAlign    uint16
	BitsPerSample uint16
	DataID        [4]byte
	DataSize      uint32
}

func (a *Client) splitWAVFile(id string, chunks int, filePath string, cb func(string) error) error {
	file, err := os.Open(filePath)
	if err != nil {
		return errors.Wrapf(err, "failed to open file %s", filePath)
	}
	defer file.Close()

	var header WAVHeader
	err = binary.Read(file, binary.LittleEndian, &header)
	if err != nil {
		return errors.Wrapf(err, "failed to read header for file %s", filePath)
	}

	// Calculate bytes per sample and samples per chunk
	bytesPerSample := int(header.BlockAlign)
	samplesPerChunk := chunks / bytesPerSample

	buffer := make([]byte, bytesPerSample*samplesPerChunk)

	// TODO breadchris need to cleanup the filestore api
	// try the builder pattern?
	d, err := a.fileStore.NewDir(id + "_chunks")
	if err != nil {
		return errors.Wrapf(err, "failed to create bucket dir for file %s", filePath)
	}

	chunkCounter := 0
	for {
		n, err := file.Read(buffer)
		if err == io.EOF {
			break
		} else if err != nil {
			return errors.Wrapf(err, "failed to read file %s", filePath)
		}

		bucketFile := path.Join(d, fmt.Sprintf("chunk_%d.wav", chunkCounter))
		outputFile, err := os.Create(bucketFile)
		if err != nil {
			return errors.Wrapf(err, "failed to create file")
		}

		header.DataSize = uint32(n)
		err = binary.Write(outputFile, binary.LittleEndian, &header)
		if err != nil {
			outputFile.Close()
			return err
		}

		_, err = outputFile.Write(buffer[:n])
		if err != nil {
			outputFile.Close()
			return err
		}
		outputFile.Close()

		err = cb(bucketFile)
		if err != nil {
			return err
		}

		chunkCounter++
	}
	return nil
}
