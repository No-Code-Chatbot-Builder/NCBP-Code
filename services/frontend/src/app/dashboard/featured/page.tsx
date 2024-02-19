import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Command, CommandInput } from "@/components/ui/command";
import { assistants } from "@/lib/constants";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <div className="mt-20" />
      <div className="flex items-center justify-center mb-5 gap-4">
        <Command>
          <CommandInput placeholder="Search for your agents" />
        </Command>
        <Button size={"lg"}>Search</Button>
      </div>

      <h1 className="font-semibold text-3xl text-secondary mb-5">
        Featured Assistants
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-4">
        {assistants.map((assistant) => (
          <Card key={assistant.id}>
            <CardHeader>
              <span className="text-primary">#{assistant.id}</span>
              <CardTitle className="text-secondary">
                {assistant.title}
              </CardTitle>
              <CardDescription>
                <div className="flex gap-4">
                  <div>{assistant.description}</div>
                  <Image
                    alt="study"
                    src={assistant.imgSrc}
                    width={200}
                    height={200}
                    className="rounded-full object-contain"
                  />
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Try Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <h1 className="font-semibold text-3xl text-secondary mb-5 mt-10">
        Explore More
      </h1>
      <div className="flex items-center justify-center"></div>
    </>
  );
}
