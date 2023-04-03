from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import nltk


class Categorizer:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("fabiochiu/t5-base-tag-generation")
        self.model = AutoModelForSeq2SeqLM.from_pretrained("fabiochiu/t5-base-tag-generation")

    def build(self):
        nltk.download("punkt")
        AutoTokenizer.from_pretrained("fabiochiu/t5-base-tag-generation")
        AutoModelForSeq2SeqLM.from_pretrained("fabiochiu/t5-base-tag-generation")

    def categorize(self, text: str) -> list[str]:
        inputs = self.tokenizer([text], max_length=512, truncation=True, return_tensors="pt")
        output = self.model.generate(**inputs, num_beams=8, do_sample=True, min_length=10,
                                max_length=64)
        decoded_output = self.tokenizer.batch_decode(output, skip_special_tokens=True)[0]
        tags = list(set(decoded_output.strip().split(", ")))
        return tags
