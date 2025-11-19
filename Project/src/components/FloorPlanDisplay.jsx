import React from 'react';
import { useExperiment } from '../context/ExperimentContext';

const FloorPlanDisplay = () => {
  const { lightStates, targetAreas, isTaskActive, toggleSwitch, roomLayout } = useExperiment();
  
  const handleAreaClick = (areaId) => {
    if (isTaskActive) {
      toggleSwitch(areaId);
    }
  };
  
  // Use room layout if available, otherwise default to 6 rooms
  const rooms = roomLayout?.rooms || [
    { id: 'kitchen', left: 0, top: 0, width: 267, height: 200 },
    { id: 'bathroom', left: 267, top: 0, width: 267, height: 200 },
    { id: 'meeting room', left: 534, top: 0, width: 266, height: 200 },
    { id: 'reception', left: 0, top: 200, width: 267, height: 200 },
    { id: 'break room', left: 267, top: 200, width: 267, height: 200 },
    { id: 'storage', left: 534, top: 200, width: 266, height: 400 }
  ];
  
  // Calculate the bounds of the floor plan
  const maxWidth = Math.max(...rooms.map(r => r.left + r.width));
  const maxHeight = Math.max(...rooms.map(r => r.top + r.height));
  const floorPlanWidth = maxWidth;
  const floorPlanHeight = maxHeight;
  
  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Floor Plan View
      </h2>
      
      <div className="flex justify-center items-center">
        <div className="relative" style={{ 
          maxWidth: '800px',
          width: '100%',
          minHeight: '600px',
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Switch panel image - centered vertically, bigger - same as Design B */}
          <div className="flex items-center justify-center w-full h-full py-8" style={{ position: 'absolute', zIndex: 1 }}>
            <img 
              src="/stl/61tvXvpALEL._AC_UF894,1000_QL80_.jpg" 
              alt="Switch Panel"
              className="w-auto h-auto rounded-lg"
              style={{ 
                display: 'block',
                maxWidth: '700px',
                width: '90%',
                height: 'auto'
              }}
            />
          </div>
          
          {/* Floor plan overlay - centered - scaled down - same structure as Design B */}
          <div 
            className="absolute inset-0 flex items-center justify-center" 
            style={{ 
              zIndex: 10,
              transform: 'scale(0.6)',
              transformOrigin: 'center center'
            }}
          >
            {/* Floor plan container - transparent background so image shows through */}
            <div className="max-w-2xl w-full">
              <div 
                className="relative border-4 border-black rounded-lg mx-auto"
                style={{
                  width: '100%',
                  aspectRatio: `${floorPlanWidth}/${floorPlanHeight}`,
                  maxWidth: '600px',
                  maxHeight: '450px',
                  backgroundColor: 'transparent'
                }}
              >
                {/* Render rooms from layout - interactive floor plan with circles */}
                {rooms.map((room, index) => {
                  // Check if there's a room to the right or below
                  const hasRoomRight = rooms.some(r => 
                    Math.abs(r.top - room.top) < 5 && 
                    Math.abs(r.left - (room.left + room.width)) < 5
                  );
                  const hasRoomBelow = rooms.some(r => 
                    Math.abs(r.left - room.left) < 5 && 
                    Math.abs(r.top - (room.top + room.height)) < 5
                  );
                  
                  return (
                    <div
                      key={room.id}
                      className="absolute transition-all duration-300 cursor-pointer"
                      style={{
                        left: `${(room.left / floorPlanWidth) * 100}%`,
                        top: `${(room.top / floorPlanHeight) * 100}%`,
                        width: `${(room.width / floorPlanWidth) * 100}%`,
                        height: `${(room.height / floorPlanHeight) * 100}%`,
                        borderRight: hasRoomRight ? '2px solid rgba(156, 163, 175, 0.8)' : 'none',
                        borderBottom: hasRoomBelow ? '2px solid rgba(156, 163, 175, 0.8)' : 'none',
                        backgroundColor: lightStates[room.id] ? 'rgba(34, 211, 238, 0.3)' : 'transparent',
                        pointerEvents: isTaskActive ? 'auto' : 'none'
                      }}
                      onClick={() => handleAreaClick(room.id)}
                    >
                      <div className="w-full h-full flex items-center justify-center relative">
                        {/* Circular button on floor plan - interactive */}
                        <div
                          className={`w-16 h-16 rounded-full border-4 border-black transition-all duration-300 ${
                            lightStates[room.id]
                              ? 'bg-cyan-200 border-cyan-400 shadow-lg shadow-cyan-400/50'
                              : 'bg-white border-black'
                          } ${isTaskActive ? 'cursor-pointer hover:shadow-xl' : 'opacity-60 cursor-not-allowed'}`}
                          style={{ 
                            pointerEvents: 'auto',
                            zIndex: 20
                          }}
                        >
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanDisplay;
