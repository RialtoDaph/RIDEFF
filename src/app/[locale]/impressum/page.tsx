import { EMAIL } from '@/lib/site';
import { legalMeta, legalSetup } from '@/lib/legalPage';
import { LegalLayout, block, h1, small } from '@/components/legal/LegalLayout';

export const metadata = legalMeta('Impressum', '/impressum');

export default async function Impressum({ params }: PageProps<'/[locale]/impressum'>) {
  await legalSetup(params);
  return (
    <LegalLayout current="/impressum">
      <h1 className={h1}>Impressum</h1>
      <p className={small}>Angaben gemäß § 5 DDG</p>
      <div className={block}>
        <span>RIDEFF · Inhaber: Rialto Effendy</span>
        <span>[Straße und Hausnummer]</span>
        <span>[PLZ Ort]</span>
        <span>Deutschland</span>
      </div>
      <div className={block}>
        <strong>Kontakt</strong>
        <span>
          E-Mail: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </span>
        <span>Telefon: [Telefonnummer]</span>
      </div>
      <div className={block}>
        <strong>Umsatzsteuer-ID</strong>
        <span>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [USt-IdNr. oder „Kleinunternehmer gemäß § 19 UStG“]</span>
      </div>
      <div className={block}>
        <strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</strong>
        <span>Rialto Effendy, Anschrift wie oben</span>
      </div>
      <div className={block}>
        <strong>Verbraucherstreitbeilegung</strong>
        <span>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</span>
      </div>
    </LegalLayout>
  );
}
