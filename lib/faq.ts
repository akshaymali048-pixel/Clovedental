export type FAQCategory = "General" | "Costs" | "Procedures" | "Emergency";

export type FAQItem = {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
};

export const faqs: FAQItem[] = [
  {
    id: "hours",
    category: "General",
    question: "What are your clinic hours?",
    answer:
      "We are open Tuesday through Sunday, 10:30 AM to 7:30 PM. We are closed on Mondays. For holiday hours or last-minute changes, call us before you visit — we will always confirm your appointment time when you book.",
  },
  {
    id: "location",
    category: "General",
    question: "Where is the clinic located?",
    answer:
      "Clove Dental is in Pimpri, Pune, near Big Bazaar on Mumbai Pune Road (Laxmi Complex). Full address and directions are on our Contact page. Parking is available nearby, and we are easy to reach by auto or bus from Pimpri station.",
  },
  {
    id: "new-patients",
    category: "General",
    question: "Do you accept new patients?",
    answer:
      "Yes — we welcome new patients of all ages. Your first consultation is free, with no obligation to proceed. Bring any previous dental records or X-rays if you have them; if not, we will assess everything fresh during your visit.",
  },
  {
    id: "parking",
    category: "General",
    question: "Is parking available?",
    answer:
      "Street and paid parking options are available around Laxmi Complex and Big Bazaar. Most patients find a spot within a short walk. If you are unsure, call us and we can guide you to the nearest convenient parking when you arrive.",
  },
  {
    id: "consultation-fee",
    category: "Costs",
    question: "How much does a consultation cost?",
    answer:
      "Your first consultation at Clove Dental Pimpri is completely free. For follow-up visits or specialist assessments, we will tell you the fee upfront before any examination beyond the initial consult. There are no surprise charges.",
  },
  {
    id: "insurance",
    category: "Costs",
    question: "Do you accept insurance?",
    answer:
      "We accept most major dental insurance plans and can help you understand what your policy covers before treatment begins. Bring your insurance card to your visit. If you are paying out of pocket, we will provide a clear written estimate first.",
  },
  {
    id: "payment-plans",
    category: "Costs",
    question: "Do you offer payment plans?",
    answer:
      "Yes — flexible payment plans are available for larger treatments such as implants, braces, and smile makeovers. We accept cash, UPI, and debit/credit cards. Ask at the front desk during your consultation and we will find an option that works for you.",
  },
  {
    id: "price-ranges",
    category: "Costs",
    question: "How much do treatments typically cost?",
    answer:
      "A routine check-up and clean starts from ₹500. More complex treatments are priced after a consultation so we can assess your specific situation. We will always tell you the cost before we begin any treatment — no hidden fees.",
  },
  {
    id: "pain",
    category: "Procedures",
    question: "Will my treatment be painful?",
    answer:
      "Most procedures are performed under local anaesthesia, so discomfort during treatment is minimal. For anxious patients, we take extra time to explain each step and ensure you are comfortable. Root canals and fillings typically feel no worse than a standard filling.",
  },
  {
    id: "appointment-length",
    category: "Procedures",
    question: "How long do appointments usually take?",
    answer:
      "A routine check-up takes 30–45 minutes. Simple procedures like a filling may take 45–60 minutes. Complex treatments like root canals or implant consultations can take 60–90 minutes. We will give you a realistic time estimate when you book.",
  },
  {
    id: "what-to-bring",
    category: "Procedures",
    question: "What should I bring to my appointment?",
    answer:
      "Bring a valid ID, your insurance details if applicable, and any previous dental records or X-rays. Arrive 10 minutes early to complete a brief medical history form. If you take regular medications, note them down or bring your prescription list.",
  },
  {
    id: "kids-first-visit",
    category: "Procedures",
    question: "What happens at a child's first dental visit?",
    answer:
      "We keep the first visit calm and positive — usually a gentle examination, a chat about brushing habits, and a ride in the chair. No forced treatments. Parents stay in the room. Most children leave feeling proud and looking forward to their next visit.",
  },
  {
    id: "broken-tooth",
    category: "Emergency",
    question: "I have a broken tooth — what should I do?",
    answer:
      "Call us immediately. Rinse your mouth with warm water, save any broken pieces in milk or saliva, and avoid chewing on that side. We keep emergency slots available most mornings and will do our best to see you the same day.",
  },
  {
    id: "toothache-night",
    category: "Emergency",
    question: "I have a toothache at night — can you help?",
    answer:
      "Call our clinic number — if it is after hours, follow the voicemail instructions for emergency guidance. Rinse with warm salt water, take over-the-counter pain relief as directed, and avoid very hot or cold foods. We will prioritise your appointment the next available morning.",
  },
  {
    id: "knocked-out-tooth",
    category: "Emergency",
    question: "A tooth has been knocked out — what do I do?",
    answer:
      "Time matters. Handle the tooth by the crown only, rinse gently without scrubbing, and try to place it back in the socket or store it in milk. Call us immediately — re-implantation within 30–60 minutes gives the best chance of saving the tooth.",
  },
  {
    id: "emergency-speed",
    category: "Emergency",
    question: "How quickly can you see me in an emergency?",
    answer:
      "We aim to see genuine dental emergencies the same day, often within a few hours. Call us directly rather than using the online form for urgent cases. Describe your symptoms clearly and we will tell you exactly when to come in.",
  },
];

export const faqCategories: Array<FAQCategory | "All"> = [
  "All",
  "General",
  "Costs",
  "Procedures",
  "Emergency",
];

export const homepageFaqs = faqs.slice(0, 5);
