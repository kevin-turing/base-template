import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Gauge } from 'react-gauge-component';

const data = {
  //... [Insert your data here as provided in the prompt]
};

const App = () => {
  const [formData, setFormData] = useState({
    age: 20, sex: 'Male', height: 160, weight: 70, 
    systolicBP: 120, diastolicBP: 80,
    totalCholesterol: 200, hdl: 50, ldl: 100,
    smoking: 'Non-smoker', diabetes: 'No diabetes', 
    familyHistory: 'No family history', 
    physicalActivity: 'Moderately active', 
    stressLevel: 'Low stress'
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const calculateRisk = () => {
    // Framingham Risk Score calculation
    let sum = 
      (parseFloat(formData.age) * 0.0799) + 
      (parseFloat(formData.totalCholesterol) * 0.0496) - 
      (parseFloat(formData.hdl) * 0.2767) + 
      (parseFloat(formData.systolicBP) * 0.0181) + 
      (formData.smoking === 'Current smoker' ? 0.5784 : 0) + 
      (formData.diabetes !== 'No diabetes' ? 0.6931 : 0);

    let baseRisk = 1 - Math.pow(0.95, Math.exp(sum - 19.54));
    let riskMultipliers = 1;

    // Calculate risk multipliers from all factors
    for (let key in data) {
      if (key !== 'cholesterol_ranges') {
        let found = data[key].find(item => {
          if (item.min && item.max) {
            return formData[key.replace('_ranges', '')] >= item.min && formData[key.replace('_ranges', '')] <= item.max;
          }
          return item.category === formData[key.replace('_status', '')];
        });
        if (found) riskMultipliers *= found.risk_multiplier;
      }
    }

    // Adjust for cholesterol specifics
    ['total_cholesterol', 'ldl_cholesterol', 'hdl_cholesterol'].forEach(type => {
      let range = data.cholesterol_ranges[type].find(r => formData[type.replace('_cholesterol', '')] >= r.min && formData[type.replace('_cholesterol', '')] <= r.max);
      riskMultipliers *= range.risk_multiplier;
    });

    let tenYearRisk = baseRisk * riskMultipliers * 100;
    let lifetimeRiskFactor = formData.age < 40 ? 4 : (formData.age < 60 ? 3 : (formData.age < 80 ? 2 : 1));
    let lifetimeRisk = tenYearRisk * lifetimeRiskFactor;

    setResult({
      tenYear: Math.min(tenYearRisk, 100), 
      lifetime: Math.min(lifetimeRisk, 100)
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <CardTitle>Heart Attack Risk Calculator</CardTitle>
          {Object.keys(formData).map(key => (
            <div key={key} className="mb-4">
              <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
              {['sex', 'smoking', 'diabetes', 'familyHistory', 'physicalActivity', 'stressLevel'].includes(key) ? 
                <Select name={key} value={formData[key]} onChange={handleChange}>
                  {data[`${key}_status` || key].map(item => <SelectItem key={item.category} value={item.category}>{item.category}</SelectItem>)}
                </Select>
              :
                <Input type="number" name={key} value={formData[key]} onChange={handleChange} min={data[key + '_ranges'] ? data[key + '_ranges'][0].min : 0} max={data[key + '_ranges'] ? data[key + '_ranges'].slice(-1)[0].max : 1000} />
              }
            </div>
          ))}
          <Button onClick={calculateRisk}>Calculate Risk</Button>
        </Card>
        {result && (
          <Card className={`p-4 ${result.tenYear > 20 ? 'border-red-500' : 'border-green-500'}`}>
            <CardTitle>Risk Assessment</CardTitle>
            <div className="flex flex-col space-y-4">
              <Gauge 
                value={result.tenYear} 
                min={0} 
                max={100} 
                label="10-Year Risk" 
                style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
                arc={{ color: ['#00FF00', '#FFFF00', '#FF0000'], width: 0.3 }}
              />
              <p>Lifetime Risk: {result.lifetime.toFixed(2)}%</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;