import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  Users,
  LineChart,
  Search,
  Wallet,
} from "lucide-react";
import { fadeIn, staggerContainer, cardVariants } from "../ui/animations";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Increase Revenue",
      description:
        "Better track sales and identify opportunities to boost your bottom line.",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Reduce Bad Debt",
      description:
        "Track credit sales and follow up with customers to improve cash flow.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Build Relationships",
      description:
        "Maintain customer information to provide personalized service.",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Data-Driven Decisions",
      description:
        "Make informed business decisions based on real-time analytics.",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Save Time",
      description:
        "Quickly find information with powerful search and filtering tools.",
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Professional Image",
      description:
        "Generate professional invoices and maintain organized records.",
    },
  ];

  return (
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
              Join thousands of small business owners who have transformed their
              operations with our comprehensive solution.
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
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="flex flex-col items-center space-y-3 rounded-lg border p-6 bg-white dark:bg-gray-950"
            >
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold">{benefit.title}</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
