import build_portrait as bp
from build_portrait import GF, page, root

base = bp.pcard("back")
OLD = '<div class="abs nm"><h3>Rialto<br>Daphino<br>Effendy</h3><div class="role">Founder &amp; Operator</div></div>'
assert OLD in base
mm = lambda v: f'calc({v} * var(--mm))'
def mk(top, h3):
    return base.replace(OLD, f'<div class="abs nm" style="top:{mm(top)}">{h3}<div class="role">Founder &amp; Operator</div></div>')

A = mk(19.5, f'<h3 style="font-size:{mm(3.65)};letter-spacing:-.012em;white-space:nowrap">Rialto Daphino Effendy</h3>')
B = mk(15.5, f'<h3 style="font-size:{mm(5.7)};line-height:1.08">Rialto Daphino<br>Effendy</h3>')
C = mk(13.5, f'<h3 style="line-height:1"><span style="font-size:{mm(10)};display:block;letter-spacing:-.035em">Rialto</span><span style="font-size:{mm(4.9)};display:block;margin-top:{mm(1.2)};font-weight:500">Daphino Effendy</span></h3>')
D = mk(15.5, f'<h3 style="font-size:{mm(5.4)};line-height:1.15"><span style="font-weight:400">Rialto Daphino</span><br><span style="font-weight:700;letter-spacing:.1em;font-size:.9em">EFFENDY</span></h3>')

figs=[("A · Sebaris","Satu baris penuh. Rapi dan formal, tapi hurufnya lebih kecil.",A),
("B · Dua baris","\"Rialto Daphino\" di atas, \"Effendy\" di bawah. Seimbang dan besar.",B),
("C · Nama depan besar","\"Rialto\" besar sebagai pusat, nama lainnya kecil di bawah.",C),
("D · Nama keluarga huruf besar","Nama depan ringan, \"EFFENDY\" tebal huruf besar. Gaya kartu klasik.",D)]
body='<main class="wrap"><header><p class="eyebrow">Penulisan nama · belakang kartu</p><h1>Empat cara</h1></header><section class="cards">'+"".join(f'<figure>{h}<figcaption><b>{t}</b><span>{d}</span></figcaption></figure>' for t,d,h in figs)+'</section></main>'
extra = bp.CSS + """
.wrap{max-width:1040px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,5vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:28px}
figure{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0}
figure .pc{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--sub);line-height:1.45}
figcaption b{color:var(--fg);font-size:14px;font-weight:600}
"""
(root/'names.html').write_text(page(GF, body, extra))
print('ok')
