import build_portrait as bp
from build_portrait import GF, page, root

base = bp.pcard("front")
OLD = '<h2>We drive you through<b>the AGE<br>of AI</b></h2>'
assert OLD in base
G = 'background:linear-gradient(90deg,#f97316,#fbb040);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:600;letter-spacing:-.03em'
S = '<div style="font-size:calc(3.9 * var(--mm));font-weight:400;color:#cbb7a8;letter-spacing:-.02em;line-height:1.2;white-space:nowrap">We drive you through</div>'
mm = lambda v: f'calc({v} * var(--mm))'

# A staircase
A = f'<div style="display:inline-block;text-align:left;width:{mm(35)}">{S}<div style="{G};font-size:{mm(7.4)};line-height:1.05;margin-top:{mm(1.5)}">the AGE</div><div style="{G};font-size:{mm(7.4)};line-height:1.05;text-align:right">of AI</div></div>'.replace(f'<div style="display:inline-block;text-align:left;width:{mm(35)}">{S}','<div style="display:inline-block;width:'+mm(35)+';text-align:left"><div style="text-align:center;margin:0 '+mm(-8)+'">'+S+'</div>')
# B giant AI
B = f'{S}<div style="{G};font-size:{mm(5.2)};line-height:1;margin-top:{mm(2)}">the AGE of</div><div style="{G};font-size:{mm(14.5)};line-height:.84;margin-top:{mm(.8)}">AI</div>'
# C outline AGE
C = f'{S}<div style="font-size:{mm(7.6)};line-height:1.05;margin-top:{mm(1.5)};font-weight:600;letter-spacing:-.02em"><span style="{G}">the</span> <span style="-webkit-text-stroke:{mm(.35)} #f97316;color:transparent">AGE</span></div><div style="{G};font-size:{mm(7.6)};line-height:1.05">of AI</div>'
# D slanted
D = f'{S}<div style="display:inline-block;transform:skewX(-10deg);margin-top:{mm(1.5)}"><div style="{G};font-size:{mm(7.4)};line-height:1.05">the AGE</div><div style="{G};font-size:{mm(7.4)};line-height:1.05">of AI</div></div>'
# E connected by rules (S-shape)
ln = f'<i style="flex:1;height:{mm(.5)};background:#f97316;border-radius:9px;margin:0 {mm(2)}"></i>'
E = f'{S}<div style="display:flex;align-items:center;margin-top:{mm(2)};padding:0 {mm(6)}"><span style="{G};font-size:{mm(6.6)};line-height:1.1">the AGE</span>{ln}</div><div style="display:flex;align-items:center;padding:0 {mm(6)}">{ln}<span style="{G};font-size:{mm(6.6)};line-height:1.1">of AI</span></div>'

def mk(h): return base.replace(OLD, '<h2 style="margin:0">'+h+'</h2>')
# E needs full width: put .hl left/right to 0 via inline override
figs=[("A · Tangga","\"the AGE\" di kiri, \"of AI\" turun ke kanan seperti anak tangga.",mk(A)),
("B · AI raksasa","\"AI\" jadi pahlawan, besar dan menjadi pusat kartu.",mk(B)),
("C · Garis tepi","\"AGE\" hanya garis tepi, \"AI\" dan huruf lain solid.",mk(C)),
("D · Miring","Miring seperti garis diagonal di logo, memberi kesan melaju.",mk(D)),
("E · Berpaut garis","Garis oranye menyambung kedua baris seperti jalur, membentuk huruf S.",mk(E))]
body='<main class="wrap"><header><p class="eyebrow">Penempatan "the AGE of AI"</p><h1>Lima gaya</h1></header><section class="cards">'+"".join(f'<figure>{h}<figcaption><b>{t}</b><span>{d}</span></figcaption></figure>' for t,d,h in figs)+'</section></main>'
extra = bp.CSS + """
.wrap{max-width:1040px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,5vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:28px}
figure{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0}
figure .pc{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--sub);line-height:1.45}
figcaption b{color:var(--fg);font-size:14px;font-weight:600}
.pc .hl{top:calc(23 * var(--mm))}
"""
(root/'headlines.html').write_text(page(GF, body, extra))
print('ok')
