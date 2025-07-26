import Crew from '../models/crew.models.js';
import User from '../models/user.models.js';

// Get all crews
export const getAllCrews = async (req, res) => {
  try {
    const crews = await Crew.find()
      .populate('leader', 'username name level')
      .populate('members', 'username name level');
    
    res.json(crews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get crew by ID
export const getCrewById = async (req, res) => {
  try {
    const crew = await Crew.findById(req.params.id)
      .populate('leader', 'username name level')
      .populate('members', 'username name level');
    
    if (!crew) {
      return res.status(404).json({ message: 'Crew not found' });
    }
    
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create crew
export const createCrew = async (req, res) => {
  try {
    const crew = await Crew.create(req.body);
    const populatedCrew = await crew.populate('leader', 'username name level');
    
    res.status(201).json(populatedCrew);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update crew
export const updateCrew = async (req, res) => {
  try {
    const crew = await Crew.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('leader', 'username name level');
    
    if (!crew) {
      return res.status(404).json({ message: 'Crew not found' });
    }
    
    res.json(crew);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete crew
export const deleteCrew = async (req, res) => {
  try {
    const crew = await Crew.findByIdAndDelete(req.params.id);
    
    if (!crew) {
      return res.status(404).json({ message: 'Crew not found' });
    }
    
    res.json({ message: 'Crew deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 