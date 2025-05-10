import { formatToReadableString } from "@deckai/client/utils";
import { Avatar, cn, Text } from "@deckai/deck-ui";
import React from "react";


export type OrderSummaryProps = {
  header: string;
  title?: string;
  description?: string;
  className?: string;
  formData?: Record<string, any>;
  footer?: Record<string, any>;
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  header = "Summary",
  title,
  description,
  formData,
  className,
  footer,
}) => {
  return (
    <div
      className={cn("flex flex-col rounded-xl bg-background-50 p-6", className)}
    >
      <div className="flex justify-between items-center relative">
        <Text variant="body-lg-semibold">{header}</Text>
        <hr className="border-t border-secondary w-full absolute -bottom-3" />
      </div>

      <div className="py-6 mt-3 gap-4 flex flex-col">
        <div className="space-y-2">
          <Text variant="body-default-medium" color="secondary">
            {title}
          </Text>
          <Text variant="body-xs" color="secondary">
            {description}
          </Text>
        </div>
        {formData && (
            <div className="flex flex-col gap-2">
              {Object.entries(formData).map(([key, value]) => value && (
                <div key={key} className="">
                  <Text variant="body-default-semibold" color="secondary" className="w-full">
                    {formatToReadableString(key)}
                  </Text>
                  {/* Value on the next line, aligned to the right */}
                  <Text
                    variant="body-default"
                    color="primary"
                    className="text-right w-full"
                  >
                    {value}
                  </Text>
                </div>
              ))}
          </div>
        )}
      </div>
      <hr className="border-t border-secondary w-full" />
      {footer && (
        <>
          {Object.entries(footer).map(([key, value]) => value && (
            <div key={key} className="flex justify-between items-center mt-6">
              <Text variant="body-default-semibold" color="secondary">
                {formatToReadableString(key)}
              </Text>
              
              <Text variant="body-default-semibold" color="primary">
                {value}
              </Text>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default OrderSummary;
