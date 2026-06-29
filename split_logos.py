from PIL import Image
import os

src = r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\pdf_extracted_images\page1_img8_535x160.jpeg"
out_dir = r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\CodingCamp2026\wwwroot\Images"

img = Image.open(src).convert("RGBA")
w, h = img.size
print(f"Source: {w}x{h}")

gray = img.convert("L")
pixels = gray.load()

# For each column, check if it contains any non-white pixel (i.e. has content)
WHITE_THRESHOLD = 235
col_has_content = []
for x in range(w):
    has_content = False
    for y in range(h):
        if pixels[x, y] < WHITE_THRESHOLD:
            has_content = True
            break
    col_has_content.append(has_content)

# Find groups of consecutive content columns (= logos), separated by whitespace
groups = []
in_group = False
start = 0
for x, has in enumerate(col_has_content):
    if has and not in_group:
        start = x
        in_group = True
    elif not has and in_group:
        groups.append((start, x - 1))
        in_group = False
if in_group:
    groups.append((start, w - 1))

# Merge groups separated by less than MIN_GAP px (small whitespace inside a logo)
MIN_GAP = 20
merged = []
for g in groups:
    if merged and g[0] - merged[-1][1] < MIN_GAP:
        merged[-1] = (merged[-1][0], g[1])
    else:
        merged.append(list(g))

print(f"Detected {len(merged)} logo group(s):")
for i, (a, b) in enumerate(merged, 1):
    print(f"  Logo {i}: x={a}..{b}  width={b-a+1}")

labels = ["logo-scratch", "logo-mit-app-inventor", "logo-python"]

if len(merged) != 3:
    print(f"WARNING: expected 3 groups, got {len(merged)}. Falling back to thirds.")
    third = w // 3
    merged = [(0, third - 1), (third, 2*third - 1), (2*third, w - 1)]

PAD = 6
for i, (a, b) in enumerate(merged):
    a2 = max(0, a - PAD)
    b2 = min(w - 1, b + PAD)
    crop = img.crop((a2, 0, b2 + 1, h))

    # Make white background transparent
    rgba = crop.convert("RGBA")
    datas = rgba.getdata()
    new_data = []
    for item in datas:
        if item[0] >= 245 and item[1] >= 245 and item[2] >= 245:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    rgba.putdata(new_data)

    fpath = os.path.join(out_dir, f"{labels[i]}.png")
    rgba.save(fpath, "PNG")
    print(f"Saved: {fpath} ({rgba.size[0]}x{rgba.size[1]})")
