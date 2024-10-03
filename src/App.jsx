import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const riskData = {
  age_ranges: [
    { min: 20, max: 34, risk_multiplier: 0.5 },
    { min: 35, max: 44, risk_multiplier: 1.0 },
    { min: 45, max: 54, risk_multiplier: 1.5 },
    { min: 55, max: 64, risk_multiplier: 2.0 },
    { min: 65, max: 74, risk_multiplier: 2.5 },
    { min: 75, max: 100, risk_multiplier: 3.0 }
  ],
  sex: [
    { category: "Male", risk_multiplier: 1.5 },
    { category: "Female", risk_multiplier: 1.0 }
  ],
  blood_pressure_ranges: [
    { category: "Normal", systolic: { min: 70, max: 120 }, diastolic: { min: 40, max: 80 }, risk_multiplier: 1.0 },
    { category: "Elevated", systolic: { min: 121, max: 129 }, diastolic: { min: 40, max: 80 }, risk_multiplier: 1.2 },
    { category: "Hypertension Stage 1", systolic: { min: 130, max: 139 }, diastolic: { min: 80, max: 89 }, risk_multiplier: 1.4 },
    { category: "Hypertension Stage 2", systolic: { min: 140, max: 180 }, diastolic: { min: 90, max: 120 }, risk_multiplier: 1.8 },
    { category: "Hypertensive Crisis", systolic: { min: 181, max: 250 }, diastolic: { min: 121, max: 150 }, risk_multiplier: 2.5 }
  ],
  cholesterol_ranges: {
    total_cholesterol: [
      { category: "Desirable", min: 100, max: 200, risk_multiplier: 1.0 },
      { category: "Borderline High", min: 201, max: 239, risk_multiplier: 1.3 },
      { category: "High", min: 240, max: 500, risk_multiplier: 1.6 }
    ],
    hdl_cholesterol: [
      { category: "Low", min: 20, max: 40, risk_multiplier: 1.6 },
      { category: "Moderate", min: 41, max: 59, risk_multiplier: 1.2 },
      { category: "High", min: 60, max: 100, risk_multiplier: 1.0 }
    ],
    ldl_cholesterol: [
      { category: "Optimal", min: 30, max: 100, risk_multiplier: 1.0 },
      { category: "Near Optimal", min: 101, max: 129, risk_multiplier: 1.1 },
      { category: "Borderline High", min: 130, max: 159, risk_multiplier: 1.3 },
      { category: "High", min: 160, max: 189, risk_multiplier: 1.6 },
      { category: "Very High", min: 190, max: 300, risk_multiplier: 2.0 }
    ]
  },
  smoking_status: [
    { category: "Non-smoker", risk_multiplier: 1.0 },
    { category: "Former smoker", risk_multiplier: 1.3 },
    { category: "Current smoker", risk_multiplier: 1.8 }
  ],
  diabetes_status: [
    { category: "No diabetes", risk_multiplier: 1.0 },
    { category: "Pre-diabetes", risk_multiplier: 1.3 },
    { category: "Type 2 diabetes", risk_multiplier: 1.8 },
    { category: "Type 1 diabetes", risk_multiplier: 2.0 }
  ],
  family_history: [
    { category: "No family history", risk_multiplier: 1.0 },
    { category: "Family history of heart disease", risk_multiplier: 1.5 }
  ],
  physical_activity: [
    { category: "Sedentary", risk_multiplier: 1.6 },
    { category: "Lightly active", risk_multiplier: 1.3 },
    { category: "Moderately active", risk_multiplier: 1.1 },
    { category: "Very active", risk_multiplier: 1.0 }
  ],
  stress_level: [
    { category: "Low stress", risk_multiplier: 1.0 },
    { category: "Moderate stress", risk_multiplier: 1.2 },
    { category: "High stress", risk_multiplier: 1.4 },
    { category: "Severe stress", risk_multiplier: 1.6 }
  ]
};

