import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const conversionData = [
  { decimal: 1, roman: "I" },
  { decimal: 2, roman: "II" },
  { decimal: 3, roman: "III" },
  { decimal: 4, roman: "IV" },
  { decimal: 5, roman: "V" },
  { decimal: 6, roman: "VI" },
  { decimal: 7, roman: "VII" },
  { decimal: 8, roman: "VIII" },
  { decimal: 9, roman: "IX" },
  { decimal: 10, roman: "X" },
  { decimal: 11, roman: "XI" },
  { decimal: 14, roman: "XIV" },
  { decimal: 15, roman: "XV" },
  { decimal: 16, roman: "XVI" },
  { decimal: 19, roman: "XIX" },
  { decimal: 20, roman: "XX" },
  { decimal: 21, roman: "XXI" },
  { decimal: 24, roman: "XXIV" },
  { decimal: 25, roman: "XXV" },
  { decimal: 29, roman: "XXIX" },
  { decimal: 30, roman: "XXX" },
  { decimal: 35, roman: "XXXV" },
  { decimal: 39, roman: "XXXIX" },
  { decimal: 40, roman: "XL" },
  { decimal: 41, roman: "XLI" },
  { decimal: 44, roman: "XLIV" },
  { decimal: 45, roman: "XLV" },
  { decimal: 49, roman: "XLIX" },
  { decimal: 50, roman: "L" },
  { decimal: 51, roman: "LI" },
  { decimal: 55, roman: "LV" },
  { decimal: 56, roman: "LVI" },
  { decimal: 60, roman: "LX" },
  { decimal: 65, roman: "LXV" },
  { decimal: 70, roman: "LXX" },
  { decimal: 75, roman: "LXXV" },
  { decimal: 80, roman: "LXXX" },
  { decimal: 85, roman: "LXXXV" },
  { decimal: 89, roman: "LXXXIX" },
  { decimal: 90, roman: "XC" },
  { decimal: 91, roman: "XCI" },
  { decimal: 95, roman: "XCV" },
  { decimal: 99, roman: "XCIX" },
  { decimal: 100, roman: "C" },
  { decimal: 101, roman: "CI" },
  { decimal: 105, roman: "CV" },
  { decimal: 110, roman: "CX" },
  { decimal: 150, roman: "CL" },
  { decimal: 200, roman: "CC" },
  { decimal: 250, roman: "CCL" },
  { decimal: 300, roman: "CCC" },
  { decimal: 400, roman: "CD" },
  { decimal: 500, roman: "D" },
  { decimal: 600, roman: "DC" },
  { decimal: 700, roman: "DCC" },
  { decimal: 800, roman: "DCCC" },
  { decimal: 900, roman: "CM" },
  { decimal: 1000, roman: "M" },
  { decimal: 1500, roman: "MD" },
  { decimal: 1800, roman: "MDCCC" },
  { decimal: 1900, roman: "MCM" },
  { decimal: 2000, roman: "MM" },
  { decimal: 2500, roman: "MMD" },
  { decimal: 3000, roman: "MMM" },
  { decimal: 3500, roman: "MMMD" },
  { decimal: 3900, roman: "MMMCM" },
  { decimal: 3999, roman: "MMMCMXCIX" }
];

const romanNumeralValues = [
  { symbol: "I", value: 1 },
  { symbol: "V", value: 5 },
  { symbol: "X", value: 10 },
  { symbol: "L", value: 50 },
  { symbol: "C", value: 100 },
  { symbol: "D", value: 500 },
  { symbol: "M", value: 1000 }
];

const subtractiveCombinations = [
  { combination: "IV", value: 4 },
  { combination: "IX", value: 9 },
  { combination: "XL", value: 40 },
  { combination: "XC", value: 90 },
  { combination: "CD", value: 400 },
  { combination: "CM", value: 900 }
];

const romanToDecimal = (roman) => {
  let result = 0;
  let i = 0;

  while (i < roman.length) {
    if (i + 1 < roman.length) {
      const combinedSymbol = roman.slice(i, i + 2);
      const subtractivePair = subtractiveCombinations.find(sc => sc.combination === combinedSymbol);
      
      if (subtractivePair) {
        result += subtractivePair.value;
        i += 2;
        continue;
      }
    }

    const symbol = romanNumeralValues.find(rnv => rnv.symbol === roman[i]);
    result += symbol.value;
    i++;
  }

  return result;
};

const decimalToRoman = (decimal) => {
  const exactMatch = conversionData.find(cd => cd.decimal === decimal);
  if (exactMatch) return exactMatch.roman;

  let result = "";
  let remainingValue = decimal;

  for (const { decimal: value, roman } of conversionData.sort((a, b) => b.decimal - a.decimal)) {
    while (remainingValue >= value) {
      result += roman;
      remainingValue -= value;
    }
  }

  return result;
};

const isValidRoman = (input) => {
  const regex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  return regex.test(input);
};

const isValidDecimal = (input) => {
  const num = parseInt(input, 10);
  return !isNaN(num) && num > 0 && num <= 3999;
};

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRomanToDecimal, setIsRomanToDecimal] = useState(true);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const convertBtnRef = useRef(null);
  const switchBtnRef = useRef(null);
  const clearBtnRef = useRef(null);

  useEffect(() => {
    validateInput(input);
  }, [input, isRomanToDecimal]);

  const validateInput = (value) => {
    if (value === "") {
      setError("");
      return;
    }

    if (isRomanToDecimal) {
      if (!isValidRoman(value)) {
        setError("Invalid Roman numeral");
      } else {
        setError("");
      }
    } else {
      if (!isValidDecimal(value)) {
        setError("Invalid decimal number (1-3999 only)");
      } else {
        setError("");
      }
    }
  };

  const handleConvert = () => {
    if (error) return;

    if (isRomanToDecimal) {
      setOutput(romanToDecimal(input).toString());
    } else {
      setOutput(decimalToRoman(parseInt(input, 10)));
    }
  };

  const handleSwitch = () => {
    setIsRomanToDecimal(!isRomanToDecimal);
    setInput("");
    setOutput("");
    setError("");
    inputRef.current.focus();
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConvert();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        if (document.activeElement === inputRef.current) {
          clearBtnRef.current.focus();
        } else if (document.activeElement === convertBtnRef.current) {
          inputRef.current.focus();
        } else if (document.activeElement === switchBtnRef.current) {
          convertBtnRef.current.focus();
        } else if (document.activeElement === clearBtnRef.current) {
          switchBtnRef.current.focus();
        }
      } else {
        if (document.activeElement === inputRef.current) {
          convertBtnRef.current.focus();
        } else if (document.activeElement === convertBtnRef.current) {
          switchBtnRef.current.focus();
        } else if (document.activeElement === switchBtnRef.current) {
          clearBtnRef.current.focus();
        } else if (document.activeElement === clearBtnRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white sm:p-6 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-700">
            {isRomanToDecimal ? "Roman to Decimal" : "Decimal to Roman"} Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder={isRomanToDecimal ? "Enter Roman numeral" : "Enter decimal number"}
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              className="w-full"
              ref={inputRef}
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleConvert}
              disabled={!input || error}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              ref={convertBtnRef}
            >
              Convert
            </Button>
            <Button
              onClick={handleSwitch}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              ref={switchBtnRef}
            >
              Switch
            </Button>
          </div>
          <Input
            type="text"
            placeholder="Result"
            value={output}
            readOnly
            className="w-full"
          />
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
            ref={clearBtnRef}
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}