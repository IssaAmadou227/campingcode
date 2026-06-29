import re
from pathlib import Path

ROOT = Path(r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\CodingCamp2026\Views")
img_re = re.compile(r'<img\b([^>]*)>', re.IGNORECASE | re.DOTALL)

for cshtml in ROOT.rglob("*.cshtml"):
    text = cshtml.read_text(encoding="utf-8", errors="ignore")
    lines = text.splitlines()
    total = 0
    unprotected = 0
    for m in img_re.finditer(text):
        attrs = m.group(1)
        total += 1
        if "onerror" not in attrs:
            unprotected += 1
            # Find line number
            line_no = text[:m.start()].count("\n") + 1
            src = re.search(r'src=["\']([^"\']+)["\']', attrs)
            print(f"  {cshtml.relative_to(ROOT)}:{line_no}  src={src.group(1) if src else '?'}")
    print(f"-> {cshtml.relative_to(ROOT)}: {total} imgs total, {unprotected} without onerror\n")
