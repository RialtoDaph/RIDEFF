import build
from build import MARK, QR, GF, page, local, mono, root

CSS = """
:root{--night:#14080a;--orange:#f97316;--orange-ink:#c2410c;--peach:#ffe4c7;--paper:#fff7ed;--ink:#17090a;
--bg:#efe3d4;--fg:#17090a;--sub:#5e4a43;--surface:#fffcf7;--font:'Geist',system-ui,sans-serif;--mono:'Geist Mono',ui-monospace,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e0607;--fg:#fff7ed;--sub:#cbb7a8;--surface:#1e0d0e;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0e0607;--fg:#fff7ed;--sub:#cbb7a8;--surface:#1e0d0e;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font)}
.pc{--mm:calc(100cqw / 55);container-type:inline-size;position:relative;width:100%;aspect-ratio:55/85;overflow:hidden;font-family:var(--font);-webkit-font-smoothing:antialiased}
.pc.bleed{--mm:calc(100cqw / 61);aspect-ratio:61/91}
.pc .in{position:absolute;inset:0}.pc.bleed .in{inset:calc(3 * var(--mm))}
.pc .abs{position:absolute}
.pc.pf{background:var(--night);color:var(--paper)}
.pc.pb{background:var(--paper);color:var(--ink)}
.glow{right:calc(-30 * var(--mm));top:calc(-24 * var(--mm));width:calc(72 * var(--mm));height:calc(72 * var(--mm));border-radius:50%;background:radial-gradient(circle,rgba(127,29,29,.75),rgba(127,29,29,0) 68%)}
.logo{left:50%;transform:translateX(-50%);top:calc(7 * var(--mm));height:calc(14 * var(--mm));width:auto;display:block}
.hl{left:0;right:0;top:calc(28 * var(--mm));text-align:center}
.hl h2{margin:0;font-weight:400;font-size:calc(3.3 * var(--mm));line-height:1.2;white-space:nowrap;color:#cbb7a8;letter-spacing:-.02em}
.hl h2 b{display:block;margin-top:calc(1.5 * var(--mm));font-weight:600;font-size:calc(8.4 * var(--mm));line-height:1.1;white-space:nowrap;letter-spacing:-.025em;background:linear-gradient(90deg,#f97316,#fbb040);-webkit-background-clip:text;background-clip:text;color:transparent}
.hl h2 b span,.hl h2 b s{background:linear-gradient(90deg,#f97316,#fbb040);-webkit-background-clip:text;background-clip:text;color:transparent}
.hl h2 b s{text-decoration:none;font-size:.58em;font-weight:500;letter-spacing:-.01em}
.sub{left:0;right:0;bottom:calc(8 * var(--mm));text-align:center;font-family:var(--mono);text-transform:uppercase;font-size:calc(2.1 * var(--mm));letter-spacing:.12em;line-height:1.2;color:#cbb7a8;white-space:nowrap}
.urlt{left:0;right:0;bottom:calc(34.9 * var(--mm));text-align:center;font-family:var(--mono);font-size:calc(1.85 * var(--mm));letter-spacing:.14em;padding-left:.14em;line-height:1.2;color:#cbb7a8}
.sub .d{color:#f97316;margin:0 .35em}
.qrt{left:50%;transform:translateX(-50%);bottom:calc(15 * var(--mm));width:calc(19 * var(--mm));height:calc(19 * var(--mm));background:var(--paper);border-radius:calc(1.4 * var(--mm));padding:calc(1.5 * var(--mm))}
.qrt svg{display:block;width:100%;height:100%}
.wm{left:50%;transform:translateX(-50%);bottom:calc(-14 * var(--mm));width:calc(96 * var(--mm));aspect-ratio:665/332;background:#ffeadb;-webkit-mask:url('MARK') center/contain no-repeat;mask:url('MARK') center/contain no-repeat}
.nm{left:0;right:0;top:calc(7 * var(--mm));text-align:center}
.nm h3{margin:0;font-weight:600;font-size:calc(7.4 * var(--mm));line-height:1.04;letter-spacing:-.03em}
.role{margin-top:calc(3 * var(--mm));font-family:var(--mono);text-transform:uppercase;font-size:calc(2.3 * var(--mm));letter-spacing:.14em;padding-left:.14em;color:var(--orange-ink)}
.div{left:calc(6 * var(--mm));right:calc(6 * var(--mm));bottom:calc(44.5 * var(--mm));height:calc(.3 * var(--mm));background:#e6d0b9}
.div i{position:absolute;left:50%;transform:translateX(-50%);top:calc(-.15 * var(--mm));width:calc(10 * var(--mm));height:calc(.6 * var(--mm));background:var(--orange)}
.ct{left:calc(6 * var(--mm));right:calc(6 * var(--mm));bottom:calc(6 * var(--mm));display:flex;flex-direction:column;gap:calc(3.4 * var(--mm));margin:0;text-align:center}
.ct div{display:flex;flex-direction:column;align-items:center;gap:calc(.9 * var(--mm))}
.ct dt{font-family:var(--mono);text-transform:uppercase;font-size:calc(2.1 * var(--mm));letter-spacing:.12em;padding-left:.12em;color:#927a6d}
.ct dd{margin:0;font-size:calc(4 * var(--mm));font-weight:500;letter-spacing:-.005em;white-space:nowrap}

""".replace('MARK', MARK)



