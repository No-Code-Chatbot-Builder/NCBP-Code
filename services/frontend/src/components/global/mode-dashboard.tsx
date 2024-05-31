import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export function ModeDashboardToggle() {
  const { theme, setTheme } = useTheme();

  const switchTheme = () => {
    if (theme == "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <Button
      onClick={() => switchTheme()}
      className="w-full bg-card text-muted-foreground dark:text-white hover:text-white group"
    >
      <div className="flex justify-start w-full items-center gap-2">
        {theme == "light" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
        <p className="text-center text-muted-foreground dark:text-white group-hover:text-white">
          Toggle Theme
        </p>
      </div>
    </Button>
  );
}
