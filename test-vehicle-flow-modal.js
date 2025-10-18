// Test VehicleFlowModal component in isolation
import { chromium } from 'playwright';

async function testVehicleFlowModal() {
  console.log('🧪 Testing VehicleFlowModal component...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true,
    slowMo: 2000
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Create a simple test page with our modal
    const testHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test VehicleFlowModal</title>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/framer-motion@10/dist/framer-motion.js"></script>
      <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div id="root"></div>
      <script>
        // Simple test to see if our modal would work
        const { useState } = React;
        
        function TestModal() {
          const [isOpen, setIsOpen] = useState(true);
          
          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Choose Vehicle Creation Method
                </h2>
                <p className="text-gray-600 mb-6">
                  Select how you want to add your vehicle
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl border-2 bg-blue-50 border-blue-200">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white mb-4">
                      🚗
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Add Vehicle Only
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add a new vehicle with optional driver assignment
                    </p>
                    <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                      Start Now
                    </button>
                  </div>
                  
                  <div className="p-6 rounded-2xl border-2 bg-purple-50 border-purple-200 opacity-75">
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Coming Soon
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4">
                      🔗
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Add Vehicle + Driver
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create both vehicle and driver in one flow
                    </p>
                    <button className="px-6 py-3 rounded-xl font-semibold bg-gray-300 text-gray-500 cursor-not-allowed" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          );
        }
        
        ReactDOM.render(React.createElement(TestModal), document.getElementById('root'));
      </script>
    </body>
    </html>
    `;
    
    await page.setContent(testHTML);
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-modal-isolation.png', fullPage: true });
    console.log('📸 Test modal screenshot saved');
    
    // Check if our modal content is visible
    const modalTitle = await page.locator('text=Choose Vehicle Creation Method').count();
    const vehicleOnly = await page.locator('text=Add Vehicle Only').count();
    const vehicleDriver = await page.locator('text=Add Vehicle + Driver').count();
    const comingSoon = await page.locator('text=Coming Soon').count();
    
    console.log('\n🎯 Modal Content Check:');
    console.log(`Modal Title: ${modalTitle > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Vehicle Only: ${vehicleOnly > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Vehicle + Driver: ${vehicleDriver > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`Coming Soon Badge: ${comingSoon > 0 ? '✅ Found' : '❌ Not found'}`);
    
    if (modalTitle > 0) {
      console.log('\n✅ Modal design works! The issue is in the React app integration.');
    }
    
    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testVehicleFlowModal().catch(console.error);

