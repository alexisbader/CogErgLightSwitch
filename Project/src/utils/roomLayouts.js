/**
 * Generate floor plan layouts with different numbers of rooms
 * Each room count (4-8) has 4 different layout variations
 */

// Generate 4 different layouts for each room count (4-8 rooms)
export const generateRoomLayouts = (numRooms) => {
  const layouts = [];
  const containerWidth = 800;
  const containerHeight = 600;
  
  // Generate 4 different variations for the given number of rooms
  for (let variation = 0; variation < 4; variation++) {
    const rooms = [];
    
    switch (numRooms) {
      case 4:
        layouts.push(generate4RoomLayout(variation, containerWidth, containerHeight));
        break;
      case 5:
        layouts.push(generate5RoomLayout(variation, containerWidth, containerHeight));
        break;
      case 6:
        layouts.push(generate6RoomLayout(variation, containerWidth, containerHeight));
        break;
      case 7:
        layouts.push(generate7RoomLayout(variation, containerWidth, containerHeight));
        break;
      case 8:
        layouts.push(generate8RoomLayout(variation, containerWidth, containerHeight));
        break;
      default:
        layouts.push(generate4RoomLayout(0, containerWidth, containerHeight));
    }
  }
  
  return layouts;
};

// 4 Room Layouts
const generate4RoomLayout = (variation, width, height) => {
  const layouts = [
    // Variation 0: 2x2 Grid
    [
      { id: 'A', left: 0, top: 0, width: width / 2, height: height / 2 },
      { id: 'B', left: width / 2, top: 0, width: width / 2, height: height / 2 },
      { id: 'C', left: 0, top: height / 2, width: width / 2, height: height / 2 },
      { id: 'D', left: width / 2, top: height / 2, width: width / 2, height: height / 2 }
    ],
    // Variation 1: L-shape
    [
      { id: 'A', left: 0, top: 0, width: width * 0.6, height: height * 0.5 },
      { id: 'B', left: width * 0.6, top: 0, width: width * 0.4, height: height * 0.5 },
      { id: 'C', left: 0, top: height * 0.5, width: width * 0.4, height: height * 0.5 },
      { id: 'D', left: width * 0.4, top: height * 0.5, width: width * 0.6, height: height * 0.5 }
    ],
    // Variation 2: Horizontal split with unequal
    [
      { id: 'A', left: 0, top: 0, width: width * 0.3, height: height },
      { id: 'B', left: width * 0.3, top: 0, width: width * 0.35, height: height / 2 },
      { id: 'C', left: width * 0.65, top: 0, width: width * 0.35, height: height / 2 },
      { id: 'D', left: width * 0.3, top: height / 2, width: width * 0.7, height: height / 2 }
    ],
    // Variation 3: Vertical split with unequal
    [
      { id: 'A', left: 0, top: 0, width: width / 2, height: height * 0.3 },
      { id: 'B', left: width / 2, top: 0, width: width / 2, height: height * 0.3 },
      { id: 'C', left: 0, top: height * 0.3, width: width * 0.35, height: height * 0.7 },
      { id: 'D', left: width * 0.35, top: height * 0.3, width: width * 0.65, height: height * 0.7 }
    ]
  ];
  return layouts[variation] || layouts[0];
};

