from PIL import Image, ImageDraw, ImageFont

W, H = 400, 200
img = Image.new("RGBA", (W, H), (245, 240, 230, 255))
draw = ImageDraw.Draw(img)

# Border
draw.rectangle([(2, 2), (W - 3, H - 3)], outline=(192, 81, 10, 255), width=3)

# Try to load a font
font_big = None
font_small = None
for fpath in ["arial.ttf", "C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/segoeui.ttf"]:
    try:
        font_big = ImageFont.truetype(fpath, 48)
        font_small = ImageFont.truetype(fpath, 18)
        break
    except Exception:
        continue
if font_big is None:
    font_big = ImageFont.load_default()
    font_small = ImageFont.load_default()

text_big = "IRSH"
bbox = draw.textbbox((0, 0), text_big, font=font_big)
tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
draw.text(((W - tw) // 2, (H - th) // 2 - 20), text_big, fill=(192, 81, 10, 255), font=font_big)

text_small = "Niger"
bbox2 = draw.textbbox((0, 0), text_small, font=font_small)
tw2, th2 = bbox2[2] - bbox2[0], bbox2[3] - bbox2[1]
draw.text(((W - tw2) // 2, (H - th2) // 2 + 38), text_small, fill=(150, 100, 60, 255), font=font_small)

out = r"C:\Users\FS10\Desktop\MaradouProject\Site\Site\CodingCamp2026\wwwroot\logoPartenaire\IRSH.png"
img.save(out, "PNG")
print(f"Placeholder created: {out}")
