#!/usr/bin/env python3
"""Export a post's diagram-component figures as PNGs for cross-posting.

dev.to (and LinkedIn, slides, etc.) can't render the <Flow>/<Compare>/<Matrix>/
<Bars> components, so each one is screenshotted in light mode at 2x and saved
to static/blog-figures/<slug>/<n>-<title>.png. Once deployed, those files are
served from https://swapnilgaikwad.me/blog-figures/<slug>/..., which is what
the cross-posted markdown links to. <Diagram> figures are skipped: they are
already images in that folder.

Prerequisites (once per machine):
    pip install playwright && python3 -m playwright install chromium

Usage:
    npm run clean && npm run build && npm run serve   # serves on :9000
    python3 scripts/export-figures.py <slug> [<slug> ...]

It prints dev.to-ready markdown for every figure (image + italic caption) in
post order. Re-run after changing a figure and commit the updated PNGs.
"""
import os
import re
import sys

from playwright.sync_api import sync_playwright

SITE_URL = "https://swapnilgaikwad.me"
LOCAL_URL = os.environ.get("EXPORT_BASE_URL", "http://localhost:9000")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "figure"


def export(page, slug):
    page.goto(f"{LOCAL_URL}/blog/{slug}/", wait_until="networkidle")
    # The caption goes under the image as text in the cross-posted markdown,
    # so leave it out of the screenshot rather than showing it twice.
    page.add_style_tag(content="figure[data-figure] figcaption { display: none !important; }")
    figures = page.query_selector_all("figure[data-figure]")
    if not figures:
        print(f"[{slug}] no figures found", file=sys.stderr)
        return

    out_dir = os.path.join(ROOT, "static", "blog-figures", slug)
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n<!-- {slug}: dev.to markdown, in post order -->")
    for index, figure in enumerate(figures, 1):
        title_el = figure.query_selector("[data-figure-title]")
        caption_el = figure.query_selector("figcaption")
        title = title_el.inner_text().strip() if title_el else f"Figure {index}"
        caption = caption_el.inner_text().strip() if caption_el else ""

        if figure.get_attribute("data-figure") == "image":
            img = figure.query_selector("img")
            src = img.get_attribute("src") if img else ""
            url = src if src.startswith("http") else f"{SITE_URL}{src}"
        else:
            name = f"{index}-{slugify(title)}.png"
            figure.screenshot(path=os.path.join(out_dir, name))
            url = f"{SITE_URL}/blog-figures/{slug}/{name}"

        # Alt names the figure; the italic caption below states the takeaway,
        # so screen readers do not hear the same sentence twice.
        alt = title.capitalize().replace("[", "(").replace("]", ")")
        print(f"\n![{alt}]({url})\n*{caption}*")


def main(slugs):
    if not slugs:
        sys.exit(__doc__)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page(
            viewport={"width": 1280, "height": 900},
            color_scheme="light",
            device_scale_factor=2,
        )
        for slug in slugs:
            export(page, slug)
        browser.close()


if __name__ == "__main__":
    main(sys.argv[1:])
