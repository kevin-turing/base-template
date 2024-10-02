import React, { useState, useEffect } from 'react';
import { Button, Input, Select, SelectItem, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

const shippingData = {
  routes: [
    // ... (insert provided routes data here)
  ],
  currencyRates: {
    // ... (insert provided currency rates here)
  }
};

const weightClasses = shippingData.routes[0].weightClasses; // Assuming all routes have same weight classes

function App() {
  const [formData, setFormData] = useState({
    weight: '', length: '', width: '', height: '', fragile: false, 
    origin: '', destination: '', shippingMethod: 'Standard', currency: 'USD'
  });
  const [result, setResult] = useState({ time: '', cost: '' });
  const [error, setError] = useState('');

  const calculateShipping = () => {
    const { weight, length, width, height, fragile, origin, destination, shippingMethod, currency } = formData;
    const route = shippingData.routes.find(r => r.origin === origin && r.destination === destination);
    if (!route) {
      setError("Route not found.");
      return;
    }

    if (parseFloat(weight) > weightClasses[weightClasses.length - 1].maxWeight) {
      setError("Package weight exceeds maximum allowed.");
      return;
    }

    if (fragile && shippingMethod !== 'Premium') {
      setError("Fragile items must use Premium shipping.");
      return;
    }

    const weightClass = weightClasses.find(wc => parseFloat(weight) <= wc.maxWeight);
    let dimensionMultiplier = 1;
    if (Math.max(length, width, height) > 2) dimensionMultiplier = 1.2;
    else if (Math.max(length, width, height) > 1) dimensionMultiplier = 1.1;

    const estimatedTime = route.baseTransitTime * weightClass.transitTimeMultiplier;
    let daysToAdd = Math.max(length, width, height) > 1 ? 1 : 0;
    daysToAdd += Math.max(length, width, height) > 2 ? 1 : 0;
    
    const shippingMethodMultiplier = { 'Standard': 1, 'Silver': 1.15, 'Premium': 1.3 }[shippingMethod];
    const fragileMultiplier = fragile && shippingMethod === 'Premium' ? 1.1 : 1;

    const baseCost = route.basePrice * weightClass.priceMultiplier * dimensionMultiplier * shippingMethodMultiplier * fragileMultiplier;
    const finalCost = baseCost * shippingData.currencyRates[currency];

    setResult({
      time: `${estimatedTime + daysToAdd} days`,
      cost: `${finalCost.toFixed(2)} ${currency}`
    });
    setError('');
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Shipping Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['weight', 'length', 'width', 'height'].map(field => (
            <Input 
              key={field} 
              type="number" 
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
              value={formData[field]} 
              onChange={e => setFormData({...formData, [field]: e.target.value})} 
            />
          ))}
          <Select 
            value={formData.origin} 
            onValueChange={value => setFormData({...formData, origin: value})}
          >
            <SelectItem value="">Select Origin</SelectItem>
            {shippingData.routes.map(r => <SelectItem key={r.origin} value={r.origin}>{r.origin}</SelectItem>)}
          </Select>
          <Select 
            value={formData.destination} 
            onValueChange={value => setFormData({...formData, destination: value})}
          >
            <SelectItem value="">Select Destination</SelectItem>
            {shippingData.routes.map(r => <SelectItem key={r.destination} value={r.destination}>{r.destination}</SelectItem>)}
          </Select>
          <Select 
            value={formData.shippingMethod} 
            onValueChange={value => setFormData({...formData, shippingMethod: value})}
          >
            {['Standard', 'Silver', 'Premium'].map(method => 
              <SelectItem key={method} value={method}>{method}</SelectItem>
            )}
          </Select>
          <Select 
            value={formData.currency} 
            onValueChange={value => setFormData({...formData, currency: value})}
          >
            {Object.keys(shippingData.currencyRates).map(currency => 
              <SelectItem key={currency} value={currency}>{currency}</SelectItem>
            )}
          </Select>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="fragile" 
              checked={formData.fragile} 
              onChange={e => setFormData({...formData, fragile: e.target.checked})} 
            />
            <label htmlFor="fragile" className="ml-2">Fragile</label>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button onClick={calculateShipping}>Calculate</Button>
          {result.time && result.cost && (
            <div>
              <p>Estimated Time: {result.time}</p>
              <p>Estimated Cost: {result.cost}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;