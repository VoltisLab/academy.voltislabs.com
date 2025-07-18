import { CodingExercisePreviewData } from "@/lib/types";
import {
  ArrowBigLeft,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  Lock,
  Maximize2,
  Minimize2,
  PlayCircleIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BsCheckCircleFill, BsFillCheckCircleFill } from "react-icons/bs";
import { IoInformationCircle } from "react-icons/io5";
import Editor, { useMonaco } from "@monaco-editor/react";
import { exactDarkTheme } from "@/lib/utils";
import { usePreviewContext } from "@/context/PreviewContext";
import { ControlButtons } from "@/components/preview/ControlsButton";

interface CodingExercisePreviewProps {
  data: CodingExercisePreviewData;
  onClose: () => void;
}

type ExpandableSection = "second" | "third" | null;

const CodingExercisePreview: React.FC<CodingExercisePreviewProps> = ({
  data,
  onClose,
}) => {
  const [navi, setNavi] = useState<"instruction" | "hint" | "solution">(
    "instruction"
  );
  const [hideFirstSection, setHideFirstSection] = useState(false);
  const [expandedSection, setExpandedSection] =
    useState<ExpandableSection>(null);
  const [expandCodeSection, setExpandCodeSection] = useState<boolean>(false);
  const [expandPreviewSection, setExpandPreviewSection] =
    useState<boolean>(false);
  const [isObjectiveOpen, setIsObjectiveOpen] = useState(false);
  const [isTestResultOpen, setIsTestResultOpen] = useState(false);
  const [terminalType, setTerminalType] = useState<"testResult" | "userLogs">(
    "testResult"
  );
  const [showResetModal, setShowResetModal] = useState(false);
  const [showUserLogsInfo, setShowUserLogsInfo] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [userCode, setUserCode] = useState(data.content.solutionCode);
  const [previewOutput, setPreviewOutput] = useState("");
  const [cursorPosition, setCursorPosition] = useState("line 1, column 1");
  const [isSaving, setIsSaving] = useState(false);
  const [testResults, setTestResults] = useState(data.testResults);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [userLogs, setUserLogs] = useState<string[]>([]);

  const monaco = useMonaco();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("exactDarkTheme", exactDarkTheme);
    }
  }, [monaco]);

  useEffect(() => {
    // Initialize with starter code
    setUserCode(data.content.solutionCode);
    executeCodeForPreview(data.content.solutionCode);
  }, [data.content.solutionCode]);

  const executeCodeForPreview = (code: string) => {
    try {
      // Capture console.log outputs
      const originalConsoleLog = console.log;
      const originalPrint = window.print; // Save original print function
      const logs: string[] = [];

      // Override print to capture output instead of opening print dialog
      window.print = (...args: any[]) => {
        const printMessage = args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          )
          .join(" ");
        logs.push(printMessage);
        originalConsoleLog(...args);
        return true; // Prevent default print behavior
      };

      console.log = (...args) => {
        const logMessage = args
          .map((arg) =>
            typeof arg === "object" ? JSON.stringify(arg) : String(arg)
          )
          .join(" ");
        logs.push(logMessage);
        originalConsoleLog(...args);
      };

      // Execute the code
      if (
        data.exercise.language === "javascript" ||
        data.exercise.language === "react" ||
        data.exercise.language === "web-dev"
      ) {
        // Create a function and execute it
        const fn = new Function(code);
        fn();

        // For React, we might want to handle JSX differently
        if (data.exercise.language === "react") {
          const reactOutput = code.includes("return (")
            ? code.substring(
                code.indexOf("return (") + 8,
                code.lastIndexOf(");")
              )
            : "React component output would appear here";
          setPreviewOutput(reactOutput);
        } else {
          setPreviewOutput("Code executed successfully");
        }
      } else if (data.exercise.language === "html") {
        setPreviewOutput(code);
      } else if (data.exercise.language === "python") {
        // For Python-like output in our preview
        try {
          // Replace Python-style print with console.log
          const processedCode = code.replace(
            /print\((.*)\)/g,
            "console.log($1)"
          );
          const fn = new Function(`
            ${processedCode}
            return { output: typeof total !== 'undefined' ? total : null };
          `);
          const result = fn();
          setPreviewOutput(
            result.output !== null
              ? String(result.output)
              : "Code executed (check logs for output)"
          );
        } catch (e) {
          setPreviewOutput(
            `Error: ${e instanceof Error ? e.message : "Unknown error"}`
          );
        }
      } else {
        // For other languages
        try {
          const fn = new Function(code);
          fn();
          setPreviewOutput("Code executed (check logs for output)");
        } catch (e) {
          setPreviewOutput(
            `Execution output for ${data.exercise.language} would appear here`
          );
        }
      }

      setUserLogs(logs);
      console.log = originalConsoleLog;
      window.print = originalPrint; // Restore original print function
    } catch (error) {
      setPreviewOutput(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setIsSaving(true);
      setUserCode(value);
      executeCodeForPreview(value);

      // Simulate saving
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    }
  };

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition(
        `line ${e.position.lineNumber}, column ${e.position.column}`
      );
    });
  };

  const runTests = () => {
    setIsRunningTests(true);

    // Clear previous logs
    setUserLogs([]);

    try {
      // Create a test execution environment
      const logs: string[] = [];
      const originalConsoleLog = console.log;

      console.log = (...args) => {
        const logMessage = args.join(" ");
        logs.push(logMessage);
        originalConsoleLog(...args);
      };

      // Process Python test code to remove imports and handle Python-specific syntax
      let processedTestCode = data.content.testCode
        .replace(/^import .*$/gm, "") // Remove import statements
        .replace(/sys\.stdout/g, "console") // Replace Python stdout with console
        .replace(/io\.StringIO\(\)/g, '{ getvalue: () => logs.join("\\n") }'); // Mock StringIO

      // Wrap user code in a function for testing
      const wrappedCode = `
        function studentSolution() {
          ${userCode.replace(/print\((.*)\)/g, "console.log($1)")}
        }
        
        ${processedTestCode
          .replace(/student_func\(\)/g, "studentSolution()")
          .replace(
            /def test_student_code\(student_func\):/,
            "function testStudentCode(studentFunc) {"
          )
          .replace(/\bdef\b/g, "function")
          .replace(/\bprint\(/g, "console.log(")}
        
        console.log(testStudentCode(studentSolution));
      `;

      // Execute the test
      const testFn = new Function(wrappedCode);
      testFn();

      // Check if the test passed by looking for specific output
      const testOutput = logs.join("\n");
      const passed =
        testOutput.includes("✅") ||
        testOutput.toLowerCase().includes("correct") ||
        !testOutput.toLowerCase().includes("❌");

      setTestResults({
        success: passed,
        message: passed ? "All tests passed!" : "Some tests failed",
        results: [
          {
            name: "Code Validation",
            passed: passed,
            error: passed ? undefined : testOutput,
          },
        ],
      });

      if (passed) {
        setFailedAttempts(0);
      } else {
        setFailedAttempts((prev) => prev + 1);
      }

      setUserLogs(logs);
      console.log = originalConsoleLog;
    } catch (error) {
      setTestResults({
        success: false,
        message: "Error running tests",
        results: [
          {
            name: "Code Validation",
            passed: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      });
      setFailedAttempts((prev) => prev + 1);
    } finally {
      setIsRunningTests(false);
      setIsTestResultOpen(true);
      setTerminalType("testResult");
    }
  };

  const resetCode = () => {
    setUserCode(data.content.solutionCode);
    setShowResetModal(false);
    executeCodeForPreview(data.content.solutionCode);
  };

  const toggleFirstSection = () => {
    setHideFirstSection(!hideFirstSection);
  };

  const canAccessHints = failedAttempts >= 2 || (testResults?.success ?? false);
  const canAccessSolution =
    failedAttempts >= 3 || (testResults?.success ?? false);

  const componentRef = useRef<HTMLDivElement>(null);
  const { expandedView } = usePreviewContext();

  return (
    <div
      ref={componentRef}
      className={`flex flex-col relative bg-white ${
        expandedView ? "h-[80vh]" : "h-[70vh]"
      }`}
    >
      {" "}
      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Reset solution</h3>
              <button onClick={() => setShowResetModal(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Your code will be deleted. Do you want to reset your solution?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={resetCode}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      {/* First section: Instruction and controls */}
      <div
        className={`${
          hideFirstSection ? "w-0" : "w-sm"
        } transition-all duration-500 overflow-hidden flex flex-col`}
      >
        <nav className="px-3 border-b-1 border-zinc-600/50 flex justify-between">
          <div className="flex w-[85%] overflow-auto text-sm">
            <button
              className={`px-4 py-2 transition ${
                navi === "instruction"
                  ? "border-b-2 border-zinc-600 font-bold"
                  : ""
              }`}
              onClick={() => setNavi("instruction")}
            >
              Instructions
            </button>
            <button
              className={`px-4 py-2 transition flex items-center ${
                canAccessHints
                  ? "text-black cursor-pointer"
                  : "text-zinc-500 cursor-not-allowed"
              } ${
                navi === "hint" ? "border-b-2 border-zinc-600 font-bold" : ""
              }`}
              onClick={() => canAccessHints && setNavi("hint")}
            >
              <span>Hints</span>
              {!canAccessHints && <Lock size={12} className="ml-0.5" />}
            </button>

            <button
              className={`px-4 py-2 transition flex items-center ${
                canAccessSolution
                  ? "text-black cursor-pointer"
                  : "text-zinc-500 cursor-not-allowed"
              } ${
                navi === "solution"
                  ? "border-b-2 border-zinc-600 font-bold"
                  : ""
              }`}
              onClick={() => canAccessSolution && setNavi("solution")}
            >
              <span className="w-max">Solution explanation</span>
              {!canAccessSolution && <Lock size={12} className="ml-0.5" />}
            </button>
          </div>

          <button
            className="hover:bg-purple-200 cursor-pointer rounded flex items-center justify-center"
            onClick={toggleFirstSection}
            title={hideFirstSection ? "Show instructions" : "Hide instructions"}
          >
            <ArrowLeft
              size={17}
              className={`transition-transform duration-300 ${
                hideFirstSection ? "rotate-180" : ""
              }`}
            />
          </button>
        </nav>

        {navi === "instruction" && (
          <div className="h-full px-3 py-4 space-y-5 overflow-auto">
            <h2 className="font-bold text-xl">{data.exercise.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: data.content.instructions }}
            />

            <div className="border-y">
              <div
                className="flex items-center justify-between my-2 cursor-pointer"
                onClick={() => setIsObjectiveOpen(!isObjectiveOpen)}
              >
                <h3 className="font-bold text-lg">Learning objective</h3>
                <ChevronDown
                  size={20}
                  className={`transition ${
                    isObjectiveOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {isObjectiveOpen && (
                <p className="mb-2">{data.exercise.learningObjective}</p>
              )}
            </div>
          </div>
        )}

        {navi === "hint" && (
          <div className="flex-1 px-3 py-4 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: data.content.hints }} />
          </div>
        )}

        {navi === "solution" && (
          <div className="flex-1 px-3 py-4 overflow-auto">
            <div
              dangerouslySetInnerHTML={{
                __html: data.content.solutionExplanation,
              }}
            />
          </div>
        )}
      </div>
      {/* Main editor and preview area */}
      <div
        className={`flex-1 h-full flex flex-col overflow-hidden ${
          expandCodeSection || expandPreviewSection
            ? "absolute left-0 top-0 w-full"
            : ""
        }`}
      >
        <div
          className={`flex relative overflow-hidden duration-500 ${
            isTestResultOpen ? "h-[calc(100vh-15rem)]" : "h-[calc(100vh-3rem)]"
          }`}
        >
          {/* Code editor section */}
          <div
            className={`transition-all duration-500 flex-1 flex flex-col overflow-hidden ${
              expandCodeSection && expandPreviewSection === false
                ? "absolute top-0 left-0 w-full h-full"
                : ""
            }`}
          >
            <nav className="bg-gray-700 flex h-14 text-white shrink-0">
              <button
                className={`hover:bg-slate-200 text-black mr-2 cursor-pointer flex items-center justify-center bg-white px-4 ${
                  hideFirstSection ? "block" : "hidden"
                }`}
                onClick={toggleFirstSection}
                title="Show instructions"
              >
                <ArrowRight size={20} />
              </button>

              <div className="px-3 flex w-full">
                <p className="self-stretch border-b-2 border-white flex items-center justify-center font-semibold text-sm">
                  {data.content.files.find((f) => !f.isTestFile)?.name ||
                    "solution.js"}
                </p>

                <button
                  className="hover:bg-purple-400 text-white ml-auto cursor-pointer rounded flex items-center justify-center p-1"
                  onClick={() => {
                    setExpandCodeSection(!expandCodeSection);
                    setIsTestResultOpen(false);
                  }}
                  title={
                    expandCodeSection ? "Collapse editor" : "Expand editor"
                  }
                >
                  {expandCodeSection ? (
                    <Minimize2 size={15} />
                  ) : (
                    <Maximize2 size={15} />
                  )}
                </button>
              </div>
            </nav>

            <div className="flex flex-col bg-black flex-1 text-sm overflow-auto text-white">
              <div className="flex-1 overflow-hidden">
                <Editor
                  height="100%"
                  language={
                    data.content.files.find((f) => !f.isTestFile)?.language ||
                    "javascript"
                  }
                  value={userCode}
                  onChange={handleEditorChange}
                  theme="exactDarkTheme"
                  onMount={handleEditorMount}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    tabSize: 2,
                    lineNumbers: "on",
                    folding: true,
                    padding: { top: 10 },
                  }}
                />
              </div>
              <div className="mt-auto px-3 py-2 flex items-center justify-between bg-gray-800">
                <div className="flex items-center gap-1 font-bold text-sm">
                  <button
                    className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded cursor-pointer hover:bg-gray-200"
                    onClick={runTests}
                    disabled={isRunningTests}
                  >
                    <PlayCircleIcon size={16} />
                    {isRunningTests ? (
                      <span className="animate-pulse">Running...</span>
                    ) : (
                      <span>Run tests</span>
                    )}
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-1 rounded cursor-pointer hover:bg-gray-700"
                    onClick={() => setShowResetModal(true)}
                  >
                    <span>Reset</span>
                  </button>
                </div>

                <div className="text-xs">
                  {isSaving ? "Saving changes..." : "All changes saved"} |{" "}
                  {cursorPosition}
                </div>
              </div>
            </div>
          </div>

          {/* Preview section */}
          <div
            className={`transition-all duration-500 flex-1 flex flex-col overflow-hidden bg-white ${
              expandPreviewSection ? "absolute top-0 left-0 w-full h-full" : ""
            }`}
          >
            <nav className="px-3 h-14 bg-gray-900 flex justify-between text-white shrink-0">
              <h3 className="font-bold self-center text-sm">Preview</h3>
              <button
                className="hover:bg-purple-200 cursor-pointer rounded flex items-center justify-center p-1"
                onClick={() => {
                  setExpandPreviewSection(!expandPreviewSection);
                  setIsTestResultOpen(false);
                }}
                title={
                  expandPreviewSection ? "Collapse preview" : "Expand preview"
                }
              >
                {expandPreviewSection ? (
                  <Minimize2 size={15} />
                ) : (
                  <Maximize2 size={15} />
                )}
              </button>
            </nav>

            <div className="flex-1 overflow-auto p-3 text-sm bg-white">
              {data.exercise.language === "html" ? (
                <iframe
                  srcDoc={previewOutput}
                  className="w-full h-full border-0"
                  title="Preview"
                />
              ) : (
                <div className="whitespace-pre-wrap font-mono p-4 bg-gray-100 rounded">
                  {previewOutput || "No output to display"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test results section */}
        <div className="w-full bg-black relative text-white overflow-hidden">
          <div
            className={`px-3 bg-gray-800 hover:bg-gray-900 transition flex items-center justify-between h-12 ${
              testResults || isRunningTests
                ? "cursor-pointer"
                : "cursor-not-allowed"
            }`}
            onClick={() =>
              (testResults || isRunningTests) &&
              setIsTestResultOpen(!isTestResultOpen)
            }
          >
            <div className="flex gap-2">
              <p>Result</p>
              {testResults && (
                <button
                  className={`rounded-md px-2 text-xs py-1 font-bold ${
                    testResults.success
                      ? "bg-green-300 text-black"
                      : "bg-red-300 text-black"
                  }`}
                >
                  {testResults.success ? "Success" : "Failed"}
                </button>
              )}
              {/* {isRunningTests && (
                <span className="animate-pulse">Running tests...</span>
              )} */}
            </div>
            {(testResults || isRunningTests) && (
              <ArrowDown
                size={18}
                className={`text-white cursor-pointer transition ${
                  isTestResultOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            )}
          </div>

          <div
            className={`flex w-full divide-x-3 divide-gray-500 duration-500 ${
              isTestResultOpen ? "h-48" : "h-0"
            }`}
          >
            {/* Test cases */}
            {testResults && (
              <div className="flex-2/6 bg-black text-white overflow-auto">
                <div className="px-3 py-2">
                  <h4 className="font-bold">Test cases</h4>
                  <p>
                    Failed:{" "}
                    <span>
                      {testResults.results.filter((t) => !t.passed).length}
                    </span>
                    , Passed:{" "}
                    <span>
                      {testResults.results.filter((t) => t.passed).length}
                    </span>{" "}
                    of <span>{testResults.results.length}</span>
                  </p>
                </div>

                {testResults.results.map((test, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 px-3 py-2 ${
                      test.passed ? "bg-gray-700" : "bg-red-900"
                    }`}
                  >
                    {test.passed ? (
                      <BsFillCheckCircleFill className="text-green-400" />
                    ) : (
                      <X size={16} className="text-red-400" />
                    )}
                    <span>{test.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Test result and user logs */}
            <div className="flex-4/6 bg-black text-sm flex flex-col">
              <nav className="px-3 border-b border-gray-100/55 space-x-2 flex">
                <button
                  onClick={() => setTerminalType("testResult")}
                  className={`border-white px-2 py-2 transition ${
                    terminalType === "testResult" ? "font-bold border-b-2" : ""
                  }`}
                >
                  Test result
                </button>

                <div className="relative">
                  <button
                    onClick={() => {
                      setTerminalType("userLogs");
                      setShowUserLogsInfo(false);
                    }}
                    className={`border-white px-2 py-2 transition inline-flex gap-2 items-center ${
                      terminalType === "userLogs" ? "font-bold border-b-2" : ""
                    }`}
                  >
                    <span>User logs</span>
                    <IoInformationCircle
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserLogsInfo(!showUserLogsInfo);
                      }}
                    />
                  </button>

                  {showUserLogsInfo && (
                    <div className="absolute top-10 left-0 z-10 bg-white text-black p-2 rounded shadow-lg w-64">
                      <p className="text-xs mb-2">
                        User logs display console outputs from your code
                        execution.
                      </p>
                      <button
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                        onClick={() => setShowUserLogsInfo(false)}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              <div className="overflow-auto flex-1 px-3 py-2 font-mono text-sm">
                {terminalType === "testResult" && testResults && (
                  <div>
                    {testResults.message && (
                      <p className="mb-2 text-yellow-300">
                        {testResults.message}
                      </p>
                    )}

                    {testResults.results.map((test, index) => (
                      <div key={index} className="mb-3">
                        <div
                          className={`flex items-center ${
                            test.passed ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {test.passed ? (
                            <BsCheckCircleFill className="mr-2" />
                          ) : (
                            <X size={16} className="mr-2" />
                          )}
                          {test.passed
                            ? "Your code passed this test"
                            : "Test failed"}
                        </div>

                        {!test.passed && test.error && (
                          <div className="bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap">
                            {test.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {terminalType === "userLogs" && (
                  <div className="whitespace-pre-wrap">
                    {userLogs.length > 0 ? (
                      userLogs.map((log, index) => (
                        <div key={index} className="mb-1">
                          {log}
                        </div>
                      ))
                    ) : (
                      <p>No logs to display</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer controls */}
      <div className="flex items-center bg-white border-t border-gray-200 pl-4 h-14">
        <div className="flex justify-between items-center mt-auto pr-4 h-full flex-1">
          <div className="">Coding Exercise</div>

          <div className="space-x-2 text-sm font-bold">
            <button className="px-4 py-2 rounded bg-[#6d28d2] text-white hover:bg-purple-700 cursor-pointer">
              Next
            </button>
          </div>
        </div>

        {/* Sidebar settings and full screen toggle button */}
        <ControlButtons
          componentRef={componentRef}
          contentType="coding-exercise"
        />
      </div>
    </div>
  );
};

export default CodingExercisePreview;

// const DontTouchnow = () => {
//   return (
//     <div>
//       {/* Preview header */}
//       <div className="p-4 border-b flex justify-between items-center">
//         <h2 className="text-xl font-bold">Preview: {data.exercise.title}</h2>
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//           <X size={24} />
//         </button>
//       </div>

//       {/* Preview content */}
//       <div className="p-4">
//         {/* Render exercise details */}
//         <div className="mb-6">
//           <h3 className="font-bold mb-2">Exercise Details</h3>
//           <p>
//             <strong>Language:</strong> {data.exercise.language}{" "}
//             {data.exercise.version && `(${data.exercise.version})`}
//           </p>
//           <p>
//             <strong>Learning Objective:</strong>{" "}
//             {data.exercise.learningObjective || "Not specified"}
//           </p>
//         </div>

//         {/* Render instructions */}
//         <div className="mb-6">
//           <h3 className="font-bold mb-2">Instructions</h3>
//           <div
//             dangerouslySetInnerHTML={{
//               __html: data.content.instructions || "No instructions provided",
//             }}
//           />
//         </div>

//         {/* Render code files */}
//         <div className="mb-6">
//           <h3 className="font-bold mb-2">Code Files</h3>
//           {data.content.files.map((file) => (
//             <div key={file.id} className="mb-4">
//               <h4 className="font-medium">{file.name}</h4>
//               <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
//                 {file.content}
//               </pre>
//             </div>
//           ))}
//         </div>

//         {/* Render test results if available */}
//         {data.testResults && (
//           <div className="mb-6">
//             <h3 className="font-bold mb-2">Test Results</h3>
//             <div
//               className={`p-3 rounded ${
//                 data.testResults.success ? "bg-green-100" : "bg-red-100"
//               }`}
//             >
//               <p>{data.testResults.message}</p>
//               <ul className="mt-2">
//                 {data.testResults.results.map((result, idx) => (
//                   <li key={idx} className="flex items-center">
//                     {result.passed ? "✓" : "✗"} {result.name}
//                     {result.error && (
//                       <span className="text-red-600 ml-2">
//                         ({result.error})
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// i want to provide you with the preview component. Dont change my styling or structure. its not yet fuctional. i want you to make it consume the data coming from the parent. i also want you to implement the full functionality. the code is pretty self explanatory but i want summarize what i want it to do.

// When we get to preview. it should populate everthing the student need like the instruction, exercise title, the objective. the starter code. so let the hint and solution explanation to be locked untill the user code passes the test or fails the test two times. so then you can make them accessible and the lock icon removed also the cursor will change to pointer. so replace the code editor with actual code editor and make sure all fuctionalities work as user is using the code editor,  it should be show "saving changes.." intead of all changes saved while saving, it should work automatically as user is edits the code. also it should keep udating the line and column as user is typing. the preview shows the code output automatically too. I forgot to mention that the name of the code or program file should be put where index.html is put.

// So student should not be allowed to open the test result untill they click on run test. when test is running the run test botton should show loading icon and the test istestresultopen should be set to false and when it is done, then the test result can now open and student is also allowed to close and open it. the reset just like its name should reset the code content in the code editor to starter code provided by the instructor, but it should display a modal to confirm before resetting, the title of that modal is "reset solution", it should have the x icon for canceling also the content will be "Your code will be deleted. Do you want to reset your solution?" Also add reset and cancel buttons bottom right . if the test all the test is successful or some are successful so populate the test cases with the number of success and failed just like i layed out. the test result show show the success like what is there or show error message and the error if code failed test. also i want the user logs should be whatever user logs from the editor like console.log in js code. when the information icon of the userlog is clicked it should show a small message under it telling the user what user logs displays, it should have dismiss button to dismiss the message.

// I have created the way i want everthing i mentioned about the code editor and the test to look like. i dont know if the ui and functionality is automatically provide from the code editor library. but thats exactly how i want the to look like. Also the success button behind the result test in the test result and cases should only show if the test is successful. also i want that
