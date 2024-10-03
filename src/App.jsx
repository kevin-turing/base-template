// App.jsx
import React, { useState } from 'react';
import { Button, Input, Select, SelectItem, Dialog, Card, CardContent } from "@/components/ui";
import { dataset } from "./data";

function App() {
  const [appliances, setAppliances] = useState([]);
  const [unitCost, setUnitCost] = useState(0.12); // Default cost per kWh in USD
  const [open, setOpen] = useState(false);
  const [isNewAppliance, setIsNewAppliance] = useState(false);

  const addAppliance = (appliance, hours) => {
    setAppliances([...appliances, { ...appliance, hours: parseFloat(hours) || 0 }]);
  };

  const removeAppliance = (index) => {
    const list = [...appliances];
    list.splice(index, 1);
    setAppliances(list);
  };

  const calculateHourlyConsumption = () => {
    return appliances.reduce((acc, curr) => {
      // Convert kWh/year to watts if necessary
      let power = curr.powerConsumption;
      if (curr.unitOfMeasurement === "kWh/year") {
        power = (power * 1000) / (365 * 24); // Convert to watts
      }
      return acc + (power * curr.hours / 1000); // kWh calculation
    }, 0);
  };

  const calculateMonthlyEstimate = () => {
    const hourly = calculateHourlyConsumption();
    return hourly * 24 * 30 * unitCost; // Assuming 30 days month
  };

  const ApplianceForm = ({ appliance, onAdd }) => {
    const [hours, setHours] = useState(1);

    return (
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-semibold">{appliance.brand} {appliance.model}</h3>
        <Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours per day" />
        <Button className="mt-2" onClick={() => onAdd(appliance, hours)}>Add</Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Electricity Consumption Calculator</h1>
      <Input 
        type="number" 
        value={unitCost} 
        onChange={(e) => setUnitCost(e.target.value)} 
        placeholder="Enter cost per kWh in USD" 
        className="mb-4"
      />
      <Button onClick={() => setOpen(true)} className="mb-4 bg-green-500">+ Add Appliance</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Button onClick={() => setIsNewAppliance(false)}>Existing Appliance</Button>
          <Button onClick={() => setIsNewAppliance(true)}>New Appliance</Button>
        </DialogContent>
      </Dialog>

      {isNewAppliance ? (
        // Logic for adding new appliance would go here
        <div>New Appliance Form</div>
      ) : (
        appliances.map((item, idx) => (
          <Card key={idx} className="mb-2">
            <CardContent>
              <p>{item.brand} {item.model}</p>
              <p>Hours: {item.hours}</p>
              <Button onClick={() => removeAppliance(idx)}>Remove</Button>
            </CardContent>
          </Card>
        ))
      )}

      <div className="mt-4">
        <p>Hourly Consumption: {calculateHourlyConsumption().toFixed(2)} kWh</p>
        <Button onClick={() => { /* trigger calculation */ }}>Calculate Monthly Estimate</Button>
        <p>Estimated Monthly Bill: ${calculateMonthlyEstimate().toFixed(2)}</p>
        {/* Here you would include your visualizations for comparison and appliance contribution */}
      </div>
    </div>
  );
}

export default App;