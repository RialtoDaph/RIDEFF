import { legalMeta, legalSetup } from '@/lib/legalPage';
import { LegalLayout, h1, h2, p, small } from '@/components/legal/LegalLayout';

export const metadata = legalMeta('Datenschutzerklärung', '/datenschutz');

export default async function Datenschutz({ params }: PageProps<'/[locale]/datenschutz'>) {
  await legalSetup(params);
  return (
    <LegalLayout current="/datenschutz">
      <h1 className={h1}>Datenschutzerklärung</h1>

      <h2 className={h2}>1. Verantwortlicher</h2>
      <p className={p}>
        Rialto Effendy, RIDEFF, [Anschrift], E-Mail: hallo@rideff.com. Einen Datenschutzbeauftragten haben wir nicht bestellt, da keine
        gesetzliche Pflicht besteht.
      </p>

      <h2 className={h2}>2. Hosting und Aufruf der Website</h2>
      <p className={p}>
        Die Website wird bei Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA) gehostet, Serverstandort Frankfurt am Main. Beim
        Aufruf werden technisch notwendige Daten verarbeitet (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser). Rechtsgrundlage
        ist Art. 6 Abs. 1 lit. f DSGVO, unser Interesse an einem sicheren Betrieb. Die Protokolle werden nach spätestens [7] Tagen gelöscht.
        Mit Vercel besteht ein Auftragsverarbeitungsvertrag; für Übermittlungen in die USA gilt das EU-US Data Privacy Framework bzw. die
        Standardvertragsklauseln der EU-Kommission.
      </p>

      <h2 className={h2}>3. Reichweitenmessung</h2>
      <p className={p}>
        Wir nutzen Vercel Web Analytics, um zu sehen, welche Seiten aufgerufen werden. Es werden keine Cookies gesetzt und keine
        Nutzerprofile gebildet; Besuche werden ohne dauerhafte Kennung gezählt und nach 24 Stunden nicht mehr zugeordnet. Rechtsgrundlage
        ist Art. 6 Abs. 1 lit. f DSGVO.
      </p>

      <h2 className={h2}>4. Schriftarten</h2>
      <p className={p}>
        Die Schriftarten werden von unserem eigenen Server geladen. Es werden dabei keine Daten an Dritte übertragen. [Falls weiterhin
        Bunny Fonts genutzt wird: Wir laden Schriftarten über Bunny Fonts (BunnyWay d.o.o., Slowenien, EU). Dabei wird Ihre IP-Adresse
        übertragen, Cookies werden nicht gesetzt.]
      </p>

      <h2 className={h2}>5. Lokaler Speicher</h2>
      <p className={p}>
        Wir setzen keine Tracking- oder Marketing-Cookies. Gespeichert werden nur Ihre Spracheinstellung und Ihre Auswahl Business oder
        Privat im lokalen Speicher Ihres Browsers (§ 25 Abs. 2 TDDDG). Diese Daten verlassen Ihr Gerät nicht.
      </p>

      <h2 className={h2}>6. Kontakt und Terminbuchung (Cal.com)</h2>
      <p className={p}>
        Wenn Sie uns schreiben, verarbeiten wir Ihre Nachricht und Kontaktdaten, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. b
        DSGVO). Termine buchen Sie über Cal.com, einen Dienst der Cal.com, Inc. (2261 Market St #5450, San Francisco, CA 94114, USA). Dabei
        werden Name, E-Mail-Adresse, gewählter Termin und Ihre Angaben im Buchungsformular an Cal.com übermittelt und mit unserem Kalender
        (Google Calendar, Google Ireland Ltd.) abgeglichen. Mit beiden Anbietern bestehen Auftragsverarbeitungsverträge; für Übermittlungen
        in die USA gelten das EU-US Data Privacy Framework bzw. Standardvertragsklauseln. Wir löschen die Daten, wenn sie nicht mehr
        erforderlich sind, spätestens nach Ablauf gesetzlicher Aufbewahrungsfristen.
      </p>

      <h2 className={h2}>7. Newsletter</h2>
      <p className={p}>
        Wenn Sie unseren Newsletter abonnieren, speichern wir Ihre E-Mail-Adresse sowie Zeitpunkt und IP-Adresse von Anmeldung und
        Bestätigung. Sie erhalten erst nach Bestätigung des Links in einer E-Mail Nachrichten (Double-Opt-in). Rechtsgrundlage ist Ihre
        Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit über den Abmeldelink in jeder E-Mail widerrufen können. Versanddienst:
        [Resend, Inc., USA / Brevo (Sendinblue SAS), Frankreich], mit dem ein Auftragsverarbeitungsvertrag besteht. Nach der Abmeldung
        löschen wir Ihre Adresse; der Nachweis der früheren Einwilligung wird bis zu drei Jahre aufbewahrt.
      </p>

      <h2 className={h2}>8. RIDEFF Life und Kundenportal</h2>
      <p className={p}>
        Die Web-App RIDEFF Life (app.rideff.com) und das Kundenportal (portal.rideff.com) sind eigene Dienste mit einer eigenen
        Datenschutzerklärung, die vor der Registrierung angezeigt wird. Dort eingesetzt werden insbesondere Supabase (Datenbank und
        Anmeldung, Supabase Inc., Serverstandort Frankfurt am Main), Stripe (Zahlungen, Stripe Payments Europe Ltd., Irland) und Anthropic
        (KI-Auswertung, Anthropic PBC, USA). Daten werden verschlüsselt gespeichert und nicht zum Training von KI-Modellen verwendet.
      </p>

      <h2 className={h2}>9. Ihre Rechte</h2>
      <p className={p}>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch
        (Art. 15 bis 21 DSGVO) sowie das Recht, eine erteilte Einwilligung jederzeit zu widerrufen. Schreiben Sie uns an hallo@rideff.com.
        Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei [Aufsichtsbehörde Ihres Bundeslandes].
      </p>
      <p className={small}>Stand: Oktober 2026</p>
    </LegalLayout>
  );
}
