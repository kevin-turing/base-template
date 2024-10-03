import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select, SelectItem } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const phonesData = {/* insert provided JSON data here */};

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: '', model: '', storage: '', age: '', features: [], condition: '', scratches: '', displayCondition: '', /* ... other fields ... */
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Example validation: check if brand and model are selected before moving to next step
    setIsValid(formData.brand && formData.model);
  }, [formData.brand, formData.model]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? (checked ? [...prev[name], value] : prev[name].filter(item => item !== value)) : value
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch(step) {
      case 1: return <DeviceSelection onChange={handleChange} formData={formData} />;
      // Add cases for other steps...
      default: return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Phone Resale Value Estimator</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
        <div className="flex justify-between p-4">
          <Button disabled={step === 1} onClick={prevStep}>Back</Button>
          <Button disabled={!isValid} onClick={nextStep}>{step === 5 ? 'Calculate' : 'Next'}</Button>
        </div>
      </Card>
    </div>
  );
}

function DeviceSelection({ onChange, formData }) {
  const currentPhone = phonesData.phones.find(phone => phone.model === formData.model);
  
  return (
    <div>
      <Select name="brand" onChange={onChange} value={formData.brand}>
        <SelectItem value="">Select Brand</SelectItem>
        {phonesData.phones.map(phone => <SelectItem key={phone.brand} value={phone.brand}>{phone.brand}</SelectItem>)}
      </Select>
      {formData.brand && (
        <Select name="model" onChange={onChange} value={formData.model}>
          <SelectItem value="">Select Model</SelectItem>
          {phonesData.phones.filter(p => p.brand === formData.brand).map(phone => <SelectItem key={phone.model} value={phone.model}>{phone.model}</SelectItem>)}
        </Select>
      )}
      {currentPhone && (
        <>
          <p>Release Year: {currentPhone.release_year}</p>
          <Select name="storage" onChange={onChange}>
            <SelectItem value="">Select Storage</SelectItem>
            {currentPhone.storage_options.map(opt => <SelectItem key={opt.capacity} value={opt.capacity}>{opt.capacity}GB - ${opt.price}</SelectItem>)}
          </Select>
        </>
      )}
    </div>
  );
}