import { editor } from "monaco-editor";
import { Language, Lecture, OptionType, PreviewType, Section } from "./types";

export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}


export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | undefined => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return undefined;
};

export interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export const isAllowedDomain = (email: string): boolean => {
  const allowedDomains = ['voltislab.com', 'academy.voltislab.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.includes(domain);
};

export enum CourseLevelEnum {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  ALL_LEVELS = "ALL_LEVELS"
}

export enum LanguageEnum {
  ENGLISH = "ENGLISH",
  SPANISH = "SPANISH",
  FRENCH = "FRENCH",
  GERMAN = "GERMAN",
  ITALIAN = "ITALIAN",
  PORTUGUESE = "PORTUGUESE",
  CHINESE = "CHINESE",
  JAPANESE = "JAPANESE",
  RUSSIAN = "RUSSIAN",
  ARABIC = "ARABIC",
  HINDI = "HINDI",
  BENGALI = "BENGALI",
  URDU = "URDU",
  KOREAN = "KOREAN",
  TURKISH = "TURKISH",
  SWEDISH = "SWEDISH",
  NORWEGIAN = "NORWEGIAN",
  DUTCH = "DUTCH",
  POLISH = "POLISH",
  SWAHILI = "SWAHILI",
  INDONESIAN = "INDONESIAN"
}

export enum DurationUnitEnum {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH"
}

// Course level options
export const COURSE_LEVELS: OptionType[] = [
  { value: CourseLevelEnum.BEGINNER, label: "Beginner" },
  { value: CourseLevelEnum.INTERMEDIATE, label: "Intermediate" },
  { value: CourseLevelEnum.ADVANCED, label: "Advanced" },
  { value: CourseLevelEnum.ALL_LEVELS, label: "All Levels" }
];

// Language options
export const LANGUAGES: OptionType[] = [
  { value: LanguageEnum.ENGLISH, label: "English" },
  { value: LanguageEnum.SPANISH, label: "Spanish" },
  { value: LanguageEnum.FRENCH, label: "French" },
  { value: LanguageEnum.GERMAN, label: "German" },
  { value: LanguageEnum.ITALIAN, label: "Italian" },
  { value: LanguageEnum.PORTUGUESE, label: "Portuguese" },
  { value: LanguageEnum.CHINESE, label: "Chinese" },
  { value: LanguageEnum.JAPANESE, label: "Japanese" },
  { value: LanguageEnum.RUSSIAN, label: "Russian" },
  { value: LanguageEnum.ARABIC, label: "Arabic" },
  { value: LanguageEnum.HINDI, label: "Hindi" },
  { value: LanguageEnum.BENGALI, label: "Bengali" },
  { value: LanguageEnum.URDU, label: "Urdu" },
  { value: LanguageEnum.KOREAN, label: "Korean" },
  { value: LanguageEnum.TURKISH, label: "Turkish" },
  { value: LanguageEnum.SWEDISH, label: "Swedish" },
  { value: LanguageEnum.NORWEGIAN, label: "Norwegian" },
  { value: LanguageEnum.DUTCH, label: "Dutch" },
  { value: LanguageEnum.POLISH, label: "Polish" },
  { value: LanguageEnum.SWAHILI, label: "Swahili" },
  { value: LanguageEnum.INDONESIAN, label: "Indonesian" }
];

export const DURATION_UNITS: OptionType[] = [
  { value: DurationUnitEnum.DAY, label: "Day" },
  { value: DurationUnitEnum.WEEK, label: "Week" },
  { value: DurationUnitEnum.MONTH, label: "Month" }
];

export const CONTENT_OPTIONS: string[] = [
  "Video",
  "Attach File",
  "Captions",
  "Description",
  "Lecture Notes",
];

export const hasContent = (lecture: Lecture): boolean => {
    return (
      lecture.videos.length > 0 ||
      lecture.attachedFiles.length > 0 ||
      !!lecture.description.trim() ||
      !!lecture.captions.trim() ||
      !!lecture.lectureNotes.trim()
    );
  };

  export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
  };
  
  export function contentItemTypeToPreviewType(contentType: string | undefined): PreviewType {
  switch (contentType) {
    case 'video':
    case 'article':
    case 'quiz':
    case 'assignment':
    case 'coding-exercise':
    case 'practice':
    case 'role-play':
    case 'video-slide':
      return contentType as PreviewType;
    default:
      return 'video'; // Default to video for unknown types
  }
}


