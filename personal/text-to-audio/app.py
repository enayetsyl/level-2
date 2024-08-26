import os
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from vosk import Model, KaldiRecognizer
from gtts import gTTS
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import wave
from pydub import AudioSegment

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Initialize the GPT-2 model and tokenizer
model_name = 'gpt2'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Initialize the Vosk model
model_path = os.path.abspath("model")
vosk_model = Model(model_path)

def generate_response(text):
    if not text:
        return "I didn't catch that. Could you please repeat?"
    inputs = tokenizer(text, return_tensors='pt')
    attention_mask = inputs['attention_mask']
    outputs = model.generate(
        inputs['input_ids'],
        max_length=100,
        num_return_sequences=1,
        pad_token_id=tokenizer.eos_token_id,
        attention_mask=attention_mask,
        temperature=0.7,
        top_p=0.9,
        do_sample=True
    )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

def text_to_speech(text, lang='en'):
    tts = gTTS(text=text, lang=lang)
    file_path = os.path.join(os.path.dirname(__file__), "output.mp3")
    tts.save(file_path)
    print(f"Saved TTS to {file_path}")
    return file_path

def convert_to_wav(file_path):
    audio = AudioSegment.from_file(file_path)
    wav_path = os.path.splitext(file_path)[0] + ".wav"
    audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
    audio.export(wav_path, format="wav")
    return wav_path

@app.route('/process_audio', methods=['POST'])
def process_audio():
    # Save the audio file from the request
    audio_file = request.files['audio']
    file_path = os.path.join(os.path.dirname(__file__), "input.wav")
    audio_file.save(file_path)
    
    # Debugging: Check file properties
    print(f"Uploaded file saved to {file_path}")
    print(f"File size: {os.path.getsize(file_path)} bytes")

    # Ensure the file is in WAV format
    try:
        wf = wave.open(file_path, "rb")
        print(f"File channels: {wf.getnchannels()}")
        print(f"File sample width: {wf.getsampwidth()}")
        print(f"File frame rate: {wf.getframerate()}")
        print(f"File number of frames: {wf.getnframes()}")
        wf.close()
    except wave.Error as e:
        print(f"Error opening wave file: {e}")
        return jsonify({'error': 'Invalid WAV file'}), 400

    # Convert the file to WAV format if necessary
    wav_path = convert_to_wav(file_path)

    # Process the audio file
    wf = wave.open(wav_path, "rb")
    rec = KaldiRecognizer(vosk_model, wf.getframerate())
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

    print(f"Recognized text: {recognized_text}")

    # Generate response using GPT-2
    response_text = generate_response(recognized_text.strip())

    print(f"Generated response: {response_text}")

    # Convert response to speech
    response_audio_path = text_to_speech(response_text)

    # Send the generated audio file back to the frontend
    return send_file(response_audio_path, mimetype='audio/mpeg')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
