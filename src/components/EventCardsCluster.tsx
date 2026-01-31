import EventCard from './EventCard';
import { Sparkles } from './hero/Sparkles';

export default function EventCardsCluster() {
  const cards = [
    { left: '13.5%', top: '68.3%', imageUrl: '/events/poster.png' },
    { left: '24.4375%', top: '28.84%', imageUrl: '/events/poster.png' },
    { left: '45.3125%', top: '0%', imageUrl: '/events/poster.png' },
    { left: '63.6875%', top: '28.84%', imageUrl: '/events/poster.png' },
    { left: '75.5%', top: '68.3%', imageUrl: '/events/poster.png' },
  ];

  const cardWidth = '10.9375%';

  return (
    <div
      className="relative w-full max-w-400 mx-auto overflow-hidden"
      style={{ aspectRatio: '1600 / 735' }}
    >
      <Sparkles colors={['rgba(0, 255, 0,']} />
      {cards.map((card, index) => (
        <EventCard
          key={index}
          left={card.left}
          top={card.top}
          width={cardWidth}
          imageUrl={card.imageUrl}
        />
      ))}
    </div>
  );
}
