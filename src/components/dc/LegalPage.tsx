// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Rechtliches.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, opt, useDC } from '@/lib/dc';


class Logic extends DCLogic {}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "html{scroll-behavior:smooth}body{margin:0;background:#F4F4F2;font-family:var(--font-sans);color:#0A0A0A;-webkit-font-smoothing:antialiased}*{box-sizing:border-box}a{color:#0A0A0A}a:hover{color:#FF6A00}" }} />
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "40px 20px 96px", display: "flex", flexDirection: "column", gap: "56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <a href={v.href("/")} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src={opt("/images/rideff-mark.png")} alt="RIDEFF" style={{ height: "26px", width: "auto" }} />
            <span style={{ fontWeight: "700", fontSize: "17px", letterSpacing: "0.02em" }}>
              {"RIDEFF"}
            </span>
          </a>
          <nav style={{ display: "flex", gap: "20px", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.08em" }}>
            <a href={v.href("/impressum")} aria-current={v.section === "impressum" ? "page" : undefined} style={{ textDecoration: "none", color: v.section === "impressum" ? "#FF6A00" : undefined }}>
              {"IMPRESSUM"}
            </a>
            <a href={v.href("/datenschutz")} aria-current={v.section === "datenschutz" ? "page" : undefined} style={{ textDecoration: "none", color: v.section === "datenschutz" ? "#FF6A00" : undefined }}>
              {"DATENSCHUTZ"}
            </a>
            <a href={v.href("/agb")} aria-current={v.section === "agb" ? "page" : undefined} style={{ textDecoration: "none", color: v.section === "agb" ? "#FF6A00" : undefined }}>
              {"AGB"}
            </a>
          </nav>
        </div>
        <div style={{ padding: "16px 20px", borderRadius: "12px", background: "#FFF4EB", border: "1px solid #FFD2B0", fontSize: "14px", lineHeight: "1.5", color: "#7C2D12" }}>
          {"Entwurf. Angaben in [eckigen Klammern] bitte ergänzen und vor Veröffentlichung rechtlich prüfen lassen."}
        </div>
        {v.section === "impressum" ? (<>
        <section id="impressum" style={{ display: "flex", flexDirection: "column", gap: "18px", scrollMarginTop: "24px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "700", letterSpacing: "-0.04em", margin: "0" }}>
            {"Impressum"}
          </h1>
          <p style={{ fontSize: "14px", color: "#6B6B6B", margin: "0" }}>
            {"Angaben gemäß § 5 DDG"}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "16px", lineHeight: "1.6" }}>
            <span>
              {"RIDEFF · Inhaber: Rialto Effendy"}
            </span>
            <span>
              {"[Straße und Hausnummer]"}
            </span>
            <span>
              {"[PLZ Ort]"}
            </span>
            <span>
              {"Deutschland"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "16px", lineHeight: "1.6" }}>
            <strong>
              {"Kontakt"}
            </strong>
            <span>
              {"E-Mail: "}
              <a href="mailto:hallo@rideff.com">
                {"hallo@rideff.com"}
              </a>
            </span>
            <span>
              {"Telefon: [Telefonnummer]"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "16px", lineHeight: "1.6" }}>
            <strong>
              {"Umsatzsteuer-ID"}
            </strong>
            <span>
              {"Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [USt-IdNr. oder „Kleinunternehmer gemäß § 19 UStG“]"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "16px", lineHeight: "1.6" }}>
            <strong>
              {"Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV"}
            </strong>
            <span>
              {"Rialto Effendy, Anschrift wie oben"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "16px", lineHeight: "1.6" }}>
            <strong>
              {"Verbraucherstreitbeilegung"}
            </strong>
            <span>
              {"Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."}
            </span>
          </div>
        </section>
        </>) : null}
        {v.section === "datenschutz" ? (<>
        <section id="datenschutz" style={{ display: "flex", flexDirection: "column", gap: "18px", scrollMarginTop: "24px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "700", letterSpacing: "-0.04em", margin: "0" }}>
            {"Datenschutzerklärung"}
          </h1>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"1. Verantwortlicher"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Rialto Effendy, RIDEFF, [Anschrift], E-Mail: hallo@rideff.com. Einen Datenschutzbeauftragten haben wir nicht bestellt, da keine gesetzliche Pflicht besteht."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"2. Hosting und Aufruf der Website"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Die Website wird bei Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA) gehostet, Serverstandort Frankfurt am Main. Beim Aufruf werden technisch notwendige Daten verarbeitet (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, unser Interesse an einem sicheren Betrieb. Die Protokolle werden nach spätestens [7] Tagen gelöscht. Mit Vercel besteht ein Auftragsverarbeitungsvertrag; für Übermittlungen in die USA gilt das EU-US Data Privacy Framework bzw. die Standardvertragsklauseln der EU-Kommission."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"3. Reichweitenmessung"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Wir nutzen Vercel Web Analytics, um zu sehen, welche Seiten aufgerufen werden. Es werden keine Cookies gesetzt und keine Nutzerprofile gebildet; Besuche werden ohne dauerhafte Kennung gezählt und nach 24 Stunden nicht mehr zugeordnet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"4. Schriftarten"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Die Schriftarten werden von unserem eigenen Server geladen. Es werden dabei keine Daten an Dritte übertragen."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"5. Lokaler Speicher"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Wir setzen keine Cookies. Im lokalen Speicher Ihres Browsers liegen nur Ihre Spracheinstellung (Schlüssel „rideff_lang“) und die Information, dass das Intro-Video in dieser Sitzung schon lief (Sitzungsspeicher, wird beim Schließen des Tabs gelöscht). Rechtsgrundlage ist § 25 Abs. 2 TDDDG. Diese Daten verlassen Ihr Gerät nicht."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"6. Kontakt und Terminbuchung (Cal.com)"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Wenn Sie uns schreiben, verarbeiten wir Ihre Nachricht und Kontaktdaten, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. b DSGVO). Termine buchen Sie über Cal.com, einen Dienst der Cal.com, Inc. (2261 Market St #5450, San Francisco, CA 94114, USA). Dabei werden Name, E-Mail-Adresse, gewählter Termin und Ihre Angaben im Buchungsformular an Cal.com übermittelt und mit unserem Kalender (Google Calendar, Google Ireland Ltd.) abgeglichen. Mit beiden Anbietern bestehen Auftragsverarbeitungsverträge; für Übermittlungen in die USA gelten das EU-US Data Privacy Framework bzw. Standardvertragsklauseln. Wir löschen die Daten, wenn sie nicht mehr erforderlich sind, spätestens nach Ablauf gesetzlicher Aufbewahrungsfristen."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"7. Nana (Chat- und Sprachassistent)"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Auf jeder Seite können Sie Nana Fragen stellen, per Text oder per Sprache. Nana läuft auf ElevenLabs Agents ([Firma und Anschrift laut Auftragsverarbeitungsvertrag]; Verarbeitungsort [USA oder EU-Rechenzentrum, je nach Konto]). Unser Server stellt dafür einen kurzlebigen Zugang aus; Ihre Eingaben gehen danach direkt von Ihrem Browser an ElevenLabs, das die Antworten mit einem Sprachmodell erzeugt ([Sprachmodell-Anbieter laut Agent-Einstellung]). Mit ElevenLabs besteht ein Auftragsverarbeitungsvertrag; für Übermittlungen in die USA gelten das EU-US Data Privacy Framework bzw. die Standardvertragsklauseln. Ihre Eingaben werden nicht zum Training von KI-Modellen verwendet. ElevenLabs speichert die Gesprächstexte 30 Tage, damit wir daraus Ihre Zusammenfassung erstellen können; danach werden sie gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Beantwortung Ihrer Anfrage, vorvertragliche Maßnahmen). Ohne Ihre Einwilligung (siehe unten) werden Chatverläufe nach Ende der Sitzung nicht gespeichert, spätestens nach [24 Stunden] gelöscht."}
          </p>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Sprachanruf: Bevor ein Anruf startet, fragt Ihr Browser nach Zugriff auf das Mikrofon. Das Mikrofon wird nur während des Anrufs genutzt. Die Audiodaten werden in Echtzeit an ElevenLabs übertragen, in Text umgewandelt und beantwortet; Audioaufnahmen werden weder von uns noch von ElevenLabs gespeichert. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie durch Beenden des Anrufs oder Entzug der Mikrofonfreigabe jederzeit widerrufen können."}
          </p>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Speicherung im Kundenportal: Nur wenn Sie ausdrücklich zustimmen, dass Transkript und Zusammenfassung in Ihrem RIDEFF-Kundenportal gespeichert werden, speichern wir Transkript und Zusammenfassung bei Supabase (Supabase Inc., Serverstandort Frankfurt am Main) und ordnen sie Ihrer Anfrage bzw. Ihrem Kundenkonto im Portal zu. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können sie jederzeit per E-Mail an hallo@rideff.com widerrufen; wir löschen die Daten dann. Ohne Widerruf löschen wir sie [12 Monate] nach der letzten Anfrage, sofern kein Vertrag zustande kommt."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"8. WhatsApp"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Wenn Sie auf einen WhatsApp-Link klicken (z. B. „An Rialto per WhatsApp senden“), öffnet sich WhatsApp mit einer vorausgefüllten Nachricht. Erst wenn Sie diese selbst absenden, wird sie über WhatsApp (WhatsApp Ireland Ltd., Meta) an uns übertragen. Für die Verarbeitung durch WhatsApp gilt deren Datenschutzerklärung. Wir nutzen Ihre Nachricht, um Ihre Anfrage zu beantworten (Art. 6 Abs. 1 lit. b DSGVO)."}
          </p>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"„An mein WhatsApp senden“: Wenn Sie Ihre Telefonnummer eingeben und ausdrücklich zustimmen, schicken wir Ihnen die Zusammenfassung über die WhatsApp Business Platform (Meta Platforms Ireland Ltd.) [über Anbieter, falls genutzt]. Dafür werden Ihre Telefonnummer und die Zusammenfassung an Meta übermittelt. Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO); Sie können sie jederzeit widerrufen, indem Sie „STOP“ antworten oder uns schreiben. Wir löschen Ihre Nummer nach [30 Tagen], sofern kein Vertrag zustande kommt."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"9. Newsletter"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Wenn Sie unseren Newsletter abonnieren, speichern wir Ihre E-Mail-Adresse sowie Zeitpunkt und IP-Adresse von Anmeldung und Bestätigung. Sie erhalten erst nach Bestätigung des Links in einer E-Mail Nachrichten (Double-Opt-in). Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit über den Abmeldelink in jeder E-Mail widerrufen können. Versanddienst: [Resend, Inc., USA / Brevo (Sendinblue SAS), Frankreich], mit dem ein Auftragsverarbeitungsvertrag besteht. Nach der Abmeldung löschen wir Ihre Adresse; der Nachweis der früheren Einwilligung wird bis zu drei Jahre aufbewahrt."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"10. RIDEFF Life und Kundenportal"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Die Web-App RIDEFF Life (app.rideff.com) und das Kundenportal (portal.rideff.com) sind eigene Dienste mit einer eigenen Datenschutzerklärung, die vor der Registrierung angezeigt wird. Dort eingesetzt werden insbesondere Supabase (Datenbank und Anmeldung, Supabase Inc., Serverstandort Frankfurt am Main), Stripe (Zahlungen, Stripe Payments Europe Ltd., Irland) und Anthropic (KI-Auswertung, Anthropic PBC, USA). Daten werden verschlüsselt gespeichert und nicht zum Training von KI-Modellen verwendet."}
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 0" }}>
            {"11. Ihre Rechte"}
          </h2>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15 bis 21 DSGVO) sowie das Recht, eine erteilte Einwilligung jederzeit zu widerrufen. Schreiben Sie uns an hallo@rideff.com. Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei [Aufsichtsbehörde Ihres Bundeslandes]."}
          </p>
          <p style={{ fontSize: "14px", color: "#6B6B6B", margin: "0" }}>
            {"Stand: Oktober 2026"}
          </p>
        </section>
        </>) : null}
        {v.section === "agb" ? (<>
        <section id="agb" style={{ display: "flex", flexDirection: "column", gap: "18px", scrollMarginTop: "24px" }}>
          <h1 style={{ fontSize: "40px", fontWeight: "700", letterSpacing: "-0.04em", margin: "0" }}>
            {"AGB"}
          </h1>
          <p style={{ fontSize: "16px", lineHeight: "1.6", margin: "0" }}>
            {"Die Allgemeinen Geschäftsbedingungen für RIDEFF Business und RIDEFF Life werden vor Vertragsabschluss bereitgestellt. Kernpunkte RIDEFF Business: Mindestlaufzeit 12 Monate, danach monatlich mit 30 Tagen Frist kündbar. Preise netto zzgl. MwSt. RIDEFF Life: 14 Tage kostenlos testen, danach monatlich kündbar; Endpreise inkl. MwSt. RIDEFF Life Private: einmalige Einrichtung und monatliche Gebühr laut Angebot, monatlich kündbar."}
          </p>
        </section>
        </>) : null}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#6B6B6B", borderTop: "1px solid #E4E4E1", paddingTop: "24px" }}>
          <span>
            {"© 2026 RIDEFF"}
          </span>
          <a href={v.href("/")}>
            {"← ZUR WEBSITE"}
          </a>
        </div>
      </div>
    </>
  );
};

export default function LegalPage(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}
