import React, { useState, useEffect, useRef } from 'react';
import { Code, ChevronLeft, ChevronDown, ChevronUp, AlertTriangle, Eye, Plus, Info, Undo, Maximize2, Play, ChevronRight, X, MoreVertical, Copy } from "lucide-react";
import { Lecture, ContentItemType, Language } from '@/lib/types';
import Editor, { useMonaco } from '@monaco-editor/react';
import { exactDarkTheme, getDefaultCode, getDefaultTests, getMonacoLanguage, languages, runJavaScriptTests } from '@/lib/utils';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type Tab = 'planExercise' | 'authorSolution' | 'guideLearners';
type View = 'languageSelection' | 'exercisePlanning' | 'codeEditor' | 'guideLearners';
type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

type FileType = {
  id: string;
  name: string;
  content: string;
  language: string;
  isActive?: boolean;
  isDefault?: boolean;
};

interface CodingExerciseCreatorProps {
  lectureId: string | null;
  onClose: () => void;
  onSave: (updatedLecture: Partial<Lecture>) => void;
  initialData?: Lecture;
}

// Reusable Rich Text Editor Component
const RichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullHeight?: boolean;
}> = ({ value, onChange, placeholder, fullHeight = false }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['code-block']
    ]
  };

  return (
    <div className={`rich-text-editor ${fullHeight ? 'h-full flex flex-col' : ''}`}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        theme="snow"
        className={fullHeight ? 'flex-grow' : ''}
        style={fullHeight ? { height: 'calc(100% - 42px)', display: 'flex', flexDirection: 'column' } : {}}
      />
    </div>
  );
};

