import { CalculatorConfig } from '../../types/calculator';

export const quoteGeneratorConfig: CalculatorConfig = {
  id: 'quote-generator',
  name: 'Professional Quote Generator',
  description: 'Generate professional, detailed quotes with accurate pricing, terms, and delivery estimates for laser cutting services.',
  category: 'customer-acquisition',
  difficulty: 'intermediate',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'partComplexity',
      label: 'Part Complexity',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'simple', label: 'Simple (Basic shapes, minimal features)' },
        { value: 'medium', label: 'Medium (Multiple features, some complexity)' },
        { value: 'complex', label: 'Complex (Intricate designs, tight tolerances)' },
        { value: 'very_complex', label: 'Very Complex (Prototype/custom work)' },
      ],
      required: true,
      description: 'Complexity level of the parts to be cut',
    },
    {
      id: 'materialType',
      label: 'Material Type',
      type: 'select',
      value: 'carbon_steel',
      options: [
        { value: 'carbon_steel', label: 'Carbon Steel' },
        { value: 'stainless_steel', label: 'Stainless Steel' },
        { value: 'aluminum', label: 'Aluminum' },
        { value: 'copper', label: 'Copper' },
        { value: 'brass', label: 'Brass' },
        { value: 'titanium', label: 'Titanium' },
        { value: 'acrylic', label: 'Acrylic' },
      ],
      required: true,
      description: 'Type of material to be cut',
    },
    {
      id: 'materialThickness',
      label: 'Material Thickness',
      type: 'number',
      value: 5,
      unit: 'mm',
      min: 0.5,
      max: 50,
      step: 0.5,
      required: true,
      description: 'Thickness of the material',
    },
    {
      id: 'quantity',
      label: 'Quantity',
      type: 'number',
      value: 50,
      unit: 'parts',
      min: 1,
      max: 10000,
      step: 1,
      required: true,
      description: 'Number of parts required',
    },
    {
      id: 'cuttingLength',
      label: 'Total Cutting Length',
      type: 'number',
      value: 500,
      unit: 'mm',
      min: 10,
      max: 10000,
      step: 10,
      required: true,
      description: 'Total cutting length per part',
    },
    {
      id: 'urgency',
      label: 'Delivery Urgency',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'standard', label: 'Standard (5-7 days)' },
        { value: 'expedited', label: 'Expedited (2-3 days)' },
        { value: 'rush', label: 'Rush (24-48 hours)' },
        { value: 'emergency', label: 'Emergency (Same day)' },
      ],
      required: true,
      description: 'Required delivery timeframe',
    },
    {
      id: 'customerType',
      label: 'Customer Type',
      type: 'select',
      value: 'new',
      options: [
        { value: 'new', label: 'New Customer' },
        { value: 'existing', label: 'Existing Customer' },
        { value: 'volume', label: 'High Volume Customer' },
        { value: 'strategic', label: 'Strategic Partner' },
      ],
      required: true,
      description: 'Customer relationship status',
    },
    {
      id: 'additionalServices',
      label: 'Additional Services',
      type: 'select',
      value: 'none',
      options: [
        { value: 'none', label: 'Cutting Only' },
        { value: 'deburring', label: 'Deburring' },
        { value: 'finishing', label: 'Surface Finishing' },
        { value: 'assembly', label: 'Assembly Services' },
        { value: 'full_service', label: 'Full Service Package' },
      ],
      required: true,
      description: 'Additional services required',
    },
  ],

  outputs: [
    {
      id: 'quoteDetails',
      label: 'Quote Details',
      type: 'object',
      format: 'quote-summary',
      description: 'Comprehensive quote breakdown and pricing',
    },
    {
      id: 'pricingBreakdown',
      label: 'Pricing Breakdown',
      type: 'object',
      format: 'pricing-details',
      description: 'Detailed cost breakdown by category',
    },
    {
      id: 'deliverySchedule',
      label: 'Delivery Schedule',
      type: 'object',
      format: 'delivery-timeline',
      description: 'Production and delivery timeline',
    },
    {
      id: 'termsAndConditions',
      label: 'Terms & Conditions',
      type: 'object',
      format: 'quote-terms',
      description: 'Quote terms, conditions, and validity',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      partComplexity,
      materialType,
      materialThickness,
      quantity,
      cuttingLength,
      urgency,
      customerType,
      additionalServices,
    } = inputs;

    // Calculate base pricing
    const pricingBreakdown = calculatePricing(
      partComplexity,
      materialType,
      materialThickness,
      quantity,
      cuttingLength,
      urgency,
      customerType,
      additionalServices
    );

    // Generate quote details
    const quoteDetails = generateQuoteDetails(
      pricingBreakdown,
      quantity,
      urgency,
      customerType
    );

    // Calculate delivery schedule
    const deliverySchedule = calculateDeliverySchedule(
      partComplexity,
      quantity,
      urgency,
      additionalServices
    );

    // Generate terms and conditions
    const termsAndConditions = generateTermsAndConditions(
      quoteDetails.totalPrice,
      urgency,
      customerType
    );

    return {
      quoteDetails,
      pricingBreakdown,
      deliverySchedule,
      termsAndConditions,
    };
  },

  validation: {
    quantity: {
      min: 1,
      max: 10000,
      message: 'Quantity must be between 1 and 10,000 parts',
    },
    materialThickness: {
      min: 0.5,
      max: 50,
      message: 'Material thickness must be between 0.5mm and 50mm',
    },
    cuttingLength: {
      min: 10,
      max: 10000,
      message: 'Cutting length must be between 10mm and 10,000mm',
    },
  },

  examples: [
    {
      name: 'Standard Production Run',
      description: 'Typical production quote for existing customer',
      inputs: {
        partComplexity: 'medium',
        materialType: 'carbon_steel',
        materialThickness: 6,
        quantity: 100,
        cuttingLength: 800,
        urgency: 'standard',
        customerType: 'existing',
        additionalServices: 'deburring',
      },
    },
    {
      name: 'Rush Prototype Order',
      description: 'Emergency prototype cutting for new customer',
      inputs: {
        partComplexity: 'complex',
        materialType: 'stainless_steel',
        materialThickness: 3,
        quantity: 5,
        cuttingLength: 1200,
        urgency: 'emergency',
        customerType: 'new',
        additionalServices: 'finishing',
      },
    },
  ],

  tags: ['quote', 'pricing', 'customer', 'professional', 'sales'],
  
  relatedCalculators: [
    'competitive-pricing',
    'cost-plus-pricing',
    'lead-qualification',
    'customer-lifetime-value',
  ],

  learningResources: [
    {
      title: 'Professional Quoting Best Practices',
      type: 'article',
      url: '/learn/professional-quoting',
    },
    {
      title: 'Winning More Quotes',
      type: 'video',
      url: '/learn/winning-quotes',
    },
  ],
};