export const exactDarkTheme = {
      base: 'vs-dark' as editor.BuiltinTheme, // Type casting to the correct enum
      inherit: false,
      rules: [
        { token: 'comment', foreground: '608b4e', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c586c0' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'identifier', foreground: 'd4d4d4' },
        { token: 'type', foreground: '569cd6' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'delimiter', foreground: 'd4d4d4' },
        { token: 'tag', foreground: '569cd6' },
        { token: 'attribute.name', foreground: '9cdcfe' },
        { token: 'attribute.value', foreground: 'ce9178' },
        { token: 'operator', foreground: 'd4d4d4' },
        { token: 'metatag', foreground: 'dd6a6f' },
        { token: 'function', foreground: 'dcdcaa' },
        { token: 'variable', foreground: '9cdcfe' },
        { token: 'variable.predefined', foreground: '569cd6' },
        { token: 'class', foreground: '4ec9b0' },
        { token: 'interface', foreground: '4ec9b0' },
        { token: 'constant', foreground: '569cd6' },
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#d4d4d4',
        'editorCursor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#1a1a1a',
        
        // Line number gutter - fixed to match the screenshot
        'editorGutter.background': '#111111',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6',
        'editorGutter.border': '#1a1a1a',
        
        // Selection and highlighting
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editor.selectionHighlightBackground': '#add6ff26',
        'editor.findMatchBackground': '#515c6a',
        'editor.findMatchHighlightBackground': '#3a3d4166',
        
        // Code structure
        'editorIndentGuide.background': '#404040',
        'editorIndentGuide.activeBackground': '#707070',
        'editorBracketMatch.background': '#0d3a58',
        'editorBracketMatch.border': '#216e9a',
        
        // Scrollbar
        'scrollbar.shadow': '#000000',
        'scrollbarSlider.background': '#79797966',
        'scrollbarSlider.hoverBackground': '#646464b3',
        'scrollbarSlider.activeBackground': '#bfbfbf66',
        
        // UI elements
        'button.background': '#0e639c',
        'dropdown.background': '#1e1e1e',
        'dropdown.border': '#1e1e1e',
        'panel.background': '#1e1e1e',
        'panel.border': '#303030',
        
        'tab.activeBackground': '#0d0d0d',
        'tab.inactiveBackground': '#252526',
        'tab.activeForeground': '#ffffff',
        'tab.inactiveForeground': '#969696',
        'tab.border': '#252526',
        'titleBar.activeBackground': '#333333',
        'titleBar.activeForeground': '#cccccc',
        
        'badge.background': '#4d4d4d',
        'badge.foreground': '#ffffff',
        'editorWidget.background': '#252526',
        'editorWidget.border': '#454545',
        'input.background': '#3c3c3c',
        'input.border': '#5f5f5f',
      }
    };

    export const runJavaScriptTests = (code: string, tests: string) => {
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


    // Updated default test templates
    export const getDefaultTests = (languageId: string) => {
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
    
        case 'kotlin':
          return `import org.junit.jupiter.api.Test
    import org.junit.jupiter.api.Assertions.assertEquals
    
    class Evaluate {
        @Test
        fun testExercise() {
            val exercise = Exercise()
            val numbers = listOf(1, 2, 3, 4, 5)
            assertEquals(15, exercise.calculateSum(numbers))
        }
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

      export const languages: Language[] = [
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

      // Updated default code templates by language
      export const getDefaultCode = (languageId: string) => {
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
            return `import React from 'react';
      
      // don't change the Component name "App"
      export default class App extends React.Component {
        render() {
          // TODO: implement component
        }
      }`;
          
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
      
          case 'kotlin':
            return `class Exercise {
          /**
           * Calculate the sum of a list of integers
           * @param numbers List of integers
           * @return The sum of all numbers
           */
          fun calculateSum(numbers: List<Int>): Int {
              return numbers.sum()
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


      // Helper function to map language IDs to Monaco language IDs
      export const getMonacoLanguage = (languageId: string): string => {
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