// Instruction Tabs Component
const InstructionTabs: React.FC<{
  defaultInstructions: string;
  defaultHints: string;
  defaultSolutionExplanation: string;
  defaultRelatedLectures?: string[];
  onInstructionsChange: (value: string) => void;
  onHintsChange: (value: string) => void;
  onSolutionExplanationChange: (value: string) => void;
  onRelatedLecturesChange?: (lectures: string[]) => void;
  solutionCode: string;
}> = ({
  defaultInstructions,
  defaultHints,
  defaultSolutionExplanation,
  defaultRelatedLectures = [],
  onInstructionsChange,
  onHintsChange,
  onSolutionExplanationChange,
  onRelatedLecturesChange,
  solutionCode
}) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'relatedLectures' | 'hints' | 'solution'>('instructions');
  const [selectedLectures, setSelectedLectures] = useState<string[]>(defaultRelatedLectures);

  const handleLectureSelection = (lectureName: string) => {
    const newSelection = selectedLectures.includes(lectureName)
      ? selectedLectures.filter(l => l !== lectureName)
      : [...selectedLectures, lectureName];
    
    setSelectedLectures(newSelection);
    if (onRelatedLecturesChange) {
      onRelatedLecturesChange(newSelection);
    }
  };

  const handlePasteSolutionCode = () => {
    // Append the solution code to the current explanation
    const updatedExplanation = defaultSolutionExplanation + 
      "\n\n```javascript\n" + solutionCode + "\n```";
    onSolutionExplanationChange(updatedExplanation);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 ${activeTab === 'instructions' ? 'border-b-2 border-[#6D28D2] text-[#6D28D2] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('instructions')}
        >
          Instructions
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'relatedLectures' ? 'border-b-2 border-[#6D28D2] text-[#6D28D2] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('relatedLectures')}
        >
          Related lectures
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'hints' ? 'border-b-2 border-[#6D28D2] text-[#6D28D2] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('hints')}
        >
          Hints
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'solution' ? 'border-b-2 border-[#6D28D2] text-[#6D28D2] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('solution')}
        >
          Solution explanation
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'instructions' && (
          <div className="h-full">
            <div className="text-gray-700 mb-4">
              <p>Write clear instructions for your exercise. Guide learners on what to implement, but don't give away the solution.</p>
            </div>
            <RichTextEditor
              value={defaultInstructions}
              onChange={onInstructionsChange}
              placeholder="Write instructions here."
              fullHeight={true}
            />
          </div>
        )}

        {activeTab === 'relatedLectures' && (
          <div className="h-full">
            <div className="text-gray-700 mb-4">
              <p>Provide lectures as a resource for learners to reference as they attempt the exercise in case they need more information or are unsure where to start. You can add max. 3 related lectures.</p>
            </div>
            <div className="mb-4">
              <div className="relative">
                <select
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#6D28D2]"
                >
                  <option>Select</option>
                  <option>Introduction to React</option>
                  <option>Component Basics</option>
                  <option>React Hooks</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div className="text-sm text-gray-500 text-right mt-1">Optional</div>
            </div>
            <div className="mt-6">
              <button className="flex items-center text-[#6D28D2] text-sm">
                <Plus size={16} className="mr-1" /> Add more
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'hints' && (
          <div className="h-full">
            <div className="text-gray-700 mb-4">
              <p>Hints will be unlocked after the second failed attempt of the exercise so that learners can get more support beyond the related lectures and tests. Hints are a way to nudge learners toward the solution without telling them how to solve the problem.</p>
            </div>
            <RichTextEditor
              value={defaultHints}
              onChange={onHintsChange}
              placeholder="Write hints here."
              fullHeight={true}
            />
          </div>
        )}
        
        {activeTab === 'solution' && (
          <div className="h-full">
            <div className="text-gray-700 mb-4">
              <p>Solution explanation will be unlocked after the third fail attempt. You can paste your solution code here by adding a description of why the code is written a particular way or you can share a step-by-step solution explanation.</p>
            </div>
            <div className="flex items-center mb-2">
              <button 
                className="flex items-center text-[#6D28D2] text-sm px-2 py-1 border border-[#6D28D2] rounded hover:bg-purple-50"
                onClick={handlePasteSolutionCode}
              >
                <Copy size={14} className="mr-1" /> Paste solution code
              </button>
            </div>
            <RichTextEditor
              value={defaultSolutionExplanation}
              onChange={onSolutionExplanationChange}
              placeholder="Write a solution explanation here."
              fullHeight={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Monaco Editor Component
const MonacoEditorComponent = ({ language, value, onChange, readOnly = false, isReact = false }: { 
  language: string, 
  value: string, 
  onChange: (value: string) => void,
  readOnly?: boolean,
  isReact?: boolean
}) => {
  const monaco = useMonaco();
  
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('exactDarkTheme', exactDarkTheme);
    }
  }, [monaco]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <Editor
      height="78vh"
      language={language}
      value={value}
      onChange={handleEditorChange}
      theme="exactDarkTheme"
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
  const [showTooltip, setShowTooltip] = useState(true);
  const [exerciseTitle, setExerciseTitle] = useState<string>(
    initialData?.name || "New coding excercise"
  );
  const [learningObjective, setLearningObjective] = useState<string>("");
  const [showInstructionPopup, setShowInstructionPopup] = useState(true);
  const [currentPopupStep, setCurrentPopupStep] = useState(1);

  // Code and test state
  const [solutionCode, setSolutionCode] = useState<string>('// Write your solution code here');
  const [initialSolutionCode, setInitialSolutionCode] = useState<string>('// Write your solution code here');
  const [testCode, setTestCode] = useState<string>('// Write your test code here');
  const [initialTestCode, setInitialTestCode] = useState<string>('// Write your test code here');
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);

  // Instruction state
  const [instructions, setInstructions] = useState<string>("");
  const [hints, setHints] = useState<string>("");
  const [solutionExplanation, setSolutionExplanation] = useState<string>("");

  // New states for requested features
  const [leftPanelExpanded, setLeftPanelExpanded] = useState<boolean>(false);
  const [rightPanelExpanded, setRightPanelExpanded] = useState<boolean>(false);
  const [showSolutionInfo, setShowSolutionInfo] = useState<boolean>(false);
  const [showEvaluationInfo, setShowEvaluationInfo] = useState<boolean>(false);
  const [showFileNameModal, setShowFileNameModal] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [files, setFiles] = useState<FileType[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('main');
  const [showFileMenu, setShowFileMenu] = useState<string | null>(null);
  const [fileForRename, setFileForRename] = useState<FileType | null>(null);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<FileType | null>(null);
  
  // Preview state
  const [previewContent, setPreviewContent] = useState<string>('');

  // Handle preview toggle
  const togglePreview = () => {
    // When enabling preview, update the preview content
    if (!showPreview) {
      const activeFile = files.find(f => f.id === activeFileId);
      if (activeFile) {
        setPreviewContent(activeFile.content);
      }
    }
    setShowPreview(!showPreview);
  };

  // Handle file creation
  const handleAddFile = () => {
    setNewFileName('');
    setShowFileNameModal(true);
    setIsRenaming(false);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(e.target.value);
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const fileId = `file-${Date.now()}`;
      const fileExt = selectedLanguage?.id === 'csharp' ? 'cs' : (selectedLanguage?.id || 'js');
      const fileName = newFileName.includes('.') ? newFileName : `${newFileName}.${fileExt}`;
      
      const newFile: FileType = {
        id: fileId,
        name: fileName,
        content: '', // Start with a blank file
        language: getMonacoLanguage(selectedLanguage?.id || 'javascript'),
        isActive: false,
        isDefault: false
      };
      
      setFiles(prev => [...prev, newFile]);
      setShowFileNameModal(false);
      
      // Set the new file as active
      setActiveFileId(fileId);
      setFiles(prev => prev.map(file => ({
        ...file,
        isActive: file.id === fileId
      })));
    }
  };

  // Refs for positioning the file menu
  const fileMenuButtonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});

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

  // Initialize files based on selected language
  useEffect(() => {
    if (selectedLanguage) {
      const defaultSolutionCode = getDefaultCode(selectedLanguage.id);
      const defaultTestCode = getDefaultTests(selectedLanguage.id);
      
      setSolutionCode(defaultSolutionCode);
      setTestCode(defaultTestCode);
      setInitialSolutionCode(defaultSolutionCode);
      setInitialTestCode(defaultTestCode);
      
      // Initialize default files based on language
      let initialFiles: FileType[] = [];
      
      if (selectedLanguage.id === 'react') {
        initialFiles = [
          { id: 'main', name: 'App.js', content: defaultSolutionCode, language: 'javascript', isActive: true, isDefault: true },
          { id: 'test', name: 'App.spec.js', content: defaultTestCode, language: 'javascript', isActive: false, isDefault: true }
        ];
      } else if (selectedLanguage.id === 'javascript') {
        initialFiles = [
          { id: 'main', name: 'index.js', content: defaultSolutionCode, language: 'javascript', isActive: true, isDefault: true },
          { id: 'test', name: 'index.test.js', content: defaultTestCode, language: 'javascript', isActive: false, isDefault: true }
        ];
      } else if (selectedLanguage.id === 'python') {
        initialFiles = [
          { id: 'main', name: 'solution.py', content: defaultSolutionCode, language: 'python', isActive: true, isDefault: true },
          { id: 'test', name: 'test_solution.py', content: defaultTestCode, language: 'python', isActive: false, isDefault: true }
        ];
      } else {
        const fileExt = selectedLanguage.id === 'csharp' ? 'cs' : selectedLanguage.id;
        initialFiles = [
          { id: 'main', name: `Solution.${fileExt}`, content: defaultSolutionCode, language: selectedLanguage.id, isActive: true, isDefault: true },
          { id: 'test', name: `Tests.${fileExt}`, content: defaultTestCode, language: selectedLanguage.id, isActive: false, isDefault: true }
        ];
      }
      
      setFiles(initialFiles);
      setActiveFileId('main');
    }
  }, [selectedLanguage]);

  // Close file menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFileMenu && !fileMenuButtonRefs.current[showFileMenu]?.contains(event.target as Node)) {
        setShowFileMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFileMenu]);

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
    } else if (tab === 'guideLearners') {
      setView('guideLearners');
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
        description: instructions || initialData?.description || "",
        code: solutionCode,
        testCases: [{ id: '1', input: '', expectedOutput: testCode }],
      });
    }
  };

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setShowTerminal(true);
    setTestResults(null);

    try {
      if (selectedLanguage?.id === 'javascript' || selectedLanguage?.id === 'react') {
        const results = runJavaScriptTests(solutionCode, testCode);
        setTestResults(results);
      } else {
        // For other languages, we'd need a backend service
        setTimeout(() => {
          setTestResults({
            success: Math.random() > 0.3, // 70% chance of success for demo
            message: `Running tests for ${selectedLanguage?.name || 'this language'} requires a backend service. This is a mock implementation.`,
            results: [
              { 
                name: 'testExercise()', 
                passed: Math.random() > 0.3, 
                error: Math.random() > 0.3 ? undefined : 'Expected result but got null' 
              }
            ]
          });
        }, 1000); // Simulate network delay
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

  // New handlers for requested features
  
  // Handle expand functionality
  const handleExpandLeft = () => {
    setLeftPanelExpanded(!leftPanelExpanded);
    if (rightPanelExpanded) {
      setRightPanelExpanded(false);
    }
  };

  const handleExpandRight = () => {
    setRightPanelExpanded(!rightPanelExpanded);
    if (leftPanelExpanded) {
      setLeftPanelExpanded(false);
    }
  };

  // Handle undo functionality
  const handleUndoLeft = () => {
    const mainFile = files.find(f => f.id === 'main');
    if (mainFile && activeFileId === 'main') {
      setSolutionCode(initialSolutionCode);
      
      // Update file content in files array
      const updatedFiles = files.map(file => {
        if (file.id === 'main') {
          return { ...file, content: initialSolutionCode };
        }
        return file;
      });
      
      setFiles(updatedFiles);
    } else {
      // For custom files, reset to empty
      const activeFile = files.find(f => f.id === activeFileId);
      if (activeFile) {
        const updatedFiles = files.map(file => {
          if (file.id === activeFileId) {
            return { ...file, content: '' };
          }
          return file;
        });
        
        setFiles(updatedFiles);
        setSolutionCode('');
      }
    }
  };

  const handleUndoRight = () => {
    setTestCode(initialTestCode);
    
    // Update test file content
    const updatedFiles = files.map(file => {
      if (file.id === 'test') {
        return { ...file, content: initialTestCode };
      }
      return file;
    });
    
    setFiles(updatedFiles);
  };

  // Handle info toggles
  const toggleSolutionInfo = () => {
    setShowSolutionInfo(!showSolutionInfo);
    if (showEvaluationInfo) {
      setShowEvaluationInfo(false);
    }
  };

  const toggleEvaluationInfo = () => {
    setShowEvaluationInfo(!showEvaluationInfo);
    if (showSolutionInfo) {
      setShowSolutionInfo(false);
    }
  };

  // Handle file menu toggle with proper positioning
  const handleFileMenuToggle = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    if (showFileMenu === fileId) {
      setShowFileMenu(null);
    } else {
      setShowFileMenu(fileId);
    }
  };

  // Handle file renaming
  const handleRenameFile = (file: FileType) => {
    setFileForRename(file);
    setNewFileName(file.name);
    setShowFileNameModal(true);
    setIsRenaming(true);
    setShowFileMenu(null); // Close dropdown immediately
  };

  const handleSaveRename = () => {
    if (fileForRename && newFileName.trim()) {
      const updatedFiles = files.map(file => {
        if (file.id === fileForRename.id) {
          return { ...file, name: newFileName };
        }
        return file;
      });
      
      setFiles(updatedFiles);
      setShowFileNameModal(false);
      setFileForRename(null);
    }
  };

  // Handle file deletion with confirmation for default files
  const handleDeleteFile = (file: FileType) => {
    setShowFileMenu(null); // Close the dropdown immediately
    
    if (file.isDefault) {
      // Show confirmation modal for default files
      setFileToDelete(file);
      setShowDeleteConfirmModal(true);
    } else {
      // Directly delete non-default files
      executeDeleteFile(file.id);
    }
  };

  // Execute file deletion
  const executeDeleteFile = (fileId: string) => {
    // Remove the file from state
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    
    // If the active file is being deleted, set main as active
    if (activeFileId === fileId) {
      setActiveFileId('main');
      const mainFile = files.find(f => f.id === 'main');
      if (mainFile) {
        setSolutionCode(mainFile.content);
      }
    }
    
    setShowDeleteConfirmModal(false);
    setFileToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      executeDeleteFile(fileToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setFileToDelete(null);
  };

  const handleFileClick = (fileId: string) => {
    // Skip if already active
    if (fileId === activeFileId) return;
    
    setActiveFileId(fileId);
    
    // Update active states in files
    const updatedFiles = files.map(file => ({
      ...file,
      isActive: file.id === fileId
    }));
    
    setFiles(updatedFiles);
    
    // Update editor content based on the selected file
    const selectedFile = files.find(f => f.id === fileId);
    if (selectedFile) {
      if (fileId === 'main') {
        setSolutionCode(selectedFile.content);
      } else if (fileId === 'test') {
        setTestCode(selectedFile.content);
      } else {
        // For custom files, update solution code panel
        setSolutionCode(selectedFile.content);
      }
    }
  };

  // Update files when editor content changes
  const handleSolutionCodeChange = (value: string) => {
    // Update the active file content
    const updatedFiles = files.map(file => {
      if (file.id === activeFileId) {
        return { ...file, content: value };
      }
      return file;
    });
    
    setFiles(updatedFiles);
    setSolutionCode(value);
  };

  const handleTestCodeChange = (value: string) => {
    // Update the test file content
    const updatedFiles = files.map(file => {
      if (file.id === 'test') {
        return { ...file, content: value };
      }
      return file;
    });
    
    setFiles(updatedFiles);
    setTestCode(value);
  };

  // Function to get main file content
  const getMainFileContent = () => {
    const mainFile = files.find(f => f.id === 'main');
    return mainFile ? mainFile.content : solutionCode;
  };

  // Function to get test file content
  const getTestFileContent = () => {
    const testFile = files.find(f => f.id === 'test');
    return testFile ? testFile.content : testCode;
  };

  // Preview component for React output
  const PreviewComponent: React.FC = () => {
    const [previewHtml, setPreviewHtml] = useState<string>('');
    
    useEffect(() => {
      if (selectedLanguage?.id === 'react') {
        try {
          // Attempt to create a simple preview from React code
          // In a real app, you'd use a more sophisticated approach like a sandbox
          const code = activeFileId === 'main' ? solutionCode : 
                      files.find(f => f.id === activeFileId)?.content || '';
          
          // Extract JSX content or look for a render() method
          const jsxMatch = code.match(/return\s*\(\s*<([^>]*)>/);
          if (jsxMatch) {
            // Very naive extraction - in a real app you'd use proper parsing
            let component = code.substring(code.indexOf('return (') + 8);
            component = component.substring(0, component.lastIndexOf(');'));
            setPreviewHtml(`<div>${component}</div>`);
          } else {
            setPreviewHtml('<h1>Preview available for React components with JSX</h1>');
          }
        } catch (error) {
          setPreviewHtml('<div class="p-4 text-center text-red-500">Error rendering preview</div>');
        }
      } else {
        setPreviewHtml('<div class="p-4 text-center text-gray-500">Preview not available for this language</div>');
      }
    }, [activeFileId, solutionCode, files]);
    
    return (
      <div className="h-full flex items-center justify-center bg-white p-4 text-center">
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <button 
            className="text-[#6D28D2] flex items-center mr-4"
            onClick={onClose}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">Back to curriculum</span>
          </button>
          <span className="text-gray-700">{exerciseTitle}</span>
        </div>
        <div className="flex gap-2">
          <button className="border border-[#6D28D2] text-[#6D28D2] px-4 py-2 rounded-md flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
          <button 
            className="border border-[#6D28D2] text-[#6D28D2] px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
          <button 
            className="bg-[#6D28D2] text-white px-4 py-2 rounded-md"
            onClick={handleSave}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {view === 'languageSelection' && (
          <div className="fixed inset-0 flex items-center justify-center z-40">
            {/* Backdrop overlay with blur effect */}
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 " onClick={onClose}></div>

            {/* Modal content - keeping your existing structure but with proper z-index */}
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-xl z-50">
              <h2 className="text-md font-bold text-gray-800 mb-4">Select language to create coding exercise</h2>
              
              <div className="mb-4">
                <label className="block text-gray-800 mb-2 text-xs font-bold">Coding language</label>
                <div className="relative">
                  <button
                    className="w-full flex items-center justify-between bg-white  border border-[#6D28D2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D28D2]"
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  >
                    {selectedLanguage ? (
                      <div className="flex items-center">
                        <span className='text-[#6D28D2]'>{selectedLanguage.name}</span>
                        {selectedLanguage.deprecated && (
                          <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">Deprecated</span>
                        )}
                        {selectedLanguage.isNew && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">New</span>
                        )}
                      </div>
                    ) : (
                      <span className='text-[#6D28D2]'>Select</span>
                    )}
                    <ChevronDown className="w-5 h-5 text-[#6D28D2]" />
                  </button>
                  
                  {showLanguageDropdown && (
                    <div className="absolute z-10 mt-1 w-full text-gray-800 font-bold text-sm bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                  <label className="block text-gray-800 mb-2 text-xs font-bold">Version</label>
                  <div className="relative">
                    <button
                      className="w-full flex items-center text-[#6D28D2] justify-between bg-white border border-[#6D28D2] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D28D2]"
                      onClick={() => setShowVersionDropdown(!showVersionDropdown)}
                    >
                      {selectedVersion || 'Select Version'}
                      <ChevronDown  className="w-5 h-5 text-[#6D28D2]" />
                    </button>
                    
                    {showVersionDropdown && (
                      <div className="absolute z-10 mt-1 w-full text-gray-800 font-bold bg-white border border-gray-200 rounded-md shadow-lg">
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
                    <p className="text-xs font-medium text-gray-500 mt-1">with {selectedLanguage.additionalInfo}</p>
                  )}
                </div>
              )}
              
              {selectedLanguage && selectedLanguage.deprecated && (
                <div className="mb-4 py-3 px-4 bg-yellow-50 border border-yellow-600 rounded-xl flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">You've selected a deprecated language</p>
                    <p className="text-sm mt-1 font-medium text-gray-800">
                      We have introduced a new "Web Development" language option that supports JavaScript coding exercises with up-to-date libraries. For the best experience please select "Web Development" from the language dropdown.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end mt-6 space-x-2">
                <button 
                  className="px-2 py-2 font-bold hover:bg-gray-200 text-gray-800 text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className={`px-3 py-2 rounded font-bold text-sm ${selectedLanguage ? 'bg-[#6D28D2] text-white' : 'bg-purple-300 text-white cursor-not-allowed'}`}
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
          <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-xl text-gray-700 font-bold mb-4">Plan exercise</h2>
            
            <div className="bg-white mb-6">
              <p className="text-gray-700 mb-2">
                A <span className="font-bold">coding exercise</span> allows your learners to practice a targeted piece of real work and get immediate feedback. We recommend you follow these steps: Plan the exercise, define the solution, and guide learners. This will ensure you frame the problem and provide the needed guidance with the solution in mind.
              </p>
              <a href="#" className="text-[#6D28D2] text-sm hover:underline">Learn more about creating coding exercises</a>
              
              <div className="mt-6">
                <label className="block text-gray-700 mb-2 font-bold">Exercise title</label>
                <input
                  type="text"
                  value={exerciseTitle}
                  onChange={(e) => setExerciseTitle(e.target.value)}
                  className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D28D2]"
                />
              </div>
              
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <label className="block text-gray-700 font-bold">Learning objective</label>
                  <Info size={13} className="bg-gray-800 ml-1 rounded-full text-white" />
                </div>
                <div className="relative">
                  <textarea
                    value={learningObjective}
                    onChange={(e) => setLearningObjective(e.target.value)}
                    placeholder="Provide a learning objective for this coding exercise."
                    className="w-full border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6D28D2]"
                    rows={3}
                  />
                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {learningObjective.length}/200
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-right mt-1">Optional</div>
              </div>
            </div>
          </div>
        )}

        {view === 'guideLearners' && (
          <div className="flex h-full">
            {/* Left side - Instructions */}
            <div className="w-1/2 border-r border-gray-200">
              <InstructionTabs 
                defaultInstructions={instructions}
                defaultHints={hints}
                defaultSolutionExplanation={solutionExplanation}
                onInstructionsChange={setInstructions}
                onHintsChange={setHints}
                onSolutionExplanationChange={setSolutionExplanation}
                solutionCode={getMainFileContent()}
              />
            </div>

            {/* Right side - Code preview */}
            <div className="w-1/2 flex flex-col">
              <div className="p-4 bg-gray-800 text-white flex items-center">
                <span className="font-medium">Learner file</span>
                <div className="ml-1 bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">?</div>
                <div className="ml-auto flex space-x-2">
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <Code size={18} />
                  </button>
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <ChevronUp size={18} />
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 text-white p-2 font-mono text-sm">
                {files.find(f => f.id === 'main')?.name}
              </div>
              <div className="flex-1 bg-gray-900">
                <MonacoEditorComponent 
                  language={getMonacoLanguage(selectedLanguage?.id || 'javascript')} 
                  value={getMainFileContent()}
                  onChange={handleSolutionCodeChange}
                  readOnly={true}
                  isReact={selectedLanguage?.id === 'react'}
                />
              </div>
            </div>
          </div>
        )}

        {view === 'codeEditor' && (
          <div className="flex-1 flex flex-col">
            <div className="flex border-b border-gray-700 bg-gray-800 text-white">
              <div className={`${leftPanelExpanded ? 'w-full' : rightPanelExpanded ? 'hidden' : 'w-1/2'} p-2 flex items-center justify-between`}>
                <div className='flex items-center relative'>
                  <span className="mr-2 font-bold">Solution</span>
                  <button 
                    className="ml-1 rounded-full"
                    onClick={toggleSolutionInfo}
                  >
                    <Info size={13} className="bg-white rounded-full text-gray-800" />
                  </button>
                  
                  {/* Solution Info Popup */}
                  {showSolutionInfo && (
                    <div className="absolute top-10 left-0 z-50 bg-white rounded-lg shadow-lg p-5 w-64 text-gray-800">
                      <p className="text-xs mb-4 text-gray-800 font-bold">
                       Solution files verify the provided evaluation file (unit test) is correct. Learners are expected to write a similar solution (not necessarily the same) for provided instructions at the "Guide learners" step.
                      </p>
                      <div className="flex justify-between">
                        <button 
                          className="bg-[#6D28D2] text-white px-1 font-bold py-1 rounded-md text-xs"
                          onClick={() => window.open('/documentation', '_blank')}
                        >
                          View documentation
                        </button>
                        <button 
                          className="border border-gray-300 px-3 py-1 rounded-md text-sm"
                          onClick={toggleSolutionInfo}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-row items-center gap-2">
                  <button className="px-2 py-1 border border-white rounded text-xs font-bold cursor-pointer">View examples</button>
                  <button onClick={handleUndoLeft} className="cursor-pointer">
                    <Undo size={14} color='white' />
                  </button>
                  <button onClick={handleExpandLeft} className="cursor-pointer">
                    <Maximize2 size={14} color='white' />
                  </button>
                </div>
              </div>
              <div className={`${rightPanelExpanded ? 'w-full' : leftPanelExpanded ? 'hidden' : 'w-1/2'} p-2 flex items-center justify-between border-l border-gray-700`}>
                <div className='flex flex-row items-center relative'>
                  <span className="mr-2 font-bold">{showPreview ? 'Preview' : 'Evaluation'}</span>
                  <button 
                    className="ml-1 rounded-full"
                    onClick={toggleEvaluationInfo}
                  >
                    <Info size={13} className="bg-white rounded-full text-gray-800" />
                  </button>
                  
                  {/* Evaluation Info Popup */}
                  {showEvaluationInfo && (
                    <div className="absolute top-10 left-0 z-50 bg-white rounded-lg shadow-lg p-5 w-64 text-gray-800">
                      <p className="text-xs mb-4 font-bold text-gray-800">
                        An evaluation file checks whether the learner's solution is correct. Providing multiple test cases, descriptive test names, and assertion messages helps learners troubleshoot and improve their solution.
                      </p>
                      <div className="flex justify-between">
                        <button 
                          className="bg-[#6D28D2] text-white px-2 font-bold py-1 rounded-md text-xs"
                          onClick={() => window.open('/documentation', '_blank')}
                        >
                          View documentation
                        </button>
                        <button 
                          className="border border-gray-300 px-3 py-1 rounded-md text-sm"
                          onClick={toggleEvaluationInfo}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <button 
                  className="px-2 py-1 border border-white rounded text-xs flex items-center font-bold cursor-pointer"
                  onClick={togglePreview}
                >
                  {showPreview ? 'Show evaluation file' : 'Show preview window'}
                </button>
                <div className="flex items-center">
                  <button onClick={handleUndoRight} className="mx-2 cursor-pointer">
                    <Undo size={14} color='white' />
                  </button>
                  <button onClick={handleExpandRight} className="mr-2 cursor-pointer">
                    <Maximize2 size={14} color='white' />
                  </button>
                </div>
                </div>
              </div>
            </div>

            <div className="flex border-b border-gray-700 bg-gray-800 text-white px-2">
              <div className={`${leftPanelExpanded ? 'w-full' : rightPanelExpanded ? 'hidden' : 'w-1/2'} px-2 flex items-center overflow-x-auto`}>
                {files.filter(f => f.id !== 'test').map((file) => (
                  <div 
                    key={file.id}
                    className="flex items-center mr-2 relative"
                  >
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleFileClick(file.id)}
                    >
                      <span className={`font-medium ${file.isActive || (file.id === 'main' && activeFileId === 'main') ? 'border-b-2 border-white pb-2' : ''}`}>
                        {file.name}
                      </span>
                    </div>
                    <button 
                      ref={(el) => { fileMenuButtonRefs.current[file.id] = el; }}
                      className="ml-1 p-1 hover:bg-gray-700 rounded"
                      onClick={(e) => handleFileMenuToggle(file.id, e)}
                    >
                      <MoreVertical size={14} />
                    </button>
                    
                    {/* File dropdown menu - fixed positioning with higher z-index */}
                    {showFileMenu === file.id && (
                      <div 
                        className="fixed bg-white rounded-lg shadow-lg py-2 w-32 text-gray-800" 
                        style={{
                          zIndex: 9999,
                          left: fileMenuButtonRefs.current[file.id]?.getBoundingClientRect().left || 0,
                          top: (fileMenuButtonRefs.current[file.id]?.getBoundingClientRect().bottom || 0) + 2
                        }}
                      >
                        <button 
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameFile(file);
                          }}
                        >
                          Rename
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button 
                  className="ml-2 cursor-pointer"
                  onClick={handleAddFile}
                >
                  <Plus size={16} className='bg-white rounded-full text-gray-800' />
                </button>
              </div>
              <div className={`${rightPanelExpanded ? 'w-full' : leftPanelExpanded ? 'hidden' : 'w-1/2'} px-2 flex items-center border-l border-gray-700`}>
                <div className='flex flex-row'>
                  <span className="mr-2 font-bold border-b border-b-white pb-2">
                    {showPreview ? 'Preview' : files.find(f => f.id === 'test')?.name}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Editor container */}
            <div className="flex-1 flex" style={{ height: 'calc(100vh - 150px)', minHeight: '500px' }}>
              <div 
                className={`${leftPanelExpanded ? 'w-full' : rightPanelExpanded ? 'hidden' : 'w-1/2'} bg-gray-900 text-gray-200 overflow-auto`} 
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ flexGrow: 1, height: '100%' }}>
                  <MonacoEditorComponent 
                    language={getMonacoLanguage(selectedLanguage?.id || 'javascript')} 
                    value={solutionCode}
                    onChange={handleSolutionCodeChange}
                    isReact={selectedLanguage?.id === 'react'}
                  />
                </div>
              </div>
              
              <div 
                className={`${rightPanelExpanded ? 'w-full' : leftPanelExpanded ? 'hidden' : 'w-1/2'} bg-gray-900 text-gray-200 overflow-auto border-l border-gray-700`} 
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ flexGrow: 1, height: '100%' }}>
                  {showPreview ? (
                    <PreviewComponent />
                  ) : (
                    <MonacoEditorComponent 
                      language={getMonacoLanguage(selectedLanguage?.id || 'javascript')} 
                      value={testCode}
                      onChange={handleTestCodeChange}
                      isReact={selectedLanguage?.id === 'react'}
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Run tests button */}
            <div className="fixed bottom-20 left-0 px-6 py-3 z-10">
              <button 
                className="bg-white text-gray-700 px-4 py-2 rounded-md flex items-center font-bold text-sm shadow-md hover:bg-gray-100"
                onClick={handleRunTests}
                disabled={isRunningTests}
              >
                <Play size={15} className="p-1 bg-gray-800 rounded-full text-white mr-2" />
                {isRunningTests ? 'Running...' : 'Run tests'}
              </button>
            </div>
            
            {/* Terminal panel - styled as a slide up panel */}
            <div 
              className={`fixed left-0 right-0 bottom-0 bg-gray-900 text-white border-t border-gray-700 transform transition-all duration-300 shadow-lg ${
                showTerminal ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ maxHeight: '40vh' }}
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
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(40vh - 40px)' }}>
                {testResults ? (
                  <div className="flex">
                    {/* Left panel - Test cases summary */}
                    <div className="w-64 border-r border-gray-700 pr-4">
                      <h3 className="font-medium mb-2">Test Cases</h3>
                      <div className="text-sm mb-4">
                        Failed: {testResults.results?.filter((r: TestResult) => !r.passed).length || 0}, 
                        Passed: {testResults.results?.filter((r: TestResult) => r.passed).length || 0} of {testResults.results?.length || 0} tests
                      </div>
                      
                      {/* List of test cases */}
                      <div className="space-y-1">
                        {testResults.results?.map((result: TestResult, index: number) => (
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
                      
                      {testResults.message && (
                        <div className="mb-2 text-yellow-300">{testResults.message}</div>
                      )}
                      
                      {testResults.error && (
                        <div className="mb-2 text-red-400">Error: {testResults.error}</div>
                      )}
                      
                      {testResults.results?.map((result: TestResult, index: number) => (
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
        )}
      </div>

      {/* File name modal - serves both for creating and renaming files */}
      {showFileNameModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50" onClick={() => setShowFileNameModal(false)}></div>
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{isRenaming ? 'Rename file' : 'Enter file name'}</h3>
              <button onClick={() => setShowFileNameModal(false)}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">File name</label>
              <input
                type="text"
                value={newFileName}
                onChange={handleFileNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D28D2]"
                placeholder="e.g. file.txt"
                autoFocus
              />
              {newFileName && (
                <div className="absolute right-3 mt-2 text-gray-500 text-sm">
                  {newFileName.length}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setShowFileNameModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#6D28D2] text-white rounded-md"
                onClick={isRenaming ? handleSaveRename : handleCreateFile}
              >
                {isRenaming ? 'Save' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirmModal && fileToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50" onClick={handleCancelDelete}></div>
          <div className="bg-white rounded-lg p-6 w-full max-w-md z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Delete file</h3>
              <button onClick={handleCancelDelete}>
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">Please confirm to delete file {fileToDelete.name}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Navigation */}
      <div className="border-t border-gray-200 bg-white mb-1">
        <div className="fixed bottom-4 left-4 rounded border border-[#6D28D2] text-[#6D28D2]">
          <button
            className="text-center relative text-[#6D28D2] px-4 py-2 font-medium"
            onClick={() => console.log('Previous')}
          >
            Previous
          </button>
        </div>

        <div className="flex relative max-w-2xl mx-auto">
          <button
            className={`flex-1 py-4 text-center relative ${activeTab === 'planExercise' ? 'text-gray-800 font-bold' : 'text-gray-500 font-medium'}`}
            onClick={() => handleTabChange('planExercise')}
          >
            Plan Exercise
            {activeTab === 'planExercise' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800"></div>}
          </button>
          
          <button
            className={`flex-1 py-4 text-center relative ${activeTab === 'authorSolution' ? 'text-gray-800 font-bold' : 'text-gray-500 font-medium'}`}
            onClick={() => handleTabChange('authorSolution')}
          >
            Author solution
            {activeTab === 'authorSolution' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800"></div>}
            
            {/* Tooltip that appears when activeTab is planExercise and showTooltip is true */}
            {activeTab === 'planExercise' && showTooltip && (
              <div className="absolute bottom-10 left-1/2 min-w-[200px] transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg z-10 w-64 text-left">
                <p className="text-gray-700 text-sm mb-2">
                  After planning your exercise, you can move to the next step or toggle between any of these options.
                </p>
                <div className="flex justify-end">
                  <div
                    className="bg-[#6D28D2] hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                    onClick={() => handleTabChange('authorSolution')}
                  >
                    Get started
                  </div>
                </div>
                {/* Triangle pointer at bottom of tooltip */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-2 border-8 border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent"></div>
              </div>
            )}
          </button>
          
          <button
            className={`flex-1 py-4 text-center relative ${activeTab === 'guideLearners' ? 'text-gray-800 font-bold' : 'text-gray-500 font-medium'}`}
            onClick={() => handleTabChange('guideLearners')}
          >
            Guide learners
            {activeTab === 'guideLearners' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800"></div>}
          </button>
        </div>
      </div>

      {/* Next Button (bottom right) */}
      <div className="fixed bottom-4 right-4">
        <button 
          className="bg-[#6D28D2] text-white px-4 py-2 rounded-md shadow-md"
          onClick={handleSave}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CodingExerciseCreatorWithMonaco;