import React, { useState, useMemo } from 'react';
import { useExperiment } from '../context/ExperimentContext';
import { getConditionOrderForParticipant, getGroupFromParticipantId } from '../utils/latinSquare';

const ModeratorPanel = () => {
  const {
    participantId,
    setParticipantId,
    participantGroup,
    setParticipantGroup,
    isTaskActive,
    startTask,
    stopTask,
    markTaskResult,
    elapsedTime,
    errors,
    taskSuccess,
    resetForNextCondition,
    updateConditionData,
    currentCondition,
    designType,
    lightStatus,
    targetAreas,
    floorPlanOrientation,
    setFloorPlanOrientation
  } = useExperiment();
  
  const [notes, setNotes] = useState('');
  const [conditionIndex, setConditionIndex] = useState(0);
  
  // Base conditions (3 conditions as specified)
  // All conditions have initial light status: All Off
  // All conditions have task type: Turn ON 2 lights
  // Conditions:
  // 1. Design A (traditional), all lights off, Turn ON 2 lights
  // 2. Design B (buttons), all lights off, Turn ON 2 lights
  // 3. Design C (floorplan), all lights off, Turn ON 2 lights
  const baseConditions = [
    { designType: 'traditional', lightStatus: 'allOff', taskType: 'turnOn2', label: 'Design A, All Off, Turn ON 2' },
    { designType: 'buttons', lightStatus: 'allOff', taskType: 'turnOn2', label: 'Design B, All Off, Turn ON 2' },
    { designType: 'floorplan', lightStatus: 'allOff', taskType: 'turnOn2', label: 'Design C, All Off, Turn ON 2' },
  ];
  
  // Get condition order based on participant ID (Latin Square counterbalancing)
  // Uses participant ID (e.g., A1, A2, B1, etc.) to determine order
  const conditionOrder = useMemo(() => {
    if (!participantId) {
      return [0, 1, 2]; // Default order if no participant ID specified
    }
    return getConditionOrderForParticipant(participantId);
  }, [participantId]);
  
  // Get ordered conditions based on group
  const conditions = useMemo(() => {
    return conditionOrder.map(index => baseConditions[index]);
  }, [conditionOrder]);
  
  // Track previous condition index to only update when it actually changes
  const prevConditionIndexRef = React.useRef(conditionIndex);
  const prevParticipantIdRef = React.useRef(participantId);
  const hasInitializedRef = React.useRef(false);
  
  // Initialize on mount - set initial condition data only once when conditions are ready
  React.useEffect(() => {
    if (!hasInitializedRef.current && conditions.length > 0 && !isTaskActive) {
      hasInitializedRef.current = true;
      prevConditionIndexRef.current = conditionIndex;
      prevParticipantIdRef.current = participantId;
      updateConditionData(conditions[conditionIndex]);
    }
  }, [conditions, isTaskActive, conditionIndex, updateConditionData]);
  
  // Reset condition index when participant ID changes (which changes the Latin Square order)
  React.useEffect(() => {
    if (hasInitializedRef.current && prevParticipantIdRef.current !== participantId) {
      prevParticipantIdRef.current = participantId;
      setConditionIndex(0);
      prevConditionIndexRef.current = 0;
      resetForNextCondition();
      // Update group based on participant ID
      const group = getGroupFromParticipantId(participantId);
      if (group) {
        setParticipantGroup(group);
      }
      // Only update if no task is active
      if (conditions.length > 0 && !isTaskActive) {
        updateConditionData(conditions[0]);
      }
    }
  }, [participantId, resetForNextCondition, updateConditionData, conditions, isTaskActive, setParticipantGroup]);
  
  // Update condition data when condition index changes (only if index actually changed and no task is active)
  React.useEffect(() => {
    if (hasInitializedRef.current &&
        prevConditionIndexRef.current !== conditionIndex && 
        conditions.length > 0 && 
        conditionIndex < conditions.length &&
        !isTaskActive) {
      prevConditionIndexRef.current = conditionIndex;
      updateConditionData(conditions[conditionIndex]);
      resetForNextCondition();
    }
  }, [conditionIndex, conditions, updateConditionData, resetForNextCondition, isTaskActive]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartTask = () => {
    if (conditionIndex < conditions.length) {
      startTask(conditions[conditionIndex]);
    }
  };
  
  const handleMarkSuccess = () => {
    markTaskResult(true);
  };
  
  const handleMarkFailure = () => {
    markTaskResult(false);
  };
  
  const handleNextCondition = () => {
    if (isTaskActive) return; // Don't allow changing condition during active task
    resetForNextCondition();
    const newIndex = (conditionIndex + 1) % conditions.length;
    prevConditionIndexRef.current = newIndex;
    setConditionIndex(newIndex);
    setNotes('');
    // Update condition data immediately with the new index
    if (conditions.length > 0) {
      updateConditionData(conditions[newIndex]);
    }
  };
  
  const currentConditionData = conditions[conditionIndex] || null;
  
  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Moderator Dashboard</h2>
      
      {/* Participant Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Participant Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Participant ID</label>
            <input
              type="text"
              value={participantId}
              onChange={(e) => {
                const newId = e.target.value.toUpperCase();
                setParticipantId(newId);
                // Auto-update group from participant ID (e.g., A1 → A, B2 → B)
                const group = getGroupFromParticipantId(newId);
                if (group) {
                  setParticipantGroup(group);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., A1, A2, B1, C6, etc."
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: [Group Letter][Number] (e.g., A1-A6, B1-B6, C1-C6)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Group</label>
            <input
              type="text"
              value={participantGroup}
              onChange={(e) => {
                const newGroup = e.target.value;
                setParticipantGroup(newGroup);
                // Auto-update participant ID format if it matches the pattern
                if (participantId && /^[A-Z]\d+$/.test(participantId.toUpperCase())) {
                  const participantNum = participantId.toUpperCase().match(/\d+$/)?.[0] || '1';
                  setParticipantId(newGroup.toUpperCase() + participantNum);
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., A, B, C (auto-set from Participant ID)"
              disabled={!!participantId}
              title={participantId ? "Group is automatically set from Participant ID" : ""}
            />
            <p className="text-xs text-gray-500 mt-1">
              Group is automatically determined from Participant ID (e.g., A1 → Group A)
            </p>
          </div>
        </div>
      </div>
      
      {/* Current Condition Info */}
      {currentConditionData && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Current Condition</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Design: </span>
              <span className="font-bold text-blue-700">
                {currentConditionData.designType === 'traditional' ? 'Design A (Traditional)' :
                 currentConditionData.designType === 'buttons' ? 'Design B (Buttons)' :
                 currentConditionData.designType === 'floorplan' ? 'Design C (Floor Plan)' :
                 currentConditionData.designType}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Light Status: </span>
              <span className="font-bold text-blue-700">
                {currentConditionData.lightStatus === 'allOff' ? 'All Off' :
                 currentConditionData.lightStatus === 'allOn' ? 'All On' :
                 currentConditionData.lightStatus === 'mixed' ? 'Some On (Mixed)' :
                 currentConditionData.lightStatus}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Task Type: </span>
              <span className="font-bold text-blue-700">
                {currentConditionData.taskType === 'turnOn2' ? 'Turn ON 2 lights' :
                 currentConditionData.taskType === 'turnOn1Off1' ? 'Turn ON 1 light, Turn OFF 1 light' :
                 currentConditionData.taskType}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Target Areas: </span>
              <span className="font-bold text-blue-700">(Randomly generated per trial)</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Condition {conditionIndex + 1} of {conditions.length} - {currentConditionData?.label || ''}
            {participantId && (
              <span className="ml-2">(Participant {participantId.toUpperCase()})</span>
            )}
            {participantGroup && (
              <span className="ml-2">(Group {participantGroup.toUpperCase()})</span>
            )}
          </div>
        </div>
      )}
      
      {/* Task Control */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Task Control</h3>
        
        {/* Real-time Timer and Error Counter */}
        <div className="flex gap-6 mb-4">
          <div className="flex-1 p-3 bg-white rounded-lg border-2 border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Timer</div>
            <div className="text-3xl font-bold text-red-600">{formatTime(elapsedTime)}</div>
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg border-2 border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Errors</div>
            <div className="text-3xl font-bold text-orange-600">{errors}</div>
          </div>
          <div className="flex-1 p-3 bg-white rounded-lg border-2 border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className={`text-lg font-bold ${
              taskSuccess === true ? 'text-green-600' : 
              taskSuccess === false ? 'text-red-600' : 
              isTaskActive ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {taskSuccess === true ? 'Success!' : 
               taskSuccess === false ? 'Failed' : 
               isTaskActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleStartTask}
            disabled={isTaskActive || !participantId || !participantGroup}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Start Task
          </button>
          <button
            onClick={handleMarkSuccess}
            disabled={!isTaskActive}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Mark Success
          </button>
          <button
            onClick={handleMarkFailure}
            disabled={!isTaskActive}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Mark Failure
          </button>
          <button
            onClick={handleNextCondition}
            disabled={isTaskActive}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Next Condition
          </button>
        </div>
      </div>
      
      {/* Floor Plan Orientation Control */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Ground Truth Floor Plan Orientation</h3>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-600">Rotation (degrees):</label>
          <input
            type="range"
            min="0"
            max="180"
            step="15"
            value={floorPlanOrientation}
            onChange={(e) => setFloorPlanOrientation(parseInt(e.target.value))}
            className="flex-1"
            disabled={isTaskActive}
          />
          <input
            type="number"
            min="0"
            max="180"
            step="15"
            value={floorPlanOrientation}
            onChange={(e) => {
              const val = Math.max(0, Math.min(180, parseInt(e.target.value) || 0));
              setFloorPlanOrientation(val);
            }}
            className="w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isTaskActive}
          />
          <span className="text-sm text-gray-600">°</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Adjust the orientation of the ground truth floor plan (0-180 degrees)
        </div>
      </div>
      
      {/* Notes */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows="3"
          placeholder="Add notes about this condition/task..."
        />
      </div>
    </div>
  );
};

export default ModeratorPanel;

