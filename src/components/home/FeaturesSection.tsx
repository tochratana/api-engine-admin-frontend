import React from "react";

export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
          />
        </svg>
      ),
      title: "Modern Database",
      description:
        "PostgreSQL database with instant APIs, real-time subscriptions, and automatic scaling.",
    },
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Authentication",
      description:
        "Complete auth solution with social logins, multi-factor authentication, and user management.",
    },
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Personal Dashboard",
      description:
        "Customize your workspace with a personal dashboard that provides at-a-glance insights..",
    },
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
      ),
      title: "File Storage",
      description:
        "Secure file storage with CDN delivery, image transformations, and automatic backups.",
    },
   
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary dark:text-white sm:text-5xl mb-4">
            Explore The Benefits of Our Features
           
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Endura provides all the backend services you need to build modern
            applications. Start with our intuitive APIs and scale to millions of
            users.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Radial hover effect background - starts from icon position */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-primary rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[20] group-hover:rounded-full origin-center"></div>
              
              {/* Content wrapper with higher z-index */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-xl mb-6 group-hover:bg-white/20 group-hover:text-white transition-all duration-500 relative z-20">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-white mb-3 transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
