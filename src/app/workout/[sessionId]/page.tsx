import { ActiveWorkoutPage } from "@/features/workout/ActiveWorkoutPage";

export default async function ActiveWorkoutRoute({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <ActiveWorkoutPage sessionId={sessionId} />;
}
