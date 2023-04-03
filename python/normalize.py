import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string


class Normalizer:
    def __init__(self):
        pass

    def build(self):
        nltk.download("stopwords")
        nltk.download("punkt")
        nltk.download("wordnet")

    def normalize(self, text: str) -> str:
        # Convert text to lowercase
        text = text.lower()

        # Remove punctuation
        text = text.translate(str.maketrans("", "", string.punctuation))

        # Tokenize text into words
        words = word_tokenize(text)

        # Remove stop words
        stop_words = set(stopwords.words("english"))
        filtered_words = [word for word in words if word not in stop_words]

        # Lemmatize words
        lemmatizer = WordNetLemmatizer()
        lemmatized_words = [lemmatizer.lemmatize(word) for word in filtered_words]

        # Join lemmatized words into cleaned text
        cleaned_text = " ".join(lemmatized_words)

        return cleaned_text
