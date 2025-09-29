# rebuild_index.py
import json
from app import rag_utils

def main():
    resume_path = "data/PradeepCV.pdf"   # or .docx if that's your main file
    engine = rag_utils.RAGEngine.build_from_file(resume_path)

    # Load extra_info.json manually and append
    try:
        with open("data/extra_info.json", "r", encoding="utf-8") as f:
            extra = json.load(f).get("extra_info", [])
        engine.text_chunks.extend(extra)
        print(f"✅ Added {len(extra)} supplemental info entries from extra_info.json")
    except FileNotFoundError:
        print("⚠️ No extra_info.json found, skipping.")

    engine.save()
    print("✅ Rebuilt FAISS index with resume + extra_info")

if __name__ == "__main__":
    main()
