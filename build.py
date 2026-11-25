"""Bundle index.html + css + js into one self-contained offline HTML file."""
import pathlib, re

root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")

def inline_css(m):
    css = (root / m.group(1)).read_text(encoding="utf-8")
    return "<style>\n" + css + "\n</style>"

def inline_js(m):
    js = (root / m.group(1)).read_text(encoding="utf-8")
    js = js.replace("</script", "<\\/script")  # keep the HTML parser happy
    return "<script>\n" + js + "\n</script>"

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)
html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)
out = root / "dist" / "dnd-2014-character-builder.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(out, out.stat().st_size // 1024, "KB")
