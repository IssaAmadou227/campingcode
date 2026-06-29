import fitz
import os

pdf_path = r"C:\Users\FS10\Downloads\site_web_correction.pdf"
out_dir = r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\pdf_extracted_images"
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"PDF: {len(doc)} pages")

for page_index, page in enumerate(doc, start=1):
    image_list = page.get_images(full=True)
    print(f"\nPage {page_index}: {len(image_list)} image(s)")
    for img_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        ext = base_image["ext"]
        width = base_image.get("width")
        height = base_image.get("height")
        fname = f"page{page_index}_img{img_index}_{width}x{height}.{ext}"
        fpath = os.path.join(out_dir, fname)
        with open(fpath, "wb") as f:
            f.write(image_bytes)
        print(f"  -> {fname}  ({len(image_bytes):,} bytes)")

print(f"\nDone. Images saved to: {out_dir}")
