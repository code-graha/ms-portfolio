"""
Image pipeline for the portfolio.

  python scripts/images.py                 -> (re)build WebP thumbnails for everything in projects/
  python scripts/images.py --import MAP    -> first copy originals listed in MAP (JSON: [{from, to}, ...])
                                              from my-work/ into projects/, then build thumbnails

Thumbnails: projects/thumbs/<name>-480.webp and <name>-960.webp (never upscaled).
Only missing or out-of-date thumbnails are regenerated.
"""
import json
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "my-work"
OUT_DIR = ROOT / "projects"
THUMB_DIR = OUT_DIR / "thumbs"
WIDTHS = (480, 960)
QUALITY = 78


def import_originals(map_file: Path) -> None:
    OUT_DIR.mkdir(exist_ok=True)
    for item in json.loads(map_file.read_text(encoding="utf-8")):
        src, dst = SRC_DIR / item["from"], OUT_DIR / item["to"]
        if not src.exists():
            sys.exit(f"missing source image: {src}")
        shutil.copy2(src, dst)
    print(f"copied originals into {OUT_DIR.relative_to(ROOT)}/")


def build_thumbs() -> None:
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    made = 0
    for img_path in sorted(OUT_DIR.iterdir()):
        if img_path.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        with Image.open(img_path) as im:
            im = im.convert("RGBA") if im.mode in ("P", "LA") else im
            for w in WIDTHS:
                out = THUMB_DIR / f"{img_path.stem}-{w}.webp"
                if out.exists() and out.stat().st_mtime >= img_path.stat().st_mtime:
                    continue
                target_w = min(w, im.width)
                target_h = round(im.height * target_w / im.width)
                im.resize((target_w, target_h), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
                made += 1
    print(f"thumbnails written: {made}")


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--import":
        import_originals(Path(sys.argv[2]))
    build_thumbs()
