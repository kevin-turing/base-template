import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem, Card, CardContent, CardHeader, CardTitle, CardDescription, Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui";
import { Label } from "@/components/ui/label";
import { Range } from "@/components/ui/range";

const dataset={applianceTypes:[{type:"Refrigerator",appliances:[{brand:"LG",model:"LRMVS3006S",powerConsumption:580,unitOfMeasurement:"kWh/year",averageDailyUsage:24},{brand:"Samsung",model:"RF23A9771SR",powerConsumption:630,unitOfMeasurement:"kWh/year",averageDailyUsage:24},{brand:"Whirlpool",model:"WRF555SDFZ",powerConsumption:540,unitOfMeasurement:"kWh/year",averageDailyUsage:24}]},{type:"Washing Machine",appliances:[{brand:"Maytag",model:"MVW7230HC",powerConsumption:120,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"GE",model:"GTW720BSNWS",powerConsumption:135,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"Electrolux",model:"EFLS627UTT",powerConsumption:60,unitOfMeasurement:"kWh/year",averageDailyUsage:1}]},{type:"Clothes Dryer",appliances:[{brand:"LG",model:"DLEX3900W",powerConsumption:607,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"Samsung",model:"DVE45R6100C",powerConsumption:632,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"Whirlpool",model:"WED7120HC",powerConsumption:618,unitOfMeasurement:"kWh/year",averageDailyUsage:1}]},{type:"Dishwasher",appliances:[{brand:"Bosch",model:"SHPM88Z75N",powerConsumption:269,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"KitchenAid",model:"KDTM404KPS",powerConsumption:240,unitOfMeasurement:"kWh/year",averageDailyUsage:1},{brand:"Miele",model:"G 7316 SCU",powerConsumption:230,unitOfMeasurement:"kWh/year",averageDailyUsage:1}]},{type:"Television",appliances:[{brand:"Samsung",model:"QN65Q80TAFXZA",powerConsumption:170,unitOfMeasurement:"watts",averageDailyUsage:5},{brand:"LG",model:"OLED65CXPUA",powerConsumption:130,unitOfMeasurement:"watts",averageDailyUsage:5},{brand:"Sony",model:"XBR-65X950H",powerConsumption:185,unitOfMeasurement:"watts",averageDailyUsage:5}]},{type:"Air Conditioner",appliances:[{brand:"Frigidaire",model:"FFRE0833U1",powerConsumption:660,unitOfMeasurement:"watts",averageDailyUsage:8},{brand:"LG",model:"LW1019IVSM",powerConsumption:900,unitOfMeasurement:"watts",averageDailyUsage:8},{brand:"Haier",model:"ESAQ406T",powerConsumption:550,unitOfMeasurement:"watts",averageDailyUsage:8}]},{type:"Laptop",appliances:[{brand:"Apple",model:"MacBook Pro 16-inch",powerConsumption:96,unitOfMeasurement:"watts",averageDailyUsage:8},{brand:"Dell",model:"XPS 15",powerConsumption:130,unitOfMeasurement:"watts",averageDailyUsage:8},{brand:"Lenovo",model:"ThinkPad X1 Carbon",powerConsumption:65,unitOfMeasurement:"watts",averageDailyUsage:8}]},{type:"Light Bulb",appliances:[{brand:"Philips",model:"LED A19 60W Equivalent",powerConsumption:9,unitOfMeasurement:"watts",averageDailyUsage:5},{brand:"Cree",model:"100W Equivalent LED",powerConsumption:16,unitOfMeasurement:"watts",averageDailyUsage:5},{brand:"GE",model:"Reveal HD+ 75W Equivalent LED",powerConsumption:11,unitOfMeasurement:"watts",averageDailyUsage:5}]},{type:"Microwave",appliances:[{brand:"Panasonic",model:"NN-SN766S",powerConsumption:1250,unitOfMeasurement:"watts",averageDailyUsage:.5},{brand:"Toshiba",model:"EM131A5C-SS",powerConsumption:1100,unitOfMeasurement:"watts",averageDailyUsage:.5},{brand:"Breville",model:"BMO870BSS1BUC1",powerConsumption:1400,unitOfMeasurement:"watts",averageDailyUsage:.5}]},{type:"Electric Oven",appliances:[{brand:"GE",model:"JB655YKFS",powerConsumption:3400,unitOfMeasurement:"watts",averageDailyUsage:1},{brand:"Whirlpool",model:"WFE535S0JZ",powerConsumption:3600,unitOfMeasurement:"watts",averageDailyUsage:1},{brand:"Frigidaire",model:"GCRE3060AF",powerConsumption:3500,unitOfMeasurement:"watts",averageDailyUsage:1}]}]};


