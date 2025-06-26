import { TemplateConfig } from '../types'
import { basicTemplate } from './basic'

export const socialTemplate: TemplateConfig = {
  ...basicTemplate,
  name: 'social',
  description: 'Social features and user interactions',
  features: ['auth', 'real-time', 'push-notifications', 'file-storage'],
  dependencies: {
    ...basicTemplate.dependencies,
    'socket.io-client': '^4.7.0',
    'react-hook-form': '^7.48.0'
  }
} 