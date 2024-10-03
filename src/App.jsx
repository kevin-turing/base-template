import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { cn } from "@/lib/utils";

const conversionData = {
  // ... (your data here, shortened for brevity)
};

const romanNumeralValues = [
  { "symbol": "M", "value": 1000 },
  { "symbol": "D", "value": 500 },
  { "symbol": "C", "value": 100 },
  { "symbol": "L", "value": 50 },
  { "symbol": "X", "value": 10 },
  { "symbol": "V", "value": 5 },
  { "symbol": "I", "value": 1 }
];

function RomanToDecimal({ roman }) {
  let total = 0;
  let prevValue = 0;
  for (let i = roman.length - 1; i >= 0; i--) {
    const current = romanNumeralValues.find(v => v.symbol === roman[i]).value;
    if (current >= prevValue) {
      total += current;
    } else {
      total -= current;
    }
    prevValue = current;
  }
  return total;
}

function DecimalToRoman({ decimal }) {
  let result = '';
  for (let i of romanNumeralValues) {
    while (decimal >= i.value) {
      result += i.symbol;
      decimal -= i.value;
    }
  }
  return result;
}

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRoman, setIsRoman] = useState(true);
  const [error, setError] = useState('');

  const validateInput = (value) => {
    if (isRoman) {
      if (!/^[MDCLXVI]+$/i.test(value)) {
        setError("Only Roman numerals (I, V, X, L, C, D, M) are allowed.");
        return false;
      }
    } else {
      if (!/^\d+$/.test(value) || parseInt(value) < 1 || parseInt(value) > 3999) {
        setError("Enter a number between 1 and 3999.");
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleConvert = () => {
    if (validateInput(input)) {
      if (isRoman) {
        setOutput(RomanToDecimal(input).toString());
      } else {
        setOutput(DecimalToRoman({ decimal: parseInt(input) }));
      }
    }
  };

  const handleSwitch = () => {
    setIsRoman(!isRoman);
    setInput('');
    setOutput('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center p-4">
      <Card className="w-full max-w-sm mt-10">
        <CardHeader>
          <CardTitle>Roman Numeral Converter</CardTitle>
          <CardDescription>Convert between Roman numerals and decimal numbers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value.toUpperCase())} 
            placeholder={isRoman ? "Enter Roman Numeral" : "Enter Decimal Number"}
            className="mb-2"
            onKeyDown={(e) => { if (e.key === 'Enter') handleConvert(); }}
          />
          <div className="text-sm text-red-500 mb-2">{error}</div>
          <Input 
            value={output} 
            readOnly 
            placeholder="Converted Value" 
            className="mb-4"
          />
          <Button onClick={handleConvert} className="w-full mb-2">Convert</Button>
          <Button variant="outline" onClick={handleSwitch} className="w-full mb-2">Switch</Button>
          <Button variant="secondary" onClick={handleClear} className="w-full">Clear</Button>
        </CardContent>
      </Card>
    </div>
  );
}