/**
 * Merchant handlers index
 * 
 * Exports all merchant-related handler functions and router
 */

export { createMerchant } from './create-merchant';
export { getMerchants } from './get-merchants';
export { getMerchantById } from './get-merchant-by-id';
export { getMerchantBySlug } from './get-merchant-by-slug';
export { updateMerchant } from './update-merchant';
export { deleteMerchant } from './delete-merchant';
export { toggleMerchantStatus } from './toggle-merchant-status';
export { merchantRouter } from './router';
