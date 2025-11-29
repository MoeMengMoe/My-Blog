from pathlib import Path

KATEX_FONT_DIR = Path("public/fonts/katex")

if not KATEX_FONT_DIR.exists():
    raise SystemExit("Missing KaTeX font directory, run from repo root.")

variant_properties = {
    "Regular": (400, "normal"),
    "Italic": (400, "italic"),
    "Bold": (700, "normal"),
    "BoldItalic": (700, "italic"),
}

ext_format = {
    ".woff2": "woff2",
    ".woff": "woff",
    ".ttf": "truetype",
}

font_variants: dict[tuple[str, str], dict[str, str]] = {}
for font_file in sorted(KATEX_FONT_DIR.iterdir()):
    if not font_file.is_file():
        continue
    stem = font_file.stem
    if "-" not in stem:
        continue
    family, variant = stem.split("-", 1)
    key = (family, variant)
    font_variants.setdefault(key, {})[font_file.suffix.lower()] = font_file.name

output_lines = []
for (family, variant), sources in sorted(font_variants.items()):
    weight, style = variant_properties.get(variant, (400, "normal"))
    # Use the repo base prefix so generated CSS stays correct when `astro.config.mjs`
    # sets a non-empty `base`. Prefer reading from an environment variable
    # `SITE_BASE` if provided (CI can set this). Fall back to root '/'.
    import os
    BASE_PREFIX = os.environ.get('SITE_BASE', '/')
    # Ensure there's no trailing slash except the root '/'
    if BASE_PREFIX != '/' and BASE_PREFIX.endswith('/'):
        BASE_PREFIX = BASE_PREFIX.rstrip('/')
    src_parts = [
        f"url('{BASE_PREFIX}/fonts/katex/{name}') format('{ext_format[ext]}')"
        for ext, name in sources.items()
        if ext in ext_format
    ]
    if not src_parts:
        continue
    output_lines.append(
        f"""@font-face {{
  font-family: "{family}";
  font-style: {style};
  font-weight: {weight};
  font-display: swap;
  src: {', '.join(src_parts)};
}}
"""
    )

Path("tmp-katex-fonts.css").write_text("\n".join(output_lines), encoding="utf-8")
