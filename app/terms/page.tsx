
export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p className="text-gray-400 leading-relaxed">
                Welcome to ApexLedger. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Use of License</h2>
            <p className="text-gray-400 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials (information or software) on ApexLedger's website for personal, non-commercial transitory viewing only.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Disclaimer</h2>
            <p className="text-gray-400 leading-relaxed">
                The materials on ApexLedger's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.
            </p>
            <p className="text-gray-400 leading-relaxed">
               <strong>Trading involves risk.</strong> Past performance is not indicative of future results. ApexLedger is a journaling tool, not a financial advisor.
            </p>
        </section>
      </div>
    </div>
  );
}
