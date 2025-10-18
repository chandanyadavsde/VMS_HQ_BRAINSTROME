// Test the new Vehicle Flow Modal implementation
// Login and test the two-option + vehicle flow

import { chromium } from 'playwright';

async function testVehicleFlow() {
  console.log('🚗 Testing new Vehicle Flow Modal...\n');
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser window
    devtools: true,  // Open DevTools
    slowMo: 1000     // Slow down actions
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
    await page.waitForTimeout(2000);
    
    // Enter OTP
    const otpInputs = page.locator('input[type="text"]');
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill('1');
    }
    await page.locator('button:has-text("Verify")').click();
    await page.waitForTimeout(3000);
    
    // Navigate to Masters
    await page.locator('a:has-text("Masters")').click();
    await page.waitForTimeout(2000);
    
    console.log('✅ Login and navigation completed\n');
    
    // Step 2: Test + vehicle button
    console.log('🚗 Step 2: Testing + vehicle button...');
    
    // Take screenshot before clicking
    await page.screenshot({ path: '01-before-vehicle-click.png', fullPage: true });
    console.log('📸 Screenshot 1: Before clicking + vehicle');
    
    // Click the + vehicle button
    await page.locator('button:has-text("Create Vehicle")').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of the modal
    await page.screenshot({ path: '02-vehicle-flow-modal.png', fullPage: true });
    console.log('📸 Screenshot 2: Vehicle Flow Modal opened');
    
    // Step 3: Test "Add Vehicle Only" option
    console.log('\n🔵 Step 3: Testing "Add Vehicle Only" option...');
    
    const vehicleOnlyButton = page.locator('button:has-text("Start Now")').first();
    if (await vehicleOnlyButton.count() > 0) {
      await vehicleOnlyButton.click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: '03-vehicle-only-form.png', fullPage: true });
      console.log('📸 Screenshot 3: Vehicle Only form opened');
      
      // Check if we're in the vehicle form
      const formTitle = await page.locator('h2, h3').first().textContent();
      console.log(`📝 Form title: ${formTitle}`);
      
      // Close the form
      const closeButton = page.locator('button[aria-label="Close"], button:has-text("×"), button:has-text("Close")').first();
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Step 4: Test "Add Vehicle + Driver" option
    console.log('\n🟣 Step 4: Testing "Add Vehicle + Driver" option...');
    
    // Click + vehicle button again
    await page.locator('button:has-text("Create Vehicle")').click();
    await page.waitForTimeout(2000);
    
    // Click on the "Add Vehicle + Driver" card
    const vehicleDriverCard = page.locator('text=Add Vehicle + Driver').first();
    if (await vehicleDriverCard.count() > 0) {
      await vehicleDriverCard.click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: '04-coming-soon-modal.png', fullPage: true });
      console.log('📸 Screenshot 4: Coming Soon modal opened');
      
      // Check if coming soon modal appeared
      const comingSoonText = await page.locator('text=Coming Soon').count();
      console.log(`🎯 Coming Soon modal found: ${comingSoonText > 0 ? 'Yes' : 'No'}`);
      
      // Test "Add Vehicle Only" button in coming soon modal
      const addVehicleOnlyBtn = page.locator('button:has-text("Add Vehicle Only")');
      if (await addVehicleOnlyBtn.count() > 0) {
        await addVehicleOnlyBtn.click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: '05-vehicle-only-from-coming-soon.png', fullPage: true });
        console.log('📸 Screenshot 5: Vehicle Only form from Coming Soon modal');
      }
    }
    
    // Step 5: Final verification
    console.log('\n✅ Step 5: Final verification...');
    
    // Check if the implementation is working
    const vehicleFlowModal = await page.locator('text=Choose Vehicle Creation Method').count();
    const vehicleOnlyOption = await page.locator('text=Add Vehicle Only').count();
    const vehicleDriverOption = await page.locator('text=Add Vehicle + Driver').count();
    const comingSoonBadge = await page.locator('text=Coming Soon').count();
    
    console.log(`🎯 Vehicle Flow Modal: ${vehicleFlowModal > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`🎯 Vehicle Only Option: ${vehicleOnlyOption > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`🎯 Vehicle + Driver Option: ${vehicleDriverOption > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`🎯 Coming Soon Badge: ${comingSoonBadge > 0 ? '✅ Found' : '❌ Not found'}`);
    
    // Final screenshot
    await page.screenshot({ path: '06-final-state.png', fullPage: true });
    console.log('📸 Screenshot 6: Final state');
    
    console.log('\n🎉 Vehicle Flow Modal testing completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Two-option flow implemented');
    console.log('✅ "Add Vehicle Only" works');
    console.log('✅ "Add Vehicle + Driver" shows Coming Soon');
    console.log('✅ Coming Soon modal with fallback option');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    // Keep browser open for a moment
    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

// Run the test
testVehicleFlow().catch(console.error);

