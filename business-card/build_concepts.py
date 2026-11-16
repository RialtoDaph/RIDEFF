import pathlib, build
from build import MARK, QR, GF, page, CSS, root

CX = """
.cx{container-type:inline-size;position:relative;width:100%;overflow:hidden;font-family:var(--font);-webkit-font-smoothing:antialiased;--mm:calc(100cqw / 85);aspect-ratio:85/55;border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
.cx.p{--mm:calc(100cqw / 55);aspect-ratio:55/85;max-width:62%;margin-inline:auto}
.cx .abs{position:absolute}
.cx h2{margin:0;font-weight:400;letter-spacing:-.02em}
.cx h2 b{display:block;font-weight:600;letter-spacing:-.02em}
.cx .grad{background:linear-gradient(90deg,#f97316,#fbb040);-webkit-background-clip:text;background-clip:text;color:transparent}
.cx .mono{font-family:var(--mono);text-transform:uppercase}
.cx .qrt{position:absolute;background:#fff7ed;border-radius:calc(1.4 * var(--mm));padding:calc(1.6 * var(--mm))}
.cx .qrt svg{display:block;width:100%;height:100%}
.cx img.m{display:block;height:auto}
.mk{background:currentColor;-webkit-mask:url('MARK') center/contain no-repeat;mask:url('MARK') center/contain no-repeat}
"""
CX = CX.replace('MARK', MARK)

def qr(w, r, b):
    return f'<div class="qrt" style="width:calc({w} * var(--mm));height:calc({w} * var(--mm));right:calc({r} * var(--mm));bottom:calc({b} * var(--mm))">{QR}</div>'

# A: motion trails
lines = "".join(
    f'<i class="abs" style="right:0;top:calc({y} * var(--mm));width:calc({w} * var(--mm));height:calc(.55 * var(--mm));background:linear-gradient(270deg,rgba(249,115,22,{o}),rgba(249,115,22,0))"></i>'
    for y,w,o in [(26,78,.55),(29.5,60,.4),(33,70,.3),(36.5,48,.22),(40,64,.16),(43.5,36,.12)])
A = f'''<div class="cx" style="background:#14080a;color:#fff7ed">
<div class="abs" style="left:calc(-18 * var(--mm));top:calc(-30 * var(--mm));width:calc(80 * var(--mm));height:calc(80 * var(--mm));border-radius:50%;background:radial-gradient(circle,rgba(127,29,29,.7),rgba(127,29,29,0) 68%)"></div>
{lines}
<img class="m abs" src="{MARK}" style="left:calc(7 * var(--mm));top:calc(7 * var(--mm));height:calc(14 * var(--mm))">
<div class="abs" style="left:calc(7 * var(--mm));bottom:calc(7 * var(--mm))">
<h2 style="font-size:calc(4.4 * var(--mm));color:#cbb7a8;line-height:1.2">Driving you through<b class="grad" style="font-size:1.4em;line-height:1.15">the age of AI.</b></h2>
<div class="mono" style="margin-top:calc(3 * var(--mm));font-size:calc(2.2 * var(--mm));letter-spacing:.12em;color:#cbb7a8">Agents · Apps · Web</div></div>
{qr(21,7,7)}</div>'''

# B: giant tone-on-tone mark
B = f'''<div class="cx" style="background:#14080a;color:#fff7ed">
<div class="abs mk" style="color:#2a1315;right:calc(-34 * var(--mm));top:calc(-6 * var(--mm));width:calc(124 * var(--mm));aspect-ratio:665/332"></div>
<div class="abs" style="inset:0;background:linear-gradient(90deg,#14080a 30%,rgba(20,8,10,0) 80%)"></div>
<img class="m abs" src="{MARK}" style="left:calc(7 * var(--mm));top:calc(7 * var(--mm));height:calc(10 * var(--mm))">
<div class="abs" style="left:calc(7 * var(--mm));bottom:calc(7 * var(--mm))">
<h2 style="font-size:calc(4.4 * var(--mm));color:#cbb7a8;line-height:1.2">Driving you through<b class="grad" style="font-size:1.4em;line-height:1.15">the age of AI.</b></h2>
<div class="mono" style="margin-top:calc(3 * var(--mm));font-size:calc(2.2 * var(--mm));letter-spacing:.12em;color:#cbb7a8">Agents · Apps · Web</div></div>
{qr(21,7,7)}</div>'''

