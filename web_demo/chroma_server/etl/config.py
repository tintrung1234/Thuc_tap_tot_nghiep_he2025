import os
from dotenv import load_dotenv
from dataclasses import dataclass


@dataclass
class Config:
    collection: str
    embed_model: str
    max_tokens: int
    overlap: int
    batch_size: int
    chroma_path: str
    mongo_uri: str
    mongo_db: str
    mongo_collection: str

    @staticmethod
    def from_env_and_args(args) -> "Config":
        load_dotenv()

        def get_config(key, arg_value, env_key):
            value = arg_value or os.getenv(env_key)
            if value is None:
                raise ValueError(
                    f"Thiếu cấu hình {env_key} trong .env hoặc argument --{key}")
            return value

        return Config(
            collection=get_config(
                "collection", args.collection, "CHROMA_COLLECTION"),
            embed_model=get_config("model", args.model, "EMBED_MODEL"),
            max_tokens=int(get_config(
                "max-tokens", args.max_tokens, "MAX_TOKENS")),
            overlap=int(get_config("overlap", args.overlap, "OVERLAP")),
            batch_size=int(get_config(
                "batch-size", args.batch_size, "BATCH_SIZE")),
            chroma_path=get_config(
                "chroma-path", args.chroma_path, "CHROMA_PATH"),
            mongo_uri=get_config("mongo-uri", args.mongo_uri, "MONGO_URI"),
            mongo_db=get_config("mongo-db", args.mongo_db, "MONGO_DB"),
            mongo_collection=get_config(
                "mongo-collection", args.mongo_collection, "MONGO_COLLECTION"),
        )
