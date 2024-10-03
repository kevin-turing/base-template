import React, { useState } from 'react';
import { Button, Card, CardContent, Progress, Select, Checkbox } from "@/components/ui";


const phoneData =[
  {
    "brand": "Apple",
    "model": "iPhone 13 Pro",
    "release_year": 2021,
    "storage_options": [
      {"capacity": 128, "price": 999},
      {"capacity": 256, "price": 1099},
      {"capacity": 512, "price": 1299},
      {"capacity": 1024, "price": 1499}
    ],
    "features": ["5G", "wireless_charging", "water_resistant", "face_id"],
    "depreciation_rate": 0.20,
    "condition_multipliers": {
      "like_new": 0.9,
      "good": 0.8,
      "fair": 0.7,
      "poor": 0.5
    },
    "scratch_multipliers": {
      "none": 1.0,
      "minor": 0.98,
      "moderate": 0.95,
      "severe": 0.9
    },
    "display_condition_multipliers": {
      "perfect": 1.0,
      "minor_scratches": 0.97,
      "moderate_scratches": 0.93,
      "severe_scratches": 0.85,
      "chipped": 0.8,
      "cracked": 0.6
    },
    "component_multipliers": {
      "screen": {
        "perfect": 1.0,
        "dead_pixels": 0.9,
        "touch_issues": 0.85
      },
      "battery": {
        "90-100%": 1.0,
        "80-89%": 0.95,
        "70-79%": 0.9,
        "below_70%": 0.8,
        "swollen": 0.6
      },
      "buttons": {
        "all_working": 1.0,
        "minor_issues": 0.97,
        "major_issues": 0.9
      },
      "cameras": {
        "perfect": 1.0,
        "minor_issues": 0.95,
        "major_issues": 0.85
      },
      "speakers_mic": {
        "perfect": 1.0,
        "minor_issues": 0.97,
        "major_issues": 0.9
      },
      "charging_port": {
        "perfect": 1.0,
        "loose": 0.9,
        "not_working": 0.7
      },
      "wireless_charging": {
        "working": 1.0,
        "not_working": 0.95
      },
      "biometric_sensors": {
        "perfect": 1.0,
        "not_working": 0.95
      },
      "water_resistance": {
        "intact": 1.0,
        "compromised": 0.97
      }
    }
  },
  {
    "brand": "Samsung",
    "model": "Galaxy S21 Ultra",
    "release_year": 2021,
    "storage_options": [
      {"capacity": 128, "price": 1199},
      {"capacity": 256, "price": 1249},
      {"capacity": 512, "price": 1379}
    ],
    "features": ["5G", "wireless_charging", "water_resistant", "fingerprint_sensor"],
    "depreciation_rate": 0.25,
    "condition_multipliers": {
      "like_new": 0.85,
      "good": 0.75,
      "fair": 0.65,
      "poor": 0.45
    },
    "scratch_multipliers": {
      "none": 1.0,
      "minor": 0.97,
      "moderate": 0.94,
      "severe": 0.88
    },
    "display_condition_multipliers": {
      "perfect": 1.0,
      "minor_scratches": 0.96,
      "moderate_scratches": 0.92,
      "severe_scratches": 0.84,
      "chipped": 0.78,
      "cracked": 0.58
    },
    "component_multipliers": {
      "screen": {
        "perfect": 1.0,
        "dead_pixels": 0.88,
        "touch_issues": 0.83
      },
      "battery": {
        "90-100%": 1.0,
        "80-89%": 0.94,
        "70-79%": 0.88,
        "below_70%": 0.78,
        "swollen": 0.58
      },
      "buttons": {
        "all_working": 1.0,
        "minor_issues": 0.96,
        "major_issues": 0.88
      },
      "cameras": {
        "perfect": 1.0,
        "minor_issues": 0.94,
        "major_issues": 0.83
      },
      "speakers_mic": {
        "perfect": 1.0,
        "minor_issues": 0.96,
        "major_issues": 0.88
      },
      "charging_port": {
        "perfect": 1.0,
        "loose": 0.88,
        "not_working": 0.68
      },
      "wireless_charging": {
        "working": 1.0,
        "not_working": 0.94
      },
      "biometric_sensors": {
        "perfect": 1.0,
        "not_working": 0.94
      },
      "water_resistance": {
        "intact": 1.0,
        "compromised": 0.96
      }
    }
  },
  {
    "brand": "Google",
    "model": "Pixel 6 Pro",
    "release_year": 2021,
    "storage_options": [
      {"capacity": 128, "price": 899},
      {"capacity": 256, "price": 999},
      {"capacity": 512, "price": 1099}
    ],
    "features": ["5G", "wireless_charging", "water_resistant", "fingerprint_sensor"],
    "depreciation_rate": 0.30,
    "condition_multipliers": {
      "like_new": 0.8,
      "good": 0.7,
      "fair": 0.6,
      "poor": 0.4
    },
    "scratch_multipliers": {
      "none": 1.0,
      "minor": 0.96,
      "moderate": 0.92,
      "severe": 0.86
    },
    "display_condition_multipliers": {
      "perfect": 1.0,
      "minor_scratches": 0.95,
      "moderate_scratches": 0.90,
      "severe_scratches": 0.82,
      "chipped": 0.75,
      "cracked": 0.55
    },
    "component_multipliers": {
      "screen": {
        "perfect": 1.0,
        "dead_pixels": 0.86,
        "touch_issues": 0.80
      },
      "battery": {
        "90-100%": 1.0,
        "80-89%": 0.92,
        "70-79%": 0.86,
        "below_70%": 0.75,
        "swollen": 0.55
      },
      "buttons": {
        "all_working": 1.0,
        "minor_issues": 0.95,
        "major_issues": 0.86
      },
      "cameras": {
        "perfect": 1.0,
        "minor_issues": 0.92,
        "major_issues": 0.80
      },
      "speakers_mic": {
        "perfect": 1.0,
        "minor_issues": 0.95,
        "major_issues": 0.86
      },
      "charging_port": {
        "perfect": 1.0,
        "loose": 0.86,
        "not_working": 0.65
      },
      "wireless_charging": {
        "working": 1.0,
        "not_working": 0.92
      },
      "biometric_sensors": {
        "perfect": 1.0,
        "not_working": 0.92
      },
      "water_resistance": {
        "intact": 1.0,
        "compromised": 0.95
      }
    }
  },
  {
    "brand": "OnePlus",
    "model": "9 Pro",
    "release_year": 2021,
    "storage_options": [
      {"capacity": 128, "price": 969},
      {"capacity": 256, "price": 1069}
    ],
    "features": ["5G", "wireless_charging", "water_resistant", "fingerprint_sensor"],
    "depreciation_rate": 0.35,
    "condition_multipliers": {
      "like_new": 0.75,
      "good": 0.65,
      "fair": 0.55,
      "poor": 0.35
    },
    "scratch_multipliers": {
      "none": 1.0,
      "minor": 0.95,
      "moderate": 0.90,
      "severe": 0.84
    },
    "display_condition_multipliers": {
      "perfect": 1.0,
      "minor_scratches": 0.94,
      "moderate_scratches": 0.88,
      "severe_scratches": 0.80,
      "chipped": 0.72,
      "cracked": 0.52
    },
    "component_multipliers": {
      "screen": {
        "perfect": 1.0,
        "dead_pixels": 0.84,
        "touch_issues": 0.78
      },
      "battery": {
        "90-100%": 1.0,
        "80-89%": 0.90,
        "70-79%": 0.84,
        "below_70%": 0.72,
        "swollen": 0.52
      },
      "buttons": {
        "all_working": 1.0,
        "minor_issues": 0.94,
        "major_issues": 0.84
      },
      "cameras": {
        "perfect": 1.0,
        "minor_issues": 0.90,
        "major_issues": 0.78
      },
      "speakers_mic": {
        "perfect": 1.0,
        "minor_issues": 0.94,
        "major_issues": 0.84
      },
      "charging_port": {
        "perfect": 1.0,
        "loose": 0.84,
        "not_working": 0.62
      },
      "wireless_charging": {
        "working": 1.0,
        "not_working": 0.90
      },
      "biometric_sensors": {
        "perfect": 1.0,
        "not_working": 0.90
      },
      "water_resistance": {
        "intact": 1.0,
        "compromised": 0.94
      }
    }
  },
  {
    "brand": "Xiaomi",
    "model": "Mi 11",
    "release_year": 2021,
    "storage_options": [
      {"capacity": 128, "price": 749},
      {"capacity": 256, "price": 799}
    ],
    "features": ["5G", "wireless_charging", "fingerprint_sensor"],
    "depreciation_rate": 0.40,
    "condition_multipliers": {
      "like_new": 0.7,
      "good": 0.6,
      "fair": 0.5,
      "poor": 0.3
    },
    "scratch_multipliers": {
      "none": 1.0,
      "minor": 0.94,
      "moderate": 0.88,
      "severe": 0.82
    },
    "display_condition_multipliers": {
      "perfect": 1.0,
      "minor_scratches": 0.93,
      "moderate_scratches": 0.86,
      "severe_scratches": 0.78,
      "chipped": 0.70,
      "cracked": 0.50
    },
    "component_multipliers": {
      "screen": {
        "perfect": 1.0,
        "dead_pixels": 0.82,
        "touch_issues": 0.76
      },
      "battery": {
        "90-100%": 1.0,
        "80-89%": 0.88,
        "70-79%": 0.82,
        "below_70%": 0.70,
        "swollen": 0.50
      },
      "buttons": {
        "all_working": 1.0,
        "minor_issues": 0.93,
        "major_issues": 0.82
      },
      "cameras": {
        "perfect": 1.0,
        "minor_issues": 0.88,
        "major_issues": 0.76
      },
      "speakers_mic": {
        "perfect": 1.0,
        "minor_issues": 0.93,
        "major_issues": 0.82
      },
      "charging_port": {
        "perfect": 1.0,
        "loose": 0.82,
        "not_working": 0.60
      },
      "wireless_charging": {
        "working": 1.0,
        "not_working": 0.88
      },
      "biometric_sensors": {
        "perfect": 1.0,
        "not_working": 0.88
      },
      "water_resistance": {
        "intact": 1.0,
        "compromised": 0.93
      }
    }
  }
];

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    brand: '', model: '', storage: '', age: '', condition: '', scratches: '', displayCondition: '', components: {}, features: [], repairHistory: '', accessories: []
  });

  const steps = [
    'Device Selection', 'Features', 'Condition', 'Components', 'Accessories', 'Results'
  ];

  const nextStep = () => setStep(prev => prev < steps.length - 1 ? prev + 1 : prev);
  const prevStep = () => setStep(prev => prev > 0 ? prev - 1 : prev);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({...formData, [e.target.name]: value});
  };

  // Function to calculate the resale value based on form data
  const calculateResaleValue = () => {
    let value = formData.storage ? parseFloat(formData.storage.price) : 0;
    // Simplified calculation for demonstration
    const multipliers = {
      age: 1 - (0.1 * formData.age), // Example multiplier for age
      condition: formData.condition === 'like_new' ? 0.9 : 0.7, // Example
      // ... Add other multipliers similarly
    };
    
    for (let multi in multipliers) {
      value *= multipliers[multi];
    }
    
    return value * (1 - 0.1) + ' - ' + value * (1 + 0.1); // ±10% range
  };

  const renderStep = () => {
    switch(step) {
      case 0: 
        return (
          <Select label="Brand" name="brand" value={formData.brand} onChange={handleChange}>
            {phoneData.map(phone => <option key={phone.brand}>{phone.brand}</option>)}
          </Select>
        );
      case 1:
        return (
          <div>
            {phoneData.find(p => p.brand === formData.brand)?.features.map(feature => 
              <Checkbox key={feature} name="features" value={feature} onCheckedChange={checked => 
                setFormData({...formData, features: checked ? [...formData.features, feature] : formData.features.filter(f => f !== feature)})}>
                {feature}
              </Checkbox>
            )}
          </div>
        );
      // Add other steps similarly...
      case 5:
        return (
          <div>
            <h2>Estimated Resale Value</h2>
            <p>{calculateResaleValue()}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent>
          <Progress value={(step / (steps.length - 1)) * 100} className="mb-4"/>
          {renderStep()}
          <div className="mt-4 flex justify-between">
            <Button onClick={prevStep} disabled={step === 0}>Back</Button>
            <Button onClick={nextStep} disabled={step === steps.length - 1}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;