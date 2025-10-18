// Direct Browser Testing with Screenshots
// Open your app, login, and test + vehicle functionality

import { chromium } from 'playwright';

async function testDirectBrowser() {
  console.log('🌐 Opening your app directly in browser...\n');
  
  const browser = await chromium.launch({ 
    headless: false, // Show browser window
    devtools: true,  // Open DevTools
    slowMo: 1000     // Slow down actions so you can see them
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to your app
    console.log('📍 Step 1: Opening your Vite app...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: '01-initial-page.png', fullPage: true });
    console.log('📸 Screenshot 1: Initial page saved');
    
    // Step 2: Login process
    console.log('\n🔐 Step 2: Starting login process...');
    
    // Find email input
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]');
    if (await emailInput.count() > 0) {
      console.log('✅ Found email input');
      await emailInput.fill('chandan.yadav@sorigin.co');
      console.log('📧 Email entered: chandan.yadav@sorigin.co');
      
      // Take screenshot after email
      await page.screenshot({ path: '02-email-entered.png', fullPage: true });
      console.log('📸 Screenshot 2: Email entered');
      
      // Click continue button
      const continueButton = page.locator('button:has-text("Continue with Email"), button:has-text("Continue"), button[type="submit"]');
      if (await continueButton.count() > 0) {
        await continueButton.click();
        console.log('➡️ Continue button clicked');
        
        // Wait for OTP screen
        await page.waitForTimeout(3000);
        
        // Take screenshot of OTP screen
        await page.screenshot({ path: '03-otp-screen.png', fullPage: true });
        console.log('📸 Screenshot 3: OTP screen');
        
        // Find OTP inputs (6 individual inputs)
        const otpInputs = page.locator('input[type="text"], input[placeholder*="OTP"], input[placeholder*="otp"], input[placeholder*="code"]');
        const otpCount = await otpInputs.count();
        console.log(`🔢 Found ${otpCount} OTP input fields`);
        
        if (otpCount >= 6) {
          // Fill OTP inputs
          for (let i = 0; i < 6; i++) {
            await otpInputs.nth(i).fill('1');
            await page.waitForTimeout(200);
          }
          console.log('🔢 OTP entered: 111111');
          
          // Take screenshot after OTP
          await page.screenshot({ path: '04-otp-entered.png', fullPage: true });
          console.log('📸 Screenshot 4: OTP entered');
          
          // Find and click verify/submit button
          const verifyButton = page.locator('button:has-text("Verify"), button:has-text("Submit"), button:has-text("Login"), button[type="submit"]');
          if (await verifyButton.count() > 0) {
            await verifyButton.click();
            console.log('✅ Verify button clicked');
            
            // Wait for login to complete
            await page.waitForTimeout(5000);
            
            // Take screenshot after login
            await page.screenshot({ path: '05-after-login.png', fullPage: true });
            console.log('📸 Screenshot 5: After login');
          }
        } else if (otpCount === 1) {
          // Single OTP input
          await otpInputs.fill('111111');
          console.log('🔢 OTP entered in single field: 111111');
          
          const verifyButton = page.locator('button:has-text("Verify"), button:has-text("Submit"), button:has-text("Login"), button[type="submit"]');
          if (await verifyButton.count() > 0) {
            await verifyButton.click();
            console.log('✅ Verify button clicked');
            await page.waitForTimeout(5000);
            await page.screenshot({ path: '05-after-login.png', fullPage: true });
            console.log('📸 Screenshot 5: After login');
          }
        }
      }
    }
    
    // Step 3: Look for Masters page
    console.log('\n🔍 Step 3: Looking for Masters page...');
    
    // Look for Masters navigation
    const mastersLink = page.locator('a:has-text("Masters"), button:has-text("Masters"), [data-testid*="masters"]');
    if (await mastersLink.count() > 0) {
      console.log('✅ Found Masters navigation');
      await mastersLink.first().click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: '06-masters-page.png', fullPage: true });
      console.log('📸 Screenshot 6: Masters page');
    } else {
      console.log('❌ Masters navigation not found');
    }
    
    // Step 4: Look for + vehicle button
    console.log('\n🚗 Step 4: Looking for + vehicle functionality...');
    
    const vehicleButtons = [
      'button:has-text("+ vehicle")',
      'button:has-text("+ Vehicle")',
      'button:has-text("Add Vehicle")',
      'button:has-text("Vehicle Only")',
      'button:has-text("Vehicle + Driver")',
      '[data-testid*="add-vehicle"]',
      'button:has-text("+")'
    ];
    
    let vehicleButtonFound = false;
    for (const selector of vehicleButtons) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found vehicle button: ${selector} (${count} elements)`);
        vehicleButtonFound = true;
        
        // Click the button
        await page.locator(selector).first().click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ path: '07-vehicle-modal.png', fullPage: true });
        console.log('📸 Screenshot 7: Vehicle modal opened');
        break;
      }
    }
    
    if (!vehicleButtonFound) {
      console.log('❌ No vehicle button found');
      
      // List all buttons on the page
      const allButtons = await page.locator('button').allTextContents();
      console.log('All buttons found:', allButtons);
    }
    
    // Step 5: Check current URL and page content
    console.log('\n📍 Step 5: Current page info...');
    const currentUrl = page.url();
    const pageTitle = await page.title();
    console.log(`Current URL: ${currentUrl}`);
    console.log(`Page Title: ${pageTitle}`);
    
    // Final comprehensive screenshot
    await page.screenshot({ path: '08-final-page.png', fullPage: true });
    console.log('📸 Screenshot 8: Final page state');
    
    console.log('\n🎉 Browser testing completed! Check the screenshots to see what happened.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    // Keep browser open for a moment so you can see it
    console.log('\n⏳ Keeping browser open for 10 seconds so you can see the result...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

// Run the test
testDirectBrowser().catch(console.error);

