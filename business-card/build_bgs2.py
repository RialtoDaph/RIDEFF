import math, random
import build_portrait as bp
from build_portrait import GF, page, root

base = bp.pcard("front")
OLD = '<div class="abs" style="inset:0;background:radial-gradient(120% 70% at 50% -10%,#5c1416 0%,#2b0e10 45%,#14080a 80%)"></div>'
assert OLD in base
def layer(style): return f'<div class="abs" style="inset:0;{style}"></div>'
def svg(inner, defs=''): return f'<svg viewBox="0 0 55 85" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;display:block" xmlns="http://www.w3.org/2000/svg"><defs>{defs}</defs>{inner}</svg>'
random.seed(3)

# 1 aurora
b1 = layer('background:radial-gradient(60% 34% at 18% 6%,rgba(249,115,22,.60),transparent 72%),radial-gradient(55% 34% at 84% 12%,rgba(235,122,171,.42),transparent 72%),radial-gradient(75% 40% at 50% -4%,rgba(158,140,242,.40),transparent 72%),#14080a')
# 2 sun rise
b2 = layer('background:radial-gradient(70% 42% at 50% 104%,#fb923c 0%,rgba(249,115,22,.62) 24%,rgba(127,29,29,.40) 50%,transparent 78%),#14080a')
# 3 perspective road/grid in bottom
g=''
hz=57
for x in range(-60,116,9):
    g+=f'<line x1="{27.5}" y1="{hz}" x2="{x}" y2="85" stroke="#f97316" stroke-opacity=".30" stroke-width=".18"/>'
y=hz; step=.9
while y<85:
    y+=step; step*=1.28
    g+=f'<line x1="0" y1="{y:.2f}" x2="55" y2="{y:.2f}" stroke="#f97316" stroke-opacity=".26" stroke-width=".18"/>'
b3 = layer('background:radial-gradient(90% 45% at 50% 70%,rgba(127,29,29,.40),transparent 70%)')+svg(g)
# 4 light trails at edges
tr=''
for side in (0,1):
    for i in range(9):
        x=(random.random()*6+1.5) if side==0 else (55-(random.random()*6+1.5))
        y0=random.random()*60; L=10+random.random()*38
        col=random.choice(['#f97316','#fb923c','#ff6b0a','#ef4444','#fbbf24'])
        w=.2+random.random()*.5; tr+=f'<rect x="{x-w/2:.2f}" y="{y0:.1f}" width="{w:.2f}" height="{L:.1f}" rx="{w/2:.2f}" fill="url(#tg)" fill-opacity="{.6+random.random()*.4:.2f}"/>'
tdefs='<linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f97316" stop-opacity="0"/><stop offset=".7" stop-color="#f97316" stop-opacity=".9"/><stop offset="1" stop-color="#fff7ed" stop-opacity="1"/></linearGradient>'
b4 = layer('background:radial-gradient(90% 40% at 50% -5%,rgba(127,29,29,.55),transparent 70%)')+svg(tr,tdefs)
# 5 contours
cs=''
cx,cy=48,10
for k in range(1,17):
    pts=[]
    for a in range(0,360,6):
        r=k*3.1*(1+.10*math.sin(math.radians(a)*3+k*.6)+.06*math.sin(math.radians(a)*5-k))
        pts.append((cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a))*1.15))
    cs+='<polyline points="'+" ".join(f"{x:.2f},{y:.2f}" for x,y in pts)+f' {pts[0][0]:.2f},{pts[0][1]:.2f}" fill="none" stroke="#c2410c" stroke-opacity="{.5-k*.022:.2f}" stroke-width=".18"/>'
b5 = layer('background:radial-gradient(70% 40% at 90% 0%,rgba(127,29,29,.5),transparent 70%)')+svg(cs)
# 6 circuit
ck=''
paths=[("M0 12 H9 V20 H14",14,20),("M0 30 H6 V40 H11 V48",11,48),("M55 10 H46 V19 H41",41,19),("M55 33 H49 V45 H44 V52",44,52),("M0 66 H8 V74 H15",15,74),("M55 64 H47 V73 H40",40,73),("M20 0 V5 H27",27,5),("M36 0 V4 H31",31,4)]
for d,x,y in paths:
    ck+=f'<path d="{d}" fill="none" stroke="#f97316" stroke-opacity=".38" stroke-width=".22"/><circle cx="{x}" cy="{y}" r=".55" fill="#f97316" fill-opacity=".75"/>'
b6 = layer('background:radial-gradient(70% 40% at 15% 0%,rgba(127,29,29,.5),transparent 70%)')+svg(ck)
# 7 halftone top
ht=''
sp=2.2
for j in range(0,16):
    for i in range(0,26):
        x=i*sp+(sp/2 if j%2 else 0); y=j*sp*.9
        r=max(0,(1-y/33))**1.3*.95
        if r>.08: ht+=f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" fill="#9a2a1a" fill-opacity=".85"/>'
