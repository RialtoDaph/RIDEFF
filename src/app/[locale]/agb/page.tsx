import { legalMeta, legalSetup } from '@/lib/legalPage';
import { LegalLayout, h1, p } from '@/components/legal/LegalLayout';

export const metadata = legalMeta('AGB', '/agb');

export default async function Agb({ params }: PageProps<'/[locale]/agb'>) {
  await legalSetup(params);
  return (
    <LegalLayout current="/agb">
      <h1 className={h1}>AGB</h1>
      <p className={p}>
        Die Allgemeinen Geschäftsbedingungen für RIDEFF Business und RIDEFF Life werden vor Vertragsabschluss bereitgestellt. Kernpunkte
        RIDEFF Business: Mindestlaufzeit 12 Monate, danach monatlich mit 30 Tagen Frist kündbar. Preise netto zzgl. MwSt. RIDEFF Life: 14
        Tage kostenlos testen, danach monatlich kündbar; Endpreise inkl. MwSt. RIDEFF Life Private: einmalige Einrichtung und monatliche
        Gebühr laut Angebot, monatlich kündbar.
      </p>
    </LegalLayout>
  );
}
