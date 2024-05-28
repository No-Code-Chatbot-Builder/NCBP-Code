import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";

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
    <div className="flex justify-start gap-4">
      <Switch onClick={() => switchTheme()} />
      <div className="text-muted-foreground">
        {theme == "light" ? "Light" : "Dark"} Mode
      </div>
    </div>
  );
}
