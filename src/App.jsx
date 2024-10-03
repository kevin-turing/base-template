import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

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

const getInitialState = () => {
  try {
    const initialInstanceType = Object.keys(data.instance_types)[0];
    const initialInstance = Object.keys(data.instance_types[initialInstanceType])[0];
    const initialInstanceData = data.instance_types[initialInstanceType][initialInstance];

    return {
      instanceType: initialInstanceType,
      instance: initialInstance,
      vcpu: initialInstanceData.vcpu,
      ram: initialInstanceData.ram,
      storage: {
        type: "gp2",
        size: initialInstanceData.storage.size_range[0]
      },
      networkPerformance: initialInstanceData.network_performance,
      cpuArchitecture: initialInstanceData.cpu_architecture,
      cpuFeatures: initialInstanceData.cpu_features,
      os: "Ubuntu",
      osVersion: "22.04",
      pricingModel: "on_demand",
      reservedTerm: 1,
      reservedPayment: "no_upfront",
      savingsPlanType: "compute",
      savingsPlanTerm: 1,
      spotProbability: "< 5%",
      dedicatedHostTerm: 1,
      dedicatedHostPayment: "no_upfront",
      hours: 730,
      dataTransfer: 0,
      elasticIp: false,
      elasticInference: "none"
    };
  } catch (error) {
    console.error("Error initializing state:", error);
    return {};
  }
};

