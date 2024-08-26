
Aisha loved playing with her toy blocks. She built tall towers and castles.

One day, Aisha saw a shiny mobile phone on the table. She was curious.

Aisha picked up the phone and started tapping the screen.

Hours passed, and Aisha didn't play with her toys or go outside.

Her eyes felt tired, and her head started to hurt.

Mama noticed and said, "Too much mobile isn't good for you, Aisha."

Aisha asked, "Why, Mama?"

Mama explained, "It can hurt your eyes and stop you from having fun."

Aisha put the mobile down and asked, "What can I do instead?"

Mama said, "Let's do some fun things at home!"

They painted colorful pictures together.

Then, they made a yummy fruit salad.

Aisha helped Mama bake delicious cookies.

They built a cozy fort with blankets and pillows.

Aisha played with her toy cars, zooming them around.

They did a fun puzzle with animal shapes.

Mama said, "See, there are many fun things to do without a mobile."

Aisha hugged Mama and said, "Thank you, Mama."

That night, Aisha slept soundly, dreaming of more home adventures.

Aisha learned that real adventures are more fun than any screen!



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


i want to modify the above code. instead of google translate i want to use https://quillbot.com/translate

make sure to headless false so that i can see what is going on. 

use following for selector

<span id="input-sentence~0" style="background-color: rgb(233, 242, 255);">Hello World</span>

<span class="MuiTypography-root MuiTypography-p2 css-138gj6y" id="output-sentence~0">হ্যালো ওয়ার্ল্ড</span>

<button class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-1uayg5t" tabindex="0" type="button">Bengali<span class="MuiButton-endIcon MuiButton-iconSizeMedium css-pt151d"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-p6nd68" focusable="false" aria-hidden="true" viewBox="0 0 24 24" type="chevronDown"><path d="M12 14.95c-.133 0-.258-.02-.375-.063a.877.877 0 0 1-.325-.212L6.675 10.05a.892.892 0 0 1-.262-.687.977.977 0 0 1 .287-.688.948.948 0 0 1 .7-.275c.283 0 .517.092.7.275l3.9 3.9 3.925-3.925a.892.892 0 0 1 .688-.262.977.977 0 0 1 .687.287.948.948 0 0 1 .275.7.948.948 0 0 1-.275.7l-4.6 4.6c-.1.1-.208.17-.325.212a1.106 1.106 0 0 1-.375.063Z"></path></svg></span><span class="MuiTouchRipple-root css-w0pj6f"></span></button>


<div class="MuiBox-root css-ij4vq4" data-testid="translator-header-language-dropdown-web"><button class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root css-1uayg5t" tabindex="0" type="button">Bengali<span class="MuiButton-endIcon MuiButton-iconSizeMedium css-pt151d"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-p6nd68" focusable="false" aria-hidden="true" viewBox="0 0 24 24" type="chevronDown"><path d="M12 14.95c-.133 0-.258-.02-.375-.063a.877.877 0 0 1-.325-.212L6.675 10.05a.892.892 0 0 1-.262-.687.977.977 0 0 1 .287-.688.948.948 0 0 1 .7-.275c.283 0 .517.092.7.275l3.9 3.9 3.925-3.925a.892.892 0 0 1 .688-.262.977.977 0 0 1 .687.287.948.948 0 0 1 .275.7.948.948 0 0 1-.275.7l-4.6 4.6c-.1.1-.208.17-.325.212a1.106 1.106 0 0 1-.375.063Z"></path></svg></span><span class="MuiTouchRipple-root css-w0pj6f"></span></button></div>


<button class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeLarge MuiButton-textSizeLarge MuiButtonBase-root css-mbkun8" tabindex="0" type="button"><span class="css-ork8mx">Translate</span><span class="MuiTouchRipple-root css-w0pj6f"></span></button>