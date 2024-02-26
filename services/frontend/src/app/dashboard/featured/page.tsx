import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { assistants } from "@/lib/constants";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <section className="flex flex-row justify-between mt-20 items-center">
          <div className="flex flex-col gap-4 w-5/6">
            <h1 className="text-secondary text-3xl font-bold">Featured</h1>
            <p className="text-md text-muted-foreground">
              Featured and popular assistants personalized for you according to
              your personal desciptions. Try out now.
            </p>
          </div>
        </section>
        <Separator className="mt-8" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-4">
        {assistants.map((assistant) => (
          <Card key={assistant.id}>
            <CardHeader>
              <CardTitle>{assistant.title}</CardTitle>
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
    </div>
  );
}
