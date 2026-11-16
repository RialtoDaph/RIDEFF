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
.hl h2 b{display:block;margin-top:calc(1.5 * var(--mm));font-weight:600;font-size:calc(7.2 * var(--mm));line-height:1.1;white-space:nowrap;letter-spacing:-.025em;background:linear-gradient(90deg,#f97316,#fbb040);-webkit-background-clip:text;background-clip:text;color:transparent}
.hl h2 b span,.hl h2 b s{background:linear-gradient(90deg,#f97316,#fbb040);-webkit-background-clip:text;background-clip:text;color:transparent}
.hl h2 b s{text-decoration:none;font-size:.58em;font-weight:500;letter-spacing:-.01em}
.sub{left:0;right:0;bottom:calc(8 * var(--mm));text-align:center;font-family:var(--mono);text-transform:uppercase;font-size:calc(2.2 * var(--mm));letter-spacing:.18em;line-height:1.2;color:#cbb7a8;white-space:nowrap}
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

def pcard(side, bleed=False):
    cls = f"pc {'pf' if side=='front' else 'pb'}{' bleed' if bleed else ''}"
    if side == "front":
        inner = (f'<div class="abs glow"></div><div class="in"><img class="abs logo" src="{MARK}" alt="RIDEFF">'
                 '<div class="abs hl"><h2>We drive you through<b><s>the</s> <span>AGE</span> <s>of</s> <span>AI</span></b></h2></div>'
                 '<div class="abs sub">Agents<span class="d">·</span>Apps<span class="d">·</span>Web</div>'
                 f'<div class="abs qrt">{QR}</div></div>')
    else:
        inner = ('<div class="abs wm"></div><div class="in"><div class="abs nm" style="top:calc(13.5 * var(--mm))"><h3 style="line-height:1"><span style="font-size:calc(10 * var(--mm));display:block;letter-spacing:-.035em">Rialto</span><span style="font-size:calc(4.9 * var(--mm));display:block;margin-top:calc(1.2 * var(--mm));font-weight:500">Daphino Effendy</span></h3><div class="role">Founder &amp; Operator</div></div>'
                 '<div class="abs div"><i></i></div>'
                 '<dl class="abs ct"><div><dt>WhatsApp</dt><dd>+49 176 32572420</dd></div><div><dt>E-Mail</dt><dd>hallo@rideff.com</dd></div><div><dt>Web</dt><dd>rideff.com</dd></div></dl></div>')
    return f'<div class="{cls}">{inner}</div>'

for name, side, bleed in [("front","front",False),("back","back",False),("front-bleed","front",True),("back-bleed","back",True)]:
    (root/f"_p-{name}.html").write_text(page("", pcard(side,bleed), local+mono+CSS+"body{margin:0;width:100vw}"))

body = f'''<main class="wrap"><header><p class="eyebrow">Visitenkarte · hochkant · 55 × 85 mm</p><h1>RIDEFF</h1></header>
<section class="cards"><figure>{pcard("front")}<figcaption>Vorderseite</figcaption></figure><figure>{pcard("back")}<figcaption>Rückseite</figcaption></figure></section></main>'''
extra = CSS + """
.wrap{max-width:760px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,6vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:28px}
figure{margin:0;display:flex;flex-direction:column;gap:10px;min-width:0}
figure .pc{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub)}
"""
(root/'portrait.html').write_text(page(GF, body, extra))
print('portrait ok')
