import sounddevice as sd
import vosk
import json
import os
from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Initialize the GPT-2 model and tokenizer
model_name = 'gpt2'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

def generate_response(text):
    inputs = tokenizer(text, return_tensors='pt')
    attention_mask = inputs['attention_mask']
    outputs = model.generate(
        inputs['input_ids'],
        max_length=100,
        num_return_sequences=1,
        pad_token_id=tokenizer.eos_token_id,
        attention_mask=attention_mask,
        temperature=0.7,  # Adjusting temperature for more coherent responses
        top_p=0.9,  # Using nucleus sampling to improve response quality
        do_sample=True  # Enable sampling
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

def text_to_speech(text, lang='en'):
    tts = gTTS(text=text, lang=lang)
    file_path = os.path.join(os.path.dirname(__file__), "output.mp3")
    tts.save(file_path)
    print(f"Saved TTS to {file_path}")
    audio = AudioSegment.from_mp3(file_path)
    play(audio)
    print(f"Played sound from {file_path}")

def audio_to_text():
    model_path = os.path.abspath("model")
    vosk_model = vosk.Model(model_path)
    rec = vosk.KaldiRecognizer(vosk_model, 16000)

    def callback(indata, frames, time, status):
        if status:
            print(f"Status: {status}")  # Print status updates

        # Convert indata to bytes using bytes()
        data = bytes(indata)
        try:
            if rec.AcceptWaveform(data):
                result = rec.Result()
                text = json.loads(result)["text"]  # Get the recognized text
                print("Recognized text:", text)
                response = generate_response(text)  # Generate response using LLM
                print("Response:", response)
                text_to_speech(response)  # Convert response to speech
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
