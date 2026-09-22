#!/usr/bin/env python3
"""
Process generated images according to image_generation_queue.json
"""
import sys, os, json
from PIL import Image

def process_item(item_id, src_image_path):
    with open("image_generation_queue.json") as f:
        queue = json.load(f)
    
    item = next((x for x in queue if x["id"] == item_id), None)
    if not item:
        print(f"Error: item {item_id} not found in queue")
        sys.exit(1)

    im = Image.open(src_image_path)
    print(f"Loaded {src_image_path}: size={im.size}")

    # Crop to 16:9 if needed
    w, h = im.size
    target_aspect = 16.0 / 9.0
    current_aspect = w / float(h)
    
    if abs(current_aspect - target_aspect) > 0.02:
        if current_aspect > target_aspect:
            # too wide, crop sides
            new_w = int(h * target_aspect)
            left = (w - new_w) // 2
            im = im.crop((left, 0, left + new_w, h))
        else:
            # too tall, crop top/bottom
            new_h = int(w / target_aspect)
            top = (h - new_h) // 2
            im = im.crop((0, top, w, top + new_h))

    for out in item["outputs"]:
        out_path = out["path"]
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        width = out["width"]
        height = out["height"]
        quality = out.get("quality", 60)

        resized = im.resize((width, height), Image.Resampling.LANCZOS)
        resized.save(out_path, "WEBP", quality=quality)
        size_kb = os.path.getsize(out_path) // 1024
        print(f"Saved {out_path} ({width}x{height}, {size_kb} KB)")

    # Apply file updates
    for up in item.get("updates", []):
        fpath = up["file"]
        pattern = up["pattern"]
        replacement = up["replacement"]
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Try exact match first
            if pattern in content:
                content = content.replace(pattern, replacement, 1)
                with open(fpath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {fpath}: '{pattern}' -> '{replacement}'")
            else:
                # Try handling quotes if pattern has heroImage: ...
                import re
                m = re.search(r'heroImage:\s*[\'"]?([^\'"\s]+)[\'"]?', pattern)
                if m:
                    old_img = m.group(1)
                    m2 = re.search(r'heroImage:\s*[\'"]?([^\'"\s]+)[\'"]?', replacement)
                    new_img = m2.group(1) if m2 else replacement
                    content, n = re.subn(rf'heroImage:\s*[\'"]?{re.escape(old_img)}[\'"]?', f'heroImage: "{new_img}"', content, count=1)
                    if n > 0:
                        with open(fpath, "w", encoding="utf-8") as f:
                            f.write(content)
                        print(f"Updated {fpath} (regex): {old_img} -> {new_img}")
                    else:
                        print(f"Notice: pattern '{pattern}' not found in {fpath}")
                else:
                    print(f"Notice: pattern '{pattern}' not found in {fpath}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 process_queue_image.py <item_id> <src_image_path>")
        sys.exit(1)
    process_item(sys.argv[1], sys.argv[2])
