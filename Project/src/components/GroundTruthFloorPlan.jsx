import React from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { getRoomName, getRoomType } from '../utils/roomNames';

const GroundTruthFloorPlan = () => {
  const { targetAreas, lightsToTurnOff, roomLayout, floorPlanOrientation, lightStates, currentCondition } = useExperiment();
  
  // Use room layout if available, otherwise default to 6 rooms
  const rooms = roomLayout?.rooms || [
    { id: 'office 1', left: 0, top: 0, width: 267, height: 200 },
    { id: 'office 2', left: 267, top: 0, width: 267, height: 200 },
    { id: 'office 3', left: 534, top: 0, width: 266, height: 200 },
    { id: 'office 4', left: 0, top: 200, width: 267, height: 200 },
    { id: 'office 5', left: 267, top: 200, width: 267, height: 200 },
    { id: 'office 6', left: 534, top: 200, width: 266, height: 400 }
  ];
  
  const taskType = currentCondition?.taskType || 'turnOn2';
  const totalRooms = roomLayout?.numRooms || rooms.length;
  
  // Get room names for display in instructions (convert letters to room names)
  const getRoomNames = (roomIds) => {
    return roomIds.map(id => {
      const roomIndex = rooms.findIndex(r => r.id === id);
      return getRoomName(id, roomIndex, totalRooms);
    });
  };
  
  const targetRoomNames = getRoomNames(targetAreas);
  const turnOffRoomNames = getRoomNames(lightsToTurnOff);
  
  // Render furniture/icons for different room types
  const renderRoomFurniture = (roomName, roomType, roomWidth, roomHeight, isOn) => {
    const furniture = [];
    const widthPercent = (roomWidth / 800) * 100;
    const heightPercent = (roomHeight / 600) * 100;
    
    // Only render furniture if room is large enough
    if (widthPercent < 20 || heightPercent < 15) {
      return null;
    }
    
    if (roomType === 'office') {
      // Desk and chair
      furniture.push(
        <div
          key="desk"
          className="absolute bg-amber-800 rounded-sm"
          style={{
            bottom: '15%',
            left: '10%',
            width: '35%',
            height: '8%',
            border: '1px solid #92400e'
          }}
        />
      );
      furniture.push(
        <div
          key="chair"
          className="absolute bg-gray-600 rounded-full"
          style={{
            bottom: '8%',
            left: '48%',
            width: '12%',
            height: '12%',
            border: '2px solid #4b5563'
          }}
        />
      );
    } else if (roomType === 'kitchen') {
      // Counter and appliances
      furniture.push(
        <div
          key="counter"
          className="absolute bg-stone-400 rounded-sm"
          style={{
            bottom: '20%',
            left: '15%',
            width: '50%',
            height: '10%',
            border: '1px solid #78716c'
          }}
        />
      );
      furniture.push(
        <div
          key="sink"
          className="absolute bg-gray-300 rounded-full border-2 border-gray-400"
          style={{
            bottom: '22%',
            left: '35%',
            width: '8%',
            height: '6%'
          }}
        />
      );
    } else if (roomType === 'bathroom') {
      // Toilet and sink
      furniture.push(
        <div
          key="toilet"
          className="absolute bg-white rounded-lg border-2 border-gray-400"
          style={{
            bottom: '15%',
            left: '15%',
            width: '12%',
            height: '15%'
          }}
        />
      );
      furniture.push(
        <div
          key="sink"
          className="absolute bg-gray-200 rounded-full border-2 border-gray-400"
          style={{
            bottom: '20%',
            right: '20%',
            width: '10%',
            height: '8%'
          }}
        />
      );
    } else if (roomType === 'conference') {
      // Conference table and chairs
      furniture.push(
        <div
          key="table"
          className="absolute bg-amber-700 rounded-lg"
          style={{
            bottom: '30%',
            left: '20%',
            width: '60%',
            height: '25%',
            border: '2px solid #78350f'
          }}
        />
      );
      // Chairs around table
      for (let i = 0; i < 4; i++) {
        const positions = [
          { bottom: '20%', left: '30%' },
          { bottom: '20%', right: '30%' },
          { top: '20%', left: '30%' },
          { top: '20%', right: '30%' }
        ];
        furniture.push(
          <div
            key={`chair-${i}`}
            className="absolute bg-gray-600 rounded-full"
            style={{
              ...positions[i],
              width: '8%',
              height: '8%',
              border: '1px solid #4b5563'
            }}
          />
        );
      }
    } else if (roomType === 'storage') {
      // Shelves
      furniture.push(
        <div
          key="shelf1"
          className="absolute bg-amber-900"
          style={{
            left: '10%',
            top: '20%',
            width: '5%',
            height: '60%',
            border: '1px solid #78350f'
          }}
        />
      );
      furniture.push(
        <div
          key="shelf2"
          className="absolute bg-amber-900"
          style={{
            right: '10%',
            top: '20%',
            width: '5%',
            height: '60%',
            border: '1px solid #78350f'
          }}
        />
      );
    }
    
    return furniture;
  };
  
  return (
    <div className="w-full">
      {/* Task Instructions */}
      <div className="mb-4 text-center">
        {taskType === 'turnOn2' ? (
          <>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Turn ON: <span className="text-yellow-600 font-bold">{targetRoomNames.length > 0 ? targetRoomNames.join(', ') : 'None'}</span>
            </p>
            <p className="text-sm text-gray-600">
              Turn ON the lights for these rooms
            </p>
          </>
        ) : taskType === 'turnOn1Off1' ? (
          <>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Turn ON: <span className="text-yellow-600 font-bold">{targetRoomNames.length > 0 ? targetRoomNames.join(', ') : 'None'}</span>
              {turnOffRoomNames.length > 0 && (
                <> | Turn OFF: <span className="text-red-600 font-bold">{turnOffRoomNames.join(', ')}</span></>
              )}
            </p>
            <p className="text-sm text-gray-600">
              Turn ON the lights for the yellow rooms, Turn OFF the lights for the red rooms
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Target Areas: <span className="text-yellow-600 font-bold">{targetRoomNames.length > 0 ? targetRoomNames.join(', ') : 'None'}</span>
            </p>
            <p className="text-sm text-gray-600">
              Turn ON the lights for these rooms
            </p>
          </>
        )}
      </div>
      
      {/* Floor Plan Container - with rotation */}
      {/* Container needs to be large enough to accommodate rotated floor plan */}
      <div className="max-w-5xl mx-auto" style={{ 
        minHeight: '800px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div 
          className="relative border-4 border-gray-800 bg-white rounded-lg shadow-xl"
          style={{ 
            width: '800px',
            height: '600px',
            maxWidth: 'calc(100% - 40px)',
            maxHeight: 'calc(100% - 40px)',
            transform: `rotate(${floorPlanOrientation || 0}deg)`,
            transformOrigin: 'center center',
            background: '#ffffff',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}
        >
          {/* Render rooms from layout */}
          {rooms.map((room, index) => {
            const isOn = lightStates[room.id] === true; // Show yellow when switch is turned on
            const roomName = getRoomName(room.id, index, totalRooms);
            const roomType = getRoomType(roomName);
            
            // Check if there's a room to the right or below
            const hasRoomRight = rooms.some(r => 
              Math.abs(r.top - room.top) < 5 && 
              Math.abs(r.left - (room.left + room.width)) < 5
            );
            const hasRoomBelow = rooms.some(r => 
              Math.abs(r.left - room.left) < 5 && 
              Math.abs(r.top - (room.top + room.height)) < 5
            );
            
            // Room background: gray when light is off, yellow when light is on
            const roomBgColor = isOn ? '#fef08a' : '#e5e7eb'; // Yellow when on, gray when off
            
            return (
              <div
                key={room.id}
                className="absolute transition-all duration-300"
                style={{
                  left: `${(room.left / 800) * 100}%`,
                  top: `${(room.top / 600) * 100}%`,
                  width: `${(room.width / 800) * 100}%`,
                  height: `${(room.height / 600) * 100}%`,
                  borderRight: hasRoomRight ? '3px solid #9ca3af' : 'none',
                  borderBottom: hasRoomBelow ? '3px solid #9ca3af' : 'none',
                  backgroundColor: roomBgColor,
                  borderRadius: '2px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)'
                }}
              >
                {/* Room furniture */}
                <div className="absolute inset-0 pointer-events-none">
                  {renderRoomFurniture(roomName, roomType, room.width, room.height, isOn)}
                </div>
                
                {/* Room label */}
                <div className="absolute top-2 left-2 right-2 z-20">
                  <div
                    className={`text-xs sm:text-sm font-bold transition-all duration-300 px-2 py-1 rounded shadow-sm ${
                      isOn
                        ? 'text-yellow-900 bg-yellow-300/90'
                        : 'text-gray-800 bg-gray-300/90'
                    }`}
                    style={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {roomName}
                  </div>
                </div>
                
                {/* Border highlight when light is on */}
                {isOn && (
                  <div className="absolute inset-0 border-3 border-yellow-400 rounded pointer-events-none z-5" style={{ borderWidth: '3px' }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex justify-center gap-6 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-4 border-yellow-500 bg-yellow-200"></div>
          <span className="text-gray-700 font-semibold">Light ON</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-4 border-black bg-white"></div>
          <span className="text-gray-700">Light OFF</span>
        </div>
      </div>
      
      {/* Orientation indicator */}
      {floorPlanOrientation && floorPlanOrientation !== 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Orientation: {floorPlanOrientation}°
        </div>
      )}
    </div>
  );
};

export default GroundTruthFloorPlan;

