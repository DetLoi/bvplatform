import Battle from '../models/battle.models.js';

// Get all battles
export const getAllBattles = async (req, res) => {
  try {
    const battles = await Battle.find().sort({ date: -1 });
    res.json(battles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get battle by ID
export const getBattleById = async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id);
    
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
    res.status(201).json(battle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update battle
export const updateBattle = async (req, res) => {
  try {
    const battle = await Battle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }
    
    res.json(battle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete battle
export const deleteBattle = async (req, res) => {
  try {
    const battle = await Battle.findByIdAndDelete(req.params.id);
    
    if (!battle) {
      return res.status(404).json({ message: 'Battle not found' });
    }
    
    res.json({ message: 'Battle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 