def circuit_svg():
    """Abstract PCB-style trace bundles hugging the card margins (45-degree jogs, graded opacity, colored pads)."""
    pal = ['#FF9E47', '#61CC80', '#54B0E6', '#9E8CF2', '#E0B842', '#EB7AAB']
    ops = [.55, .34, .2]
    d = 1.5
    out = ''
    def bundle(base, mirror=False, n=3, padcols=None):
        nonlocal out
        for k in range(n):
            pts = [((55 - (x + k * d)) if mirror else (x + k * d), y) for x, y in base]
            path = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pts)
            out += f'<path d="{path}" fill="none" stroke="#f97316" stroke-opacity="{ops[k]}" stroke-width=".24" stroke-linejoin="round"/>'
            ex, ey = pts[-1]
            col = (padcols or pal)[k % 6]
            out += f'<circle cx="{ex:.2f}" cy="{ey:.2f}" r=".55" fill="{col}" fill-opacity="{min(1, ops[k] + .35):.2f}"/>'
            out += f'<circle cx="{ex:.2f}" cy="{ey:.2f}" r=".95" fill="none" stroke="{col}" stroke-opacity="{ops[k] * .8:.2f}" stroke-width=".18"/>'
    bundle([(0.4, -2), (0.4, 16), (2.4, 18), (2.4, 40)], False, 2, [pal[0], pal[2]])
    bundle([(0.4, -2), (0.4, 30), (2.4, 32), (2.4, 52)], True, 1, [pal[3]])
    bundle([(0.4, 87), (0.4, 76), (2.4, 74), (2.4, 66)], False, 1, [pal[1]])
    bundle([(0.4, 87), (0.4, 80), (2.4, 78), (2.4, 70)], True, 2, [pal[5], pal[4]])
    return f'<svg viewBox="0 0 55 85" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;display:block" xmlns="http://www.w3.org/2000/svg">{out}</svg>'

def divider_tree():
    cols = ['#FF9E47','#61CC80','#54B0E6','#9E8CF2','#E0B842','#EB7AAB']
    xs = [21.5 + (k - 2.5) * 5.2 for k in range(6)]
    t = '<line x1="21.5" y1="1" x2="21.5" y2="2" stroke="#f97316" stroke-width=".3"/>'
    t += f'<line x1="{xs[0]}" y1="2" x2="{xs[-1]}" y2="2" stroke="#e6d0b9" stroke-width=".3"/>'
    for k, x in enumerate(xs):
        t += f'<line x1="{x}" y1="2" x2="{x}" y2="3.3" stroke="#e6d0b9" stroke-width=".3"/><circle cx="{x}" cy="3.7" r=".6" fill="{cols[k]}"/>'
    t += '<circle cx="21.5" cy=".7" r=".8" fill="#FF6B0A"/>'
    return ('<div class="abs" style="left:calc(6 * var(--mm));right:calc(6 * var(--mm));bottom:calc(42 * var(--mm));height:calc(5 * var(--mm))">'
            f'<svg viewBox="0 0 43 5" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">{t}</svg></div>')

def pcard(side, bleed=False):
    cls = f"pc {'pf' if side=='front' else 'pb'}{' bleed' if bleed else ''}"
    if side == "front":
        inner = (f'<div class="abs" style="inset:0;background:radial-gradient(120% 70% at 50% -10%,#5c1416 0%,#2b0e10 45%,#14080a 80%)"></div><div class="in">{circuit_svg()}<img class="abs logo" src="{MARK}" alt="RIDEFF">'
                 '<div class="abs hl"><h2>We drive you through<b><s>the</s> <span>AGE</span> <s>of</s> <span>AI</span></b></h2></div>'
                 '<div class="abs sub">Systems<span class="d">·</span>Agents<span class="d">·</span>Apps<span class="d">·</span>Web</div>'
                 '<div class="abs urlt">rideff.com</div>'
                 f'<div class="abs qrt">{QR}</div></div>')
    else:
        inner = ('<div class="abs wm"></div><div class="in"><div class="abs nm" style="top:calc(10.5 * var(--mm))"><h3 style="line-height:1"><span style="font-size:calc(10 * var(--mm));display:block;letter-spacing:-.035em">Rialto</span><span style="font-size:calc(4.9 * var(--mm));display:block;margin-top:calc(1.2 * var(--mm));font-weight:500">Daphino Effendy</span></h3><div class="role">Founder &amp; Operator</div></div>' + divider_tree() +
                 '<dl class="abs ct"><div><dt>Phone</dt><dd>+49 176 32572420</dd></div><div><dt>E-Mail</dt><dd>hallo@rideff.com</dd></div><div><dt>Instagram</dt><dd>@rialtorideff</dd></div></dl></div>')
    return f'<div class="{cls}">{inner}</div>'

for name, side, bleed in [("front","front",False),("back","back",False),("front-bleed","front",True),("back-bleed","back",True)]:
    (root/f"_p-{name}.html").write_text(page("", pcard(side,bleed), local+mono+CSS+"body{margin:0;width:100vw}"))

body = f'''<main class="wrap"><header><p class="eyebrow">Visitenkarte · hochkant · 55 × 85 mm</p><h1>RIDEFF</h1></header>
<section class="cards"><figure>{pcard("front")}<figcaption>Vorderseite</figcaption></figure><figure>{pcard("back")}<figcaption>Rückseite</figcaption></figure></section></main>'''
extra = CSS + """
.wrap{max-width:760px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,6vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:28px}
figure{margin:0;display:flex;flex-direction:column;gap:10px;min-width:0}
figure .pc{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub)}
"""
(root/'portrait.html').write_text(page(GF, body, extra))
print('portrait ok')
