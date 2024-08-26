from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

app = Flask(__name__)
CORS(app)  # Enable CORS

def find_element_with_retries(driver, by, value, retries=5, delay=1):
    for i in range(retries):
        try:
            element = driver.find_element(by, value)
            return element
        except Exception as e:
            if i < retries - 1:
                time.sleep(delay)
            else:
                raise e

def translate_to_bengali_quillbot(sentences):
    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.headless = False
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    driver.get("https://quillbot.com/translate")
    time.sleep(5)  # Wait for the page to fully load

    translations = []
    
    try:
        output_lang_button = find_element_with_retries(driver, By.XPATH, "(//button[@class='MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-1uayg5t'])[2]")
        output_lang_button.click()
        time.sleep(1)
        bengali_button = find_element_with_retries(driver, By.XPATH, "//li[@value='TSTOOL-LP-BENGALI-1696404055791']")
        bengali_button.click()
        time.sleep(1)
    except Exception as e:
        print(f"Error selecting output language: {e}")
        driver.quit()
        return []

    for sentence in sentences:
        try:
            input_box = find_element_with_retries(driver, By.ID, 'translate-input-box')
            input_box.clear()
            input_box.send_keys(sentence)
            time.sleep(1)
        except Exception as e:
            print(f"Error entering text: {e}")
            continue
        
        try:
            translate_button = find_element_with_retries(driver, By.XPATH, "//button[@type='button' and .//span[text()='Translate']]")
            translate_button.click()
            time.sleep(2)  # Wait for the translation to complete
        except Exception as e:
            print(f"Error clicking translate button: {e}")
            continue
        
        try:
            translated_text = find_element_with_retries(driver, By.CSS_SELECTOR, 'span[id^="output-sentence"]').text
        except Exception as e:
            translated_text = "Translation not found"
            print(f"Error fetching translated text: {e}")
        translations.append(translated_text)
        print(f"Translated: '{sentence}' to '{translated_text}'")
        time.sleep(1)

    driver.quit()
    return translations

def translate_to_bengali_google(sentences):
    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.headless = False

   
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

    quillbot_translations = translate_to_bengali_quillbot(sentences)
    google_translations = translate_to_bengali_google(sentences)

    translations = {
        'quillbot': quillbot_translations,
        'google': google_translations
    }
    print(f"Translations: {translations}")
    return jsonify(translations=translations)

if __name__ == '__main__':
    app.run(debug=True)
