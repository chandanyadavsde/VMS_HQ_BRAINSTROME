// Test Vehicle Feature with Login
// Login with provided credentials and test the + vehicle functionality

import { chromium } from 'playwright';

async function testVehicleWithLogin() {
  console.log('🚗 Testing Vehicle Feature with Login...\n');
  
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
    
    // Step 2: Handle login process
    console.log('🔐 Step 2: Handling login process...');
    
    // Look for email input and continue button
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]');
    const continueButton = page.locator('button:has-text("Continue with Email"), button:has-text("Continue"), button[type="submit"]');
    
    if (await emailInput.count() > 0 && await continueButton.count() > 0) {
      console.log('✅ Found login form');
      
      // Enter email
      await emailInput.fill('chandan.yadav.sorigin.co');
      console.log('📧 Email entered');
      
      // Click continue
      await continueButton.click();
      console.log('➡️ Continue button clicked');
      
      // Wait for OTP input
      await page.waitForTimeout(2000);
      
      // Look for OTP input
      const otpInput = page.locator('input[type="text"], input[placeholder*="OTP"], input[placeholder*="otp"], input[placeholder*="code"]');
      
      if (await otpInput.count() > 0) {
        console.log('✅ Found OTP input');
        await otpInput.fill('111111');
        console.log('🔢 OTP entered');
        
        // Look for submit/verify button
        const submitButton = page.locator('button:has-text("Verify"), button:has-text("Submit"), button:has-text("Login"), button[type="submit"]');
        if (await submitButton.count() > 0) {
          await submitButton.click();
          console.log('✅ OTP submitted');
        }
      }
      
      // Wait for login to complete
      await page.waitForTimeout(3000);
      console.log('✅ Login process completed\n');
    } else {
      console.log('❌ Login form not found, checking if already logged in...');
    }
    
    // Step 3: Look for Masters page or navigation
    console.log('🔍 Step 3: Looking for Masters page...');
    
    // Take screenshot after login
    await page.screenshot({ path: 'after-login.png', fullPage: true });
    console.log('📸 Screenshot saved: after-login.png');
    
    // Look for Masters navigation or page
    const mastersSelectors = [
      'text=Masters',
      'text=masters',
      '[data-testid*="masters"]',
      'a:has-text("Masters")',
      'button:has-text("Masters")',
      '.masters',
      '#masters'
    ];
    
    let mastersFound = false;
    for (const selector of mastersSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found Masters navigation: ${selector} (${count} elements)`);
        mastersFound = true;
        
        // Click on Masters if it's a link/button
        if (selector.includes('a:') || selector.includes('button:')) {
          await page.locator(selector).first().click();
          await page.waitForTimeout(2000);
          console.log('🖱️ Clicked on Masters');
        }
        break;
      }
    }
    
    if (!mastersFound) {
      console.log('❌ Masters navigation not found. Looking for any navigation...');
      const navElements = await page.locator('nav, .nav, .navigation, .sidebar, .menu').count();
      console.log(`Found ${navElements} navigation elements`);
    }
    
    // Step 4: Look for + vehicle button
    console.log('\n🚗 Step 4: Looking for + vehicle functionality...');
    
    const vehicleSelectors = [
      'button:has-text("+ vehicle")',
      'button:has-text("+ Vehicle")',
      'button:has-text("Add Vehicle")',
      'button:has-text("Add vehicle")',
      'button:has-text("Vehicle Only")',
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
      console.log('Button texts found:', buttonTexts.slice(0, 15)); // Show first 15
    }
    
    // Step 5: Test the vehicle functionality if found
    if (vehicleButtonFound && vehicleButtonSelector) {
      console.log('\n🎭 Step 5: Testing + vehicle functionality...');
      
      try {
        // Click the + vehicle button
        await page.locator(vehicleButtonSelector).first().click();
        await page.waitForTimeout(2000);
        
        // Look for modal, form, or new page
        const modalSelectors = [
          '.modal',
          '[role="dialog"]',
          '.popup',
          '.overlay',
          '.form',
          '[data-testid*="modal"]',
          '[data-testid*="form"]',
          'text=Choose Creation Flow',
          'text=Vehicle Only',
          'text=Vehicle + Driver'
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
          await page.screenshot({ path: 'vehicle-modal-opened.png', fullPage: true });
          console.log('📸 Modal screenshot saved: vehicle-modal-opened.png');
          
          // Look for form fields
          const formFields = await page.locator('input, select, textarea').count();
          console.log(`📝 Found ${formFields} form fields`);
          
          // Look for flow selection options
          const flowOptions = await page.locator('text=Vehicle Only, text=Vehicle + Driver, text=Driver Only').count();
          console.log(`🔄 Found ${flowOptions} flow options`);
          
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
    
    // Step 6: Check for any vehicle-related content on the page
    console.log('\n🔍 Step 6: Looking for existing vehicle content...');
    
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
    
    // Step 7: Check console for any errors
    console.log('\n🐛 Step 7: Checking for console errors...');
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
    await page.screenshot({ path: 'final-masters-page.png', fullPage: true });
    console.log('\n📸 Final screenshot saved: final-masters-page.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 Vehicle feature testing with login completed!');
}

// Run the test
testVehicleWithLogin().catch(console.error);