function App() {
  const [appliances, setAppliances] = useState([{ category: '', appliance: '', power: 0, hours: 0 }]);
  const [unitCost, setUnitCost] = useState(0.12); // Default unit cost in USD per kWh
  const [hourlyConsumption, setHourlyConsumption] = useState(0);
  const [monthlyEstimate, setMonthlyEstimate] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const totalPower = appliances.reduce((sum, item) => sum + (item.power * item.hours), 0);
    setHourlyConsumption(totalPower / 1000); // Convert watts to kilowatts
  }, [appliances]);

  const calculateMonthlyEstimate = () => {
    const monthlyKWh = hourlyConsumption * 24 * 30; // Assuming 30 days in a month
    setMonthlyEstimate(monthlyKWh * unitCost);
  };

  const addAppliance = (isNew = false) => {
    if (isNew) {
      setAppliances(prev => [...prev, { category: '', appliance: '', name: '', power: 0, hours: 0 }]);
    } else {
      setAppliances(prev => [...prev, prev[prev.length - 1]]);
    }
  };

  const updateAppliance = (index, field, value) => {
    setAppliances(prev => {
      const newAppliances = [...prev];
      newAppliances[index][field] = value;
      return newAppliances;
    });
  };

  const getAppliancesForCategory = (category) => {
    return dataset.applianceTypes.find(type => type.type === category)?.appliances || [];
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Electricity Consumption Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {appliances.map((app, index) => (
            <div key={index} className="border-b pb-4 mb-4">
              <Select onValueChange={(value) => updateAppliance(index, 'category', value)}>
                <SelectItem value="">Select Category</SelectItem>
                {dataset.applianceTypes.map(type => <SelectItem key={type.type} value={type.type}>{type.type}</SelectItem>)}
              </Select>
              <Select onValueChange={(value) => updateAppliance(index, 'appliance', value)}>
                <SelectItem value="">Select Appliance</SelectItem>
                {app.category && getAppliancesForCategory(app.category).map(appliance => 
                  <SelectItem key={appliance.model} value={appliance.model}>{appliance.brand} {appliance.model}</SelectItem>
                )}
              </Select>
              {app.appliance && (
                <>
                  <Input 
                    type="number" 
                    placeholder="Power in Watts" 
                    value={app.power} 
                    onChange={(e) => updateAppliance(index, 'power', parseFloat(e.target.value))} 
                  />
                  <Input 
                    type="number" 
                    placeholder="Hours per day" 
                    value={app.hours} 
                    onChange={(e) => updateAppliance(index, 'hours', parseFloat(e.target.value))} 
                  />
                </>
              )}
            </div>
          ))}
          <Button onClick={() => setOpen(true)} className="bg-green-500">+</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogFooter>
                <Button onClick={() => {addAppliance(); setOpen(false);}}>Existing Appliance</Button>
                <Button onClick={() => {addAppliance(true); setOpen(false);}}>New Appliance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Label>Unit Cost (USD/kWh)</Label>
          <Input type="number" value={unitCost} onChange={(e) => setUnitCost(parseFloat(e.target.value))} />

          <div>
            <Label>Hourly Energy Consumption: {hourlyConsumption.toFixed(2)} kWh</Label>
          </div>

          <Button onClick={calculateMonthlyEstimate} className="bg-green-500">Calculate Monthly Estimate</Button>
          {monthlyEstimate > 0 && (
            <div>
              <Label>Total Monthly Estimate: ${monthlyEstimate.toFixed(2)}</Label>
              <Range value={[monthlyEstimate, hourlyConsumption * 24 * 30 * unitCost]} className="h-4 bg-green-200" />
              <div>
                {appliances.map((app, idx) => (
                  <div key={idx}>
                    <Label>{app.appliance || 'New Appliance'} Contribution:</Label>
                    <Range 
                      value={[(app.power * app.hours * 30 * unitCost) / monthlyEstimate * 100]} 
                      className="h-4 bg-green-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;