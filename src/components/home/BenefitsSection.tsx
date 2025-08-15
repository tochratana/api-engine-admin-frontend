import React from "react";

export default function BenefitsSection() {
  const benefits = [
    {
      number: "01",
      title: "Ship faster",
      description:
        "Focus on your product, not infrastructure. Our APIs handle the backend complexity so you can iterate quickly.",
      metrics: "10x faster development",
    },
    {
      number: "02",
      title: "Scale globally",
      description:
        "Built on enterprise-grade infrastructure that automatically scales from prototype to production.",
      metrics: "99.9% uptime SLA",
    },
    {
      number: "03",
      title: "Reduce costs",
      description:
        "Pay only for what you use with transparent pricing. No hidden fees or surprise bills.",
      metrics: "50% cost reduction",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
              Why developers choose
              <span className="block text-primary">Endura</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of developers who trust Endura to power their
              applications. From startups to enterprises, we provide the tools
              you need to succeed.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  500K+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Active developers
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1B+</div>
                <div className="text-gray-600 dark:text-gray-400">
                  API requests/month
                </div>
              </div>
            </div>

            <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-primary/25">
              Start Building Today
            </button>
          </div>

          {/* Right Content - Benefits */}
          <div className="space-y-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-6 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  {/* Number */}
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {benefit.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {benefit.description}
                    </p>
                    <div className="text-sm font-medium text-primary">
                      {benefit.metrics}
                    </div>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
