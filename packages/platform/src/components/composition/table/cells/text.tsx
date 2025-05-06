interface TextCellProps {
  value?: string | null;
}

export const TextCell = ({ value }: TextCellProps) => {
  return <p className="truncate line-clamp-2">{value}</p>;
};
