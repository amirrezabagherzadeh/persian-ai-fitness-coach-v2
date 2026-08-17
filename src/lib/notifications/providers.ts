import type { UserProfile, WeeklyCheckIn } from "@/domain/types";

export interface HealthDataProvider {
  name: string;
  getLatestMeasurements(): Promise<Pick<UserProfile, "weightKg" | "waistCm"> | null>;
  saveManualCheckIn(checkIn: WeeklyCheckIn): Promise<void>;
}

export class ManualMeasurementProvider implements HealthDataProvider {
  name = "manual";
  constructor(private readonly getCheckIns: () => WeeklyCheckIn[]) {}
  async getLatestMeasurements() {
    const latest = this.getCheckIns().at(-1);
    return latest ? { weightKg: latest.weightKg, waistCm: latest.waistCm } : null;
  }
  async saveManualCheckIn() {
    return;
  }
}
