import React from 'react';
import './Room.css';

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
      className={`room ${isActive ? 'active' : ''}`}
      style={roomStyle}
      onClick={onToggle}
    >
      <div className="room-switch">
        <div className="switch-outer">
          <div className="switch-inner">
            <span className="room-label">{room.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
