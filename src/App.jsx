import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const conversionData = {
  // Your conversion data here...
};

const romanToDecimal = (roman) => {
  let result = 0;
  let prevValue = 0;
  for (let i = roman.length - 1; i >= 0; i--) {
    const current = conversionData.romanNumeralValues.find(r => r.symbol === roman[i]).value;
    if (current < prevValue) {
      result -= current;
    } else {
      result += current;
    }
    prevValue = current;
  }
  return result;
};

const decimalToRoman = (num) => {
  let result = '';
  for (let i of conversionData.conversionData.slice().reverse()) {
    while (num >= i.decimal) {
      result += i.roman;
      num -= i.decimal;
    }
  }
  return result;
};

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRoman, setIsRoman] = useState(true);

  const convert = () => {
    if (isRoman) {
      setOutput(romanToDecimal(input).toString());
    } else {
      const num = parseInt(input, 10);
      if (num > 0 && num < 4000) {
        setOutput(decimalToRoman(num));
      } else {
        setOutput("Number out of range");
      }
    }
  };

  const clearFields = () => {
    setInput('');
    setOutput('');
  };

  const switchFields = () => {
    setIsRoman(!isRoman);
    setInput(output);
    setOutput('');
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (isRoman) {
      value = value.toUpperCase().replace(/[^IVXLCDM]/g, '');
    } else {
      value = value.replace(/[^0-9]/g, '');
    }
    setInput(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-4">
          <Input 
            value={input} 
            onChange={handleInputChange} 
            placeholder={isRoman ? "Enter Roman Numeral" : "Enter Decimal Number"}
          />
          <div className="flex justify-between">
            <Button onClick={convert}>Convert</Button>
            <Button onClick={switchFields}>Switch</Button>
            <Button onClick={clearFields} variant="destructive">Clear</Button>
          </div>
          <Input 
            value={output} 
            readOnly 
            className="text-center"
            placeholder="Converted Value"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;