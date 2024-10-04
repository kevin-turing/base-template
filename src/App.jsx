import React, { useState, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [grid, setGrid] = useState(Array(2).fill().map(() => Array(2).fill('')));
  const [viewMode, setViewMode] = useState('preview');
  const [history, setHistory] = useState([grid]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentGrid = history[historyIndex];

  const updateCell = (row, col, value) => {
    const newGrid = currentGrid.map((r, ri) => 
      ri === row ? r.map((cell, ci) => ci === col ? value : cell) : r
    );
    updateHistory(newGrid);
  };

  const addRow = () => {
    const newGrid = [...currentGrid, Array(currentGrid[0].length).fill('')];
    updateHistory(newGrid);
  };

  const addColumn = () => {
    const newGrid = currentGrid.map(row => [...row, '']);
    updateHistory(newGrid);
  };

  const removeRow = () => {
    if (currentGrid.length > 1) {
      updateHistory(currentGrid.slice(0, -1));
    } else {
      alert("Cannot remove the last row.");
    }
  };

  const removeColumn = () => {
    if (currentGrid[0] && currentGrid[0].length > 1) {
      updateHistory(currentGrid.map(row => row.slice(0, -1)));
    } else {
      alert("Cannot remove the last column.");
    }
  };

  const updateHistory = (newGrid) => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newGrid]);
    setHistoryIndex(newHistory.length);
  };

  const undo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const redo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const generateMarkdown = () => {
    const escapeMarkdown = (text) => text.replace(/[|*_]/g, '\\$&');
    const headers = currentGrid[0].map(escapeMarkdown);
    const alignments = currentGrid[0].map(() => ':---');
    const rows = currentGrid.slice(1).map(row => row.map(escapeMarkdown));

    return `| ${headers.join(' | ')} |\n| ${alignments.join(' | ')} |\n` +
           rows.map(row => `| ${row.join(' | ')} |`).join('\n');
  };

  const markdown = useMemo(generateMarkdown, [currentGrid]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4 sm:p-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold">Markdown Table Generator</h1>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button onClick={addRow}>Add Row</Button>
            <Button onClick={addColumn}>Add Column</Button>
            <Button onClick={removeRow} variant="destructive">Remove Row</Button>
            <Button onClick={removeColumn} variant="destructive">Remove Column</Button>
          </div>
          <div className="overflow-x-auto">
            <TableGrid grid={currentGrid} updateCell={updateCell} />
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between mb-4">
            <Button onClick={() => setViewMode('raw')}>Raw Markdown</Button>
            <Button onClick={() => setViewMode('preview')}>Preview</Button>
            <Button onClick={undo} disabled={historyIndex === 0}>Undo</Button>
            <Button onClick={redo} disabled={historyIndex === history.length - 1}>Redo</Button>
          </div>
          <div className="p-4 border rounded-lg">
            {viewMode === 'raw' ? 
              <textarea 
                value={markdown} 
                readOnly 
                className="w-full h-64 bg-gray-100 p-2 rounded"
              /> : 
              <ReactMarkdown>{markdown}</ReactMarkdown>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TableGrid({ grid, updateCell }) {
  return (
    <table className="w-full table-auto border-collapse">
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex} className="border p-2">
                <Input 
                  value={cell} 
                  onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)} 
                  placeholder={`Cell ${rowIndex},${colIndex}`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}