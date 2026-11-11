"use client";

import ClosingScene from "./ClosingScene";
import { CAL_URL, WHATSAPP_URL } from "@/lib/site";

type T = (key: string, values?: Record<string, string | number>) => string;

const CSS = `
.pc{background:#0B0B0C;color:#F4F4F2}
.pc-in{max-width:1480px;margin:0 auto;padding:0 clamp(20px,3vw,40px) clamp(88px,9vw,130px);display:flex;flex-direction:column;gap:clamp(22px,2.4vw,32px)}
.pc-label{font:400 12px var(--font-mono);letter-spacing:.1em;text-transform:uppercase;color:#8C877E}
.pc-h{margin:0;font-size:clamp(38px,4.9vw,82px);line-height:.96;letter-spacing:-0.05em;font-weight:600;max-width:1100px;text-wrap:balance}
.pc-h span{color:#FF6A00;display:block}
.pc-body{margin:0;font-size:clamp(16px,1.3vw,19px);line-height:1.5;color:#B8B3AA;max-width:620px}
.pc-row{display:flex;gap:12px 14px;flex-wrap:wrap;align-items:center}
.pc-row a{border-radius:999px;padding:16px 26px;font-weight:600;font-size:13px;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;transition:transform .25s cubic-bezier(.16,1,.3,1),background .25s,border-color .25s}
.pc-row a:active{transform:scale(.97)}
.pc-main{background:#FF6A00;color:#0A0A0A;font-weight:700}
.pc-main:hover{background:#FF8226}
.pc-alt{border:1px solid #3A3A3C;color:#F4F4F2}
.pc-alt:hover{border-color:#F4F4F2}
.pc-note{font:400 11px var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:#6B675F}
.pc-next{align-self:flex-start;color:#B8B3AA;font-size:16px;text-decoration:none;border-bottom:1px solid #3A3A3C;padding-bottom:3px;transition:color .25s,border-color .25s}
.pc-next:hover{color:#F4F4F2;border-color:#F4F4F2}
@media (max-width:520px){.pc-row a{flex:1 1 100%;text-align:center}}
`;

/**
 * The same closing on every pillar page: the finished platform, one sentence,
 * one primary action (book the first call). WhatsApp stays as the quiet second way in.
 */
export default function PillarClose({
  t,
  label,
  head,
  accent,
  body,
  next,
}: {
  t: T;
  label: string;
  head: string;
  accent: string;
  body: string;
  next?: { label: string; href: string };
}) {
  return (
    <div className="pc" data-screen-label="Start">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <ClosingScene />
      <div className="pc-in">
        <div className="pc-label">{label}</div>
        <h2 className="pc-h" data-rv="0">
          {head} <span>{accent}</span>
        </h2>
        <p className="pc-body" data-rv="60">
          {body}
        </p>
        <div className="pc-row" data-rv="120">
          <a className="pc-main" href={CAL_URL} target="_blank" rel="noopener">
            {t("common.closeCall")}
          </a>
          <a
            className="pc-alt"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener"
          >
            {t("common.closeWhatsApp")}
          </a>
        </div>
        <div className="pc-note">{t("common.closeNote")}</div>
        {next ? (
          <a className="pc-next" href={next.href}>
            {next.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}
