"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Image, Code, Bold, Italic } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface QuestionFormProps {
  onAddQuestion: (question: any) => void;
  onCancel: () => void;
  initialQuestion?: any;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onAddQuestion,
  onCancel,
  initialQuestion
}) => {
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState<Array<{ text: string, explanation: string }>>([
    { text: '', explanation: '' },
    { text: '', explanation: '' },
    { text: '', explanation: '' },
    { text: '', explanation: '' }
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [relatedLecture, setRelatedLecture] = useState('');
  const [error, setError] = useState('');
  const [hoveredAnswerIndex, setHoveredAnswerIndex] = useState<number | null>(null);
  
  // References to Quill editors
  const questionQuillRef = useRef<ReactQuill>(null);
  const answerQuillRefs = useRef<{[key: number]: ReactQuill | null}>({});

  // Basic toolbar configuration - same for both question and answers
  const quillModules = {
    toolbar: [
      ['bold', 'italic'],
      ['image', 'code']
    ]
  };

  const quillFormats = [
    'bold', 'italic', 'code', 'image'
  ];

  useEffect(() => {
    // If we're editing an existing question, populate the form
    if (initialQuestion) {
      setQuestionText(initialQuestion.text || '');
      setAnswers(initialQuestion.answers || [
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' }
      ]);
      setCorrectAnswerIndex(initialQuestion.correctAnswerIndex || null);
      setRelatedLecture(initialQuestion.relatedLecture || '');
    }
  }, [initialQuestion]);

  const addAnswer = () => {
    if (answers.length < 15) {
      setAnswers([...answers, { text: '', explanation: '' }]);
    }
  };

  const removeAnswer = (indexToRemove: number) => {
    if (answers.length <= 2) {
      setError('Questions must have at least 2 answers');
      return;
    }
    
    const newAnswers = answers.filter((_, index) => index !== indexToRemove);
    setAnswers(newAnswers);
    
    // Adjust the correct answer index if necessary
    if (correctAnswerIndex === indexToRemove) {
      setCorrectAnswerIndex(null);
    } else if (correctAnswerIndex !== null && correctAnswerIndex > indexToRemove) {
      setCorrectAnswerIndex(correctAnswerIndex - 1);
    }
  };

  const updateAnswerText = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = value;
    setAnswers(newAnswers);
    
    // If this is the last answer and it's being filled, add another empty answer
    if (index === answers.length - 1 && value.trim() !== '' && answers.length < 15) {
      addAnswer();
    }
  };

  const updateAnswerExplanation = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index].explanation = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Validate form
    if (!questionText.trim()) {
      setError('Question text is required');
      return;
    }

    // Filter out empty answers
    const validAnswers = answers.filter(answer => answer.text.trim() !== '');
    
    if (validAnswers.length < 2) {
      setError('At least 2 answers are required');
      return;
    }

    if (correctAnswerIndex === null) {
      setError('You must select a correct answer');
      return;
    }

    // Create the question object
    const question = {
      text: questionText,
      answers: validAnswers,
      correctAnswerIndex,
      relatedLecture,
      type: 'multiple-choice'
    };

    onAddQuestion(question);
  };

  // Format handlers for custom toolbar
  const handleQuestionBold = () => {
    if (questionQuillRef.current) {
      const quill = questionQuillRef.current.getEditor();
      const selection = quill.getSelection();
      if (selection) {
        // Check if selected text is already bold
        const format = quill.getFormat(selection);
        quill.format('bold', !format.bold);
      } else {
        // If no selection, toggle for future input
        const format = quill.getFormat();
        quill.format('bold', !format.bold);
      }
    }
  };

  const handleQuestionItalic = () => {
    if (questionQuillRef.current) {
      const quill = questionQuillRef.current.getEditor();
      const selection = quill.getSelection();
      if (selection) {
        const format = quill.getFormat(selection);
        quill.format('italic', !format.italic);
      } else {
        const format = quill.getFormat();
        quill.format('italic', !format.italic);
      }
    }
  };

  const handleQuestionImage = () => {
    // Create and trigger file input
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = () => {
      if (input.files && input.files[0] && questionQuillRef.current) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const quill = questionQuillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection() || { index: 0, length: 0 };
            quill.insertEmbed(range.index, 'image', e.target?.result);
          }
        };
        
        reader.readAsDataURL(file);
      }
    };
  };

  const handleQuestionCode = () => {
    if (questionQuillRef.current) {
      const quill = questionQuillRef.current.getEditor();
      const selection = quill.getSelection();
      if (selection) {
        const format = quill.getFormat(selection);
        quill.format('code', !format.code);
      } else {
        const format = quill.getFormat();
        quill.format('code', !format.code);
      }
    }
  };

  // Answer format handlers
  const handleAnswerBold = (index: number) => {
    const quill = answerQuillRefs.current[index]?.getEditor();
    if (quill) {
      const selection = quill.getSelection();
      if (selection) {
        const format = quill.getFormat(selection);
        quill.format('bold', !format.bold);
      } else {
        const format = quill.getFormat();
        quill.format('bold', !format.bold);
      }
    }
  };

  const handleAnswerItalic = (index: number) => {
    const quill = answerQuillRefs.current[index]?.getEditor();
    if (quill) {
      const selection = quill.getSelection();
      if (selection) {
        const format = quill.getFormat(selection);
        quill.format('italic', !format.italic);
      } else {
        const format = quill.getFormat();
        quill.format('italic', !format.italic);
      }
    }
  };

  const handleAnswerCode = (index: number) => {
    const quill = answerQuillRefs.current[index]?.getEditor();
    if (quill) {
      const selection = quill.getSelection();
      if (selection) {
        const format = quill.getFormat(selection);
        quill.format('code', !format.code);
      } else {
        const format = quill.getFormat();
        quill.format('code', !format.code);
      }
    }
  };

  return (
    <div className="border border-gray-200 p-2 xl:p-6 mb-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Add Multiple Choice</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="bg-white p-2 border-b border-gray-300 flex items-center space-x-2">
            <button 
              onClick={handleQuestionBold} 
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Bold"
            >
              <Bold size={16} />
            </button>
            <button 
              onClick={handleQuestionItalic} 
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Italic"
            >
              <Italic size={16} />
            </button>
            <button 
              onClick={handleQuestionImage} 
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Insert Image"
            >
              <Image size={16} />
            </button>
            <button 
              onClick={handleQuestionCode} 
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Insert Code"
            >
              <Code size={16} />
            </button>
          </div>
          <div className="p-3">
            <ReactQuill
              ref={questionQuillRef}
              value={questionText}
              onChange={setQuestionText}
              modules={{toolbar: false}}
              formats={quillFormats}
              placeholder="Enter your question"
              theme="snow"
              className="no-toolbar-editor"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Answers</label>
        {answers.map((answer, index) => (
          <div 
            key={index} 
            className="mb-4"
            onMouseEnter={() => setHoveredAnswerIndex(index)}
            onMouseLeave={() => setHoveredAnswerIndex(null)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id={`answer-${index}`}
                name="correctAnswer"
                checked={correctAnswerIndex === index}
                onChange={() => setCorrectAnswerIndex(index)}
                className="mt-6 mr-2"
              />
              <div className="flex-1">
                <div className="mb-2 relative">
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <div className="bg-white p-2 border-b border-gray-300 flex items-center space-x-2">
                      <button 
                        onClick={() => handleAnswerBold(index)} 
                        className="p-1 hover:bg-gray-100 rounded"
                        aria-label="Bold"
                      >
                        <Bold size={16} />
                      </button>
                      <button 
                        onClick={() => handleAnswerItalic(index)} 
                        className="p-1 hover:bg-gray-100 rounded"
                        aria-label="Italic"
                      >
                        <Italic size={16} />
                      </button>
                      <button 
                        onClick={() => handleAnswerCode(index)} 
                        className="p-1 hover:bg-gray-100 rounded"
                        aria-label="Insert Code"
                      >
                        <Code size={16} />
                      </button>
                    </div>
                    <div className="p-3">
                      <ReactQuill
                        ref={(el) => { answerQuillRefs.current[index] = el; }}
                        value={answer.text}
                        onChange={(value) => updateAnswerText(index, value)}
                        modules={{toolbar: false}}
                        formats={quillFormats}
                        placeholder="Add an answer."
                        theme="snow"
                        className="no-toolbar-editor"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => removeAnswer(index)}
                    className={`absolute right-2 top-2 text-gray-500 hover:text-red-600 ${hoveredAnswerIndex === index ? 'visible' : 'invisible'}`}
                    aria-label="Delete answer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={answer.explanation}
                    onChange={(e) => updateAnswerExplanation(index, e.target.value)}
                    placeholder="Explain why this is or isn't the best answer."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm text-gray-600"
                  />
                  <div className="absolute right-2 top-2 text-xs text-gray-500">
                    {answer.explanation.length}/600
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-xs text-gray-500 mt-2">
          Write up to 15 possible answers and indicate which one is the best.
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Related Lecture</label>
        <select
          value={relatedLecture}
          onChange={(e) => setRelatedLecture(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">-- Select One --</option>
          {/* Lecture options would be populated here */}
        </select>
        <div className="text-xs text-gray-500 mt-1">
          Select a related video lecture to help students answer this question.
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Save
        </button>
      </div>

      <style jsx>{`
        /* Custom styling for Quill without toolbar */
        :global(.no-toolbar-editor .ql-container) {
          border: none;
        }
        
        :global(.no-toolbar-editor .ql-toolbar) {
          display: none;
        }
        
        :global(.no-toolbar-editor .ql-editor) {
          padding: 0;
          min-height: 40px;
        }
      `}</style>
    </div>
  );
};

export default QuestionForm;