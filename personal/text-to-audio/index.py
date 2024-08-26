import os
import json
import wave
from flask import Flask, request, jsonify
from flask_cors import CORS
from vosk import Model, KaldiRecognizer

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Folder to save the audio files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize the Vosk model
model_path = os.path.abspath("model")
vosk_model = Model(model_path)

@app.route('/save_audio', methods=['POST'])
def save_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file in the request'}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    audio_file.save(file_path)
    print(f'Saved audio file to {file_path}')

    # Process the audio file
    wf = wave.open(file_path, "rb")
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
        print("Audio format is not correct")
        return jsonify({'error': 'Audio format is not correct'}), 400

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

    return jsonify({'message': 'Audio file saved', 'file_path': file_path, 'recognized_text': recognized_text}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
