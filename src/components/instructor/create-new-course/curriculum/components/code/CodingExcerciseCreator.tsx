import React, { useState, useEffect, useRef } from 'react';
import { Code, AlignJustify, ChevronLeft, ChevronDown, AlertTriangle, Eye, ExternalLink, Play } from "lucide-react";
import { Lecture, ContentItemType } from '@/lib/types';
import Editor, { useMonaco, Monaco } from '@monaco-editor/react';

// Type definitions
type Language = {
  id: string;
  name: string;
  deprecated?: boolean;
  hasVersions?: boolean;
  versions?: string[];
  additionalInfo?: string;
  isNew?: boolean;
};

type Tab = 'planExercise' | 'authorSolution' | 'guideLearners';
type View = 'languageSelection' | 'exercisePlanning' | 'codeEditor';

interface CodingExerciseCreatorProps {
  lectureId: string | null;
  onClose: () => void;
  onSave: (updatedLecture: Partial<Lecture>) => void;
  initialData?: Lecture;
}

// Helper function to map language IDs to Monaco language IDs
const getMonacoLanguage = (languageId: string): string => {
  // Map language IDs to Monaco editor language identifiers
  switch (languageId) {
    case 'python':
      return 'python';
    case 'javascript':
      return 'javascript';
    case 'react':
      return 'javascript'; // We'll configure for JSX separately
    case 'typescript':
      return 'typescript';
    case 'java':
      return 'java';
    case 'csharp':
      return 'csharp';
    case 'cpp':
      return 'cpp';
    case 'ruby':
      return 'ruby';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'sql':
    case 'sqlite':
      return 'sql';
    case 'swift':
      return 'swift';
    case 'kotlin':
      return 'kotlin';
    case 'r':
      return 'r';
    case 'rust':
      return 'rust';
    case 'web-dev':
      return 'javascript';
    default:
      return 'javascript';
  }
};

