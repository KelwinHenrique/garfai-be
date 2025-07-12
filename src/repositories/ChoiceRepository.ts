import { db } from '../config/database';
import { choices, Choice, NewChoice } from '../schemas/choices.schema';

export class ChoiceRepository {
    async create(newChoice: NewChoice): Promise<Choice> {
        const [insertedChoice] = await db.insert(choices).values(newChoice).returning();
        return insertedChoice as unknown as Choice;
      }
}