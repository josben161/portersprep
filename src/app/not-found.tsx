export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg p-10 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">Let&apos;s get you back home.</p>
      <a href="/" className="mt-6 inline-block rounded bg-black px-4 py-2 text-white">Go home</a>
    </div>
  );
} 