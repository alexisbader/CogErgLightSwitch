import React from 'react';

const Room = ({ room, isActive, onToggle }) => {
  const roomStyle = {
    position: 'absolute',
    left: `${room.left}px`,
    top: `${room.top}px`,
    width: `${room.width}px`,
    height: `${room.height}px`
  };

  return (
    <div 
      className={`cursor-pointer transition-all duration-300 absolute bg-white border-2 border-black rounded overflow-hidden z-10 ${
        isActive 
          ? 'border-blue-500 shadow-lg shadow-blue-500/30' 
          : 'border-black'
      }`}
      style={roomStyle}
      onClick={onToggle}
    >
      <div className="flex items-center justify-center w-full h-full p-5">
        <div className={`w-16 h-16 border-4 border-black rounded-full flex items-center justify-center transition-all duration-300 relative ${
          isActive 
            ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/30' 
            : 'border-black'
        }`}>
          <div className={`w-10 h-10 border-2 border-black rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-black bg-transparent'
          }`}>
            <span className={`text-lg font-bold transition-all duration-300 ${
              isActive ? 'text-white' : 'text-black'
            }`}>
              {room.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