const InputField = ({ label, type, value, onChange, options, error, min, max }) => (
  <div className="mb-4">
    <Label className="block mb-2 text-sm font-bold">{label}</Label>
    {type === 'select' ? (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.category} value={option.category}>
              {option.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${error ? 'border-red-500' : ''}`}
        min={min}
        max={max}
      />
    )}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const RiskMeter = ({ risk, label }) => {
  const angle = (risk / 100) * 180;
  const color = risk < 10 ? 'text-green-500' : risk < 20 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="mt-4 text-center">
      <p className="text-sm font-semibold mb-1">{label}</p>
      <div className="relative w-32 h-16 mx-auto">
        <div className="absolute inset-0 bg-gray-200 rounded-t-full"></div>
        <div 
          className={`absolute inset-0 ${color} rounded-t-full`}
          style={{
            clipPath: `polygon(50% 100%, 50% 100%, 50% 0%)`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'bottom center'
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{risk.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

const RiskFactorBar = ({ factor, impact }) => {
  const percentage = Math.min(Math.max(((impact - 1) * 100), 0), 100).toFixed(1);
  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm">
        <span>{factor}</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={parseFloat(percentage)} className="h-2" />
    </div>
  );
};

export default function HeartAttackRiskCalculator() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    height: '',
    weight: '',
    systolicBP: '',
    diastolicBP: '',
    totalCholesterol: '',
    hdlCholesterol: '',
    ldlCholesterol: '',
    smokingStatus: '',
    diabetesStatus: '',
    familyHistory: '',
    physicalActivity: '',
    stressLevel: '',
  });

  const [errors, setErrors] = useState({});
  const [riskScores, setRiskScores] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.age || isNaN(formData.age) || formData.age < 20 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age between 20 and 100';
    }
    if (!formData.sex) {
      newErrors.sex = 'Please select a sex';
    }
    if (!formData.height || isNaN(formData.height) || formData.height < 120 || formData.height > 220) {
      newErrors.height = 'Please enter a valid height between 120 cm and 220 cm';
    }
    if (!formData.weight || isNaN(formData.weight) || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Please enter a valid weight between 30 kg and 300 kg';
    }
    if (!formData.systolicBP || isNaN(formData.systolicBP) || formData.systolicBP < 70 || formData.systolicBP > 250) {
      newErrors.systolicBP = 'Please enter a valid systolic blood pressure between 70 and 250';
    }
    if (!formData.diastolicBP || isNaN(formData.diastolicBP) || formData.diastolicBP < 40 || formData.diastolicBP > 150) {
      newErrors.diastolicBP = 'Please enter a valid diastolic blood pressure between 40 and 150';
    }
    if (!formData.totalCholesterol) {
      newErrors.totalCholesterol = 'Please select a total cholesterol range';
    }
    if (!formData.hdlCholesterol) {
      newErrors.hdlCholesterol = 'Please select an HDL cholesterol range';
    }
    if (!formData.ldlCholesterol) {
      newErrors.ldlCholesterol = 'Please select an LDL cholesterol range';
    }
    if (!formData.smokingStatus) {
      newErrors.smokingStatus = 'Please select a smoking status';
    }
    if (!formData.diabetesStatus) {
      newErrors.diabetesStatus = 'Please select a diabetes status';
    }
    if (!formData.familyHistory) {
      newErrors.familyHistory = 'Please select a family history option';
    }
    if (!formData.physicalActivity) {
      newErrors.physicalActivity = 'Please select a physical activity level';
    }
    if (!formData.stressLevel) {
      newErrors.stressLevel = 'Please select a stress level';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateRisk = () => {
    if (!validateForm()) return;

    const age = parseInt(formData.age);
    const sex = formData.sex;
    const height = parseInt(formData.height);
    const weight = parseInt(formData.weight);
    const systolicBP = parseInt(formData.systolicBP);
    const diastolicBP = parseInt(formData.diastolicBP);

    // Calculate BMI
    const bmi = weight / ((height / 100) ** 2);

    // Base risk calculation
    let baseRisk = 0;

    // Age risk (more significant impact)
    const ageRange = riskData.age_ranges.find(range => age >= range.min && age <= range.max);
    baseRisk += ageRange ? (age - ageRange.min) * 0.5 * ageRange.risk_multiplier : 0;

    // Sex risk
    const sexRisk = riskData.sex.find(item => item.category === sex);
    baseRisk *= sexRisk ? sexRisk.risk_multiplier : 1;

    // BMI risk
    if (bmi < 18.5) baseRisk *= 1.2;
    else if (bmi >= 25 && bmi < 30) baseRisk *= 1.3;
    else if (bmi >= 30) baseRisk *= 1.6;

    // Blood pressure risk (using both systolic and diastolic)
    const bpRange = riskData.blood_pressure_ranges.find(range => 
      systolicBP >= range.systolic.min && systolicBP <= range.systolic.max &&
      diastolicBP >= range.diastolic.min && diastolicBP <= range.diastolic.max
    );
    baseRisk *= bpRange ? bpRange.risk_multiplier : 1;

    // Additional risk for very high blood pressure
    if (systolicBP > 180 || diastolicBP > 120) baseRisk *= 1.5;

    // Cholesterol risks
    const totalCholesterol = riskData.cholesterol_ranges.total_cholesterol.find(range => range.category === formData.totalCholesterol);
    const hdlCholesterol = riskData.cholesterol_ranges.hdl_cholesterol.find(range => range.category === formData.hdlCholesterol);
    const ldlCholesterol = riskData.cholesterol_ranges.ldl_cholesterol.find(range => range.category === formData.ldlCholesterol);
    
    baseRisk *= totalCholesterol ? totalCholesterol.risk_multiplier : 1;
    baseRisk *= hdlCholesterol ? hdlCholesterol.risk_multiplier : 1;
    baseRisk *= ldlCholesterol ? ldlCholesterol.risk_multiplier : 1;

    // Smoking status (more significant impact)
    const smokingStatus = riskData.smoking_status.find(item => item.category === formData.smokingStatus);
    baseRisk *= smokingStatus ? smokingStatus.risk_multiplier * 1.5 : 1;

    // Diabetes status
    const diabetesStatus = riskData.diabetes_status.find(item => item.category === formData.diabetesStatus);
    baseRisk *= diabetesStatus ? diabetesStatus.risk_multiplier : 1;

    // Family history
    const familyHistory = riskData.family_history.find(item => item.category === formData.familyHistory);
    baseRisk *= familyHistory ? familyHistory.risk_multiplier : 1;

    // Physical activity (inverse relationship)
    const physicalActivity = riskData.physical_activity.find(item => item.category === formData.physicalActivity);
    baseRisk /= physicalActivity ? physicalActivity.risk_multiplier : 1;

    // Stress level
    const stressLevel = riskData.stress_level.find(item => item.category === formData.stressLevel);
    baseRisk *= stressLevel ? stressLevel.risk_multiplier : 1;

    // Calculate 10-year risk
    let tenYearRisk = Math.min(baseRisk, 100);

    // Calculate lifetime risk
    let lifetimeRisk;
    if (age >= 20 && age <= 39) {
      lifetimeRisk = tenYearRisk * 4;
    } else if (age >= 40 && age <= 59) {
      lifetimeRisk = tenYearRisk * 3;
    } else if (age >= 60 && age <= 79) {
      lifetimeRisk = tenYearRisk * 2;
    } else {
      lifetimeRisk = tenYearRisk;
    }

    // Ensure risks are within 0-100 range
    tenYearRisk = Math.min(Math.max(tenYearRisk, 0), 100);
    lifetimeRisk = Math.min(Math.max(lifetimeRisk, 0), 100);

    // Calculate average risk for comparison
    const averageRisk = 5 + (age - 20) * 0.15; // Baseline of 5% at age 20, increasing by 0.15% per year

    setRiskScores({
      tenYear: tenYearRisk,
      lifetime: lifetimeRisk,
      average: averageRisk
    });
  };


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const riskFactors = useMemo(() => {
    if (!riskScores) return [];
    return Object.entries(formData).map(([key, value]) => {
      let factor = '';
      let impact = 1;
      switch (key) {
        case 'age':
          factor = 'Age';
          impact = Math.exp(parseInt(value) * 0.0799);
          break;
        case 'sex':
          factor = 'Sex';
          impact = value === 'Male' ? 1.5 : 1.0;
          break;
        case 'totalCholesterol':
          factor = 'Total Cholesterol';
          impact = riskData.cholesterol_ranges.total_cholesterol.find(range => range.category === value)?.risk_multiplier || 1;
          break;
        case 'hdlCholesterol':
          factor = 'HDL Cholesterol';
          impact = riskData.cholesterol_ranges.hdl_cholesterol.find(range => range.category === value)?.risk_multiplier || 1;
          break;
        case 'ldlCholesterol':
          factor = 'LDL Cholesterol';
          impact = riskData.cholesterol_ranges.ldl_cholesterol.find(range => range.category === value)?.risk_multiplier || 1;
          break;
        case 'systolicBP':
          factor = 'Systolic BP';
          impact = Math.exp(parseInt(value) * 0.0181);
          break;
        case 'smokingStatus':
          factor = 'Smoking Status';
          impact = value === 'Current smoker' ? 1.8 : (value === 'Former smoker' ? 1.3 : 1.0);
          break;
        case 'diabetesStatus':
          factor = 'Diabetes Status';
          impact = value === 'Type 2 diabetes' ? 1.8 : (value === 'Pre-diabetes' ? 1.3 : 1.0);
          break;
        case 'familyHistory':
          factor = 'Family History';
          impact = value === 'Family history of heart disease' ? 1.5 : 1.0;
          break;
        case 'physicalActivity':
          factor = 'Physical Activity';
          impact = value === 'Sedentary' ? 1.6 : (value === 'Lightly active' ? 1.3 : 1.0);
          break;
        case 'stressLevel':
          factor = 'Stress Level';
          impact = value === 'High stress' ? 1.4 : (value === 'Moderate stress' ? 1.2 : 1.0);
          break;
      }
      return { factor, impact: isNaN(impact) ? 1 : impact };
    }).filter(item => item.impact !== 1);
  }, [formData, riskScores]);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Heart Attack Risk Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); calculateRisk(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Age" type="number" value={formData.age} onChange={(value) => handleInputChange('age', value)} error={errors.age} min="20" max="100" />
            <InputField label="Sex" type="select" value={formData.sex} onChange={(value) => handleInputChange('sex', value)} options={[{category: 'Male'}, {category: 'Female'}]} error={errors.sex} />
            <InputField label="Height (cm)" type="number" value={formData.height} onChange={(value) => handleInputChange('height', value)} error={errors.height} min="120" max="220" />
            <InputField label="Weight (kg)" type="number" value={formData.weight} onChange={(value) => handleInputChange('weight', value)} error={errors.weight} min="30" max="300" />
            <InputField label="Systolic BP" type="number" value={formData.systolicBP} onChange={(value) => handleInputChange('systolicBP', value)} error={errors.systolicBP} min="70" max="250" />
            <InputField label="Diastolic BP" type="number" value={formData.diastolicBP} onChange={(value) => handleInputChange('diastolicBP', value)} error={errors.diastolicBP} min="40" max="150" />
            <InputField label="Total Cholesterol" type="select" value={formData.totalCholesterol} onChange={(value) => handleInputChange('totalCholesterol', value)} options={riskData.cholesterol_ranges.total_cholesterol} error={errors.totalCholesterol} />
            <InputField label="HDL Cholesterol" type="select" value={formData.hdlCholesterol} onChange={(value) => handleInputChange('hdlCholesterol', value)} options={riskData.cholesterol_ranges.hdl_cholesterol} error={errors.hdlCholesterol} />
            <InputField label="LDL Cholesterol" type="select" value={formData.ldlCholesterol} onChange={(value) => handleInputChange('ldlCholesterol', value)} options={riskData.cholesterol_ranges.ldl_cholesterol} error={errors.ldlCholesterol} />
            <InputField label="Smoking Status" type="select" value={formData.smokingStatus} onChange={(value) => handleInputChange('smokingStatus', value)} options={[{category: 'Non-smoker'}, {category: 'Former smoker'}, {category: 'Current smoker'}]} error={errors.smokingStatus} />
            <InputField label="Diabetes Status" type="select" value={formData.diabetesStatus} onChange={(value) => handleInputChange('diabetesStatus', value)} options={[{category: 'No diabetes'}, {category: 'Pre-diabetes'}, {category: 'Type 2 diabetes'}, {category: 'Type 1 diabetes'}]} error={errors.diabetesStatus} />
            <InputField label="Family History" type="select" value={formData.familyHistory} onChange={(value) => handleInputChange('familyHistory', value)} options={[{category: 'No family history'}, {category: 'Family history of heart disease'}]} error={errors.familyHistory} />
            <InputField label="Physical Activity" type="select" value={formData.physicalActivity} onChange={(value) => handleInputChange('physicalActivity', value)} options={[{category: 'Sedentary'}, {category: 'Lightly active'}, {category: 'Moderately active'}, {category: 'Very active'}]} error={errors.physicalActivity} />
            <InputField label="Stress Level" type="select" value={formData.stressLevel} onChange={(value) => handleInputChange('stressLevel', value)} options={[{category: 'Low stress'}, {category: 'Moderate stress'}, {category: 'High stress'}, {category: 'Severe stress'}]} error={errors.stressLevel} />
            <div className="col-span-1 md:col-span-2">
              <Button type="submit" className="w-full">Calculate Risk</Button>
            </div>
          </form>

          {riskScores && (
            <Card className={`mt-8 ${riskScores.tenYear >= 20 ? 'border-red-500 border-2' : ''}`}>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RiskMeter risk={riskScores.tenYear} label="10-Year Risk" />
                  <RiskMeter risk={riskScores.lifetime} label="Lifetime Risk" />
                  <RiskMeter risk={riskScores.average} label="Average Risk for Age and Sex" />
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Risk Factors Breakdown:</h3>
                  {riskFactors.map((factor, index) => (
                    <RiskFactorBar key={index} factor={factor.factor} impact={factor.impact} />
                  ))}
                </div>
                <Alert className="mt-4">
                  <AlertDescription>
                    This is a simplified risk assessment. For a comprehensive evaluation, please consult with a healthcare professional.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}