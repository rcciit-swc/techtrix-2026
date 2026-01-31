export default function Background() {
  return (
    <div className="absolute inset-0 -z-10">
      <img
        src="/events/bg.png"
        alt="Background"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
