import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { usersAPI, movesAPI } from '../services/api';
import './IntroGuideModal.css';

const IntroGuideModal = ({ show, onClose, onMoveSelect, userMasteredMoves = [], onFirstTimeStart }) => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const { masteredMoves: profileMasteredMoves } = useProfile();
  const [beginnerMoves, setBeginnerMoves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use ProfileContext masteredMoves as fallback if userMasteredMoves is empty
  const effectiveMasteredMoves = userMasteredMoves.length > 0 ? userMasteredMoves : profileMasteredMoves;
  
  // Extract move IDs from mastered moves objects - cached with useMemo
  const effectiveMasteredMoveIds = useMemo(() => {
    return effectiveMasteredMoves.map(move => {
      // Handle both object format {_id: "...", name: "..."} and direct ID format
      return typeof move === 'object' && move !== null ? move._id : move;
    });
  }, [effectiveMasteredMoves]);
  
    // Debug: Log effective mastered moves calculation
  console.log('IntroGuideModal render - effectiveMasteredMoves calculation:');
  console.log('  - userMasteredMoves.length:', userMasteredMoves.length);
  console.log('  - profileMasteredMoves.length:', profileMasteredMoves.length);
  console.log('  - effectiveMasteredMoves:', effectiveMasteredMoves);
  console.log('  - effectiveMasteredMoveIds:', effectiveMasteredMoveIds);

  // Define fetchRecommendedMoves function first
  const fetchRecommendedMoves = useCallback(async () => {
    setLoading(true);
    try {
      const response = await movesAPI.getAll({ limit: 1000 });
      const allMoves = response.moves || [];
      
      console.log('All moves fetched:', allMoves.length);
      console.log('User mastered moves from props:', userMasteredMoves);
      console.log('ProfileContext mastered moves:', profileMasteredMoves);
      console.log('Effective mastered moves:', effectiveMasteredMoves);
      console.log('Effective mastered move IDs:', effectiveMasteredMoveIds);
      
      // Define level order (Beginner -> Master)
      const levelOrder = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Skilled', 'Master'];
      
      // Filter for moves that user hasn't mastered yet, sorted by level
      const availableMoves = allMoves.filter(move => {
        const isMastered = effectiveMasteredMoveIds.includes(move._id);
        return !isMastered;
      });
      
      console.log('Available moves (not mastered):', availableMoves.length);
      
      // Sort moves by level priority
      const sortedMoves = availableMoves.sort((a, b) => {
        const levelA = levelOrder.indexOf(a.level || 'Beginner');
        const levelB = levelOrder.indexOf(b.level || 'Beginner');
        return levelA - levelB;
      });
      
      console.log('Sorted moves by level:', sortedMoves.map(m => `${m.name} (${m.level})`));
      
      // Try to find 3 moves with different categories, prioritizing level order
      const recommendedMoves = [];
      const usedCategories = new Set();
      
      for (const move of sortedMoves) {
        if (recommendedMoves.length >= 3) break;
        
        // If we haven't used this category yet, add the move
        if (!usedCategories.has(move.category)) {
          recommendedMoves.push(move);
          usedCategories.add(move.category);
          console.log(`Added move with unique category: ${move.name} (${move.category})`);
        }
      }
      
      // If we don't have 3 moves yet, fill with remaining moves (even if same category)
      if (recommendedMoves.length < 3) {
        for (const move of sortedMoves) {
          if (recommendedMoves.length >= 3) break;
          if (!recommendedMoves.some(rm => rm._id === move._id)) {
            recommendedMoves.push(move);
            console.log(`Added additional move: ${move.name} (${move.category})`);
          }
        }
      }
      
      console.log('Final recommended moves to show:', recommendedMoves.map(m => `${m.name} (${m.category})`));
      
             // If no moves available, show a message
       if (recommendedMoves.length === 0) {
         console.log('No moves available for this user - they have mastered everything!');
       }
      
             setBeginnerMoves(recommendedMoves);
     } catch (error) {
       console.error('Error fetching recommended moves:', error);
       // Fallback to default moves if API fails
       setBeginnerMoves([
         { name: "Top Rock", category: "Toprock", xp: 50 },
         { name: "Six Step", category: "Footwork", xp: 75 },
         { name: "Baby Freeze", category: "Freezes", xp: 100 }
       ]);
            } finally {
         setLoading(false);
       }
     }, [effectiveMasteredMoveIds]);

  // Fetch recommended moves from API when modal opens
  useEffect(() => {
    console.log('IntroGuideModal useEffect triggered - show:', show, 'effectiveMasteredMoveIds:', effectiveMasteredMoveIds);
    if (show) {
      fetchRecommendedMoves();
    }
  }, [show, fetchRecommendedMoves]);

  const markGuideAsSeen = async () => {
    if (currentUser?._id) {
      try {
        const response = await usersAPI.markIntroGuideAsSeen(currentUser._id);
        console.log('Intro guide marked as seen and user marked as not first time');
        // Update local context with both fields
        updateUser({ 
          hasSeenIntroGuide: true,
          isFirstTimeUser: false 
        });
      } catch (error) {
        console.error('Error marking intro guide as seen:', error);
      }
    }
  };

  const handleStartNow = async () => {
    console.log('Starting quest and closing modal');
    await markGuideAsSeen();
    console.log('About to call onClose()');
    
    // If this is a first time user, trigger the dimmed state
    if (currentUser?.isFirstTimeUser && onFirstTimeStart) {
      onFirstTimeStart();
    }
    
    onClose(); // Close modal immediately
    console.log('onClose() called');
  };

  const handleMoveCardClick = (move) => {
    console.log('Move card clicked:', move);
    // Close the modal
    onClose();
    // Trigger move selection in parent component
    if (onMoveSelect) {
      onMoveSelect(move);
    }
  };

  if (!show) return null;

  return (
    <div className="intro-guide-overlay" onClick={onClose}>
      <div className="intro-guide-card" onClick={(e) => e.stopPropagation()}>
        {/* Top section with character image */}
        <div className="intro-guide-top">
          <img 
            src="/assets/cutekitty223.png" 
            alt="Cute Kitty Guide" 
            className="intro-guide-character"
          />
        </div>

                 {/* Title and subtitle */}
         <h1 className="intro-guide-title">Velkommen til Breakverse! 🎉</h1>
         <p className="intro-guide-subtitle">
           {currentUser?.isFirstTimeUser 
             ? "Som ny bruger får du en personlig guide til at komme i gang!"
             : "Her er de næste trin, vi anbefaler:"
           }
         </p>

                 {/* Move cards - show in columns */}
         <div className="intro-guide-moves">
           {loading ? (
             <div className="intro-guide-loading">
               <p>Loading beginner moves...</p>
             </div>
           ) : beginnerMoves.length > 0 ? (
             beginnerMoves.map((move, index) => (
               <div 
                 key={move._id || index} 
                 className="intro-guide-move-card"
                 onClick={() => handleMoveCardClick(move)}
               >
                 <h3 className="intro-guide-move-title">{move.name}</h3>
                 <p className="intro-guide-move-category">{move.category}</p>
                 <p className="intro-guide-move-xp">{move.xp || 50} XP</p>
               </div>
             ))
                        ) : (
               <div className="intro-guide-no-moves">
                 <p>Du har allerede mesteret alle moves! 🎉</p>
                 <p>Fantastisk arbejde! Du er en true Breakverse master!</p>
               </div>
             )}
         </div>

                 {/* Progress bar */}
         <div className="intro-guide-progress">
           <div className="progress-label">0/{beginnerMoves.length} Recommended Moves</div>
           <div className="progress-bar">
             <div className="progress-fill" style={{ width: '0%' }}></div>
           </div>
         </div>



        {/* Bottom button */}
        <div className="intro-guide-buttons">
                     <button 
             className="intro-guide-modal-btn primary" 
             onClick={handleStartNow}
             type="button"
           >
             {currentUser?.isFirstTimeUser ? "Kom i gang!" : "Start"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default IntroGuideModal;
