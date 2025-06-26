import { TemplateConfig } from '../types'
import { basicTemplate } from './basic'
import { fullFeaturedTemplate } from './full-featured'
import { ecommerceTemplate } from './ecommerce'
import { dashboardTemplate } from './dashboard'
import { blogTemplate } from './blog'
import { socialTemplate } from './social'

const templates: Record<string, TemplateConfig> = {
  basic: basicTemplate,
  'full-featured': fullFeaturedTemplate,
  'e-commerce': ecommerceTemplate,
  dashboard: dashboardTemplate,
  blog: blogTemplate,
  social: socialTemplate
}

export async function getTemplate(templateName: string): Promise<TemplateConfig> {
  const template = templates[templateName]
  
  if (!template) {
    throw new Error(`Unknown template: ${templateName}`)
  }
  
  return template
}

export { templates } 