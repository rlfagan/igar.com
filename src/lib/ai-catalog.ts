// AI Catalog - Available models, tools, datasets, and use cases

export interface CatalogItem {
  id: string
  name: string
  provider?: string
  category: 'model' | 'tool' | 'oss' | 'dataset' | 'use_case'
  description?: string
  tags?: string[]
}

export const aiCatalog: CatalogItem[] = [
  // Models
  { id: 'openai:gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', category: 'model', tags: ['llm', 'commercial'] },
  { id: 'openai:gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI', category: 'model', tags: ['llm', 'commercial', 'cost-effective'] },
  { id: 'anthropic:claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', category: 'model', tags: ['llm', 'commercial'] },
  { id: 'anthropic:claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', category: 'model', tags: ['llm', 'commercial', 'fast'] },
  { id: 'google:gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', category: 'model', tags: ['llm', 'commercial', 'multimodal'] },
  { id: 'aws:bedrock-titan-text-premier', name: 'Bedrock Titan Text Premier', provider: 'AWS', category: 'model', tags: ['llm', 'commercial'] },
  { id: 'mistral:mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'Mistral AI', category: 'model', tags: ['llm', 'open-weights'] },
  { id: 'meta:llama-3-70b', name: 'Llama 3 70B', provider: 'Meta', category: 'model', tags: ['llm', 'open-weights'] },
  { id: 'meta:llama-3-8b', name: 'Llama 3 8B', provider: 'Meta', category: 'model', tags: ['llm', 'open-weights', 'small'] },
  { id: 'cohere:command', name: 'Command', provider: 'Cohere', category: 'model', tags: ['llm', 'commercial'] },
  { id: 'llama-uncensored-*', name: 'Llama Uncensored (Wildcard)', provider: 'Community', category: 'model', tags: ['uncensored', 'high-risk'] },
  { id: 'wizardlm-uncensored-*', name: 'WizardLM Uncensored (Wildcard)', provider: 'Community', category: 'model', tags: ['uncensored', 'high-risk'] },
  { id: 'gpt4free-*', name: 'GPT4Free (Wildcard)', provider: 'Community', category: 'model', tags: ['reverse-engineered', 'high-risk'] },
  { id: 'stable-diffusion-raw-*', name: 'Stable Diffusion Raw (Wildcard)', provider: 'Stability AI', category: 'model', tags: ['image-gen', 'uncensored'] },

  // Tools
  { id: 'github:copilot-enterprise', name: 'GitHub Copilot Enterprise', provider: 'GitHub', category: 'tool', tags: ['code-assistant', 'enterprise'] },
  { id: 'openai:enterprise', name: 'OpenAI Enterprise', provider: 'OpenAI', category: 'tool', tags: ['llm-api', 'enterprise'] },
  { id: 'perplexity:enterprise', name: 'Perplexity Enterprise', provider: 'Perplexity', category: 'tool', tags: ['search', 'enterprise'] },
  { id: 'microsoft:365-copilot-enterprise', name: 'Microsoft 365 Copilot Enterprise', provider: 'Microsoft', category: 'tool', tags: ['productivity', 'enterprise'] },
  { id: 'huggingface:inference-api', name: 'HuggingFace Inference API', provider: 'HuggingFace', category: 'tool', tags: ['ml-api', 'cloud'] },
  { id: 'local-inference', name: 'Local Inference', provider: 'Self-hosted', category: 'tool', tags: ['self-hosted', 'privacy'] },
  { id: 'characterai:*', name: 'Character.AI (Wildcard)', provider: 'Character.AI', category: 'tool', tags: ['chatbot', 'consumer'] },
  { id: 'midjourney:*', name: 'Midjourney (Wildcard)', provider: 'Midjourney', category: 'tool', tags: ['image-gen', 'consumer'] },
  { id: 'replika:*', name: 'Replika (Wildcard)', provider: 'Replika', category: 'tool', tags: ['chatbot', 'consumer'] },

  // Open Source Software
  { id: 'huggingface/transformers', name: 'Transformers', provider: 'HuggingFace', category: 'oss', tags: ['library', 'apache-2.0'] },
  { id: 'huggingface/diffusers', name: 'Diffusers', provider: 'HuggingFace', category: 'oss', tags: ['library', 'apache-2.0', 'image-gen'] },
  { id: 'langchain', name: 'LangChain', provider: 'LangChain', category: 'oss', tags: ['framework', 'mit'] },
  { id: 'pytorch', name: 'PyTorch', provider: 'Meta', category: 'oss', tags: ['framework', 'bsd'] },
  { id: 'tensorflow', name: 'TensorFlow', provider: 'Google', category: 'oss', tags: ['framework', 'apache-2.0'] },
  { id: 'llama.cpp', name: 'llama.cpp', provider: 'Community', category: 'oss', tags: ['inference', 'mit'] },
  { id: 'vllm', name: 'vLLM', provider: 'UC Berkeley', category: 'oss', tags: ['inference', 'apache-2.0'] },
  { id: 'any:GPL-3.0', name: 'Any GPL-3.0 Software', provider: 'Various', category: 'oss', tags: ['gpl', 'copyleft'] },
  { id: 'hf:model:no-license', name: 'HF Models Without License', provider: 'HuggingFace', category: 'oss', tags: ['no-license', 'high-risk'] },
  { id: 'hf:dataset:no-docs', name: 'HF Datasets Without Docs', provider: 'HuggingFace', category: 'oss', tags: ['no-docs', 'high-risk'] },

  // Datasets
  { id: 'hf:financial-sentiment-verified', name: 'Financial Sentiment (Verified)', provider: 'HuggingFace', category: 'dataset', tags: ['finance', 'verified'] },
  { id: 'hf:ms-marco-v1', name: 'MS MARCO v1', provider: 'Microsoft', category: 'dataset', tags: ['search', 'qa'] },
  { id: 'hf:wiki-en-cleaned', name: 'Wikipedia EN (Cleaned)', provider: 'Wikimedia', category: 'dataset', tags: ['knowledge', 'cleaned'] },
  { id: 'openclimate:climate-risk-dataset-v2', name: 'Climate Risk Dataset v2', provider: 'OpenClimate', category: 'dataset', tags: ['climate', 'risk'] },
  { id: 'customer-data-derived', name: 'Customer Data (Derived)', provider: 'Internal', category: 'dataset', tags: ['customer', 'pii'] },
  { id: 'user-uploaded', name: 'User Uploaded Data', provider: 'Internal', category: 'dataset', tags: ['user-generated', 'review-required'] },

  // Use Cases
  { id: 'fraud-detection', name: 'Fraud Detection', category: 'use_case', tags: ['finance', 'high-risk'] },
  { id: 'credit-eligibility', name: 'Credit Eligibility', category: 'use_case', tags: ['finance', 'high-risk', 'ecoa'] },
  { id: 'aml-bsa', name: 'AML/BSA Compliance', category: 'use_case', tags: ['finance', 'compliance'] },
  { id: 'hr-screening', name: 'HR Candidate Screening', category: 'use_case', tags: ['hr', 'high-risk'] },
  { id: 'biometric-identification', name: 'Biometric Identification', category: 'use_case', tags: ['biometric', 'prohibited'] },
  { id: 'autonomous-medical-diagnosis', name: 'Autonomous Medical Diagnosis', category: 'use_case', tags: ['medical', 'prohibited'] },
  { id: 'political-profiling', name: 'Political Profiling', category: 'use_case', tags: ['political', 'prohibited'] },
  { id: 'unexplainable-credit-decisions', name: 'Unexplainable Credit Decisions', category: 'use_case', tags: ['credit', 'prohibited'] },
]

export const getCatalogByCategory = (category: CatalogItem['category']) => {
  return aiCatalog.filter(item => item.category === category)
}

export const searchCatalog = (query: string) => {
  const lowerQuery = query.toLowerCase()
  return aiCatalog.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.id.toLowerCase().includes(lowerQuery) ||
    item.provider?.toLowerCase().includes(lowerQuery) ||
    item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}
