"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

const toolbarVariants = cva(
  ["grid w-full items-center", "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"],
  {
    variants: {
      size: {
        sm: "h-12 gap-2 px-3 text-sm",
        md: "h-14 gap-4 px-4 text-sm",
        lg: "h-16 gap-6 px-6 text-base",
      },
      variant: {
        flat: "bg-background",
        elevated: "bg-background shadow-sm",
        bordered: "bg-background border-b border-border",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "flat",
    },
  }
);

type ToolbarProps = ComponentPropsWithoutRef<"nav"> & VariantProps<typeof toolbarVariants>;

function Toolbar({ className, size, variant, children, ...props }: ToolbarProps): React.ReactNode {
  return (
    <nav className={cn(toolbarVariants({ size, variant }), className)} {...props}>
      {children}
    </nav>
  );
}

type SlotProps = ComponentPropsWithoutRef<"div">;

function ToolbarLeft({ className, children, ...props }: SlotProps): React.ReactNode {
  return (
    <div className={cn("flex min-w-0 items-center gap-1 justify-self-start", className)} {...props}>
      {children}
    </div>
  );
}

function ToolbarCenter({ className, children, ...props }: SlotProps): React.ReactNode {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-center justify-self-center text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ToolbarRight({ className, children, ...props }: SlotProps): React.ReactNode {
  return (
    <div className={cn("flex min-w-0 items-center gap-1 justify-self-end", className)} {...props}>
      {children}
    </div>
  );
}

function ToolbarTitle({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h1">): React.ReactNode {
  return (
    <h1
      className={cn("truncate text-xl font-serif font-bold uppercase tracking-tight", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

function ToolbarMenuItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"a">): React.ReactNode {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5",
        "text-sm font-medium text-muted-foreground",
        "transition-colors hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

const iconButtonVariants = cva(
  "relative inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "size-8 [&_svg]:size-4",
        md: "size-9 [&_svg]:size-5",
        lg: "size-10 [&_svg]:size-6",
      },
      variant: {
        ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        outline: "border border-border text-foreground hover:bg-accent",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "ghost",
    },
  }
);

type ToolbarIconButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof iconButtonVariants> & {
    label: string;
    icon: ReactNode;
    badge?: number | string;
  };

function ToolbarIconButton({
  className,
  size,
  variant,
  label,
  icon,
  badge,
  type = "button",
  ...props
}: ToolbarIconButtonProps): React.ReactNode {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(iconButtonVariants({ size, variant }), className)}
      {...props}
    >
      <span aria-hidden>{icon}</span>
      {badge !== undefined && badge !== null && (
        <span
          aria-hidden
          className={cn(
            "absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-destructive px-1",
            "text-center text-[10px] font-semibold leading-4 text-destructive-foreground"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function ToolbarSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">): React.ReactNode {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={cn("mx-1 h-6 w-px shrink-0 bg-border", className)}
      {...props}
    />
  );
}

export {
  Toolbar,
  ToolbarLeft,
  ToolbarCenter,
  ToolbarRight,
  ToolbarTitle,
  ToolbarMenuItem,
  ToolbarIconButton,
  ToolbarSeparator,
};
