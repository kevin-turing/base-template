import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const phonesData = {
  "phones": [
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
  ],
  "age_multipliers": [
    {"age": 0, "multiplier": 1.0},
    {"age": 1, "multiplier": 0.8},
    {"age": 2, "multiplier": 0.6},
    {"age": 3, "multiplier": 0.4},
    {"age": 4, "multiplier": 0.25},
    {"age": 5, "multiplier": 0.15}
  ],
  "feature_multipliers": {
    "5G": 1.05,
    "wireless_charging": 1.03,
    "water_resistant": 1.02,
    "face_id": 1.04,
    "fingerprint_sensor": 1.02
  },
  "repair_history_multipliers": {
    "no_repairs": 1.0,
    "official_repair": 0.95,
    "third_party_repair": 0.9,
    "self_repair": 0.85
  },
  "accessory_multipliers": {
    "all_original": 1.05,
    "partial_original": 1.02,
    "no_accessories": 1.0
  },
  "sale_type_multipliers": {
    "private_sale": 1.0,
    "trade_in": 0.8,
    "instant_cash": 0.7
  },
  "market_demand_multipliers": {
    "Apple": 1.1,
    "Samsung": 1.05,
    "Google": 1.02,
    "OnePlus": 1.0,
   "Xiaomi": 0.98
  },
  "battery_health_multipliers": {
    "90-100%": 1.0,
    "80-89%": 0.95,
    "70-79%": 0.9,
    "60-69%": 0.8,
    "below_60%": 0.7
  },
  "additional_features_multipliers": {
    "dual_sim": 1.02,
    "expandable_storage": 1.03,
    "high_refresh_rate": 1.04,
    "reverse_wireless_charging": 1.02
  },
  "color_multipliers": {
    "standard": 1.0,
    "limited_edition": 1.05
  },
  "market_conditions": {
    "high_demand": 1.1,
    "normal_demand": 1.0,
    "low_demand": 0.9
  },
  "seasonal_multipliers": {
    "holiday_season": 1.05,
    "new_model_release": 0.9,
    "back_to_school": 1.02
  },
  "region_multipliers": {
    "north_america": 1.0,
    "europe": 0.95,
    "asia": 0.9,
    "australia": 0.98
  },
  "software_support_multipliers": {
    "latest_os": 1.0,
    "one_version_behind": 0.95,
    "two_versions_behind": 0.9,
    "no_longer_supported": 0.8
  },
  "cosmetic_condition_details": {
    "pristine": 1.0,
    "minor_wear": 0.95,
    "visible_wear": 0.9,
    "heavy_wear": 0.8
  },
  "original_packaging_multipliers": {
    "complete_box_and_accessories": 1.05,
    "original_box_only": 1.02,
    "no_original_packaging": 1.0
  },
  "warranty_status_multipliers": {
    "under_manufacturer_warranty": 1.1,
    "third_party_warranty": 1.05,
    "no_warranty": 1.0
  }
};

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