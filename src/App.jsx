
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const steps = [
  "Device Selection",
  "Features",
  "Condition Assessment",
  "Component Checklist",
  "Repair History",
  "Results",
];

const ProgressIndicator = ({ currentStep, steps }) => (
  <div className="mb-4 space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
      <span className="text-sm font-medium">{steps[currentStep]}</span>
    </div>
    <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
    <div className="flex justify-between">
      <div className="flex space-x-1">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index <= currentStep ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);
const DeviceSelection = ({ formData, setFormData, phoneData }) => {
  const brands = [...new Set(phoneData.phones.map((phone) => phone.brand))];
  const models = phoneData.phones.filter((phone) => phone.brand === formData.brand);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="brand">Brand</Label>
        <Select
          id="brand"
          value={formData.brand}
          onValueChange={(value) => setFormData({ ...formData, brand: value, model: "", storage: "", originalPrice: 0 })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="model">Model</Label>
        <Select
          id="model"
          value={formData.model}
          onValueChange={(value) => {
            const selectedPhone = phoneData.phones.find((phone) => phone.model === value);
            setFormData({
              ...formData,
              model: value,
              releaseYear: selectedPhone.release_year,
              storage: "",
              originalPrice: 0,
            });
          }}
          disabled={!formData.brand}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((phone) => (
              <SelectItem key={phone.model} value={phone.model}>
                {phone.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.model && (
        <>
          <div>
            <Label>Release Year: {formData.releaseYear}</Label>
          </div>
          <div>
            <Label htmlFor="storage">Storage Capacity</Label>
            <Select
              id="storage"
              value={formData.storage}
              onValueChange={(value) => {
                const selectedPhone = phoneData.phones.find((phone) => phone.model === formData.model);
                const storageOption = selectedPhone.storage_options.find(
                  (option) => option.capacity === parseInt(value)
                );
                setFormData({
                  ...formData,
                  storage: value,
                  originalPrice: storageOption.price,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select storage capacity" />
              </SelectTrigger>
              <SelectContent>
                {phoneData.phones
                  .find((phone) => phone.model === formData.model)
                  .storage_options.map((option) => (
                    <SelectItem key={option.capacity} value={option.capacity.toString()}>
                      {option.capacity}GB - ${option.price}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <div>
        <Label htmlFor="age">Device Age (years)</Label>
        <Input
          id="age"
          type="number"
          min="0"
          max="5"
          placeholder="Enter device age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
      </div>
    </div>
  );
};

const Features = ({ formData, setFormData, phoneData }) => {
  const selectedPhone = phoneData.phones.find((phone) => phone.model === formData.model);
  const features = selectedPhone ? selectedPhone.features : [];

  return (
    <div className="space-y-4">
      {features.map((feature) => (
        <div key={feature} className="flex items-center space-x-2">
          <Checkbox
            id={feature}
            checked={formData.features.includes(feature)}
            onCheckedChange={(checked) => {
              const updatedFeatures = checked
                ? [...formData.features, feature]
                : formData.features.filter((f) => f !== feature);
              setFormData({ ...formData, features: updatedFeatures });
            }}
          />
          <Label htmlFor={feature}>{feature.replace("_", " ")}</Label>
        </div>
      ))}
    </div>
  );
};

const ConditionAssessment = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div>
      <Label className="text-base font-semibold">Overall Condition</Label>
      <RadioGroup
        value={formData.overallCondition}
        onValueChange={(value) => setFormData({ ...formData, overallCondition: value })}
        className="mt-2"
      >
        {["like new", "good", "fair", "poor"].map((condition) => (
          <div key={condition} className="flex items-center space-x-2">
            <RadioGroupItem value={condition} id={`condition-${condition}`} />
            <Label htmlFor={`condition-${condition}`}>{condition}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>

    <div>
      <Label className="text-base font-semibold">Scratches</Label>
      <RadioGroup
        value={formData.scratches}
        onValueChange={(value) => setFormData({ ...formData, scratches: value })}
        className="mt-2"
      >
        {["none", "minor", "moderate", "severe"].map((scratch) => (
          <div key={scratch} className="flex items-center space-x-2">
            <RadioGroupItem value={scratch} id={`scratch-${scratch}`} />
            <Label htmlFor={`scratch-${scratch}`}>{scratch}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>

    <div>
      <Label className="text-base font-semibold">Display Condition</Label>
      <RadioGroup
        value={formData.displayCondition}
        onValueChange={(value) => setFormData({ ...formData, displayCondition: value })}
        className="mt-2"
      >
        {[
          "perfect",
          "minor scratches",
          "moderate scratches",
          "severe scratches",
          "chipped",
          "cracked",
        ].map((display) => (
          <div key={display} className="flex items-center space-x-2">
            <RadioGroupItem value={display} id={`display-${display}`} />
            <Label htmlFor={`display-${display}`}>{display}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  </div>
);

const ComponentChecklist = ({ formData, setFormData, phoneData }) => {
  const components = [
    "screen",
    "battery",
    "buttons",
    "cameras",
    "speakers_mic",
    "charging_port",
    "wireless_charging",
    "biometric_sensors",
    "water_resistance",
  ];

  return (
    <div className="space-y-4">
      {components.map((component) => (
        <div key={component}>
          <Label className="text-base font-semibold">{component.replace("_", " ")}</Label>
          <RadioGroup
            value={formData.components[component]}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                components: { ...formData.components, [component]: value },
              })
            }
            className="mt-2"
          >
            {["perfect", "minor issues", "major issues"].map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <RadioGroupItem value={condition} id={`${component}-${condition}`} />
                <Label htmlFor={`${component}-${condition}`}>{condition}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

const RepairHistory = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div>
      <Label className="text-base font-semibold">Repair History</Label>
      <RadioGroup
        value={formData.repairHistory}
        onValueChange={(value) => setFormData({ ...formData, repairHistory: value })}
        className="mt-2"
      >
        {["no repairs", "official repair", "third-party repair", "self-repair"].map((repair) => (
          <div key={repair} className="flex items-center space-x-2">
            <RadioGroupItem value={repair} id={`repair-${repair}`} />
            <Label htmlFor={`repair-${repair}`}>{repair}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>

    <div>
      <Label className="text-base font-semibold">Original Accessories</Label>
      <div className="mt-2 space-y-2">
        {["charger", "cable", "earphones", "box"].map((accessory) => (
          <div key={accessory} className="flex items-center space-x-2">
            <Checkbox
              id={accessory}
              checked={formData.accessories.includes(accessory)}
              onCheckedChange={(checked) => {
                const updatedAccessories = checked
                  ? [...formData.accessories, accessory]
                  : formData.accessories.filter((a) => a !== accessory);
                setFormData({ ...formData, accessories: updatedAccessories });
              }}
            />
            <Label htmlFor={accessory}>{accessory}</Label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const calculateResaleValue = (formData, phoneData) => {
  const baseValue = formData.originalPrice;
  const ageMultiplier = phoneData.age_multipliers.find((am) => am.age === parseInt(formData.age))?.multiplier || 0.15;
  const selectedPhone = phoneData.phones.find((p) => p.model === formData.model);
  const conditionMultiplier = selectedPhone?.condition_multipliers[formData.overallCondition] || 0.5;
  const scratchMultiplier = selectedPhone?.scratch_multipliers[formData.scratches] || 1;
  const displayMultiplier = selectedPhone?.display_condition_multipliers[formData.displayCondition] || 1;
  
  const componentMultiplier = Object.entries(formData.components).reduce((acc, [component, condition]) => {
    return acc * (selectedPhone?.component_multipliers[component][condition] || 1);
  }, 1);
  
  const featureMultiplier = formData.features.reduce((acc, feature) => acc * (phoneData.feature_multipliers[feature] || 1), 1);
  const repairMultiplier = phoneData.repair_history_multipliers[formData.repairHistory] || 1;
  const accessoryMultiplier = formData.accessories.length === 4 ? phoneData.accessory_multipliers.all_original : 
                               formData.accessories.length > 0 ? phoneData.accessory_multipliers.partial_original : 
                               phoneData.accessory_multipliers.no_accessories;
  const marketDemandMultiplier = phoneData.market_demand_multipliers[formData.brand] || 1;

  const estimatedValue = baseValue * ageMultiplier * conditionMultiplier * scratchMultiplier * 
                         displayMultiplier * componentMultiplier * featureMultiplier * 
                         repairMultiplier * accessoryMultiplier * marketDemandMultiplier;

  const lowerBound = estimatedValue * 0.9;
  const upperBound = estimatedValue * 1.1;

  return {
    estimated: estimatedValue,
    range: { lower: lowerBound, upper: upperBound },
    privateSale: estimatedValue * phoneData.sale_type_multipliers.private_sale,
    tradeIn: estimatedValue * phoneData.sale_type_multipliers.trade_in,
    instantCash: estimatedValue * phoneData.sale_type_multipliers.instant_cash,
    factors: {
      age: (1 - ageMultiplier) * 100,
      condition: (1 - conditionMultiplier) * 100,
      scratches: (1 - scratchMultiplier) * 100,
      display: (1 - displayMultiplier) * 100,
      components: (1 - componentMultiplier) * 100,
      features: (featureMultiplier - 1) * 100,
      repair: (1 - repairMultiplier) * 100,
      accessories: (accessoryMultiplier - 1) * 100,
      marketDemand: (marketDemandMultiplier - 1) * 100,
    },
  };
};

const Results = ({ formData, phoneData }) => {
  const resaleValue = calculateResaleValue(formData, phoneData);

  const ValueCard = ({ title, value, color }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge variant={color}>{color}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${value.toFixed(2)}</div>
      </CardContent>
    </Card>
  );

  const FactorBar = ({ label, value }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value.toFixed(2)}%</span>
      </div>
      <Progress value={Math.abs(value)} className={value < 0 ? "bg-red-200" : "bg-green-200"} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ValueCard title="Estimated Value" value={resaleValue.estimated} />
        <ValueCard title="Private Sale" value={resaleValue.privateSale}  />
        <ValueCard title="Trade-In" value={resaleValue.tradeIn} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Value Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold">
            ${resaleValue.range.lower.toFixed(2)} - ${resaleValue.range.upper.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Value Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(resaleValue.factors).map(([factor, value]) => (
            <FactorBar key={factor} label={factor.charAt(0).toUpperCase() + factor.slice(1)} value={value} />
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Original Price:</strong> ${formData.originalPrice}</div>
              <div><strong>Brand:</strong> {formData.brand}</div>
              <div><strong>Model:</strong> {formData.model}</div>
              <div><strong>Storage:</strong> {formData.storage}GB</div>
              <div><strong>Age:</strong> {formData.age} years</div>
              <div><strong>Condition:</strong> {formData.overallCondition}</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Value Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Estimated Value:</strong> ${resaleValue.estimated.toFixed(2)}</div>
              <div><strong>Original Price:</strong> ${formData.originalPrice}</div>
              <div><strong>Depreciation:</strong> {((1 - resaleValue.estimated / formData.originalPrice) * 100).toFixed(2)}%</div>
              <div><strong>Pristine Condition Value:</strong> ${(formData.originalPrice * 0.9).toFixed(2)}</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    releaseYear: "",
    storage: "",
    age: "",
    originalPrice: 0,
    features: [],
    overallCondition: "",
    scratches: "",
    displayCondition: "",
    components: {},
    repairHistory: "",
    accessories: [],
  });

  const phoneData = useMemo(() => ({
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
  }), []);

  const stepComponents = [
    <DeviceSelection formData={formData} setFormData={setFormData} phoneData={phoneData} />,
    <Features formData={formData} setFormData={setFormData} phoneData={phoneData} />,
    <ConditionAssessment formData={formData} setFormData={setFormData} />,
    <ComponentChecklist formData={formData} setFormData={setFormData} phoneData={phoneData} />,
    <RepairHistory formData={formData} setFormData={setFormData} />,
    <Results formData={formData} phoneData={phoneData} />,
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1 && isStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.brand && formData.model && formData.storage && formData.age;
      case 1:
        return formData.features.length > 0;
      case 2:
        return formData.overallCondition && formData.scratches && formData.displayCondition;
      case 3:
        return Object.keys(formData.components).length === 9;
      case 4:
        return formData.repairHistory !== "" && formData.accessories.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Mobile Phone Resale Value Estimator</h1>
      <ProgressIndicator currentStep={currentStep} steps={steps} />
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent>{stepComponents[currentStep]}</CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleBack} disabled={currentStep === 0}>
            Back
          </Button>
          {currentStep < steps.length - 1 && (
  <Button onClick={handleNext} disabled={!isStepValid()}>
    {currentStep === steps.length - 2 ? "Calculate" : "Next"}
  </Button>
)}
        </CardFooter>
      </Card>
    </div>
  );
}
