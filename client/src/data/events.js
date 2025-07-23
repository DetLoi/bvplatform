import nordicBreakImage from '../assets/image00006.jpeg';
import workshopImage from '../assets/ws.png';

export const events = [
  {
    id: 1,
    title: "Nordic Break League 2025",
    date: "March 15, 2025",
    time: "18:00 - 22:00",
    location: "Copenhagen Breakdance Center",
    battleFormat: "2v2 international + kids battle",
    category: "Competition",
    description: "The biggest breaking competition of the year! Show off your skills and compete against the best breakers in Denmark. Categories include: Toprock, Footwork, Freezes, Power Moves, and All-Style.",
    image: nordicBreakImage,
    status: "upcoming",
    featured: true,
    registrationOpen: true,
    maxParticipants: 32,
    currentParticipants: 24,
    entryFee: "Free",
    prizes: "Cash prizes and trophies",
    organizer: "Nordic Break League",
    contactEmail: "info@nordicbreakleague.com",
    website: "https://nordicbreak.dk",
    socialMedia: {
      instagram: "@nordicbreakleague",
      facebook: "Nordic Break League"
    }
  },
  {
    id: 2,
    title: "Workshop with DLoi",
    date: "February 28, 2024",
    time: "14:00 - 17:00",
    location: "Urban Dance Studio",
    participants: 18,
    maxParticipants: 20,
    category: "Workshop",
    description: "Join DLoi for an intensive 3-hour workshop focusing on power moves and transitions. Perfect for intermediate to advanced breakers looking to level up their game.",
    image: workshopImage,
    status: "upcoming",
    featured: false,
    registrationOpen: true,
    entryFee: "150 DKK",
    prizes: "Certificate of completion",
    organizer: "Urban Dance Studio",
    contactEmail: "workshops@urbandancestudio.dk",
    website: "https://urbandancestudio.dk",
    socialMedia: {
      instagram: "@urbandancestudio",
      facebook: "Urban Dance Studio"
    }
  },
  {
    id: 3,
    title: "Cypher Night - Open Floor",
    date: "February 10, 2024",
    time: "20:00 - 02:00",
    location: "Underground Club",
    participants: 45,
    maxParticipants: 60,
    category: "Cypher",
    description: "A night of pure breaking culture! Open cypher with live DJ, no competition, just pure expression and community. All levels welcome. Bring your A-game and positive energy!",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    status: "upcoming",
    featured: false,
    registrationOpen: false,
    entryFee: "50 DKK",
    prizes: "None - pure cypher",
    organizer: "Underground Club",
    contactEmail: "events@undergroundclub.dk",
    website: "https://undergroundclub.dk",
    socialMedia: {
      instagram: "@undergroundclub",
      facebook: "Underground Club"
    }
  }
];

// Helper functions for admin operations
export const addEvent = (newEvent) => {
  const eventWithId = {
    ...newEvent,
    id: Math.max(...events.map(e => e.id)) + 1
  };
  events.push(eventWithId);
  return eventWithId;
};

export const updateEvent = (id, updatedEvent) => {
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updatedEvent };
    return events[index];
  }
  return null;
};

export const deleteEvent = (id) => {
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events.splice(index, 1);
    return true;
  }
  return false;
};

export const getEventById = (id) => {
  return events.find(e => e.id === id);
};

export const getEventsByCategory = (category) => {
  return events.filter(e => e.category === category);
};

export const getFeaturedEvents = () => {
  return events.filter(e => e.featured);
};

export const getUpcomingEvents = () => {
  return events.filter(e => e.status === 'upcoming');
}; 