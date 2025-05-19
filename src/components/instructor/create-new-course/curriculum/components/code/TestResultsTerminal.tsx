
import React, { useState } from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';

// Type definitions for demo
type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

const TestResultsTerminal = () => {
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ success: boolean; results: TestResult[] } | null>(null);

  // Mock test runner
  const runTests = (): Promise<{ success: boolean; results: TestResult[] }> => {
    return new Promise((resolve) => {
      // Simulate test execution delay
      setTimeout(() => {
        // Randomly determine if tests pass or fail
        const passTest = Math.random() > 0.5; // 50% chance of passing
        
        if (passTest) {
          resolve({
            success: true,
            results: [
              { name: 'testExercise()', passed: true }
            ]
          });
        } else {
          resolve({
            success: false,
            results: [
              { 
                name: 'testExercise()', 
                passed: false, 
                error: 'Expected result to be true but got false'
              }
            ]
          });
        }
      }, 1000);
    });
  };

  // Handle running tests
  const handleRunTests = async () => {
    setIsRunningTests(true);
    setShowTerminal(true);
    setTestResults(null);

    try {
      const results = await runTests();
      setTestResults(results);
    } catch (error) {
      setTestResults({
        success: false,
        results: [{ name: 'Error', passed: false, error: 'Failed to run tests' }]
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="p-4 flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-6">Terminal Slide-Up Demo</h2>
          <button 
            className="bg-white hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center mx-auto"
            onClick={handleRunTests}
            disabled={isRunningTests}
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunningTests ? 'Running...' : 'Run tests'}
          </button>
          <p className="mt-4 text-gray-400">
            Click the button to run tests and see the terminal slide up
          </p>
        </div>
      </div>
      
      {/* Terminal panel */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 transform transition-transform duration-300 ${
          showTerminal ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '50vh', overflowY: 'auto' }}
      >
        {/* Terminal header */}
        <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="font-medium">Result</div>
            {testResults && (
              <div className={`px-2 py-1 rounded text-xs ${testResults.success ? 'bg-green-700' : 'bg-red-700'}`}>
                {testResults.success ? 'Success' : 'Failed'}
              </div>
            )}
          </div>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={() => setShowTerminal(!showTerminal)}
          >
            {showTerminal ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Terminal content */}
        <div className="p-4">
          {/* Test results */}
          {testResults ? (
            <div className="flex">
              {/* Left panel - Test cases summary */}
              <div className="w-64 border-r border-gray-700 pr-4">
                <h3 className="font-medium mb-2">Test Cases</h3>
                <div className="text-sm mb-4">
                  Failed: {testResults.results.filter(r => !r.passed).length}, 
                  Passed: {testResults.results.filter(r => r.passed).length} of {testResults.results.length} tests
                </div>
                
                {/* List of test cases */}
                <div className="space-y-1">
                  {testResults.results.map((result, index) => (
                    <div 
                      key={index}
                      className={`flex items-center p-2 rounded ${result.passed ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'}`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${result.passed ? 'bg-green-600' : 'bg-red-600'}`}>
                        {result.passed ? '✓' : '✕'}
                      </div>
                      <div className="text-sm">{result.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right panel - Test result details */}
              <div className="flex-1 pl-4">
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="font-medium">Test result</h3>
                </div>
                
                {testResults.results.map((result, index) => (
                  <div key={index} className="mb-4">
                    <div className={`flex items-center mb-2 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {result.passed ? (
                        '✓ Your code passed this test'
                      ) : (
                        '✕ Test failed'
                      )}
                    </div>
                    
                    {!result.passed && result.error && (
                      <div className="bg-red-900 bg-opacity-20 p-3 rounded text-sm font-mono">
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : isRunningTests ? (
            <div className="text-gray-400">Running tests...</div>
          ) : (
            <div className="text-gray-400">Run tests to see results</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResultsTerminal;