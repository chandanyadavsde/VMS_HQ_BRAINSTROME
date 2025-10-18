// Test Vehicle Feature on Master Page
// Navigate to master page and test the + vehicle functionality

import { chromium } from 'playwright';

async function testVehicleFeature() {
  console.log('🚗 Testing Vehicle Feature on Master Page...\n');
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser for visual debugging
    devtools: true   // Open DevTools
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to your Vite app
    console.log('📍 Step 1: Navigating to Vite app...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    console.log('✅ App loaded successfully\n');
    
    // Step 2: Look for master page or main navigation
    console.log('🔍 Step 2: Looking for master page elements...');
    
    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'master-page-initial.png', fullPage: true });
    console.log('📸 Screenshot saved: master-page-initial.png');
    
    // Look for common master page elements
    const possibleMasterElements = [
      'nav',
      'header',
      '[data-testid*="master"]',
      '[data-testid*="main"]',
      '.master-page',
      '.main-page',
      '.dashboard'
    ];
    
    let masterPageFound = false;
    for (const selector of possibleMasterElements) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found master page element: ${selector} (${count} elements)`);
        masterPageFound = true;
      }
    }
    
    // Step 3: Look for + vehicle button or add vehicle functionality
    console.log('\n🚗 Step 3: Looking for + vehicle functionality...');
    
    const vehicleSelectors = [
      'button:has-text("+ vehicle")',
      'button:has-text("+ Vehicle")',
      'button:has-text("Add Vehicle")',
      'button:has-text("Add vehicle")',
      '[data-testid*="add-vehicle"]',
      '[data-testid*="vehicle"]',
      'button[aria-label*="vehicle"]',
      'button[aria-label*="Vehicle"]',
      '.add-vehicle',
      '.vehicle-add',
      'button:has-text("+")',
      'button:has-text("Add")'
    ];
    
    let vehicleButtonFound = false;
    let vehicleButtonSelector = null;
    
    for (const selector of vehicleSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found vehicle button: ${selector} (${count} elements)`);
        vehicleButtonFound = true;
        vehicleButtonSelector = selector;
        break;
      }
    }
    
    if (!vehicleButtonFound) {
      console.log('❌ No + vehicle button found. Looking for any buttons...');
      const allButtons = await page.locator('button').count();
      console.log(`Found ${allButtons} buttons on the page`);
      
      // List all button texts
      const buttonTexts = await page.locator('button').allTextContents();
      console.log('Button texts found:', buttonTexts.slice(0, 10)); // Show first 10
    }
    
    // Step 4: Test the vehicle functionality if found
    if (vehicleButtonFound && vehicleButtonSelector) {
      console.log('\n🎭 Step 4: Testing + vehicle functionality...');
      
      try {
        // Click the + vehicle button
        await page.locator(vehicleButtonSelector).first().click();
        await page.waitForTimeout(1000);
        
        // Look for modal, form, or new page
        const modalSelectors = [
          '.modal',
          '[role="dialog"]',
          '.popup',
          '.overlay',
          '.form',
          '[data-testid*="modal"]',
          '[data-testid*="form"]'
        ];
        
        let modalFound = false;
        for (const modalSelector of modalSelectors) {
          const isVisible = await page.locator(modalSelector).isVisible();
          if (isVisible) {
            console.log(`✅ Modal/form opened: ${modalSelector}`);
            modalFound = true;
            break;
          }
        }
        
        if (modalFound) {
          // Take screenshot of the modal
          await page.screenshot({ path: 'vehicle-modal.png', fullPage: true });
          console.log('📸 Modal screenshot saved: vehicle-modal.png');
          
          // Look for form fields
          const formFields = await page.locator('input, select, textarea').count();
          console.log(`📝 Found ${formFields} form fields`);
          
          // Look for submit/save button
          const submitButtons = [
            'button:has-text("Save")',
            'button:has-text("Submit")',
            'button:has-text("Add")',
            'button:has-text("Create")',
            'button[type="submit"]'
          ];
          
          for (const submitSelector of submitButtons) {
            const count = await page.locator(submitSelector).count();
            if (count > 0) {
              console.log(`✅ Found submit button: ${submitSelector}`);
            }
          }
        } else {
          console.log('❌ No modal or form opened after clicking + vehicle');
        }
        
      } catch (error) {
        console.log(`❌ Error testing vehicle functionality: ${error.message}`);
      }
    }
    
    // Step 5: Check for any vehicle-related content on the page
    console.log('\n🔍 Step 5: Looking for existing vehicle content...');
    
    const vehicleContentSelectors = [
      'text=vehicle',
      'text=Vehicle',
      '[data-testid*="vehicle"]',
      '.vehicle',
      '.vehicles'
    ];
    
    for (const selector of vehicleContentSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found vehicle content: ${selector} (${count} elements)`);
      }
    }
    
    // Step 6: Check console for any errors
    console.log('\n🐛 Step 6: Checking for console errors...');
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });
    
    const errors = logs.filter(log => log.type === 'error');
    if (errors.length > 0) {
      console.log(`❌ Found ${errors.length} console errors:`);
      errors.forEach(error => console.log(`  - ${error.message}`));
    } else {
      console.log('✅ No console errors found');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'master-page-final.png', fullPage: true });
    console.log('\n📸 Final screenshot saved: master-page-final.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Vehicle feature testing completed!');
}

// Run the test
testVehicleFeature().catch(console.error);

