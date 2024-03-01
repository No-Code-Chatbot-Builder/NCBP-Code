import SignInForm from "@/components/forms/signin-form/index";
import AuthNavigation from "@/components/site/navigation/auth-nav";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

export default function Page() {
  const words = [
    {
      text: "Make",
    },
    {
      text: "Custom",
    },
    {
      text: "AI",
    },
    {
      text: "Chatbots.",
    },
    {
      text: "With",
    },
    {
      text: "NoCodeBot.ai.",
    },
    {
      text: "Try",
    },
    {
      text: "Now",
    },
    {
      text: "For",
    },
    {
      text: "Free.",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
      <div className="lg:col-span-7 bg-accent hidden lg:flex flex-col">
        <AuthNavigation />
        <div className="flex items-center justify-center flex-grow px-20 lg:px-40 xl:px-72">
          <TypewriterEffect words={words} />
        </div>
      </div>
      <div className="col-span-1 lg:col-span-5">
        <AuthNavigation className="lg:hidden" />
        <SignInForm />
      </div>
    </div>
  );
}
