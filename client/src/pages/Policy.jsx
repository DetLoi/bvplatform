import { Link } from 'react-router-dom';
import '../styles/pages/policy.css';

export default function Policy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <section className="policy-hero">
          <h1 className="policy-title">Privacy Policy</h1>
          <p className="policy-subtitle">Your privacy matters. This page explains what we collect and how we use it.</p>
        </section>

        <section className="policy-content">
          <div className="policy-card">
          <h2>1. Information We Collect</h2>
          <p>
            We collect account details you provide (name, username, email) and usage data needed to operate
            Breakverse. Optional content such as profile images, cover photos, and battle videos are stored
            when you upload them.
          </p>

          <h2>2. How We Use Information</h2>
          <p>
            We use your information to create and manage your account, personalize your experience, enable
            progress tracking, battles, badges, and community features, and to keep the platform secure.
          </p>

          <h2>3. Cookies</h2>
          <p>
            We use cookies/local storage for essential functionality like session and preferences. You can
            control cookies through your browser settings, but some features may not work without them.
          </p>

          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your data. We may share minimal data with service providers (e.g., hosting,
            media storage) strictly to operate Breakverse.
          </p>

          <h2>5. Children’s Privacy</h2>
          <p>
            Breakverse is for the breaking community and may be used by minors with parental guidance.
            If you believe a child has provided personal data without consent, contact us to remove it.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your account data by contacting support.
          </p>

          <h2>7. Contact</h2>
          <p>
            For privacy questions, contact us at support@breakverse.app.
          </p>

          <p className="policy-updated">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <div className="policy-footer">
        <p>
          Your privacy is our priority. We're committed to protecting your data and being transparent about how we use it.
        </p>
        <div className="policy-actions">
          <Link to="/register" className="btn-primary">Join Breakverse</Link>
          <Link to="/terms" className="btn-secondary">Terms of Service</Link>
        </div>
      </div>
      </div>
    </div>
  );
}


