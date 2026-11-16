import base64, pathlib, sys
root = pathlib.Path(__file__).resolve().parent
mark = base64.b64encode((root.parent/'public/images/rideff-mark.png').read_bytes()).decode()
MARK = f"data:image/png;base64,{mark}"

import qrcode
_q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0)
_q.add_data("https://rideff.com"); _q.make(fit=True)
_m = _q.get_matrix(); _n = len(_m)
def _finder(x, y):
    return (f'<rect x="{x}" y="{y}" width="7" height="7" rx="1.2" fill="#14080a"/>'
            f'<rect x="{x+1}" y="{y+1}" width="5" height="5" rx=".6" fill="#fff7ed"/>'
            f'<rect x="{x+2}" y="{y+2}" width="3" height="3" rx=".5" fill="#c2410c"/>')
_cw, _ch = 9, 5  # knocked-out centre (modules) for the logo
_cx, _cy = (_n-_cw)//2, (_n-_ch)//2
_dots = []
for y in range(_n):
    for x in range(_n):
        if not _m[y][x]: continue
        if (x<7 and y<7) or (x>=_n-7 and y<7) or (x<7 and y>=_n-7): continue
        if _cx<=x<_cx+_cw and _cy<=y<_cy+_ch: continue
        _dots.append(f'<circle cx="{x+.5}" cy="{y+.5}" r=".47"/>')
QR = (f'<svg viewBox="0 0 {_n} {_n}" xmlns="http://www.w3.org/2000/svg"><g fill="#14080a">{"".join(_dots)}</g>'
      + _finder(0,0) + _finder(_n-7,0) + _finder(0,_n-7)
      + f'<image href="{MARK}" x="{_cx+.4}" y="{_cy+.6}" width="{_cw-.8}" height="{(_cw-.8)/2}"/></svg>')

CSS = """
:root{--night:#14080a;--night-2:#2a1315;--burgundy:#7f1d1d;--orange:#f97316;--orange-ink:#c2410c;--peach:#ffe4c7;--paper:#fff7ed;--ink:#17090a;--muted:#5e4a43;--line:#e6d0b9;
--bg:#efe3d4;--fg:#17090a;--sub:#5e4a43;--surface:#fffcf7;
--font:'Geist',system-ui,sans-serif;--mono:'Geist Mono',ui-monospace,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e0607;--fg:#fff7ed;--sub:#cbb7a8;--surface:#1e0d0e;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0e0607;--fg:#fff7ed;--sub:#cbb7a8;--surface:#1e0d0e;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font)}
.card{--mm:calc(100cqw / 85);container-type:inline-size;position:relative;width:100%;aspect-ratio:85/55;overflow:hidden;font-family:var(--font);-webkit-font-smoothing:antialiased}
.card.bleed{--mm:calc(100cqw / 91);aspect-ratio:91/61}
.in{position:absolute;inset:0}
.bleed .in{inset:calc(3 * var(--mm))}
.front{background:var(--night);color:var(--paper)}
.front::before{content:"";position:absolute;right:calc(-30 * var(--mm));top:calc(-34 * var(--mm));width:calc(80 * var(--mm));height:calc(80 * var(--mm));border-radius:50%;background:radial-gradient(circle,rgba(127,29,29,.75),rgba(127,29,29,0) 68%)}
.front .mark{position:absolute;left:calc(7 * var(--mm));top:calc(7 * var(--mm));height:calc(12 * var(--mm));width:auto;display:block}
.front .tag{position:absolute;left:calc(7 * var(--mm));bottom:calc(7 * var(--mm));right:calc(7 * var(--mm))}
.front h2{margin:0;font-weight:600;font-size:calc(4.9 * var(--mm));line-height:1.15;letter-spacing:-.02em;color:var(--paper)}
.front h2 em{font-style:normal;color:var(--orange)}
.front .mono{margin-top:calc(3 * var(--mm));font-family:var(--mono);font-size:calc(2 * var(--mm));letter-spacing:.12em;text-transform:uppercase;color:#cbb7a8}
.front .qr{position:absolute;right:calc(7 * var(--mm));bottom:calc(7 * var(--mm));width:calc(19 * var(--mm));height:calc(19 * var(--mm));background:var(--paper);padding:calc(1.6 * var(--mm));border-radius:calc(1.4 * var(--mm))}.front .qr svg{display:block;width:100%;height:100%}
.front .pil{position:absolute;right:calc(7 * var(--mm));top:calc(8 * var(--mm));font-family:var(--mono);font-size:calc(2.3 * var(--mm));letter-spacing:.14em;text-transform:uppercase;color:var(--peach);opacity:.8}
.back{background:var(--paper);color:var(--ink)}
.back .wm{position:absolute;right:calc(-26 * var(--mm));bottom:calc(-13 * var(--mm));width:calc(92 * var(--mm));aspect-ratio:665/332;background:var(--peach);-webkit-mask:url('{MARKURL}') center/contain no-repeat;mask:url('{MARKURL}') center/contain no-repeat}
.back .rule{position:absolute;left:calc(7 * var(--mm));width:calc(10 * var(--mm));height:calc(.6 * var(--mm));background:var(--orange);top:calc(23 * var(--mm))}
.back .name{position:absolute;left:calc(7 * var(--mm));top:calc(7.5 * var(--mm))}
.back h3{margin:0;font-weight:600;font-size:calc(5.4 * var(--mm));white-space:nowrap;letter-spacing:-.02em;line-height:1.05}
.back .role{margin-top:calc(1.8 * var(--mm));font-family:var(--mono);font-size:calc(2.5 * var(--mm));letter-spacing:.14em;text-transform:uppercase;color:var(--orange-ink)}
.back dl{position:absolute;left:calc(7 * var(--mm));right:calc(7 * var(--mm));bottom:calc(7 * var(--mm));margin:0;display:grid;grid-template-columns:calc(19 * var(--mm)) 1fr;row-gap:calc(1.9 * var(--mm));align-items:baseline}
.back dt{font-family:var(--mono);font-size:calc(2.2 * var(--mm));letter-spacing:.12em;text-transform:uppercase;color:#927a6d}
.back dd{margin:0;font-size:calc(3.5 * var(--mm));font-weight:500;letter-spacing:-.005em;white-space:nowrap}
.back .call{position:absolute;right:calc(7 * var(--mm));top:calc(8 * var(--mm));background:var(--peach);color:var(--burgundy);border-radius:calc(1.2 * var(--mm));padding:calc(1.5 * var(--mm)) calc(2.4 * var(--mm));font-family:var(--mono);font-size:calc(2.2 * var(--mm));letter-spacing:.1em;text-transform:uppercase;line-height:1.4;text-align:right}
.back .call b{display:block;font-weight:600;color:var(--orange-ink)}
"""

