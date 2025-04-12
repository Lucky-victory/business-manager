import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="prose">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-4 text-gray-500">Last updated: April 12, 2025</p>
        </div>

        <div className="prose prose-emerald max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Biz Manager ("we," "our," or "us"). By accessing or using
            our application, you agree to be bound by these Terms of Service
            ("Terms"). Please read these Terms carefully before using Biz
            Manager.
          </p>
          <p>
            By accessing or using Biz Manager, you agree to these Terms. If you
            do not agree to these Terms, you may not access or use Biz Manager.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Biz Manager is a free business management application designed for
            small businesses to track sales, manage credit/debt, and maintain
            customer relationships. The application includes features for sales
            management, credit management, user profile management, and search
            functionality.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use certain features of Biz Manager, you may need to create a
            user account. You are responsible for maintaining the
            confidentiality of your account credentials and for all activities
            that occur under your account. You agree to notify us immediately of
            any unauthorized use of your account.
          </p>
          <p>
            You are responsible for providing accurate and complete information
            when creating your account. You may not use false or misleading
            information or impersonate another person or entity.
          </p>

          <h2>4. User Content</h2>
          <p>
            You retain ownership of any content you submit, post, or display on
            or through Biz Manager ("User Content"). By submitting User Content,
            you grant us a worldwide, non-exclusive, royalty-free license to
            use, copy, modify, and display your User Content in connection with
            the operation of Biz Manager.
          </p>
          <p>
            You are solely responsible for your User Content and the
            consequences of posting or publishing it. You represent and warrant
            that you own or have the necessary rights to post your User Content
            and that your User Content does not violate the rights of any third
            party.
          </p>

          <h2>5. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>
              Use Biz Manager for any illegal purpose or in violation of any
              local, state, national, or international law
            </li>
            <li>
              Violate or encourage others to violate the rights of third
              parties, including intellectual property rights
            </li>
            <li>
              Attempt to gain unauthorized access to Biz Manager or its related
              systems or networks
            </li>
            <li>
              Interfere with or disrupt the operation of Biz Manager or the
              servers or networks used to make Biz Manager available
            </li>
            <li>
              Use any robot, spider, or other automated device to access Biz
              Manager
            </li>
            <li>
              Transmit any viruses, worms, defects, Trojan horses, or other
              items of a destructive nature
            </li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            Biz Manager and its original content, features, and functionality
            are owned by us and are protected by international copyright,
            trademark, patent, trade secret, and other intellectual property or
            proprietary rights laws.
          </p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>
            BIZ MANAGER IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT
            NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            WE DO NOT WARRANT THAT BIZ MANAGER WILL BE UNINTERRUPTED OR
            ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT BIZ MANAGER OR
            THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER
            HARMFUL COMPONENTS.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
            LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
            INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR
            INABILITY TO ACCESS OR USE BIZ MANAGER.
          </p>

          <h2>9. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold us harmless from and
            against any claims, liabilities, damages, losses, and expenses,
            including, without limitation, reasonable legal and accounting fees,
            arising out of or in any way connected with your access to or use of
            Biz Manager or your violation of these Terms.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may terminate or suspend your access to Biz Manager immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use Biz Manager will immediately
            cease. If you wish to terminate your account, you may simply
            discontinue using Biz Manager.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will try to
            provide at least 30 days' notice prior to any new terms taking
            effect.
          </p>
          <p>
            By continuing to access or use Biz Manager after those revisions
            become effective, you agree to be bound by the revised terms. If you
            do not agree to the new terms, please stop using Biz Manager.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the
            laws, without regard to its conflict of law provisions.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            support@bizmanager.africa.
          </p>
        </div>
      </div>
    </div>
  );
}
