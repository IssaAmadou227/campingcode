import os
import re
from pathlib import Path

WWW = Path(r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\CodingCamp2026\wwwroot")
VIEWS = Path(r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\CodingCamp2026\Views")

# Build a case-insensitive map of actual files: lower-path -> real-path
actual_files = {}
for root, dirs, files in os.walk(WWW):
    for f in files:
        full = Path(root) / f
        rel = full.relative_to(WWW).as_posix()
        actual_files[rel.lower()] = rel

# Find all image refs in views
patterns = [
    re.compile(r'src="(/[^"]+\.(?:png|jpe?g|gif|webp|svg|ico|JPG|JPEG|PNG))"'),
    re.compile(r"src='(/[^']+\.(?:png|jpe?g|gif|webp|svg|ico|JPG|JPEG|PNG))'"),
    re.compile(r'src="~/([^"]+\.(?:png|jpe?g|gif|webp|svg|ico|JPG|JPEG|PNG))"'),
]

refs = []  # list of (file, line, raw_ref, normalized)
for cshtml in VIEWS.rglob("*.cshtml"):
    for i, line in enumerate(cshtml.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
        for pat in patterns:
            for m in pat.finditer(line):
                raw = m.group(1)
                # Normalize: strip leading /, lowercase
                if raw.startswith("/"):
                    norm = raw[1:]
                else:
                    norm = raw
                refs.append((str(cshtml.relative_to(VIEWS.parent.parent)), i, raw, norm))

missing = []
case_issues = []

for file, line, raw, norm in refs:
    lower = norm.lower()
    if lower not in actual_files:
        missing.append((file, line, raw))
    else:
        real = actual_files[lower]
        if norm != real:
            case_issues.append((file, line, raw, real))

print(f"Total image references: {len(refs)}")
print(f"\n=== MISSING FILES ({len(missing)}) ===")
for f, l, r in missing:
    print(f"  {f}:{l}  ->  {r}")

print(f"\n=== CASE / PATH MISMATCH ({len(case_issues)}) ===")
for f, l, raw, real in case_issues:
    print(f"  {f}:{l}")
    print(f"    in code : {raw}")
    print(f"    on disk : /{real}")

print(f"\n=== ACTUAL FILES IN wwwroot/Images ({len(list((WWW/'Images').glob('*')))}) ===")
for p in sorted((WWW/'Images').glob('*')):
    print(f"  {p.name}")

print(f"\n=== ACTUAL FILES IN wwwroot/logoPartenaire ({len(list((WWW/'logoPartenaire').glob('*')))}) ===")
for p in sorted((WWW/'logoPartenaire').glob('*')):
    print(f"  {p.name}")
