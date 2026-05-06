import * as React from "react";
import { Input } from "@/components/ui/input";
import { formatIDRTyping, parseIDRInput } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface IDRInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number;
  onValueChange: (v: number) => void;
  className?: string;
}

export const IDRInput = React.forwardRef<HTMLInputElement, IDRInputProps>(
  ({ value, onValueChange, className, ...props }, ref) => {
    const [text, setText] = React.useState(value ? formatIDRTyping(String(value)) : "");

    React.useEffect(() => {
      const parsed = parseIDRInput(text);
      if (parsed !== value) {
        setText(value ? formatIDRTyping(String(value)) : "");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
      <div className={cn("relative", className)}>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          Rp
        </span>
        <Input
          ref={ref}
          inputMode="numeric"
          autoComplete="off"
          value={text}
          onChange={(e) => {
            const formatted = formatIDRTyping(e.target.value);
            setText(formatted);
            onValueChange(parseIDRInput(formatted));
          }}
          className="pl-10 font-mono-num"
          {...props}
        />
      </div>
    );
  }
);
IDRInput.displayName = "IDRInput";
