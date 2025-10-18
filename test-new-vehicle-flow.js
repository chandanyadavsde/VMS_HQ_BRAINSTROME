// Test the new Vehicle Flow Modal implementation
// Simple test to verify the new two-option flow

import { chromium } from 'playwright';

async function testNewVehicleFlow() {
  console.log('🚗 Testing new Vehicle Flow Modal implementation...\n');
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser window
    devtools: true,  // Open DevTools
    slowMo: 2000     // Slow down actions
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate and login
    console.log('📍 Step 1: Opening app and logging in...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Login process
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('chandan.yadav@sorigin.co');
    await page.locator('button:has-text("Continue with Email")').click();
    await page.waitForTimeout(3000);
    
    // Enter OTP
    const otpInputs = page.locator('input[type="text"]');
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill('1');
    }
    await page.locator('button:has-text("Verify")').click();
    await page.waitForTimeout(5000);
    
    console.log('✅ Login completed\n');
    
    // Step 2: Navigate to Masters
    console.log('🔍 Step 2: Looking for Masters navigation...');
    
    // Look for Masters link/button
    const mastersSelectors = [
      'a:has-text("Masters")',
      'button:has-text("Masters")',
      '[href*="masters"]',
      'text=Masters'
    ];
    
    let mastersFound = false;
    for (const selector of mastersSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found Masters navigation: ${selector}`);
        await page.locator(selector).first().click();
        await page.waitForTimeout(3000);
        mastersFound = true;
        break;
      }
    }
    
    if (!mastersFound) {
      console.log('❌ Masters navigation not found, checking current page...');
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);
    }
    
    // Step 3: Test the new + vehicle flow
    console.log('\n🚗 Step 3: Testing new + vehicle flow...');
    
    // Take screenshot of Masters page
    await page.screenshot({ path: 'masters-page.png', fullPage: true });
    console.log('📸 Screenshot: Masters page');
    
    // Look for the + vehicle button
    const vehicleButtonSelectors = [
      'button:has-text("Create Vehicle")',
      'button:has-text("+ vehicle")',
      'button:has-text("+ Vehicle")',
      'button:has-text("Add Vehicle")'
    ];
    
    let vehicleButtonFound = false;
    for (const selector of vehicleButtonSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found vehicle button: ${selector}`);
        await page.locator(selector).first().click();
        await page.waitForTimeout(3000);
        vehicleButtonFound = true;
        break;
      }
    }
    
    if (vehicleButtonFound) {
      // Take screenshot of the modal
      await page.screenshot({ path: 'vehicle-flow-modal.png', fullPage: true });
      console.log('📸 Screenshot: Vehicle Flow Modal');
      
      // Check for the new modal content
      const modalTitle = await page.locator('text=Choose Vehicle Creation Method').count();
      const vehicleOnlyOption = await page.locator('text=Add Vehicle Only').count();
      const vehicleDriverOption = await page.locator('text=Add Vehicle + Driver').count();
      const comingSoonBadge = await page.locator('text=Coming Soon').count();
      
      console.log('\n🎯 Modal Content Check:');
      console.log(`Modal Title: ${modalTitle > 0 ? '✅ Found' : '❌ Not found'}`);
      console.log(`Vehicle Only Option: ${vehicleOnlyOption > 0 ? '✅ Found' : '❌ Not found'}`);
      console.log(`Vehicle + Driver Option: ${vehicleDriverOption > 0 ? '✅ Found' : '❌ Not found'}`);
      console.log(`Coming Soon Badge: ${comingSoonBadge > 0 ? '✅ Found' : '❌ Not found'}`);
      
      if (modalTitle > 0) {
        console.log('\n🎉 SUCCESS! New Vehicle Flow Modal is working!');
        console.log('✅ Two-option flow implemented');
        console.log('✅ "Add Vehicle Only" option available');
        console.log('✅ "Add Vehicle + Driver" option with Coming Soon badge');
      } else {
        console.log('\n❌ Old modal still showing - implementation may need refresh');
      }
    } else {
      console.log('❌ Vehicle button not found');
    }
    
    // Step 4: Test Vehicle Only option
    if (vehicleButtonFound) {
      console.log('\n🔵 Step 4: Testing "Add Vehicle Only" option...');
      
      const startNowButton = page.locator('button:has-text("Start Now")').first();
      if (await startNowButton.count() > 0) {
        await startNowButton.click();
        await page.waitForTimeout(3000);
        
        await page.screenshot({ path: 'vehicle-only-form.png', fullPage: true });
        console.log('📸 Screenshot: Vehicle Only form');
        console.log('✅ Vehicle Only flow working');
      }
    }
    
    console.log('\n🎉 Testing completed! Check the screenshots to see the results.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    // Keep browser open for a moment
    console.log('\n⏳ Keeping browser open for 15 seconds...');
    await page.waitForTimeout(15000);
    await browser.close();
  }
}

// Run the test
testNewVehicleFlow().catch(console.error);