// Helper functions
function calculatePricing(
  complexity: string,
  material: string,
  thickness: number,
  quantity: number,
  cuttingLength: number,
  urgency: string,
  customerType: string,
  additionalServices: string
) {
  // Base rates per material type (USD per meter)
  const materialRates = {
    carbon_steel: 8,
    stainless_steel: 12,
    aluminum: 10,
    copper: 15,
    brass: 14,
    titanium: 25,
    acrylic: 6,
  };

  // Complexity multipliers
  const complexityMultipliers = {
    simple: 0.8,
    medium: 1.0,
    complex: 1.4,
    very_complex: 1.8,
  };

  // Thickness adjustments
  const thicknessMultiplier = Math.max(0.5, Math.min(2.0, thickness / 5));

  // Calculate base cutting cost
  const baseRate = materialRates[material] || 8;
  const complexityMultiplier = complexityMultipliers[complexity] || 1.0;
  const totalCuttingMeters = (cuttingLength / 1000) * quantity;
  
  const cuttingCost = baseRate * complexityMultiplier * thicknessMultiplier * totalCuttingMeters;

  // Setup costs
  const setupCost = calculateSetupCost(complexity, quantity);

  // Material handling
  const materialHandling = quantity * 2; // $2 per part

  // Additional services
  const servicesCost = calculateServicesCost(additionalServices, quantity);

  // Urgency premium
  const urgencyMultiplier = getUrgencyMultiplier(urgency);
  const urgencyPremium = (cuttingCost + setupCost) * (urgencyMultiplier - 1);

  // Customer discount
  const customerDiscount = getCustomerDiscount(customerType, cuttingCost + setupCost + servicesCost);

  const subtotal = cuttingCost + setupCost + materialHandling + servicesCost + urgencyPremium - customerDiscount;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return {
    cuttingCost: Math.round(cuttingCost * 100) / 100,
    setupCost: Math.round(setupCost * 100) / 100,
    materialHandling: Math.round(materialHandling * 100) / 100,
    servicesCost: Math.round(servicesCost * 100) / 100,
    urgencyPremium: Math.round(urgencyPremium * 100) / 100,
    customerDiscount: Math.round(customerDiscount * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    pricePerPart: Math.round((total / quantity) * 100) / 100,
  };
}

function calculateSetupCost(complexity: string, quantity: number) {
  const baseSetup = {
    simple: 50,
    medium: 75,
    complex: 125,
    very_complex: 200,
  };

  const setup = baseSetup[complexity] || 75;
  
  // Volume discount on setup
  if (quantity > 100) return setup * 0.7;
  if (quantity > 50) return setup * 0.85;
  return setup;
}

function calculateServicesCost(services: string, quantity: number) {
  const serviceCosts = {
    none: 0,
    deburring: 3,
    finishing: 8,
    assembly: 15,
    full_service: 25,
  };

  const costPerPart = serviceCosts[services] || 0;
  return costPerPart * quantity;
}

function getUrgencyMultiplier(urgency: string) {
  const multipliers = {
    standard: 1.0,
    expedited: 1.25,
    rush: 1.5,
    emergency: 2.0,
  };
  return multipliers[urgency] || 1.0;
}

function getCustomerDiscount(customerType: string, baseAmount: number) {
  const discountRates = {
    new: 0,
    existing: 0.05,
    volume: 0.10,
    strategic: 0.15,
  };

  const rate = discountRates[customerType] || 0;
  return baseAmount * rate;
}

function generateQuoteDetails(pricing: any, quantity: number, urgency: string, customerType: string) {
  const quoteNumber = generateQuoteNumber();
  const validUntil = calculateValidityDate(urgency);

  return {
    quoteNumber,
    date: new Date().toLocaleDateString(),
    validUntil,
    quantity,
    totalPrice: pricing.total,
    pricePerPart: pricing.pricePerPart,
    paymentTerms: getPaymentTerms(customerType, pricing.total),
    warranty: getWarrantyTerms(),
    notes: generateQuoteNotes(urgency, customerType),
  };
}

function generateQuoteNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `Q${year}${month}${day}-${random}`;
}

