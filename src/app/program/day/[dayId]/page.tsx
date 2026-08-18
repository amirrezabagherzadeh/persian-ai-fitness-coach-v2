import { WorkoutDayPage } from "@/features/workout/WorkoutDayPage";

export default async function ProgramDayRoute({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;
  return <WorkoutDayPage id={dayId} />;
}
