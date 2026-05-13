import './globals.css';

export const metadata = {
  title: 'The Weight of the Sky',
  description: 'Singularity v10.0 Narrative OS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-mono">{children}</body>
    </html>
  );
}
