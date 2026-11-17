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
.pc.bleed.b2{--mm:calc(100cqw / 59);aspect-ratio:59/89}
.pc .in{position:absolute;inset:0}.pc.bleed .in{inset:calc(3 * var(--mm))}.pc.bleed.b2 .in{inset:calc(2 * var(--mm))}
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
.sub{left:0;right:0;bottom:calc(8 * var(--mm));text-align:center;font-family:var(--mono);text-transform:uppercase;font-size:calc(2.3 * var(--mm));letter-spacing:.08em;line-height:1.2;color:#cbb7a8;white-space:nowrap}
.urlt{left:0;right:0;bottom:calc(37.7 * var(--mm));text-align:center;font-family:var(--mono);font-size:calc(2.3 * var(--mm));letter-spacing:.14em;padding-left:.14em;line-height:1.2;color:#cbb7a8}
.sub .d{color:#f97316;margin:0 .35em}
.qrt{left:50%;transform:translateX(-50%);bottom:calc(13.5 * var(--mm));width:calc(23 * var(--mm));height:calc(23 * var(--mm));background:var(--paper);border-radius:calc(1.6 * var(--mm));padding:calc(2.3 * var(--mm))}
.qrt svg{display:block;width:100%;height:100%}
.wm{left:50%;transform:translateX(-50%) rotate(-14deg);transform-origin:50% 50%;bottom:calc(-10 * var(--mm));width:calc(104 * var(--mm));aspect-ratio:665/332;background:#ffeadb;-webkit-mask:url('MARK') center/contain no-repeat;mask:url('MARK') center/contain no-repeat}
.nm{left:0;right:0;top:calc(7 * var(--mm));text-align:center}
.nm h3{margin:0;font-weight:600;font-size:calc(7.4 * var(--mm));line-height:1.04;letter-spacing:-.03em}
.role{margin-top:calc(3 * var(--mm));font-family:var(--mono);text-transform:uppercase;font-size:calc(2.3 * var(--mm));letter-spacing:.14em;padding-left:.14em;color:var(--orange-ink)}
.div{left:calc(6 * var(--mm));right:calc(6 * var(--mm));bottom:calc(44.5 * var(--mm));height:calc(.3 * var(--mm));background:#e6d0b9}
.div i{position:absolute;left:50%;transform:translateX(-50%);top:calc(-.15 * var(--mm));width:calc(10 * var(--mm));height:calc(.6 * var(--mm));background:var(--orange)}
.ct{left:calc(6 * var(--mm));right:calc(6 * var(--mm));bottom:calc(6 * var(--mm));display:flex;flex-direction:column;gap:calc(3.4 * var(--mm));margin:0;text-align:center}
.ct div{display:flex;flex-direction:column;align-items:center;gap:calc(.9 * var(--mm))}
.ct dt{font-family:var(--mono);text-transform:uppercase;font-size:calc(2.3 * var(--mm));letter-spacing:.12em;padding-left:.12em;color:#6e594e}
.ct dd{margin:0;font-size:calc(4 * var(--mm));font-weight:500;letter-spacing:-.005em;white-space:nowrap}

""".replace('MARK', MARK)



def circuit_svg():
    """Faint microchip behind the logo: package outline, inner die, pins, and fan-out traces running to the card edges."""
    o = '#f97316'
    out = ''
    defs = ('<linearGradient id="tl" gradientUnits="userSpaceOnUse" x1="8.6" y1="0" x2="-2" y2="0">'
            f'<stop offset="0" stop-color="{o}" stop-opacity=".36"/><stop offset="1" stop-color="{o}" stop-opacity=".06"/></linearGradient>'
            '<linearGradient id="tr" gradientUnits="userSpaceOnUse" x1="46.4" y1="0" x2="57" y2="0">'
            f'<stop offset="0" stop-color="{o}" stop-opacity=".36"/><stop offset="1" stop-color="{o}" stop-opacity=".06"/></linearGradient>')
    # package + die
    out += f'<rect x="11" y="4.5" width="33" height="19" rx="2" fill="{o}" fill-opacity=".035" stroke="{o}" stroke-opacity=".30" stroke-width=".22"/>'
    out += f'<rect x="12.7" y="6.2" width="29.6" height="15.6" rx="1.2" fill="none" stroke="{o}" stroke-opacity=".15" stroke-width=".16"/>'
    out += f'<circle cx="13.9" cy="7.4" r=".45" fill="{o}" fill-opacity=".35"/>'
    # top and bottom pins
    for i in range(13):
        x = 13.3 + i * 2.37
        out += f'<rect x="{x - .3:.2f}" y="2.0" width=".6" height="2.5" fill="{o}" fill-opacity=".26"/>'
        out += f'<rect x="{x - .3:.2f}" y="23.5" width=".6" height="2.0" fill="{o}" fill-opacity=".26"/>'
    # side pins with fan-out traces
    n = 9
    for i in range(n):
        y = 5.2 + i * 2.1
        out += f'<rect x="8.6" y="{y - .3:.2f}" width="2.4" height=".6" fill="{o}" fill-opacity=".26"/>'
        out += f'<rect x="44" y="{y - .3:.2f}" width="2.4" height=".6" fill="{o}" fill-opacity=".26"/>'
        dy = (i - 4) * 1.9
        y2 = y + dy
        d = abs(dy)
        lx1, lx2 = 6.2, 6.2 - d
        out += f'<path d="M8.6 {y:.2f} H{lx1} L{lx2:.2f} {y2:.2f} H-2" fill="none" stroke="url(#tl)" stroke-width=".2" stroke-linejoin="round"/>'
        rx1, rx2 = 55 - lx1, 55 - lx2
        out += f'<path d="M46.4 {y:.2f} H{rx1} L{rx2:.2f} {y2:.2f} H57" fill="none" stroke="url(#tr)" stroke-width=".2" stroke-linejoin="round"/>'
    # a few via dots on the traces
    for (vx, vy) in [(3.2, 12), (2.2, 19.5), (52.0, 9.5), (50.2, 22)]:
        out += f'<circle cx="{vx}" cy="{vy}" r=".4" fill="none" stroke="{o}" stroke-opacity=".3" stroke-width=".16"/>'
    return f'<svg viewBox="0 0 55 85" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible;display:block" xmlns="http://www.w3.org/2000/svg"><defs>{defs}</defs>{out}</svg>'

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
    cls = f"pc {'pf' if side=='front' else 'pb'}{' bleed' if bleed else ''}{' b2' if (bleed is not True and bleed == 2) else ''}"
    if side == "front":
        inner = (f'<div class="abs" style="inset:0;background:radial-gradient(120% 70% at 50% -10%,#5c1416 0%,#2b0e10 45%,#14080a 80%)"></div><div class="in">{circuit_svg()}<img class="abs logo" src="{MARK}" alt="RIDEFF">'
                 '<div class="abs hl"><h2>We drive you through<b><s>the</s> <span>AGE</span> <s>of</s> <span>AI</span></b></h2></div>'
                 '<div class="abs sub">Systems<span class="d">·</span>Agents<span class="d">·</span>Apps<span class="d">·</span>Web</div>'
                 '<div class="abs urlt">rideff.com</div>'
                 f'<div class="abs qrt">{QR}</div></div>')
    else:
        inner = ('<div class="abs wm"></div><div class="in"><div class="abs nm" style="top:calc(10.5 * var(--mm))"><h3 style="line-height:1"><span style="font-size:calc(10 * var(--mm));display:block;letter-spacing:-.035em">Rialto</span><span style="font-size:calc(4.9 * var(--mm));display:block;margin-top:calc(1.2 * var(--mm));font-weight:500">Daphino Effendy</span></h3><div class="role">Founder &amp; Operator</div></div>' + divider_tree() +
                 '<dl class="abs ct"><div><dt>Phone</dt><dd>+49 176 32572420</dd></div><div><dt>Email</dt><dd>hallo@rideff.com</dd></div><div><dt>Instagram</dt><dd>@rialtorideff</dd></div></dl></div>')
    return f'<div class="{cls}">{inner}</div>'

for name, side, bleed in [("front","front",False),("back","back",False),("front-bleed","front",True),("back-bleed","back",True),("front-bleed2","front",2),("back-bleed2","back",2)]:
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
