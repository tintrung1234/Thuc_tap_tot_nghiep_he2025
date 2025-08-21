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
<<<<<<< HEAD
                raise ValueError(
                    f"Thiếu cấu hình {env_key} trong .env hoặc argument --{key}"
                )
            return value

        return Config(
            collection=get_config("collection", args.collection, "CHROMA_COLLECTION"),
            embed_model=get_config("model", args.model, "EMBED_MODEL"),
            max_tokens=int(get_config("max-tokens", args.max_tokens, "MAX_TOKENS")),
            overlap=int(get_config("overlap", args.overlap, "OVERLAP")),
            batch_size=int(get_config("batch-size", args.batch_size, "BATCH_SIZE")),
            chroma_path=get_config("chroma-path", args.chroma_path, "CHROMA_PATH"),
            mongo_uri=get_config("mongo-uri", args.mongo_uri, "MONGO_URI"),
            mongo_db=get_config("mongo-db", args.mongo_db, "MONGO_DB"),
            mongo_collection=get_config(
                "mongo-collection", args.mongo_collection, "MONGO_COLLECTION"
            ),
=======
                raise ValueError(f"Thiếu cấu hình {env_key} trong .env")
            return value

        return Config(
            collection=get_config("CHROMA_COLLECTION"),
            embed_model=get_config("EMBED_MODEL"),
            max_tokens=int(get_config("MAX_TOKENS")),
            overlap=int(get_config("OVERLAP")),
            batch_size=int(get_config("BATCH_SIZE")),
            chroma_path=get_config("CHROMA_PATH"),
>>>>>>> 8c85f0795c53fce17d374f036feaa43385697a02
        )
