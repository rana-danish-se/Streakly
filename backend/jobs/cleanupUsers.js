import User from '../models/User.js';

const deleteUnverifiedUsers = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: twentyFourHoursAgo }
    });

    return { success: true, count: result.deletedCount };

  } catch (error) {
    console.error('❌ Error in Unverified User Cleanup Job:', error);
    throw error;
  }
};

export default deleteUnverifiedUsers;
