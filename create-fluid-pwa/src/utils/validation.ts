import validateNpmName from 'validate-npm-package-name'
import { ValidationResult } from '../types'

export function validateProjectName(name: string): ValidationResult {
  const validation = validateNpmName(name)
  
  if (validation.validForNewPackages) {
    return { valid: true }
  }
  
  return {
    valid: false,
    problems: [
      ...(validation.errors || []),
      ...(validation.warnings || [])
    ]
  }
}

export function sanitizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
} 