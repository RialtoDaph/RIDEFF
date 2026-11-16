import build_portrait as bp
from build_portrait import GF, page, root

base = bp.pcard("back")
OLD = '<div class="abs div"><i></i></div>'
assert OLD in base
LINE = '#e6d0b9'
COLS = ['#FF9E47','#61CC80','#54B0E6','#9E8CF2','#E0B842','#EB7AAB']
def wrap(svg):
    return f'<div class="abs" style="left:calc(6 * var(--mm));right:calc(6 * var(--mm));bottom:calc(42 * var(--mm));height:calc(5 * var(--mm))">{svg}</div>'
def svg(inner): return f'<svg viewBox="0 0 43 5" style="width:100%;height:100%;display:block;overflow:visible" xmlns="http://www.w3.org/2000/svg">{inner}</svg>'

# A: palette dots
dots = "".join(f'<circle cx="{21.5+(k-2.5)*3.4}" cy="2.5" r=".62" fill="{c}"/>' for k,c in enumerate(COLS))
A = wrap(svg(f'<line x1="0" y1="2.5" x2="43" y2="2.5" stroke="{LINE}" stroke-width=".3"/><rect x="9" y="1.2" width="25" height="2.6" fill="#fff7ed"/>{dots}'))
# B: node
B = wrap(svg(f'<line x1="0" y1="2.5" x2="17.5" y2="2.5" stroke="{LINE}" stroke-width=".3"/><line x1="25.5" y1="2.5" x2="43" y2="2.5" stroke="{LINE}" stroke-width=".3"/><circle cx="21.5" cy="2.5" r="2" fill="#f97316" fill-opacity=".16"/><circle cx="21.5" cy="2.5" r="1" fill="#f97316"/>'))
# C: slanted dashes
sl = "".join(f'<line x1="{19.2+i*2.2}" y1="4" x2="{20.8+i*2.2}" y2="1" stroke="#f97316" stroke-width=".55" stroke-linecap="butt"/>' for i in range(3))
C = wrap(svg(f'<line x1="0" y1="2.5" x2="17" y2="2.5" stroke="{LINE}" stroke-width=".3"/><line x1="26" y1="2.5" x2="43" y2="2.5" stroke="{LINE}" stroke-width=".3"/>{sl}'))
# D: logo bars tapering
gid='<defs><linearGradient id="g"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#fbb040"/></linearGradient></defs>'
D = wrap(svg(gid+'<rect x="9.5" y="0.7" width="24" height=".6" fill="url(#g)"/><rect x="13.5" y="2.2" width="16" height=".6" fill="url(#g)"/><rect x="17.5" y="3.7" width="8" height=".6" fill="url(#g)"/>'))
# E: mini agent tree
xs=[21.5+(k-2.5)*5.2 for k in range(6)]
tree=f'<line x1="21.5" y1="1" x2="21.5" y2="2" stroke="#f97316" stroke-width=".3"/><line x1="{xs[0]}" y1="2" x2="{xs[-1]}" y2="2" stroke="{LINE}" stroke-width=".3"/>'
tree+="".join(f'<line x1="{x}" y1="2" x2="{x}" y2="3.3" stroke="{LINE}" stroke-width=".3"/><circle cx="{x}" cy="3.7" r=".6" fill="{COLS[k]}"/>' for k,x in enumerate(xs))
tree+='<circle cx="21.5" cy=".7" r=".8" fill="#FF6B0A"/>'
E = wrap(svg(tree))

def mk(d): return base.replace(OLD, d)
figs=[("A · Titik warna","Enam titik dengan warna halaman Build berjajar di tengah garis.",mk(A)),
("B · Simpul","Garis terputus di tengah oleh satu simpul oranye bercahaya.",mk(B)),
("C · Tebasan miring","Tiga garis miring oranye di tengah, menggemakan potongan diagonal logo.",mk(C)),
("D · Garis logo","Tiga garis mengecil seperti batang pada logo RDE.",mk(D)),
("E · Pohon mini","Pohon agent versi kecil: satu chief, enam hub berwarna.",mk(E))]
body='<main class="wrap"><header><p class="eyebrow">Garis pemisah · belakang kartu</p><h1>Lima ide</h1></header><section class="cards">'+"".join(f'<figure>{h}<figcaption><b>{t}</b><span>{d}</span></figcaption></figure>' for t,d,h in figs)+'</section></main>'
extra = bp.CSS + """
.wrap{max-width:1100px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,5vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:24px}
figure{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0}
figure .pc{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--sub);line-height:1.45}
figcaption b{color:var(--fg);font-size:14px;font-weight:600}
"""
(root/'dividers.html').write_text(page(GF, body, extra))
print('ok')
