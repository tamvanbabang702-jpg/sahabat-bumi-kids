import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const kidButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 touch-target select-none active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-button hover:brightness-105 active:shadow-button-pressed active:translate-y-1 rounded-2xl",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_6px_0_hsl(199_85%_40%)] hover:brightness-105 active:shadow-[0_2px_0_hsl(199_85%_40%)] active:translate-y-1 rounded-2xl",
        accent:
          "bg-accent text-accent-foreground shadow-[0_6px_0_hsl(35_90%_40%)] hover:brightness-105 active:shadow-[0_2px_0_hsl(35_90%_40%)] active:translate-y-1 rounded-2xl",
        success:
          "bg-success text-success-foreground shadow-[0_6px_0_hsl(142_70%_35%)] hover:brightness-105 active:shadow-[0_2px_0_hsl(142_70%_35%)] active:translate-y-1 rounded-2xl",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_6px_0_hsl(10_70%_40%)] hover:brightness-105 active:shadow-[0_2px_0_hsl(10_70%_40%)] active:translate-y-1 rounded-2xl",
        outline:
          "border-4 border-primary bg-card text-primary hover:bg-primary/10 rounded-2xl",
        ghost:
          "text-primary hover:bg-primary/10 rounded-xl",
        choice:
          "bg-card border-4 border-primary text-foreground shadow-card hover:border-accent hover:shadow-glow rounded-3xl p-6 flex-col h-auto",
      },
      size: {
        sm: "h-10 px-4 text-base rounded-xl",
        default: "h-14 px-8 text-lg",
        lg: "h-16 px-10 text-xl",
        xl: "h-20 px-12 text-2xl",
        icon: "h-14 w-14 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface KidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof kidButtonVariants> {
  asChild?: boolean;
}

const KidButton = React.forwardRef<HTMLButtonElement, KidButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(kidButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
KidButton.displayName = "KidButton";

export { KidButton, kidButtonVariants };
