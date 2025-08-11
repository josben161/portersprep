import { cn } from "@/lib/utils";
export function Button({ className, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const Comp: any = asChild ? "span" : "button";
  return <Comp className={cn("inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm", className)} {...props} />;
} 