import Battle from '../models/battle.models.js';
import User from '../models/user.models.js';
import { createBattleNotification, notifyJudges } from './notification.controller.js';
import { deleteMultipleVideosFromCloudinary } from '../utils/cloudinary.js';

// Helper functions for battle state management
const isBattleCompleted = (battle) => {
  return battle.videos?.challenger && battle.videos?.opponent;
};

const isBattleJudged = (battle) => {
  // Check if all 5 categories have been voted on
  const categories = ['Foundation', 'Originality', 'Execution', 'Dynamics', 'Battle'];
  const votedCategories = new Set(battle.votes?.map(vote => vote.category) || []);
  const isJudged = categories.every(category => votedCategories.has(category));
  
  console.log('Battle Judged Check:', {
    battleId: battle._id,
    totalVotes: battle.votes?.length || 0,
    votedCategories: Array.from(votedCategories),
    requiredCategories: categories,
    isJudged: isJudged
  });
  
  return isJudged;
};

const updateBattleState = (battle) => {
  if (isBattleJudged(battle)) {
    return 'judged';
  } else if (isBattleCompleted(battle)) {
    return 'completed';
  } else if (battle.videos?.challenger || battle.videos?.opponent) {
    return 'in progress';
  } else {
    return 'pending';
  }
};

