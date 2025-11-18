/**
 * Room name mapping for commercial settings
 * Maps room IDs (A, B, C, D, etc.) to commercial room names
 */

const roomNameOptions = [
  // Offices
  'Office A', 'Office B', 'Office C', 'Office D', 'Office E', 'Office F', 'Office G', 'Office H',
  // Common spaces
  'Kitchen', 'Break Room', 'Conference Room', 'Meeting Room', 'Reception',
  // Utility spaces
  'Bathroom', 'Restroom', 'Washroom', 'Changeroom', 'Storage',
  // Other
  'Lounge', 'Workroom', 'Workshop', 'Lab'
];

/**
 * Get room name for a given room ID and position
 * @param {string} roomId - Room ID (office 1, office 2, etc. or legacy A, B, C, etc.)
 * @param {number} index - Index of the room (0-based)
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} Room name
 */
export const getRoomName = (roomId, index, totalRooms) => {
  // If roomId is already in "office X" format, capitalize it and return
  if (roomId && roomId.toLowerCase().startsWith('office ')) {
    const num = roomId.toLowerCase().replace('office ', '');
    return `Office ${num}`;
  }
  
  // Legacy support for letter-based IDs (A, B, C, etc.)
  // Create a consistent mapping based on room count
  // This ensures the same room ID always maps to the same name
  const roomMappings = {
    4: ['Office A', 'Office B', 'Kitchen', 'Bathroom'],
    5: ['Office A', 'Office B', 'Kitchen', 'Bathroom', 'Conference Room'],
    6: ['Office 1', 'Office 2', 'Office 3', 'Office 4', 'Office 5', 'Office 6'],
    7: ['Office A', 'Office B', 'Office C', 'Kitchen', 'Bathroom', 'Conference Room', 'Storage'],
    8: ['Office A', 'Office B', 'Office C', 'Kitchen', 'Bathroom', 'Conference Room', 'Break Room', 'Changeroom']
  };
  
  const mapping = roomMappings[totalRooms] || roomMappings[4];
  const roomIndex = roomId.charCodeAt(0) - 'A'.charCodeAt(0); // Convert A=0, B=1, etc.
  
  if (roomIndex >= 0 && roomIndex < mapping.length) {
    return mapping[roomIndex];
  }
  
  // Fallback to generic names
  return `Room ${roomId}`;
};

/**
 * Get room type for styling purposes
 * @param {string} roomName - Room name
 * @returns {string} Room type (office, kitchen, bathroom, etc.)
 */
export const getRoomType = (roomName) => {
  const lowerName = roomName.toLowerCase();
  
  if (lowerName.includes('office')) return 'office';
  if (lowerName.includes('kitchen') || lowerName.includes('break')) return 'kitchen';
  if (lowerName.includes('bathroom') || lowerName.includes('restroom') || lowerName.includes('washroom')) return 'bathroom';
  if (lowerName.includes('conference') || lowerName.includes('meeting')) return 'conference';
  if (lowerName.includes('storage')) return 'storage';
  if (lowerName.includes('changer')) return 'changeroom';
  
  return 'office'; // Default
};

