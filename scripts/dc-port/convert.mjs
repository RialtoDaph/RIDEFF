#!/usr/bin/env node
/**
 * One-shot porter: rideff_handoff/design/*.dc.html → src/components/dc/*.tsx
 *
 * The prototypes are React templates ({{ }} holes, <sc-if>, <sc-for>, <dc-import>) plus a
 * `class Component extends DCLogic` that owns state and computes `renderVals()`. This turns
 * each template into JSX inside a `render()` of the same class (base: src/lib/dc.tsx), so
 * layout, copy, data and timings stay exactly as designed. On the way it
 *   - replaces English text and JS string literals with next-intl keys (src/i18n/keymap.json),
 *   - maps `*.dc.html` links to locale routes and `assets/…` to /images and /media,
 *   - turns `style-hover` into classes in src/styles/dc-hover.css.
 * The output is then edited by hand; this script is kept for reference and is not re-run
 * over edited files (pass --force to overwrite).
 *
 *   node scripts/dc-port/convert.mjs "RIDEFF About" About [--force]
 *   node scripts/dc-port/convert.mjs --all [--force]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseFragment } from 'parse5';
import { parse as babelParse } from '@babel/parser';
import _traverse from '@babel/traverse';
import _generate from '@babel/generator';

const traverse = _traverse.default ?? _traverse;
const generate = _generate.default ?? _generate;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const DESIGN = path.join(root, 'rideff_handoff/design');
const OUT = path.join(root, 'src/components/dc');
const keymap = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/keymap.json'), 'utf8'));

/** prototype file → [component name, i18n namespace] */
export const FILES = {
  'RideffNav': ['Nav', 'RideffNav'],
  'RideffFooter': ['Footer', 'RideffFooter'],
  'RideffNana': ['Nana', 'RideffNana'],
  'RIDEFF Home': ['HomePage', 'Home'],
  'RIDEFF Understand': ['UnderstandPage', 'Understand'],
  'RIDEFF Build': ['BuildPage', 'Build'],
  'RIDEFF Storefront': ['StorefrontPage', 'Storefront'],
  'RIDEFF Workbench': ['WorkbenchPage', 'Workbench'],
  'RIDEFF Run': ['RunPage', 'Run'],
  'RIDEFF Work': ['WorkPage', 'Work'],
  'RIDEFF Life': ['LifePage', 'Life'],
  'RIDEFF Pricing': ['PricingPage', 'Pricing'],
  'RIDEFF About': ['AboutPage', 'About'],
  'RIDEFF Contact': ['ContactPage', 'Contact'],
  'RIDEFF Journal': ['JournalPage', 'Journal'],
  'RIDEFF Rechtliches': ['LegalPage', null],
  'RIDEFF Business Demo': ['BusinessDemo', 'Demo'],
};

const ROUTES = {
  'RIDEFF Home': '/', 'RIDEFF Understand': '/understand', 'RIDEFF Build': '/build',
  'RIDEFF Storefront': '/build/web-shops', 'RIDEFF Workbench': '/build/team-apps', 'RIDEFF Run': '/run',
  'RIDEFF Work': '/work', 'RIDEFF Life': '/life', 'RIDEFF Pricing': '/pricing', 'RIDEFF About': '/about',
  'RIDEFF Contact': '/contact', 'RIDEFF Journal': '/journal', 'RIDEFF Business Demo': '/demo',
  'RIDEFF Portal': '@portal', 'RIDEFF Life Demo': '@lifedemo',
};
const LEGAL = { impressum: '/impressum', datenschutz: '/datenschutz', agb: '/agb' };

