/**
 * Hello world service
 * 
 * Service layer for hello world functionality
 */

/**
 * Hello world service implementation
 */
class HelloWorldService {
  /**
   * Get hello world message
   * 
   * @returns Hello world message string
   */
  public getMessage(): string {
    return 'Hello World from GarfAI Backend!';
  }
}

/**
 * Singleton instance of HelloWorldService
 */
export const helloWorldService = new HelloWorldService();
