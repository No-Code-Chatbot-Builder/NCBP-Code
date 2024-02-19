import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Key } from "lucide-react";

export default function Page() {
  const apiKeys = [
    {
      name: "ncbp",
      secretKey: "sk-...Nudb",
      created: "19 Feb 2024",
      lastUsed: "Today",
    },
    {
      name: "key2",
      secretKey: "sk-...abcd",
      created: "18 Feb 2024",
      lastUsed: "Never",
    },
    {
      name: "key3",
      secretKey: "sk-...efgh",
      created: "17 Feb 2024",
      lastUsed: "Yesterday",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <section className="mt-20 flex flex-col gap-4">
        <h1 className="text-secondary text-3xl font-bold">API KEYS</h1>
        <p className="text-md">
          Your secret API keys are listed below. Please note that we do not
          display your secret API keys again after you generate them. <br />
          <br />
          Do not share your API key with others, or expose it in the browser or
          other client-side code. In order to protect the security of your
          account, NoCodeBot.ai may also automatically disable any API key that
          we have found has leaked publicly. <br />
          <br />
          Enable tracking to see usage per API key on the{" "}
          <span className="text-secondary underline">Usage page.</span>
        </p>
      </section>
      <section>
        <div className="flex flex-row-reverse mb-8">
          <Button className="flex gap-2">
            <Key className="w-5 h-5" />
            <p>Create New Key</p>
          </Button>
        </div>
        <Table>
          <TableCaption>Your API Keys</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] font-semibold">NAME</TableHead>
              <TableHead className="font-semibold">SECRET KEY</TableHead>
              <TableHead className="font-semibold">CREATED</TableHead>
              <TableHead className="text-right font-semibold">
                LAST USED
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell>{key.secretKey}</TableCell>
                <TableCell>{key.created}</TableCell>
                <TableCell className="text-right">{key.lastUsed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
