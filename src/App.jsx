import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const routes = [
  {
    "origin": "New York",
    "destination": "Los Angeles",
    "distance": 2789,
    "baseTransitTime": 5,
    "basePrice": 100,
    "weightClasses": [
      {
        "class": "Light",
        "maxWeight": 10,
        "transitTimeMultiplier": 1,
        "priceMultiplier": 1
      },
      {
        "class": "Medium",
        "maxWeight": 50,
        "transitTimeMultiplier": 1.2,
        "priceMultiplier": 1.5
      },
      {
        "class": "Heavy",
        "maxWeight": 100,
        "transitTimeMultiplier": 1.5,
        "priceMultiplier": 2
      }
    ]
  },
  {
    "origin": "London",
    "destination": "Paris",
    "distance": 344,
    "baseTransitTime": 2,
    "basePrice": 50,
    "weightClasses": [
      {
        "class": "Light",
        "maxWeight": 10,
        "transitTimeMultiplier": 1,
        "priceMultiplier": 1
      },
      {
        "class": "Medium",
        "maxWeight": 50,
        "transitTimeMultiplier": 1.1,
        "priceMultiplier": 1.3
      },
      {
        "class": "Heavy",
        "maxWeight": 100,
        "transitTimeMultiplier": 1.3,
        "priceMultiplier": 1.7
      }
    ]
  },
  {
    "origin": "Tokyo",
    "destination": "Sydney",
    "distance": 7821,
    "baseTransitTime": 7,
    "basePrice": 150,
    "weightClasses": [
      {
        "class": "Light",
        "maxWeight": 10,
        "transitTimeMultiplier": 1,
        "priceMultiplier": 1
      },
      {
        "class": "Medium",
        "maxWeight": 50,
        "transitTimeMultiplier": 1.3,
        "priceMultiplier": 1.6
      },
      {
        "class": "Heavy",
        "maxWeight": 100,
        "transitTimeMultiplier": 1.7,
        "priceMultiplier": 2.1
      }
    ]
  },
  {
    "origin": "Berlin",
    "destination": "Moscow",
    "distance": 1816,
    "baseTransitTime": 4,
    "basePrice": 80,
    "weightClasses": [
      {
        "class": "Light",
        "maxWeight": 10,
        "transitTimeMultiplier": 1,
        "priceMultiplier": 1
      },
      {
        "class": "Medium",
        "maxWeight": 50,
        "transitTimeMultiplier": 1.2,
        "priceMultiplier": 1.4
      },
      {
        "class": "Heavy",
        "maxWeight": 100,
        "transitTimeMultiplier": 1.4,
        "priceMultiplier": 1.8
      }
    ]
  },
  {
    "origin": "São Paulo",
    "destination": "Mexico City",
    "distance": 7671,
    "baseTransitTime": 8,
    "basePrice": 130,
    "weightClasses": [
      {
        "class": "Light",
        "maxWeight": 10,
        "transitTimeMultiplier": 1,
        "priceMultiplier": 1
      },
      {
        "class": "Medium",
        "maxWeight": 50,
        "transitTimeMultiplier": 1.3,
        "priceMultiplier": 1.7
      },
      {
        "class": "Heavy",
        "maxWeight": 100,
        "transitTimeMultiplier": 1.6,
        "priceMultiplier": 2.2
      }
    ]
  }
]

const currencyRates = {
  "EUR": 0.9378,
  "GBP": 0.8232,
  "JPY": 114.5600,
  "AUD": 1.5623,
  "CAD": 1.3547,
  "CHF": 0.9076,
  "CNY": 6.4728,
  "SEK": 10.3456,
  "NZD": 1.6789,
  "MXN": 20.1234,
  "BRL": 5.4231,
  "INR": 74.1234,
  "RUB": 75.2345,
  "ZAR": 15.6789,
  "KRW": 1185.6789
}
const shippingMethods = ["Standard", "Silver", "Premium"];

