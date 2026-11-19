"""Converts the screenshots made by scripts/og.mjs into the final OG image and icons."""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
src = Path(sys.argv[1])
IMG.mkdir(parents=True, exist_ok=True)


def out(path: Path) -> Path:
    print("  wrote", path.relative_to(ROOT).as_posix())
    return path


# Open Graph / Twitter card image
with Image.open(src / "og.png") as im:
    im.convert("RGB").resize((1200, 630), Image.LANCZOS).save(out(IMG / "og-image.jpg"), "JPEG", quality=88, optimize=True, progressive=True)

with Image.open(src / "circle.png") as im:
    im = im.convert("RGBA")
    im.resize((192, 192), Image.LANCZOS).save(out(IMG / "icon-192.png"), optimize=True)
    im.resize((512, 512), Image.LANCZOS).save(out(IMG / "icon-512.png"), optimize=True)
    im.resize((32, 32), Image.LANCZOS).save(out(IMG / "favicon-32.png"), optimize=True)
    im.save(out(ROOT / "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])

with Image.open(src / "square.png") as im:
    im.convert("RGB").resize((180, 180), Image.LANCZOS).save(out(IMG / "apple-touch-icon.png"), optimize=True)

with Image.open(src / "maskable.png") as im:
    im.convert("RGB").resize((512, 512), Image.LANCZOS).save(out(IMG / "icon-512-maskable.png"), optimize=True)
