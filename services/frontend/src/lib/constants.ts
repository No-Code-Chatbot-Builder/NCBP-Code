import {
  BookPlus,
  Code,
  Database,
  Key,
  Settings,
  Star,
  Zap,
} from "lucide-react";

export type StepCard = {
  title: string;
  description: String;
  header: React.ReactNode;
  className: string;
  icon: React.ReactNode;
  key: string;
};

export const icons = [
  {
    value: "featured",
    label: "Featured",
    path: Star,
  },
  {
    value: "mygpts",
    label: "My GPTs",
    path: Zap,
  },
  {
    value: "assistants",
    label: "Assistants",
    path: Code,
  },
  {
    value: "datasets",
    label: "Datasets",
    path: Database,
  },
  {
    value: "apikeys",
    label: "API Keys",
    path: Key,
  },
  {
    value: "discover",
    label: "Discover",
    path: BookPlus,
  },
  {
    value: "settings",
    label: "Settings",
    path: Settings,
  },
];

export const frontPageCards = [
  {
    title: "Your Personal Study Assistant",
    description:
      "Try NoCodeBot.ai’s personalised study assistant, simplifies your learning journey. It customises study sessions and offers instant help with homework, making education engaging and tailored to you. Embrace a smarter way to achieve your study goals with NoCodeBot.ai.",
  },
  {
    title: "Revolutionise Your Workflow with AI",
    description:
      "NoCodeBot AI transforms your office tasks with AI simplicity. It automates repetitive work, manages projects, and analyzes data effortlessly. Boost your productivity and streamline your workflow with NoCodeBot AI, where efficiency meets innovation.",
  },
];

export const pricingCards = [
  {
    title: "Starter",
    description: "Ideal for newcomers to AI",
    price: "Free",
    duration: "",
    highlight: "Essentials included",
    features: [
      "1 Workspace",
      "Basic AI Chatbot Builder",
      "Access to Community Models",
    ],
    priceId: "",
  },
  {
    title: "Professional",
    description: "For teams deploying AI solutions",
    price: "$99",
    duration: "month",
    highlight: "Everything in Starter, plus",
    features: [
      "Unlimited Workspaces",
      "Advanced AI Chatbot Customization",
      "Priority Support",
      "Early Access to New Features",
    ],
    priceId: "price_1OYxkqFj9oKEERu1LmNvYzHJ",
  },
  {
    title: "Enterprise",
    description: "Comprehensive AI capabilities for large organizations",
    price: "Custom",
    duration: "month",
    highlight: "All Professional features, plus",
    features: [
      "Custom AI Chatbot Development",
      "Dedicated GPT Model Training",
      "Enterprise-grade Security",
      "Personalized Onboarding & Support",
    ],
    priceId: "custom",
  },
];

export const assistants = [
  {
    id: 1,
    title: "Study Buddy",
    description:
      "Try NoCodeBot.ai’s personalised study assistant, simplifies your learning journey. It customises study sessions.",
    imgSrc: "/assets/study.png",
  },
  {
    id: 2,
    title: "Research Helper",
    description:
      "Enhance your research with our dedicated assistant, designed to streamline and support your projects.",
    imgSrc: "/assets/study.png",
  },
  {
    id: 3,
    title: "Exam Prep",
    description:
      "Get ready for exams with tailored revision strategies and support, making sure you're fully prepared.",
    imgSrc: "/assets/study.png",
  },
];

export const sidebarOpt: SidebarOption[] = [
  {
    heading: "",
    items: [
      { name: "Featured", icon: "featured", link: "/dashboard/featured" },

      { name: "Assistants", icon: "assistants", link: "/dashboard/assistants" },
      { name: "Datasets", icon: "datasets", link: "/dashboard/datasets" },
      { name: "API Keys", icon: "apikeys", link: "/dashboard/apikeys" },
      { name: "Settings", icon: "settings", link: "/dashboard/settings" },
    ],
  },
  {
    heading: "",
    items: [],
  },
];

export type AssistantType = {
  id: string;
  name: string;
  description: string;
  owner: string;
};

export const dummyAssistant: AssistantType[] = [
  {
    id: "1",
    name: "NextJS Assistant",
    description:
      "Expert on Next.js and returns answers with high accuracy. Learn next.js from my Assistant",
    owner: "ibrahimtariqsheikh",
  },
  {
    id: "2",
    name: "Math Assistant",
    description:
      "Trained specifically on Mathematics books for more reliable answers so you can study in peace.",
    owner: "ibrahimtariqsheikh",
  },
  {
    id: "3",
    name: "IBA Entry Assistant",
    description:
      "Prepare for IBA Entry tests, ask for similar questions and get in with ease.",
    owner: "hussainmurtaza",
  },
];

export type DatasetType = {
  id: string;
  name: string;
  description: string;
};

export const dummyDataset: DatasetType[] = [
  {
    id: "1",
    name: "Ibrahim's Dataset",
    description: "Contains Ibrahim's Essential Data",
  },
  {
    id: "2",
    name: "Hussain's Dataset",
    description: "Contains Hussain's Essential Data",
  },
];
