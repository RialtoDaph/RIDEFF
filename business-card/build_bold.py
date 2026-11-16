import math
import build_portrait as bp
from build_portrait import MARK, QR, GF, page, root

CSS = bp.CSS.split('.pc{')[0] + """
.B{--mm:calc(100cqw / 55);container-type:inline-size;position:relative;width:100%;aspect-ratio:55/85;overflow:hidden;font-family:var(--font);-webkit-font-smoothing:antialiased;background:#14080a;color:#fff7ed;border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
.B .a{position:absolute}
.B svg.bg{position:absolute;inset:0;width:100%;height:100%;display:block}
.B .s{font-weight:400;letter-spacing:-.02em;white-space:nowrap;line-height:1.2}
.B .g{font-weight:600;letter-spacing:-.03em;background:linear-gradient(90deg,#f97316,#fbb040);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.05}
.B .mono{font-family:var(--mono);text-transform:uppercase;font-size:calc(2.2 * var(--mm));letter-spacing:.18em;white-space:nowrap;line-height:1.2}
.B .mono .d{margin:0 .35em}
.B .qt{background:#fff7ed;border-radius:calc(1.4 * var(--mm));padding:calc(1.5 * var(--mm))}
.B .qt svg{display:block;width:100%;height:100%}
.B .mk{background:currentColor;-webkit-mask:url('MARK') center/contain no-repeat;mask:url('MARK') center/contain no-repeat;aspect-ratio:665/332}
""".replace('MARK', MARK)
mm = lambda v: f'calc({v} * var(--mm))'
def px(**k): return ";".join(f"{a.replace('_','-')}:calc({v} * var(--mm))" for a,v in k.items())
def qt(w, extra): return f'<div class="a qt" style="width:{mm(w)};height:{mm(w)};{extra}">{QR}</div>'

# ---- 1. Road ----
H=47; VP=27.5
dashes=[]
n=7
for i in range(n):
    u0=0.10+0.90*(i/n)**1.5; u1=u0+0.05+0.07*(i/n)
    y0=H+(85-H)*u0**1.7; y1=H+(85-H)*min(u1,1)**1.7
    w=lambda y: .08+.85*((y-H)/(85-H))
    dashes.append(f'<polygon points="{VP-w(y0):.2f},{y0:.2f} {VP+w(y0):.2f},{y0:.2f} {VP+w(y1):.2f},{y1:.2f} {VP-w(y1):.2f},{y1:.2f}" fill="#f97316" opacity="{.35+.08*i:.2f}"/>')
road=f'''<svg class="bg" viewBox="0 0 55 85" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
<defs><radialGradient id="gl" cx="27.5" cy="{H}" r="34" gradientUnits="userSpaceOnUse" gradientTransform="translate(27.5 {H}) scale(1 .38) translate(-27.5 -{H})">
<stop offset="0" stop-color="#fbb040"/><stop offset=".12" stop-color="#f97316"/><stop offset=".38" stop-color="#dc2626" stop-opacity=".7"/><stop offset=".65" stop-color="#7f1d1d" stop-opacity=".35"/><stop offset="1" stop-color="#14080a" stop-opacity="0"/></radialGradient>
<linearGradient id="rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1315"/><stop offset=".35" stop-color="#1a0b0c"/><stop offset="1" stop-color="#0d0506"/></linearGradient>
<linearGradient id="ed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbb040"/><stop offset="1" stop-color="#f97316" stop-opacity=".35"/></linearGradient></defs>
<polygon points="{VP-2.2},{H} {VP+2.2},{H} 60,85 -5,85" fill="url(#rd)"/>
<line x1="-1" y1="{H}" x2="56" y2="{H}" stroke="#fbb040" stroke-width=".18" opacity=".8"/>
<polyline points="{VP-2.2},{H} -5,85" fill="none" stroke="url(#ed)" stroke-width=".3"/>
<polyline points="{VP+2.2},{H} 60,85" fill="none" stroke="url(#ed)" stroke-width=".3"/>
{''.join(dashes)}</svg>'''
J = f'''<div class="B"><div class="a" style="inset:0;background:radial-gradient(ellipse 62% 17% at 50% {H/85*100:.1f}%,#fbb040 0,#f97316 9%,rgba(220,38,38,.75) 32%,rgba(127,29,29,.38) 62%,rgba(20,8,10,0) 100%)"></div>{road}
<img class="a" src="{MARK}" style="{px(top=6,height=9)};left:50%;transform:translateX(-50%);display:block;width:auto">
<div class="a" style="left:0;right:0;{px(top=18)};text-align:center"><div class="s" style="{px(font_size=3.9)};color:#cbb7a8">We drive you through</div>
<div class="g" style="{px(font_size=7.2)};margin-top:{mm(1.4)}">the AGE<br>of AI</div></div>
{qt(19, px(right=6,bottom=6))}
<div class="a mono" style="{px(left=6,bottom=6)};line-height:1.7;color:#cbb7a8">Agents<br>Apps<br>Web</div></div>'''

# ---- 2. Full orange ----
O = f'''<div class="B" style="background:linear-gradient(160deg,#f97316 25%,#fb9a3c)">
<div class="a mk" style="color:#14080a;{px(left=6,top=6,width=26)}"></div>
<div class="a" style="{px(left=6,right=6,top=28)}"><div class="s" style="{px(font_size=3.9)};color:rgba(20,8,10,.75)">We drive you through</div>
<div style="{px(font_size=8)};font-weight:600;letter-spacing:-.03em;line-height:1.03;color:#14080a;margin-top:{mm(1.5)}">the AGE<br>of AI</div></div>
{qt(21, px(left=6,bottom=6)).replace('class="a qt"','class="a qt" ')}
<div class="a mono" style="{px(right=6,bottom=6)};text-align:right;line-height:1.7;color:rgba(20,8,10,.78)">Agents<br>Apps<br>Web</div></div>'''

figs=[("1 · Jalan malam","Jalan menuju cahaya di cakrawala. Metafora \"drive\" jadi gambar, logo dan slogan di langit.",J),
("2 · Oranye penuh","Latar oranye, logo dan teks gelap. Paling mencolok di tumpukan kartu.",O)]
body='<main class="wrap"><header><p class="eyebrow">Konsep berani · 55 × 85 mm</p><h1>Dua arah</h1></header><section class="cards">'+"".join(f'<figure>{h}<figcaption><b>{t}</b><span>{d}</span></figcaption></figure>' for t,d,h in figs)+'</section></main>'
extra=CSS+"""
.wrap{max-width:960px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,5vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:32px}
figure{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0}
figcaption{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--sub);line-height:1.45}
figcaption b{color:var(--fg);font-size:14px;font-weight:600}
"""
(root/'bold.html').write_text(page(GF, body, extra))
print('ok')
