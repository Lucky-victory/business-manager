import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart2,
  CreditCard,
  Users,
  Package,
  FileText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">BizManager</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary"
            >
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-teal-50 to-white py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Take Control of Your Business Finances
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Streamline sales tracking, manage credit, and gain powerful
                    insights with our all-in-one business management solution.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Book a Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>14-day free trial</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[600px] overflow-hidden rounded-lg border bg-background p-2 shadow-xl">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    width={800}
                    height={600}
                    alt="Dashboard preview"
                    className="rounded-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-10"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t border-b bg-muted/40 py-12">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">$150M+</div>
                <div className="text-sm text-muted-foreground">
                  Transactions Managed
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">
                  Customer Satisfaction
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">
                  Customer Support
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything You Need to Manage Your Business
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  Our comprehensive suite of tools helps you track sales, manage
                  credit, and gain valuable insights into your business
                  performance.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 border-muted bg-background p-2">
                <CardContent className="pt-4">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <CreditCard className="h-5 w-5 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold">Sales Tracking</h3>
                  <p className="text-muted-foreground">
                    Easily record and monitor all your sales transactions with
                    detailed analytics and reporting.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted bg-background p-2">
                <CardContent className="pt-4">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <Users className="h-5 w-5 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold">Credit Management</h3>
                  <p className="text-muted-foreground">
                    Track customer credit, manage payments, and generate
                    professional invoices with ease.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted bg-background p-2">
                <CardContent className="pt-4">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <BarChart2 className="h-5 w-5 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold">Comprehensive Reports</h3>
                  <p className="text-muted-foreground">
                    Generate detailed reports and gain insights into your
                    business performance with customizable dashboards.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted bg-background p-2">
                <CardContent className="pt-4">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <Package className="h-5 w-5 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold">Inventory Management</h3>
                  <p className="text-muted-foreground">
                    Keep track of your stock levels, receive low stock alerts,
                    and manage your inventory efficiently.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted bg-background p-2">
                <CardContent className="pt-4">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <FileText className="h-5 w-5 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold">Invoice Generation</h3>
                  <p className="text-muted-foreground">
                    Create professional invoices, track payment status, and send
                    automated reminders to customers.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted bg-background p-2">
                <CardContent className="pt-4">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <Users className="h-5 w-5 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold">Multi-User Access</h3>
                  <p className="text-muted-foreground">
                    Collaborate with your team with role-based access control
                    and user permissions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="bg-gradient-to-b from-white to-teal-50 py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                    Sales Management
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Track Every Sale with Precision
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Our intuitive sales dashboard gives you a complete overview
                    of your daily, weekly, and monthly sales performance.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>
                      Record sales by payment type (cash, card, transfer)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>View detailed sales reports by date or product</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>Track sales performance with visual analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>Export sales data in multiple formats</span>
                  </li>
                </ul>
                <div>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[600px] overflow-hidden rounded-lg border bg-background p-2 shadow-xl">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="Sales dashboard preview"
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Second Product Showcase */}
        <section className="bg-teal-50 py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="order-2 flex items-center justify-center lg:order-1">
                <div className="relative w-full max-w-[600px] overflow-hidden rounded-lg border bg-background p-2 shadow-xl">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="Credit management preview"
                    className="rounded-md"
                  />
                </div>
              </div>
              <div className="order-1 flex flex-col justify-center space-y-4 lg:order-2">
                <div className="space-y-2">
                  <div className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                    Credit Management
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                    Effortlessly Manage Customer Credit
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Keep track of customer credit, manage payments, and generate
                    professional invoices with our comprehensive credit
                    management system.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>Track outstanding credit for each customer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>Mark items as paid with a single click</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>Generate professional invoices automatically</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-teal-600" />
                    <span>Send payment reminders to customers</span>
                  </li>
                </ul>
                <div>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  What Our Customers Say
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  Don't just take our word for it. Here's what businesses like
                  yours have to say about BizManager.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 border-muted bg-background p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-teal-100"></div>
                    <div>
                      <h3 className="text-lg font-bold">Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">
                        Retail Store Owner
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "BizManager has completely transformed how we track sales
                    and manage customer credit. The reporting features have
                    given us insights we never had before."
                  </p>
                </div>
              </Card>
              <Card className="border-2 border-muted bg-background p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-teal-100"></div>
                    <div>
                      <h3 className="text-lg font-bold">Michael Chen</h3>
                      <p className="text-sm text-muted-foreground">
                        Restaurant Manager
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The inventory management feature has saved us countless
                    hours and reduced waste by 30%. The interface is intuitive
                    and our staff picked it up quickly."
                  </p>
                </div>
              </Card>
              <Card className="border-2 border-muted bg-background p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-teal-100"></div>
                    <div>
                      <h3 className="text-lg font-bold">Amara Okafor</h3>
                      <p className="text-sm text-muted-foreground">
                        Wholesale Distributor
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Managing credit with multiple customers used to be a
                    nightmare. With BizManager, we can easily track who owes
                    what and send professional invoices with a click."
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="bg-gradient-to-b from-teal-50 to-white py-20"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  Choose the plan that works best for your business. All plans
                  include a 14-day free trial.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card className="flex flex-col border-2 border-muted p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Starter</h3>
                  <p className="text-sm text-muted-foreground">
                    For small businesses just getting started
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Sales tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Basic credit management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Simple reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>1 user account</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </Card>
              <Card className="relative flex flex-col border-2 border-primary p-6">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                  Most Popular
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Professional</h3>
                  <p className="text-sm text-muted-foreground">
                    For growing businesses with more needs
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Everything in Starter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Advanced credit management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Inventory management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Invoice generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>5 user accounts</span>
                  </li>
                </ul>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Get Started
                </Button>
              </Card>
              <Card className="flex flex-col border-2 border-muted p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Enterprise</h3>
                  <p className="text-sm text-muted-foreground">
                    For larger businesses with complex needs
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 flex-1 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Advanced reporting & analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-teal-600" />
                    <span>Unlimited user accounts</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-700">
                  FAQ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl">
                  Find answers to common questions about BizManager.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-8 max-w-3xl space-y-4">
              <Card className="border-2 border-muted">
                <CardContent className="pt-6">
                  <div className="mb-2 text-lg font-bold">
                    How does the 14-day free trial work?
                  </div>
                  <p className="text-muted-foreground">
                    You can sign up for any plan and use all features for 14
                    days without being charged. No credit card is required to
                    start your trial. At the end of your trial, you can choose
                    to subscribe or your account will be automatically
                    downgraded to a limited free version.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted">
                <CardContent className="pt-6">
                  <div className="mb-2 text-lg font-bold">
                    Can I change plans later?
                  </div>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. If
                    you upgrade, the new features will be immediately available.
                    If you downgrade, the changes will take effect at the start
                    of your next billing cycle.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted">
                <CardContent className="pt-6">
                  <div className="mb-2 text-lg font-bold">
                    Is my data secure?
                  </div>
                  <p className="text-muted-foreground">
                    Yes, we take data security very seriously. All data is
                    encrypted both in transit and at rest. We use
                    industry-standard security practices and regular security
                    audits to ensure your data is protected.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted">
                <CardContent className="pt-6">
                  <div className="mb-2 text-lg font-bold">
                    Can I import my existing data?
                  </div>
                  <p className="text-muted-foreground">
                    Yes, BizManager supports importing data from CSV files and
                    several other business management systems. Our support team
                    can assist you with the data migration process.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-teal-600 py-20 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Transform Your Business?
                </h2>
                <p className="max-w-[700px] text-white/80 md:text-xl">
                  Join thousands of businesses that use BizManager to streamline
                  their operations and boost their growth.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-white/90"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                >
                  Schedule a Demo
                </Button>
              </div>
              <p className="text-sm text-white/80">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">BizManager</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The all-in-one business management solution for tracking sales,
                managing credit, and gaining valuable insights.
              </p>
              <div className="mt-4 flex space-x-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
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
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
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
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 BizManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
