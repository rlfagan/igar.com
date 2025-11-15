import pool from './index';
import dotenv from 'dotenv';

dotenv.config();

const seedData = {
  // Common AI Model Options
  commonModels: [
    // OpenAI Models
    { name: 'GPT-4', vendor: 'OpenAI', type: 'llm', version: 'gpt-4', category: 'vendor' },
    { name: 'GPT-4 Turbo', vendor: 'OpenAI', type: 'llm', version: 'gpt-4-turbo', category: 'vendor' },
    { name: 'GPT-3.5 Turbo', vendor: 'OpenAI', type: 'llm', version: 'gpt-3.5-turbo', category: 'vendor' },
    { name: 'text-embedding-3-large', vendor: 'OpenAI', type: 'embedding', version: 'text-embedding-3-large', category: 'vendor' },
    { name: 'text-embedding-3-small', vendor: 'OpenAI', type: 'embedding', version: 'text-embedding-3-small', category: 'vendor' },
    { name: 'DALL-E 3', vendor: 'OpenAI', type: 'vision', version: 'dall-e-3', category: 'vendor' },

    // Anthropic Models
    { name: 'Claude 3.5 Sonnet', vendor: 'Anthropic', type: 'llm', version: 'claude-3-5-sonnet-20241022', category: 'vendor' },
    { name: 'Claude 3 Opus', vendor: 'Anthropic', type: 'llm', version: 'claude-3-opus-20240229', category: 'vendor' },
    { name: 'Claude 3 Sonnet', vendor: 'Anthropic', type: 'llm', version: 'claude-3-sonnet-20240229', category: 'vendor' },
    { name: 'Claude 3 Haiku', vendor: 'Anthropic', type: 'llm', version: 'claude-3-haiku-20240307', category: 'vendor' },

    // Google Models
    { name: 'Gemini Pro', vendor: 'Google', type: 'llm', version: 'gemini-pro', category: 'vendor' },
    { name: 'Gemini Pro Vision', vendor: 'Google', type: 'multimodal', version: 'gemini-pro-vision', category: 'vendor' },
    { name: 'PaLM 2', vendor: 'Google', type: 'llm', version: 'text-bison-001', category: 'vendor' },
    { name: 'Vertex AI Vision', vendor: 'Google', type: 'vision', version: 'imagetext@001', category: 'vendor' },

    // Meta/Llama Models
    { name: 'Llama 2 7B', vendor: 'Meta', type: 'llm', version: 'llama-2-7b', category: 'open_source' },
    { name: 'Llama 2 13B', vendor: 'Meta', type: 'llm', version: 'llama-2-13b', category: 'open_source' },
    { name: 'Llama 2 70B', vendor: 'Meta', type: 'llm', version: 'llama-2-70b', category: 'open_source' },
    { name: 'Llama 3 8B', vendor: 'Meta', type: 'llm', version: 'llama-3-8b', category: 'open_source' },
    { name: 'Llama 3 70B', vendor: 'Meta', type: 'llm', version: 'llama-3-70b', category: 'open_source' },

    // Mistral Models
    { name: 'Mistral 7B', vendor: 'Mistral AI', type: 'llm', version: 'mistral-7b-v0.1', category: 'open_source' },
    { name: 'Mixtral 8x7B', vendor: 'Mistral AI', type: 'llm', version: 'mixtral-8x7b', category: 'open_source' },
    { name: 'Mistral Large', vendor: 'Mistral AI', type: 'llm', version: 'mistral-large-latest', category: 'vendor' },

    // Cohere Models
    { name: 'Command', vendor: 'Cohere', type: 'llm', version: 'command', category: 'vendor' },
    { name: 'Command Light', vendor: 'Cohere', type: 'llm', version: 'command-light', category: 'vendor' },
    { name: 'Embed v3', vendor: 'Cohere', type: 'embedding', version: 'embed-english-v3.0', category: 'vendor' },

    // Amazon Bedrock Models
    { name: 'Amazon Titan Text', vendor: 'AWS', type: 'llm', version: 'amazon.titan-text-express-v1', category: 'vendor' },
    { name: 'Amazon Titan Embeddings', vendor: 'AWS', type: 'embedding', version: 'amazon.titan-embed-text-v1', category: 'vendor' },

    // Hugging Face Popular Models
    { name: 'BERT Base', vendor: 'Hugging Face', type: 'classification', version: 'bert-base-uncased', category: 'open_source' },
    { name: 'RoBERTa Large', vendor: 'Hugging Face', type: 'classification', version: 'roberta-large', category: 'open_source' },
    { name: 'T5 Base', vendor: 'Hugging Face', type: 'llm', version: 't5-base', category: 'open_source' },
    { name: 'CLIP', vendor: 'OpenAI', type: 'multimodal', version: 'clip-vit-base-patch32', category: 'open_source' },

    // Fraud Detection Models
    { name: 'XGBoost Fraud Detection', vendor: 'Open Source', type: 'fraud_detection', version: 'custom', category: 'open_source' },
    { name: 'Random Forest Fraud', vendor: 'Scikit-learn', type: 'fraud_detection', version: 'custom', category: 'open_source' },

    // Recommendation Models
    { name: 'Neural Collaborative Filtering', vendor: 'Open Source', type: 'recommendation', version: 'ncf-v1', category: 'open_source' },
    { name: 'Deep Factorization Machine', vendor: 'Open Source', type: 'recommendation', version: 'deepfm', category: 'open_source' },
  ],

  // Common Vendors
  vendors: [
    { name: 'OpenAI', description: 'AI research and deployment company', industry: 'AI/ML', website: 'https://openai.com' },
    { name: 'Anthropic', description: 'AI safety and research company', industry: 'AI/ML', website: 'https://anthropic.com' },
    { name: 'Google', description: 'Google Cloud AI and Vertex AI', industry: 'Cloud/AI', website: 'https://cloud.google.com/vertex-ai' },
    { name: 'Microsoft Azure', description: 'Azure OpenAI and Cognitive Services', industry: 'Cloud/AI', website: 'https://azure.microsoft.com' },
    { name: 'AWS', description: 'Amazon Bedrock and SageMaker', industry: 'Cloud/AI', website: 'https://aws.amazon.com/bedrock' },
    { name: 'Meta', description: 'Llama models and AI research', industry: 'AI/ML', website: 'https://ai.meta.com' },
    { name: 'Mistral AI', description: 'Open and commercial LLMs', industry: 'AI/ML', website: 'https://mistral.ai' },
    { name: 'Cohere', description: 'Enterprise NLP platform', industry: 'AI/ML', website: 'https://cohere.com' },
    { name: 'Hugging Face', description: 'Open source ML platform', industry: 'AI/ML', website: 'https://huggingface.co' },
    { name: 'Scale AI', description: 'Data labeling and ML ops', industry: 'AI/ML', website: 'https://scale.com' },
    { name: 'DataRobot', description: 'Automated ML platform', industry: 'AI/ML', website: 'https://datarobot.com' },
    { name: 'H2O.ai', description: 'Open source ML platform', industry: 'AI/ML', website: 'https://h2o.ai' },
  ],

  // Common Use Cases
  useCases: [
    { name: 'Customer Service Chatbot', category: 'Customer Support', risk_level: 'medium' },
    { name: 'Document Processing & Extraction', category: 'Document AI', risk_level: 'medium' },
    { name: 'Fraud Detection', category: 'Risk Management', risk_level: 'high' },
    { name: 'Credit Risk Scoring', category: 'Lending', risk_level: 'high' },
    { name: 'KYC/Identity Verification', category: 'Compliance', risk_level: 'high' },
    { name: 'AML Transaction Monitoring', category: 'Compliance', risk_level: 'high' },
    { name: 'Content Moderation', category: 'Safety', risk_level: 'high' },
    { name: 'Sentiment Analysis', category: 'Analytics', risk_level: 'low' },
    { name: 'Product Recommendations', category: 'Personalization', risk_level: 'medium' },
    { name: 'Code Generation/Copilot', category: 'Developer Tools', risk_level: 'low' },
    { name: 'Email Classification', category: 'Productivity', risk_level: 'low' },
    { name: 'Contract Analysis', category: 'Legal Tech', risk_level: 'high' },
    { name: 'Market Research & Analysis', category: 'Analytics', risk_level: 'low' },
    { name: 'HR Resume Screening', category: 'Human Resources', risk_level: 'high' },
    { name: 'Medical Diagnosis Support', category: 'Healthcare', risk_level: 'critical' },
  ],

  // Common Data Sources
  dataSources: [
    { name: 'Internal Customer Database', sensitivity: 'high', pii: true },
    { name: 'Transaction History', sensitivity: 'high', pii: true },
    { name: 'Customer Support Tickets', sensitivity: 'medium', pii: true },
    { name: 'Public Web Data', sensitivity: 'low', pii: false },
    { name: 'Product Catalog', sensitivity: 'low', pii: false },
    { name: 'User Behavior Logs', sensitivity: 'medium', pii: true },
    { name: 'Financial Statements', sensitivity: 'high', pii: false },
    { name: 'Synthetic/Generated Data', sensitivity: 'low', pii: false },
    { name: 'Third-Party Data Feeds', sensitivity: 'medium', pii: false },
    { name: 'Social Media Data', sensitivity: 'medium', pii: true },
    { name: 'Email Communications', sensitivity: 'high', pii: true },
    { name: 'Call Center Recordings', sensitivity: 'high', pii: true },
    { name: 'Application Forms', sensitivity: 'high', pii: true },
    { name: 'Contract Documents', sensitivity: 'high', pii: true },
  ],

  // Deployment Platforms
  deploymentPlatforms: [
    { name: 'AWS SageMaker', provider: 'AWS', type: 'cloud_gpu' },
    { name: 'Google Vertex AI', provider: 'Google Cloud', type: 'cloud_gpu' },
    { name: 'Azure ML', provider: 'Microsoft Azure', type: 'cloud_gpu' },
    { name: 'Kubernetes (EKS)', provider: 'AWS', type: 'kubernetes' },
    { name: 'Kubernetes (GKE)', provider: 'Google Cloud', type: 'kubernetes' },
    { name: 'Kubernetes (AKS)', provider: 'Microsoft Azure', type: 'kubernetes' },
    { name: 'AWS Lambda', provider: 'AWS', type: 'serverless_api' },
    { name: 'Google Cloud Functions', provider: 'Google Cloud', type: 'serverless_api' },
    { name: 'Azure Functions', provider: 'Microsoft Azure', type: 'serverless_api' },
    { name: 'On-Premise GPU Cluster', provider: 'Self-Hosted', type: 'on_prem_gpu' },
    { name: 'OpenAI API', provider: 'OpenAI', type: 'vendor_hosted' },
    { name: 'Anthropic API', provider: 'Anthropic', type: 'vendor_hosted' },
    { name: 'Hugging Face Inference API', provider: 'Hugging Face', type: 'vendor_hosted' },
  ],

  // Common Safety Features
  safetyFeatures: [
    { name: 'Input Validation', description: 'Validate and sanitize all inputs', category: 'Input Security' },
    { name: 'Output Filtering', description: 'Filter harmful or inappropriate outputs', category: 'Output Security' },
    { name: 'Prompt Guardrails', description: 'Prevent prompt injection attacks', category: 'Prompt Security' },
    { name: 'Safety Classifier', description: 'Classify content for safety', category: 'Content Safety' },
    { name: 'Rate Limiting', description: 'Limit API request rates', category: 'Availability' },
    { name: 'PII Redaction', description: 'Automatically redact sensitive information', category: 'Privacy' },
    { name: 'Bias Monitoring', description: 'Monitor for biased outputs', category: 'Fairness' },
    { name: 'Audit Logging', description: 'Log all model interactions', category: 'Compliance' },
    { name: 'Human Review Queue', description: 'Queue uncertain outputs for review', category: 'Quality' },
    { name: 'Explainability Tools', description: 'Provide model decision explanations', category: 'Transparency' },
    { name: 'Model Versioning', description: 'Track model versions and rollbacks', category: 'Operations' },
    { name: 'A/B Testing', description: 'Test models before full deployment', category: 'Quality' },
  ],

  // Regulatory Frameworks
  regulatoryFrameworks: [
    { name: 'ECOA (Equal Credit Opportunity Act)', description: 'Prohibits credit discrimination', applies_to: ['credit', 'lending'] },
    { name: 'Regulation B', description: 'Implements ECOA requirements', applies_to: ['credit', 'lending'] },
    { name: 'Fair Credit Reporting Act (FCRA)', description: 'Regulates consumer credit information', applies_to: ['credit', 'background_checks'] },
    { name: 'FFIEC Guidance', description: 'Federal Financial Institutions Examination Council guidance', applies_to: ['banking', 'finance'] },
    { name: 'AML/BSA', description: 'Anti-Money Laundering and Bank Secrecy Act', applies_to: ['banking', 'finance'] },
    { name: 'KYC/CIP', description: 'Know Your Customer / Customer Identification Program', applies_to: ['banking', 'finance'] },
    { name: 'GDPR', description: 'General Data Protection Regulation (EU)', applies_to: ['data_privacy'] },
    { name: 'CCPA', description: 'California Consumer Privacy Act', applies_to: ['data_privacy'] },
    { name: 'GLBA', description: 'Gramm-Leach-Bliley Act (financial privacy)', applies_to: ['finance', 'privacy'] },
    { name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act', applies_to: ['healthcare'] },
    { name: 'SR 11-7', description: 'Model Risk Management guidance', applies_to: ['banking', 'model_risk'] },
    { name: 'NIST AI Framework', description: 'National Institute of Standards and Technology AI framework', applies_to: ['all'] },
  ],
};

async function seed() {
  try {
    console.log('🌱 Seeding reference data...');

    // Create reference tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ref_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        vendor VARCHAR(255),
        type VARCHAR(100),
        version VARCHAR(100),
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ref_vendors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        industry VARCHAR(100),
        website VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ref_use_cases (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        risk_level VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ref_data_sources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sensitivity VARCHAR(50),
        pii BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ref_deployment_platforms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        provider VARCHAR(100),
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ref_safety_features (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ref_regulatory_frameworks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        applies_to JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Clear existing data
    await pool.query('TRUNCATE TABLE ref_models, ref_vendors, ref_use_cases, ref_data_sources, ref_deployment_platforms, ref_safety_features, ref_regulatory_frameworks RESTART IDENTITY CASCADE');

    // Insert models
    for (const model of seedData.commonModels) {
      await pool.query(
        'INSERT INTO ref_models (name, vendor, type, version, category) VALUES ($1, $2, $3, $4, $5)',
        [model.name, model.vendor, model.type, model.version, model.category]
      );
    }
    console.log(`✅ Inserted ${seedData.commonModels.length} model references`);

    // Insert vendors
    for (const vendor of seedData.vendors) {
      await pool.query(
        'INSERT INTO ref_vendors (name, description, industry, website) VALUES ($1, $2, $3, $4)',
        [vendor.name, vendor.description, vendor.industry, vendor.website]
      );
    }
    console.log(`✅ Inserted ${seedData.vendors.length} vendor references`);

    // Insert use cases
    for (const useCase of seedData.useCases) {
      await pool.query(
        'INSERT INTO ref_use_cases (name, category, risk_level) VALUES ($1, $2, $3)',
        [useCase.name, useCase.category, useCase.risk_level]
      );
    }
    console.log(`✅ Inserted ${seedData.useCases.length} use case references`);

    // Insert data sources
    for (const dataSource of seedData.dataSources) {
      await pool.query(
        'INSERT INTO ref_data_sources (name, sensitivity, pii) VALUES ($1, $2, $3)',
        [dataSource.name, dataSource.sensitivity, dataSource.pii]
      );
    }
    console.log(`✅ Inserted ${seedData.dataSources.length} data source references`);

    // Insert deployment platforms
    for (const platform of seedData.deploymentPlatforms) {
      await pool.query(
        'INSERT INTO ref_deployment_platforms (name, provider, type) VALUES ($1, $2, $3)',
        [platform.name, platform.provider, platform.type]
      );
    }
    console.log(`✅ Inserted ${seedData.deploymentPlatforms.length} deployment platform references`);

    // Insert safety features
    for (const feature of seedData.safetyFeatures) {
      await pool.query(
        'INSERT INTO ref_safety_features (name, description, category) VALUES ($1, $2, $3)',
        [feature.name, feature.description, feature.category]
      );
    }
    console.log(`✅ Inserted ${seedData.safetyFeatures.length} safety feature references`);

    // Insert regulatory frameworks
    for (const framework of seedData.regulatoryFrameworks) {
      await pool.query(
        'INSERT INTO ref_regulatory_frameworks (name, description, applies_to) VALUES ($1, $2, $3)',
        [framework.name, framework.description, JSON.stringify(framework.applies_to)]
      );
    }
    console.log(`✅ Inserted ${seedData.regulatoryFrameworks.length} regulatory framework references`);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
