from typing import List, Tuple
from sentence_transformers import SentenceTransformer


class TokenCounter:
    def __init__(self, model: SentenceTransformer):
        self.tokenizer = model.tokenizer

    def count(self, text: str) -> int:
        return len(self.tokenizer(text, add_special_tokens=False)["input_ids"])


def chunk_by_sentences(text: str, counter: TokenCounter, max_tokens: int, overlap: int) -> List[Tuple[str, Tuple[int, int]]]:
    from .text_processing import split_sentences

    if not text:
        return []

    sentences = split_sentences(text)
    chunks = []
    buf = []
    buf_token = 0

    spans = []
    cursor = 0
    for s in sentences:
        idx = text.find(s, cursor)
        if idx == -1:
            idx = cursor
        spans.append((idx, idx + len(s)))
        cursor = idx + len(s)

    i = 0
    while i < len(sentences):
        s = sentences[i]
        t = counter.count(s)
        if t > max_tokens:
            chunks.append((s, (spans[i][0], spans[i][1])))
            i += 1
            continue

        if buf_token + t <= max_tokens:
            buf.append((s, spans[i]))
            buf_token += t
            i += 1
        else:
            if buf:
                chunk_text = " ".join(x[0] for x in buf).strip()
                start = buf[0][1][0]
                end = buf[-1][1][1]
                chunks.append((chunk_text, (start, end)))

                # overlap
                if overlap > 0:
                    overlap_buf = []
                    tok = 0
                    for s_prev, span_prev in reversed(buf):
                        tt = counter.count(s_prev)
                        if tok + tt <= overlap:
                            overlap_buf.append((s_prev, span_prev))
                            tok += tt
                        else:
                            break
                    overlap_buf.reverse()
                    buf = overlap_buf
                    buf_token = sum(counter.count(x[0]) for x in buf)
                else:
                    buf = []
                    buf_token = 0
            else:
                buf.append((s, spans[i]))
                buf_token += t
                i += 1

    if buf:
        chunk_text = " ".join(x[0] for x in buf).strip()
        start = buf[0][1][0]
        end = buf[-1][1][1]
        chunks.append((chunk_text, (start, end)))

    return chunks
