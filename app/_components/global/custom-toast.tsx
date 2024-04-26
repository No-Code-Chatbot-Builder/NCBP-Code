import React from "react";

type Props = {
  title: string;
  description: string;
};

const CustomToast = ({ title, description }: Props) => {
  return (
    <div className="grid gap-2">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default CustomToast;
