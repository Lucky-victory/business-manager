type AlertErrorProps = {
  message: string;
};

export function AlertError({ message }: AlertErrorProps) {
  return (
    <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded relative">
      <span className="block sm:inline">{message}</span>
    </div>
  );
}
