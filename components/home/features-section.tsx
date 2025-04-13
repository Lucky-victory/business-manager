import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  Users,
  Search,
  LineChart,
  Wallet,
} from "lucide-react";
import { staggerContainer, cardVariants } from "../ui/animations";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Sales Management",
      items: [
        "Record daily sales with detailed information",
        "Track multiple payment types (cash, transfer, POS)",
        "View historical sales data organized by date",
        "Monitor profit margins and performance",
      ],
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Credit Management",
      items: [
        "Track purchases made on credit",
        "Maintain a database of debtors with contact info",
        "Calculate outstanding balances automatically",
        "Generate professional invoices instantly",
      ],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Profiles",
      items: [
        "Maintain user profiles with personal information",
        "Store company details for invoicing",
        "Customize display settings to your preference",
        "Secure authentication and session management",
      ],
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Powerful Search",
      items: [
        "Search across sales and credit records",
        "Filter results by various criteria",
        "Find information quickly and efficiently",
        "Export search results for reporting",
      ],
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Reports & Analytics",
      items: [
        "View sales metrics by date with summaries",
        "Track total sales amount and items sold",
        "Generate credit summaries and reports",
        "Visualize business performance over time",
      ],
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Financial Management",
      items: [
        "Track profit margins on each sale",
        "Monitor outstanding debts and payments",
        "Reconcile accounts with payment records",
        "Get insights into financial health",
      ],
    },
  ];

  return (
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
              Biz Manager combines powerful features in one intuitive platform,
              designed specifically for small business owners.
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
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover">
              <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                <CardHeader className="pb-2">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-emerald-100 text-emerald-700 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="mr-2 h-1 w-1 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
