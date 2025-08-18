import mongoose from 'mongoose';

const newsletterSignupSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true, unique: true, trim: true, lowercase: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'newsletter_signups' }
);

export default mongoose.model('NewsletterSignup', newsletterSignupSchema);


