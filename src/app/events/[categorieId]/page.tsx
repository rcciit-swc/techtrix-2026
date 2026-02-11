// app/events/[categorieId]/page.tsx

export default function EventsPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/profile/profilebg.jpeg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.1) 0%, transparent 70%)',
          animation: 'pulse 8s infinite',
        }}
      />

      <main className="relative z-10">
        <EventCardsCluster />
      </main>
    </div>
  );
}
