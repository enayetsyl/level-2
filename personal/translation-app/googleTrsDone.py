from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

app = Flask(__name__)
CORS(app)  # Enable CORS

def translate_to_bengali(sentences):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    translations = []
    for sentence in sentences:
        driver.get("https://translate.google.com/?sl=en&tl=bn&op=translate")
        time.sleep(2)
        input_box = driver.find_element(By.CSS_SELECTOR, 'textarea[aria-label="Source text"]')
        input_box.clear()
        input_box.send_keys(sentence)
        time.sleep(2)
        try:
            translated_text = driver.find_element(By.CSS_SELECTOR, 'span[jsname="W297wb"]').text
        except:
            translated_text = "Translation not found"
        translations.append(translated_text)
        print(f"Translated: '{sentence}' to '{translated_text}'")
        time.sleep(2)

    driver.quit()
    return translations

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    sentences = data['sentences']
    print(f"Received sentences: {sentences}")
    translations = translate_to_bengali(sentences)
    print(f"Translations: {translations}")
    return jsonify(translations=translations)

if __name__ == '__main__':
    app.run(debug=True)
