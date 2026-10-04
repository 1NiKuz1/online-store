"use client";

import { Tabs, TabsList, TabsTrigger } from "@presentation/shared/shadcn/ui/tabs";

import type { IdentityType } from "@presentation/shared/api";

type IdentityTabsProps = {
  value: IdentityType;
  onChange: (value: IdentityType) => void;
  disabled: boolean;
};

export function IdentityTabs({ value, onChange, disabled }: IdentityTabsProps): React.ReactNode {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="w-full">
        <TabsTrigger value="email" disabled={disabled}>
          Email
        </TabsTrigger>
        <TabsTrigger value="phone" disabled={disabled}>
          Phone
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
