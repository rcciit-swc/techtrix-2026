import { createServer } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import EventPageClient from './EventPageClient';
import EventLoader from '@/components/eventDetails/EventLoader';

const BASE_URL = 'https://techtrix.rcciit.org.in';
const FALLBACK_IMAGE = `${BASE_URL}/favicon.jpg`;
const FALLBACK_DESCRIPTION =
  'Join us at Techtrix 2026 – The Annual Inter-College National Level Technical Fest of RCCIIT.';

function toOgImage(rawUrl: string): string {
  const stripped = rawUrl.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(
    stripped
  )}&w=1200&h=1200&fit=inside&we=1&output=jpg&q=70`;
}

function buildFallbackMetadata(pageUrl: string): Metadata {
  const fallbackOg = toOgImage(FALLBACK_IMAGE);
  return {
    title: 'Event | Techtrix 2026',
    description: FALLBACK_DESCRIPTION,
    openGraph: {
      title: 'Event | Techtrix 2026',
      description: FALLBACK_DESCRIPTION,
      url: pageUrl,
      siteName: 'Techtrix 2026',
      locale: 'en_IN',
      type: 'article',
      images: [{ url: fallbackOg, alt: 'Techtrix 2026' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Event | Techtrix 2026',
      description: FALLBACK_DESCRIPTION,
      images: [fallbackOg],
      site: '@RCCIIT',
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const pageUrl = `${BASE_URL}/event/${eventId}`;

  try {
    const supabase = await createServer();
    const { data: event } = await supabase
      .from('events')
      .select('name, description, image_url')
      .eq('id', eventId)
      .maybeSingle();

    if (!event) {
      return buildFallbackMetadata(pageUrl);
    }

    // Strip HTML tags from description for plain-text OG/Twitter
    const plainDescription = event.description
      ? event.description
          .replace(/<[^>]*>/g, '')
          .trim()
          .slice(0, 200)
      : FALLBACK_DESCRIPTION;

    const imageUrl = toOgImage(event.image_url || FALLBACK_IMAGE);
    const title = `${event.name} | Techtrix 2026`;

    return {
      title: event.name,
      description: plainDescription,
      openGraph: {
        title,
        description: plainDescription,
        url: pageUrl,
        siteName: 'Techtrix 2026',
        locale: 'en_IN',
        type: 'article',
        images: [{ url: imageUrl, alt: event.name }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: plainDescription,
        images: [imageUrl],
        site: '@RCCIIT',
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch {
    return buildFallbackMetadata(pageUrl);
  }
}

async function EventJsonLd({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const pageUrl = `${BASE_URL}/event/${eventId}`;

  try {
    const supabase = await createServer();
    const { data: event } = await supabase
      .from('events')
      .select('name, description, image_url, registration_fees')
      .eq('id', eventId)
      .maybeSingle();

    if (!event) return null;

    const plainDescription = event.description
      ? event.description
          .replace(/<[^>]*>/g, '')
          .trim()
          .slice(0, 300)
      : FALLBACK_DESCRIPTION;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: plainDescription,
      url: pageUrl,
      image: toOgImage(event.image_url || FALLBACK_IMAGE),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'RCC Institute of Information Technology',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Canal South Road, Beliaghata',
          addressLocality: 'Kolkata',
          addressRegion: 'West Bengal',
          postalCode: '700015',
          addressCountry: 'IN',
        },
      },
      organizer: {
        '@type': 'Organization',
        name: 'Techtrix 2026',
        url: BASE_URL,
      },
      offers: {
        '@type': 'Offer',
        price: event.registration_fees ?? 0,
        priceCurrency: 'INR',
        url: pageUrl,
        availability: 'https://schema.org/InStock',
      },
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  } catch {
    return null;
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  return (
    <>
      <EventJsonLd params={params} />
      <Suspense fallback={<EventLoader />}>
        <EventPageClient />
      </Suspense>
    </>
  );
}
