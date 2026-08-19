import { ActiveWorkoutPage } from "@/features/workout/ActiveWorkoutPage";

export default async function ActiveWorkoutRoute({ params, searchParams }: { params: Promise<{ sessionId: string }>; searchParams: Promise<{ duration?: string }> }) {
  const [{ sessionId }, query] = await Promise.all([params, searchParams]);
  return <ActiveWorkoutPage sessionId={sessionId} compact={query.duration === "30"} />;
}