function calculateValidityDate(urgency: string) {
  const validityDays = {
    standard: 30,
    expedited: 14,
    rush: 7,
    emergency: 3,
  };

  const days = validityDays[urgency] || 30;
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + days);
  
  return validUntil.toLocaleDateString();
}

function getPaymentTerms(customerType: string, totalAmount: number) {
  if (customerType === 'new' || totalAmount > 5000) {
    return '50% deposit, balance on delivery';
  }
  if (customerType === 'strategic' || customerType === 'volume') {
    return 'Net 30 days';
  }
  return 'Net 15 days';
}

function getWarrantyTerms() {
  return 'Parts guaranteed to meet specified tolerances. 30-day warranty against manufacturing defects.';
}

function generateQuoteNotes(urgency: string, customerType: string) {
  const notes = [];
  
  if (urgency === 'rush' || urgency === 'emergency') {
    notes.push('Rush order - production will begin immediately upon approval');
  }
  
  if (customerType === 'new') {
    notes.push('Welcome! We look forward to working with you');
  }
  
  notes.push('Quote includes material, cutting, and specified services');
  notes.push('Delivery FOB our facility unless otherwise specified');
  
  return notes;
}

function calculateDeliverySchedule(complexity: string, quantity: number, urgency: string, services: string) {
  // Base production times (hours)
  const baseTimes = {
    simple: 0.1,
    medium: 0.2,
    complex: 0.4,
    very_complex: 0.8,
  };

  const baseTime = baseTimes[complexity] || 0.2;
  const totalProductionHours = baseTime * quantity;

  // Service time additions
  const serviceTimes = {
    none: 0,
    deburring: 0.05,
    finishing: 0.15,
    assembly: 0.3,
    full_service: 0.5,
  };

  const serviceTime = (serviceTimes[services] || 0) * quantity;
  const totalTime = totalProductionHours + serviceTime;

  // Convert to business days
  const productionDays = Math.ceil(totalTime / 8); // 8 hours per day

  // Urgency adjustments
  const urgencyAdjustments = {
    standard: 1.0,
    expedited: 0.6,
    rush: 0.3,
    emergency: 0.1,
  };

  const adjustedDays = Math.max(1, Math.ceil(productionDays * urgencyAdjustments[urgency]));

  const startDate = new Date();
  const completionDate = new Date();
  completionDate.setDate(startDate.getDate() + adjustedDays);

  const deliveryDate = new Date(completionDate);
  deliveryDate.setDate(completionDate.getDate() + 1); // Add shipping day

  return {
    productionTime: `${Math.round(totalTime * 10) / 10} hours`,
    productionDays: adjustedDays,
    startDate: startDate.toLocaleDateString(),
    completionDate: completionDate.toLocaleDateString(),
    deliveryDate: deliveryDate.toLocaleDateString(),
    milestones: generateMilestones(adjustedDays, services),
  };
}

