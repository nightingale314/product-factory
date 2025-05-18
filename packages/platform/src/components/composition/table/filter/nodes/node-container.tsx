import { Button } from "@/components/ui/button";
import { QueryOperator } from "@/lib/parsers/enums";
import { useTransition } from "react";

interface NodeLabelProps {
  label: React.ReactNode;
  children: React.ReactNode;
  selectedOperator?: QueryOperator;
  renderLabel?: (label: React.ReactNode) => React.ReactNode;
  onApply: () => void;
}

const operatorMap: Record<QueryOperator, string> = {
  [QueryOperator.EQUALS]: "Is equal to",
  [QueryOperator.NOT_EQUALS]: "Is not equal to",
  [QueryOperator.IN]: "Is in",
  [QueryOperator.NOT_IN]: "Is not in",
  [QueryOperator.GREATER_THAN]: "More than",
  [QueryOperator.LESS_THAN]: "Less than",
  [QueryOperator.GREATER_THAN_OR_EQUAL]: "More than or equal to",
  [QueryOperator.LESS_THAN_OR_EQUAL]: "Less than or equal to",
  [QueryOperator.CONTAINS]: "Contains",
};

const FilterLabel = ({ label }: { label: React.ReactNode }) => {
  return (
    <div className="text-sm font-medium">Filter by &quot;{label}&quot;</div>
  );
};

export const NodeContainer = ({
  label,
  children,
  selectedOperator,
  onApply,
  renderLabel,
}: NodeLabelProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      {renderLabel ? (
        renderLabel(<FilterLabel label={label} />)
      ) : (
        <FilterLabel label={label} />
      )}
      <div className="flex gap-2 items-center flex-wrap">
        {selectedOperator ? (
          <div className="text-sm whitespace-nowrap">
            {operatorMap[selectedOperator]}
          </div>
        ) : null}

        {children}
      </div>

      <Button
        size="sm"
        onClick={() => startTransition(onApply)}
        isLoading={isPending}
        disabled={isPending}
      >
        Apply
      </Button>
    </div>
  );
};