// Get all battles with filtering
export const getAllBattles = async (req, res) => {
  try {
    const { user, status, challenger, opponent, visibility } = req.query;
    let query = {};

    // Determine if requester is admin from headers
    const rolesHeader = req.headers['user-roles'] || '';
    const isAdmin = rolesHeader
      .split(',')
      .map((r) => r.trim().toLowerCase())
      .includes('admin');

    // Filter by user (either challenger or opponent)
    if (user) {
      query.$or = [
        { challenger: user },
        { opponent: user }
      ];
    }

    // Filter by challenger
    if (challenger) {
      query.challenger = challenger;
    }

    // Filter by opponent
    if (opponent) {
      query.opponent = opponent;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by visibility if explicitly requested
    if (visibility) {
      query.visibility = visibility;
    }

    // Admins can see all battles regardless of visibility
    if (!isAdmin) {
      // If a user-id header exists, allow them to see their private battles; otherwise hide private
      const requesterId = req.headers['user-id'];
      if (!requesterId) {
        if (!visibility) {
          // Default for non-admin anonymous requests: only public battles
          query.visibility = 'public';
        }
      } else {
        // Show public OR private where requester is participant
        query.$or = query.$or || [];
        query.$or.push({ visibility: 'public' });
        query.$or.push({ visibility: 'private', challenger: requesterId });
        query.$or.push({ visibility: 'private', opponent: requesterId });
      }
    }

    const battles = await Battle.find(query)
      .populate('challenger', 'name username level profileImage')
      .populate('opponent', 'name username level profileImage')
      .populate('winner', 'name username level profileImage')
      .sort({ createdAt: -1 });
    
    res.json(battles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get battles for a specific user
export const getBattlesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    let query = {
      $or: [
        { challenger: userId },
        { opponent: userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const battles = await Battle.find(query)
      .populate('challenger', 'name username level profileImage')
      .populate('opponent', 'name username level profileImage')
      .populate('winner', 'name username level profileImage')
      .sort({ createdAt: -1 });
    
    res.json(battles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get battle by ID
export const getBattleById = async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id)
      .populate('challenger', 'name username level profileImage')
      .populate('opponent', 'name username level profileImage')
      .populate('winner', 'name username level profileImage');
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }
    
    res.json(battle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create battle
export const createBattle = async (req, res) => {
  try {
    const battle = await Battle.create(req.body);
    
    // Create notification for the opponent
    if (battle.status === 'pending') {
      try {
        await createBattleNotification(
          battle.opponent,
          battle.challenger,
          'callout',
          battle._id
        );
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the battle creation if notification fails
      }
    }
    
    res.status(201).json(battle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update battle
export const updateBattle = async (req, res) => {
  try {
    const oldBattle = await Battle.findById(req.params.id);
    if (!oldBattle) {
      return res.status(404).json({ message: 'Battle not found' });
    }
    
    const battle = await Battle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('challenger', 'name username level profileImage')
     .populate('opponent', 'name username level profileImage')
     .populate('winner', 'name username level profileImage');
    
    // Handle status changes and create notifications
    if (req.body.status && req.body.status !== oldBattle.status) {
      try {
        if (req.body.status === 'accepted') {
          // Update status to 'in progress' when battle is accepted
          await Battle.findByIdAndUpdate(req.params.id, { status: 'in progress' });
          battle.status = 'in progress';
          
          // Notify challenger that battle was accepted
          await createBattleNotification(
            battle.challenger,
            battle.opponent,
            'battle_accepted',
            battle._id
          );
        } else if (req.body.status === 'declined') {
          // Notify challenger that battle was declined
          await createBattleNotification(
            battle.challenger,
            battle.opponent,
            'battle_declined',
            battle._id
          );
        } else if (req.body.status === 'cancelled') {
          // Notify opponent that battle was cancelled by challenger
          await createBattleNotification(
            battle.opponent,
            battle.challenger,
            'battle_cancelled',
            battle._id
          );
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the battle update if notification fails
      }
    }
    
    res.json(battle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete battle
export const deleteBattle = async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id);
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    // Collect video URLs to delete from Cloudinary
    const videoUrls = [];
    if (battle.videos?.challenger) {
      videoUrls.push(battle.videos.challenger);
    }
    if (battle.videos?.opponent) {
      videoUrls.push(battle.videos.opponent);
    }

    // Delete videos from Cloudinary if any exist
    if (videoUrls.length > 0) {
      try {
        console.log(`Deleting ${videoUrls.length} videos from Cloudinary for battle ${battle._id}`);
        await deleteMultipleVideosFromCloudinary(videoUrls);
        console.log('Videos deleted from Cloudinary successfully');
      } catch (cloudinaryError) {
        console.error('Error deleting videos from Cloudinary:', cloudinaryError);
        // Continue with battle deletion even if Cloudinary deletion fails
      }
    }

    // Delete the battle from database
    await Battle.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Battle deleted successfully',
      videosDeleted: videoUrls.length
    });
  } catch (error) {
    console.error('Error deleting battle:', error);
    res.status(500).json({ error: error.message });
  }
};

// Upload video for battle
export const uploadVideo = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { userId, videoUrl } = req.body;

    const battle = await Battle.findById(battleId);
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    // Check if user is part of this battle
    if (battle.challenger.toString() !== userId && battle.opponent.toString() !== userId) {
      return res.status(403).json({ message: 'You are not part of this battle' });
    }

    // Determine which video to update
    const isChallenger = battle.challenger.toString() === userId;
    const videoField = isChallenger ? 'videos.challenger' : 'videos.opponent';

    // Check if user has already uploaded a video
    const existingVideo = isChallenger ? battle.videos?.challenger : battle.videos?.opponent;
    if (existingVideo) {
      return res.status(400).json({ message: 'You have already uploaded a video for this battle' });
    }

    // Update the battle with the video URL
    const updateData = { [videoField]: videoUrl };
    
    // Check if both videos are now uploaded
    const otherVideo = isChallenger ? battle.videos?.opponent : battle.videos?.challenger;
    if (otherVideo) {
      // Both videos are uploaded - set status to completed
      updateData.status = 'completed';
    } else {
      // Only one video uploaded - keep status as in progress (or set to in progress if it was accepted)
      if (battle.status === 'accepted') {
        updateData.status = 'in progress';
      }
      // If already in progress, don't change status
    }

    const updatedBattle = await Battle.findByIdAndUpdate(
      battleId,
      updateData,
      { new: true, runValidators: true }
    ).populate('challenger', 'name username level profileImage')
     .populate('opponent', 'name username level profileImage');

    // Send notification to the other user about the video upload
    try {
      const otherUserId = isChallenger ? battle.opponent : battle.challenger;
      await createBattleNotification(otherUserId, userId, 'video_uploaded', battleId);
    } catch (notificationError) {
      console.error('Error sending video upload notification:', notificationError);
      // Don't fail the upload if notification fails
    }

    // If both videos are now uploaded, notify judges and both users
    if (updateData.status === 'completed') {
      try {
        // Notify judges
        await notifyJudges(updatedBattle);
        
        // Notify both users that the battle is ready for judging
        await createBattleNotification(
          battle.challenger,
          null, // System notification
          'battle_ready_for_judging',
          battleId,
          'Both videos have been uploaded! Your battle is now ready for judging.'
        );
        await createBattleNotification(
          battle.opponent,
          null, // System notification
          'battle_ready_for_judging',
          battleId,
          'Both videos have been uploaded! Your battle is now ready for judging.'
        );
      } catch (notificationError) {
        console.error('Error notifying judges and users:', notificationError);
        // Don't fail the upload if notification fails
      }
    }

    res.json(updatedBattle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get judge vote for a battle
export const getJudgeVote = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { judgeId, category } = req.query;

    const battle = await Battle.findById(battleId);
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    // Find existing vote for this judge and category
    const existingVote = battle.votes.find(vote => 
      vote.judgeId.toString() === judgeId && vote.category === category
    );

    res.json(existingVote || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit judge vote
export const submitJudgeVote = async (req, res) => {
  try {
    const { battleId } = req.params;
    const { judgeId, category, scoreA, scoreB } = req.body;

    // Validate scores
    if (scoreA < 1 || scoreA > 5 || scoreB < 1 || scoreB > 5) {
      return res.status(400).json({ message: 'Scores must be between 1 and 5' });
    }

    const battle = await Battle.findById(battleId);
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    // Check if battle is ready for judging
    if (battle.status !== 'completed') {
      return res.status(400).json({ message: 'Battle is not ready for judging' });
    }

    // Find existing vote for this judge and category
    const existingVoteIndex = battle.votes.findIndex(vote => 
      vote.judgeId.toString() === judgeId && vote.category === category
    );

    const newVote = {
      judgeId,
      category,
      scoreA,
      scoreB,
      timestamp: new Date()
    };

    if (existingVoteIndex >= 0) {
      // Update existing vote
      battle.votes[existingVoteIndex] = newVote;
    } else {
      // Add new vote
      battle.votes.push(newVote);
    }

    // Check if all required votes are in using helper function
    console.log('Checking if battle is judged after vote submission...');
    if (isBattleJudged(battle)) {
      console.log('Battle is now judged! Updating status...');
      // Calculate winner and update battle status
      const winner = calculateWinner(battle.votes, battle.challenger, battle.opponent);
      battle.status = 'judged';
      battle.winner = winner;
      
      // Update user statistics when battle is judged
      try {
        const challengerStats = await User.updateUserBattleStats(
          battle.challenger,
          { won: winner && winner.toString() === battle.challenger.toString() }
        );

        const opponentStats = await User.updateUserBattleStats(
          battle.opponent,
          { won: winner && winner.toString() === battle.opponent.toString() }
        );

        console.log('User battle statistics updated:', { challengerStats, opponentStats });
      } catch (statsError) {
        console.error('Error updating user battle statistics:', statsError);
      }
      
      // Create notification for both participants
      try {
        await createBattleNotification(
          battle.challenger,
          null,
          'battle_judged',
          battle._id,
          'Your battle has been judged and concluded!'
        );
        await createBattleNotification(
          battle.opponent,
          null,
          'battle_judged',
          battle._id,
          'Your battle has been judged and concluded!'
        );
      } catch (notificationError) {
        console.error('Error creating battle judged notifications:', notificationError);
      }
    }

    // Create update object with only the fields that need to be updated
    const updateData = {
      votes: battle.votes
    };
    
    // If battle is judged, add status and winner
    if (battle.status === 'judged') {
      updateData.status = 'judged';
      updateData.winner = battle.winner;
      console.log('Updating battle with judged status:', updateData);
    }

    const updatedBattle = await Battle.findByIdAndUpdate(
      battleId,
      updateData,
      { new: true, runValidators: true }
    ).populate('challenger', 'name username level profileImage')
     .populate('opponent', 'name username level profileImage')
     .populate('winner', 'name username level profileImage');

    res.json({ success: true, battle: updatedBattle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate winner based on votes
const calculateWinner = (votes, challenger, opponent) => {
  let winsA = 0, winsB = 0, ties = 0;
  let totalA = 0, totalB = 0;

  votes.forEach(vote => {
    totalA += vote.scoreA;
    totalB += vote.scoreB;
    if (vote.scoreA > vote.scoreB) winsA++;
    else if (vote.scoreB > vote.scoreA) winsB++;
    else ties++;
  });

  // First check: who won more categories
  if (winsA > winsB) return challenger;
  if (winsB > winsA) return opponent;

  // Second check: total score
  if (totalA > totalB) return challenger;
  if (totalB > totalA) return opponent;

  // If still tied, return null (draw)
  return null;
};

// Resolve battle and update user statistics
export const resolveBattle = async (req, res) => {
  try {
    const { battleId } = req.params;
    
    const battle = await Battle.findById(battleId)
      .populate('challenger', 'name username level profileImage')
      .populate('opponent', 'name username level profileImage')
      .populate('winner', 'name username level profileImage');
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }

    // Check if battle is already judged
    if (battle.status !== 'judged') {
      return res.status(400).json({ message: 'Battle is not ready for resolution' });
    }

    // Check if battle has already been resolved (has winner)
    if (battle.winner) {
      return res.status(400).json({ message: 'Battle has already been resolved' });
    }

    // Calculate winner based on votes
    const winner = calculateWinner(battle.votes, battle.challenger, battle.opponent);
    
    // Update battle with winner
    battle.winner = winner;
    await battle.save();

    // Update user statistics
    const challengerStats = await User.updateUserBattleStats(
      battle.challenger._id,
      { won: winner && winner.toString() === battle.challenger._id.toString() }
    );

    const opponentStats = await User.updateUserBattleStats(
      battle.opponent._id,
      { won: winner && winner.toString() === battle.opponent._id.toString() }
    );

    // Create notifications for both users
    try {
      await createBattleNotification(
        battle.challenger._id,
        null,
        'battle_resolved',
        battle._id,
        winner ? 
          (winner.toString() === battle.challenger._id.toString() ? 
            'Congratulations! You won the battle!' : 
            'The battle has been resolved. Better luck next time!') :
          'The battle ended in a draw!'
      );
      
      await createBattleNotification(
        battle.opponent._id,
        null,
        'battle_resolved',
        battle._id,
        winner ? 
          (winner.toString() === battle.opponent._id.toString() ? 
            'Congratulations! You won the battle!' : 
            'The battle has been resolved. Better luck next time!') :
          'The battle ended in a draw!'
      );
    } catch (notificationError) {
      console.error('Error creating battle resolution notifications:', notificationError);
    }

    // Return updated battle with user stats
    const updatedBattle = await Battle.findById(battleId)
      .populate('challenger', 'name username level profileImage battleXP battleLevel battleWins battleLosses battlesParticipated')
      .populate('opponent', 'name username level profileImage battleXP battleLevel battleWins battleLosses battlesParticipated')
      .populate('winner', 'name username level profileImage');

    res.json({
      success: true,
      battle: updatedBattle,
      challengerStats,
      opponentStats
    });
  } catch (error) {
    console.error('Error resolving battle:', error);
    res.status(500).json({ error: error.message });
  }
}; 