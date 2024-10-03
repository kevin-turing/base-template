import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select, SelectItem } from "@/components/ui/select";

const data = {
  "instance_types": {
    "general_purpose": {
      "t3.micro": {
        "vcpu": 2,
        "ram": 1,
        "storage": {
          "type": "EBS-Only",
          "size_range": [8, 16384]
        },
        "network_performance": "Up to 5 Gigabit",
        "cpu_architecture": "x86_64",
        "cpu_features": ["AVX", "AVX2"],
        "base_price": 0.0104
      },
      "m5.large": {
        "vcpu": 2,
        "ram": 8,
        "storage": {
          "type": "EBS-Only",
          "size_range": [8, 16384]
        },
        "network_performance": "Up to 10 Gigabit",
        "cpu_architecture": "x86_64",
        "cpu_features": ["AVX", "AVX2", "AVX-512"],
        "base_price": 0.096
      }
    },
    "compute_optimized": {
      "c5.large": {
        "vcpu": 2,
        "ram": 4,
        "storage": {
          "type": "EBS-Only",
          "size_range": [8, 16384]
        },
        "network_performance": "Up to 10 Gigabit",
        "cpu_architecture": "x86_64",
        "cpu_features": ["AVX", "AVX2", "AVX-512"],
        "base_price": 0.085
      }
    },
    "memory_optimized": {
      "r5.large": {
        "vcpu": 2,
        "ram": 16,
        "storage": {
          "type": "EBS-Only",
          "size_range": [8, 16384]
        },
        "network_performance": "Up to 10 Gigabit",
        "cpu_architecture": "x86_64",
        "cpu_features": ["AVX", "AVX2", "AVX-512"],
        "base_price": 0.126
      }
    },
    "storage_optimized": {
      "i3.large": {
        "vcpu": 2,
        "ram": 15.25,
        "storage": {
          "type": "NVMe SSD",
          "size_range": [475, 475]
        },
        "network_performance": "Up to 10 Gigabit",
        "cpu_architecture": "x86_64",
        "cpu_features": ["AVX", "AVX2", "AVX-512"],
        "base_price": 0.156
      }
    },
    "gpu": {
      "p3.2xlarge": {
        "vcpu": 8,
        "ram": 61,
        "gpu": "NVIDIA Tesla V100",
        "gpu_memory": 16,
        "storage": {
          "type": "EBS-Only",
          "size_range": [8, 16384]
        },
        "network_performance": "Up to 10 Gigabit",
        "cpu_architecture": "x86_64",
        "cpu_features": ["AVX", "AVX2", "AVX-512"],
        "base_price": 3.06
      }
    },
    "fpga": {
      "f1.2xlarge": {
        "vcpu": 8,
        "ram": 122,
        "fpga": "Xilinx UltraScale+ VU9P",
        "storage": {
          "type": "NVMe SSD",
          "size_range": [470, 470]
        },
        "network_performance": "Up to 10 Gigabit",
        "cpu_architecture": "x86_64",
        "cpu_features": ["AVX", "AVX2"],
        "base_price": 1.65
      }
    }
  },
  "storage_types": {
    "gp2": {
      "type": "SSD",
      "price_per_gb_month": 0.10,
      "max_iops": 16000,
      "max_throughput": 250
    },
    "gp3": {
      "type": "SSD",
      "price_per_gb_month": 0.08,
      "base_iops": 3000,
      "base_throughput": 125,
      "additional_iops_price": 0.005,
      "additional_throughput_price": 0.04
    },
    "io1": {
      "type": "SSD",
      "price_per_gb_month": 0.125,
      "price_per_iops_month": 0.065
    },
    "st1": {
      "type": "HDD",
      "price_per_gb_month": 0.045,
      "max_throughput": 500,
      "max_iops": 500
    },
    "sc1": {
      "type": "HDD",
      "price_per_gb_month": 0.015,
      "max_throughput": 250,
      "max_iops": 250
    }
  },
  "operating_systems": {
    "linux": {
      "Ubuntu": {
        "versions": ["18.04", "20.04", "22.04"],
        "price_modifier": 0,
        "min_requirements": {
          "ram": 1,
          "storage": 8,
          "vcpu": 1
        }
      },
      "CentOS": {
        "versions": ["7", "8"],
        "price_modifier": 0,
        "min_requirements": {
          "ram": 1,
          "storage": 8,
          "vcpu": 1
        }
      },
      "Debian": {
        "versions": ["10", "11"],
        "price_modifier": 0,
        "min_requirements": {
          "ram": 0.5,
          "storage": 8,
          "vcpu": 1
        }
      },
      "Red Hat Enterprise Linux": {
        "versions": ["7", "8", "9"],
        "price_modifier": 0.08,
        "min_requirements": {
          "ram": 1,
          "storage": 10,
          "vcpu": 1
        }
      },
      "Amazon Linux 2": {
        "versions": ["2"],
        "price_modifier": 0,
        "min_requirements": {
          "ram": 0.5,
          "storage": 8,
          "vcpu": 1
        }
      },
      "SUSE Linux Enterprise Server": {
        "versions": ["15"],
        "price_modifier": 0.11,
        "min_requirements": {
          "ram": 1,
          "storage": 8,
          "vcpu": 1
        }
      }
    },
    "windows": {
      "Windows Server": {
        "versions": ["2016", "2019", "2022"],
        "price_modifier": 0.12,
        "min_requirements": {
          "ram": 2,
          "storage": 32,
          "vcpu": 1
        }
      }
    },
    "freebsd": {
      "FreeBSD": {
        "versions": ["12", "13"],
        "price_modifier": 0,
        "min_requirements": {
          "ram": 0.5,
          "storage": 8,
          "vcpu": 1
        }
      }
    }
  },
  "pricing_models": {
    "on_demand": {
      "billing_increment": 1,
      "minimum_billing_time": 60
    },
    "reserved_instances": {
      "terms": [1, 3],
      "payment_options": ["no_upfront", "partial_upfront", "all_upfront"],
      "discounts": {
        "1_year": {
          "no_upfront": 0.15,
          "partial_upfront": 0.25,
          "all_upfront": 0.30
        },
        "3_year": {
          "no_upfront": 0.30,
          "partial_upfront": 0.40,
          "all_upfront": 0.45
        }
      }
    },
    "savings_plans": {
      "types": ["compute", "ec2_instance"],
      "terms": [1, 3],
      "discounts": {
        "1_year": 0.20,
        "3_year": 0.35
      }
    },
    "spot_instances": {
      "discount_range": [0.60, 0.90],
      "interruption_probabilities": [
        {"probability": "< 5%", "discount": 0.60},
        {"probability": "5-10%", "discount": 0.70},
        {"probability": "10-15%", "discount": 0.80},
        {"probability": "> 15%", "discount": 0.90}
      ]
    },
    "dedicated_hosts": {
      "on_demand_premium": 1.2,
      "reserved_discounts": {
        "1_year": {
          "no_upfront": 0.10,
          "partial_upfront": 0.20,
          "all_upfront": 0.25
        },
        "3_year": {
          "no_upfront": 0.25,
          "partial_upfront": 0.35,
          "all_upfront": 0.40
        }
      }
    }
  },
  "network_performance": {
    "up_to_5_gigabit": {
      "max_bandwidth": 5,
      "max_pps": 500000
    },
    "up_to_10_gigabit": {
      "max_bandwidth": 10,
      "max_pps": 1000000
    },
    "10_gigabit": {
      "max_bandwidth": 10,
      "max_pps": 1500000
    },
    "20_gigabit": {
      "max_bandwidth": 20,
      "max_pps": 2500000
    },
    "100_gigabit": {
      "max_bandwidth": 100,
      "max_pps": 10000000
    }
  },
  "data_transfer": {
    "inbound": 0,
    "outbound": [
      {"up_to_gb": 1, "price_per_gb": 0},
      {"up_to_gb": 10000, "price_per_gb": 0.09},
      {"up_to_gb": 50000, "price_per_gb": 0.085},
      {"up_to_gb": 150000, "price_per_gb": 0.07},
      {"up_to_gb": null, "price_per_gb": 0.05}
    ]
  },
  "additional_features": {
    "elastic_ip": {
      "price_per_hour": 0.005,
      "price_per_hour_when_not_associated": 0.005
    },
    "elastic_inference": {
      "ei.small": {
        "price_per_hour": 0.12,
        "performance": "1 TFLOPS"
      },
      "ei.medium": {
        "price_per_hour": 0.24,
        "performance": "2 TFLOPS"
      },
      "ei.large": {
        "price_per_hour": 0.48,
        "performance": "4 TFLOPS"
      }
    }
  },
  "default_values": {
    "instance_type": "general_purpose",
    "instance": "t3.micro",
    "storage_type": "gp2",
    "os": "Ubuntu",
    "os_version": "22.04",
    "pricing_model": "on_demand",
    "reserved_term": 1,
    "reserved_payment": "no_upfront",
    "savings_plan_type": "compute",
    "savings_plan_term": 1,
    "spot_probability": "< 5%",
    "dedicated_host_term": 1,
    "dedicated_host_payment": "no_upfront",
    "hours": 730,
    "data_transfer": 0,
    "elastic_ip": false,
    "elastic_inference": "none"
  }
};
function App() {
  const [instanceType, setInstanceType] = useState('general_purpose');
  const [vcpu, setVcpu] = useState(2);
  const [ram, setRam] = useState(1);
  const [storageType, setStorageType] = useState('gp2');
  const [storageSize, setStorageSize] = useState(8);
  const [os, setOs] = useState('Ubuntu');
  const [osVersion, setOsVersion] = useState('22.04');
  const [pricingModel, setPricingModel] = useState('on_demand');
  const [hours, setHours] = useState(730);

  const [error, setError] = useState('');

  const calculatePrice = () => {
    let price = data.instance_types[instanceType][Object.keys(data.instance_types[instanceType])[0]].base_price;
    // Add logic for storage, OS price modifier, etc.
    // This is a placeholder calculation:
    price += (storageSize * data.storage_types[storageType].price_per_gb_month) / 730; // Assuming monthly to hourly
    // Add more calculation logic here
    return price.toFixed(4);
  };

  const validateInput = () => {
    if (vcpu < 1 || vcpu > 128 || ram < 0.5 || ram > 4096 || storageSize < 8 || storageSize > 64000) {
      setError('Please ensure all inputs are within valid ranges.');
      return false;
    }
    setError('');
    return true;
  };

  return (
    <div className="bg-purple-500 min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>VPS Price Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setInstanceType}>
            <SelectItem value="general_purpose">General Purpose</SelectItem>
            <SelectItem value="compute_optimized">Compute Optimized</SelectItem>
            {/* Add other options */}
          </Select>
          
          <Input 
            type="number" 
            value={vcpu} 
            onChange={(e) => setVcpu(Number(e.target.value))} 
            label="vCPUs" 
            min="1" 
            max="128" 
            onBlur={validateInput}
          />
          {/* Implement similar inputs for RAM, Storage, etc. */}
          
          <Select onValueChange={setOs}>
            <SelectItem value="Ubuntu">Ubuntu</SelectItem>
            {/* Add other OS options */}
          </Select>

          <Input 
            type="number" 
            value={hours} 
            onChange={(e) => setHours(Number(e.target.value))} 
            label="Hours to Run" 
            min="1" 
          />

          {error && <p className="text-red-500">{error}</p>}
          
          <div className="text-right text-xl font-bold">
            Estimated Price: ${calculatePrice()} per hour
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;