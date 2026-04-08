import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    
    let variantStyles = "bg-primary text-foreground hover:opacity-90";
    if (variant === "accent") variantStyles = "bg-accent text-primary hover:opacity-90";
    if (variant === "outline") variantStyles = "border border-border bg-transparent hover:bg-muted/10 text-foreground";
    if (variant === "ghost") variantStyles = "bg-transparent hover:bg-muted/10 text-foreground";

    let sizeStyles = "h-10 px-4 py-2";
    if (size === "sm") sizeStyles = "h-9 rounded-md px-3 text-xs";
    if (size === "lg") sizeStyles = "h-12 rounded-md px-8 text-base";
    if (size === "icon") sizeStyles = "h-10 w-10";

    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
