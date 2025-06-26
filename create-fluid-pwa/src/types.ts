export interface FluidPWAConfig {
  projectName: string
  template: string
  features: string[]
  styling: string
  packageManager: string
  useTypeScript: boolean
  initGit: boolean
  installDeps: boolean
}

export interface TemplateConfig {
  name: string
  description: string
  features: string[]
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  scripts: Record<string, string>
  files: TemplateFile[]
}

export interface TemplateFile {
  path: string
  content: string
  template?: boolean // If true, process as template with variables
}

export interface FeatureConfig {
  name: string
  description: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  files: TemplateFile[]
  scripts?: Record<string, string>
  postInstall?: () => Promise<void>
}

export interface ValidationResult {
  valid: boolean
  problems?: string[]
} 