function generateMilestones(productionDays: number, services: string) {
  const milestones = [];
  
  milestones.push({
    milestone: 'Order Confirmation',
    day: 0,
    description: 'Order received and confirmed',
  });

  if (productionDays > 2) {
    milestones.push({
      milestone: 'Production Start',
      day: 1,
      description: 'Material prepared, cutting begins',
    });
  }

  if (productionDays > 3) {
    const midPoint = Math.floor(productionDays / 2);
    milestones.push({
      milestone: 'Production Update',
      day: midPoint,
      description: 'Progress update provided',
    });
  }

  if (services !== 'none') {
    milestones.push({
      milestone: 'Secondary Operations',
      day: productionDays - 1,
      description: 'Additional services completed',
    });
  }

  milestones.push({
    milestone: 'Quality Inspection',
    day: productionDays,
    description: 'Final inspection and packaging',
  });

  milestones.push({
    milestone: 'Ready for Delivery',
    day: productionDays + 1,
    description: 'Order ready for pickup/shipping',
  });

  return milestones;
}

function generateTermsAndConditions(totalPrice: number, urgency: string, customerType: string) {
  return {
    pricing: [
      'Prices are valid for the period specified in the quote',
      'Prices are subject to change based on material cost fluctuations',
      'Additional charges may apply for design changes after approval',
    ],
    payment: [
      'Payment terms as specified in quote details',
      'Late payments subject to 1.5% monthly service charge',
      'Orders may be held for overdue accounts',
    ],
    delivery: [
      'Delivery dates are estimates based on current workload',
      'Customer will be notified of any delays immediately',
      'Risk of loss passes to customer upon delivery',
    ],
    quality: [
      'Parts will meet specified tolerances and requirements',
      'Customer inspection recommended within 5 days of delivery',
      'Claims must be reported within 30 days',
    ],
    liability: [
      'Liability limited to replacement or refund of defective parts',
      'Customer responsible for design suitability',
      'Force majeure events may affect delivery schedules',
    ],
    acceptance: [
      'Quote acceptance constitutes agreement to these terms',
      'Changes to terms must be agreed in writing',
      'Applicable state and local laws govern this agreement',
    ],
  };
}

export default quoteGeneratorConfig;
