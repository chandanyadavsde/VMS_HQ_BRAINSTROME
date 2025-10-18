// Smart LegalModal Testing Script
// This script will test your LegalModal component using browser automation

import { chromium } from 'playwright';

async function testLegalModal() {
  console.log('🚀 Starting LegalModal Smart Testing...\n');
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false, // Set to true for headless mode
    devtools: true   // Open DevTools for debugging
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to your Vite app
    console.log('📍 Step 1: Navigating to Vite app...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    console.log('✅ Vite app loaded successfully\n');
    
    // Step 2: Check if LegalModal is present in the DOM
    console.log('🔍 Step 2: Checking for LegalModal component...');
    const modalExists = await page.locator('[data-testid="legal-modal"]').count() > 0;
    console.log(`LegalModal found: ${modalExists ? '✅ Yes' : '❌ No'}\n`);
    
    // Step 3: Test API endpoints
    console.log('🌐 Step 3: Testing API endpoints...');
    
    // Test Privacy Policy API
    try {
      const privacyResponse = await page.request.get('http://localhost:5000/legal/privacy-policy');
      console.log(`Privacy Policy API: ${privacyResponse.status() === 200 ? '✅ Working' : '❌ Failed'}`);
    } catch (error) {
      console.log('❌ Privacy Policy API: Not accessible');
    }
    
    // Test Terms of Service API
    try {
      const termsResponse = await page.request.get('http://localhost:5000/legal/terms-of-service');
      console.log(`Terms of Service API: ${termsResponse.status() === 200 ? '✅ Working' : '❌ Failed'}`);
    } catch (error) {
      console.log('❌ Terms of Service API: Not accessible');
    }
    
    // Step 4: Look for buttons/triggers to open the modal
    console.log('\n🔘 Step 4: Looking for modal triggers...');
    
    // Common selectors for legal modal triggers
    const possibleTriggers = [
      'button:has-text("Privacy Policy")',
      'button:has-text("Terms of Service")',
      'a:has-text("Privacy")',
      'a:has-text("Terms")',
      '[data-testid*="legal"]',
      '[data-testid*="privacy"]',
      '[data-testid*="terms"]'
    ];
    
    let triggerFound = false;
    for (const selector of possibleTriggers) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Found trigger: ${selector} (${count} elements)`);
        triggerFound = true;
      }
    }
    
    if (!triggerFound) {
      console.log('❌ No modal triggers found. Looking for any buttons...');
      const allButtons = await page.locator('button').count();
      console.log(`Found ${allButtons} buttons on the page`);
    }
    
    // Step 5: Test modal functionality if triggers exist
    if (triggerFound) {
      console.log('\n🎭 Step 5: Testing modal functionality...');
      
      // Try to click the first privacy policy trigger
      try {
        await page.locator('button:has-text("Privacy Policy")').first().click();
        await page.waitForTimeout(1000);
        
        // Check if modal opened
        const modalVisible = await page.locator('.fixed.inset-0').isVisible();
        console.log(`Modal opened: ${modalVisible ? '✅ Yes' : '❌ No'}`);
        
        if (modalVisible) {
          // Check for loading state
          const loadingVisible = await page.locator('text=Loading...').isVisible();
          console.log(`Loading state: ${loadingVisible ? '⏳ Yes' : '✅ No'}`);
          
          // Wait for content to load
          await page.waitForTimeout(2000);
          
          // Check for error state
          const errorVisible = await page.locator('text=Error Loading Content').isVisible();
          console.log(`Error state: ${errorVisible ? '❌ Yes' : '✅ No'}`);
          
          // Check for content
          const contentVisible = await page.locator('.prose').isVisible();
          console.log(`Content loaded: ${contentVisible ? '✅ Yes' : '❌ No'}`);
          
          // Try to close modal
          const closeButton = page.locator('button[aria-label="Close"], button:has-text("×"), button:has-text("Close")');
          if (await closeButton.count() > 0) {
            await closeButton.first().click();
            console.log('✅ Modal closed successfully');
          }
        }
      } catch (error) {
        console.log(`❌ Error testing modal: ${error.message}`);
      }
    }
    
    // Step 6: Check console for errors
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
    
    // Step 7: Take a screenshot for debugging
    console.log('\n📸 Step 7: Taking screenshot...');
    await page.screenshot({ path: 'legal-modal-test.png', fullPage: true });
    console.log('✅ Screenshot saved as legal-modal-test.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n🎉 LegalModal testing completed!');
}

// Run the test
testLegalModal().catch(console.error);
