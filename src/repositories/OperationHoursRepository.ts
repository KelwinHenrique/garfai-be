import { db } from "../config/database";
import {
  operatingHours,
  OperatingHour,
  NewOperatingHour,
} from "../schemas/operatingHours.schema";

export class OperationHoursRepository {
  async create(newOperatingHour: NewOperatingHour): Promise<OperatingHour> {
    const [insertedOperatingHour] = await db
      .insert(operatingHours)
      .values(newOperatingHour)
      .returning();
    return insertedOperatingHour as unknown as OperatingHour;
  }
}
