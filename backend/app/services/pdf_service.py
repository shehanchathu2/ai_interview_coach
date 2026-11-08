
import fitz

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    document = fitz.open(stream=pdf_bytes, filetype="pdf")

    extracted_text = ""

    for page in document:
        extracted_text += page.get_text()

    document.close()

    if not extracted_text.strip():
        raise ValueError("No readable text found in this PDF.")

    return extracted_text
