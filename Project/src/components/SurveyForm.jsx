import React, { useState } from 'react';
import { useExperiment } from '../context/ExperimentContext';

const SurveyForm = ({ onComplete }) => {
  const { saveSurvey, taskSuccess, designType } = useExperiment();
  
  const [nasaTlx, setNasaTlx] = useState({
    mental: 0,
    physical: 0,
    temporal: 0,
    performance: 0,
    effort: 0,
    frustration: 0
  });
  
  const [confidence, setConfidence] = useState(4);
  
  const handleNasaTlxChange = (dimension, value) => {
    setNasaTlx(prev => ({
      ...prev,
      [dimension]: parseInt(value)
    }));
  };
  
  const calculateNasaTlxScore = () => {
    const sum = Object.values(nasaTlx).reduce((a, b) => a + b, 0);
    return (sum / 6).toFixed(2);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const surveyData = {
      nasaTlx: calculateNasaTlxScore(),
      confidence: confidence
    };
    
    saveSurvey(surveyData);
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const nasaDimensions = [
    { key: 'mental', label: 'Mental Demand', low: 'Very Low', high: 'Very High' },
    { key: 'physical', label: 'Physical Demand', low: 'Very Low', high: 'Very High' },
    { key: 'temporal', label: 'Temporal Demand', low: 'Very Low', high: 'Very High' },
    { key: 'performance', label: 'Performance', low: 'Perfect', high: 'Failure' },
    { key: 'effort', label: 'Effort', low: 'Very Low', high: 'Very High' },
    { key: 'frustration', label: 'Frustration', low: 'Very Low', high: 'Very High' }
  ];
  
  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Post-Task Survey</h2>
      
      <form onSubmit={handleSubmit}>
        {/* NASA-TLX */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            NASA Task Load Index (TLX)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Rate each dimension on a scale from 0 to 20, where 0 is the lowest and 20 is the highest.
          </p>
          
          <div className="space-y-6">
            {nasaDimensions.map((dim) => (
              <div key={dim.key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">{dim.label}</label>
                  <span className="text-sm font-bold text-blue-600">{nasaTlx[dim.key]}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>{dim.low}</span>
                  <span>{dim.high}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={nasaTlx[dim.key]}
                  onChange={(e) => handleNasaTlxChange(dim.key, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Average NASA-TLX Score:</div>
            <div className="text-2xl font-bold text-blue-600">{calculateNasaTlxScore()}</div>
          </div>
        </div>
        
        {/* Confidence Rating */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Confidence Rating</h3>
          <p className="text-sm text-gray-600 mb-4">
            How confident are you that you completed the task correctly? (1 = Not confident, 7 = Very confident)
          </p>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Confidence Level</span>
              <span className="text-2xl font-bold text-green-600">{confidence}</span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Not Confident</span>
              <span>Neutral</span>
              <span>Very Confident</span>
            </div>
            
            {/* Visual scale */}
            <div className="flex justify-between mt-4">
              {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setConfidence(val)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    confidence === val
                      ? 'bg-green-500 border-green-600 text-white scale-110'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-green-400'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          >
            Submit Survey
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;

