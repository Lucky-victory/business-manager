"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  DollarSign,
  LineChart,
  Search,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fadeIn,
  staggerContainer,
  cardVariants,
} from "@/components/ui/animations";
import { useAuth } from "@/lib/auth-client";

export default function Home() {
  const auth = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <DollarSign className="h-6 w-6 text-emerald-600" />
            <span>Biz Manager</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-emerald-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium hover:text-emerald-600 transition-colors"
            >
              Benefits
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-emerald-600 transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {!auth?.user ? (
              <>
                <Button asChild variant="outline" className="hidden md:flex">
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </>
            ) : (
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/app">Go to app</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Manage Your Business With Confidence
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    The all-in-one solution for small businesses to track sales,
                    manage credit, and build customer relationships.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    asChild
                    size={"lg"}
                    className="bg-emerald-600 hover:bg-emerald-700 px-8"
                  >
                    <Link href="/auth/register">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size={"lg"}>
                    Book a Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-md">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span>Completely free</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span>No hidden fees</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border bg-background shadow-xl">
                  <Image
                    src="/placeholder.svg?height=720&width=1280"
                    alt="Biz Manager Dashboard"
                    width={1280}
                    height={720}
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-800/30 dark:text-emerald-400">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Run Your Business
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Biz Manager combines powerful features in one intuitive
                  platform, designed specifically for small business owners.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader className="pb-2">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700 mb-4">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <CardTitle>Sales Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Record daily sales with detailed information
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Track multiple payment types (cash, transfer, POS)
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        View historical sales data organized by date
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Monitor profit margins and performance
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader className="pb-2">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700 mb-4">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <CardTitle>Credit Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Track purchases made on credit
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Maintain a database of debtors with contact info
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Calculate outstanding balances automatically
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Generate professional invoices instantly
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader className="pb-2">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700 mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <CardTitle>User Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Maintain user profiles with personal information
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Store company details for invoicing
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Customize display settings to your preference
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Secure authentication and session management
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader className="pb-2">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700 mb-4">
                      <Search className="h-6 w-6" />
                    </div>
                    <CardTitle>Powerful Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Search across sales and credit records
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Filter results by various criteria
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Find information quickly and efficiently
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Export search results for reporting
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader className="pb-2">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700 mb-4">
                      <LineChart className="h-6 w-6" />
                    </div>
                    <CardTitle>Reports & Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        View sales metrics by date with summaries
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Track total sales amount and items sold
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Generate credit summaries and reports
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Visualize business performance over time
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader className="pb-2">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700 mb-4">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <CardTitle>Financial Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Track profit margins on each sale
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Monitor outstanding debts and payments
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Reconcile accounts with payment records
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        Get insights into financial health
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={fadeIn("up")}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-800/30 dark:text-emerald-400">
                  Benefits
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Small Businesses Choose Biz Manager
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of small business owners who have transformed
                  their operations with our comprehensive solution.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white dark:bg-gray-950"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Increase Revenue</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Better track sales and identify opportunities to boost your
                  bottom line.
                </p>
              </motion.div>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white dark:bg-gray-950"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Reduce Bad Debt</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Track credit sales and follow up with customers to improve
                  cash flow.
                </p>
              </motion.div>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white dark:bg-gray-950"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Build Relationships</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Maintain customer information to provide personalized service.
                </p>
              </motion.div>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white dark:bg-gray-950"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <LineChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Data-Driven Decisions</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Make informed business decisions based on real-time analytics.
                </p>
              </motion.div>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white dark:bg-gray-950"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Save Time</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Quickly find information with powerful search and filtering
                  tools.
                </p>
              </motion.div>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white dark:bg-gray-950"
              >
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700">
                  <Wallet className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Professional Image</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Generate professional invoices and maintain organized records.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={fadeIn("up")}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 dark:bg-emerald-800/30 dark:text-emerald-400">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Trusted by Small Businesses
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Hear what our customers have to say about how Biz Manager has
                  transformed their businesses.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Prisca Daniel"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <CardTitle className="text-lg">Prisca Daniel</CardTitle>
                        <CardDescription>Boutique Owner</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      "Biz Manager has completely transformed how I track sales
                      and manage customer credit. I used to spend hours on
                      spreadsheets, but now everything is organized in one
                      place."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Samuel Nnaemeka"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <CardTitle className="text-lg">
                          Samuel Nnaemeka
                        </CardTitle>
                        <CardDescription>Car Parts Seller</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      "The credit management feature has helped me reduce bad
                      debt by over 40%. I can now easily track who owes what and
                      follow up with customers in a professional way."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Emeka Onuoha"
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <CardTitle className="text-lg">Emeka Onuoha</CardTitle>
                        <CardDescription>Foam/Mattress Seller</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      "The reports and analytics have given me insights I never
                      had before. I can now see which products are most
                      profitable and make better purchasing decisions."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-600 text-white">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Business?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of small business owners who have streamlined
                  their operations with Biz Manager.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size={"lg"}
                  asChild
                  className="bg-white text-emerald-600 hover:bg-gray-100 px-8"
                >
                  <Link href="/auth/register">Get Started Now</Link>
                </Button>
              </div>
              <p className="text-sm text-emerald-100">
                Completely free. No hidden fees.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <DollarSign className="h-6 w-6 text-emerald-600" />
            <span>Biz Manager</span>
          </div>
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2023 Biz Manager. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-emerald-600"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-emerald-600"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-emerald-600"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
