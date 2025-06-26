import { TemplateConfig } from '../types'
import { basicTemplate } from './basic'

export const fullFeaturedTemplate: TemplateConfig = {
  ...basicTemplate,
  name: 'full-featured',
  description: 'Complete setup with all batteries included',
  features: ['auth', 'sync', 'push-notifications', 'analytics'],
  dependencies: {
    ...basicTemplate.dependencies,
    'next-auth': '^4.24.0',
    'workbox-webpack-plugin': '^7.0.0'
  },
  devDependencies: {
    ...basicTemplate.devDependencies,
    '@types/react': '^18.0.0',
    '@types/react-dom': '^18.0.0'
  }
} 