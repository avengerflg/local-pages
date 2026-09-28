import Link from 'next/link';

export function Hero() {
  return (
    <div className="bg-blue-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Find trusted local tradies for your next job.
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Tell us what you need, choose local tradies, compare quotes, and arrange the job with confidence.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/services" className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Find a Service
          </Link>
          <Link href="/register" className="text-sm font-semibold leading-6 text-gray-900">
            Join as a Tradie <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
