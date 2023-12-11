package normalize

import (
	ffmpeg "github.com/u2takey/ffmpeg-go"
)

func cutVideoSection(inputFile, outputFile string, startTime, duration int) error {
	return ffmpeg.Input(inputFile, ffmpeg.KwArgs{"ss": startTime}).
		Output(outputFile, ffmpeg.KwArgs{"t": duration}).
		OverWriteOutput().
		Run()
}
