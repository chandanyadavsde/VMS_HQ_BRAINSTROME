// Comprehensive API Testing Suite
// Tests your backend APIs with detailed validation

import { chromium } from 'playwright';

class APITester {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runTest(testName, testFunction) {
    console.log(`\n🧪 Running: ${testName}`);
    try {
      await testFunction();
      this.results.passed++;
      this.results.tests.push({ name: testName, status: 'PASS', error: null });
      console.log(`✅ ${testName}: PASSED`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name: testName, status: 'FAIL', error: error.message });
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
    }
  }

  async testAPIEndpoint(endpoint, expectedStatus = 200) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const response = await page.request.get(`${this.baseURL}${endpoint}`);
      
      if (response.status() !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${response.status()}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Response is not a valid JSON object');
      }

      return data;
    } finally {
      await browser.close();
    }
  }

  async testLegalEndpoints() {
    // Test Privacy Policy endpoint
    await this.runTest('Privacy Policy API', async () => {
      const data = await this.testAPIEndpoint('/legal/privacy-policy');
      
      // Validate required fields
      if (!data.success) {
        throw new Error('API returned success: false');
      }
      
      if (!data.data) {
        throw new Error('Missing data field in response');
      }

      if (!data.data.title) {
        throw new Error('Missing title in data');
      }

      if (!data.data.content) {
        throw new Error('Missing content in data');
      }

      console.log(`   📄 Title: ${data.data.title}`);
      console.log(`   🏢 Company: ${data.data.company || 'N/A'}`);
      console.log(`   📅 Last Updated: ${data.data.lastUpdated || 'N/A'}`);
    });

    // Test Terms of Service endpoint
    await this.runTest('Terms of Service API', async () => {
      const data = await this.testAPIEndpoint('/legal/terms-of-service');
      
      // Validate required fields
      if (!data.success) {
        throw new Error('API returned success: false');
      }
      
      if (!data.data) {
        throw new Error('Missing data field in response');
      }

      if (!data.data.title) {
        throw new Error('Missing title in data');
      }

      if (!data.data.content) {
        throw new Error('Missing content in data');
      }

      console.log(`   📄 Title: ${data.data.title}`);
      console.log(`   🏢 Company: ${data.data.company || 'N/A'}`);
      console.log(`   📅 Last Updated: ${data.data.lastUpdated || 'N/A'}`);
    });
  }

  async testErrorHandling() {
    // Test non-existent endpoint
    await this.runTest('404 Error Handling', async () => {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        const response = await page.request.get(`${this.baseURL}/legal/non-existent`);
        
        if (response.status() !== 404) {
          throw new Error(`Expected 404, got ${response.status()}`);
        }
      } finally {
        await browser.close();
      }
    });
  }

  async testPerformance() {
    await this.runTest('API Performance', async () => {
      const startTime = Date.now();
      await this.testAPIEndpoint('/legal/privacy-policy');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      console.log(`   ⏱️ Response time: ${responseTime}ms`);
      
      if (responseTime > 5000) {
        throw new Error(`Response time too slow: ${responseTime}ms`);
      }
    });
  }

  async testDataStructure() {
    await this.runTest('Data Structure Validation', async () => {
      const data = await this.testAPIEndpoint('/legal/privacy-policy');
      
      // Check if content has expected structure
      const content = data.data.content;
      
      if (!content.introduction) {
        throw new Error('Missing introduction in content');
      }

      // Check if content has sections
      const sections = Object.keys(content).filter(key => key !== 'introduction');
      if (sections.length === 0) {
        throw new Error('No content sections found');
      }

      console.log(`   📋 Found ${sections.length} content sections`);
      console.log(`   📝 Sections: ${sections.join(', ')}`);
    });
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive API Testing Suite...\n');
    console.log(`🎯 Testing backend at: ${this.baseURL}\n`);

    await this.testLegalEndpoints();
    await this.testErrorHandling();
    await this.testPerformance();
    await this.testDataStructure();

    // Print summary
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(`   - ${test.name}: ${test.error}`));
    }

    return this.results;
  }
}

// Run the tests
const tester = new APITester();
tester.runAllTests().catch(console.error);

