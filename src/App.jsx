import React, { useReducer, useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Copy, Check, Plus, Minus, RotateCcw, RotateCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState = {
  grid: [['Header 1', 'Header 2'], ['', '']],
  alignments: ['left', 'left'],
  history: [],
  future: [],
};

function reducer(state, action) {
  let newState;
  switch (action.type) {
    case 'UPDATE_CELL':
      newState = {
        ...state,
        grid: state.grid.map((row, i) =>
          i === action.row ? row.map((cell, j) => (j === action.col ? action.value : cell)) : row
        ),
      };
      break;
    case 'ADD_ROW':
      newState = {
        ...state,
        grid: [...state.grid, new Array(state.grid[0].length).fill('')],
      };
      break;
    case 'ADD_COLUMN':
      newState = {
        ...state,
        grid: state.grid.map(row => [...row, '']),
        alignments: [...state.alignments, 'left'],
      };
      break;
    case 'REMOVE_ROW':
      if (state.grid.length > 1) {
        newState = {
          ...state,
          grid: state.grid.slice(0, -1),
        };
      } else {
        return state;
      }
      break;
    case 'REMOVE_COLUMN':
      if (state.grid[0].length > 1) {
        newState = {
          ...state,
          grid: state.grid.map(row => row.slice(0, -1)),
          alignments: state.alignments.slice(0, -1),
        };
      } else {
        return state;
      }
      break;
    case 'UPDATE_ALIGNMENT':
      newState = {
        ...state,
        alignments: state.alignments.map((align, index) => 
          index === action.column ? action.alignment : align
        ),
      };
      break;
    case 'UNDO':
      if (state.history.length > 0) {
        const previous = state.history[state.history.length - 1];
        return {
          ...previous,
          history: state.history.slice(0, -1),
          future: [state, ...state.future],
        };
      }
      return state;
    case 'REDO':
      if (state.future.length > 0) {
        const next = state.future[0];
        return {
          ...next,
          history: [...state.history, state],
          future: state.future.slice(1),
        };
      }
      return state;
    default:
      return state;
  }
  return {
    ...newState,
    history: [...state.history, state],
    future: [],
  };
}

function TableGrid({ state, dispatch }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {state.alignments.map((alignment, index) => (
              <th key={index} className="p-2">
                <Select
                  value={alignment}
                  onValueChange={(value) => dispatch({ type: 'UPDATE_ALIGNMENT', column: index, alignment: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Align" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.grid.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="p-2">
                  <Input
                    value={cell}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_CELL', row: i, col: j, value: e.target.value })
                    }
                    className="w-full"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarkdownOutput({ markdown, isPreview }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const escapedMarkdown = markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  return (
    <div className="relative bg-white rounded-lg shadow">
      <Button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      {isPreview ? (
        <div 
          className="p-4 rounded-lg overflow-x-auto" 
          dangerouslySetInnerHTML={{ __html: escapedMarkdown }}
        />
      ) : (
        <pre className="p-4 rounded-lg overflow-x-auto">
          <code>{markdown}</code>
        </pre>
      )}
    </div>
  );
}

function Switch({ isOn, handleToggle }) {
  return (
    <div 
      onClick={handleToggle}
      className={`flex items-center w-14 h-8 rounded-full p-1 cursor-pointer ${
        isOn ? 'bg-blue-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  );
}

function generateMarkdownTable(grid, alignments) {
  if (grid.length === 0 || grid[0].length === 0) {
    throw new Error("Table must have at least one row and one column");
  }

  const escapeCell = (cell) => cell.replace(/\|/g, '\\|').replace(/\*/g, '\\*').replace(/_/g, '\\_');

  const headerRow = grid[0].map(escapeCell).join(' | ');
  const separatorRow = alignments.map(align => {
    switch (align) {
      case 'left': return ':---';
      case 'center': return ':---:';
      case 'right': return '---:';
      default: return '---';
    }
  }).join(' | ');
  const bodyRows = grid.slice(1).map(row => row.map(escapeCell).join(' | '));

  return `| ${headerRow} |\n| ${separatorRow} |\n${bodyRows.map(row => `| ${row} |`).join('\n')}`;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState(null);
  const [markdown, setMarkdown] = useState('');

  const handleGenerateTable = useCallback(() => {
    try {
      const generatedMarkdown = generateMarkdownTable(state.grid, state.alignments);
      setMarkdown(generatedMarkdown);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [state.grid, state.alignments]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4 sm:p-6 md:p-8">
      <Card className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-600">Markdown Table Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <TableGrid state={state} dispatch={dispatch} />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <Button onClick={() => dispatch({ type: 'ADD_ROW' })} className="w-full bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-1 h-4 w-4" /> <span className="truncate">Add Row</span>
            </Button>
            <Button onClick={() => dispatch({ type: 'REMOVE_ROW' })} className="w-full bg-red-500 hover:bg-red-600">
              <Minus className="mr-1 h-4 w-4" /> <span className="truncate">Remove Row</span>
            </Button>
            <Button onClick={() => dispatch({ type: 'ADD_COLUMN' })} className="w-full bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-1 h-4 w-4" /> <span className="truncate">Add Column</span>
            </Button>
            <Button onClick={() => dispatch({ type: 'REMOVE_COLUMN' })} className="w-full bg-red-500 hover:bg-red-600">
              <Minus className="mr-1 h-4 w-4" /> <span className="truncate">Remove Column</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button onClick={() => dispatch({ type: 'UNDO' })} className="flex-1 sm:flex-auto bg-gray-500 hover:bg-gray-600">
                <RotateCcw className="mr-1 h-4 w-4" /> <span className="truncate">Undo</span>
              </Button>
              <Button onClick={() => dispatch({ type: 'REDO' })} className="flex-1 sm:flex-auto bg-gray-500 hover:bg-gray-600">
                <RotateCw className="mr-1 h-4 w-4" /> <span className="truncate">Redo</span>
              </Button>
            </div>
            <Button onClick={handleGenerateTable} className="w-full sm:w-auto bg-green-500 hover:bg-green-600">
              Generate Table
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {markdown && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Preview Markdown</span>
                <Switch isOn={isPreview} handleToggle={() => setIsPreview(!isPreview)} />
              </div>
              <MarkdownOutput markdown={markdown} isPreview={isPreview} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}