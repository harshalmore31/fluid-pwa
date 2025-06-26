import { TemplateConfig } from '../types'
import { basicTemplate } from './basic'

export const ecommerceTemplate: TemplateConfig = {
  ...basicTemplate,
  name: 'e-commerce',
  description: 'Optimized for online stores and marketplaces',
  features: ['auth', 'file-storage', 'analytics', 'encryption'],
  dependencies: {
    ...basicTemplate.dependencies,
    'stripe': '^14.0.0',
    '@stripe/stripe-js': '^2.0.0'
  }
} 