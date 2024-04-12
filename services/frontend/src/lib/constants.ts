import {
  BookPlus,
  Code,
  Database,
  Key,
  Settings,
  Star,
  Zap,
  CookingPot,
  Bell,
  ShoppingBag
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
  },{
    value: "finetune",
    label: "Fine Tune",
    path: CookingPot,
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
  {
    value: "notifications",
    label: "Notifications",
    path: Bell,
  },
  {
    value: "tools",
    label: "Tools",
    path: ShoppingBag ,
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

export type FeaturedAssistant = {
  id: number;
  title: string;
  description: string;
  imgSrc: string;
};

export const sidebarOpt: SidebarOption[] = [
  {
    heading: "",
    items: [
      { name: "Featured", icon: "featured", link: "/dashboard/featured" },
      { name: "Assistants", icon: "assistants", link: "/dashboard/assistants" },
      { name: "Datasets", icon: "datasets", link: "/dashboard/datasets" },
      { name: "Fine Tuning", icon: "finetune", link: "/dashboard/finetune" },
      { name: "API Keys", icon: "apikeys", link: "/dashboard/apikeys" },
      { name: "Notifications", icon: "notifications", link: "/dashboard/notifications" },
      { name: "Tools", icon: "tools", link: "/dashboard/tools" },
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
  threadId : string;
};

export type DataBucketType = {
  id: string;
  name: string;
  path: string;
  createdBy: string;
  createdAt: string;
};

export type DatasetType = {
  id: string;
  name: string;
  description: string;
  data: DataBucketType[];
  createdBy: string | undefined;
  createdAt: string;
};

export type chatThreads = {
  id: string;
  name: string;
};

export const dummyChatThreads: chatThreads[] = [
  {
    id: "1",
    name: "Chat number 1: Welcome",
  },
  {
    id: "2",
    name: "Semantic Analysis with python",
  },
];
