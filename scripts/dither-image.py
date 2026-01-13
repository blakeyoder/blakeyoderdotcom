#!/usr/bin/env python3
"""
Convert any image to a 2-color dithered aesthetic like Cartesia's header.

Takes an input image and applies dithering with customizable color themes.

Usage:
    python dither-image.py input.jpg output.png --theme warm
    python dither-image.py input.jpg output.png --bg "#eabab0" --fg "#3a4a3e"
"""

import argparse
from pathlib import Path

try:
    from PIL import Image, ImageOps, ImageEnhance
    import numpy as np
except ImportError:
    print("Please install required packages:")
    print("  pip install pillow numpy")
    exit(1)


# Predefined color themes
THEMES = {
    "warm": {
        "background": (234, 186, 175),  # Warm pink/salmon (Cartesia style)
        "foreground": (58, 74, 62),      # Dark olive green
    },
    "cool": {
        "background": (200, 215, 230),  # Light blue-gray
        "foreground": (45, 55, 72),      # Dark blue-gray
    },
    "sunset": {
        "background": (255, 195, 145),  # Warm orange
        "foreground": (72, 45, 55),      # Deep burgundy
    },
    "forest": {
        "background": (185, 210, 180),  # Sage green
        "foreground": (35, 55, 35),      # Dark forest green
    },
    "night": {
        "background": (25, 35, 55),      # Dark navy
        "foreground": (180, 195, 220),   # Light blue-gray
    },
    "monochrome": {
        "background": (240, 240, 235),  # Off-white
        "foreground": (30, 30, 35),      # Near black
    },
    "sepia": {
        "background": (235, 220, 198),  # Cream
        "foreground": (82, 62, 45),      # Brown
    },
    "ocean": {
        "background": (180, 210, 220),  # Light cyan
        "foreground": (25, 60, 80),      # Deep teal
    },
    "lavender": {
        "background": (225, 210, 235),  # Light purple
        "foreground": (65, 45, 85),      # Dark purple
    },
    "mint": {
        "background": (200, 235, 220),  # Mint green
        "foreground": (40, 70, 60),      # Dark teal
    },
    "peach": {
        "background": (255, 218, 195),  # Peach
        "foreground": (120, 60, 45),     # Rust
    },
    "slate": {
        "background": (220, 225, 230),  # Light slate
        "foreground": (50, 60, 75),      # Dark slate
    },
}

