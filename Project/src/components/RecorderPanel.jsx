import React from 'react';
import { useExperiment } from '../context/ExperimentContext';

const RecorderPanel = () => {
  const {
    experimentData,
    exportToCSV,
    participantId,
    participantGroup,
    currentCondition,
    designType,
    lightStatus,
    targetAreas,
    elapsedTime,
    errors,
    taskSuccess,
    errorLog
  } = useExperiment();
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate learning curve data (if repetitive tasks)
  const getLearningCurveData = () => {
    // Group by condition type and calculate average performance
    const grouped = {};
    experimentData.forEach(record => {
      const key = `${record.design_type}_${record.lights_status}`;
      if (!grouped[key]) {
        grouped[key] = { times: [], errors: [], count: 0 };
      }
      grouped[key].times.push(record.completion_time);
      grouped[key].errors.push(record.errors);
      grouped[key].count++;
    });
    
    return grouped;
  };
  
  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Logger</h2>
      
      {/* Current Log Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Current Log</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Participant ID</div>
            <div className="font-bold text-gray-800">{participantId || 'N/A'}</div>
          </div>
          <div>
            <div className="text-gray-600">Group</div>
            <div className="font-bold text-gray-800">{participantGroup || 'N/A'}</div>
          </div>
          <div>
            <div className="text-gray-600">Design Type</div>
            <div className="font-bold text-gray-800">{designType || 'N/A'}</div>
          </div>
          <div>
            <div className="text-gray-600">Light Status</div>
            <div className="font-bold text-gray-800">{lightStatus || 'N/A'}</div>
          </div>
          <div>
            <div className="text-gray-600">Target Areas</div>
            <div className="font-bold text-gray-800">{targetAreas.join(', ') || 'N/A'}</div>
          </div>
          <div>
            <div className="text-gray-600">Task Time</div>
            <div className="font-bold text-gray-800">{formatTime(elapsedTime)}</div>
          </div>
          <div>
            <div className="text-gray-600">Error Count</div>
            <div className="font-bold text-gray-800">{errors}</div>
          </div>
          <div>
            <div className="text-gray-600">Success</div>
            <div className={`font-bold ${
              taskSuccess === true ? 'text-green-600' : 
              taskSuccess === false ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {taskSuccess === true ? 'Yes' : taskSuccess === false ? 'No' : 'Pending'}
            </div>
          </div>
        </div>
        
        {/* Error Log Display */}
        {errorLog.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-300">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Switch Press Log</h4>
            <div className="max-h-32 overflow-y-auto bg-white rounded p-2 text-xs">
              {errorLog.map((log, idx) => (
                <div key={idx} className={`mb-1 ${log.isError ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                  {log.relativeTime}s: Area {log.areaId} {log.action} {log.isTarget ? '(target)' : '(non-target)'} 
                  {log.isError && ' ⚠ ERROR'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Data Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          All Records ({experimentData.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Participant</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Design</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Light Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Targets</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Time (s)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Errors</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Success</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Error Log</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">NASA-TLX</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {experimentData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                    No data recorded yet
                  </td>
                </tr>
              ) : (
                experimentData.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{record.participant_id}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.design_type}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.lights_status}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.target_areas}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.completion_time.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.errors}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        record.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.success ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700 max-w-xs truncate" title={record.error_log || ''}>
                      {record.error_log || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.nasa_tlx || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Export Section */}
      <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Export Data</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={exportToCSV}
            disabled={experimentData.length === 0}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to CSV ({experimentData.length} records)
          </button>
          <div className="text-sm text-gray-600">
            CSV file will include all task data, survey responses, and timestamps
          </div>
        </div>
      </div>
      
      {/* Learning Curve Visualization (simple text-based) */}
      {experimentData.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Performance Summary</h3>
          <div className="text-sm text-gray-600">
            {Object.keys(getLearningCurveData()).map((key, idx) => {
              const data = getLearningCurveData()[key];
              const avgTime = data.times.reduce((a, b) => a + b, 0) / data.times.length;
              const avgErrors = data.errors.reduce((a, b) => a + b, 0) / data.errors.length;
              return (
                <div key={idx} className="mb-2">
                  <span className="font-medium">{key}:</span> Avg Time: {avgTime.toFixed(2)}s, 
                  Avg Errors: {avgErrors.toFixed(1)} ({data.count} trials)
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecorderPanel;

