
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="bg-gray-900 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Welcome to TaskFlow</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Manage your projects with ease</p>
          <a href="/signup" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">Get Started</a>
        </div>
      </section>

      {/* card_grid */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast</h3>
            <p className="text-gray-600">Build in minutes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-600">Enterprise-grade security</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple</h3>
            <p className="text-gray-600">No learning curve</p>
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="py-16 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
          <a href="/signup" className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors">Sign Up Free</a>
        </div>
      </section>
    </div>
  )
}
