import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Messages } from '@/components/site/Messages';
import { pageMetadata, type MetaRoute } from './metadata';
import { JsonLd, pageGraph } from './jsonld';

type Params = { params: Promise<{ locale: string }> };

/**
 * A static site page: metadata from messages `meta.*`, and the ported page
 * component with only its own message namespaces on the client.
 */
export function sitePage(route: MetaRoute, namespaces: string[], Body: ComponentType, opts: { noindex?: boolean; germanOnly?: boolean } = {}) {
  const locale = async (params: Params['params']): Promise<Locale> => {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale) || (opts.germanOnly && locale !== 'de')) notFound();
    return locale;
  };
  return {
    generateMetadata: async ({ params }: Params): Promise<Metadata> => pageMetadata(await locale(params), route, opts),
    Page: async function Page({ params }: Params) {
      const l = await locale(params);
      setRequestLocale(l);
      return (
        <>
          {opts.noindex ? null : <JsonLd data={await pageGraph(route, l)} />}
          <Messages namespaces={namespaces}>
            <Body />
          </Messages>
        </>
      );
    },
  };
}
