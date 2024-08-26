# Example usage
words_list = 





def get_unique_words(words_list):
    words = [word.lower() for word in words_list]
    unique_words = sorted(set(words))
    return unique_words


unique_word_list = get_unique_words(words_list)
print(f"Word list count: {len(words_list)}")
# print(unique_word_list)
print(f" Unique word list count: {len(unique_word_list)}")
print(f"Unique word list: {unique_word_list}")
