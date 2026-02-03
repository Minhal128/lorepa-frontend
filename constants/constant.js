export const guestFAQs = [
  {
    question: "What do I need to rent a trailer on Lorepa?",
    answer:
      "To rent a trailer, you must be at least 21 years old, hold a valid driver’s license, and provide proof of insurance (FAQ27). You will also need a verified Lorepa account.",
  },
  {
    question: "How does the rental process work?",
    answer:
      "You browse available trailers, send a request to the owner, and once approved, confirm your booking. A rental contract and inspection photos are generated automatically.",
  },
  {
    question: "Is insurance included in my rental?",
    answer:
      "No. You are required to provide valid auto insurance that covers towing. Additional optional protection may be offered during checkout.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel under the terms described in our cancellation policy. Refunds may vary depending on when the cancellation is made relative to the start date.",
  },
  {
    question: "What happens if I return the trailer late?",
    answer:
      "Late returns may incur a flat penalty fee, as outlined in the Terms of Use. Always notify the owner in case of delay to avoid disputes.",
  },
  {
    question: "What if the trailer is damaged during my trip?",
    answer:
      "You are responsible for any damage during the rental period. Damage costs may be deducted from your deposit or charged directly, depending on the severity and proof.",
  },
  {
    question: "How are payments and deposits handled?",
    answer:
      "Payments are processed securely through Stripe. A security deposit is held during the rental period and released within 7 days if no issues are reported.",
  },
  {
    question: "Where can I tow the trailer?",
    answer:
      "Most trailers can be towed within Canada. If cross-border travel (e.g., to the USA) is planned, check with the owner first and mention it in your request.",
  },
  {
    question: "Do I need a special towing license?",
    answer:
      "In most Canadian provinces, a standard Class 5 license is enough for small trailers. However, it's your responsibility to ensure you meet local requirements and that your vehicle is rated to tow the selected trailer.",
  },
  {
    question: "What kind of trailers are available?",
    answer:
      "Lorepa offers utility trailers, enclosed cargo trailers, car haulers, motorcycle trailers, and more. You can filter by category, size, or location.",
  },
  {
    question: "Can I rent a trailer for a one-way trip?",
    answer:
      "Most rentals are round-trip. If you need one-way rental, contact the owner directly or check listings with flexible return options.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No hidden fees. All charges are shown upfront. Some extras (e.g., cleaning, extra days, mileage overage) may be added if not respected.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach our support team via the chat feature on the app or website, or by email at support@lorepa.ca. Response time is typically under 24h.",
  },
];

export const hostFAQs = [
  {
    question: "How do I list my trailer?",
    answer:
      "You can list your trailer by signing up, filling in key details (description, availability, pricing), uploading photos, and providing required documents (registration, insurance).",
  },
  {
    question: "How much can I earn with Lorepa?",
    answer:
      "You keep 85% of the rental price. The remaining 15% covers Lorepa’s service fee. Payouts are processed automatically via Stripe within 3–5 business days after the rental ends.",
  },
  {
    question: "Can I cancel a reservation?",
    answer:
      "Yes, but owners are allowed only 2 free cancellations every 6 months. After that, a $100 CAD penalty applies if the cancellation is within policy. Abuse of cancellations is subject to account review.",
  },
  {
    question: "What if my trailer is returned late or damaged?",
    answer:
      "You can report any issue via the platform within 24 hours. Lorepa can assist with deducting penalties or damage costs from the renter’s deposit.",
  },
  {
    question: "Do I need special insurance as an owner?",
    answer:
      "You must maintain valid trailer insurance. Lorepa does not provide direct coverage to owners. However, optional protection programs may be introduced in future.",
  },
  {
    question: "Can I choose who rents my trailer?",
    answer:
      "Yes. You can review the renter’s profile, documents, and ratings before a request. You are under no obligation to accept every booking.",
  },
  {
    question: "How are taxes handled?",
    answer:
      "You are responsible for reporting your earnings and managing your taxes. Lorepa may provide annual income summaries, but does not remit taxes on your behalf.",
  },
  {
    question: "Can I rent out multiple trailers?",
    answer:
      "Absolutely. Lorepa supports multiple listings per user. You can manage your fleet under one account and adjust availability per unit.",
  },
  {
    question: "Can I require a cleaning fee or extra conditions?",
    answer:
      "Yes. You may set your own rules (cleaning fees, towing restrictions, penalties for misuse), but they must be clearly disclosed in your listing.",
  },
  {
    question: "How can I improve my trailer visibility?",
    answer:
      "Use high-quality photos, detailed descriptions, fair pricing, and maintain a good response rate. Verified owners with good ratings appear higher in search results.",
  },
  {
    question: "How do I handle fuel or equipment returns?",
    answer:
      "You can specify in your listing whether fuel/equipment must be returned in the same condition. Always document the condition at pickup and return.",
  },
  {
    question: "Can I report a bad renter?",
    answer:
      "Yes. After the rental ends, you can leave a review and report any serious incident to Lorepa’s trust & safety team. Repeated abuse may result in renter bans.",
  },
];

