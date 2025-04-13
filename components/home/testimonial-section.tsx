import { motion } from "framer-motion";
import { fadeIn, staggerContainer, cardVariants } from "../ui/animations";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Prisca Daniel",
      role: "Boutique Owner",
      text: "Biz Manager has completely transformed how I track sales and manage customer credit. I used to spend hours on spreadsheets, but now everything is organized in one place.",
    },
    {
      name: "Samuel Nnaemeka",
      role: "Car Parts Seller",
      text: "The credit management feature has helped me reduce bad debt by over 40%. I can now easily track who owes what and follow up with customers in a professional way.",
    },
    {
      name: "Emeka Onuoha",
      role: "Foam/Mattress Seller",
      text: "The reports and analytics have given me insights I never had before. I can now see which products are most profitable and make better purchasing decisions.",
    },
  ];

  return (
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
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={cardVariants} whileHover="hover">
              <Card className="border-2 border-transparent hover:border-emerald-600/20 transition-all h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-emerald-100 w-12 h-12 flex items-center justify-center text-emerald-700 font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
