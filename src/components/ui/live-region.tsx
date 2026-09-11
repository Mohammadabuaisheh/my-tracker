import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LiveRegionProps {
  message: string;
}

export function LiveRegion({ message }: LiveRegionProps) {
  return (
    <VisuallyHidden>
      <div role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </VisuallyHidden>
  );
}