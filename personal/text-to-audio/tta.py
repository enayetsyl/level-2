from gtts import gTTS
from playsound import playsound
import os

def text_to_speech(text, lang='en'):
    tts = gTTS(text=text, lang=lang)
    tts.save("output.mp3")
    playsound("output.mp3")

if __name__ == "__main__":
    text_to_speech("Hello, Tell me about python")
