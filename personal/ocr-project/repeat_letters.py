def remove_words_with_continuous_letters(words):
    def has_continuous_letters(word):
        return any(word.count(char * len(word)) == 1 for char in set(word))

    return [word for word in words if not has_continuous_letters(word)]

# Example usage
words = ["a","aaaa", "hello", "bbbbb", "world", "ccccc"]
filtered_words = remove_words_with_continuous_letters(words)
print(filtered_words)  # Output: ['hello', 'world']