// 5 Room Layouts
const generate5RoomLayout = (variation, width, height) => {
  const layouts = [
    [
      { id: 'A', left: 0, top: 0, width: width * 0.4, height: height * 0.4 },
      { id: 'B', left: width * 0.4, top: 0, width: width * 0.6, height: height * 0.4 },
      { id: 'C', left: 0, top: height * 0.4, width: width * 0.3, height: height * 0.6 },
      { id: 'D', left: width * 0.3, top: height * 0.4, width: width * 0.35, height: height * 0.3 },
      { id: 'E', left: width * 0.65, top: height * 0.4, width: width * 0.35, height: height * 0.6 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.5, height: height * 0.3 },
      { id: 'B', left: width * 0.5, top: 0, width: width * 0.5, height: height * 0.3 },
      { id: 'C', left: 0, top: height * 0.3, width: width * 0.33, height: height * 0.7 },
      { id: 'D', left: width * 0.33, top: height * 0.3, width: width * 0.33, height: height * 0.35 },
      { id: 'E', left: width * 0.66, top: height * 0.3, width: width * 0.34, height: height * 0.7 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.25, height: height },
      { id: 'B', left: width * 0.25, top: 0, width: width * 0.25, height: height * 0.5 },
      { id: 'C', left: width * 0.5, top: 0, width: width * 0.5, height: height * 0.4 },
      { id: 'D', left: width * 0.25, top: height * 0.5, width: width * 0.375, height: height * 0.5 },
      { id: 'E', left: width * 0.625, top: height * 0.4, width: width * 0.375, height: height * 0.6 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.4, height: height * 0.5 },
      { id: 'B', left: width * 0.4, top: 0, width: width * 0.3, height: height * 0.5 },
      { id: 'C', left: width * 0.7, top: 0, width: width * 0.3, height: height * 0.5 },
      { id: 'D', left: 0, top: height * 0.5, width: width * 0.5, height: height * 0.5 },
      { id: 'E', left: width * 0.5, top: height * 0.5, width: width * 0.5, height: height * 0.5 }
    ]
  ];
  return layouts[variation] || layouts[0];
};

// 6 Room Layouts
const generate6RoomLayout = (variation, width, height) => {
  const layouts = [
    [
      { id: 'kitchen', left: 0, top: 0, width: width * 0.33, height: height * 0.33 },
      { id: 'bathroom', left: width * 0.33, top: 0, width: width * 0.33, height: height * 0.33 },
      { id: 'meeting room', left: width * 0.66, top: 0, width: width * 0.34, height: height * 0.33 },
      { id: 'reception', left: 0, top: height * 0.33, width: width * 0.33, height: height * 0.33 },
      { id: 'break room', left: width * 0.33, top: height * 0.33, width: width * 0.33, height: height * 0.33 },
      { id: 'storage', left: width * 0.66, top: height * 0.33, width: width * 0.34, height: height * 0.67 }
    ],
    [
      { id: 'kitchen', left: 0, top: 0, width: width * 0.5, height: height * 0.25 },
      { id: 'bathroom', left: width * 0.5, top: 0, width: width * 0.5, height: height * 0.25 },
      { id: 'meeting room', left: 0, top: height * 0.25, width: width * 0.25, height: height * 0.75 },
      { id: 'reception', left: width * 0.25, top: height * 0.25, width: width * 0.375, height: height * 0.375 },
      { id: 'break room', left: width * 0.625, top: height * 0.25, width: width * 0.375, height: height * 0.375 },
      { id: 'storage', left: width * 0.25, top: height * 0.625, width: width * 0.75, height: height * 0.375 }
    ],
    [
      { id: 'kitchen', left: 0, top: 0, width: width * 0.3, height: height * 0.4 },
      { id: 'bathroom', left: width * 0.3, top: 0, width: width * 0.35, height: height * 0.4 },
      { id: 'meeting room', left: width * 0.65, top: 0, width: width * 0.35, height: height * 0.4 },
      { id: 'reception', left: 0, top: height * 0.4, width: width * 0.2, height: height * 0.6 },
      { id: 'break room', left: width * 0.2, top: height * 0.4, width: width * 0.4, height: height * 0.3 },
      { id: 'storage', left: width * 0.6, top: height * 0.4, width: width * 0.4, height: height * 0.6 }
    ],
    [
      { id: 'kitchen', left: 0, top: 0, width: width * 0.4, height: height * 0.5 },
      { id: 'bathroom', left: width * 0.4, top: 0, width: width * 0.3, height: height * 0.5 },
      { id: 'meeting room', left: width * 0.7, top: 0, width: width * 0.3, height: height * 0.5 },
      { id: 'reception', left: 0, top: height * 0.5, width: width * 0.33, height: height * 0.5 },
      { id: 'break room', left: width * 0.33, top: height * 0.5, width: width * 0.33, height: height * 0.5 },
      { id: 'storage', left: width * 0.66, top: height * 0.5, width: width * 0.34, height: height * 0.5 }
    ]
  ];
  return layouts[variation] || layouts[0];
};