export default function ShippingCalculator() {
  const [packageDetails, setPackageDetails] = useState({
    weight: '',
    length: '',
    width: '',
    height: '',
    isFragile: false
  });
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const origins = useMemo(() => [...new Set(routes.map(route => route.origin))], []);
  const destinations = useMemo(() => 
    origin ? routes.filter(route => route.origin === origin).map(route => route.destination) : [], 
    [origin]
  );

  const handlePackageDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPackageDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateInput = () => {
    const { weight, length, width, height } = packageDetails;
    if (!weight || !length || !width || !height || !origin || !destination || !shippingMethod) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (packageDetails.isFragile && shippingMethod !== "Premium") {
      setError("Fragile items must be shipped using the Premium method.");
      return false;
    }
    const numericFields = [weight, length, width, height];
    if (numericFields.some(field => parseFloat(field) <= 0)) {
      setError("Weight and dimensions must be positive numbers.");
      return false;
    }
    setError("");
    return true;
  };

  const calculateShipping = () => {
    if (!validateInput()) return;
  
    const route = routes.find(r => r.origin === origin && r.destination === destination);
    if (!route) {
      setError("Invalid route selected.");
      return;
    }
  
    const { weight, length, width, height, isFragile } = packageDetails;
    const parsedWeight = parseFloat(weight);
    const weightClass = route.weightClasses.find(wc => parsedWeight <= wc.maxWeight);
    if (!weightClass) {
      setError("Package weight exceeds the maximum allowed weight for this route.");
      return;
    }
  
    // Calculate estimated delivery time
    let estimatedDeliveryTime = route.baseTransitTime * weightClass.transitTimeMultiplier;
    const maxDimension = Math.max(parseFloat(length), parseFloat(width), parseFloat(height));
    if (maxDimension > 2) {
      estimatedDeliveryTime += 2;
    } else if (maxDimension > 1) {
      estimatedDeliveryTime += 1;
    }
  
    // Calculate cost
    const basePrice = route.basePrice;
    const priceMultiplier = weightClass.priceMultiplier;
    const dimensionMultiplier = maxDimension > 2 ? 1.2 : maxDimension > 1 ? 1.1 : 1.0;
    const shippingMethodMultiplier = shippingMethod === "Premium" ? 1.3 : shippingMethod === "Silver" ? 1.15 : 1.0;
    const fragileMultiplier = isFragile && shippingMethod === "Premium" ? 1.1 : 1.0;
  
    const finalPrice = basePrice * priceMultiplier * dimensionMultiplier * shippingMethodMultiplier * fragileMultiplier;
  
    // Currency conversion
    const convertedPrice = currency === 'USD' ? finalPrice : finalPrice * currencyRates[currency];
  
    setResults({
      transitTime: Math.ceil(estimatedDeliveryTime),
      cost: convertedPrice.toFixed(2),
      currency,
      method: shippingMethod
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Shipping Time and Cost Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Package Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={packageDetails.weight}
                onChange={handlePackageDetailChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Package Dimensions (m)</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  name="length"
                  type="number"
                  placeholder="Length"
                  value={packageDetails.length}
                  onChange={handlePackageDetailChange}
                />
                <Input
                  name="width"
                  type="number"
                  placeholder="Width"
                  value={packageDetails.width}
                  onChange={handlePackageDetailChange}
                />
                <Input
                  name="height"
                  type="number"
                  placeholder="Height"
                  value={packageDetails.height}
                  onChange={handlePackageDetailChange}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFragile"
                name="isFragile"
                checked={packageDetails.isFragile}
                onCheckedChange={(checked) => handlePackageDetailChange({ target: { name: 'isFragile', type: 'checkbox', checked } })}
              />
              <Label htmlFor="isFragile">Fragile Item</Label>
            </div>
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger id="origin">
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  {origins.map((org) => (
                    <SelectItem key={org} value={org}>{org}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="shippingMethod">Shipping Method</Label>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger id="shippingMethod">
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  {shippingMethods.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(currencyRates).map((curr) => (
                    <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            className="mt-4 w-full" 
            onClick={calculateShipping}
          >
            Calculate Shipping
          </Button>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Shipping Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Estimated Transit Time</h3>
                <Badge variant="secondary" className="text-xl p-2">
                  {results.transitTime} days
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Estimated Cost</h3>
                <Badge variant="secondary" className="text-xl p-2">
                  {results.cost} {results.currency}
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
                <Badge variant="outline" className="text-lg p-2">
                  {results.method}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}