import Link from "next/link";
import Image from "next/image";
import { Check, BarChart2, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold">BizManager</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-orange-500"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium hover:text-orange-500"
            >
              About
            </Link>
            <Link
              href="#how"
              className="text-sm font-medium hover:text-orange-500"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-orange-500"
            >
              Pricing
            </Link>
            <Link
              href="#resources"
              className="text-sm font-medium hover:text-orange-500"
            >
              Resources
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/signup">Start Your 14-Day Trial</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500 rounded-full opacity-10 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500 rounded-full opacity-10 -ml-10 -mb-10"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-600 mb-2">
                  <span className="mr-1">•</span> Business Management Made
                  Simple
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Sales, Credit, & Reporting.
                    <br />
                    The Complete{" "}
                    <span className="bg-orange-500 text-white px-2">
                      Business
                    </span>{" "}
                    Software.
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Streamlining your business operations is crucial for
                    efficiency and growth. BizManager helps you manage sales,
                    track credit, and get all in a single system, by integrating
                    these functions.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Start Your 14-Day Trial
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center relative">
                <div className="relative w-full max-w-[600px] rounded-lg border bg-white p-2 shadow-xl">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="Dashboard preview"
                    className="rounded-md"
                  />
                  <div className="absolute -top-3 -right-3 bg-orange-500 text-white rounded-full h-16 w-16 flex items-center justify-center text-sm font-bold">
                    <div className="text-center">
                      <div className="text-xl">5,644</div>
                      <div className="text-xs">Users</div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-8 bg-orange-100 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute top-1/2 -right-6 w-12 h-12 bg-orange-500 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Boxes */}
        <section className="py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    Get your Own Dedicated Sales Manager
                  </h3>
                  <p className="text-gray-600">
                    Track all sales transactions with detailed analytics and
                    custom reports.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    Stay Protected With Custom & Compliant UI
                  </h3>
                  <p className="text-gray-600">
                    Manage customer credit, payments, and generate professional
                    invoices with ease.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <BarChart2 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    Unlimited Reports, Clear Pricing, No Surprises
                  </h3>
                  <p className="text-gray-600">
                    Generate detailed reports and gain insights with
                    customizable dashboards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced Operations Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">
              Enhance Business Operations with Your
              <br />
              Dedicated Business Manager
            </h2>
            <p className="max-w-[800px] mx-auto text-gray-300">
              Streamline your sales tracking, credit management, and reporting
              with our comprehensive business management solution. With a
              dedicated dashboard at your disposal, you can focus on growing
              your business.
            </p>
          </div>
        </section>

        {/* Feature Section 1 */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-orange-500 rounded-full opacity-20"></div>
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  width={500}
                  height={400}
                  alt="Sales tracking feature"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-orange-500 rounded-full opacity-20"></div>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-600">
                  POWERFUL SALES TRACKING
                </div>
                <h2 className="text-3xl font-bold">
                  Secure a Sales & Credit Partner Your Business
                </h2>
                <p className="text-gray-600">
                  Managing all of your business operations in one place has
                  never been easier. Our comprehensive solution helps you track
                  sales, manage credit, and generate reports, all in one place.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-orange-600" />
                    </div>
                    <span>Easy Transaction Recording</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-orange-600" />
                    </div>
                    <span>Sales Performance Reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-orange-600" />
                    </div>
                    <span>Smart Inventory Management Policy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section 2 */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-4 order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  MANAGE CREDIT WITH RESULTS
                </div>
                <h2 className="text-3xl font-bold">
                  Engage an Credit & Payment Partner Your Business
                </h2>
                <p className="text-gray-600">
                  BizManager will provide you with a dedicated Credit Manager.
                  All customers, payments, and credit tracking in one place.
                  Easily mark items as paid, generate invoices, and track
                  payment history.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  See More
                </Button>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-orange-500 rounded-full opacity-20"></div>
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  width={500}
                  height={400}
                  alt="Credit management feature"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-orange-500 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Software Showcase */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-600 mb-4">
              WHAT WE ALSO DO DIFFERENT
            </div>
            <h2 className="text-3xl font-bold mb-12">
              Why BizManager : Business Management Software?
            </h2>
            <div className="max-w-4xl mx-auto">
              <Image
                src="/placeholder.svg?height=600&width=1000"
                width={1000}
                height={600}
                alt="Software dashboard"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Feature Section 3 */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-500 rounded-full opacity-20"></div>
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  width={500}
                  height={400}
                  alt="Business management feature"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-500 rounded-full opacity-20"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  Business Management Software That Gives You Control Now
                </h2>
                <p className="text-gray-600">
                  Take control of your business with our comprehensive solution.
                  Our platform combines the power of modern technology, giving
                  you the control you need.
                </p>
                <p className="text-gray-600">
                  Having a lack of monitoring, tracking, and managing
                  transactions can lead to inefficiencies and lost revenue.
                  BizManager provides you with a solution that simplifies
                  business management.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Hear From Our Customers
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Our product has truly transformed how easy SMBs & enterprises do
              business. Here's what a few of our customers have to say:
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md relative">
                <p className="text-gray-600 mb-4">
                  "Using the BizManager at CallHub has been very helpful for me.
                  My team experienced incredible speed and expertise in helping
                  with payroll issues that take over several of the employees
                  has been crucial."
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      width={48}
                      height={48}
                      alt="Customer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">William Jhon</h4>
                    <p className="text-sm text-gray-500">Sales Manager</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-8 w-24 bg-orange-500 rounded-full"></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md relative">
                <p className="text-gray-600 mb-4">
                  "The BizManager has streamlined our entire sales process. We
                  can now track every transaction, manage credit, and generate
                  reports with just a few clicks. It's been a game-changer for
                  our business."
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      width={48}
                      height={48}
                      alt="Customer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Retail Owner</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-8 w-24 bg-orange-500 rounded-full"></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md relative">
                <p className="text-gray-600 mb-4">
                  "As the HR manager at CallHub we were very impressed with how
                  easy it was to implement BizManager. The team has been
                  supportive and the platform has been reliable from day one."
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      width={48}
                      height={48}
                      alt="Customer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Jennifer Anly</h4>
                    <p className="text-sm text-gray-500">HR Director</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-8 w-24 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-orange-500 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want to learn more about BizManager?
            </h2>
            <p className="max-w-2xl mx-auto mb-8">
              We offer small business owners a simple way to get organized and
              automate business management tasks so they can focus on what
              matters most.
            </p>
            <Button
              size="lg"
              className="bg-white text-orange-500 hover:bg-gray-100"
            >
              Start Your 14-Day Trial
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="h-6 w-6 text-orange-500" />
                <span className="text-xl font-bold">BizManager</span>
              </div>
              <p className="text-gray-400 mb-4">
                Simplifying business management for small and medium businesses
                around the globe.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Meet Our Team
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Sales Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Consultants
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Leadership
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Platform
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Enterprise
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Plans & Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                About CallHub
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Legal
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2025 BizManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