// Updated default code templates by language
const getDefaultCode = (languageId: string) => {
  switch (languageId) {
    case 'python':
      return `def detect_faces(image_path):
    """
    Detects faces in an image and returns the result.
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        The processed image with detected faces
    """
    # Your implementation here
    return "Face detected"`;
    
    case 'react':
      return `import React, { useState } from 'react';

function App() {
  // Example state
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>Hello React</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default App;`;
    
    case 'javascript':
      return `/**
 * Example JavaScript function
 * @param {Array} items - The array of items to process
 * @returns {number} The calculated total
 */
function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

// Example usage
const cart = [
  { name: 'Product A', price: 10, quantity: 2 },
  { name: 'Product B', price: 15, quantity: 1 }
];

console.log(calculateTotal(cart));`;
    
    case 'java':
      return `public class Solution {
    /**
     * Main method to demonstrate functionality
     */
    public static void main(String[] args) {
        System.out.println("Hello Java!");
        
        // Example usage
        int result = calculateSum(new int[]{1, 2, 3, 4, 5});
        System.out.println("Sum: " + result);
    }
    
    /**
     * Calculate the sum of an array of integers
     * @param numbers Array of integers
     * @return The sum of all numbers
     */
    public static int calculateSum(int[] numbers) {
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        return sum;
    }
}`;

    case 'csharp':
      return `using System;

public class Solution 
{
    /// <summary>
    /// Main method to demonstrate functionality
    /// </summary>
    public static void Main()
    {
        Console.WriteLine("Hello C#!");
        
        // Example usage
        int[] numbers = {1, 2, 3, 4, 5};
        int result = CalculateSum(numbers);
        Console.WriteLine($"Sum: {result}");
    }
    
    /// <summary>
    /// Calculate the sum of an array of integers
    /// </summary>
    /// <param name="numbers">Array of integers</param>
    /// <returns>The sum of all numbers</returns>
    public static int CalculateSum(int[] numbers)
    {
        int sum = 0;
        foreach (int num in numbers)
        {
            sum += num;
        }
        return sum;
    }
}`;

    case 'html':
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My HTML Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            border: 1px solid #ccc;
            padding: 20px;
            border-radius: 8px;
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello HTML!</h1>
        <p>This is a sample HTML document.</p>
        <button id="clickMe">Click Me</button>
    </div>
    
    <script>
        document.getElementById('clickMe').addEventListener('click', function() {
            alert('Button clicked!');
        });
    </script>
</body>
</html>`;

    case 'web-dev':
      return `// Modern JavaScript/Web Development Example
import './styles.css';

// DOM Elements
const app = document.getElementById('app');
const button = document.createElement('button');
const counter = document.createElement('p');

// Initialize state
let count = 0;

// Update UI
function render() {
  counter.textContent = \`Count: \${count}\`;
}

// Event handlers
button.textContent = 'Increment';
button.addEventListener('click', () => {
  count++;
  render();
});

// Build UI
app.appendChild(counter);
app.appendChild(button);

// Initial render
render();`;

    default:
      return `// Write your solution for ${languageId} here

function example() {
  console.log("This is a sample function");
  return "Hello, world!";
}`;
  }
};

// Updated default test templates
const getDefaultTests = (languageId: string) => {
  switch (languageId) {
    case 'python':
      return `import unittest
from solution import detect_faces

class TestFaceDetection(unittest.TestCase):
    def test_detect_faces_returns_result(self):
        # Test that the function returns a result
        result = detect_faces("example.jpg")
        self.assertIsNotNone(result)
        
    # Add more test cases here
    
if __name__ == '__main__':
    unittest.main()`;
    
    case 'javascript':
      return `// Test for the calculateTotal function
describe('calculateTotal', () => {
  test('should calculate the total correctly', () => {
    const testCart = [
      { name: 'Test Product', price: 10, quantity: 2 },
      { name: 'Another Product', price: 5, quantity: 3 }
    ];
    
    // 10 * 2 + 5 * 3 = 20 + 15 = 35
    expect(calculateTotal(testCart)).toBe(35);
  });
  
  test('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
  
  // Add more test cases here
});`;
    
    case 'react':
      return `import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  test('renders hello message', () => {
    render(<App />);
    const headingElement = screen.getByText(/hello react/i);
    expect(headingElement).toBeInTheDocument();
  });
  
  test('counter increments when button is clicked', () => {
    render(<App />);
    
    // Initial count should be 0
    expect(screen.getByText(/you clicked 0 times/i)).toBeInTheDocument();
    
    // Click the button
    fireEvent.click(screen.getByText(/click me/i));
    
    // Count should increment to 1
    expect(screen.getByText(/you clicked 1 times/i)).toBeInTheDocument();
  });
});`;
    
    case 'java':
      return `import org.junit.Test;
import static org.junit.Assert.*;

public class SolutionTest {
    @Test
    public void testCalculateSum() {
        // Test with normal array
        int[] numbers = {1, 2, 3, 4, 5};
        assertEquals(15, Solution.calculateSum(numbers));
        
        // Test with empty array
        int[] emptyArray = {};
        assertEquals(0, Solution.calculateSum(emptyArray));
        
        // Test with negative numbers
        int[] negativeNumbers = {-1, -2, -3};
        assertEquals(-6, Solution.calculateSum(negativeNumbers));
    }
    
    // Add more test methods here
}`;

    case 'csharp':
      return `using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass]
public class SolutionTests
{
    [TestMethod]
    public void CalculateSum_WithNormalArray_ReturnsCorrectSum()
    {
        // Arrange
        int[] numbers = {1, 2, 3, 4, 5};
        
        // Act
        int result = Solution.CalculateSum(numbers);
        
        // Assert
        Assert.AreEqual(15, result);
    }
    
    [TestMethod]
    public void CalculateSum_WithEmptyArray_ReturnsZero()
    {
        // Arrange
        int[] numbers = new int[0];
        
        // Act
        int result = Solution.CalculateSum(numbers);
        
        // Assert
        Assert.AreEqual(0, result);
    }
    
    // Add more test methods here
}`;

    default:
      return `// Write tests for your ${languageId} solution here

describe('Example tests', () => {
  test('should pass a basic test', () => {
    // Arrange
    const expected = 'Hello, world!';
    
    // Act
    const result = example();
    
    // Assert
    expect(result).toBe(expected);
  });
  
  // Add more test cases here
});`;
  }
};

// Test runner function for JavaScript
const runJavaScriptTests = (code: string, tests: string) => {
  try {
    // Create a safe evaluation context with limited access
    const sandbox: any = {
      console: {
        log: console.log.bind(console),
        error: console.error.bind(console),
        warn: console.warn.bind(console)
      },
      setTimeout,
      clearTimeout,
      results: [] as any[]
    };

    // Prepare testing environment
    const testFramework = `
      // Simple test framework
      function describe(desc, fn) { fn(); }
      function it(name, fn) { test(name, fn); }
      function test(name, fn) {
        try {
          fn();
          results.push({ name, passed: true });
        } catch (e) {
          results.push({ name, passed: false, error: e.message });
        }
      }
      function expect(actual) {
        return {
          toBe: (expected) => {
            if (actual !== expected) throw new Error(\`Expected \${expected} but got \${actual}\`);
          },
          toEqual: (expected) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) 
              throw new Error(\`Expected \${JSON.stringify(expected)} but got \${JSON.stringify(actual)}\`);
          },
          toBeTruthy: () => {
            if (!actual) throw new Error(\`Expected value to be truthy\`);
          },
          toBeFalsy: () => {
            if (actual) throw new Error(\`Expected value to be falsy\`);
          },
          toContain: (item) => {
            if (!actual.includes(item)) throw new Error(\`Expected \${actual} to contain \${item}\`);
          },
          toThrow: (expected) => {
            let threw = false;
            let error = null;
            try { actual(); } 
            catch (e) { threw = true; error = e; }
            if (!threw) throw new Error(\`Expected function to throw\`);
            if (expected && !error.message.includes(expected)) 
              throw new Error(\`Expected error message to include \${expected}\`);
          }
        };
      }
    `;

    // Build the execution script
    const executeScript = `
      ${code}
      ${testFramework}
      ${tests}
      return results;
    `;

    // Execute in a controlled environment using Function constructor
    const testRunner = new Function(...Object.keys(sandbox), executeScript);
    const testResults = testRunner(...Object.values(sandbox));

    return {
      success: testResults.every((r: any) => r.passed),
      results: testResults
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
      results: []
    };
  }
};

// Monaco Editor Component
const MonacoEditorComponent = ({ 
  language, 
  value, 
  onChange, 
  readOnly = false,
  isReact = false // New prop to handle React configuration
}: { 
  language: string, 
  value: string, 
  onChange: (value: string) => void,
  readOnly?: boolean,
  isReact?: boolean
}) => {
  const monaco = useMonaco();
  
  useEffect(() => {
    if (monaco) {
      // You can configure Monaco here if needed
      // For example, adding custom themes, keybindings, etc.
      
      // Example: Setting up a custom theme
      monaco.editor.defineTheme('myDarkTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.foreground': '#d4d4d4',
          'editor.lineHighlightBackground': '#2a2a2a',
          'editorLineNumber.foreground': '#858585',
          'editor.selectionBackground': '#264f78',
          'editorCursor.foreground': '#d4d4d4'
        }
      });
      
      monaco.editor.setTheme('myDarkTheme');
      
      // Configure for React/JSX if needed
      if (isReact) {
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          jsx: monaco.languages.typescript.JsxEmit.React,
          jsxFactory: 'React.createElement',
          reactNamespace: 'React',
          allowNonTsExtensions: true,
          allowJs: true,
          target: monaco.languages.typescript.ScriptTarget.ES2020
        });
      }
    }
  }, [monaco, isReact]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        readOnly: readOnly,
        tabSize: 2,
        lineNumbers: 'on',
        folding: true,
        padding: { top: 10 }
      }}
    />
  );
};

