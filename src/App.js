import React, { useState, useEffect } from 'react';
import RoomLayout from './components/RoomLayout';
import './App.css';

function App() {
  const [rooms, setRooms] = useState([]);
  const [switchStates, setSwitchStates] = useState({});
  const [activeTab, setActiveTab] = useState('floorplan');

  // Generate random number of rooms (4-8) and create room layout
  useEffect(() => {
    generateNewLayout();
  }, []);

  const generateNewLayout = () => {
    const numRooms = Math.floor(Math.random() * 5) + 4; // 4-8 rooms
    const newRooms = [];
    const newSwitchStates = {};
    
    // Container dimensions
    const containerWidth = 800;
    const containerHeight = 600;
    
    // Generate creative floor plan with only rooms (no light areas)
    const rooms = generateCreativeFloorPlan(numRooms, containerWidth, containerHeight);
    
    rooms.forEach((room, i) => {
      const roomId = String.fromCharCode(65 + i); // A, B, C, D, etc.
      newRooms.push({
        id: roomId,
        label: roomId,
        isActive: false,
        width: room.width,
        height: room.height,
        left: room.left,
        top: room.top,
        type: 'room'
      });
      newSwitchStates[roomId] = false;
    });

    setRooms(newRooms);
    setSwitchStates(newSwitchStates);
  };

  // Function to generate creative floor plan with only rooms
  const generateCreativeFloorPlan = (numRooms, containerWidth, containerHeight) => {
    const rooms = [];
    const margin = 0; // No spacing between rooms
    
    // Create more organic, realistic floor plans with no spacing
    const layouts = [
      // L-shaped layout
      () => {
        const room1 = { width: 300, height: 200, left: margin, top: margin };
        const room2 = { width: 250, height: 200, left: room1.width, top: margin };
        const room3 = { width: 300, height: 200, left: margin, top: room1.height };
        const room4 = { width: 250, height: 200, left: room3.width, top: room2.height };
        
        return [room1, room2, room3, room4];
      },
      
      // Grid layout
      () => {
        const room1 = { width: 200, height: 150, left: margin, top: margin };
        const room2 = { width: 200, height: 150, left: room1.width, top: margin };
        const room3 = { width: 200, height: 150, left: room2.width, top: margin };
        const room4 = { width: 200, height: 150, left: margin, top: room1.height };
        const room5 = { width: 200, height: 150, left: room4.width, top: room2.height };
        const room6 = { width: 200, height: 150, left: room5.width, top: room3.height };
        
        return [room1, room2, room3, room4, room5, room6];
      },
      
      // Scattered layout
      () => {
        const room1 = { width: 220, height: 140, left: margin, top: margin };
        const room2 = { width: 180, height: 160, left: room1.width, top: margin };
        const room3 = { width: 240, height: 120, left: margin, top: room1.height };
        const room4 = { width: 160, height: 140, left: room3.width, top: room2.height };
        const room5 = { width: 200, height: 130, left: room4.width + room3.width, top: room2.height };
        
        return [room1, room2, room3, room4, room5];
      },
      
      // U-shaped layout
      () => {
        const room1 = { width: 200, height: 250, left: margin, top: margin };
        const room2 = { width: 300, height: 120, left: room1.width, top: margin };
        const room3 = { width: 200, height: 250, left: room2.width + room1.width, top: margin };
        const room4 = { width: 200, height: 200, left: margin, top: room1.height };
        const room5 = { width: 200, height: 200, left: room4.width + room2.width, top: room2.height };
        
        return [room1, room2, room3, room4, room5];
      }
    ];
    
    // Select a random layout
    const selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
    return selectedLayout();
  };

  const toggleSwitch = (roomId) => {
    setSwitchStates(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }));
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Virtual Room Mock-up</h1>
        <div className="header-controls">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'floorplan' ? 'active' : ''}`}
              onClick={() => setActiveTab('floorplan')}
            >
              Floor Plan
            </button>
            <button 
              className={`tab-btn ${activeTab === 'switches' ? 'active' : ''}`}
              onClick={() => setActiveTab('switches')}
            >
              Traditional Switches
            </button>
          </div>
          <button onClick={generateNewLayout} className="regenerate-btn">
            Generate New Layout
          </button>
        </div>
      </div>
      
      <div className="app-content">
        {activeTab === 'floorplan' && (
          <div className="layout-section">
            <h2>Floor Plan Layout</h2>
            <RoomLayout 
              rooms={rooms} 
              switchStates={switchStates}
              onToggleSwitch={toggleSwitch}
            />
          </div>
        )}
        
        {activeTab === 'switches' && (
          <div className="switch-panel-section">
            <h2>Traditional Light Switch Panel</h2>
            <div className="switch-panel">
              {rooms.map((room) => (
                <div 
                  key={room.id} 
                  className={`traditional-switch ${switchStates[room.id] ? 'on' : 'off'}`}
                  onClick={() => toggleSwitch(room.id)}
                >
                  <div className="switch-toggle"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
