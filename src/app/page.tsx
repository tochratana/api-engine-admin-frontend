import Link from "next/link";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const features = [
    {
      icon: DocumentTextIcon,
      title: "Task Management",
      description: "Create, organize, and track your tasks with ease",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: CheckCircleIcon,
      title: "Progress Tracking",
      description: "Monitor your completion rates and productivity",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: ClockIcon,
      title: "Priority System",
      description: "Set priorities and manage deadlines effectively",
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: UserGroupIcon,
      title: "Team Collaboration",
      description: "Share tasks and collaborate with your team",
      color: "text-purple-600 bg-purple-100",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10,000+" },
    { label: "Tasks Completed", value: "500,000+" },
    { label: "Teams Created", value: "2,500+" },
    { label: "Productivity Boost", value: "85%" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Manage Tasks
              <span className="block text-blue-200">Like a Pro</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Streamline your workflow, boost productivity, and achieve your
              goals with our intuitive task management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/note"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/profile"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently
              and boost your productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their workflow with our
            task management platform.
          </p>
          <Link
            href="/note"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors space-x-2"
          >
            <span>Start Managing Tasks</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
