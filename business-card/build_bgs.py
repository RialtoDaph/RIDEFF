import random
import build_portrait as bp
from build_portrait import GF, page, root

base = bp.pcard("front")
OLD = '<div class="abs glow"></div>'
assert OLD in base
def layer(inner, style=""):
    return f'<div class="abs" style="inset:0;{style}">{inner}</div>'
def svg(inner): return f'<svg viewBox="0 0 55 85" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;display:block" xmlns="http://www.w3.org/2000/svg">{inner}</svg>'

# A flat
A = ''
# B oxblood gradient
B = layer('', 'background:radial-gradient(120% 70% at 50% -10%,#5c1416 0%,#2b0e10 45%,#14080a 80%)')
# C dawn glow from below
C = layer('', 'background:radial-gradient(90% 55% at 50% 108%,rgba(249,115,22,.60) 0%,rgba(190,60,20,.38) 30%,rgba(127,29,29,.20) 55%,rgba(20,8,10,0) 78%)')
# D dot grid
dots = '<defs><pattern id="dg" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r=".14" fill="#e0c9b8"/></pattern><linearGradient id="fd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".6" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="mk"><rect width="55" height="85" fill="url(#fd)"/></mask></defs><rect width="55" height="85" fill="url(#dg)" mask="url(#mk)" opacity=".55"/>'
D = layer('', 'background:radial-gradient(90% 50% at 85% 0%,rgba(127,29,29,.75),rgba(127,29,29,0) 70%)') + svg(dots)
# E colored dust (Build palette), no tree
random.seed(5)
cols=['#FF9E47','#61CC80','#54B0E6','#9E8CF2','#E0B842','#EB7AAB','#FF6B0A','#e8dcd0']
d=''
for i in range(260):
    x=random.random()*55; y=random.random()*85; r=.08+random.random()*.22
    c=random.choice(cols); o=.18+random.random()*.5
    d+=f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" fill="{c}" fill-opacity="{o:.2f}"/>'
E = layer('', 'background:radial-gradient(90% 50% at 85% 0%,rgba(127,29,29,.6),rgba(127,29,29,0) 70%)') + svg(d)
# F diagonal streaks
st=''
for i,(x,w,o) in enumerate([(-6,6,.10),(4,2,.07),(11,9,.07),(25,3,.09),(34,10,.06),(48,4,.08),(58,2,.07)]):
    st+=f'<polygon points="{x},85 {x+w},85 {x+w+34},0 {x+34},0" fill="url(#sg)" fill-opacity="{o*5}"/>'
sdef='<defs><linearGradient id="sg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f97316" stop-opacity=".0"/><stop offset=".5" stop-color="#f97316" stop-opacity=".45"/><stop offset="1" stop-color="#7f1d1d" stop-opacity=".1"/></linearGradient></defs>'
F = layer('', 'background:radial-gradient(90% 50% at 85% 0%,rgba(127,29,29,.5),rgba(127,29,29,0) 70%)') + svg(sdef+st)

def mk(bg): return base.replace(OLD, bg)
figs=[("A · Polos","Hitam kemerahan rata, tanpa hiasan. Paling bersih dan paling murah dicetak.",mk(A)),
("B · Gradasi oxblood","Merah marun gelap di atas yang memudar ke hitam. Dalam dan hangat.",mk(B)),
("C · Fajar","Cahaya oranye naik dari bawah, di belakang QR. Terasa seperti era baru dimulai.",mk(C)),
("D · Grid titik","Titik-titik halus seperti matriks, memudar ke bawah. Terasa seperti sistem.",mk(D)),
("E · Debu warna","Debu partikel dengan warna halaman Build, tanpa pohon agent.",mk(E)),
("F · Garis miring","Berkas cahaya miring oranye, menggemakan potongan diagonal logo.",mk(F))]
body='<main class="wrap"><header><p class="eyebrow">Latar depan kartu</p><h1>Enam latar</h1></header><section class="cards">'+"".join(f'<figure>{h}<figcaption><b>{t}</b><span>{dd}</span></figcaption></figure>' for t,dd,h in figs)+'</section></main>'
extra = bp.CSS + """
.wrap{max-width:1100px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,5vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:28px}
figure{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0}
figure .pc{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--sub);line-height:1.45}
figcaption b{color:var(--fg);font-size:14px;font-weight:600}
"""
(root/'backgrounds.html').write_text(page(GF, body, extra))
print('ok')