// 7 Room Layouts
const generate7RoomLayout = (variation, width, height) => {
  const layouts = [
    [
      { id: 'A', left: 0, top: 0, width: width * 0.25, height: height * 0.33 },
      { id: 'B', left: width * 0.25, top: 0, width: width * 0.25, height: height * 0.33 },
      { id: 'C', left: width * 0.5, top: 0, width: width * 0.25, height: height * 0.33 },
      { id: 'D', left: width * 0.75, top: 0, width: width * 0.25, height: height * 0.33 },
      { id: 'E', left: 0, top: height * 0.33, width: width * 0.33, height: height * 0.33 },
      { id: 'F', left: width * 0.33, top: height * 0.33, width: width * 0.33, height: height * 0.33 },
      { id: 'G', left: width * 0.66, top: height * 0.33, width: width * 0.34, height: height * 0.67 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.3, height: height * 0.3 },
      { id: 'B', left: width * 0.3, top: 0, width: width * 0.35, height: height * 0.3 },
      { id: 'C', left: width * 0.65, top: 0, width: width * 0.35, height: height * 0.3 },
      { id: 'D', left: 0, top: height * 0.3, width: width * 0.2, height: height * 0.7 },
      { id: 'E', left: width * 0.2, top: height * 0.3, width: width * 0.27, height: height * 0.35 },
      { id: 'F', left: width * 0.47, top: height * 0.3, width: width * 0.26, height: height * 0.35 },
      { id: 'G', left: width * 0.73, top: height * 0.3, width: width * 0.27, height: height * 0.7 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.4, height: height * 0.4 },
      { id: 'B', left: width * 0.4, top: 0, width: width * 0.3, height: height * 0.4 },
      { id: 'C', left: width * 0.7, top: 0, width: width * 0.3, height: height * 0.4 },
      { id: 'D', left: 0, top: height * 0.4, width: width * 0.25, height: height * 0.6 },
      { id: 'E', left: width * 0.25, top: height * 0.4, width: width * 0.25, height: height * 0.3 },
      { id: 'F', left: width * 0.5, top: height * 0.4, width: width * 0.25, height: height * 0.3 },
      { id: 'G', left: width * 0.75, top: height * 0.4, width: width * 0.25, height: height * 0.6 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.33, height: height * 0.5 },
      { id: 'B', left: width * 0.33, top: 0, width: width * 0.33, height: height * 0.25 },
      { id: 'C', left: width * 0.66, top: 0, width: width * 0.34, height: height * 0.25 },
      { id: 'D', left: width * 0.33, top: height * 0.25, width: width * 0.22, height: height * 0.25 },
      { id: 'E', left: width * 0.55, top: height * 0.25, width: width * 0.22, height: height * 0.25 },
      { id: 'F', left: width * 0.77, top: height * 0.25, width: width * 0.23, height: height * 0.75 },
      { id: 'G', left: 0, top: height * 0.5, width: width * 0.77, height: height * 0.5 }
    ]
  ];
  return layouts[variation] || layouts[0];
};