export default function VPSCalculator() {
  const [config, setConfig] = useState(getInitialState);
  const [price, setPrice] = useState({ hourly: 0, monthly: 0 });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      calculatePrice();
      validateInputs();
    } catch (error) {
      console.error("Error in useEffect:", error);
      setErrors(prev => ({ ...prev, general: "An error occurred while calculating the price." }));
    }
  }, [config]);

  const calculatePrice = () => {
    try {
      const instanceData = data.instance_types[config.instanceType]?.[config.instance];
      if (!instanceData) {
        throw new Error("Invalid instance configuration.");
      }
      let basePrice = instanceData.base_price;
      const storagePrice = (config.storage.size * data.storage_types[config.storage.type].price_per_gb_month) / 730;
      let hourlyPrice = basePrice + storagePrice;
      const osData = Object.values(data.operating_systems).find(os => os[config.os]);
      if (!osData) {
        throw new Error("Invalid operating system selection.");
      }
      hourlyPrice *= (1 + osData[config.os].price_modifier);
      
      // Pricing model adjustments
      switch(config.pricingModel) {
        case "reserved_instances":
          hourlyPrice *= (1 - data.pricing_models.reserved_instances.discounts[`${config.reservedTerm}_year`]?.[config.reservedPayment] || 0);
          break;
        case "savings_plans":
          hourlyPrice *= (1 - data.pricing_models.savings_plans.discounts[`${config.savingsPlanTerm}_year`] || 0);
          break;
        case "spot_instances":
          const spotDiscount = data.pricing_models.spot_instances.interruption_probabilities.find(p => p.probability === config.spotProbability)?.discount || 0;
          hourlyPrice *= (1 - spotDiscount);
          break;
        case "dedicated_hosts":
          hourlyPrice *= data.pricing_models.dedicated_hosts.on_demand_premium;
          hourlyPrice *= (1 - data.pricing_models.dedicated_hosts.reserved_discounts[`${config.dedicatedHostTerm}_year`]?.[config.dedicatedHostPayment] || 0);
          break;
      }

      // Data transfer costs
      let dataTransferCost = 0;
      let remainingTransfer = config.dataTransfer;
      for (let tier of data.data_transfer.outbound) {
        if (tier.up_to_gb === null || remainingTransfer <= tier.up_to_gb) {
          dataTransferCost += remainingTransfer * tier.price_per_gb;
          break;
        } else {
          dataTransferCost += tier.up_to_gb * tier.price_per_gb;
          remainingTransfer -= tier.up_to_gb;
        }
      }
      hourlyPrice += dataTransferCost / 730;

      // Additional features
      if (config.elasticIp) {
        hourlyPrice += data.additional_features.elastic_ip.price_per_hour;
      }
      if (config.elasticInference !== "none") {
        hourlyPrice += data.additional_features.elastic_inference[config.elasticInference]?.price_per_hour || 0;
      }

      const monthlyPrice = hourlyPrice * config.hours;
      setPrice({ hourly: hourlyPrice, monthly: monthlyPrice });
    } catch (error) {
      console.error("Error in calculatePrice:", error);
      setErrors(prev => ({ ...prev, general: error.message }));
    }
  };

  const validateInputs = () => {
    try {
      let newErrors = {};
      const instanceData = data.instance_types[config.instanceType]?.[config.instance];
      if (!instanceData) {
        throw new Error("Invalid instance configuration.");
      }
      const osData = Object.values(data.operating_systems).find(os => os[config.os]);
      if (!osData) {
        throw new Error("Invalid operating system selection.");
      }
      if (config.storage.size < instanceData.storage.size_range[0] || config.storage.size > instanceData.storage.size_range[1]) {
        newErrors.storage = `Storage size must be between ${instanceData.storage.size_range[0]} and ${instanceData.storage.size_range[1]} GB`;
      }
      if (config.hours < 1 || config.hours > 744) {
        newErrors.hours = "Hours must be between 1 and 744 (max hours in a month)";
      }
      const minReq = osData[config.os].min_requirements;
      if (config.ram < minReq.ram || config.storage.size < minReq.storage || config.vcpu < minReq.vcpu) {
        newErrors.os = `Selected OS requires at least ${minReq.ram} GB RAM, ${minReq.storage} GB storage, and ${minReq.vcpu} vCPU`;
      }
      setErrors(newErrors);
    } catch (error) {
      console.error("Error in validateInputs:", error);
      setErrors(prev => ({ ...prev, general: error.message }));
    }
  };

  const handleInputChange = (field, value) => {
    try {
      setConfig(prev => {
        if (field === "instanceType" || field === "instance") {
          const newInstanceType = field === "instanceType" ? value : prev.instanceType;
          const newInstance = field === "instance" ? value : Object.keys(data.instance_types[newInstanceType])[0];
          const instanceData = data.instance_types[newInstanceType]?.[newInstance];
          if (!instanceData) {
            throw new Error("Invalid instance selection");
          }
          return {
            ...prev,
            instanceType: newInstanceType,
            instance: newInstance,
            vcpu: instanceData.vcpu,
            ram: instanceData.ram,
            storage: { ...prev.storage, size: instanceData.storage.size_range[0] },
            networkPerformance: instanceData.network_performance,
            cpuArchitecture: instanceData.cpu_architecture,
            cpuFeatures: instanceData.cpu_features
          };
        }
        if (field === "storage") {
          return { ...prev, storage: { ...prev.storage, ...value } };
        }
        return { ...prev, [field]: value };
      });
    } catch (error) {
      console.error("Error in handleInputChange:", error);
      setErrors(prev => ({ ...prev, [field]: error.message }));
    }
  };

  const renderSelect = (label, field, options, optionLabel = (option) => option) => (
    <div>
      <Label className="mb-2 block text-lg font-semibold">{label}</Label>
      <Select 
        value={config[field]} 
        onValueChange={(value) => handleInputChange(field, value)}
        disabled={!options || options.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options && options.map((option) => (
            <SelectItem key={option} value={option}>{optionLabel(option)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 shadow-xl">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center">VPS Price Calculator</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {errors.general && <Alert variant="destructive" className="col-span-1 sm:col-span-2"><AlertDescription>{errors.general}</AlertDescription></Alert>}
              {renderSelect("Instance Type", "instanceType", Object.keys(data.instance_types), (type) => type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1))}
              {renderSelect("Instance", "instance", Object.keys(data.instance_types[config.instanceType] || {}), (instance) => `${instance} ($${data.instance_types[config.instanceType]?.[instance]?.base_price || 0}/hr)`)}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div>
                      <Label className="mb-2 block text-lg font-semibold">vCPUs: {config.vcpu}</Label>
                      <Input type="number" value={config.vcpu} disabled className="w-full" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of virtual CPUs. This is fixed based on the selected instance type.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div>
                      <Label className="mb-2 block text-lg font-semibold">RAM (GB): {config.ram}</Label>
                      <Input type="number" value={config.ram} disabled className="w-full" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Amount of RAM. This is fixed based on the selected instance type.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {renderSelect("Storage Type", "storage.type", Object.keys(data.storage_types), (key) => `${data.storage_types[key].type} (${key}) - $${data.storage_types[key].price_per_gb_month.toFixed(3)}/GB/month`)}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div>
                      <Label className="mb-2 block text-lg font-semibold">Storage Size (GB): {config.storage.size}</Label>
                      <Input
                        type="number"
                        min={data.instance_types[config.instanceType]?.[config.instance]?.storage.size_range[0] || 0}
                        max={data.instance_types[config.instanceType]?.[config.instance]?.storage.size_range[1] || 0}
                        value={config.storage.size}
                        onChange={(e) => handleInputChange("storage", { size: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      {errors.storage && <Alert variant="destructive"><AlertDescription>{errors.storage}</AlertDescription></Alert>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Amount of storage. Min: {data.instance_types[config.instanceType]?.[config.instance]?.storage.size_range[0] || 0} GB, Max: {data.instance_types[config.instanceType]?.[config.instance]?.storage.size_range[1] || 0} GB</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {renderSelect("Network Performance", "networkPerformance", Object.keys(data.network_performance), (key) => `${key.replace('_', ' ')} - ${data.network_performance[key].max_bandwidth} Gbps, ${data.network_performance[key].max_pps} PPS`)}
              {renderSelect("CPU Architecture", "cpuArchitecture", ["x86_64", "ARM64"])}
              <div>
                <Label className="mb-2 block text-lg font-semibold">CPU Features</Label>
                <div className="space-y-2">
                  {["AVX", "AVX2", "AVX-512"].map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Checkbox
                        id={feature}
                        checked={config.cpuFeatures.includes(feature)}
                        onCheckedChange={(checked) => {
                          handleInputChange("cpuFeatures", 
                            checked 
                              ? [...config.cpuFeatures, feature]
                              : config.cpuFeatures.filter(f => f !== feature)
                          );
                        }}
                      />
                      <label htmlFor={feature} className="ml-2">{feature}</label>
                    </div>
                  ))}
                </div>
              </div>
              {renderSelect("Operating System", "os", 
                Object.keys(data.operating_systems).flatMap(osGroup => Object.keys(data.operating_systems[osGroup])), 
                (os) => {
                  const osData = Object.values(data.operating_systems).find(group => group[os])?.[os];
                  return `${os} (${osData?.price_modifier > 0 ? `+${osData.price_modifier * 100}%` : 'Free'})`;
                }
              )}
              {renderSelect("OS Version", "osVersion", 
                Object.values(data.operating_systems).find(osGroup => osGroup[config.os])?.[config.os]?.versions || []
              )}
              {renderSelect("Pricing Model", "pricingModel", Object.keys(data.pricing_models), (model) => model.replace('_', ' ').charAt(0).toUpperCase() + model.slice(1))}
              {config.pricingModel === "reserved_instances" && (
                <>
                  {renderSelect("Reserved Term", "reservedTerm", data.pricing_models.reserved_instances.terms, (term) => `${term} year${term > 1 ? 's' : ''}`)}
                  {renderSelect("Payment Option", "reservedPayment", data.pricing_models.reserved_instances.payment_options, (option) => option.replace('_', ' '))}
                </>
              )}
              {config.pricingModel === "savings_plans" && (
                <>
                  {renderSelect("Savings Plan Type", "savingsPlanType", data.pricing_models.savings_plans.types)}
                  {renderSelect("Savings Plan Term", "savingsPlanTerm", data.pricing_models.savings_plans.terms, (term) => `${term} year${term > 1 ? 's' : ''}`)}
                </>
              )}
              {config.pricingModel === "spot_instances" && (
                renderSelect("Interruption Probability", "spotProbability", 
                  data.pricing_models.spot_instances.interruption_probabilities.map(p => p.probability), 
                  (prob) => `${prob} (Discount: ${data.pricing_models.spot_instances.interruption_probabilities.find(p => p.probability === prob)?.discount * 100 || 0}%)`
                )
              )}
              {config.pricingModel === "dedicated_hosts" && (
                <>
                  {renderSelect("Dedicated Host Term", "dedicatedHostTerm", 
                    Object.keys(data.pricing_models.dedicated_hosts.reserved_discounts).map(term => parseInt(term)), 
                    (term) => `${term} year${parseInt(term) > 1 ? 's' : ''}`
                  )}
                  {renderSelect("Payment Option", "dedicatedHostPayment", 
                    Object.keys(data.pricing_models.dedicated_hosts.reserved_discounts["1_year"] || {}), 
                    (option) => option.replace('_', ' ')
                  )}
                </>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div>
                      <Label className="mb-2 block text-lg font-semibold">Hours to Run</Label>
                      <Input
                        type="number"
                        min={1}
                        max={744}
                        value={config.hours}
                        onChange={(e) => handleInputChange("hours", parseInt(e.target.value))}
                        className="w-full"
                      />
                      {errors.hours && <Alert variant="destructive"><AlertDescription>{errors.hours}</AlertDescription></Alert>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of hours to run the VPS. Maximum 744 hours (31 days) per month.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div>
                <Label className="mb-2 block text-lg font-semibold">Data Transfer (GB)</Label>
                <Input
                  type="number"
                  min={0}
                  value={config.dataTransfer}
                  onChange={(e) => handleInputChange("dataTransfer", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="mb-2 block text-lg font-semibold">Additional Features</Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="elasticIp"
                      checked={config.elasticIp}
                      onCheckedChange={(checked) => handleInputChange("elasticIp", checked)}
                    />
                    <label htmlFor="elasticIp" className="ml-2">Elastic IP</label>
                  </div>
                  {renderSelect("Elastic Inference", "elasticInference", 
                    ["none", ...Object.keys(data.additional_features.elastic_inference)], 
                    (key) => key === "none" ? "None" : `${key} - ${data.additional_features.elastic_inference[key].performance} ($${data.additional_features.elastic_inference[key].price_per_hour}/hr)`
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader className="bg-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">Price Estimate</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-purple-700">Cost Summary</h3>
                <p className="text-2xl font-bold text-blue-600">Hourly: ${price.hourly.toFixed(4)}</p>
                <p className="text-2xl font-bold text-green-600">Monthly: ${price.monthly.toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-purple-700">Selected Configuration</h3>
                <ul className="space-y-2">
                  {Object.entries(config).map(([key, value]) => (
                    <li key={key}><span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</span> {typeof value === 'object' ? JSON.stringify(value) : value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}