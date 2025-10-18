// Debug what modal is actually opening
import { chromium } from 'playwright';

async function debugModal() {
  console.log('🔍 Debugging modal issue...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true,
    slowMo: 2000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate and login
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('chandan.yadav@sorigin.co');
    await page.locator('button:has-text("Continue with Email")').click();
    await page.waitForTimeout(3000);
    
    const otpInputs = page.locator('input[type="text"]');
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill('1');
    }
    await page.locator('button:has-text("Verify")').click();
    await page.waitForTimeout(5000);
    
    await page.locator('button:has-text("Masters")').click();
    await page.waitForTimeout(3000);
    
    console.log('✅ Login completed\n');
    
    // Click + vehicle button
    await page.locator('button:has-text("+ vehicle")').click();
    await page.waitForTimeout(3000);
    
    // Check what modal opened
    console.log('🔍 Checking modal content...');
    
    // Look for any modal text
    const allTexts = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    console.log('All headings found:', allTexts);
    
    // Look for specific modal content
    const modalTexts = [
      'Choose Vehicle Creation Method',
      'Choose Creation Flow',
      'Add Vehicle Only',
      'Add Vehicle + Driver',
      'Vehicle + Driver',
      'Vehicle Only',
      'Driver Only'
    ];
    
    for (const text of modalTexts) {
      const count = await page.locator(`text=${text}`).count();
      console.log(`${text}: ${count > 0 ? '✅ Found' : '❌ Not found'}`);
    }
    
    // Check if our new modal component is rendered
    const vehicleFlowModal = await page.locator('[data-testid="vehicle-flow-modal"]').count();
    console.log(`VehicleFlowModal component: ${vehicleFlowModal > 0 ? '✅ Found' : '❌ Not found'}`);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-modal.png', fullPage: true });
    console.log('📸 Debug screenshot saved');
    
    // Check console for errors
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });
    
    const errors = logs.filter(log => log.type === 'error');
    if (errors.length > 0) {
      console.log(`\n❌ Console errors found:`);
      errors.forEach(error => console.log(`  - ${error.message}`));
    }
    
    console.log('\n⏳ Keeping browser open for 15 seconds...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugModal().catch(console.error);

