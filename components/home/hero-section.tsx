import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Text content - now centered */}
          <motion.div
            className="flex flex-col items-center justify-center space-y-6 text-center max-w-3xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Manage Your Business With Confidence
              </h1>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">
                The all-in-one solution for small businesses to track sales,
                manage credit, and build customer relationships.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 w-full justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 px-8"
              >
                <Link href="/auth/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Book a Demo
              </Button>
            </div>
            <div className="flex items-center gap-6 text-md flex-wrap justify-center">
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

          {/* Dashboard image - now below text */}
          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative aspect-video overflow-hidden rounded-xl border bg-background shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <Image
                src="/biz-manager-sales.png"
                alt="Biz Manager Dashboard"
                width={1280}
                height={720}
                className="object-cover w-full"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
