import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="prose">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-gray-500">Last updated: April 12, 2025</p>
        </div>

        <div className="prose prose-emerald max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At Biz Manager, we respect your privacy and are committed to
            protecting your personal data. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our application.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with
            the terms of this Privacy Policy, please do not access Biz Manager.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We collect several types of information from and about users of Biz
            Manager, including:
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> This includes information
              that can be used to identify you, such as your name, email
              address, and phone number.
            </li>
            <li>
              <strong>Business Information:</strong> This includes information
              about your business, such as your company name, address, and
              business type.
            </li>
            <li>
              <strong>Transaction Information:</strong> This includes
              information about sales, credits, and other transactions you
              record in Biz Manager.
            </li>
            <li>
              <strong>Customer Information:</strong> This includes information
              about your customers, such as their names, contact information,
              and purchase history.
            </li>
            <li>
              <strong>Usage Information:</strong> This includes information
              about how you use Biz Manager, such as the features you access and
              the actions you take.
            </li>
          </ul>

          <h2>3. How We Collect Information</h2>
          <p>We collect information directly from you when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Enter information into Biz Manager</li>
            <li>Communicate with us</li>
            <li>Use Biz Manager features</li>
          </ul>
          <p>
            We also collect information automatically as you navigate through
            Biz Manager, including usage details, IP addresses, and information
            collected through cookies and other tracking technologies.
          </p>

          <h2>4. How We Use Your Information</h2>
          <p>
            We use the information we collect about you or that you provide to
            us, including any personal information:
          </p>
          <ul>
            <li>To provide, maintain, and improve Biz Manager</li>
            <li>To process and manage your account</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>
              To send you important information regarding Biz Manager, such as
              changes to our terms, conditions, and policies
            </li>
            <li>
              To personalize your experience and deliver content and product
              features relevant to your interests
            </li>
            <li>
              To monitor and analyze usage and trends to improve your experience
              with Biz Manager
            </li>
          </ul>

          <h2>5. Disclosure of Your Information</h2>
          <p>
            We may disclose personal information that we collect or you provide
            as described in this Privacy Policy:
          </p>
          <ul>
            <li>To our subsidiaries and affiliates</li>
            <li>
              To contractors, service providers, and other third parties we use
              to support our business
            </li>
            <li>
              To comply with any court order, law, or legal process, including
              to respond to any government or regulatory request
            </li>
            <li>
              To enforce or apply our Terms of Service and other agreements
            </li>
            <li>
              If we believe disclosure is necessary or appropriate to protect
              the rights, property, or safety of Biz Manager, our customers, or
              others
            </li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal
            information from accidental loss and from unauthorized access, use,
            alteration, and disclosure. All information you provide to us is
            stored on secure servers.
          </p>
          <p>
            The safety and security of your information also depends on you. We
            urge you to be careful about sharing your account credentials and to
            maintain appropriate security for your devices.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            We will retain your personal information for as long as necessary to
            fulfill the purposes for which we collected it, including for the
            purposes of satisfying any legal, accounting, or reporting
            requirements.
          </p>

          <h2>8. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul>
            <li>The right to access your personal information</li>
            <li>The right to rectify inaccurate personal information</li>
            <li>
              The right to request the deletion of your personal information
            </li>
            <li>
              The right to restrict the processing of your personal information
            </li>
            <li>The right to data portability</li>
            <li>
              The right to object to the processing of your personal information
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the contact
            information provided below.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Biz Manager is not intended for children under 16 years of age. We
            do not knowingly collect personal information from children under
            16. If you are under 16, do not use or provide any information on
            Biz Manager.
          </p>

          <h2>10. Changes to Our Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. If we make
            material changes to how we treat our users' personal information, we
            will notify you through a notice on the Biz Manager application.
          </p>
          <p>
            The date the Privacy Policy was last revised is identified at the
            top of the page. You are responsible for periodically visiting this
            Privacy Policy to check for any changes.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            To ask questions or comment about this Privacy Policy and our
            privacy practices, contact us at:
          </p>
          <p>
            Email: privacy@bizmanager.africa
            <br />
            {/* Address: 123 Business Street, Suite 456, Business City, BC 78901 */}
          </p>
        </div>
      </div>
    </div>
  );
}