/** "RIDEFF Work.dc.html#x" → "/work#x" (internal route for v.href) or null */
export function routeOf(href) {
  const m = /^(RIDEFF [A-Za-z ]+|Rideff\w+)\.dc\.html(\?[^#]*)?(#.*)?$/.exec(href);
  if (!m) return null;
  if (m[1] === 'RIDEFF Rechtliches') return LEGAL[(m[3] || '#impressum').slice(1)] ?? '/impressum';
  const r = ROUTES[m[1]];
  if (!r) throw new Error('unknown page ' + href);
  return r + (m[2] || '') + (m[3] || '');
}
const assetOf = (s) => s.replace(/^(\.\/)?assets\/(rideff-intro\.mp4)$/, '/media/$2').replace(/^(\.\/)?assets\//, '/images/');

// ---------------------------------------------------------------- i18n lookup
const norm = (s) => s.replace(/\s+/g, ' ').trim();
function lookup(ns, s, report, own = false) {
  const tryNs = (n) => keymap[n] && (keymap[n][s] ?? keymap[n][norm(s)]);
  if (ns) { const k = tryNs(ns); if (k) return `${ns}.${k}`; }
  if (own) return null;
  for (const n of Object.keys(keymap)) {
    const k = tryNs(n);
    if (k) { report.fallback.add(`${n}: ${norm(s)}`); return `${n}.${k}`; }
  }
  return null;
}

// ---------------------------------------------------------------- expressions
function splitTop(expr, ops) {
  let depth = 0, q = null;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (depth === 0) for (const op of ops) if (expr.startsWith(op, i)) return { i, op };
  }
  return null;
}
function wrapsWhole(e) {
  if (e[0] !== '(' || e[e.length - 1] !== ')') return false;
  let d = 0;
  for (let i = 0; i < e.length; i++) { if (e[i] === '(') d++; else if (e[i] === ')') { d--; if (d === 0 && i < e.length - 1) return false; } }
  return true;
}
function expr(src, scope) {
  const e = String(src).trim();
  if (wrapsWhole(e)) return `(${expr(e.slice(1, -1), scope)})`;
  const eq = splitTop(e, ['===', '!==', '==', '!=']);
  if (eq) return `${expr(e.slice(0, eq.i), scope)} ${eq.op} ${expr(e.slice(eq.i + eq.op.length), scope)}`;
  if (e[0] === '!') return `!${expr(e.slice(1), scope)}`;
  if (['true', 'false', 'null', 'undefined'].includes(e) || /^-?\d+(\.\d+)?$/.test(e)) return e;
  if (/^(['"]).*\1$/.test(e)) return JSON.stringify(e.slice(1, -1));
  const parts = e.split('.');
  const head = parts[0];
  if (!/^[A-Za-z_$][\w$]*$/.test(head)) throw new Error('bad expr ' + e);
  const base = scope.has(head) ? head : `v.${head}`;
  return [base, ...parts.slice(1)].join('?.');
}
const holeRe = /\{\{([\s\S]+?)\}\}/g;
const isWhole = (raw) => /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(raw);
function attrValue(raw, scope) {
  const w = isWhole(raw);
  if (w) return `{${expr(w[1], scope)}}`;
  if (raw.includes('{{')) {
    const parts = raw.split(holeRe);
    return '{`' + parts.map((p, i) => (i & 1 ? '${' + expr(p, scope) + " ?? ''}" : p.replace(/[`\\]|\$\{/g, (m) => '\\' + m))).join('') + '`}';
  }
  return JSON.stringify(raw).replace(/^"|"$/g, '"');
}

// ---------------------------------------------------------------- attributes
const EVENTS = Object.fromEntries(
  ['onClick', 'onDoubleClick', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseDown', 'onMouseUp', 'onMouseOver', 'onMouseOut',
    'onPointerDown', 'onPointerUp', 'onPointerMove', 'onPointerEnter', 'onPointerLeave', 'onTouchStart', 'onTouchMove', 'onTouchEnd',
    'onChange', 'onInput', 'onKeyDown', 'onKeyUp', 'onKeyPress', 'onSubmit', 'onFocus', 'onBlur', 'onScroll', 'onWheel', 'onLoad',
    'onEnded', 'onTimeUpdate', 'onPlay', 'onPause', 'onLoadedMetadata', 'onCanPlay', 'onError', 'onTransitionEnd', 'onAnimationEnd',
    'onContextMenu', 'onDragStart', 'onDrop', 'onDragOver'].map((n) => [n.toLowerCase(), n]),
);
const ATTRS = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', maxlength: 'maxLength', minlength: 'minLength', readonly: 'readOnly',
  autocomplete: 'autoComplete', autofocus: 'autoFocus', playsinline: 'playsInline', autoplay: 'autoPlay', crossorigin: 'crossOrigin',
  colspan: 'colSpan', rowspan: 'rowSpan', srcset: 'srcSet', enterkeyhint: 'enterKeyHint', inputmode: 'inputMode', spellcheck: 'spellCheck',
  contenteditable: 'contentEditable', frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen', datetime: 'dateTime',
  novalidate: 'noValidate', viewbox: 'viewBox', preserveaspectratio: 'preserveAspectRatio', 'xlink:href': 'xlinkHref',
  'accept-charset': 'acceptCharset', 'http-equiv': 'httpEquiv', charset: 'charSet', referrerpolicy: 'referrerPolicy',
};
const BOOL = new Set(['muted', 'playsinline', 'autoplay', 'loop', 'controls', 'disabled', 'checked', 'readonly', 'required', 'autofocus',
  'hidden', 'open', 'multiple', 'selected', 'novalidate', 'allowfullscreen', 'defer', 'async']);
const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const hoverRules = new Map();
function hoverClass(css) {
  const k = crypto.createHash('sha1').update(css).digest('hex').slice(0, 7);
  const decl = css.split(';').map((d) => d.trim()).filter(Boolean).map((d) => (d.includes('!important') ? d : d + ' !important')).join(';');
  hoverRules.set(`hv-${k}`, `.hv-${k}:hover{${decl}}`);
  return `hv-${k}`;
}

function styleObj(raw, scope) {
  const w = isWhole(raw);
  if (w) return `{dcStyle(${expr(w[1], scope)})}`;
  const out = [];
  // split on ; outside of holes and parentheses (url(data:…;…))
  const decls = [];
  let cur = '', depth = 0;
  for (let i = 0; i < raw.length; i++) {
    if (raw.startsWith('{{', i)) { const j = raw.indexOf('}}', i); cur += raw.slice(i, j + 2); i = j + 1; continue; }
    const c = raw[i];
    if (c === '(') depth++; else if (c === ')') depth--;
    if (c === ';' && depth === 0) { decls.push(cur); cur = ''; } else cur += c;
  }
  decls.push(cur);
  for (const d of decls) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    const prop = d.slice(0, i).trim();
    let val = d.slice(i + 1).trim();
    const key = prop.startsWith('--') ? JSON.stringify(prop) : /^[a-zA-Z]+$/.test(kebabToCamel(prop)) ? kebabToCamel(prop) : JSON.stringify(kebabToCamel(prop));
    if (val.includes('{{')) {
      const parts = val.split(holeRe);
      val = '`' + parts.map((p, n) => (n & 1 ? '${' + expr(p, scope) + " ?? ''}" : p.replace(/[`\\]|\$\{/g, (m) => '\\' + m))).join('') + '`';
    } else val = JSON.stringify(val);
    out.push(`${key}: ${val}`);
  }
  return `{{ ${out.join(', ')} }}`;
}

// ---------------------------------------------------------------- template → JSX
const BLOCKISH = /display\s*:\s*(flex|grid|inline-flex|inline-grid)/;
function jsText(s) { return `{${JSON.stringify(s)}}`; }

function makeCtx(ns, report, dcImports) { return { ns, report, dcImports }; }

function textNode(raw, scope, ctx, parentFlex) {
  if (!raw.includes('{{')) {
    if (!raw.trim()) return raw.includes(' ') && !parentFlex ? '{" "}' : '';
    const lead = /^\s/.test(raw) ? ' ' : '', trail = /\s$/.test(raw) && norm(raw) ? ' ' : '';
    const key = lookup(ctx.ns, raw, ctx.report);
    if (key) return (lead ? '{" "}' : '') + `{v.t(${JSON.stringify(key)})}` + (trail ? '{" "}' : '');
    if (/[A-Za-z]{3,}/.test(raw)) ctx.report.missing.add(norm(raw));
    return jsText(lead + norm(raw) + trail);
  }
  // text with holes: try "{x}" pattern
  const holes = [];
  const pattern = raw.replace(holeRe, (_, h) => { holes.push(h); return '{x}'; });
  const lead = /^\s/.test(raw) ? '{" "}' : '', trail = /\s$/.test(raw) ? '{" "}' : '';
  const key = norm(pattern) !== '{x}' && lookup(ctx.ns, pattern, ctx.report);
  if (key) {
    const names = ['x', 'y', 'z', 'w'];
    return lead + `{v.t(${JSON.stringify(key)}, { ${holes.map((h, i) => `${names[i]}: ${expr(h, scope)}`).join(', ')} })}` + trail;
  }
  // No key for the whole pattern: translate each static fragment on its own (this is
  // what the prototype's runtime translator did, node by node).
  const parts = raw.split(holeRe);
  const demo = ctx.ns === 'Demo';
  return parts.map((p, i) => {
    if (i & 1) return demo ? `{v.tx(${expr(p, scope)})}` : `{${expr(p, scope)}}`;
    if (!p) return '';
    if (!p.trim()) return p.includes(' ') ? '{" "}' : '';
    const k = lookup(ctx.ns, p, ctx.report, true);
    if (k) return (/^\s/.test(p) ? '{" "}' : '') + `{v.t(${JSON.stringify(k)})}` + (/\s$/.test(p) ? '{" "}' : '');
    if (/[A-Za-z]{3,}/.test(p)) ctx.report.missing.add('[part] ' + norm(p));
    return jsText(p.replace(/\s+/g, ' '));
  }).join('');
}

function attrsOf(node) { return Object.fromEntries(node.attrs.map((a) => [a.prefix ? `${a.prefix}:${a.name}` : a.name, a.value])); }

function element(node, scope, ctx, indent) {
  const tag = node.tagName;
  const A = attrsOf(node);
  const pad = '  '.repeat(indent);
  const kids = (n, sc = scope) => children(n, sc, ctx, indent + 1);

  if (tag === 'sc-if') {
    return `${pad}{${expr(isWhole(A.value)[1], scope)} ? (<>\n${kids(node)}\n${pad}</>) : null}`;
  }
  if (tag === 'sc-for') {
    const as = A.as || 'item';
    const sc = new Set(scope); sc.add(as); sc.add('$index');
    return `${pad}{(${expr(isWhole(A.list)[1], scope)} ?? []).map((${as}, $index) => (<Fragment key={$index}>\n${kids(node, sc)}\n${pad}</Fragment>))}`;
  }
  if (tag === 'dc-import') {
    const name = A.name;
    if (name === 'RideffNana') return '';
    const comp = FILES[name][0];
    ctx.dcImports.add(comp);
    const props = Object.entries(A).filter(([k]) => !['name', 'hint-size'].includes(k)).map(([k, val]) => `${kebabToCamel(k)}=${attrValue(val, scope)}`);
    return `${pad}<${comp} ${props.join(' ')} />`;
  }
  if (tag === 'helmet') {
    const css = node.childNodes.filter((c) => c.tagName === 'style').map((c) => c.childNodes.map((t) => t.value).join('')).join('\n');
    return css.trim() ? `${pad}<style dangerouslySetInnerHTML={{ __html: ${JSON.stringify(css.trim())} }} />` : '';
  }
  if (tag === 'image-slot') {
    const props = [];
    if (A.src) props.push(A.src.includes('{{') ? `src=${attrValue(A.src, scope)}` : `src=${JSON.stringify(assetOf(A.src))}`);
    if (A.placeholder && A.placeholder.includes('{{')) props.push(`alt=${attrValue(A.placeholder, scope)}`);
    else if (A.placeholder) {
      const key = lookup(ctx.ns, A.placeholder, ctx.report);
      props.push(key ? `alt={v.t(${JSON.stringify(key)})}` : `alt=${JSON.stringify(A.placeholder)}`);
    }
    if (A.shape) props.push(`shape=${JSON.stringify(A.shape)}`);
    if (A.radius) props.push(`radius={${Number(A.radius)}}`);
    if (A.style) props.push(`style=${styleObj(A.style, scope)}`);
    ctx.dcImports.add('ImageSlot');
    return `${pad}<ImageSlot ${props.join(' ')} />`;
  }
  if (tag === 'script') return '';

  const props = [];
  const classes = [];
  let dynClass = null;
  for (const [k, raw] of Object.entries(A)) {
    if (k === 'style') { props.push(`style=${styleObj(raw, scope)}`); continue; }
    if (k.startsWith('style-')) {
      if (k !== 'style-hover') throw new Error('pseudo ' + k);
      if (raw.includes('{{')) throw new Error('hover hole');
      classes.push(hoverClass(raw));
      continue;
    }
    if (k === 'class') { if (raw.includes('{{')) dynClass = attrValue(raw, scope).slice(1, -1); else classes.push(raw); continue; }
    if (k === 'ref') { props.push(`ref=${attrValue(raw, scope)}`); continue; }
    if (k.startsWith('on')) {
      const ev = EVENTS[k];
      if (!ev) throw new Error('event ' + k);
      props.push(`${ev}=${attrValue(raw, scope)}`);
      continue;
    }
    let name = ATTRS[k] ?? (k.startsWith('data-') || k.startsWith('aria-') ? k : k.includes('-') ? kebabToCamel(k) : k);
    if (raw === '' && BOOL.has(k)) { props.push(`${name}`); continue; }
    if ((k === 'href' || k === 'src' || k === 'poster') && !raw.includes('{{')) {
      const r = routeOf(raw);
      if (r) { props.push(`${name}={v.href(${JSON.stringify(r)})}`); continue; }
      if (/^(\.\/)?assets\//.test(raw)) { props.push(`${name}=${JSON.stringify(assetOf(raw))}`); continue; }
    }
    if ((k === 'placeholder' || k === 'aria-label' || k === 'title' || k === 'alt') && !raw.includes('{{')) {
      const key = lookup(ctx.ns, raw, ctx.report);
      if (key) { props.push(`${name}={v.t(${JSON.stringify(key)})}`); continue; }
    }
    let val = attrValue(raw, scope);
    if (k === 'value' && val.startsWith('{') && (tag === 'input' || tag === 'textarea' || tag === 'select')) val = `{${val.slice(1, -1)} ?? ''}`;
    if (k === 'checked' && val.startsWith('{')) val = `{!!(${val.slice(1, -1)})}`;
    props.push(`${name}=${val}`);
  }
  if (classes.length || dynClass) {
    props.push(dynClass ? `className={[${JSON.stringify(classes.join(' '))}, ${dynClass}].filter(Boolean).join(' ')}` : `className=${JSON.stringify(classes.join(' '))}`);
  }
  const open = `${pad}<${tag}${props.length ? ' ' + props.join(' ') : ''}`;
  const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source', 'area', 'col', 'wbr', 'track', 'embed', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'stop']);
  const childList = node.tagName === 'template' ? node.content.childNodes : node.childNodes;
  if (!childList.length && VOID.has(tag)) return `${open} />`;
  if (tag === 'textarea') {
    const t = childList.map((c) => c.value ?? '').join('');
    if (t.trim()) props.push(`defaultValue=${attrValue(t, scope)}`);
    return `${pad}<textarea${props.length ? ' ' + props.join(' ') : ''} />`;
  }
  const body = children(node, scope, ctx, indent + 1, BLOCKISH.test(A.style || ''));
  if (!body.trim()) return `${open} />`;
  return `${open}>\n${body}\n${pad}</${tag}>`;
}

function children(node, scope, ctx, indent, parentFlex = false) {
  const list = node.tagName === 'template' ? node.content.childNodes : node.childNodes;
  const pad = '  '.repeat(indent);
  const out = [];
  for (const c of list) {
    if (c.nodeName === '#comment') continue;
    if (c.nodeName === '#text') { const t = textNode(c.value, scope, ctx, parentFlex); if (t) out.push(pad + t); continue; }
    const el = element(c, scope, ctx, indent);
    if (el) out.push(el);
  }
  return out.join('\n');
}

// ---------------------------------------------------------------- logic
function portLogic(js, ns, report) {
  const ast = babelParse(js, { sourceType: 'script', plugins: ['classProperties'] });
  const t = (key, args) => ({
    type: 'CallExpression',
    callee: { type: 'MemberExpression', object: { type: 'MemberExpression', object: { type: 'ThisExpression' }, property: { type: 'Identifier', name: 'props' } }, property: { type: 'Identifier', name: 't' } },
    arguments: [{ type: 'StringLiteral', value: key }, ...(args ? [args] : [])],
  });
  const hrefCall = (r) => ({
    type: 'CallExpression',
    callee: { type: 'MemberExpression', object: { type: 'MemberExpression', object: { type: 'ThisExpression' }, property: { type: 'Identifier', name: 'props' } }, property: { type: 'Identifier', name: 'href' } },
    arguments: [{ type: 'StringLiteral', value: r }],
  });
  traverse(ast, {
    StringLiteral(p) {
      const parent = p.parent;
      if ((parent.type === 'ObjectProperty' || parent.type === 'ClassProperty') && parent.key === p.node && !parent.computed) return;
      if (parent.type === 'CallExpression' && parent.arguments[0] === p.node && parent.callee.property && parent.callee.property.name === 't') return;
      const s = p.node.value;
      const r = routeOf(s);
      if (r) { p.replaceWith(hrefCall(r)); p.skip(); return; }
      if (/^(\.\/)?assets\//.test(s)) { p.node.value = assetOf(s); delete p.node.extra; return; }
      if (!s.trim()) return;
      if (/^[a-z][a-z0-9_-]*$/.test(s)) { if (lookup(ns, s, report, true)) report.identLike.add(s); return; }
      const key = lookup(ns, s, report, true);
      if (!key) {
        if (/[A-Za-z]{3,}\s+[A-Za-z]{2,}/.test(s) && !/[;:{}]|^[a-z-]+\(|^#|^https?:|\.(png|jpg|mp4)$/.test(s)) report.missingJs.add(s);
        return;
      }
      const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0];
      const exact = keymap[key.split('.')[0]][s] !== undefined;
      let node = t(key);
      if (!exact && (lead || trail)) {
        if (lead) node = { type: 'BinaryExpression', operator: '+', left: { type: 'StringLiteral', value: lead }, right: node };
        if (trail) node = { type: 'BinaryExpression', operator: '+', left: node, right: { type: 'StringLiteral', value: trail } };
      }
      p.replaceWith(node);
      p.skip();
    },
    TemplateLiteral(p) {
      if (p.parent.type === 'TaggedTemplateExpression') return;
      const q = p.node.quasis.map((x) => x.value.cooked);
      if (!p.node.expressions.length) return;
      const pattern = q.join('{x}');
      const key = norm(pattern) !== '{x}' && lookup(ns, pattern, report);
      if (key) {
        const names = ['x', 'y', 'z', 'w'];
        p.replaceWith(t(key, { type: 'ObjectExpression', properties: p.node.expressions.map((e, i) => ({ type: 'ObjectProperty', key: { type: 'Identifier', name: names[i] }, value: e, computed: false, shorthand: false })) }));
        p.skip();
      } else if (/[A-Za-z]{3,}\s+[A-Za-z]{2,}/.test(q.join(' ')) && !/[;:{}]|\(/.test(q.join(''))) report.missingJs.add('`' + pattern + '`');
    },
  });
  return generate(ast, { retainLines: false, jsescOption: { minimal: true } }).code;
}

/** next/font hashes family names: refer to the CSS variables instead. */
const fonts = (s) => s
  .replace(/'Geist Mono',\s*monospace/g, 'var(--font-mono)')
  .replace(/'Instrument Serif',\s*serif/g, 'var(--font-accent)')
  .replace(/(?:'Geist'|\bGeist),\s*(?:system-ui,\s*)?sans-serif/g, 'var(--font-sans)');

// ---------------------------------------------------------------- file
export function convert(file, force = false) {
  const [comp, ns] = FILES[file];
  const out = path.join(OUT, `${comp}.tsx`);
  if (fs.existsSync(out) && !force) { console.log(`skip ${comp} (exists)`); return; }
  const html = fs.readFileSync(path.join(DESIGN, `${file}.dc.html`), 'utf8');
  const tpl = /<x-dc>([\s\S]*?)<\/x-dc>/.exec(html)[1];
  const scriptM = /<script type="text\/x-dc" data-dc-script([^>]*)>([\s\S]*?)<\/script>/.exec(html);
  const report = { missing: new Set(), missingJs: new Set(), fallback: new Set(), identLike: new Set() };
  const dcImports = new Set();
  const ctx = makeCtx(ns, report, dcImports);
  const frag = parseFragment(tpl.replace(/<helmet>/g, '<template data-helmet>').replace(/<\/helmet>/g, '</template>'));
  // restore helmet nodes
  const fix = (n) => { for (const c of n.childNodes || []) { if (c.tagName === 'template' && c.attrs.some((a) => a.name === 'data-helmet')) { c.tagName = 'helmet'; c.childNodes = c.content.childNodes; } fix(c.tagName === 'template' ? c.content : c); } };
  fix(frag);
  const jsx = children(frag, new Set(), ctx, 3);
  let logic = scriptM ? scriptM[2] : 'class Component extends DCLogic {}';
  logic = portLogic(logic, ns, report).replace(/class Component extends DCLogic/, 'class Logic extends DCLogic');

  const imports = [...dcImports].filter((c) => c !== comp).map((c) => c === 'ImageSlot' ? `import { ImageSlot } from '@/lib/dc';` : `import ${c} from '@/components/dc/${c}';`);
  const src = `// @ts-nocheck -- ported 1:1 from rideff_handoff/design/${file}.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, useDC } from '@/lib/dc';
${imports.join('\n')}

${logic}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
${jsx}
    </>
  );
};

export default function ${comp}(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
`;
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(out, fonts(src));
  const rep = path.join(root, 'scripts/dc-port/reports', `${comp}.txt`);
  fs.mkdirSync(path.dirname(rep), { recursive: true });
  fs.writeFileSync(rep, [`# ${file}`, '## template text without key', ...report.missing, '', '## JS strings without key', ...report.missingJs, '', '## found in other namespace', ...report.fallback, '', '## identifier-like JS strings left untranslated (have a key)', ...report.identLike].join('\n') + '\n');
  console.log(`${comp}: ${report.missing.size} text, ${report.missingJs.size} js unmatched, ${report.fallback.size} fallback`);
}

function writeHover() {
  const file = path.join(root, 'src/styles/dc-hover.css');
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter((l) => l.startsWith('.hv-')) : [];
  const all = new Map(prev.map((l) => [l.slice(1, l.indexOf(':')), l]));
  for (const [k, r] of hoverRules) all.set(k, r);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `/* generated by scripts/dc-port/convert.mjs from style-hover attributes */\n@media (hover: hover) {\n${[...all.values()].sort().map((r) => '  ' + r).join('\n')}\n}\n`.replace(/\n {2}\./g, '\n.'));
}

const args = process.argv.slice(2);
const force = args.includes('--force');
const names = args.includes('--all') ? Object.keys(FILES) : args.filter((a) => !a.startsWith('--')).slice(0, 1);
for (const f of names) convert(f, force);
writeHover();
