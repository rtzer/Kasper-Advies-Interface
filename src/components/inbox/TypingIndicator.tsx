export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
      </div>
      <span className="text-xs text-muted-foreground">Aan het typen...</span>
    </div>
  );
};
