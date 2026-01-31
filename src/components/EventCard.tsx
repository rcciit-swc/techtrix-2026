type EventCardProps = {
  left: string;
  top: string;
  width: string;
  imageUrl: string;
};

export default function EventCard({
  left,
  top,
  width,
  imageUrl,
}: EventCardProps) {
  return (
    <div
      className="absolute shadow-[0_4px_15px_rgba(0,0,0,0.25),0_8px_45px_rgba(217,255,0,0.25)] aspect-[175/233]"
      style={{ left, top, width }}
    >
      <img
        src={imageUrl}
        alt="Event Poster"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
