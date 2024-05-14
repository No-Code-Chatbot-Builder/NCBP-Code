# import fitz
import io
from langchain_community.document_loaders import PyMuPDFLoader
# from docx import Document as DocxDocument 
# from pptx import Presentation

async def read_pdf_content(pdf_bytes):
    loader = PyMuPDFLoader(pdf_bytes)
    doc = loader.load()
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# async def read_docx_content(docx_bytes):
#     doc = DocxDocument(io.BytesIO(docx_bytes))
#     text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
#     return text

# async def read_pptx_content(pptx_bytes):
#     prs = Presentation(io.BytesIO(pptx_bytes))
#     text = ''
#     for slide in prs.slides:
#         for shape in slide.shapes:
#             if hasattr(shape, "text"):
#                 text += shape.text + '\n'
#     return text
            
