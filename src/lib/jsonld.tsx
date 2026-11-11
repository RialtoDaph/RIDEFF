import 'server-only';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { localePath, type MetaRoute, PAGE_META } from './metadata';
import { SITE_URL, WHATSAPP_URL } from './site';

/**
 * schema.org structured data (JSON-LD) for search engines and AI answer engines.
 * Facts here must match the visible site (Pricing page, Impressum).
 */
const abs = (p: string) => `${SITE_URL}${p === '/' ? '' : p}`;
const ID = { business: `${SITE_URL}/#business`, person: `${SITE_URL}/#rialto`, website: `${SITE_URL}/#website` };

export function JsonLd({ data }: { data: object }) {
  // "<" escaped so a string can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

/** Business, founder and website: on every page (layout). */
export async function siteGraph(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': ID.business,
        name: 'RIDEFF',
        url: abs(localePath('/', locale)),
        logo: abs('/images/rideff-logo.png'),
        image: abs(`/og/og-${locale}.png`),
        description: t('description'),
        founder: { '@id': ID.person },
        address: { '@type': 'PostalAddress', addressLocality: 'Eichstätt', addressRegion: 'Bayern', addressCountry: 'DE' },
        areaServed: { '@type': 'Country', name: 'Deutschland' },
        telephone: '+49 176 32572420',
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', url: WHATSAPP_URL, availableLanguage: ['German', 'English'] },
        knowsAbout: ['KI-Agenten', 'Automatisierung', 'Websites', 'Online-Shops', 'Team-Apps', 'Kundenportale'],
        priceRange: '€€',
      },
      {
        '@type': 'Person',
        '@id': ID.person,
        name: 'Rialto Effendy',
        jobTitle: locale === 'de' ? 'Gründer & Entwickler' : 'Founder & builder',
        worksFor: { '@id': ID.business },
        image: abs('/images/rialto-about.jpg'),
        url: abs(localePath('/about', locale)),
        address: { '@type': 'PostalAddress', addressLocality: 'Eichstätt', addressCountry: 'DE' },
      },
      {
        '@type': 'WebSite',
        '@id': ID.website,
        name: 'RIDEFF',
        url: abs(localePath('/', locale)),
        inLanguage: locale,
        publisher: { '@id': ID.business },
      },
    ],
  };
}

const faq = (pairs: [string, string][]) => ({
  '@type': 'FAQPage',
  mainEntity: pairs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

/** Monthly price, net (Business) or incl. VAT (Life). */
const monthly = (price: number, vat: boolean) => ({
  '@type': 'UnitPriceSpecification',
  price,
  priceCurrency: 'EUR',
  unitCode: 'MON',
  valueAddedTaxIncluded: vat,
});

function offers(locale: Locale) {
  const de = locale === 'de';
  const url = abs(localePath('/pricing', locale));
  const biz = (name: string, price: number, setup: number) => ({
    '@type': 'Offer',
    name: `RIDEFF ${name}`,
    url,
    priceCurrency: 'EUR',
    price,
    priceSpecification: [monthly(price, false), { '@type': 'PriceSpecification', name: de ? 'Einrichtung ab' : 'Setup from', price: setup, priceCurrency: 'EUR', valueAddedTaxIncluded: false }],
    eligibleCustomerType: 'https://schema.org/Business',
  });
  const life = (name: string, price: number) => ({ '@type': 'Offer', name, url, priceCurrency: 'EUR', price, priceSpecification: monthly(price, true) });
  return [
    {
      '@type': 'Service',
      name: 'RIDEFF Business',
      serviceType: de ? 'KI-Systeme, Team-Apps, Websites und Shops für kleine Betriebe' : 'AI systems, team apps, websites and shops for small businesses',
      provider: { '@id': ID.business },
      areaServed: { '@type': 'Country', name: 'Deutschland' },
      offers: [biz('Core', 149, 1290), biz('Growth', 249, 1990), biz(de ? 'Gesamtsystem' : 'Whole system', 449, 3900)],
    },
    {
      '@type': 'Service',
      name: 'RIDEFF Life',
      serviceType: de ? 'Persönlicher Assistent für Geld, Zeit, Ziele und Familie' : 'Personal assistant for money, time, goals and family',
      provider: { '@id': ID.business },
      offers: [life('Life', 12.9), life('Life Plus', 19.9), life('Together', 29.9), life('Life Private', 68)],
    },
  ];
}

function breadcrumb(route: MetaRoute, locale: Locale, name: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'RIDEFF', item: abs(localePath('/', locale)) },
      { '@type': 'ListItem', position: 2, name, item: abs(localePath(route, locale)) },
    ],
  };
}

/** Page-specific data: FAQs and offers that are visible on that page, plus breadcrumbs. */
export async function pageGraph(route: MetaRoute, locale: Locale) {
  const nodes: object[] = [];
  if (route === '/') {
    const t = await getTranslations({ locale, namespace: 'Home' });
    const tc = await getTranslations({ locale, namespace: 'common' });
    nodes.push(
      faq([
        [t('whoIsBehindRIDEFF'), t('meRialtoBasedInEichstattI')],
        [t('doINeedToUnderstandAI'), t('noThatIsThePointYou')],
        [t('whatDoesItCost'), t('core149Growth249WholeSystem')],
        [t('whereIsMyData'), t('hostedInTheEUInFrankfurt')],
        [t('whatHappensAfterLaunch'), t('iKeepItRunningUpdatesFixes')],
        [tc('faqLeaveQ'), tc('faqLeaveA')],
        [tc('faqAwayQ'), tc('faqAwayA')],
        [t('howSoonCanWeStart'), t('iKeepTheNumberOfClients')],
      ]),
    );
  } else {
    const tm = await getTranslations({ locale, namespace: `meta.${PAGE_META[route]}` });
    nodes.push(breadcrumb(route, locale, tm('title').split(' · ')[0]));
  }
  if (route === '/pricing') {
    const t = await getTranslations({ locale, namespace: 'Pricing' });
    const tc = await getTranslations({ locale, namespace: 'common' });
    nodes.push(
      faq([
        [t('whyASetupFeeAndA'), t('theSetupPaysForAnalysingAnd')],
        [t('whatDoesTheSetupFeeCover'), t('analysisBuildTestingAndGoLive')],
        [t('howLongIsTheContract'), t('businessPlansRunFor12Months')],
        [t('arePricesNetOrGross'), t('businessPricesAreNetPlus19')],
        [t('canIChangePlansLater'), t('yesMostClientsStartWithCore')],
        [tc('faqLeaveQ'), tc('faqLeaveA')],
        [tc('faqAwayQ'), tc('faqAwayA')],
        [t('doINeedACardFor'), t('no14DaysFreeNoCard')],
        [t('canICancelAnyMonth'), t('yesLifePlansCanBeCancelled')],
        [t('whoCanUseTogether'), t('upTo4PeopleInOne')],
        [t('whereIsMyData'), t('inTheEUInFrankfurt')],
      ]),
      ...offers(locale),
    );
  }
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** A Journal article. */
export function articleGraph(post: { slug: string; title: string; excerpt: string; date: string; cover?: string }) {
  const url = abs(`/journal/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        inLanguage: 'de',
        url,
        mainEntityOfPage: url,
        ...(post.cover ? { image: abs(post.cover) } : {}),
        author: { '@id': ID.person },
        publisher: { '@id': ID.business },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'RIDEFF', item: abs('/') },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: abs('/journal') },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}