# Bayer matrix for ordered dithering (8x8)
BAYER_8X8 = np.array([
    [ 0, 32,  8, 40,  2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44,  4, 36, 14, 46,  6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [ 3, 35, 11, 43,  1, 33,  9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47,  7, 39, 13, 45,  5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
]) / 64.0


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert hex color string to RGB tuple."""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def ordered_dither(grayscale: np.ndarray) -> np.ndarray:
    """Apply ordered (Bayer) dithering to a grayscale image."""
    h, w = grayscale.shape
    output = np.zeros_like(grayscale)

    # Tile the Bayer matrix across the image
    for y in range(h):
        for x in range(w):
            threshold = BAYER_8X8[y % 8, x % 8]
            output[y, x] = 1.0 if grayscale[y, x] > threshold else 0.0

    return output


def floyd_steinberg_dither(grayscale: np.ndarray) -> np.ndarray:
    """Apply Floyd-Steinberg error diffusion dithering."""
    h, w = grayscale.shape
    img = grayscale.astype(np.float64).copy()
    output = np.zeros_like(img)

    for y in range(h):
        for x in range(w):
            old_val = img[y, x]
            new_val = 1.0 if old_val > 0.5 else 0.0
            output[y, x] = new_val
            error = old_val - new_val

            # Distribute error to neighbors (Floyd-Steinberg coefficients)
            if x + 1 < w:
                img[y, x + 1] += error * 7 / 16
            if y + 1 < h:
                if x > 0:
                    img[y + 1, x - 1] += error * 3 / 16
                img[y + 1, x] += error * 5 / 16
                if x + 1 < w:
                    img[y + 1, x + 1] += error * 1 / 16

    return output


def atkinson_dither(grayscale: np.ndarray) -> np.ndarray:
    """Apply Atkinson dithering (used by original Macintosh)."""
    h, w = grayscale.shape
    img = grayscale.astype(np.float64).copy()
    output = np.zeros_like(img)

    for y in range(h):
        for x in range(w):
            old_val = img[y, x]
            new_val = 1.0 if old_val > 0.5 else 0.0
            output[y, x] = new_val
            error = (old_val - new_val) / 8  # Atkinson only diffuses 6/8 of error

            # Atkinson pattern
            if x + 1 < w:
                img[y, x + 1] += error
            if x + 2 < w:
                img[y, x + 2] += error
            if y + 1 < h:
                if x > 0:
                    img[y + 1, x - 1] += error
                img[y + 1, x] += error
                if x + 1 < w:
                    img[y + 1, x + 1] += error
            if y + 2 < h:
                img[y + 2, x] += error

    return output


def dither_image(
    input_path: str,
    output_path: str,
    theme: str | None = None,
    bg_color: tuple[int, int, int] | None = None,
    fg_color: tuple[int, int, int] | None = None,
    dither_method: str = "floyd-steinberg",
    contrast: float = 1.0,
    brightness: float = 1.0,
    invert: bool = False,
    resize: tuple[int, int] | None = None,
    scale: int = 1,
) -> str:
    """Convert an image to 2-color dithered output."""

    # Determine colors
    if theme and theme in THEMES:
        bg_color = THEMES[theme]["background"]
        fg_color = THEMES[theme]["foreground"]
    elif bg_color is None or fg_color is None:
        # Default to warm theme
        bg_color = THEMES["warm"]["background"]
        fg_color = THEMES["warm"]["foreground"]

    # Load and prepare image
    img = Image.open(input_path)
    original_size = img.size

    # Handle scaling: process at reduced size, then scale back up
    if scale > 1 and not resize:
        # Reduce size for processing (will scale back up later)
        process_size = (img.size[0] // scale, img.size[1] // scale)
        img = img.resize(process_size, Image.Resampling.LANCZOS)

    # Resize if specified (overrides scale)
    if resize:
        img = img.resize(resize, Image.Resampling.LANCZOS)

    # Convert to grayscale
    grayscale = img.convert("L")

    # Adjust contrast and brightness
    if contrast != 1.0:
        enhancer = ImageEnhance.Contrast(grayscale)
        grayscale = enhancer.enhance(contrast)

    if brightness != 1.0:
        enhancer = ImageEnhance.Brightness(grayscale)
        grayscale = enhancer.enhance(brightness)

    # Convert to numpy array and normalize to 0-1
    gray_array = np.array(grayscale).astype(np.float64) / 255.0

    # Invert if requested
    if invert:
        gray_array = 1.0 - gray_array

    # Apply dithering
    if dither_method == "ordered":
        dithered = ordered_dither(gray_array)
    elif dither_method == "atkinson":
        dithered = atkinson_dither(gray_array)
    else:  # floyd-steinberg
        dithered = floyd_steinberg_dither(gray_array)

    # Create output image
    h, w = dithered.shape
    output = Image.new("RGB", (w, h), bg_color)
    pixels = output.load()

    for y in range(h):
        for x in range(w):
            if dithered[y, x] > 0.5:
                pixels[x, y] = fg_color

    # Scale back up if needed (nearest neighbor to preserve pixelation)
    if scale > 1 and not resize:
        output = output.resize(original_size, Image.Resampling.NEAREST)

    # Save
    output.save(output_path, "PNG", optimize=True)
    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Convert any image to 2-color dithered aesthetic",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python dither-image.py photo.jpg output.png --theme warm
  python dither-image.py landscape.png out.png --theme night --dither atkinson
  python dither-image.py input.jpg out.png --bg "#eabab0" --fg "#3a4a3e"
  python dither-image.py photo.jpg out.png --contrast 1.3 --resize 1500x500

Available themes: """ + ", ".join(THEMES.keys())
    )

    parser.add_argument(
        "input",
        help="Input image file"
    )
    parser.add_argument(
        "output",
        help="Output image file"
    )
    parser.add_argument(
        "--theme",
        choices=list(THEMES.keys()),
        default="warm",
        help="Color theme (default: warm)"
    )
    parser.add_argument(
        "--bg",
        type=str,
        help="Custom background color as hex (e.g., '#eabab0')"
    )
    parser.add_argument(
        "--fg",
        type=str,
        help="Custom foreground color as hex (e.g., '#3a4a3e')"
    )
    parser.add_argument(
        "--dither",
        choices=["floyd-steinberg", "ordered", "atkinson"],
        default="floyd-steinberg",
        help="Dithering algorithm (default: floyd-steinberg)"
    )
    parser.add_argument(
        "--contrast",
        type=float,
        default=1.0,
        help="Contrast adjustment, 1.0 = no change (default: 1.0)"
    )
    parser.add_argument(
        "--brightness",
        type=float,
        default=1.0,
        help="Brightness adjustment, 1.0 = no change (default: 1.0)"
    )
    parser.add_argument(
        "--invert",
        action="store_true",
        help="Invert the image before dithering"
    )
    parser.add_argument(
        "--resize",
        type=str,
        help="Resize image to WIDTHxHEIGHT (e.g., '1500x500')"
    )
    parser.add_argument(
        "--scale",
        type=int,
        default=1,
        help="Pixel scale factor (e.g., 2 = process at half size, scale up 2x). Preserves aspect ratio. (default: 1)"
    )

    args = parser.parse_args()

    # Parse custom colors
    bg_color = hex_to_rgb(args.bg) if args.bg else None
    fg_color = hex_to_rgb(args.fg) if args.fg else None

    # Parse resize
    resize = None
    if args.resize:
        w, h = args.resize.lower().split("x")
        resize = (int(w), int(h))

    # Create output directory if needed
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)

    result = dither_image(
        input_path=args.input,
        output_path=args.output,
        theme=args.theme if not (bg_color and fg_color) else None,
        bg_color=bg_color,
        fg_color=fg_color,
        dither_method=args.dither,
        contrast=args.contrast,
        brightness=args.brightness,
        invert=args.invert,
        resize=resize,
        scale=args.scale,
    )

    print(f"Generated: {result}")


if __name__ == "__main__":
    main()
