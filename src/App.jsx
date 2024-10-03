import React, { useState, useCallback, useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const dataset={applianceTypes:[{type:"Refrigerator",appliances:[{brand:"LG",model:"LRMVS3006S",powerConsumption:580,unitOfMeasurement:"kWh/year",averageDailyUsage:24},{brand:"Samsung",model:"RF23A9771SR",powerConsumption:630,unitOfMeasurement:"kWh/year",averageDailyUsage:24},{brand:"Whirlpool",model:"WRF555SDFZ",powerConsumption:540,unitOfMeasurement:"kWh/year",averageDailyUsage:24}]},{type:"Washing Machine",appliances:[{brand:"Maytag",model:"MVW7230HC",powerConsumption:120,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"GE",model:"GTW720BSNWS",powerConsumption:135,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"Electrolux",model:"EFLS627UTT",powerConsumption:60,unitOfMeasurement:"kWh/year",averageDailyUsage:1}]},{type:"Clothes Dryer",appliances:[{brand:"LG",model:"DLEX3900W",powerConsumption:607,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"Samsung",model:"DVE45R6100C",powerConsumption:632,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"Whirlpool",model:"WED7120HC",powerConsumption:618,unitOfMeasurement:"kWh/year",averageDailyUsage:1}]},{type:"Dishwasher",appliances:[{brand:"Bosch",model:"SHPM88Z75N",powerConsumption:269,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"KitchenAid",model:"KDTM404KPS",powerConsumption:240,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"Miele",model:"G 7316 SCU",powerConsumption:230,unitOfMeasurement:"kWh/year",averageDailyUsage:1}]},{type:"Television",appliances:[{brand:"Samsung",model:"QN65Q80TAFXZA",powerConsumption:170,unitOfMeasurement:"watts",averageDailyUsage:5},{brand:"LG",model:"OLED65CXPUA",powerConsumption:130,unitOfMeasurement:"watts",averageDailyUsage:5},{brand:"Sony",model:"XBR-65X950H",powerConsumption:185,unitOfMeasurement:"watts",averageDailyUsage:5}]},{type:"Air Conditioner",appliances:[{brand:"Frigidaire",model:"FFRE0833U1",powerConsumption:660,unitOfMeasurement:"watts",averageDailyUsage:8},{brand:"LG",model:"LW1019IVSM",powerConsumption:900,unitOfMeasurement:"watts",averageDailyUsage:8},{brand:"Haier",model:"ESAQ406T",powerConsumption:550,unitOfMeasurement:"watts",averageDailyUsage:8}]},{type:"Laptop",appliances:[{brand:"Apple",model:"MacBook Pro 16-inch",powerConsumption:96,unitOfMeasurement:"watts",averageDailyUsage:8},{brand:"Dell",model:"XPS 15",powerConsumption:130,unitOfMeasurement:"watts",averageDailyUsage:8},{brand:"Lenovo",model:"ThinkPad X1 Carbon",powerConsumption:65,unitOfMeasurement:"watts",averageDailyUsage:8}]},{type:"Light Bulb",appliances:[{brand:"Philips",model:"LED A19 60W Equivalent",powerConsumption:9,unitOfMeasurement:"watts",averageDailyUsage:5},{brand:"Cree",model:"100W Equivalent LED",powerConsumption:16,unitOfMeasurement:"watts",averageDailyUsage:5},{brand:"GE",model:"Reveal HD+ 75W Equivalent LED",powerConsumption:11,unitOfMeasurement:"watts",averageDailyUsage:5}]},{type:"Microwave",appliances:[{brand:"Panasonic",model:"NN-SN766S",powerConsumption:1250,unitOfMeasurement:"watts",averageDailyUsage:.5},{brand:"Toshiba",model:"EM131A5C-SS",powerConsumption:1100,unitOfMeasurement:"watts",averageDailyUsage:.5},{brand:"Breville",model:"BMO870BSS1BUC1",powerConsumption:1400,unitOfMeasurement:"watts",averageDailyUsage:.5}]},{type:"Electric Oven",appliances:[{brand:"GE",model:"JB655YKFS",powerConsumption:3400,unitOfMeasurement:"watts",averageDailyUsage:1},{brand:"Whirlpool",model:"WFE535S0JZ",powerConsumption:3600,unitOfMeasurement:"watts",averageDailyUsage:1},{brand:"Frigidaire",model:"GCRE3060AF",powerConsumption:3500,unitOfMeasurement:"watts",averageDailyUsage:1}]}]};

 
const convertToWatts = (appliance) => appliance.unitOfMeasurement === "kWh/year" ? (appliance.powerConsumption * 1000) / (365 * 24) : appliance.powerConsumption;
const MultiStepInterface = ({ onAddAppliance }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [appliance, setAppliance] = useState("");
  const [hours, setHours] = useState(1);

  const handleNext = () => {
    if (step === 1 && category) setStep(2);
    if (step === 2 && appliance) setStep(3);
    if (step === 3) {
      onAddAppliance({ ...appliance, hours });
      setStep(1);
      setCategory("");
      setAppliance("");
      setHours(1);
    }
  };

  return (
    <div className="space-y-4">
      {step === 1 && (
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {dataset.applianceTypes.map(type => (
              <SelectItem key={type.type} value={type.type}>{type.type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {step === 2 && (
        <Select value={appliance} onValueChange={setAppliance}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select appliance" />
          </SelectTrigger>
          <SelectContent>
            {dataset.applianceTypes
              .find(type => type.type === category)
              ?.appliances.map(app => (
                <SelectItem key={`${app.brand} ${app.model}`} value={app}>
                  {`${app.brand} ${app.model}`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}
      {step === 3 && (
        <div>
          <Label htmlFor="hours">Hours per day</Label>
          <Input
            id="hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(Math.max(1, Math.min(24, Number(e.target.value))))}
            placeholder="Hours per day"
            min={1}
            max={24}
          />
        </div>
      )}
      <Button
        onClick={handleNext}
        disabled={(step === 1 && !category) || (step === 2 && !appliance)}
        className="bg-green-500 hover:bg-green-600"
      >
        {step === 3 ? "Add Appliance" : "Next"}
      </Button>
    </div>
  );
};

const NewApplianceDialog = ({ onAdd }) => {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [powerConsumption, setPowerConsumption] = useState("");
  const [hours, setHours] = useState(1);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = useCallback(() => {
    setError("");
    if (!category || !name || !powerConsumption || !hours) {
      setError("Please fill in all fields");
      return;
    }
    if (isNaN(powerConsumption) || powerConsumption <= 0) {
      setError("Power consumption must be a positive number");
      return;
    }
    onAdd({
      type: category,
      brand: "Custom",
      model: name,
      powerConsumption: Number(powerConsumption),
      unitOfMeasurement: "watts",
      hours
    });
    setIsOpen(false);
    setCategory("");
    setName("");
    setPowerConsumption("");
    setHours(1);
  }, [category, name, powerConsumption, hours, onAdd]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white">
          Add New Appliance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Appliance</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {dataset.applianceTypes.map(type => (
                <SelectItem key={type.type} value={type.type}>{type.type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Appliance name"
          />
          <Input
            type="number"
            value={powerConsumption}
            onChange={(e) => setPowerConsumption(e.target.value)}
            placeholder="Power consumption (watts)"
          />
          <Input
            type="number"
            value={hours}
            onChange={(e) => setHours(Math.max(1, Math.min(24, Number(e.target.value))))}
            placeholder="Hours per day"
            min={1}
            max={24}
          />
          <Button onClick={handleAdd} className="bg-green-500 hover:bg-green-600">Add</Button>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};


const ResultsSection = ({ appliances, unitCost }) => {
  const [hourlyConsumption, setHourlyConsumption] = useState(0);
  const [monthlyEstimate, setMonthlyEstimate] = useState(0);
  const [maxMonthlyEstimate, setMaxMonthlyEstimate] = useState(0);
  const [applianceContributions, setApplianceContributions] = useState([]);

  useEffect(() => {
    let totalMonthlyConsumption = 0;
    const applianceConsumptions = appliances.map(appliance => {
      const watts = convertToWatts(appliance);
      const monthlyConsumption = (watts * appliance.hours * 30) / 1000; // kWh per month
      totalMonthlyConsumption += monthlyConsumption;
      return { ...appliance, monthlyConsumption };
    });

    const hourly = totalMonthlyConsumption / (30 * 24);
    setHourlyConsumption(hourly);

    const monthly = totalMonthlyConsumption * unitCost;
    setMonthlyEstimate(monthly);

    const maxMonthly = appliances.reduce((total, appliance) => {
      const watts = convertToWatts(appliance);
      return total + (watts * 24 * 30) / 1000;
    }, 0) * unitCost;
    setMaxMonthlyEstimate(maxMonthly);

    // Calculate appliance contributions
    const contributions = applianceConsumptions.map(appliance => {
      const contribution = (appliance.monthlyConsumption / totalMonthlyConsumption) * 100;
      return {
        name: `${appliance.brand} ${appliance.model}`,
        contribution: contribution,
        monthlyCost: appliance.monthlyConsumption * unitCost
      };
    });
    setApplianceContributions(contributions);
  }, [appliances, unitCost]);

  return (
    <Card className="mt-8 bg-white text-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl text-green-500">Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-500">Hourly Energy Consumption</h3>
          <p className="text-2xl">{hourlyConsumption.toFixed(2)} kWh</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-500">Monthly Estimate</h3>
          <p className="text-2xl">${monthlyEstimate.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-500">Max Monthly Estimate (24/7 usage)</h3>
          <p className="text-2xl">${maxMonthlyEstimate.toFixed(2)}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-500 mb-2">Comparison</h3>
          <Slider
            value={[monthlyEstimate]}
            max={maxMonthlyEstimate}
            step={0.01}
            className="mt-2"
          />
          <div className="flex justify-between text-sm mt-1 text-gray-600">
            <span>$0</span>
            <span>${maxMonthlyEstimate.toFixed(2)}</span>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-green-500 mb-2">Appliance Contributions</h3>
          {applianceContributions.map((appliance, index) => (
            <div key={index} className="mt-4">
              <p className="text-gray-700">
                {appliance.name} - ${appliance.monthlyCost.toFixed(2)}/month
              </p>
              <Slider
                value={[appliance.contribution]}
                max={100}
                step={0.01}
                className="mt-1"
              />
              <p className="text-sm text-right text-gray-600">{appliance.contribution.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [appliances, setAppliances] = useState([]);
  const [unitCost, setUnitCost] = useState(0.12);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const [hourlyConsumption, setHourlyConsumption] = useState(0);

  const handleAddAppliance = useCallback((newAppliance) => {
    setAppliances(prevAppliances => [...prevAppliances, newAppliance]);
  }, []);

  const handleCalculate = useCallback(() => {
    setError("");
    if (appliances.length === 0) {
      setError("Please add at least one appliance before calculating");
      return;
    }
    if (unitCost <= 0) {
      setError("Unit cost must be greater than zero");
      return;
    }
    setShowResults(true);
  }, [appliances, unitCost]);

  useEffect(() => {
    const hourly = appliances.reduce((total, appliance) => {
      const watts = convertToWatts(appliance);
      return total + (watts * appliance.hours) / 1000;
    }, 0);
    setHourlyConsumption(hourly);
  }, [appliances]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-green-500">Electricity Consumption Calculator</h1>
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-500">Add Appliances</h2>
          <MultiStepInterface onAddAppliance={handleAddAppliance} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-500">Custom Appliance</h2>
          <NewApplianceDialog onAdd={handleAddAppliance} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-500">Unit Cost (USD/kWh)</h2>
          <Input
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(Math.max(0, Number(e.target.value)))}
            placeholder="Enter unit cost"
            step="0.01"
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-500">Added Appliances</h2>
          {appliances.map((appliance, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded mb-2">
              <p>{appliance.brand} {appliance.model} - {appliance.hours} hours/day</p>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-500">Hourly Energy Consumption</h2>
          <p className="text-2xl">{hourlyConsumption.toFixed(2)} kWh</p>
        </div>
        <Button onClick={handleCalculate} className="w-full bg-green-500 hover:bg-green-600">
          Calculate
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {showResults && <ResultsSection appliances={appliances} unitCost={unitCost} />}
      </div>
    </div>
  );
}