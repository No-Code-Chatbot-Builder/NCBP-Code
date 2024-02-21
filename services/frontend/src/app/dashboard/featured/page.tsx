import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { assistants } from "@/lib/constants";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <section className="mt-20 flex flex-col gap-4">
        <h1 className="text-secondary text-3xl font-bold">Featured</h1>
        <p className="text-md text-muted-foreground">
          Featured and popular assistants personalized for you according to your
          personal desciptions. Try out now.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-4">
        {assistants.map((assistant) => (
          <Card key={assistant.id}>
            <CardHeader>
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
      <section>
        <h1 className="text-secondary text-3xl font-bold">Explore More</h1>
        <div className="mb-20" />
      </section>
    </div>
  );
}
