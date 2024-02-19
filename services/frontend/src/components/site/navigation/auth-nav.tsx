"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

const AuthNavigation = ({ className }: Props) => {
  return (
    <div className={clsx("pt-6 pl-10 ", className)}>
      <div className="flex items-center justify-between top-0">
        <aside className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image
                src={"./assets/ncbai.svg"}
                width={40}
                height={40}
                alt="NoCodeBot.ai logo"
              />
              <span className="text-xl font-extrabold">NoCodeBot.ai</span>
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default AuthNavigation;
