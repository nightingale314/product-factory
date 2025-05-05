interface InstructionsProps {
  title: string;
  instructions: string[];
}

export const Instructions = ({ title, instructions }: InstructionsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="">{title}</h4>
        <ul className="list-disc list-outside ml-4">
          {instructions.map((instruction) => (
            <li key={instruction} className="text-sm text-muted-foreground">
              {instruction}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
