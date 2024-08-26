import pytesseract
from pdf2image import convert_from_path
import re
import requests
import time

# Path to the poppler bin directory
poppler_path = r'C:\poppler\Library\bin'

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Function to extract text using OCR
def extract_text_with_ocr(pdf_path):
    # Convert PDF pages to images
    images = convert_from_path(pdf_path, poppler_path=poppler_path)
    
    # Use OCR to extract text from images
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img)
    
    return text

# Function to get unique words from text
def get_unique_words(text):
    words = re.findall(r'\b\w+\b', text.lower())
    unique_words = sorted(set(words))
    return unique_words

# Function to remove words containing numbers
def remove_words_with_numbers(words):
    return [word for word in words if not re.search(r'\d', word)]

# Function to check if a word is valid using the Dictionary API
def is_valid_word(word):
    response = requests.get(f'https://api.dictionaryapi.dev/api/v2/entries/en/{word}')
    print(response.status_code)
    return response.status_code == 200

def remove_words_with_continuous_letters(words):
    def has_continuous_letters(word):
        return any(word.count(char * len(word)) == 1 for char in set(word))

    return [word for word in words if not has_continuous_letters(word)]

# Path to your PDF file
pdf_file_path = 'Class-3-Sci.pdf'

print("Ocr text extraction started")
# Extract text from the PDF using OCR
ocr_text = extract_text_with_ocr(pdf_file_path)

print("Ocr text extraction finished")

print("unique word extraction started")

# Extract unique words from the extracted text
unique_words = get_unique_words(ocr_text)

print("unique word extraction finished")

print("numberless word extraction started")

# Remove words containing numbers
numberless_words = remove_words_with_numbers(unique_words)

print("numberless word extraction finished")
print("filtered word extraction started")

filtered_words = remove_words_with_continuous_letters(numberless_words)

print("filtered word extraction finished")
delay_ms = 680  # Delay in milliseconds
print("valid word extraction started")

valid_words = []
for word in filtered_words:
    if is_valid_word(word):
        valid_words.append(word)
    time.sleep(delay_ms / 1000) 

print("valid word extraction finished")
# valid_words = [word for word in filtered_words if is_valid_word(word)]

# Print the number of valid words and the first 20 valid words as a preview
print(f"Number of ocr_text: {len(ocr_text)}")
print(f"Number of unique_words: {len(unique_words)}")
print(f"Number of numberless_words: {len(numberless_words)}")
print(f"Number of filtered_words: {len(filtered_words)}")
print(f"Number of valid words: {len(valid_words)}")
print(f" valid words: {valid_words[:]}")
