import Heading from "@/components/Heading";
import SubscriptionButton from "@/components/Subscription-Button";
import { checkSubscription } from "@/lib/subscription";
import { GearIcon } from "@radix-ui/react-icons";
import React from "react";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div>
      <Heading
        title="Setting"
        description="Manage account settings."
        Icon={GearIcon}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently subscribed to the Pro plan."
            : "You are currently subscribed to the Free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingsPage;