// Main Component
const CodingExerciseCreatorWithMonaco: React.FC<CodingExerciseCreatorProps> = ({
  lectureId,
  onClose,
  onSave,
  initialData
}) => {
  // State for modal and views
  const [view, setView] = useState<View>('languageSelection');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('planExercise');
  const [exerciseTitle, setExerciseTitle] = useState<string>(
    initialData?.name || "Write a python script to implement face recognition."
  );
  const [learningObjective, setLearningObjective] = useState<string>("");
  const [showInstructionPopup, setShowInstructionPopup] = useState(true);
  const [currentPopupStep, setCurrentPopupStep] = useState(1);

  // Code and test state
  const [solutionCode, setSolutionCode] = useState<string>('// Write your solution code here');
  const [testCode, setTestCode] = useState<string>('// Write your test code here');
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Sample languages
  const languages: Language[] = [
    { id: 'python', name: 'Python', hasVersions: false },
    { id: 'java', name: 'Java', hasVersions: false },
    { id: 'javascript', name: 'JavaScript', deprecated: true, hasVersions: true, versions: ['ES6'] },
    { id: 'react', name: 'React', hasVersions: true, versions: ['18'], additionalInfo: 'with React Testing Library' },
    { id: 'kotlin', name: 'Kotlin', hasVersions: false },
    { id: 'csharp', name: 'C#', hasVersions: false },
    { id: 'html', name: 'HTML', deprecated: true, hasVersions: false },
    { id: 'r', name: 'R', hasVersions: false },
    { id: 'ruby', name: 'Ruby', hasVersions: false },
    { id: 'python-ds', name: 'Python Data Science', hasVersions: false },
    { id: 'sqlite', name: 'SQLite 3', hasVersions: false },
    { id: 'altsql', name: 'AltSQL', hasVersions: false },
    { id: 'swift', name: 'Swift', hasVersions: false },
    { id: 'web-dev', name: 'Web Development', isNew: true, hasVersions: false },
  ];

  useEffect(() => {
    if (selectedLanguage && selectedLanguage.hasVersions) {
      setSelectedVersion(selectedLanguage.versions?.[0] || '');
    } else {
      setSelectedVersion('');
    }
  }, [selectedLanguage]);

  // Initialize selected language from initialData if available
  useEffect(() => {
    if (initialData?.codeLanguage) {
      const matchedLanguage = languages.find(lang => lang.id === initialData.codeLanguage);
      if (matchedLanguage) {
        setSelectedLanguage(matchedLanguage);
        if (initialData.version) {
          setSelectedVersion(initialData.version);
        }
      }
    }
  }, [initialData]);

  // Improved version: Update code templates when language changes
  useEffect(() => {
    if (selectedLanguage) {
      // Set appropriate code templates based on the selected language
      setSolutionCode(getDefaultCode(selectedLanguage.id));
      setTestCode(getDefaultTests(selectedLanguage.id));
      
      // Special handling for React will be managed in the MonacoEditorComponent
    }
  }, [selectedLanguage]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    setShowVersionDropdown(false);
  };

  const handleStartCreating = () => {
    setView('exercisePlanning');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'authorSolution') {
      setView('codeEditor');
    } else {
      setView('exercisePlanning');
    }
  };

  const handleBackToLanguageSelection = () => {
    onClose(); // We want to go back to the list view
  };

  const handleSave = () => {
    if (lectureId) {
      onSave({
        id: lectureId,
        name: exerciseTitle,
        codeLanguage: selectedLanguage?.id,
        version: selectedVersion,
        description: initialData?.description || "",
        code: solutionCode,
        testCases: [{ id: '1', input: '', expectedOutput: testCode }]
      });
    }
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setTestResults(null);

    try {
      if (selectedLanguage?.id === 'javascript' || selectedLanguage?.id === 'react') {
        const results = runJavaScriptTests(solutionCode, testCode);
        setTestResults(results);
      } else {
        // For other languages, we'd need a backend service
        // Here we'll just show a message
        setTestResults({
          success: false,
          message: `Running tests for ${selectedLanguage?.name || 'this language'} requires a backend service. This is a mock implementation.`,
          results: []
        });
      }
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred while running tests',
        results: []
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const dismissPopup = () => {
    if (currentPopupStep < 4) {
      setCurrentPopupStep(prev => prev + 1);
    } else {
      setShowInstructionPopup(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button 
            className="text-purple-600 flex items-center mr-4"
            onClick={onClose}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">Back to curriculum</span>
          </button>
          <span className="text-gray-700">{exerciseTitle}</span>
        </div>
        <div className="flex space-x-2">
          <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-md flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
          <button 
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {view === 'languageSelection' && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
              <h2 className="text-xl font-medium mb-4">Select language to create coding exercise</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Coding language</label>
                <div className="relative">
                  <button
                    className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  >
                    {selectedLanguage ? (
                      <div className="flex items-center">
                        <span>{selectedLanguage.name}</span>
                        {selectedLanguage.deprecated && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">Deprecated</span>
                        )}
                        {selectedLanguage.isNew && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">New</span>
                        )}
                      </div>
                    ) : (
                      <span>Select</span>
                    )}
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {showLanguageDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {languages.map((language) => (
                        <button
                          key={language.id}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center justify-between"
                          onClick={() => handleLanguageSelect(language)}
                        >
                          <span>{language.name}</span>
                          {language.deprecated && (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">Deprecated</span>
                          )}
                          {language.isNew && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">New</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {selectedLanguage && selectedLanguage.hasVersions && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Version</label>
                  <div className="relative">
                    <button
                      className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                    >
                      {selectedVersion || 'Select Version'}
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {showVersionDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                        {selectedLanguage.versions?.map((version) => (
                          <button
                            key={version}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                            onClick={() => handleVersionSelect(version)}
                          >
                            {version}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedLanguage.additionalInfo && (
                    <p className="text-sm text-gray-500 mt-1">with {selectedLanguage.additionalInfo}</p>
                  )}
                </div>
              )}
              
              {selectedLanguage && selectedLanguage.deprecated && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">You've selected a deprecated language</p>
                    <p className="text-sm text-gray-600 mt-1">
                      We have introduced a new "Web Development" language option that supports JavaScript coding exercises with up-to-date libraries. For the best experience please select "Web Development" from the language dropdown.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-6 space-x-2">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${selectedLanguage ? 'bg-purple-600 text-white' : 'bg-purple-300 text-white cursor-not-allowed'}`}
                  disabled={!selectedLanguage}
                  onClick={handleStartCreating}
                >
                  Start creating
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'exercisePlanning' && (
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-medium mb-4">Plan exercise</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <p className="text-gray-700 mb-2">
                A <span className="font-medium">coding exercise</span> allows your learners to practice a targeted piece of real work and get immediate feedback. We recommend you follow these steps: Plan the exercise, define the solution, and guide learners. This will ensure you frame the problem and provide the needed guidance with the solution in mind.
              </p>
              <a href="#" className="text-purple-600 text-sm hover:underline">Learn more about creating coding exercises</a>
              
              <div className="mt-6">
                <label className="block text-gray-700 mb-2 font-medium">Exercise title</label>
                <input
                  type="text"
                  value={exerciseTitle}
                  onChange={(e) => setExerciseTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <label className="block text-gray-700 font-medium">Learning objective</label>
                  <div className="ml-1 text-gray-400 bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center text-xs">?</div>
                </div>
                <div className="relative">
                  <textarea
                    value={learningObjective}
                    onChange={(e) => setLearningObjective(e.target.value)}
                    placeholder="Provide a learning objective for this coding exercise."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={4}
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {learningObjective.length}/200
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-right mt-1">Optional</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start">
              <div className="flex-1">
                <p className="text-gray-700">
                  After planning your exercise, you can move to the next step or toggle between any of these options.
                </p>
              </div>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md ml-4"
                onClick={() => handleTabChange('authorSolution')}
              >
                Get started
              </button>
            </div>
          </div>
        )}

        {view === 'codeEditor' && (
          <div className="flex-1 flex flex-col">
            <div className="flex border-b border-gray-700 bg-gray-800 text-white">
              <div className="w-1/2 p-2 flex items-center">
                <span className="mr-2">Solution</span>
                <div className="bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">?</div>
                <button className="ml-2 px-2 py-1 bg-gray-700 rounded text-xs">View examples</button>
              </div>
              <div className="w-1/2 p-2 flex items-center border-l border-gray-700">
                <span className="mr-2">Evaluation</span>
                <div className="bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">?</div>
                <button className="ml-auto px-2 py-1 bg-gray-700 rounded text-xs">Show preview window</button>
              </div>
            </div>
            
            {/* Fix for the collapsed editor container */}
            <div className="flex-1 flex" style={{ height: '70vh', minHeight: '500px' }}>
              <div className="w-1/2 bg-gray-900 text-gray-200 overflow-auto" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1, height: '100%' }}>
                  <MonacoEditorComponent 
                    language={getMonacoLanguage(selectedLanguage?.id || 'javascript')} 
                    value={solutionCode}
                    onChange={setSolutionCode}
                    isReact={selectedLanguage?.id === 'react'}
                  />
                </div>
              </div>
              
              <div className="w-1/2 bg-gray-900 text-gray-200 overflow-auto border-l border-gray-700" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1, height: '100%' }}>
                  <MonacoEditorComponent 
                    language={getMonacoLanguage(selectedLanguage?.id || 'javascript')} 
                    value={testCode}
                    onChange={setTestCode}
                    isReact={selectedLanguage?.id === 'react'}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 p-3 border-t border-gray-700 flex items-center justify-between">
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
                onClick={handleRunTests}
                disabled={isRunningTests}
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunningTests ? 'Running...' : 'Run tests'}
              </button>
              
              {testResults && (
                <div className={`px-4 py-2 rounded-md ${testResults.success ? 'bg-green-700' : 'bg-red-700'} text-white`}>
                  {testResults.success ? 'All tests passed!' : 'Tests failed'}
                </div>
              )}
            </div>
            
            {/* Test results panel */}
            {testResults && (
              <div className="bg-gray-800 text-white p-4 border-t border-gray-700">
                <h3 className="font-medium mb-2">Test Results</h3>
                
                {testResults.message && (
                  <div className="mb-2 text-yellow-300">{testResults.message}</div>
                )}
                
                {testResults.error && (
                  <div className="mb-2 text-red-400">Error: {testResults.error}</div>
                )}
                
                {testResults.results && testResults.results.length > 0 ? (
                  <div className="space-y-2">
                    {testResults.results.map((result: any, index: number) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded ${result.passed ? 'bg-green-900' : 'bg-red-900'}`}
                      >
                        <div className="font-medium">{result.name}</div>
                        {!result.passed && result.error && (
                          <div className="text-red-300 text-sm mt-1">{result.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No test results to display</div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Instruction popup */}
        {showInstructionPopup && view === 'codeEditor' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <div className="flex items-start mb-4">
                <div className="flex-1">
                  {currentPopupStep === 1 && (
                    <p className="text-gray-700">
                      Solution files verify the provided evaluation file (unit test) is correct.
                      Learners are expected to write a similar solution (not necessarily the same) for
                      provided instructions at the "Guide learners" step.
                    </p>
                  )}
                  {currentPopupStep === 2 && (
                    <p className="text-gray-700">
                      Define your solution code that satisfies the tests. This will be used to verify
                      that your exercise is correctly structured.
                    </p>
                  )}
                  {currentPopupStep === 3 && (
                    <p className="text-gray-700">
                      Define your tests that will evaluate student submissions. Make sure to test all
                      key aspects of the expected solution.
                    </p>
                  )}
                  {currentPopupStep === 4 && (
                    <p className="text-gray-700">
                      Click "Save" frequently to preserve your work. When you're ready to make this
                      exercise available to students, click "Publish".
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-sm">{currentPopupStep}/4</div>
                <div className="flex space-x-2">
                  {currentPopupStep < 4 ? (
                    <button onClick={dismissPopup} className="px-4 py-1 bg-purple-100 text-purple-600 rounded-md">
                      Next
                    </button>
                  ) : (
                    <button onClick={dismissPopup} className="px-4 py-1 bg-purple-600 text-white rounded-md">
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="border-t border-gray-200 bg-white">
        <div className="flex relative">
          <button
            className={`flex-1 py-4 text-center relative ${activeTab === 'planExercise' ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
            onClick={() => handleTabChange('planExercise')}
          >
            Plan Exercise
            {activeTab === 'planExercise' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600"></div>}
          </button>
          <button
            className={`flex-1 py-4 text-center relative ${activeTab === 'authorSolution' ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
            onClick={() => handleTabChange('authorSolution')}
          >
            Author solution
            {activeTab === 'authorSolution' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600"></div>}
            {activeTab === 'planExercise' && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg z-10 w-48 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-mb-2 after:border-8 after:border-t-white after:border-r-transparent after:border-b-transparent after:border-l-transparent after:transform after:-translate-x-1/2">
                <div className="text-center text-sm text-gray-700">
                  Go to Author solution
                </div>
              </div>
            )}
          </button>
          <button
            className={`flex-1 py-4 text-center relative ${activeTab === 'guideLearners' ? 'text-purple-600 font-medium' : 'text-gray-600'}`}
            onClick={() => handleTabChange('guideLearners')}
          >
            Guide learners
            {activeTab === 'guideLearners' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600"></div>}
          </button>
        </div>
      </div>

      {/* Next Button (bottom right) */}
      <div className="fixed bottom-4 right-4">
        <button 
          className="bg-purple-600 text-white px-6 py-2 rounded-md shadow-md"
          onClick={handleSave}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CodingExerciseCreatorWithMonaco;