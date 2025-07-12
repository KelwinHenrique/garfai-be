/**
 * Test script for Store CRUD operations
 * 
 * This script tests the store service implementation by performing
 * Create, Read, Update, and Delete operations on store entities.
 */

import { StoreService } from '../services/store-service';
import { PriceRange, StoreCreateInput } from '../models';
import { testDatabaseConnection } from '../config/database';

// Initialize store service
const storeService = new StoreService();

// Sample store data for testing
const testStore: StoreCreateInput = {
  name: 'Test Restaurant',
  description: 'A test restaurant for CRUD operations',
  logo: 'https://example.com/logo.png',
  coverImage: 'https://example.com/cover.jpg',
  email: 'contact@testrestaurant.com',
  phone: '+1234567890',
  website: 'https://testrestaurant.com',
  address: {
    street: 'Test Street',
    number: '123',
    neighborhood: 'Test Neighborhood',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345-678',
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333
    }
  },
  businessHours: {
    monday: { open: '09:00', close: '22:00' },
    tuesday: { open: '09:00', close: '22:00' },
    wednesday: { open: '09:00', close: '22:00' },
    thursday: { open: '09:00', close: '22:00' },
    friday: { open: '09:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '22:00' }
  },
  categories: ['Pizza', 'Italian', 'Fast Food'],
  priceRange: PriceRange.MEDIUM,
  minDeliveryPrice: 15.90,
  deliveryOptions: ['Delivery', 'Pickup'],
  paymentMethods: ['Credit Card', 'Debit Card', 'Cash']
};

// Updated store data for testing
const updatedStoreData = {
  name: 'Updated Test Restaurant',
  description: 'Updated description for testing',
  minDeliveryPrice: 12.50,
  priceRange: PriceRange.LOW
};

/**
 * Main function to run the CRUD tests
 */
async function runTests() {
  try {
    console.log('Testing database connection...');
    await testDatabaseConnection();
    console.log('Database connection successful!\n');

    // Test Create
    console.log('Creating test store...');
    const createdStore = await storeService.createStore(testStore);
    console.log('Store created successfully:');
    console.log(JSON.stringify(createdStore, null, 2));
    console.log('\n');

    // Test Read All
    console.log('Fetching all stores...');
    const allStores = await storeService.getStores();
    console.log(`Found ${allStores.length} stores`);
    console.log('\n');

    // Test Read By ID
    console.log(`Fetching store by ID: ${createdStore.id}...`);
    const storeById = await storeService.getStoreById(createdStore.id);
    console.log('Store found by ID:');
    console.log(JSON.stringify(storeById, null, 2));
    console.log('\n');

    // Test Read By Slug
    console.log(`Fetching store by slug: ${createdStore.slug}...`);
    const storeBySlug = await storeService.getStoreBySlug(createdStore.slug);
    console.log('Store found by slug:');
    console.log(JSON.stringify(storeBySlug, null, 2));
    console.log('\n');

    // Test Update
    console.log('Updating store...');
    const updatedStore = await storeService.updateStore({
      id: createdStore.id,
      ...updatedStoreData
    });
    console.log('Store updated successfully:');
    console.log(JSON.stringify(updatedStore, null, 2));
    console.log('\n');

    // Test Toggle Active Status
    console.log('Toggling store active status to inactive...');
    const inactiveStore = await storeService.toggleStoreActive(createdStore.id, false);
    console.log('Store status toggled:');
    console.log(JSON.stringify(inactiveStore, null, 2));
    console.log('\n');

    // Test Delete
    console.log('Deleting store...');
    await storeService.deleteStore(createdStore.id);
    console.log('Store deleted successfully');
    
    // Verify deletion
    const deletedStore = await storeService.getStoreById(createdStore.id);
    console.log('Verification after deletion:', deletedStore === null ? 'Store was deleted' : 'Store still exists');

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error during tests:', error);
  }
}

// Run the tests
runTests();