// 8 Room Layouts
const generate8RoomLayout = (variation, width, height) => {
  const layouts = [
    [
      { id: 'A', left: 0, top: 0, width: width * 0.25, height: height * 0.25 },
      { id: 'B', left: width * 0.25, top: 0, width: width * 0.25, height: height * 0.25 },
      { id: 'C', left: width * 0.5, top: 0, width: width * 0.25, height: height * 0.25 },
      { id: 'D', left: width * 0.75, top: 0, width: width * 0.25, height: height * 0.25 },
      { id: 'E', left: 0, top: height * 0.25, width: width * 0.25, height: height * 0.25 },
      { id: 'F', left: width * 0.25, top: height * 0.25, width: width * 0.25, height: height * 0.25 },
      { id: 'G', left: width * 0.5, top: height * 0.25, width: width * 0.25, height: height * 0.25 },
      { id: 'H', left: width * 0.75, top: height * 0.25, width: width * 0.25, height: height * 0.75 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.3, height: height * 0.3 },
      { id: 'B', left: width * 0.3, top: 0, width: width * 0.23, height: height * 0.3 },
      { id: 'C', left: width * 0.53, top: 0, width: width * 0.23, height: height * 0.3 },
      { id: 'D', left: width * 0.76, top: 0, width: width * 0.24, height: height * 0.3 },
      { id: 'E', left: 0, top: height * 0.3, width: width * 0.2, height: height * 0.7 },
      { id: 'F', left: width * 0.2, top: height * 0.3, width: width * 0.27, height: height * 0.35 },
      { id: 'G', left: width * 0.47, top: height * 0.3, width: width * 0.26, height: height * 0.35 },
      { id: 'H', left: width * 0.73, top: height * 0.3, width: width * 0.27, height: height * 0.7 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.4, height: height * 0.4 },
      { id: 'B', left: width * 0.4, top: 0, width: width * 0.2, height: height * 0.4 },
      { id: 'C', left: width * 0.6, top: 0, width: width * 0.2, height: height * 0.4 },
      { id: 'D', left: width * 0.8, top: 0, width: width * 0.2, height: height * 0.4 },
      { id: 'E', left: 0, top: height * 0.4, width: width * 0.25, height: height * 0.6 },
      { id: 'F', left: width * 0.25, top: height * 0.4, width: width * 0.25, height: height * 0.3 },
      { id: 'G', left: width * 0.5, top: height * 0.4, width: width * 0.25, height: height * 0.3 },
      { id: 'H', left: width * 0.75, top: height * 0.4, width: width * 0.25, height: height * 0.6 }
    ],
    [
      { id: 'A', left: 0, top: 0, width: width * 0.33, height: height * 0.5 },
      { id: 'B', left: width * 0.33, top: 0, width: width * 0.22, height: height * 0.25 },
      { id: 'C', left: width * 0.55, top: 0, width: width * 0.22, height: height * 0.25 },
      { id: 'D', left: width * 0.77, top: 0, width: width * 0.23, height: height * 0.25 },
      { id: 'E', left: width * 0.33, top: height * 0.25, width: width * 0.22, height: height * 0.25 },
      { id: 'F', left: width * 0.55, top: height * 0.25, width: width * 0.22, height: height * 0.25 },
      { id: 'G', left: width * 0.77, top: height * 0.25, width: width * 0.23, height: height * 0.75 },
      { id: 'H', left: 0, top: height * 0.5, width: width * 0.77, height: height * 0.5 }
    ]
  ];
  return layouts[variation] || layouts[0];
};

// Get room IDs for a given number of rooms
export const getRoomLetters = (numRooms) => {
  // Since we always use 6 rooms now, return commercial room types
  const roomIds = ['kitchen', 'bathroom', 'meeting room', 'reception', 'break room', 'storage'];
  return roomIds.slice(0, numRooms);
};

// Generate a random room layout for a trial
// Always uses 6 rooms with random variation for layout diversity
export const generateRandomRoomLayout = () => {
  const numRooms = 6; // Always 6 rooms
  const variation = Math.floor(Math.random() * 4); // 0-3 variations
  const layout = generateRoomLayouts(numRooms)[variation];
  return {
    numRooms,
    variation,
    rooms: layout,
    roomIds: layout.map(r => r.id)
  };
};

