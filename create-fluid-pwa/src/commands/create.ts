import path from 'path'
import fs from 'fs-extra'
import { execa } from 'execa'
import { FluidPWAConfig, TemplateConfig } from '../types'
import { getTemplate } from '../templates'
import { applyFeatures } from '../features'

export async function createProject(config: FluidPWAConfig): Promise<void> {
  const projectPath = path.join(process.cwd(), config.projectName)
  
  // Check if directory already exists
  if (await fs.pathExists(projectPath)) {
    throw new Error(`Directory ${config.projectName} already exists`)
  }

  // Create project directory
  await fs.ensureDir(projectPath)

  // Get base template
  const template = await getTemplate(config.template)
  
  // Apply template files
  await applyTemplate(projectPath, template, config)
  
  // Apply selected features
  await applyFeatures(projectPath, config.features, config)
  
  // Generate package.json
  await generatePackageJson(projectPath, config, template)
  
  // Initialize git if requested
  if (config.initGit) {
    await initializeGit(projectPath)
  }
  
  // Install dependencies if requested
  if (config.installDeps) {
    await installDependencies(projectPath, config.packageManager)
  }
}

async function applyTemplate(
  projectPath: string,
  template: TemplateConfig,
  config: FluidPWAConfig
): Promise<void> {
  for (const file of template.files) {
    const filePath = path.join(projectPath, file.path)
    const dirPath = path.dirname(filePath)
    
    await fs.ensureDir(dirPath)
    
    if (file.template) {
      // Process template variables
      const content = processTemplate(file.content, config)
      await fs.writeFile(filePath, content, 'utf-8')
    } else {
      await fs.writeFile(filePath, file.content, 'utf-8')
    }
  }
}

function processTemplate(content: string, config: FluidPWAConfig): string {
  return content
    .replace(/{{PROJECT_NAME}}/g, config.projectName)
    .replace(/{{USE_TYPESCRIPT}}/g, config.useTypeScript.toString())
    .replace(/{{STYLING}}/g, config.styling)
    .replace(/{{FEATURES}}/g, JSON.stringify(config.features))
}

async function generatePackageJson(
  projectPath: string,
  config: FluidPWAConfig,
  template: TemplateConfig
): Promise<void> {
  const packageJson = {
    name: config.projectName,
    version: '0.1.0',
    private: true,
    description: `A Fluid PWA project created with ${config.template} template`,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      ...template.scripts
    },
    dependencies: {
      'fluid-pwa': '^1.0.0',
      next: '^15.0.0',
      react: '^18.0.0',
      'react-dom': '^18.0.0',
      ...template.dependencies
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      typescript: '^5.0.0',
      eslint: '^8.0.0',
      'eslint-config-next': '^15.0.0',
      ...template.devDependencies
    }
  }

  if (!config.useTypeScript) {
    delete packageJson.devDependencies.typescript
    delete packageJson.devDependencies['@types/node']
  }

  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  )
}

async function initializeGit(projectPath: string): Promise<void> {
  try {
    await execa('git', ['init'], { cwd: projectPath })
    await execa('git', ['add', '.'], { cwd: projectPath })
    await execa('git', ['commit', '-m', 'Initial commit'], { cwd: projectPath })
  } catch (error) {
    console.warn('Failed to initialize git repository:', error)
  }
}

async function installDependencies(
  projectPath: string,
  packageManager: string
): Promise<void> {
  const commands: Record<string, string[]> = {
    npm: ['install'],
    yarn: ['install'],
    pnpm: ['install'],
    bun: ['install']
  }

  const command = commands[packageManager]
  if (!command) {
    throw new Error(`Unknown package manager: ${packageManager}`)
  }

  await execa(packageManager, command, { cwd: projectPath })
} 