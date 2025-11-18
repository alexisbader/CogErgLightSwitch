import React, { useState, useEffect } from 'react';
import { ExperimentProvider, useExperiment } from './context/ExperimentContext';
import SwitchPanel from './components/SwitchPanel';
import FloorPlanDisplay from './components/FloorPlanDisplay';
import GroundTruthFloorPlan from './components/GroundTruthFloorPlan';
import ModeratorPanel from './components/ModeratorPanel';
import RecorderPanel from './components/RecorderPanel';
import SurveyForm from './components/SurveyForm';

// Inner component that can access context
function AppContent() {
  const { 
    designType, 
    startTask, 
    stopTask, 
    markTaskResult, 
    isTaskActive, 
    currentCondition,
    participantId,
    participantGroup
  } = useExperiment();
  const [viewMode, setViewMode] = useState('moderator'); // 'moderator' | 'participant' | 'split'
  const [showSurvey, setShowSurvey] = useState(false);
  const [participantTab, setParticipantTab] = useState('groundTruth'); // 'groundTruth' | 'switches'
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore if typing in an input field, textarea, or other input element
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      // View switching shortcuts
      if (key === 'z') {
        event.preventDefault();
        setViewMode('moderator');
      } else if (key === 'x') {
        event.preventDefault();
        setViewMode('participant');
        setParticipantTab('groundTruth');
      } else if (key === 'c') {
        event.preventDefault();
        setViewMode('participant');
        setParticipantTab('switches');
      }
      // Task control shortcuts
      else if (key === 's') {
        event.preventDefault();
        // Start task if not already active, we have a current condition, and participant info is set
        if (!isTaskActive && currentCondition && participantId && participantGroup) {
          startTask(currentCondition);
        }
      } else if (key === 'e') {
        event.preventDefault();
        // End/stop task if active - markTaskResult already calls stopTask internally
        if (isTaskActive) {
          markTaskResult(false); // Mark as incomplete/failed when ending with 'e'
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [viewMode, participantTab, isTaskActive, currentCondition, participantId, participantGroup, startTask, stopTask, markTaskResult]);

  return (
    <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold">Light Switch Experiment Interface</h1>
                <p className="text-indigo-100 mt-1">Research Study: Traditional vs Floor Plan Switch Interfaces</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode('moderator')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'moderator'
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Moderator View
                </button>
                <button
                  onClick={() => setViewMode('participant')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'participant'
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Participant View
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'split'
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Split View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-5">
          {/* Moderator View */}
          {viewMode === 'moderator' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ModeratorPanel />
                <RecorderPanel />
              </div>
              
              {/* Ground Truth Floor Plan */}
              <GroundTruthFloorPlan />
              
              {/* Show layout based on design type - Floor Plan Display for moderator view */}
              {designType === 'floorplan' ? (
                <FloorPlanDisplay />
              ) : designType === 'traditional' || designType === 'buttons' ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Current Interface: {designType === 'traditional' ? 'Traditional Switch Panel' : 'Buttons Below Floor Plan'}
                  </h2>
                  <SwitchPanel />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <p className="text-gray-600">No active task. Start a task to see the interface.</p>
                </div>
              )}
            </div>
          )}

          {/* Participant View */}
          {viewMode === 'participant' && (
            <div className="space-y-6">
              {!showSurvey ? (
                <>
                  {/* Tab Navigation */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex gap-2 border-b border-gray-200">
                      <button
                        onClick={() => setParticipantTab('groundTruth')}
                        className={`px-6 py-3 font-medium transition-colors ${
                          participantTab === 'groundTruth'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Ground Truth Floor Plan
                      </button>
                      <button
                        onClick={() => setParticipantTab('switches')}
                        className={`px-6 py-3 font-medium transition-colors ${
                          participantTab === 'switches'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Switch Panel
                      </button>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="mt-4">
                      {participantTab === 'groundTruth' ? (
                        <GroundTruthFloorPlan />
                      ) : (
                        <>
                          {/* Show only one layout based on design type - this is the switch panel */}
                          {designType === 'traditional' || designType === 'buttons' ? (
                            <SwitchPanel />
                          ) : designType === 'floorplan' ? (
                            <FloorPlanDisplay />
                          ) : (
                            <div className="p-8 text-center">
                              <p className="text-gray-600">No active task. Please start a task from the Moderator view.</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <SurveyForm 
                  onComplete={() => {
                    setShowSurvey(false);
                    alert('Survey submitted successfully!');
                  }}
                />
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowSurvey(!showSurvey)}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                >
                  {showSurvey ? 'Back to Task' : 'Show Survey'}
                </button>
              </div>
            </div>
          )}

          {/* Split View - Both screens side by side */}
          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - Participant View */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Participant Interface (Laptop 1)</h2>
                  
                  {/* Tab Navigation */}
                  <div className="mb-4">
                    <div className="flex gap-2 border-b border-gray-200">
                      <button
                        onClick={() => setParticipantTab('groundTruth')}
                        className={`px-6 py-3 font-medium transition-colors ${
                          participantTab === 'groundTruth'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Ground Truth Floor Plan
                      </button>
                      <button
                        onClick={() => setParticipantTab('switches')}
                        className={`px-6 py-3 font-medium transition-colors ${
                          participantTab === 'switches'
                            ? 'border-b-2 border-indigo-500 text-indigo-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Switch Panel
                      </button>
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  {participantTab === 'groundTruth' ? (
                    <GroundTruthFloorPlan />
                  ) : (
                    <>
                      {/* Show only one layout based on design type */}
                      {designType === 'traditional' || designType === 'buttons' ? (
                        <SwitchPanel />
                      ) : designType === 'floorplan' ? (
                        <FloorPlanDisplay />
                      ) : (
                        <div className="p-8 text-center text-gray-600">
                          <p>No active task. Please start a task from the Moderator view.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {showSurvey && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <SurveyForm 
                      onComplete={() => {
                        setShowSurvey(false);
                        alert('Survey submitted successfully!');
                      }}
                    />
                  </div>
                )}
                {!showSurvey && (
                  <button
                    onClick={() => setShowSurvey(true)}
                    className="w-full px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                  >
                    Show Survey
                  </button>
                )}
              </div>

              {/* Right Side - Moderator View */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Moderator Dashboard (Laptop 2)</h2>
                  <ModeratorPanel />
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Current Interface Display</h2>
                  {/* Show layout based on design type */}
                  {designType === 'floorplan' ? (
                    <FloorPlanDisplay />
                  ) : designType === 'traditional' || designType === 'buttons' ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        {designType === 'traditional' ? 'Traditional Switch Panel Interface' : 'Buttons Below Floor Plan Interface'}
                      </p>
                      <SwitchPanel />
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-600">
                      <p>No active task. Start a task to see the interface.</p>
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <RecorderPanel />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 bg-gray-800 text-gray-300 p-4 text-center text-sm">
          <p>Light Switch Experiment Interface - Frontend Only (CSV Export)</p>
        </div>
      </div>
  );
}

// Wrapper component with Provider
function App() {
  return (
    <ExperimentProvider>
      <AppContent />
    </ExperimentProvider>
  );
}

export default App;
