export const metadata = {
  title: "ATLAS",
  description: "Sistema de conocimiento histórico incremental",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