export const globalFAQs = [
  {
    question: "Who is responsible in case of accident or theft?",
    answer:
      "Renters are liable for any damages or loss during the rental. In serious cases, police reports, insurance claims, and platform mediation may apply.",
  },
  {
    question: "Does Lorepa offer insurance coverage?",
    answer:
      "Currently, Lorepa does not directly offer insurance but may require proof of third-party coverage (FAQ27). Dedicated insurance options may be added soon.",
  },
  {
    question: "Is Lorepa available in the USA?",
    answer:
      "Lorepa is currently focused on Canada. Cross-border use is only allowed with owner consent and proper documentation.",
  },
];

export const dummyTrailers = [
  {
    id: "1",
    title: "2017 Diamond C Utility 77\" x14'",
    owner: "John Doe",
    contact: "000-0000-0001",
    price: "140",
    imageUrl:
      "https://www.pollisum.com/wp-content/uploads/2022/08/Types-of-trailers.jpg",
    basicInfo: {
      make: "Diamond C",
      nameOfOwner: "Lorena Troop Rental",
      category: "Utility Trailer",
      detailedDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique nisl in lectus tempor vestibulum ut labore et dolore magna aliqua.",
    },
    pricingRentalTerms: {
      daily: "140 CAD",
      weekly: "800 CAD",
      monthly: "2500 CAD",
      totalAmount: "140 CAD",
      serviceFee: "15 CAD",
      taxAndDuties: "20 CAD",
      securityDeposit: "200 CAD",
      minimumRentalDays: "1 Day",
      maximumRentalDays: "30 Days",
    },
    trailerDetails: {
      hitchType: 'Ball 2"',
      axles: "2",
      weightCapacity: "5000 lbs",
      lightConnection: "7 Pin",
      trailerDimension: "14ft x 6.5ft",
      brakes: "Yes",
      vin: "ABCDEF1234567890",
    },
    finalDetails: {
      pickupReturn: "Flexible",
    },
  },
  {
    id: "2",
    title: "2019 Enclosed Cargo Trailer 6x12",
    owner: "Jane Smith",
    contact: "000-0000-0002",
    price: "120",
    imageUrl:
      "https://www.pollisum.com/wp-content/uploads/2022/08/Types-of-trailers.jpg",
    basicInfo: {
      make: "Stealth",
      nameOfOwner: "Jane's Haulers",
      category: "Enclosed Trailer",
      detailedDescription:
        "Spacious and secure enclosed cargo trailer, perfect for moving furniture or equipment.",
    },
    pricingRentalTerms: {
      daily: "120 CAD",
      weekly: "700 CAD",
      monthly: "2200 CAD",
      totalAmount: "120 CAD",
      serviceFee: "10 CAD",
      taxAndDuties: "15 CAD",
      securityDeposit: "800 CAD",
      minimumRentalDays: "1 Day",
      maximumRentalDays: "20 Days",
    },
    trailerDetails: {
      hitchType: 'Ball 2 5/16"',
      axles: "2",
      weightCapacity: "6000 lbs",
      lightConnection: "7 Pin",
      trailerDimension: "12ft x 6ft",
      brakes: "Yes",
      vin: "XYZABC1234567890",
    },
    finalDetails: {
      pickupReturn: "Strict",
    },
  },
  {
    id: "3",
    title: "2020 Flatbed Trailer 18ft",
    owner: "Robert Johnson",
    contact: "000-0000-0003",
    price: "160",
    imageUrl:
      "https://www.pollisum.com/wp-content/uploads/2022/08/Types-of-trailers.jpg",
    basicInfo: {
      make: "Load Trail",
      nameOfOwner: "Robert's Rentals",
      category: "Flatbed Trailer",
      detailedDescription:
        "Heavy-duty flatbed trailer suitable for hauling vehicles or large equipment.",
    },
    pricingRentalTerms: {
      daily: "160 CAD",
      weekly: "950 CAD",
      monthly: "3500 CAD",
      totalAmount: "160 CAD",
      serviceFee: "20 CAD",
      taxAndDuties: "25 CAD",
      securityDeposit: "1200 CAD",
      minimumRentalDays: "1 Day",
      maximumRentalDays: "45 Days",
    },
    trailerDetails: {
      hitchType: "Gooseneck",
      axles: "2",
      weightCapacity: "10000 lbs",
      lightConnection: "7 Pin",
      trailerDimension: "18ft x 8ft",
      brakes: "Yes",
      vin: "UVWXYZ1234567890",
    },
    finalDetails: {
      pickupReturn: "Negotiable",
    },
  },
  {
    id: "4",
    title: "2017 Diamond C Utility 77\" x14'", // Duplicate for layout
    owner: "John Doe",
    contact: "000-0000-0001",
    price: "140",
    imageUrl:
      "https://www.pollisum.com/wp-content/uploads/2022/08/Types-of-trailers.jpg",
    basicInfo: {
      make: "Diamond C",
      nameOfOwner: "Lorena Troop Rental",
      category: "Utility Trailer",
      detailedDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique nisl in lectus tempor vestibulum ut labore et dolore magna aliqua.",
    },
    pricingRentalTerms: {
      daily: "140 CAD",
      weekly: "800 CAD",
      monthly: "2500 CAD",
      totalAmount: "140 CAD",
      serviceFee: "15 CAD",
      taxAndDuties: "20 CAD",
      securityDeposit: "200 CAD",
      minimumRentalDays: "1 Day",
      maximumRentalDays: "30 Days",
    },
    trailerDetails: {
      hitchType: 'Ball 2"',
      axles: "2",
      weightCapacity: "5000 lbs",
      lightConnection: "7 Pin",
      trailerDimension: "14ft x 6.5ft",
      brakes: "Yes",
      vin: "ABCDEF1234567891",
    },
    finalDetails: {
      pickupReturn: "Flexible",
    },
  },
  {
    id: "5",
    title: "2017 Diamond C Utility 77\" x14'", // Duplicate for layout
    owner: "John Doe",
    contact: "000-0000-0001",
    price: "140",
    imageUrl:
      "https://www.pollisum.com/wp-content/uploads/2022/08/Types-of-trailers.jpg",
    basicInfo: {
      make: "Diamond C",
      nameOfOwner: "Lorena Troop Rental",
      category: "Utility Trailer",
      detailedDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique nisl in lectus tempor vestibulum ut labore et dolore magna aliqua.",
    },
    pricingRentalTerms: {
      daily: "140 CAD",
      weekly: "800 CAD",
      monthly: "2500 CAD",
      totalAmount: "140 CAD",
      serviceFee: "15 CAD",
      taxAndDuties: "20 CAD",
      securityDeposit: "200 CAD",
      minimumRentalDays: "1 Day",
      maximumRentalDays: "30 Days",
    },
    trailerDetails: {
      hitchType: 'Ball 2"',
      axles: "2",
      weightCapacity: "5000 lbs",
      lightConnection: "7 Pin",
      trailerDimension: "14ft x 6.5ft",
      brakes: "Yes",
      vin: "ABCDEF1234567892",
    },
    finalDetails: {
      pickupReturn: "Flexible",
    },
  },
  {
    id: "6",
    title: "2017 Diamond C Utility 77\" x14'", // Duplicate for layout
    owner: "John Doe",
    contact: "000-0000-0001",
    price: "140",
    imageUrl:
      "https://www.pollisum.com/wp-content/uploads/2022/08/Types-of-trailers.jpg",
    basicInfo: {
      make: "Diamond C",
      nameOfOwner: "Lorena Troop Rental",
      category: "Utility Trailer",
      detailedDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique nisl in lectus tempor vestibulum ut labore et dolore magna aliqua.",
    },
    pricingRentalTerms: {
      daily: "140 CAD",
      weekly: "800 CAD",
      monthly: "2500 CAD",
      totalAmount: "140 CAD",
      serviceFee: "15 CAD",
      taxAndDuties: "20 CAD",
      securityDeposit: "200 CAD",
      minimumRentalDays: "1 Day",
      maximumRentalDays: "30 Days",
    },
    trailerDetails: {
      hitchType: 'Ball 2"',
      axles: "2",
      weightCapacity: "5000 lbs",
      lightConnection: "7 Pin",
      trailerDimension: "14ft x 6.5ft",
      brakes: "Yes",
      vin: "ABCDEF1234567893",
    },
    finalDetails: {
      pickupReturn: "Flexible",
    },
  },
];

export const STATUS_STYLES = {
  pending: 'text-yellow-700 bg-yellow-100',
  accepted: 'text-blue-700 bg-blue-100',
  completed: 'text-gray-700 bg-gray-200',
  cancelled: 'text-red-700 bg-red-100',
};


export const StatusBadge = ({ status }) => (
  <span className={`text-xs font-medium px-2 py-1 rounded-md w-fit ${STATUS_STYLES[status] || 'text-gray-700 bg-gray-100'}`}>
    {status}
  </span>
);