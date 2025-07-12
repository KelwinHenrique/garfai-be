/**
 * Import menu handler
 *
 * @param req - Express request object
 * @param res - Express response object
 */
import { Request, Response } from "express";
import { ApiResponse } from "../../models";
import { importMenu as importMenuUseCase } from "../../use-cases/menu/import-menu";

export const importMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const merchantId = '2c8b3eb2-b70e-46a3-9d9f-5c07c17fd429'
    const userId = '407f7f8f-1d61-4255-baa0-9af660211c08'
    const payload = {
      ifoodMerchantId: 'dcdc97e2-fe2e-43da-9987-3cdf4d0ee690',
    }

    if (!merchantId || !userId) {
      const response: ApiResponse = {
        success: false,
        error: "Missing required parameters: merchantId or userId",
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(response);
      return;
    }

    await importMenuUseCase(payload, merchantId, userId);

    const response: ApiResponse = {
      success: true,
      data: { message: "Menu import process started successfully" },
      timestamp: new Date().toISOString(),
    };

    res.status(202).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: `Error importing menu: ${(error as Error).message}`,
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
};
