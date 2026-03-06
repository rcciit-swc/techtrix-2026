import { Toaster } from 'sonner';

export default function CommunityPartnerLayout({
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
