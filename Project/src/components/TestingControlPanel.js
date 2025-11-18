import React, { useState, useEffect, useRef } from 'react';

const TestingControlPanel = ({ 
  onStartTrial, 
  onNextTrial, 
  onSwitchPress, 
  currentTrial, 
  participantData,
  onUpdateParticipantData,
  isTrialActive,
  targetSwitches,
  switchStates,
  isCollapsed,
  onToggleCollapse
}) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [participantNumber, setParticipantNumber] = useState(1);
  const [participantMetadata, setParticipantMetadata] = useState({
    gender: '',
    age: ''
  });
  const [trialData, setTrialData] = useState([]);
  const [csvData, setCsvData] = useState([]);

  // Timer functionality
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start trial
  const handleStartTrial = () => {
    setTimer(0);
    setIsRunning(true);
    setTrialData([]);
    onStartTrial();
  };

  // Next trial
  const handleNextTrial = () => {
    setIsRunning(false);
    onNextTrial();
  };

  // Record switch press
  const handleSwitchPress = (roomId) => {
    if (isTrialActive) {
      const timestamp = Date.now();
      const timeInSeconds = timer;
      const wasTarget = targetSwitches.includes(roomId);
      
      const pressData = {
        participantNumber,
        trial: currentTrial,
        roomId,
        timestamp,
        timeInSeconds,
        wasTarget,
        switchType: 'traditional', // This will be updated based on current layout
        gender: participantMetadata.gender,
        age: participantMetadata.age
      };

      setTrialData(prev => [...prev, pressData]);
      setCsvData(prev => [...prev, pressData]);
      onSwitchPress(roomId);
    }
  };

  // Download CSV
  const downloadCSV = () => {
    if (csvData.length === 0) return;

    const headers = [
      'Participant Number',
      'Trial',
      'Room ID',
      'Timestamp',
      'Time (seconds)',
      'Was Target',
      'Switch Type',
      'Gender',
      'Age'
    ];

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => [
        row.participantNumber,
        row.trial,
        row.roomId,
        row.timestamp,
        row.timeInSeconds,
        row.wasTarget,
        row.switchType,
        row.gender,
        row.age
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `switch_testing_data_participant_${participantNumber}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Update participant metadata
  const updateParticipantMetadata = (field, value) => {
    const updated = { ...participantMetadata, [field]: value };
    setParticipantMetadata(updated);
    onUpdateParticipantData(updated);
  };

  // Start new participant
  const startNewParticipant = () => {
    setParticipantNumber(prev => prev + 1);
    setParticipantMetadata({ gender: '', age: '' });
    setCsvData([]);
    setTrialData([]);
    setTimer(0);
    setIsRunning(false);
  };

  return (
    <div className="p-6">
          {/* Participant Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Participant Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Participant Number</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-indigo-600">{participantNumber}</span>
                  <button
                    onClick={startNewParticipant}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    New Participant
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                <select
                  value={participantMetadata.gender}
                  onChange={(e) => updateParticipantMetadata('gender', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                <input
                  type="number"
                  value={participantMetadata.age}
                  onChange={(e) => updateParticipantMetadata('age', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
              </div>
            </div>
          </div>

          {/* Trial Control */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Trial Control</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-sm">
                <span className="font-medium text-gray-600">Current Trial: </span>
                <span className="font-bold text-indigo-600">{currentTrial}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-600">Timer: </span>
                <span className="font-bold text-red-600">{formatTime(timer)}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleStartTrial}
                disabled={isTrialActive || !participantMetadata.gender || !participantMetadata.age}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Start Trial
              </button>
              <button
                onClick={handleNextTrial}
                disabled={!isTrialActive}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Next Trial
              </button>
            </div>
          </div>


          {/* Trial Data Summary */}
          {trialData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Current Trial Data</h3>
              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                {trialData.map((press, index) => (
                  <div key={index} className="text-sm text-gray-600 mb-1">
                    {press.roomId} at {formatTime(press.timeInSeconds)} 
                    {press.wasTarget ? ' (TARGET)' : ' (non-target)'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Export */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Data Export</h3>
            <div className="flex gap-3">
              <button
                onClick={downloadCSV}
                disabled={csvData.length === 0}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Download CSV ({csvData.length} records)
              </button>
            </div>
          </div>
    </div>
  );
};

export default TestingControlPanel;
