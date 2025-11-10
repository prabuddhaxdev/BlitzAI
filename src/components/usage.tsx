import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useMemo, useState } from "react";

interface Props {
  points: number;
  msBeforeNext: number;
}

export function Usage({ points, msBeforeNext }: Props) {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  // Capture current time and refresh every hour
  const [baseTime, setBaseTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setBaseTime(Date.now());
    }, 60 * 60 * 1000); // refresh every hour
    return () => clearInterval(interval);
  }, []);

  // Compute duration between now and reset time
  const resetTime = useMemo(() => {
    try {
      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(baseTime + msBeforeNext),
        }),
        { format: ["months", "days", "hours"] }
      );
    } catch (error) {
      console.error("Error formatting duration", error);
      return "Soon";
    }
  }, [baseTime, msBeforeNext]);

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">
            {points} {hasProAccess ? "" : "free"} points
          </p>
          <p className="text-xs text-muted-foreground">Reset in {resetTime}</p>
        </div>

        {!hasProAccess && (
          <Button asChild variant="tertiary" size="sm" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
