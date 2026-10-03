import { useId } from "react";
import { cn } from "@/lib/utils";

interface Choice<T extends string> {
  id: T;
  label: string;
  description?: string;
}

interface ChoiceGroupProps<T extends string> {
  legend: string;
  name: string;
  value: T;
  choices: readonly Choice<T>[];
  onChange: (value: T) => void;
  columns?: string;
  hint?: string;
}

/** Native radio inputs styled as a segmented control, so keyboard and screen reader behaviour comes for free. */
export function ChoiceGroup<T extends string>({ legend, name, value, choices, onChange, columns = "grid-cols-2", hint }: ChoiceGroupProps<T>) {
  const hintId = useId();
  return (
    <fieldset aria-describedby={hint ? hintId : undefined}>
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className={cn("grid gap-2", columns)}>
        {choices.map((choice) => (
          <label
            key={choice.id}
            className={cn(
              "relative flex cursor-pointer flex-col rounded-md border border-input bg-background px-3 py-2.5 transition-colors",
              "hover:border-foreground/40",
              "has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-accent-foreground",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
            )}
          >
            <input
              type="radio"
              name={name}
              value={choice.id}
              checked={value === choice.id}
              onChange={() => onChange(choice.id)}
              className="sr-only"
            />
            <span className="text-sm font-medium">{choice.label}</span>
            {choice.description ? <span className="mt-0.5 text-xs text-muted-foreground has-[:checked]:text-inherit">{choice.description}</span> : null}
          </label>
        ))}
      </div>
      {hint ? (
        <p id={hintId} className="mt-2 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}
