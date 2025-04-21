import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";

export const CTASection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-600 text-white">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Business?
            </h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of business owners who now run their companies
              better with Biz Manager.
            </p>
          </div>
          <div>
            <Button
              size="lg"
              asChild
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8"
            >
              <Link href="/auth/register">Get Started Now</Link>
            </Button>
          </div>
          <p className="text-sm text-emerald-100">
            Start your 14-day free trial today.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
