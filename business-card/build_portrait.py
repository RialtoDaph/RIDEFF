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

.pc.pk{background:#14080a;color:#fff7ed}
.pk .pt{position:absolute;inset:0;width:100%;height:100%;display:block}
.pk .nm{left:0;right:0;top:calc(35.5 * var(--mm));text-align:center}
.pk .k1{display:block;font-weight:600;font-size:calc(8.2 * var(--mm));line-height:1;letter-spacing:-.035em;color:#fff7ed}
.pk .k2{display:block;margin-top:calc(1.2 * var(--mm));font-weight:500;font-size:calc(4.3 * var(--mm));line-height:1;color:#e3d3c4}
.pk .role{margin-top:calc(2.6 * var(--mm));color:#fb923c}
.pk .div{left:calc(6 * var(--mm));right:calc(6 * var(--mm));bottom:calc(27.5 * var(--mm));height:calc(.3 * var(--mm));background:#3d1f20}
.pk .div i{background:#f97316}
.pk .ct2{left:calc(6 * var(--mm));right:calc(6 * var(--mm));bottom:calc(6 * var(--mm));display:flex;flex-direction:column;gap:calc(2.2 * var(--mm));align-items:center}
.pk .ct2 .r{display:flex;align-items:center;gap:calc(1.9 * var(--mm));font-size:calc(3.5 * var(--mm));font-weight:500;letter-spacing:-.005em;white-space:nowrap;color:#fff7ed;line-height:1.15}
.pk .ct2 .r i{width:calc(1.2 * var(--mm));height:calc(1.2 * var(--mm));border-radius:50%;display:block}
""".replace('MARK', MARK)

PT_JS = r'''<script>
(function(){
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function rgb(h){return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
var COLS=['#FF9E47','#61CC80','#54B0E6','#9E8CF2','#E0B842','#EB7AAB'].map(rgb), OR=rgb('#FF6B0A');
function mixc(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]}
function draw(cv){
 var b=+cv.getAttribute('data-bleed')||0, ppm=650/55;
 cv.width=Math.round((55+2*b)*ppm); cv.height=Math.round((85+2*b)*ppm);
 var c=cv.getContext('2d'); c.globalCompositeOperation='lighter'; var R=rng(11);
 function dot(x,y,r,col,a){var px=(x+b)*ppm,py=(y+b)*ppm,rr=r*ppm,g=c.createRadialGradient(px,py,0,px,py,rr);
  var k=Math.round(col[0])+','+Math.round(col[1])+','+Math.round(col[2]);
  g.addColorStop(0,'rgba('+k+','+a+')');g.addColorStop(.45,'rgba('+k+','+a*.5+')');g.addColorStop(1,'rgba('+k+',0)');
  c.fillStyle=g;c.beginPath();c.arc(px,py,rr,0,6.2832);c.fill()}
 function ball(cx,cy,rad,n,col,rmin,rmax,a){for(var i=0;i<n;i++){var x,y,z,l;do{x=R()*2-1;y=R()*2-1;z=R()*2-1;l=x*x+y*y+z*z}while(l>1||l<.01);
  var q=rad*Math.cbrt(R())/Math.sqrt(l);dot(cx+x*q,cy+y*q,rmin+R()*(rmax-rmin),typeof col==='function'?col():col,a*(0.5+0.5*(z+1)/2))}}
 function seg(x1,y1,x2,y2,n,colf,j,rmin,rmax,a){for(var i=0;i<n;i++){var t=R();dot(x1+(x2-x1)*t+(R()-.5)*j,y1+(y2-y1)*t+(R()-.5)*j,rmin+R()*(rmax-rmin),colf(t),a)}}
 // ambient dust
 for(var i=0;i<280;i++){var gx=R()*55,gy=R()*35;dot(gx,gy,.1+R()*.2,[200,185,170],.22+R()*.2)}
 var cx=27.5, cy=8.6, hy=20.5;
 // glows
 dot(cx,cy,7,OR,.16);
 var hubs=[];for(var k=0;k<6;k++){hubs.push([cx+(k-2.5)*7.4, hy+(k%2?.7:-.7)]); dot(hubs[k][0],hubs[k][1],4.2,COLS[k],.12)}
 // chief
 ball(cx,cy,2.1,520,OR,.12,.3,.95);
 // chief -> hubs, hub -> agents -> tools
 hubs.forEach(function(h,k){
  seg(cx,cy,h[0],h[1],210,function(t){return mixc(OR,COLS[k],t*0.8+R()*.2)},.35,.1,.24,.7);
  ball(h[0],h[1],1.45,190,COLS[k],.11,.26,.95);
  for(var j=0;j<3;j++){var ax=h[0]+(j-1)*2.35, ay=27.2;
   seg(h[0],h[1],ax,ay,60,function(t){return COLS[k]},.18,.08,.18,.6);
   ball(ax,ay,.55,46,COLS[k],.09,.2,.9);
   seg(ax,ay,ax,32.5,34,function(t){return COLS[k]},.14,.07,.15,.5)}
 });
}
function go(){var a=document.querySelectorAll('canvas.pt');for(var i=0;i<a.length;i++)draw(a[i])}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
</script>'''

def pcard(side, bleed=False):
    cls = f"pc {'pf' if side=='front' else 'pb'}{' bleed' if bleed else ''}"
    if side == "front":
        inner = (f'<div class="abs glow"></div><div class="in"><img class="abs logo" src="{MARK}" alt="RIDEFF">'
                 '<div class="abs hl"><h2>We drive you through<b><s>the</s> <span>AGE</span> <s>of</s> <span>AI</span></b></h2></div>'
                 '<div class="abs sub">Agents<span class="d">·</span>Apps<span class="d">·</span>Web</div>'
                 f'<div class="abs qrt">{QR}</div></div>')
    elif side == "backp":
        cls = "pc pk" + (" bleed" if bleed else "")
        inner = (f'<canvas class="pt" data-bleed="{3 if bleed else 0}"></canvas><div class="in">'
                 '<div class="abs nm"><span class="k1">Rialto</span><span class="k2">Daphino Effendy</span><div class="role">Founder &amp; Operator</div></div>'
                 '<div class="abs div"><i></i></div>'
                 '<div class="abs ct2"><div class="r"><i style="background:#61CC80;box-shadow:0 0 .8mm #61CC80"></i>+49 176 32572420</div>'
                 '<div class="r"><i style="background:#54B0E6;box-shadow:0 0 .8mm #54B0E6"></i>hallo@rideff.com</div>'
                 '<div class="r"><i style="background:#FF6B0A;box-shadow:0 0 .8mm #FF6B0A"></i>rideff.com</div></div></div>')
    else:
        inner = ('<div class="abs wm"></div><div class="in"><div class="abs nm" style="top:calc(13.5 * var(--mm))"><h3 style="line-height:1"><span style="font-size:calc(10 * var(--mm));display:block;letter-spacing:-.035em">Rialto</span><span style="font-size:calc(4.9 * var(--mm));display:block;margin-top:calc(1.2 * var(--mm));font-weight:500">Daphino Effendy</span></h3><div class="role">Founder &amp; Operator</div></div>'
                 '<div class="abs div"><i></i></div>'
                 '<dl class="abs ct"><div><dt>WhatsApp</dt><dd>+49 176 32572420</dd></div><div><dt>E-Mail</dt><dd>hallo@rideff.com</dd></div><div><dt>Web</dt><dd>rideff.com</dd></div></dl></div>')
    return f'<div class="{cls}">{inner}</div>'

for name, side, bleed in [("front","front",False),("back","back",False),("front-bleed","front",True),("back-bleed","back",True),("backp","backp",False),("backp-bleed","backp",True)]:
    (root/f"_p-{name}.html").write_text(page("", pcard(side,bleed)+PT_JS, local+mono+CSS+"body{margin:0;width:100vw}"))

body = f'''<main class="wrap"><header><p class="eyebrow">Visitenkarte · hochkant · 55 × 85 mm</p><h1>RIDEFF</h1></header>
<section class="cards"><figure>{pcard("front")}<figcaption>Vorderseite</figcaption></figure><figure>{pcard("backp")}<figcaption>Rückseite · Partikel</figcaption></figure><figure>{pcard("back")}<figcaption>Rückseite · Creme</figcaption></figure></section></main>{PT_JS}'''
extra = CSS + """
.wrap{max-width:1000px;margin:0 auto;padding-block:40px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:32px}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);margin:0 0 6px}
h1{margin:0;font-size:clamp(32px,6vw,48px);letter-spacing:-.03em;font-weight:600}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:28px}
figure{margin:0;display:flex;flex-direction:column;gap:10px;min-width:0}
figure .pc{border-radius:10px;box-shadow:0 18px 40px rgba(23,9,10,.28)}
figcaption{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub)}
"""
(root/'portrait.html').write_text(page(GF, body, extra))
print('portrait ok')
