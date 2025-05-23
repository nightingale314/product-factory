import { AIEnrichedIcon } from "@/components/ui/icons/AIEnrichedIcon";
import { ProductLastUpdatedBy } from "@prisma/client";

interface InputWrapperProps {
  id: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
  lastUpdatedBy: ProductLastUpdatedBy | null;
  lastUpdatedAt: Date | null;
}

export const InputWrapper = ({
  id,
  name,
  required,
  children,
  lastUpdatedBy,
  lastUpdatedAt,
}: InputWrapperProps) => {
  return (
    <div className="grid grid-cols-[minmax(0,200px)_1fr] w-full">
      <div className="flex items-start gap-2 pt-2 ">
        <label
          className="text-sm items-center text-muted-foreground"
          htmlFor={id}
        >
          {name} {required ? <span className="text-red-500">*</span> : null}
        </label>
        {lastUpdatedBy === ProductLastUpdatedBy.ENRICHMENT ? (
          <AIEnrichedIcon lastUpdatedAt={lastUpdatedAt} />
        ) : null}
      </div>

      <div className="flex items-center">{children}</div>
    </div>
  );
};
