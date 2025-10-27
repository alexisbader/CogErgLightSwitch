# Virtual Room Mock-up Application

A React application that creates a virtual mock-up of a floor plan design with randomly generated irregular rooms (4-8) and interactive switches.

## Features

- **Random Room Generation**: Automatically generates 4-8 rooms with labels A, B, C, D, etc.
- **Irregular Floor Plan**: Rooms have different sizes and positions, creating realistic overlapping layouts
- **Interactive Switches**: Click on any room to toggle its switch state
- **Visual Feedback**: Active switches are highlighted in blue with glowing effects
- **Floor Plan Design**: Realistic architectural layout with irregular room shapes
- **Regenerate Layout**: Button to generate a new random room layout

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd /Users/alexis/BME4A/BME543
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Room.js              # Individual room component
│   ├── Room.css             # Room styling
│   ├── RoomLayout.js        # Floor plan layout for rooms
│   └── RoomLayout.css       # Layout styling
├── App.js                   # Main application component
├── App.css                  # Application styling
├── index.js                 # Application entry point
└── index.css                # Global styles
```

## How It Works

1. **Room Generation**: The app randomly generates between 4-8 rooms on startup
2. **Irregular Layout**: Rooms have random sizes (100-300px) and positions, creating overlapping floor plan layouts
3. **Interactive Switches**: Each room contains a circular switch that can be clicked to toggle
4. **Visual States**: Active switches are highlighted with blue colors and glowing effects
5. **Regeneration**: The "Generate New Layout" button creates a new random room configuration

## Customization

- Modify the room count range in `App.js` (currently 4-8)
- Adjust switch colors in the CSS files
- Change grid layouts in `RoomLayout.js`
- Update switch animations in `SwitchExample.css`

## Technologies Used

- React 18
- CSS3 with animations and transitions
- Responsive design principles
- Modern JavaScript (ES6+)
