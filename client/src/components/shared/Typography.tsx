import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: ElementType;
}

export function Display({
  children,
  className,
  as: As = "h1",
  ...props
}: TypographyProps) {
  return (
    <As
      className={cn(
        "font-serif text-4xl md:text-6xl font-bold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}

export function Headline({
  children,
  className,
  as: As = "h2",
  ...props
}: TypographyProps) {
  return (
    <As
      className={cn(
        "font-serif text-2xl md:text-3xl font-bold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </As>
  );
}

export function Lead({
  children,
  className,
  as: As = "p",
  ...props
}: TypographyProps) {
  return (
    <As
      className={cn("text-lg md:text-xl leading-relaxed", className)}
      {...props}
    >
      {children}
    </As>
  );
}

export function Body({
  children,
  className,
  as: As = "p",
  ...props
}: TypographyProps) {
  return (
    <As className={cn("text-base leading-relaxed", className)} {...props}>
      {children}
    </As>
  );
}

export function Caption({
  children,
  className,
  as: As = "p",
  ...props
}: TypographyProps) {
  return (
    <As className={cn("text-sm", className)} {...props}>
      {children}
    </As>
  );
}

export function Muted({
  children,
  className,
  as: As = "span",
  ...props
}: TypographyProps) {
  return (
    <As className={cn("text-sm text-foreground/50", className)} {...props}>
      {children}
    </As>
  );
}
