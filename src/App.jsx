// App.jsx
import React, { useState, useReducer, useCallback } from 'react';
import { Button, Input, Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Reducer for managing grid state
const gridReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ROW':
      return [...state, Array(state[0]?.length || 2).fill('')];
    case 'REMOVE_ROW':
      return state.length > 1 ? state.slice(0, -1) : state;
    case 'ADD_COLUMN':
      return state.map(row => [...row, '']);
    case 'REMOVE_COLUMN':
      return state[0].length > 1 ? state.map(row => row.slice(0, -1)) : state;
    case 'UPDATE_CELL':
      return state.map((row, i) => 
        i === action.row ? row.map((cell, j) => j === action.col ? action.value : cell) : row
      );
    case 'UNDO':
      return action.prevState;
    default:
      return state;
  }
};

// Function to escape markdown special characters
const escapeMarkdown = (text) => {
  return text.replace(/([_*|[\]<>])/g, '\\$1');
};

function App() {
  const [grid, dispatch] = useReducer(gridReducer, [["", ""], ["", ""]]);
  const [history, setHistory] = useState([JSON.stringify([["", ""], ["", ""]])]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState('preview');

  const handleCellChange = useCallback((value, row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[row][col] = value;
    dispatch({ type: 'UPDATE_CELL', row, col, value });
    updateHistory(newGrid);
  }, [grid]);

  const updateHistory = (newState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newState));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = () => {
    if (canUndo) setHistoryIndex(historyIndex - 1);
    dispatch({ type: 'UNDO', prevState: JSON.parse(history[historyIndex - 1]) });
  };

  const redo = () => {
    if (canRedo) setHistoryIndex(historyIndex + 1);
    dispatch({ type: 'UNDO', prevState: JSON.parse(history[historyIndex + 1]) });
  };

  const generateMarkdown = () => {
    return grid.map((row, idx) => 
      `| ${row.map(escapeMarkdown).join(' | ')} |\n${idx === 0 ? `|${' --- |'.repeat(row.length)}` : ''}`
    ).join('\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
      <Card className="max-w-4xl mx-auto">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Markdown Table Generator</h1>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button onClick={() => dispatch({ type: 'ADD_ROW' })}>Add Row</Button>
            <Button onClick={() => dispatch({ type: 'REMOVE_ROW' })} disabled={grid.length <= 1}>Remove Row</Button>
            <Button onClick={() => dispatch({ type: 'ADD_COLUMN' })}>Add Column</Button>
            <Button onClick={() => dispatch({ type: 'REMOVE_COLUMN' })} disabled={grid[0]?.length <= 1}>Remove Column</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl mb-2">Edit Table</h2>
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex mb-2">
                  {row.map((cell, colIndex) => (
                    <Input 
                      key={colIndex} 
                      value={cell}
                      onChange={(e) => handleCellChange(e.target.value, rowIndex, colIndex)}
                      className="mr-2 flex-grow"
                    />
                  ))}
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl mb-2">Output</h2>
              <Button onClick={() => setViewMode(viewMode === 'preview' ? 'raw' : 'preview')}>
                {viewMode === 'preview' ? 'Show Raw Markdown' : 'Preview Markdown'}
              </Button>
              {viewMode === 'preview' ? (
                <div className="prose p-4 border rounded" dangerouslySetInnerHTML={{__html: generateMarkdown()}} />
              ) : (
                <textarea readOnly value={generateMarkdown()} className="w-full h-40 p-2 border rounded" />
              )}
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button onClick={undo} disabled={!canUndo}>Undo</Button>
            <Button onClick={redo} disabled={!canRedo}>Redo</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;