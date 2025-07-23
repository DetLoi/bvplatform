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
    description: "The biggest breaking competition of the year! Show off your skills and compete against the best breakers in Denmark. Categories include: Toprock, Footwork, Freezes, Power Moves, and All-Style. Cash prizes and trophies for winners.",
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
    title: "Workshop with DLoi - Power Moves Masterclass",
    date: "February 28, 2024",
    time: "14:00 - 17:00",
    location: "Urban Dance Studio, Copenhagen",
    participants: 18,
    maxParticipants: 20,
    category: "Workshop",
    description: "Join DLoi from Specific Kidz for an intensive 3-hour workshop focusing on power moves and transitions. Perfect for intermediate to advanced breakers looking to level up their game. Learn proper technique, safety, and progression methods.",
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
    location: "Underground Club, Copenhagen",
    participants: 45,
    maxParticipants: 60,
    category: "Cypher",
    description: "A night of pure breaking culture! Open cypher with live DJ, no competition, just pure expression and community. All levels welcome. Bring your A-game and positive energy! Live DJ spinning classic breakbeats.",
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
  },
  {
    id: 4,
    title: "Red Bull BC One Denmark Qualifier",
    date: "April 20, 2024",
    time: "16:00 - 23:00",
    location: "Kødbyen, Copenhagen",
    battleFormat: "1v1 battle",
    category: "Competition",
    description: "Qualify for the Red Bull BC One World Finals! The most prestigious breaking competition in the world. Only the best breakers from Denmark will compete for the chance to represent at the global stage.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    status: "upcoming",
    featured: true,
    registrationOpen: true,
    maxParticipants: 64,
    currentParticipants: 48,
    entryFee: "100 DKK",
    prizes: "Trip to World Finals + cash prize",
    organizer: "Red Bull",
    contactEmail: "bcone@redbull.dk",
    website: "https://www.redbull.com/bcone",
    socialMedia: {
      instagram: "@redbullbcone",
      facebook: "Red Bull BC One"
    }
  },
  {
    id: 5,
    title: "Footwork Fundamentals Workshop",
    date: "March 5, 2024",
    time: "10:00 - 13:00",
    location: "Breakdance Academy, Aarhus",
    participants: 12,
    maxParticipants: 15,
    category: "Workshop",
    description: "Master the fundamentals of footwork with Benji from Specific Kidz. Perfect for beginners and intermediate breakers. Learn proper form, rhythm, and progression from basic to advanced footwork patterns.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    status: "upcoming",
    featured: false,
    registrationOpen: true,
    entryFee: "120 DKK",
    prizes: "Certificate of completion",
    organizer: "Breakdance Academy",
    contactEmail: "workshops@breakdanceacademy.dk",
    website: "https://breakdanceacademy.dk",
    socialMedia: {
      instagram: "@breakdanceacademy",
      facebook: "Breakdance Academy"
    }
  },
  {
    id: 6,
    title: "Summer Jam 2024",
    date: "July 15, 2024",
    time: "12:00 - 20:00",
    location: "Kongens Have, Copenhagen",
    battleFormat: "2v2 + 1v1 + kids battle",
    category: "Competition",
    description: "Annual summer breaking festival in the heart of Copenhagen! Multiple categories, live music, food vendors, and family-friendly atmosphere. The biggest breaking event of the summer!",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
    status: "upcoming",
    featured: true,
    registrationOpen: true,
    maxParticipants: 100,
    currentParticipants: 75,
    entryFee: "Free",
    prizes: "Trophies and merchandise",
    organizer: "Copenhagen Breaking Community",
    contactEmail: "info@summerjam.dk",
    website: "https://summerjam.dk",
    socialMedia: {
      instagram: "@summerjamcph",
      facebook: "Summer Jam Copenhagen"
    }
  },
  {
    id: 7,
    title: "Freeze Workshop with Pele",
    date: "March 12, 2024",
    time: "19:00 - 21:00",
    location: "Dance Studio Nord, Copenhagen",
    participants: 8,
    maxParticipants: 12,
    category: "Workshop",
    description: "Learn advanced freeze techniques with Pele from Specific Kidz. Focus on balance, strength, and creative freeze combinations. Suitable for intermediate to advanced breakers.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop",
    status: "upcoming",
    featured: false,
    registrationOpen: true,
    entryFee: "80 DKK",
    prizes: "Certificate of completion",
    organizer: "Dance Studio Nord",
    contactEmail: "workshops@dancestudionord.dk",
    website: "https://dancestudionord.dk",
    socialMedia: {
      instagram: "@dancestudionord",
      facebook: "Dance Studio Nord"
    }
  },
  {
    id: 8,
    title: "Battle of the Crews",
    date: "May 25, 2024",
    time: "18:00 - 24:00",
    location: "Vega, Copenhagen",
    battleFormat: "Crew vs Crew battle",
    category: "Competition",
    description: "Crew battles are back! Represent your crew in this epic showdown. 3v3 format, multiple rounds, and the ultimate crew bragging rights. Which crew will reign supreme?",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
    status: "upcoming",
    featured: true,
    registrationOpen: true,
    maxParticipants: 16,
    currentParticipants: 12,
    entryFee: "200 DKK per crew",
    prizes: "Crew trophy and cash prize",
    organizer: "Vega",
    contactEmail: "events@vega.dk",
    website: "https://vega.dk",
    socialMedia: {
      instagram: "@vega_copenhagen",
      facebook: "Vega Copenhagen"
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