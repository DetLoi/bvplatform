import cron from 'node-cron';
import User from '../models/user.models.js';

export function startAccountCleanup() {
  // Every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const result = await User.deleteMany({
        isVerified: false,
        verificationCodeExpiry: { $lte: now },
      });
      if (result.deletedCount) {
        console.log(`[Cleanup] Deleted ${result.deletedCount} expired unverified account(s)`);
      }
    } catch (err) {
      console.error('[Cleanup] Error deleting expired unverified accounts:', err);
    }
  });
}


