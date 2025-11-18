import React from 'react';
import Room from './Room';

const RoomLayout = ({ rooms, switchStates, onToggleSwitch }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex justify-center items-center min-h-[600px]">
      <div className="relative w-[800px] h-[600px] bg-gray-50 border-4 border-black rounded-lg overflow-hidden">
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
