// db/schemas/imageProcessingJobs.schema.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { items } from './items.schema';
import timestamps from './utils/timestamps';

/**
 * Enum for image processing job status
 */
export enum EJobStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Schema for image processing job status enum
 */
export const jobStatusEnum = pgEnum('job_status', EJobStatus);

/**
 * Schema for image processing jobs table
 */
export const imageProcessingJobs = pgTable('image_processing_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .references(() => items.id, { onDelete: 'cascade' })
    .notNull(),
  status: jobStatusEnum('status').notNull().default(EJobStatus.PROCESSING),
  imageUrl: text('image_url').notNull(),
  enhancedImageUrl: text('enhanced_image_url'),
  analysisResult: json('analysis_result'),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  ...timestamps,
});

/**
 * Type inference for image processing job
 */
export type ImageProcessingJob = typeof imageProcessingJobs.$inferSelect;

/**
 * Type inference for new image processing job
 */
export type NewImageProcessingJob = typeof imageProcessingJobs.$inferInsert;
