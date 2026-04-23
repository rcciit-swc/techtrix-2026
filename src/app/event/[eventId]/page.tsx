import { createServer } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import EventPageClient from './EventPageClient';
import EventLoader from '@/components/eventDetails/EventLoader';

const BASE_URL = 'https://techtrix.rcciit.org.in';
const FALLBACK_IMAGE = `${BASE_URL}/favicon.jpg`;
const FALLBACK_DESCRIPTION =
  'Join us at Techtrix 2026 – The Annual Inter-College National Level Technical Fest of RCCIIT.';

function buildFallbackMetadata(pageUrl: string): Metadata {
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
      images: [
        { url: FALLBACK_IMAGE, width: 1200, height: 630, alt: 'Techtrix 2026' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Event | Techtrix 2026',
      description: FALLBACK_DESCRIPTION,
      images: [FALLBACK_IMAGE],
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

    const imageUrl = event.image_url || FALLBACK_IMAGE;
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
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: event.name,
          },
        ],
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

export default function EventPage() {
  return (
    <Suspense fallback={<EventLoader />}>
      <EventPageClient />
    </Suspense>
  );
}
