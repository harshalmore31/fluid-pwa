import { TemplateConfig } from '../types'
import { basicTemplate } from './basic'

export const blogTemplate: TemplateConfig = {
  ...basicTemplate,
  name: 'blog',
  description: 'Content management and publishing platform',
  features: ['file-storage', 'analytics'],
  dependencies: {
    ...basicTemplate.dependencies,
    'gray-matter': '^4.0.3',
    'remark': '^15.0.1',
    'remark-html': '^16.0.1'
  }
} 