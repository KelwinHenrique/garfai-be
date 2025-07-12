/**
 * Store handler
 * 
 * Handles HTTP requests for store operations
 */

import { Request, Response } from 'express';
import { StoreUseCase } from '../use-cases/store-use-case';
import { ApiResponse, StoreCreateInput, StoreUpdateInput } from '../models';
import { ValidationError } from 'yup';

/**
 * Store handler class
 */
export class StoreHandler {
  private storeUseCase: StoreUseCase;
  
  /**
   * Creates a new StoreHandler instance
   */
  constructor() {
    this.storeUseCase = new StoreUseCase();
  }
  
  /**
   * Create a new store
   * 
   * @param req - Express request
   * @param res - Express response
   */
  async createStore(req: Request, res: Response): Promise<void> {
    try {
      const storeData = req.body as StoreCreateInput;
      const store = await this.storeUseCase.createStore(storeData);
      
      const response: ApiResponse = {
        success: true,
        data: store,
        timestamp: new Date().toISOString()
      };
      
      res.status(201).json(response);
    } catch (error) {
      let errorMessage = 'Failed to create store';
      let statusCode = 500;
      
      if (error instanceof ValidationError) {
        errorMessage = `Validation error: ${error.message}`;
        statusCode = 400;
      }
      
      const response: ApiResponse = {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      res.status(statusCode).json(response);
    }
  }
  
  /**
   * Get all stores
   * 
   * @param req - Express request
   * @param res - Express response
   */
  async getStores(req: Request, res: Response): Promise<void> {
    try {
      const active = req.query.active !== undefined 
        ? req.query.active === 'true'
        : undefined;
      
      const stores = await this.storeUseCase.getStores(active);
      
      const response: ApiResponse = {
        success: true,
        data: stores,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve stores',
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(response);
    }
  }
  
  /**
   * Get a store by ID
   * 
   * @param req - Express request
   * @param res - Express response
   */
  async getStoreById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const store = await this.storeUseCase.getStoreById(id);
      
      if (!store) {
        const response: ApiResponse = {
          success: false,
          error: `Store with ID ${id} not found`,
          timestamp: new Date().toISOString()
        };
        
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: store,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve store',
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(response);
    }
  }
  
  /**
   * Get a store by slug
   * 
   * @param req - Express request
   * @param res - Express response
   */
  async getStoreBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const store = await this.storeUseCase.getStoreBySlug(slug);
      
      if (!store) {
        const response: ApiResponse = {
          success: false,
          error: `Store with slug ${slug} not found`,
          timestamp: new Date().toISOString()
        };
        
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: store,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve store',
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(response);
    }
  }
  
  /**
   * Update a store
   * 
   * @param req - Express request
   * @param res - Express response
   */
  async updateStore(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const storeData: StoreUpdateInput = {
        ...req.body,
        id
      };
      
      const updatedStore = await this.storeUseCase.updateStore(storeData);
      
      const response: ApiResponse = {
        success: true,
        data: updatedStore,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      let errorMessage = 'Failed to update store';
      let statusCode = 500;
      
      if (error instanceof ValidationError) {
        errorMessage = `Validation error: ${error.message}`;
        statusCode = 400;
      } else if (error instanceof Error && error.message.includes('not found')) {
        errorMessage = error.message;
        statusCode = 404;
      }
      
      const response: ApiResponse = {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      res.status(statusCode).json(response);
    }
  }
  
  /**
   * Delete a store
   * 
   * @param req - Express request
   * @param res - Express response
   */
  async deleteStore(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.storeUseCase.deleteStore(id);
      
      const response: ApiResponse = {
        success: true,
        data: { id },
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      let errorMessage = 'Failed to delete store';
      let statusCode = 500;
      
      if (error instanceof Error && error.message.includes('not found')) {
        errorMessage = error.message;
        statusCode = 404;
      }
      
      const response: ApiResponse = {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      res.status(statusCode).json(response);
    }
  }
  
  /**
   * Toggle store active status
   * 
   * @param req - Express request
   * @param res - Express response
   */
  async toggleStoreStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      if (typeof isActive !== 'boolean') {
        const response: ApiResponse = {
          success: false,
          error: 'isActive must be a boolean',
          timestamp: new Date().toISOString()
        };
        
        res.status(400).json(response);
        return;
      }
      
      const updatedStore = await this.storeUseCase.toggleStoreStatus(id, isActive);
      
      const response: ApiResponse = {
        success: true,
        data: updatedStore,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      let errorMessage = 'Failed to update store status';
      let statusCode = 500;
      
      if (error instanceof Error && error.message.includes('not found')) {
        errorMessage = error.message;
        statusCode = 404;
      }
      
      const response: ApiResponse = {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      res.status(statusCode).json(response);
    }
  }
}
