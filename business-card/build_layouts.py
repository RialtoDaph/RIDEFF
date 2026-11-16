import build_portrait as bp
from build_portrait import MARK, QR, GF, page, root

CSS = bp.CSS.split('.pc{')[0] + """
.L{--mm:calc(100cqw / 55);container-type:inline-size;position:relative;width:100%;aspect-ratio:55/85;overflow:hidden;font-family:var(--font);-webkit-font-smoothing:antialiased;background:#14080a;color:#fff7ed;border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
.L .a{position:absolute}
.L .glow{right:calc(-30 * var(--mm));top:calc(-24 * var(--mm));width:calc(72 * var(--mm));height:calc(72 * var(--mm));border-radius:50%;background:radial-gradient(circle,rgba(127,29,29,.75),rgba(127,29,29,0) 68%)}
.L img.lg{display:block;width:auto}
.L .s{font-weight:400;color:#cbb7a8;letter-spacing:-.02em;white-space:nowrap;line-height:1.2}
.L .g{font-weight:600;letter-spacing:-.03em;background:linear-gradient(90deg,#f97316,#fbb040);-webkit-background-clip:text;background-clip:text;color:transparent}
.L .w{font-weight:600;letter-spacing:-.03em;color:#fff7ed}
.L .mono{font-family:var(--mono);text-transform:uppercase;letter-spacing:.12em;color:#cbb7a8;font-size:calc(2.2 * var(--mm))}
.L .qt{background:#fff7ed;border-radius:calc(1.4 * var(--mm));padding:calc(1.6 * var(--mm))}
.L .qt svg{display:block;width:100%;height:100%}
.L .mk{background:currentColor;-webkit-mask:url('MARK') center/contain no-repeat;mask:url('MARK') center/contain no-repeat;aspect-ratio:665/332}
""".replace('MARK', MARK)

def q(w, extra): return f'<div class="a qt" style="width:calc({w} * var(--mm));height:calc({w} * var(--mm));{extra}">{QR}</div>'
def px(**k): return ";".join(f"{a.replace('_','-')}:calc({v} * var(--mm))" for a,v in k.items())

# 1 centred
L1 = f'''<div class="L"><div class="a glow"></div>
<img class="a lg" src="{MARK}" style="{px(top=8,height=11)};left:50%;transform:translateX(-50%)">
<div class="a" style="left:0;right:0;{px(top=26)};text-align:center"><div class="s" style="{px(font_size=3.9)}">We drive you through</div>
<div class="g" style="{px(font_size=7.2, margin_top=1.6)};line-height:1.05">the age<br>of AI.</div></div>
<div class="a mono" style="left:0;right:0;{px(top=55)};text-align:center">Agents · Apps · Web</div>
{q(19, px(bottom=6)+";left:50%;transform:translateX(-50%)")}</div>'''

# 2 poster type
L2 = f'''<div class="L"><div class="a glow"></div>
<img class="a lg" src="{MARK}" style="{px(left=6,top=6,height=8)}">
<div class="a" style="{px(left=6,right=6,top=22)};line-height:1.04">
<div class="w" style="{px(font_size=7)}">We drive</div><div class="w" style="{px(font_size=7)}">you through</div>
<div class="g" style="{px(font_size=9.6)};margin-top:.1em">the age</div><div class="g" style="{px(font_size=9.6)}">of AI.</div></div>
<div class="a mono" style="{px(left=6,bottom=6)};line-height:1.7">Agents<br>Apps<br>Web</div>
{q(17, px(right=6,bottom=6))}</div>'''

# 3 logo hero
L3 = f'''<div class="L"><div class="a glow"></div>
<img class="a lg" src="{MARK}" style="{px(left=6,top=7,width=43)};height:auto">
<div class="a" style="{px(left=6,right=6,top=37)}"><div class="s" style="{px(font_size=3.9)}">We drive you through</div>
<div class="g" style="{px(font_size=6.6, margin_top=1.4)};line-height:1.05">the age<br>of AI.</div></div>
{q(19, px(left=6,bottom=6))}
<div class="a mono" style="{px(right=6,bottom=6)};text-align:right;line-height:1.7">Agents<br>Apps<br>Web</div></div>'''

# 4 split
L4 = f'''<div class="L"><div class="a" style="left:0;right:0;top:0;{px(height=37)};background:linear-gradient(135deg,#f97316 20%,#fb9a3c)"></div>
<div class="a mk" style="color:#14080a;{px(left=6,top=7,height=14)}"></div>
<div class="a mono" style="{px(right=6,top=7)};text-align:right;line-height:1.7;color:rgba(20,8,10,.75)">Agents<br>Apps<br>Web</div>
<div class="a" style="{px(left=6,right=6,top=43)}"><div class="s" style="{px(font_size=3.9)}">We drive you through</div>
<div class="g" style="{px(font_size=7, margin_top=1.4)};line-height:1.05">the age<br>of AI.</div></div>
{q(19, px(right=6,bottom=6))}</div>'''

# 5 editorial vertical caption
L5 = f'''<div class="L"><div class="a glow"></div>
<img class="a lg" src="{MARK}" style="{px(left=6,top=6,height=12)}">
<div class="a" style="{px(left=6,right=6,top=29)}"><div class="s" style="{px(font_size=3.9)}">We drive you through</div>
<div class="g" style="{px(font_size=7.5, margin_top=1.5)};line-height:1.05">the age<br>of AI.</div></div>
<div class="a mono" style="{px(right=6,top=6)};writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap">Agents · Apps · Web</div>
{q(21, px(left=6,bottom=6))}</div>'''

figs=[("1 · Simetris","Semua di tengah. Tenang dan klasik, paling rapi.",L1),
("2 · Poster huruf","Slogan besar memenuhi kartu, logo dan QR kecil. Paling berani.",L2),
("3 · Logo sebagai pahlawan","Logo selebar kartu, slogan di bawahnya. Merek dulu, pesan kedua.",L3),
("4 · Dua warna","Atas oranye dengan logo gelap, bawah gelap dengan slogan dan QR.",L4),
("5 · Editorial","Keterangan Agents · Apps · Web berdiri di tepi kanan, QR di kiri bawah.",L5)]
body='<main class="wrap"><header><p class="eyebrow">Layout depan · 55 × 85 mm</p><h1>Lima opsi</h1></header><section class="cards">'+"".join(f'<figure>{h}<figcaption><b>{t}</b><span>{d}</span></figcaption></figure>' for t,d,h in figs)+'</section></main>'
extra = CSS + """
.wrap{max-width:1040px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,5vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:28px}
figure{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0}
figcaption{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--sub);line-height:1.45}
figcaption b{color:var(--fg);font-size:14px;font-weight:600}
"""
(root/'layouts.html').write_text(page(GF, body, extra))
print('layouts ok')
