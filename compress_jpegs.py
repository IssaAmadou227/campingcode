from PIL import Image, ImageFile
from pathlib import Path
import shutil
import os

ImageFile.LOAD_TRUNCATED_IMAGES = True

WWW = Path(r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\CodingCamp2026\wwwroot")
BACKUP = Path(r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\images_backup_originals")
BACKUP.mkdir(exist_ok=True)

QUALITY = 82
PROGRESSIVE = True
MIN_SIZE_KB = 50  # skip files already small

total_before = 0
total_after = 0
processed = 0
skipped = 0

for p in WWW.rglob("*"):
    if not p.is_file():
        continue
    if p.suffix.lower() not in (".jpg", ".jpeg"):
        continue
    size_before = p.stat().st_size
    if size_before < MIN_SIZE_KB * 1024:
        skipped += 1
        continue

    # Backup
    rel = p.relative_to(WWW)
    backup_path = BACKUP / rel
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    if not backup_path.exists():
        shutil.copy2(p, backup_path)

    # Compress
    try:
        with Image.open(p) as im:
            # JPEG can't have alpha, ensure RGB
            if im.mode != "RGB":
                im = im.convert("RGB")
            # Save with optimization
            im.save(p, "JPEG", quality=QUALITY, optimize=True, progressive=PROGRESSIVE)
        size_after = p.stat().st_size
        # Only keep if smaller, else restore
        if size_after >= size_before:
            shutil.copy2(backup_path, p)
            size_after = size_before
            print(f"  SKIP (no gain): {rel}  {size_before/1024:.1f} KB")
            skipped += 1
            continue
        total_before += size_before
        total_after += size_after
        processed += 1
        print(f"  {rel}: {size_before/1024:>8.1f} -> {size_after/1024:>8.1f} KB  (-{100*(1-size_after/size_before):.0f}%)")
    except Exception as e:
        print(f"  ERROR {rel}: {e}")

print()
print(f"Processed: {processed} files | Skipped: {skipped}")
print(f"Total: {total_before/1024/1024:.1f} MB -> {total_after/1024/1024:.1f} MB")
if total_before > 0:
    print(f"Savings: {(total_before-total_after)/1024/1024:.1f} MB ({100*(1-total_after/total_before):.0f}%)")
print(f"Originals backed up to: {BACKUP}")
