import React from 'react';
import Room from './Room';
import './RoomLayout.css';

const RoomLayout = ({ rooms, switchStates, onToggleSwitch }) => {
  return (
    <div className="room-layout">
      <div className="floor-plan">
        {rooms.map((room) => (
          <Room
            key={room.id}
            room={room}
            isActive={switchStates[room.id]}
            onToggle={() => onToggleSwitch(room.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomLayout;
