import sounddevice as sd
import vosk
import json
import os

def audio_to_text():
    model_path = os.path.abspath("model")
    model = vosk.Model(model_path)
    rec = vosk.KaldiRecognizer(model, 16000)

    def callback(indata, frames, time, status):
        if status:
            print(f"Status: {status}")  # Print status updates

        # Convert indata to bytes using bytes()
        data = bytes(indata)
        try:
            if rec.AcceptWaveform(data):
                result = rec.Result()
                print(json.loads(result)["text"])  # Print the recognized text
            else:
                partial_result = rec.PartialResult()
                print(json.loads(partial_result)["partial"])  # Print partial results
        except Exception as e:
            print(f"Error processing audio: {e}")

    with sd.RawInputStream(samplerate=16000, blocksize=8000, dtype='int16',
                           channels=1, callback=callback):
        print("Say something...")
        sd.sleep(10000)  # Record for 10 seconds

if __name__ == "__main__":
    audio_to_text()
