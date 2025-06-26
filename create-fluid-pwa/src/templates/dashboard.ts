import { TemplateConfig } from '../types'
import { basicTemplate } from './basic'

export const dashboardTemplate: TemplateConfig = {
  ...basicTemplate,
  name: 'dashboard',
  description: 'Perfect for admin panels and analytics dashboards',
  features: ['auth', 'real-time', 'analytics', 'ui-library'],
  dependencies: {
    ...basicTemplate.dependencies,
    'recharts': '^2.8.0',
    'date-fns': '^2.30.0'
  }
} 