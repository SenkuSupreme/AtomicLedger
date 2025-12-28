
export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Information Collection</h2>
            <p className="text-gray-400 leading-relaxed">
                We collect information that you provide directly to us, such as when you create an account, update your profile, or use our trading journal features.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. How We Use Information</h2>
            <p className="text-gray-400 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, including to generate AI-powered insights for your trading journal.
            </p>
        </section>

        <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Data Security</h2>
            <p className="text-gray-400 leading-relaxed">
                We implement appropriate technical and organizational measures to protect specific personal information that we hold from unauthorized disclosure, use, alteration, or destruction.
            </p>
        </section>
      </div>
    </div>
  );
}
