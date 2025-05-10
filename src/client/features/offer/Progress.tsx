import { cn, Icon, Text } from "@deckai/deck-ui";
import React from "react";
import { IconName } from '@deckai/icons';
import { on } from "node:events";

export type ProgressStep = {
  title: string;
  description: string;
  status: ProgressStepStatus;
  icon: IconName;
  onClick?: () => void;
};

export enum ProgressStepStatus {
  Completed = "completed",
  Current = "current",
  Pending = "pending",
  Loading = "loading"
}

export type ProgressProps = {
  header: ProgressStep;
  steps: ProgressStep[];
  className?: string;
  children?: React.ReactNode;
};

export const Progress: React.FC<ProgressProps> = ({
  header,
  steps,
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "flex flex-col p-8 rounded-xl gap-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Header Banner */}
        <div className="bg-secondary-400 rounded-md p-4 flex items-center gap-4">
          <Icon name={header.icon} size={24} />
          <Text variant="body-md">
            {header.title}
          </Text>
        </div>

        <Text variant="body-xxs-medium" color="secondary" className="italic pb-4">
          {header.description}
        </Text>

        {/* Progress Steps */}
        <div className="flex flex-col">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 relative">
              {/* Status Line Container */}
              {index < steps.length - 1 && (
                <div className="absolute left-[13px] top-7 bottom-0 w-0.5 bg-stroke z-0">
                  {/* Colored portion for completed steps */}
                  {step.status === "completed" && (
                    <div
                      className="absolute top-0 left-0 w-full bg-primary-blue"
                      style={{
                        height: index < steps.length - 1 ? "100%" : "0px"
                      }}
                    />
                  )}
                </div>
              )}

              {/* Step Circle Column */}
              <div className="flex flex-col items-center z-10">
                <div className="relative w-7 h-7">
                  <Icon
                    name={step.status === ProgressStepStatus.Completed ? "swoosh" : step.icon}
                    size={20}
                    color={step.status === ProgressStepStatus.Completed ? "white" : step.status === ProgressStepStatus.Pending ? "disabled" : "primaryBlue"}
                    className="absolute inset-0 m-auto z-0"
                  />
                
                  {/* Step Circle */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full",
                      step.status === ProgressStepStatus.Completed
                        ? "bg-primary-blue"
                        : step.status === ProgressStepStatus.Current
                          ? "bg-white border-2 border-primary-blue"
                          : step.status === ProgressStepStatus.Loading
                            ? "bg-white border-2 border-primary-blue border-t-transparent rounded-full animate-spin"
                            : "bg-white border border-stroke"
                    )}
                  >
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <ClickOrDiv onClick={step.onClick} className="flex flex-col pb-8">
                {/* <Icon name={step.icon} size={20} className="absolute left-1 top-1" /> */}
                <Text variant="body-xs-medium" className="primary self-start">
                  {step.title}
                </Text>
                <Text variant="body-xxs-medium" color="secondary" className="self-start">
                  {step.description}
                </Text>
              </ClickOrDiv>
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Progress;


type ClickOrDivProps = React.HTMLAttributes<HTMLDivElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
  };

const ClickOrDiv: React.FC<ClickOrDivProps> = ({ onClick, className, children, ...props }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(className, "hover:underline")}
        type="button"
        {...props} // Spread additional attributes for the button
      >
        {children}
      </button>
    );
  }

  return (
    <div className={className} {...props}> {/* Spread additional attributes for the div */}
      {children}
    </div>
  );
};