b7 = svg(ht)
# 8 sonar
sn=''
for k in range(1,14):
    sn+=f'<circle cx="27.5" cy="14" r="{k*5.2:.1f}" fill="none" stroke="#f97316" stroke-opacity="{max(.03,.34-k*.025):.2f}" stroke-width=".18"/>'
b8 = layer('background:radial-gradient(45% 20% at 50% 16%,rgba(127,29,29,.55),transparent 70%)')+svg(sn)
# 9 spotlight
b9 = layer('background:radial-gradient(52% 26% at 50% 16%,rgba(235,90,40,.60),rgba(127,29,29,.35) 45%,transparent 75%),radial-gradient(80% 30% at 50% 100%,rgba(127,29,29,.45),transparent 70%),#14080a')
# 10 diagonal slash
wd='<polygon points="0,0 55,0 55,20 0,50" fill="url(#wg)"/><line x1="0" y1="50" x2="55" y2="20" stroke="#f97316" stroke-opacity=".6" stroke-width=".25"/>'
wdefs='<linearGradient id="wg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7f1d1d" stop-opacity=".75"/><stop offset="1" stop-color="#7f1d1d" stop-opacity=".25"/></linearGradient>'
b10 = svg(wd,wdefs)
# 11 logo bars
bars=''
for i,(y,w) in enumerate([(3,34),(5.2,24),(7.4,14)]):
    bars+=f'<rect x="{55-w}" y="{y}" width="{w}" height=".9" fill="url(#bg1)"/>'
for i,(y,w) in enumerate([(78,34),(80.2,24),(82.4,14)]):
    bars+=f'<rect x="0" y="{y}" width="{w}" height=".9" fill="url(#bg2)"/>'
bd='<linearGradient id="bg1" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#f97316" stop-opacity=".9"/><stop offset="1" stop-color="#f97316" stop-opacity="0"/></linearGradient><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f97316" stop-opacity=".9"/><stop offset="1" stop-color="#f97316" stop-opacity="0"/></linearGradient>'
b11 = layer('background:radial-gradient(80% 40% at 50% 0%,rgba(127,29,29,.45),transparent 70%)')+svg(bars,bd)
# 12 mesh
b12 = layer('background:radial-gradient(60% 40% at 12% 8%,rgba(127,29,29,.85),transparent 70%),radial-gradient(60% 40% at 92% 38%,rgba(70,50,140,.55),transparent 70%),radial-gradient(70% 40% at 20% 100%,rgba(190,70,20,.50),transparent 70%),radial-gradient(60% 30% at 90% 100%,rgba(80,40,120,.45),transparent 70%),#14080a')

items=[("1 · Aurora","Cahaya oranye, merah muda, dan ungu lembut di atas, warna halaman Build.",b1),
("2 · Matahari terbit","Cahaya oranye terang naik dari bawah, QR seperti titik tujuan.",b2),
("3 · Jalan malam","Garis perspektif oranye seperti jalan menuju horizon. Pas dengan \"drive\".",b3),
("4 · Jejak cahaya","Garis cahaya di kiri dan kanan, seperti lampu mobil malam hari.",b4),
("5 · Kontur","Garis kontur seperti peta topografi dari pojok kanan atas.",b5),
("6 · Sirkuit","Jalur sirkuit oranye dengan simpul, menunjukkan sistem.",b6),
("7 · Halftone","Titik-titik besar mengecil dari atas, seperti cetakan poster.",b7),
("8 · Sonar","Lingkaran memancar dari logo seperti sinyal.",b8),
("9 · Sorot","Cahaya merah-oranye di belakang logo, membuat logo menyala.",b9),
("10 · Tebasan","Bidang miring marun dengan garis oranye, seperti potongan logo.",b10),
("11 · Garis logo","Batang oranye mengecil dari tepi, seperti garis di logo RDE.",b11),
("12 · Mesh gelap","Campuran marun, ungu, dan oranye redup yang dalam.",b12)]
def mk(bg): return base.replace(OLD, bg)
body='<main class="wrap"><header><p class="eyebrow">Latar depan kartu · gelombang dua</p><h1>Dua belas latar</h1></header><section class="cards">'+"".join(f'<figure>{mk(b)}<figcaption><b>{t}</b><span>{d}</span></figcaption></figure>' for t,d,b in items)+'</section></main>'
extra = bp.CSS + """
.wrap{max-width:1180px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,5vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:26px}
figure{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0}
figure .pc{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--sub);line-height:1.45}
figcaption b{color:var(--fg);font-size:14px;font-weight:600}
"""
(root/'backgrounds2.html').write_text(page(GF, body, extra))
print('ok')
