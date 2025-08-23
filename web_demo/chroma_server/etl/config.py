from dataclasses import dataclass
from dotenv import load_dotenv
import os


@dataclass
class Config:
    collection: str
    embed_model: str
    max_tokens: int
    overlap: int
    batch_size: int
    chroma_path: str

    @staticmethod
    def from_env() -> "Config":
        load_dotenv()

        def get_config(env_key):
            value = os.getenv(env_key)
            if value is None:
                raise ValueError(f"Thiếu cấu hình {env_key} trong .env")
            return value

        return Config(
            collection=get_config("CHROMA_COLLECTION"),
            embed_model=get_config("EMBED_MODEL"),
            max_tokens=int(get_config("MAX_TOKENS")),
            overlap=int(get_config("OVERLAP")),
            batch_size=int(get_config("BATCH_SIZE")),
            chroma_path=get_config("CHROMA_PATH"),
        )
