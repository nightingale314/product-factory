import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, children, className }: PageHeaderProps) => {
  return (
    <header
      className={cn(
        "flex justify-between items-center shrink-0 px-4 py-6",
        className
      )}
    >
      <h1>{title}</h1>
      {children}
    </header>
  );
};
