from bs4 import BeautifulSoup
from underthesea import sent_tokenize


def html_to_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "noscript", "iframe", "header", "footer", "nav", "aside"]):
        tag.decompose()
    text = soup.get_text(" ")
    text = " ".join(text.split())
    return text.strip()


def split_sentences(text: str) -> list:
    """
    Sử dụng underthesea để phân đoạn câu.
    Trả về danh sách các câu (list of strings).
    """
    sentences = sent_tokenize(text)
    return sentences
