export function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How Local Pages Works</p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">1</div>
                Request Service
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Answer a few simple questions about your job to help tradies understand your needs.</dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">2</div>
                Compare Quotes
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Receive matched tradies, review their profiles, and get quotes directly on the platform.</dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">3</div>
                Get it Done
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">Book an appointment, get the job done, and leave a review for the community.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