def card(side, bleed=False):
    cls = "card %s%s" % (side, " bleed" if bleed else "")
    if side == "front":
        inner = f"""<div class="in"><img class="mark" src="{MARK}" alt="RIDEFF"><div class="qr">{QR}</div>
<div class="tag"><h2>One <em>real system</em><br>behind your<br>whole business.</h2><div class="mono">AI agents · Apps · Web</div></div></div>"""
    else:
        inner = """<div class="wm"></div><div class="in"><div class="rule"></div><div class="name"><h3>Rialto Daphino Effendy</h3><div class="role">Founder &amp; Operator</div></div>
<dl><dt>WhatsApp</dt><dd>+49 176 32572420</dd><dt>E-Mail</dt><dd>hallo@rideff.com</dd><dt>Web</dt><dd>rideff.com</dd></dl></div>"""
    return f'<div class="{cls}">{inner}</div>'

CSS = CSS.replace("{MARKURL}", MARK)

def page(fontlink, body, extra=""):
    return f"<!doctype html><html lang=\"de\"><head><meta charset=\"utf-8\"><title>RIDEFF Visitenkarte</title>{fontlink}<style>{CSS}{extra}</style></head><body>{body}</body></html>"

GF = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">'
src = root.parent/'src/fonts'
fonts = list(src.glob('*.woff2'))
local = "".join(f"@font-face{{font-family:'Geist';src:url('file://{f}') format('woff2');font-weight:{ {'Regular':400,'Medium':500,'SemiBold':600}.get(f.stem.split('-')[-1],400)};}}" for f in fonts if f.stem.startswith('Geist-'))
mono = "".join(f"@font-face{{font-family:'Geist Mono';src:url('file://{f}') format('woff2');font-weight:400 500;}}" for f in fonts if 'Mono' in f.stem)

# print pages: single card per page, full-bleed fill
for name, side, bleed in [("front","front",False),("back","back",False),("front-bleed","front",True),("back-bleed","back",True)]:
    (root/f"_{name}.html").write_text(page("", card(side,bleed), local+mono+"body{margin:0;width:100vw}"))

# artifact page
body = f"""
<main class="wrap">
<header><p class="eyebrow">Visitenkarte · 85 × 55 mm</p><h1>RIDEFF</h1>
<p class="lede">Zwei Seiten, aus den Markenfarben der Website: Oxblood-Schwarz, Orange <code>#F97316</code>, Creme <code>#FFF7ED</code>.</p></header>
<section class="cards"><figure>{card('front')}<figcaption>Vorderseite</figcaption></figure><figure>{card('back')}<figcaption>Rückseite</figcaption></figure></section>
<section class="pal"><h2>Palette</h2><ul>
<li><i style="background:#14080a"></i><b>Night</b><code>#14080A</code></li>
<li><i style="background:#7f1d1d"></i><b>Burgundy</b><code>#7F1D1D</code></li>
<li><i style="background:#f97316"></i><b>Orange</b><code>#F97316</code></li>
<li><i style="background:#c2410c"></i><b>Orange ink</b><code>#C2410C</code></li>
<li><i style="background:#ffe4c7"></i><b>Peach</b><code>#FFE4C7</code></li>
<li><i style="background:#fff7ed"></i><b>Paper</b><code>#FFF7ED</code></li></ul>
<p class="note">Schrift: Geist und Geist Mono, wie auf rideff.com.</p></section></main>"""
extra = """
.wrap{max-width:980px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:36px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(34px,6vw,56px);letter-spacing:-.03em;font-weight:600}
.lede{max-width:60ch;color:var(--sub);line-height:1.55;margin:10px 0 0}
code{font-family:var(--mono);font-size:.9em}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:28px}
figure{margin:0;display:flex;flex-direction:column;gap:10px;min-width:0}
figure .card{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub)}
.pal h2{font-size:15px;margin:0 0 12px;font-weight:600}
.pal ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.pal li{display:grid;grid-template-columns:36px 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center;background:var(--surface);padding:8px;border-radius:8px}
.pal i{grid-row:1/3;width:36px;height:36px;border-radius:6px;border:1px solid rgba(127,100,80,.35)}
.pal b{font-size:13px;font-weight:500}.pal code{font-size:12px;color:var(--sub)}
.note{color:var(--sub);font-size:13px;margin:12px 0 0}
"""
(root/'preview.html').write_text(page(GF, body, extra))
print("ok")
