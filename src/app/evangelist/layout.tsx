import { Toaster } from 'sonner';

export default function EvangelistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position="bottom-right" richColors duration={5000} />
    </>
  );
}