# C: portrait
C = f'''<div class="cx p" style="background:#14080a;color:#fff7ed">
<div class="abs" style="right:calc(-30 * var(--mm));top:calc(-24 * var(--mm));width:calc(70 * var(--mm));height:calc(70 * var(--mm));border-radius:50%;background:radial-gradient(circle,rgba(127,29,29,.75),rgba(127,29,29,0) 68%)"></div>
<img class="m abs" src="{MARK}" style="left:calc(6 * var(--mm));top:calc(6 * var(--mm));height:calc(13 * var(--mm))">
<div class="abs" style="left:calc(6 * var(--mm));right:calc(6 * var(--mm));top:calc(30 * var(--mm))">
<h2 style="font-size:calc(4.3 * var(--mm));color:#cbb7a8;line-height:1.2">Driving you<br>through<b class="grad" style="font-size:1.75em;line-height:1.05;margin-top:calc(1.5 * var(--mm))">the age<br>of AI.</b></h2></div>
<div class="abs mono" style="left:calc(6 * var(--mm));bottom:calc(6 * var(--mm));font-size:calc(2.2 * var(--mm));letter-spacing:.12em;color:#cbb7a8;line-height:1.7">Agents<br>Apps<br>Web</div>
{qr(21,6,6)}</div>'''

# D: orange
D = f'''<div class="cx" style="background:linear-gradient(135deg,#f97316 20%,#fb9a3c);color:#14080a">
<div class="abs mk" style="color:#14080a;left:calc(7 * var(--mm));top:calc(7 * var(--mm));height:calc(14 * var(--mm));aspect-ratio:665/332"></div>
<div class="abs" style="left:calc(7 * var(--mm));bottom:calc(7 * var(--mm))">
<h2 style="font-size:calc(4.4 * var(--mm));color:rgba(20,8,10,.72);line-height:1.2">Driving you through<b style="font-size:1.4em;line-height:1.15;color:#14080a">the age of AI.</b></h2>
<div class="mono" style="margin-top:calc(3 * var(--mm));font-size:calc(2.2 * var(--mm));letter-spacing:.12em;color:rgba(20,8,10,.72)">Agents · Apps · Web</div></div>
{qr(21,7,7)}</div>'''

figs = [("A · Jejak gerak","Garis tipis oranye seperti jejak kecepatan di belakang slogan, menggemakan kata \"driving\".",A),
        ("B · Logo raksasa","Logo RDE tone-on-tone raksasa terpotong di kanan. Mewah dan editorial.",B),
        ("C · Vertikal","Kartu berdiri (55 × 85 mm). Bentuk tidak biasa, langsung beda di tumpukan kartu.",C),
        ("D · Oranye penuh","Latar oranye penuh dengan teks gelap. Paling mencolok, belakang tetap krem.",D)]
body = '<main class="wrap"><header><p class="eyebrow">Konsep depan kartu</p><h1>Empat arah</h1></header><section class="grid">' + "".join(f'<figure>{h}<figcaption><b>{t}</b><span>{d}</span></figcaption></figure>' for t,d,h in figs) + '</section></main>'
extra = CX + """
.wrap{max-width:1040px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,5vw,48px);letter-spacing:-.03em;font-weight:600}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:32px}
figure{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0}
figcaption{display:flex;flex-direction:column;gap:3px;font-size:14px;color:var(--sub);line-height:1.45}
figcaption b{color:var(--fg);font-size:15px;font-weight:600}
"""
(root/'concepts.html').write_text(page(GF, body, extra))
print('concepts ok')
