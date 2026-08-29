"""Rewrite a PDF in place with MuPDF's compression, verifying nothing changed.

Chromium writes the PDF with uncompressed object streams. Rewriting through
MuPDF takes roughly a third off the file size. The rewrite is only kept if the
page count and extracted text still match the original exactly - the fonts are
already subsetted by Chromium, so this is a container-level change only.

Usage: python3 compress_pdf.py <file.pdf>
"""

import os
import sys

import pymupdf


def compress(path):
    before = os.path.getsize(path)
    src = pymupdf.open(path)
    pages, text = src.page_count, "".join(p.get_text() for p in src)

    tmp = path + ".tmp"
    src.save(tmp, garbage=4, deflate=True, deflate_fonts=True, clean=True, use_objstms=1)
    src.close()

    out = pymupdf.open(tmp)
    same = out.page_count == pages and "".join(p.get_text() for p in out) == text
    out.close()

    if not same:
        os.remove(tmp)
        raise SystemExit("compression changed the document - kept the original")

    os.replace(tmp, path)
    after = os.path.getsize(path)
    return f"compressed {before} -> {after} bytes ({100 - after * 100 // before}% smaller)"


if __name__ == "__main__":
    print(compress(sys.argv[1]))
