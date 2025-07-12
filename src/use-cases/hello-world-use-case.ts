/**
 * Hello world use case
 * 
 * Contains business logic for the hello world functionality
 */
import { helloWorldService } from '../services';

/**
 * Get hello world message
 * 
 * @returns Object containing hello world message
 */
export const getHelloWorldMessage = (): { message: string } => {
  return {
    message: helloWorldService.getMessage()
  };
};
