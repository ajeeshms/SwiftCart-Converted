function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-blue max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Welcome to SwiftCart. By accessing and using our website, you agree to be bound by these terms and conditions.
            Please read them carefully before using our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <p className="text-gray-600 mb-4">
            When you create an account with us, you must provide accurate and complete information. You are responsible
            for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Products and Pricing</h2>
          <p className="text-gray-600 mb-4">
            We strive to provide accurate product information and pricing. However, we reserve the right to modify
            prices without prior notice and refuse any order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Shipping and Delivery</h2>
          <p className="text-gray-600 mb-4">
            Shipping times and costs may vary depending on your location and the products ordered. We are not
            responsible for delays caused by customs or other factors beyond our control.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Returns and Refunds</h2>
          <p className="text-gray-600 mb-4">
            You may return most products within 30 days of delivery for a full refund. Items must be unused and in
            their original packaging.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Privacy Policy</h2>
          <p className="text-gray-600 mb-4">
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
            and protect your personal information.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsPage;