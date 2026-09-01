#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

source = Path("/Users/vitormilanez/Desktop/Codes/Instituto Vivance/.codex_tmp/vivance_gdocs/rendered")
output = source / "montages"
output.mkdir(parents=True, exist_ok=True)
pages = sorted(source.glob("page-*.png"), key=lambda p: int(p.stem.split("-")[1]))
font_path = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
font = ImageFont.truetype(str(font_path), 24) if font_path.exists() else ImageFont.load_default()

for group_index in range(0, len(pages), 4):
    group = pages[group_index : group_index + 4]
    opened = [Image.open(path).convert("RGB") for path in group]
    width = max(image.width for image in opened)
    label_height = 42
    gap = 20
    height = sum(image.height + label_height for image in opened) + gap * (len(opened) - 1)
    canvas = Image.new("RGB", (width, height), "#E8EAED")
    draw = ImageDraw.Draw(canvas)
    y = 0
    for path, image in zip(group, opened):
        page_number = int(path.stem.split("-")[1])
        draw.rectangle((0, y, width, y + label_height), fill="#202124")
        draw.text((18, y + 7), f"Página {page_number}", font=font, fill="white")
        y += label_height
        canvas.paste(image, (0, y))
        y += image.height + gap
    start = int(group[0].stem.split("-")[1])
    end = int(group[-1].stem.split("-")[1])
    canvas.save(output / f"pages-{start:02d}-{end:02d}.png", optimize=True)

print(f"Created {len(list(output.glob('pages-*.png')))} montages for {len(pages)} pages")
