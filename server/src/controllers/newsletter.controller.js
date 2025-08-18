import NewsletterSignup from '../models/newsletter.models.js';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || !/.+@.+\..+/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    const normalized = String(email).trim().toLowerCase();
    const existing = await NewsletterSignup.findOne({ email: normalized });
    if (existing) {
      return res.status(200).json({ message: 'Already subscribed', signup: existing });
    }
    const signup = await NewsletterSignup.create({ email: normalized });
    return res.status(201).json({ message: 'Subscribed', signup });
  } catch (err) {
    console.error('newsletter subscribe error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const list = async (req, res) => {
  try {
    const { q } = req.query || {};
    const filter = q ? { email: { $regex: q, $options: 'i' } } : {};
    const signups = await NewsletterSignup.find(filter).sort({ createdAt: -1 }).limit(500);
    return res.json({ signups });
  } catch (err) {
    console.error('newsletter list error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await NewsletterSignup.findByIdAndDelete(id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('newsletter delete error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


