import React from 'react';
import { useExperiment } from '../context/ExperimentContext';

const SwitchPanel = ({ onTaskComplete }) => {
  const { 
    designType, 
    lightStates, 
    toggleSwitch, 
    isTaskActive,
    targetAreas,
    lightsToTurnOff,
    taskSuccess,
    roomLayout,
    currentCondition
  } = useExperiment();
  
  const areas = roomLayout?.roomIds || ['kitchen', 'bathroom', 'meeting room', 'reception', 'break room', 'storage'];
  
  const handleSwitchToggle = (areaId) => {
    if (!isTaskActive) return;
    toggleSwitch(areaId);
    
    if (taskSuccess === true && onTaskComplete) {
      // Task completion is handled in context
    }
  };
  
  // Traditional switch panel layout - wall background with switch panel image overlay
  const TraditionalLayout = () => {
    // Center switches in a row
    const getSwitchPosition = (index, total) => {
      const totalWidth = total * 60 + (total - 1) * 20; // 60px per switch + 20px gap
      const startLeft = 50 - (totalWidth / 2) / 10; // Center calculation
      return {
        top: '50%',
        left: `${startLeft + index * 8}%`,
        transform: 'translate(-50%, -50%)'
      };
    };
    
    return (
      <div className="w-full">
        <h3 className="mb-6 text-gray-800 text-xl font-semibold text-center">
          Traditional Light Switch Panel
        </h3>
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
            {/* Switch panel image - centered vertically, bigger */}
            <div className="flex items-center justify-center w-full h-full py-8">
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
            
            {/* Overlay switches on the image - centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center gap-5">
                {areas.map((area, index) => {
                  const pos = getSwitchPosition(index, areas.length);
                  return (
                    <div
                      key={area}
                      className="cursor-pointer transition-all duration-300 flex flex-col items-center justify-center"
                      style={{
                        opacity: isTaskActive ? 1 : 0.5
                      }}
                      onClick={() => handleSwitchToggle(area)}
                    >
                      {/* Vertical toggle switch */}
                      <div 
                        className={`w-8 h-16 bg-gray-600 rounded-2xl relative transition-all duration-300 border-2 border-gray-700 ${
                          isTaskActive 
                            ? '' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        style={{ overflow: 'hidden' }}
                      >
                        <div 
                          className="w-6 h-6 bg-white rounded-full absolute transition-all duration-300 shadow-md"
                          style={{
                            top: lightStates[area] ? '4px' : 'calc(100% - 28px)',
                            left: '50%',
                            transform: 'translateX(-50%)'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Design B: Buttons below floor plan (non-interactive floor plan, interactive buttons below)
  const ButtonsBelowLayout = () => {
    const rooms = roomLayout?.rooms || [
      { id: 'A', left: 0, top: 0, width: 400, height: 300 },
      { id: 'B', left: 400, top: 0, width: 400, height: 300 },
      { id: 'C', left: 0, top: 300, width: 533, height: 300 },
      { id: 'D', left: 533, top: 300, width: 267, height: 300 }
    ];
    
    // Calculate the bounds of the floor plan
    const maxWidth = Math.max(...rooms.map(r => r.left + r.width));
    const maxHeight = Math.max(...rooms.map(r => r.top + r.height));
    const floorPlanWidth = maxWidth;
    const floorPlanHeight = maxHeight;
    
    return (
      <div className="w-full">
        <h3 className="mb-6 text-gray-800 text-xl font-semibold text-center">
          Buttons Below Floor Plan Interface
        </h3>
        
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
            {/* Switch panel image - centered vertically, bigger */}
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
            
            {/* Floor plan and buttons overlay - centered - scaled down */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center" 
              style={{ 
                zIndex: 10,
                transform: 'scale(0.6)',
                transformOrigin: 'center center'
              }}
            >
              {/* Floor plan visualization (non-interactive) - shows current state - centered */}
              <div className="max-w-2xl w-full">
                <div 
                  className="relative border-4 border-black bg-gray-50 rounded-lg mx-auto"
                  style={{
                    width: '100%',
                    aspectRatio: `${floorPlanWidth}/${floorPlanHeight}`,
                    maxWidth: '600px',
                    maxHeight: '450px'
                  }}
                >
                  {/* Render rooms from layout - display only, not clickable */}
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
                    
                    // Scale positions to fit in container
                    const scaleX = (600 / floorPlanWidth);
                    const scaleY = (450 / floorPlanHeight);
                    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
                    
                    return (
                      <div
                        key={room.id}
                        className="absolute transition-all duration-300"
                        style={{
                          left: `${(room.left / floorPlanWidth) * 100}%`,
                          top: `${(room.top / floorPlanHeight) * 100}%`,
                          width: `${(room.width / floorPlanWidth) * 100}%`,
                          height: `${(room.height / floorPlanHeight) * 100}%`,
                          borderRight: hasRoomRight ? '2px solid rgba(156, 163, 175, 0.8)' : 'none',
                          borderBottom: hasRoomBelow ? '2px solid rgba(156, 163, 175, 0.8)' : 'none',
                          backgroundColor: lightStates[room.id] ? 'rgba(34, 211, 238, 0.3)' : 'transparent'
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-700">{room.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Buttons below floor plan - interactive - centered */}
              <div className="flex justify-center items-center gap-4 flex-wrap mt-4">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => handleSwitchToggle(area)}
                    disabled={!isTaskActive}
                    className={`w-20 h-20 rounded-full border-4 border-black transition-all duration-300 flex items-center justify-center text-2xl font-bold shadow-lg ${
                      lightStates[area]
                        ? 'bg-cyan-200 border-cyan-400 shadow-cyan-400/50'
                        : 'bg-white border-black'
                    } ${
                      isTaskActive 
                        ? 'cursor-pointer hover:shadow-xl' 
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Design C: Floor plan layout - wall background with switch panel image overlay
  const FloorPlanLayout = () => {
    console.log('🔵 FloorPlanLayout RENDERED - designType:', designType);
    console.log('🔵 roomLayout:', roomLayout);
    
    const rooms = roomLayout?.rooms || [
      { id: 'A', left: 0, top: 0, width: 400, height: 300 },
      { id: 'B', left: 400, top: 0, width: 400, height: 300 },
      { id: 'C', left: 0, top: 300, width: 533, height: 300 },
      { id: 'D', left: 533, top: 300, width: 267, height: 300 }
    ];
    
    // Calculate the bounds of the floor plan
    const maxWidth = Math.max(...rooms.map(r => r.left + r.width));
    const maxHeight = Math.max(...rooms.map(r => r.top + r.height));
    const floorPlanWidth = maxWidth;
    const floorPlanHeight = maxHeight;
    
    // Scale factor to fit floor plan within image (using 65% of image dimensions)
    const scale = 0.65;
    
    const imageSrc = '/stl/61tvXvpALEL._AC_UF894,1000_QL80_.jpg';
    console.log('🔵 Image src:', imageSrc);
    
    return (
      <div className="w-full">
        <h3 className="mb-6 text-gray-800 text-xl font-semibold text-center">
          Floor Plan Switch Interface
        </h3>
        {/* DEBUG: Visible test to confirm component renders */}
        <div style={{ backgroundColor: 'yellow', padding: '10px', margin: '10px', textAlign: 'center' }}>
          DEBUG: FloorPlanLayout is rendering! Image should be below.
        </div>
        <div className="flex justify-center items-center">
          <div 
            className="relative" 
            style={{ 
              maxWidth: '800px',
              width: '100%',
              minHeight: '600px',
              backgroundColor: '#e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Switch panel image - EXACT same structure as Design B which works */}
            <div 
              className="flex items-center justify-center w-full h-full py-8" 
              style={{ position: 'absolute', zIndex: 1 }}
              ref={(el) => {
                if (el) {
                  console.log('🔵 Image container div rendered in DOM:', el);
                  const img = el.querySelector('img');
                  console.log('🔵 Image element in DOM:', img);
                  if (img) {
                    console.log('🔵 Image src attribute:', img.getAttribute('src'));
                    console.log('🔵 Image computed display:', window.getComputedStyle(img).display);
                    console.log('🔵 Image computed visibility:', window.getComputedStyle(img).visibility);
                    console.log('🔵 Image computed opacity:', window.getComputedStyle(img).opacity);
                    console.log('🔵 Image computed z-index:', window.getComputedStyle(img).zIndex);
                  }
                }
              }}
            >
              <img 
                src={imageSrc}
                alt="Switch Panel"
                className="w-auto h-auto rounded-lg"
                style={{ 
                  display: 'block',
                  maxWidth: '700px',
                  width: '90%',
                  height: 'auto',
                  border: '3px solid red' // DEBUG: Red border to see if image renders
                }}
                onError={(e) => {
                  console.error('❌ Design C Image ERROR - failed to load:', e.target.src);
                  console.error('Full path attempted:', window.location.origin + e.target.src);
                  console.error('Image element:', e.target);
                }}
                onLoad={(e) => {
                  console.log('✅ Design C Image SUCCESS - loaded:', e.target.src);
                  console.log('Image natural dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                }}
              />
            </div>
            
            {/* Overlay floor plan on the image - EXACT same structure as Design B */}
            <div 
              className="absolute inset-0 flex items-center justify-center" 
              style={{ 
                zIndex: 10,
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                  width: `${floorPlanWidth}px`,
                  height: `${floorPlanHeight}px`,
                  pointerEvents: 'auto'
                }}
              >
              {/* Floor plan container - COMPLETELY TRANSPARENT, no background at all */}
              <div 
                className="relative"
                style={{
                  width: '100%',
                  height: '100%',
                  border: '2px solid rgba(107, 114, 128, 0.2)',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  background: 'none'
                }}
              >
                {/* Render rooms from layout - rooms have NO background, only borders */}
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
                      className="absolute cursor-pointer transition-all duration-300"
                      style={{
                        left: `${room.left}px`,
                        top: `${room.top}px`,
                        width: `${room.width}px`,
                        height: `${room.height}px`,
                        borderRight: hasRoomRight ? '2px solid rgba(156, 163, 175, 0.4)' : 'none',
                        borderBottom: hasRoomBelow ? '2px solid rgba(156, 163, 175, 0.4)' : 'none',
                        backgroundColor: 'transparent',
                        background: 'none'
                      }}
                      onClick={() => handleSwitchToggle(room.id)}
                    >
                      <div className="w-full h-full flex items-center justify-center relative" style={{ backgroundColor: 'transparent' }}>
                        {/* Circular button without letter - only the button itself has background */}
                        <div
                          className={`w-12 h-12 rounded-full border-2 border-black transition-all duration-300 ${
                            lightStates[room.id]
                              ? 'bg-cyan-200 border-cyan-400 shadow-lg shadow-cyan-400/50'
                              : 'bg-white border-black'
                          } ${isTaskActive ? '' : 'opacity-60 cursor-not-allowed'}`}
                          style={{ zIndex: 20 }}
                        >
                        </div>
                        {/* Indicator light when ON - very transparent so image shows through */}
                        {lightStates[room.id] && (
                          <div className="absolute inset-0 bg-cyan-200/10 rounded-lg pointer-events-none" style={{ zIndex: 15 }}></div>
                        )}
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
  
  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      {designType === 'traditional' ? <TraditionalLayout /> : 
       designType === 'buttons' ? <ButtonsBelowLayout /> : 
       <FloorPlanLayout />}
      
      {/* Task status indicator */}
      {isTaskActive && (
        <div className="mt-6 text-center">
          <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {(() => {
              const taskType = currentCondition?.taskType || 'turnOn2';
              if (taskType === 'turnOn2') {
                return `Task Active - Turn ON 2 lights: ${targetAreas.join(', ')}`;
              } else if (taskType === 'turnOn1Off1') {
                return `Task Active - Turn ON: ${targetAreas.join(', ')}, Turn OFF: ${lightsToTurnOff.join(', ')}`;
              }
              return `Task Active - Turn ON Areas: ${targetAreas.join(', ')}`;
            })()}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default SwitchPanel;
