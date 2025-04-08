import { Switch } from "@/components/ui/switch";

interface SwitchCellProps {
  value?: boolean;
}

export const SwitchCell = ({ value }: SwitchCellProps) => {
  return <Switch checked={!!value} disabled />;
};
