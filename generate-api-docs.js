// API Documentation Generator
// Creates Swagger/OpenAPI documentation from your working APIs

import { chromium } from 'playwright';
import fs from 'fs';

class APIDocumentationGenerator {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.openAPISpec = {
      openapi: '3.0.0',
      info: {
        title: 'Legal Content API',
        description: 'API for serving legal content (Privacy Policy, Terms of Service)',
        version: '1.0.0',
        contact: {
          name: 'Sorigin Group',
          email: 'contact@sorigin.com'
        }
      },
      servers: [
        {
          url: this.baseURL,
          description: 'Development server'
        }
      ],
      paths: {},
      components: {
        schemas: {}
      }
    };
  }

  async analyzeAPIEndpoint(endpoint, method = 'GET') {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      const response = await page.request.get(`${this.baseURL}${endpoint}`);
      const data = await response.json();
      
      return {
        status: response.status(),
        headers: response.headers(),
        data: data,
        responseTime: Date.now() - Date.now() // Placeholder for actual timing
      };
    } finally {
      await browser.close();
    }
  }

  generateSchemaFromData(data, name) {
    const schema = {
      type: 'object',
      properties: {}
    };

    if (data && typeof data === 'object') {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          schema.properties[key] = { type: 'string' };
        } else if (typeof value === 'number') {
          schema.properties[key] = { type: 'number' };
        } else if (typeof value === 'boolean') {
          schema.properties[key] = { type: 'boolean' };
        } else if (Array.isArray(value)) {
          schema.properties[key] = { 
            type: 'array',
            items: { type: 'string' }
          };
        } else if (typeof value === 'object') {
          schema.properties[key] = this.generateSchemaFromData(value, `${name}_${key}`);
        }
      }
    }

    return schema;
  }

  async generateDocumentation() {
    console.log('📚 Generating API Documentation...\n');

    // Analyze Privacy Policy endpoint
    console.log('🔍 Analyzing Privacy Policy endpoint...');
    const privacyData = await this.analyzeAPIEndpoint('/legal/privacy-policy');
    
    this.openAPISpec.paths['/legal/privacy-policy'] = {
      get: {
        summary: 'Get Privacy Policy',
        description: 'Retrieves the privacy policy content',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LegalContentResponse'
                },
                example: privacyData.data
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    };

    // Analyze Terms of Service endpoint
    console.log('🔍 Analyzing Terms of Service endpoint...');
    const termsData = await this.analyzeAPIEndpoint('/legal/terms-of-service');
    
    this.openAPISpec.paths['/legal/terms-of-service'] = {
      get: {
        summary: 'Get Terms of Service',
        description: 'Retrieves the terms of service content',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LegalContentResponse'
                },
                example: termsData.data
              }
            }
          },
          '500': {
            description: 'Server error'
          }
        }
      }
    };

    // Generate schemas
    this.openAPISpec.components.schemas.LegalContentResponse = {
      type: 'object',
      required: ['success', 'data'],
      properties: {
        success: {
          type: 'boolean',
          description: 'Indicates if the request was successful'
        },
        data: {
          $ref: '#/components/schemas/LegalContent'
        }
      }
    };

    this.openAPISpec.components.schemas.LegalContent = {
      type: 'object',
      required: ['title', 'content'],
      properties: {
        title: {
          type: 'string',
          description: 'Title of the legal document'
        },
        company: {
          type: 'string',
          description: 'Company name'
        },
        lastUpdated: {
          type: 'string',
          description: 'Last updated date'
        },
        content: {
          $ref: '#/components/schemas/LegalContentData'
        }
      }
    };

    this.openAPISpec.components.schemas.LegalContentData = {
      type: 'object',
      required: ['introduction'],
      properties: {
        introduction: {
          type: 'string',
          description: 'Introduction text'
        },
        informationWeCollect: {
          $ref: '#/components/schemas/LegalSection'
        },
        howWeUseInformation: {
          $ref: '#/components/schemas/LegalSection'
        },
        informationSharing: {
          $ref: '#/components/schemas/LegalSection'
        },
        dataSecurity: {
          $ref: '#/components/schemas/LegalSection'
        },
        dataRetention: {
          $ref: '#/components/schemas/LegalSection'
        },
        yourRights: {
          $ref: '#/components/schemas/LegalSection'
        },
        contactInformation: {
          $ref: '#/components/schemas/LegalSection'
        }
      }
    };

    this.openAPISpec.components.schemas.LegalSection = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Section title'
        },
        description: {
          type: 'string',
          description: 'Section description'
        },
        purposes: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of purposes'
        },
        circumstances: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of circumstances'
        },
        restrictions: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of restrictions'
        },
        responsibilities: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of responsibilities'
        },
        services: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of services'
        },
        rights: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of rights'
        },
        personalInformation: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of personal information types'
        },
        usageInformation: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of usage information types'
        },
        contact: {
          $ref: '#/components/schemas/ContactInfo'
        }
      }
    };

    this.openAPISpec.components.schemas.ContactInfo = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Contact email'
        },
        phone: {
          type: 'string',
          description: 'Contact phone number'
        },
        address: {
          type: 'string',
          description: 'Contact address'
        }
      }
    };

    // Save the documentation
    const outputFile = 'api-documentation.json';
    fs.writeFileSync(outputFile, JSON.stringify(this.openAPISpec, null, 2));
    
    console.log(`\n✅ API Documentation generated: ${outputFile}`);
    console.log(`📊 Documented ${Object.keys(this.openAPISpec.paths).length} endpoints`);
    console.log(`📋 Generated ${Object.keys(this.openAPISpec.components.schemas).length} schemas`);
    
    return this.openAPISpec;
  }
}

// Generate the documentation
const generator = new APIDocumentationGenerator();
generator.generateDocumentation().catch(console.error);
