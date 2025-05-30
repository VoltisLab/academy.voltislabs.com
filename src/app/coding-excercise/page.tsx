import React from 'react';

const CodingExerciseKeysMap: React.FC = () => {
  const shortcutSections = [
    {
      title: 'Main',
      shortcuts: [
        { action: 'Run tests', windows: 'Ctrl-F9', mac: 'Ctrl-F9' },
        { action: 'Run emmet', windows: 'Tab', mac: 'Tab' },
        { action: 'Undo', windows: 'Ctrl-Z', mac: 'Command-Z' },
        { action: 'Redo', windows: 'Ctrl-Shift-Z, Ctrl-Y', mac: 'Command-Shift-Z, Command-Y' },
        { action: 'Toggle comment', windows: 'Ctrl-/', mac: 'Command-/' },
        { action: 'Indent', windows: 'Tab', mac: 'Tab' },
        { action: 'Outdent', windows: 'Shift-Tab', mac: 'Shift-Tab' },
      ]
    },
    {
      title: 'Line Operations',
      shortcuts: [
        { action: 'Remove Line', windows: 'Ctrl-D', mac: 'Command-D' },
        { action: 'Copy lines down', windows: 'Alt-Shift-Down', mac: 'Command-Option-Down' },
        { action: 'Copy lines up', windows: 'Alt-Shift-Up', mac: 'Command-Option-Up' },
        { action: 'Move lines down', windows: 'Alt-Shift-Down', mac: 'Option-Down' },
        { action: 'Move lines up', windows: 'Alt-Shift-Up', mac: 'Option-Up' },
        { action: 'Remove to line end', windows: 'Alt-Delete', mac: 'Ctrl-K' },
        { action: 'Remove to line start', windows: 'Alt-Backspace', mac: 'Command-Backspace' },
        { action: 'Remove word left', windows: 'Ctrl-Backspace', mac: 'Option-Backspace, Ctrl-Option-Backspace' },
        { action: 'Remove word right', windows: 'Ctrl-Delete', mac: 'Option-Delete' },
        { action: 'Split line', windows: '---', mac: 'Ctrl-O' },
      ]
    },
    {
      title: 'Selection',
      shortcuts: [
        { action: 'Select all', windows: 'Ctrl-A', mac: 'Command-A' },
        { action: 'Select left', windows: 'Shift-Left', mac: 'Shift-Left' },
        { action: 'Select right', windows: 'Shift-Right', mac: 'Shift-Right' },
        { action: 'Select word left', windows: 'Ctrl-Shift-Left', mac: 'Option-Shift-Left' },
        { action: 'Select word right', windows: 'Ctrl-Shift-Right', mac: 'Option-Shift-Right' },
        { action: 'Select line start', windows: 'Shift-Home', mac: 'Shift-Home' },
        { action: 'Select line end', windows: 'Shift-End', mac: 'Shift-End' },
        { action: 'Select to line end', windows: 'Alt-Shift-Right', mac: 'Command-Shift-Right' },
        { action: 'Select to line start', windows: 'Alt-Shift-Left', mac: 'Command-Shift-Left' },
        { action: 'Select up', windows: 'Shift-Up', mac: 'Shift-Up' },
        { action: 'Select down', windows: 'Shift-Down', mac: 'Shift-Down' },
        { action: 'Select page up', windows: 'Shift-PageUp', mac: 'Shift-PageUp' },
        { action: 'Select page down', windows: 'Shift-PageDown', mac: 'Shift-PageDown' },
        { action: 'Select to start', windows: 'Ctrl-Shift-Home', mac: 'Command-Shift-Up' },
        { action: 'Select to end', windows: 'Ctrl-Shift-End', mac: 'Command-Shift-Down' },
        { action: 'Duplicate selection', windows: 'Ctrl-Shift-D', mac: 'Command-Shift-D' },
        { action: 'Select to matching bracket', windows: 'Ctrl-Shift-P', mac: '---' },
      ]
    },
    {
      title: 'Multi-cursor',
      shortcuts: [
        { action: 'Add multi-cursor above', windows: 'Ctrl-Alt-Up', mac: 'Ctrl-Option-Up' },
        { action: 'Add multi-cursor below', windows: 'Ctrl-Alt-Down', mac: 'Ctrl-Option-Down' },
        { action: 'Add next occurrence to multi-selection', windows: 'Ctrl-Alt-Right', mac: 'Ctrl-Option-Right' },
        { action: 'Add previous occurrence to multi-selection', windows: 'Ctrl-Alt-Left', mac: 'Ctrl-Option-Left' },
        { action: 'Move multi-cursor from current line to the line above', windows: 'Ctrl-Alt-Shift-Up', mac: 'Ctrl-Option-Shift-Up' },
        { action: 'Move multi-cursor from current line to the line below', windows: 'Ctrl-Alt-Shift-Down', mac: 'Ctrl-Option-Shift-Down' },
        { action: 'Remove current occurrence from multi-selection and move to next', windows: 'Ctrl-Alt-Shift-Right', mac: 'Ctrl-Option-Shift-Right' },
        { action: 'Remove current occurrence from multi-selection and move to previous', windows: 'Ctrl-Alt-Shift-Left', mac: 'Ctrl-Option-Shift-Left' },
        { action: 'Select all from multi-selection', windows: 'Ctrl-Shift-L', mac: 'Ctrl-Shift-L' },
      ]
    },
    {
      title: 'Go to',
      shortcuts: [
        { action: 'Go to left', windows: 'Left', mac: 'Left, Ctrl-B' },
        { action: 'Go to right', windows: 'Right', mac: 'Right, Ctrl-F' },
        { action: 'Go to word left', windows: 'Ctrl-Left', mac: 'Option-Left' },
        { action: 'Go to word right', windows: 'Ctrl-Right', mac: 'Option-Right' },
        { action: 'Go line up', windows: 'Up', mac: 'Up, Ctrl-P' },
        { action: 'Go line down', windows: 'Down', mac: 'Down, Ctrl-N' },
        { action: 'Go to line start', windows: 'Alt-Left, Home', mac: 'Command-Left, Home, Ctrl-A' },
        { action: 'Go to line end', windows: 'Alt-Right, End', mac: 'Command-Right, End, Ctrl-E' },
        { action: 'Go to page up', windows: 'PageUp', mac: 'Option-PageUp' },
        { action: 'Go to page down', windows: 'PageDown', mac: 'Option-PageDown, Ctrl-V' },
        { action: 'Go to start', windows: 'Ctrl-Home', mac: 'Command-Home, Command-Up' },
        { action: 'Go to end', windows: 'Ctrl-End', mac: 'Command-End, Command-Down' },
        { action: 'Scroll line down', windows: 'Ctrl-Down', mac: 'Command-Down' },
        { action: 'Scroll line up', windows: 'Ctrl-Up', mac: '---' },
        { action: 'Go to matching bracket', windows: 'Ctrl-P', mac: '---' },
        { action: 'Scroll page down', windows: '---', mac: 'Option-PageDown' },
      ]
    },
    {
      title: 'Find/Replace',
      shortcuts: [
        { action: 'Find', windows: 'Ctrl-F', mac: 'Command-F' },
        { action: 'Find next', windows: 'Ctrl-K', mac: 'Command-G' },
        { action: 'Find previous', windows: 'Ctrl-Shift-K', mac: 'Command-Shift-G' },
      ]
    },
    {
      title: 'Folding',
      shortcuts: [
        { action: 'Fold selection', windows: 'Alt-L, Ctrl-F1', mac: 'Command-Option-L, Command-F1' },
        { action: 'Unfold', windows: 'Alt-Shift-L, Ctrl-Shift-F1', mac: 'Command-Option-Shift-L, Command-Shift-F1' },
        { action: 'Fold all', windows: 'Alt-0', mac: 'Command-Option-0' },
        { action: 'Unfold all', windows: 'Alt-Shift-0', mac: 'Command-Option-Shift-0' },
      ]
    },
    {
      title: 'Other',
      shortcuts: [
        { action: 'Transpose letters', windows: 'Ctrl-T', mac: 'Ctrl-T' },
        { action: 'Change to lower case', windows: 'Ctrl-Shift-U', mac: 'Ctrl-Shift-U' },
        { action: 'Change to upper case', windows: 'Ctrl-U', mac: 'Ctrl-U' },
        { action: 'Overwrite', windows: 'Insert', mac: 'Insert' },
        { action: 'Macros replay', windows: 'Ctrl-Shift-E', mac: 'Command-Shift-E' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 mt-16">
        <h1 className="text-lg font-bold text-center mb-8">Keyboard shortcuts of coding exercise</h1>
        
        <div className="space-y-8">
          {shortcutSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="text-lg font-bold mb-4 text-gray-800">{section.title}</h2>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b border-gray-300">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b border-gray-300">Windows/Linux</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 border-b border-gray-300">Mac</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.shortcuts.map((shortcut, index) => (
                      <tr key={index} >
                        <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">{shortcut.action}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">{shortcut.windows}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">{shortcut.mac}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodingExerciseKeysMap;