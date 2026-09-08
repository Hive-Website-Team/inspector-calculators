/**
 * Next's built-in not-found screen paints its own black background when the
 * browser is in dark mode. The site ships light only, so it gets its own 404
 * rather than a dark band inside a white layout.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="text-sm text-[color-mix(in_srgb,var(--foreground)_60%,transparent)]">404</p>
      <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
        That page does not exist
      </h1>
      <p className="mt-4 leading-relaxed">
        The calculator you asked for is not here. Every calculator on the site is listed on the{' '}
        <a href="/#all-calculators">home page</a>.
      </p>
    </div>
  );
}
