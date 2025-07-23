// Crews Data
import specificKidzLogo from '../assets/specifickidz.png';
import flcLogo from '../assets/flc.png';
import benjiImage from '../assets/benji.png';
import dloiImage from '../assets/dloi.png';
import illwillImage from '../assets/illwill.png';
import kienImage from '../assets/kien.png';
import lucaImage from '../assets/luca.png';
import oritamiImage from '../assets/oritami.png';
import peleImage from '../assets/pele.png';
import yungmImage from '../assets/yungm.png';
import ronwayImage from '../assets/ronway.png';

export const crews = [
  {
    id: 'specific-kidz',
    name: 'Specific Kidz',
    logo: specificKidzLogo,
    description: 'Breaking crew from Denmark',
    memberCount: 12,
    totalXP: 32500,
    level: 14,
    color: '#e6c77b',
    members: [
      {
        id: 1,
        name: "DLoi",
        level: 15,
        xp: 8500,
        profileImage: dloiImage,
        specialty: "Power Moves",
        masteredMoves: 23,
        achievements: 8,
        status: "online"
      },
      {
        id: 2,
        name: "Benji",
        level: 13,
        xp: 7200,
        profileImage: benjiImage,
        specialty: "Footwork",
        masteredMoves: 20,
        achievements: 7,
        status: "online"
      },
      {
        id: 3,
        name: "Kien",
        level: 12,
        xp: 6500,
        profileImage: kienImage,
        specialty: "Spins",
        masteredMoves: 18,
        achievements: 6,
        status: "online"
      },
      {
        id: 4,
        name: "Pele",
        level: 11,
        xp: 5800,
        profileImage: peleImage,
        specialty: "Freezes",
        masteredMoves: 16,
        achievements: 5,
        status: "offline"
      },
      {
        id: 5,
        name: "Oritami",
        level: 10,
        xp: 5200,
        profileImage: oritamiImage,
        specialty: "Toprock",
        masteredMoves: 14,
        achievements: 4,
        status: "online"
      },
      {
        id: 6,
        name: "Yung M",
        level: 9,
        xp: 4600,
        profileImage: yungmImage,
        specialty: "Windmills",
        masteredMoves: 12,
        achievements: 3,
        status: "online"
      },
      {
        id: 7,
        name: "Niels",
        level: 8,
        xp: 4000,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        specialty: "Headspins",
        masteredMoves: 10,
        achievements: 3,
        status: "offline"
      },
      {
        id: 8,
        name: "Armony",
        level: 7,
        xp: 3400,
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        specialty: "Backspins",
        masteredMoves: 8,
        achievements: 2,
        status: "online"
      },
      {
        id: 9,
        name: "Cpt. Jomar",
        level: 6,
        xp: 2800,
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        specialty: "Baby Freezes",
        masteredMoves: 6,
        achievements: 2,
        status: "online"
      },
      {
        id: 10,
        name: "Ronway",
        level: 5,
        xp: 2200,
        profileImage: ronwayImage,
        specialty: "Basics",
        masteredMoves: 4,
        achievements: 1,
        status: "offline"
      },
      {
        id: 11,
        name: "Ill Will",
        level: 4,
        xp: 1600,
        profileImage: illwillImage,
        specialty: "Basics",
        masteredMoves: 3,
        achievements: 1,
        status: "online"
      },
      {
        id: 12,
        name: "Luca",
        level: 3,
        xp: 1000,
        profileImage: lucaImage,
        specialty: "Basics",
        masteredMoves: 2,
        achievements: 0,
        status: "online"
      }
    ]
  },
  {
    id: 'familia-loca',
    name: 'Famillia Loca',
    logo: flcLogo,
    description: 'Breaking crew from Denmark',
    memberCount: 6,
    totalXP: 14500,
    level: 9,
    color: '#ff6b6b',
    members: [
      {
        id: 1,
        name: "Emilio",
        level: 12,
        xp: 6800,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        specialty: "Power Moves",
        masteredMoves: 19,
        achievements: 6,
        status: "online"
      },
      {
        id: 2,
        name: "Andy",
        level: 10,
        xp: 5200,
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        specialty: "Spins",
        masteredMoves: 15,
        achievements: 4,
        status: "online"
      },
      {
        id: 3,
        name: "Danielito",
        level: 8,
        xp: 3800,
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        specialty: "Freezes",
        masteredMoves: 12,
        achievements: 3,
        status: "offline"
      },
      {
        id: 4,
        name: "Alireza",
        level: 7,
        xp: 3200,
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        specialty: "Footwork",
        masteredMoves: 10,
        achievements: 2,
        status: "online"
      },
      {
        id: 5,
        name: "Bravo",
        level: 6,
        xp: 2600,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        specialty: "Toprock",
        masteredMoves: 8,
        achievements: 2,
        status: "online"
      },
      {
        id: 6,
        name: "Yung M",
        level: 5,
        xp: 2000,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        specialty: "Windmills",
        masteredMoves: 6,
        achievements: 1,
        status: "offline"
      }
    ]
  }
]; 