import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaUsers, FaVideo, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/pages/terms-of-service.css';

export default function TermsOfService() {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <Link to="/" className="back-link">
          <FaArrowLeft />
        </Link>
        
        <div className="terms-header">
          <h1>Terms of Service</h1>
          <p className="terms-subtitle">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="terms-content">
          <div className="terms-intro">
            <p>
              Welcome to Breakverse! These Terms of Service ("Terms") govern your use of our breakdance community platform. 
              By accessing or using Breakverse, you agree to be bound by these Terms. If you don't agree to these Terms, 
              please don't use our platform.
            </p>
          </div>

          <section className="terms-section">
            <h2><FaShieldAlt /> 1. Acceptance of Terms</h2>
            <p>
              By creating an account, uploading content, or using any feature of Breakverse, you acknowledge that you have 
              read, understood, and agree to be bound by these Terms of Service. These Terms apply to all users of the platform, 
              including visitors, registered users, and contributors.
            </p>
          </section>

          <section className="terms-section">
            <h2><FaUsers /> 2. Eligibility</h2>
            <p>
              Breakverse is designed for the global breaking community. To use our platform:
            </p>
            <ul>
              <li>You must be at least 13 years old</li>
              <li>If you're under 18, you need parental or guardian consent</li>
              <li>You must provide accurate and complete information when creating your account</li>
              <li>You must comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2><FaShieldAlt /> 3. User Accounts</h2>
            <p>
              When you create an account on Breakverse, you're responsible for:
            </p>
            <ul>
              <li>Keeping your login credentials secure and confidential</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Maintaining accurate and up-to-date profile information</li>
            </ul>
            <p>
              We reserve the right to terminate or suspend accounts that violate these Terms or engage in harmful behavior.
            </p>
          </section>

          <section className="terms-section">
            <h2><FaVideo /> 4. Content & Ownership</h2>
            <p>
              <strong>Your Content:</strong> You retain ownership of videos, photos, and other content you upload to Breakverse. 
              However, by uploading content, you grant Breakverse a worldwide, non-exclusive, royalty-free license to:
            </p>
            <ul>
              <li>Display your content on our platform</li>
              <li>Share your content within the Breakverse community</li>
              <li>Use your content for promotional purposes (with proper attribution)</li>
              <li>Store and process your content to provide our services</li>
            </ul>
            <p>
              <strong>Our Content:</strong> All Breakverse trademarks, logos, design elements, and platform code remain our 
              exclusive property.
            </p>
          </section>

          <section className="terms-section">
            <h2><FaUsers /> 5. Community Guidelines</h2>
            <p>
              Breakverse is built on respect, creativity, and positive competition. We expect all users to:
            </p>
            <ul>
              <li>Treat fellow breakers with respect and sportsmanship</li>
              <li>Engage in fair and honest battles</li>
              <li>Provide constructive feedback and encouragement</li>
              <li>Respect different skill levels and backgrounds</li>
            </ul>
            <p>
              <strong>Prohibited Behavior:</strong> We do not tolerate:
            </p>
            <ul>
              <li>Harassment, bullying, or hate speech</li>
              <li>Spam, scams, or misleading content</li>
              <li>Illegal activities or content</li>
              <li>Impersonation of other users or officials</li>
              <li>Attempts to manipulate the battle or badge system</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2><FaShieldAlt /> 6. Privacy</h2>
            <p>
              Your privacy is important to us. Our collection and use of your personal information is governed by our 
              <Link to="/policy" className="policy-link"> Privacy Policy</Link>, which is incorporated into these Terms by reference. 
              By using Breakverse, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section className="terms-section">
            <h2><FaTrophy /> 7. Intellectual Property</h2>
            <p>
              Breakverse and its original content, features, and functionality are owned by Breakverse and are protected by 
              international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not:
            </p>
            <ul>
              <li>Copy, modify, or distribute our platform code</li>
              <li>Use our trademarks without written permission</li>
              <li>Reverse engineer or attempt to extract our source code</li>
              <li>Create derivative works based on our platform</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2><FaExclamationTriangle /> 8. Liability Disclaimer</h2>
            <p>
              <strong>Physical Activity:</strong> Breakdancing involves physical activity and inherent risks. Breakverse is not 
              liable for any injuries that occur during practice, battles, or events promoted through our platform.
            </p>
            <p>
              <strong>Service Availability:</strong> We strive to maintain reliable service, but we cannot guarantee uninterrupted 
              access. We're not liable for any damages caused by service interruptions or technical issues.
            </p>
            <p>
              <strong>User Disputes:</strong> Breakverse is not responsible for disputes between users, including battle outcomes, 
              badge disputes, or personal conflicts.
            </p>
          </section>

          <section className="terms-section">
            <h2><FaShieldAlt /> 9. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violations of these Terms. Grounds for termination include:
            </p>
            <ul>
              <li>Repeated violations of community guidelines</li>
              <li>Fraudulent or deceptive behavior</li>
              <li>Harassment or harmful conduct</li>
              <li>Attempts to manipulate our systems</li>
            </ul>
            <p>
              Upon termination, your right to use Breakverse ceases immediately, and we may delete your account and content.
            </p>
          </section>

          <section className="terms-section">
            <h2><FaShieldAlt /> 10. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time to reflect changes in our services or legal requirements. We will notify 
              users of significant changes through:
            </p>
            <ul>
              <li>Email notifications to registered users</li>
              <li>In-app announcements</li>
              <li>Updates to this page with a new "Last updated" date</li>
            </ul>
            <p>
              Continued use of Breakverse after changes become effective constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2><FaUsers /> 11. Contact Information</h2>
            <p>
              If you have questions about these Terms of Service or need support, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:support@breakverse.app">support@breakverse.app</a></p>
              <p><strong>Platform:</strong> <Link to="/learnmore">Breakverse Help Center</Link></p>
            </div>
          </section>

          <div className="terms-footer">
            <p>
              Thank you for being part of the Breakverse community! Let's keep breaking together and building something amazing.
            </p>
            <div className="terms-actions">
              <Link to="/register" className="btn-primary">Join Breakverse</Link>
              <Link to="/policy" className="btn-secondary">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
