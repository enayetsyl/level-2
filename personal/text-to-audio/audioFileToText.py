import os
import json
import wave
from vosk import Model, KaldiRecognizer
from pydub import AudioSegment

def convert_to_wav(file_path):
    audio = AudioSegment.from_file(file_path)
    wav_path = "converted_audio.wav"
    audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
    audio.export(wav_path, format="wav")
    return wav_path

def audio_file_to_text(file_path):
    # Convert the file to WAV format if necessary
    wav_path = convert_to_wav(file_path)

    model_path = os.path.abspath("model")
    model = Model(model_path)
    rec = KaldiRecognizer(model, 16000)

    # Open the audio file
    wf = wave.open(wav_path, "rb")

    recognized_text = ""
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            result = rec.Result()
            recognized_text += json.loads(result)["text"] + " "
    final_result = rec.FinalResult()
    recognized_text += json.loads(final_result)["text"]
    
    return recognized_text

if __name__ == "__main__":
    file_path = "uploads/recorded_audio.wav"  # Replace with your audio file path
    text = audio_file_to_text(file_path)
    print("Recognized text:", text)
