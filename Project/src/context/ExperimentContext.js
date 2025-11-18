import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { generateRandomRoomLayout, getRoomLetters } from '../utils/roomLayouts';

const ExperimentContext = createContext();

export const useExperiment = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within ExperimentProvider');
  }
  return context;
};

export const ExperimentProvider = ({ children }) => {
  // Participant info
  const [participantId, setParticipantId] = useState('');
  const [participantGroup, setParticipantGroup] = useState('');
  
  // Current task state
  const [currentCondition, setCurrentCondition] = useState(null);
  const [designType, setDesignType] = useState('traditional'); // 'traditional' | 'buttons' | 'floorplan'
  const [lightStatus, setLightStatus] = useState('allOff'); // 'allOff' | 'allOn' | 'mixed'
  const [targetAreas, setTargetAreas] = useState([]); // ['A', 'B', etc.] - lights to turn ON
  const [lightsToTurnOff, setLightsToTurnOff] = useState([]); // ['C', 'D', etc.] - lights to turn OFF
  
  // Room layout and light states
  const [roomLayout, setRoomLayout] = useState(null); // { numRooms, variation, rooms, roomIds }
  const [lightStates, setLightStates] = useState({});
  
  // Floor plan orientation (0-180 degrees)
  const [floorPlanOrientation, setFloorPlanOrientation] = useState(0);
  
  // Error tracking - detailed log of switch presses
  const [errorLog, setErrorLog] = useState([]); // Array of { areaId, timestamp, action, wasError }
  
  // Task state
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [taskEndTime, setTaskEndTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [taskSuccess, setTaskSuccess] = useState(null); // null | true | false
  
  // Timer
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIntervalRef = useRef(null);
  const taskCompletedRef = useRef(false);
  const autoSavedRef = useRef(false);
  const lastToggleRef = useRef({ areaId: null, timestamp: 0 }); // Track last toggle to prevent duplicates
  
  // All experiment data for CSV export
  const [experimentData, setExperimentData] = useState([]);
  
  // Survey data
  const [surveyData, setSurveyData] = useState(null);
  
  // Initialize light states based on lightStatus and room layout
  const initializeLightStates = useCallback((status, roomIds) => {
    const newStates = {};
    roomIds.forEach(id => { newStates[id] = false; });
    
    if (status === 'allOn') {
      roomIds.forEach(key => { newStates[key] = true; });
    } else if (status === 'mixed') {
      // Randomly set 2 lights on
      const shuffled = [...roomIds].sort(() => 0.5 - Math.random());
      shuffled.slice(0, Math.min(2, roomIds.length)).forEach(key => { newStates[key] = true; });
    }
    
    return newStates;
  }, []);
  
  // Start task
  const startTask = useCallback((condition) => {
    setCurrentCondition(condition);
    setDesignType(condition.designType || 'traditional');
    setLightStatus(condition.lightStatus || 'allOff');
    
    // Generate random room layout for this trial
    const layout = generateRandomRoomLayout();
    setRoomLayout(layout);
    
    // Initialize light states first (based on lightStatus)
    const initialStates = initializeLightStates(condition.lightStatus || 'allOff', layout.roomIds);
    setLightStates(initialStates);
    
    // Generate target areas based on task type
    const taskType = condition.taskType || 'turnOn2';
    const shuffled = [...layout.roomIds].sort(() => 0.5 - Math.random());
    
    if (taskType === 'turnOn2') {
      // Turn ON 2 lights
      const targets = shuffled.slice(0, Math.min(2, layout.roomIds.length));
      setTargetAreas(targets);
      setLightsToTurnOff([]);
    } else if (taskType === 'turnOn1Off1') {
      // Turn ON 1 light, turn OFF 1 light
      // For turnOn1Off1, we need at least one light that is currently ON to turn OFF
      const lightsCurrentlyOn = layout.roomIds.filter(id => initialStates[id] === true);
      const lightsCurrentlyOff = layout.roomIds.filter(id => initialStates[id] === false);
      
      if (lightsCurrentlyOn.length > 0 && lightsCurrentlyOff.length > 0) {
        // Pick one light to turn ON (from currently OFF)
        const turnOnTarget = lightsCurrentlyOff[Math.floor(Math.random() * lightsCurrentlyOff.length)];
        // Pick one light to turn OFF (from currently ON)
        const turnOffTarget = lightsCurrentlyOn[Math.floor(Math.random() * lightsCurrentlyOn.length)];
        setTargetAreas([turnOnTarget]);
        setLightsToTurnOff([turnOffTarget]);
      } else {
        // Fallback: if all lights are same state, just pick random ones
        const turnOnTarget = shuffled[0];
        const turnOffTarget = shuffled[1] || shuffled[0];
        setTargetAreas([turnOnTarget]);
        setLightsToTurnOff([turnOffTarget]);
      }
    } else {
      // Default: turn ON 2 lights
      const targets = shuffled.slice(0, Math.min(2, layout.roomIds.length));
      setTargetAreas(targets);
      setLightsToTurnOff([]);
    }
    
    setErrors(0);
    setTaskSuccess(null);
    taskCompletedRef.current = false;
    autoSavedRef.current = false;
    setErrorLog([]); // Reset error log for new task
    setTaskStartTime(Date.now());
    setTaskEndTime(null);
    
    setIsTaskActive(true);
    
    // Start timer
    setElapsedTime(0);
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  }, [initializeLightStates]);
  
  // Stop task
  const stopTask = useCallback(() => {
    setIsTaskActive(false);
    setTaskEndTime(Date.now());
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);
  
  // Save task data
  const saveTaskData = useCallback((survey = null) => {
    if (!taskStartTime) return null;
    
    const duration = taskEndTime ? (taskEndTime - taskStartTime) / 1000 : elapsedTime;
    
    // Format error log for CSV
    const errorLogString = errorLog.map(e => 
      `${e.areaId}:${e.action}:${e.isError ? 'ERROR' : 'OK'}:${e.relativeTime}s`
    ).join('; ');
    
    const data = {
      participant_id: participantId,
      group: participantGroup,
      design_type: designType,
      lights_status: lightStatus,
      task_type: currentCondition?.taskType || 'turnOn2',
      num_rooms: roomLayout?.numRooms || 0,
      room_variation: roomLayout?.variation || 0,
      target_areas: targetAreas.join(','),
      lights_to_turn_off: lightsToTurnOff.join(','),
      completion_time: duration,
      errors: errors,
      error_log: errorLogString,
      success: taskSuccess === true,
      nasa_tlx: survey?.nasaTlx || null,
      confidence: survey?.confidence || null,
      timestamp: new Date().toISOString()
    };
    
    setExperimentData(prev => [...prev, data]);
    return data;
  }, [participantId, participantGroup, designType, lightStatus, currentCondition, targetAreas, lightsToTurnOff, roomLayout,
      taskStartTime, taskEndTime, elapsedTime, errors, taskSuccess, errorLog]);
  
  // Toggle light switch
  const toggleSwitch = useCallback((areaId) => {
    // Only allow toggles when task is active
    // Task completion is manual - moderator must mark it, so we don't check taskCompletedRef here
    if (!isTaskActive) return;
    
    const timestamp = Date.now();
    
    // Prevent duplicate processing: if same area toggled within 100ms, skip
    if (lastToggleRef.current.areaId === areaId && 
        timestamp - lastToggleRef.current.timestamp < 100) {
      return;
    }
    
    // Mark this toggle
    lastToggleRef.current = { areaId, timestamp };
    
    // Read current state and calculate error BEFORE updating state
    setLightStates(prev => {
      const wasOn = prev[areaId];
      const isNowOn = !wasOn;
      const isTarget = targetAreas.includes(areaId);
      const relativeTime = taskStartTime ? (timestamp - taskStartTime) / 1000 : 0;
      
      // Determine if this is an error:
      // - Turning ON a non-target area = ERROR
      // - Turning OFF = NOT an error (correcting/undoing)
      // - Turning ON a target area = NOT an error (correct action)
      
      let isError = false;
      let action = '';
      
      if (isNowOn && !wasOn) {
        action = 'turned ON';
        if (!isTarget) {
          isError = true; // Turning ON a non-target = ERROR
        }
      } else if (!isNowOn && wasOn) {
        action = 'turned OFF';
        isError = false; // Turning OFF is never an error
      }
      
      // Create log entry - capture in closure for use outside
      const logEntry = {
        areaId,
        timestamp,
        relativeTime: relativeTime.toFixed(2),
        action,
        isTarget,
        wasOn,
        isNowOn,
        isError
      };
      
      // Update error log and count AFTER state update (using closure to capture values)
      // This setTimeout ensures error logging happens after state update completes
      setTimeout(() => {
        setErrorLog(prevLog => {
          // Check if duplicate entry exists (same area, action, within 200ms)
          const isDuplicate = prevLog.some(entry => 
            entry.areaId === logEntry.areaId && 
            entry.action === logEntry.action &&
            Math.abs(entry.timestamp - logEntry.timestamp) < 200
          );
          
          if (!isDuplicate) {
            // Only increment error count if this is actually an error
            if (logEntry.isError) {
              setErrors(prevErrors => prevErrors + 1);
            }
            return [...prevLog, logEntry];
          }
          return prevLog;
        });
      }, 0);
      
      // Create new state
      const newState = { ...prev, [areaId]: isNowOn };
      
      // Task completion is now manual - moderator must mark success/failure
      // No automatic completion check here
      
      return newState;
    });
    }, [isTaskActive, targetAreas, lightsToTurnOff, currentCondition, roomLayout, stopTask, taskStartTime]);
  
  // Mark task success/failure manually
  const markTaskResult = useCallback((success) => {
    taskCompletedRef.current = true;
    setTaskSuccess(success);
    stopTask();
  }, [stopTask]);
  
  // Auto-save task data when task completes
  useEffect(() => {
    if (taskSuccess !== null && taskEndTime && taskStartTime && !autoSavedRef.current) {
      // Auto-save without survey (survey can be added later via saveSurvey)
      saveTaskData();
      autoSavedRef.current = true;
    }
  }, [taskSuccess, taskEndTime, taskStartTime, saveTaskData]);
  
  // Save survey data
  const saveSurvey = useCallback((survey) => {
    setSurveyData(survey);
    saveTaskData(survey);
  }, [saveTaskData]);
  
  // Helper function to escape CSV fields (wrap in quotes if contains comma)
  const escapeCSVField = (field) => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  
  // Export to CSV
  const exportToCSV = useCallback(() => {
    if (experimentData.length === 0) return;
    
    const headers = [
      'participant_id',
      'group',
      'design_type',
      'lights_status',
      'task_type',
      'num_rooms',
      'room_variation',
      'target_areas',
      'lights_to_turn_off',
      'completion_time',
      'errors',
      'error_log',
      'success',
      'nasa_tlx',
      'confidence',
      'timestamp'
    ];
    
    const csvContent = [
      headers.join(','),
      ...experimentData.map(row => [
        escapeCSVField(row.participant_id),
        escapeCSVField(row.group),
        escapeCSVField(row.design_type),
        escapeCSVField(row.lights_status),
        escapeCSVField(row.task_type),
        escapeCSVField(row.num_rooms),
        escapeCSVField(row.room_variation),
        escapeCSVField(row.target_areas), // This will be quoted since it contains commas
        escapeCSVField(row.lights_to_turn_off || ''), // This will be quoted since it contains commas
        escapeCSVField(row.completion_time),
        escapeCSVField(row.errors),
        escapeCSVField(row.error_log || ''), // Detailed error log
        escapeCSVField(row.success),
        escapeCSVField(row.nasa_tlx || ''),
        escapeCSVField(row.confidence || ''),
        escapeCSVField(row.timestamp)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment_data_${participantId || 'export'}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [experimentData, participantId]);
  
  // Update condition data without starting task (for preview)
  // Only updates if no task is currently active
  const updateConditionData = useCallback((condition) => {
    // Don't update if a task is active - preserve the current trial
    if (isTaskActive) {
      return;
    }
    
    setCurrentCondition(condition);
    setDesignType(condition.designType || 'traditional');
    setLightStatus(condition.lightStatus || 'allOff');
    
    // Generate random room layout for preview
    const layout = generateRandomRoomLayout();
    setRoomLayout(layout);
    
    // Initialize light states first (based on lightStatus)
    const initialStates = initializeLightStates(condition.lightStatus || 'allOff', layout.roomIds);
    setLightStates(initialStates);
    
    // Generate target areas for preview based on task type
    const taskType = condition.taskType || 'turnOn2';
    const shuffled = [...layout.roomIds].sort(() => 0.5 - Math.random());
    
    if (taskType === 'turnOn2') {
      const targets = shuffled.slice(0, Math.min(2, layout.roomIds.length));
      setTargetAreas(targets);
      setLightsToTurnOff([]);
    } else if (taskType === 'turnOn1Off1') {
      const lightsCurrentlyOn = layout.roomIds.filter(id => initialStates[id] === true);
      const lightsCurrentlyOff = layout.roomIds.filter(id => initialStates[id] === false);
      
      if (lightsCurrentlyOn.length > 0 && lightsCurrentlyOff.length > 0) {
        const turnOnTarget = lightsCurrentlyOff[Math.floor(Math.random() * lightsCurrentlyOff.length)];
        const turnOffTarget = lightsCurrentlyOn[Math.floor(Math.random() * lightsCurrentlyOn.length)];
        setTargetAreas([turnOnTarget]);
        setLightsToTurnOff([turnOffTarget]);
      } else {
        const turnOnTarget = shuffled[0];
        const turnOffTarget = shuffled[1] || shuffled[0];
        setTargetAreas([turnOnTarget]);
        setLightsToTurnOff([turnOffTarget]);
      }
    } else {
      const targets = shuffled.slice(0, Math.min(2, layout.roomIds.length));
      setTargetAreas(targets);
      setLightsToTurnOff([]);
    }
  }, [initializeLightStates, isTaskActive]);
  
  // Reset for next condition
  const resetForNextCondition = useCallback(() => {
    setErrors(0);
    setTaskSuccess(null);
    taskCompletedRef.current = false;
    autoSavedRef.current = false;
    setElapsedTime(0);
    setLightStates({});
    setSurveyData(null);
    setErrorLog([]);
    setLightsToTurnOff([]);
    lastToggleRef.current = { areaId: null, timestamp: 0 }; // Reset toggle tracking
    // Note: Don't reset floorPlanOrientation here - let moderator control it
  }, []);
  
  const value = {
    // Participant
    participantId,
    setParticipantId,
    participantGroup,
    setParticipantGroup,
    
    // Task state
    currentCondition,
    designType,
    lightStatus,
    targetAreas,
    lightsToTurnOff,
    roomLayout,
    lightStates,
    floorPlanOrientation,
    setFloorPlanOrientation,
    isTaskActive,
    taskStartTime,
    taskEndTime,
    errors,
    taskSuccess,
    elapsedTime,
    errorLog,
    
    // Data
    experimentData,
    surveyData,
    
    // Actions
    startTask,
    stopTask,
    toggleSwitch,
    markTaskResult,
    saveTaskData,
    saveSurvey,
    exportToCSV,
    resetForNextCondition,
    updateConditionData
  };
  
  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
};

