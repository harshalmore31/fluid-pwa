#!/usr/bin/env node

import { Command } from 'commander'
import { intro, outro, text, select, multiselect, confirm, spinner, note, cancel } from '@clack/prompts'
import chalk from 'chalk'
import gradient from 'gradient-string'
import { createProject } from './commands/create'
import { validateProjectName } from './utils/validation'
import { FluidPWAConfig } from './types'

const fluidGradient = gradient(['#0ea5e9', '#3b82f6', '#6366f1'])

async function main() {
  console.clear()
  
  intro(fluidGradient('🚀 Welcome to Fluid PWA'))
  
  // Project name
  const projectName = await text({
    message: 'What is your project name?',
    placeholder: 'my-fluid-pwa',
    validate(value: string) {
      if (!value) return 'Please enter a project name'
      const validation = validateProjectName(value)
      if (!validation.valid) return validation.problems![0]
      return undefined
    }
  })

  if (typeof projectName === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // Template selection
  const template = await select({
    message: 'Choose a template:',
    options: [
      {
        value: 'basic',
        label: '📦 Basic',
        hint: 'Minimal setup with essential features'
      },
      {
        value: 'full-featured',
        label: '🎯 Full Featured',
        hint: 'Complete setup with all batteries included'
      },
      {
        value: 'e-commerce',
        label: '🛒 E-commerce',
        hint: 'Optimized for online stores and marketplaces'
      },
      {
        value: 'dashboard',
        label: '📊 Dashboard',
        hint: 'Perfect for admin panels and analytics'
      },
      {
        value: 'blog',
        label: '📝 Blog/CMS',
        hint: 'Content management and publishing'
      },
      {
        value: 'social',
        label: '👥 Social Media',
        hint: 'Social features and user interactions'
      }
    ]
  })

  if (typeof template === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // Framework batteries/features
  const features = await multiselect({
    message: 'Select features to include (batteries):',
    options: [
      {
        value: 'auth',
        label: '🔐 Authentication',
        hint: 'User login/logout with offline support'
      },
      {
        value: 'sync',
        label: '🔄 Background Sync',
        hint: 'Automatic data synchronization'
      },
      {
        value: 'push-notifications',
        label: '📢 Push Notifications',
        hint: 'Web push notifications support'
      },
      {
        value: 'file-storage',
        label: '📁 File Storage',
        hint: 'Offline file management and caching'
      },
      {
        value: 'real-time',
        label: '⚡ Real-time Updates',
        hint: 'WebSocket/SSE integration'
      },
      {
        value: 'analytics',
        label: '📈 Analytics',
        hint: 'Offline-first analytics tracking'
      },
      {
        value: 'encryption',
        label: '🔒 Data Encryption',
        hint: 'Client-side data encryption'
      },
      {
        value: 'wasm',
        label: '⚙️ WebAssembly',
        hint: 'WASM modules for performance'
      },
      {
        value: 'workers',
        label: '👷 Web Workers',
        hint: 'Background processing threads'
      },
      {
        value: 'ui-library',
        label: '🎨 UI Component Library',
        hint: 'Pre-built PWA-optimized components'
      }
    ],
    required: false
  })

  if (typeof features === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // Styling options
  const styling = await select({
    message: 'Choose your styling approach:',
    options: [
      {
        value: 'tailwind',
        label: '🎨 Tailwind CSS',
        hint: 'Utility-first CSS framework'
      },
      {
        value: 'styled-components',
        label: '💅 Styled Components',
        hint: 'CSS-in-JS styling'
      },
      {
        value: 'emotion',
        label: '😊 Emotion',
        hint: 'CSS-in-JS with excellent performance'
      },
      {
        value: 'vanilla-css',
        label: '📄 Vanilla CSS',
        hint: 'Plain CSS with CSS modules'
      }
    ]
  })

  if (typeof styling === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // Package manager
  const packageManager = await select({
    message: 'Choose package manager:',
    options: [
      {
        value: 'npm',
        label: '📦 npm',
        hint: 'Node Package Manager'
      },
      {
        value: 'yarn',
        label: '🧶 Yarn',
        hint: 'Fast, reliable package manager'
      },
      {
        value: 'pnpm',
        label: '📀 pnpm',
        hint: 'Fast, disk space efficient'
      },
      {
        value: 'bun',
        label: '🍞 Bun',
        hint: 'Ultra-fast JavaScript runtime'
      }
    ]
  })

  if (typeof packageManager === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // TypeScript
  const useTypeScript = await confirm({
    message: 'Use TypeScript?',
    initialValue: true
  })

  if (typeof useTypeScript === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // Git initialization
  const initGit = await confirm({
    message: 'Initialize Git repository?',
    initialValue: true
  })

  if (typeof initGit === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // Install dependencies
  const installDeps = await confirm({
    message: 'Install dependencies?',
    initialValue: true
  })

  if (typeof installDeps === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // Configuration summary
  const config: FluidPWAConfig = {
    projectName: projectName as string,
    template: template as string,
    features: features as string[],
    styling: styling as string,
    packageManager: packageManager as string,
    useTypeScript: useTypeScript as boolean,
    initGit: initGit as boolean,
    installDeps: installDeps as boolean
  }

  // Show configuration summary
  note(
    `
${chalk.bold('Project Configuration:')}
${chalk.gray('├─')} Name: ${chalk.cyan(config.projectName)}
${chalk.gray('├─')} Template: ${chalk.cyan(config.template)}
${chalk.gray('├─')} Features: ${chalk.cyan(config.features.length > 0 ? config.features.join(', ') : 'None')}
${chalk.gray('├─')} Styling: ${chalk.cyan(config.styling)}
${chalk.gray('├─')} Package Manager: ${chalk.cyan(config.packageManager)}
${chalk.gray('├─')} TypeScript: ${chalk.cyan(config.useTypeScript ? 'Yes' : 'No')}
${chalk.gray('├─')} Git: ${chalk.cyan(config.initGit ? 'Yes' : 'No')}
${chalk.gray('└─')} Install deps: ${chalk.cyan(config.installDeps ? 'Yes' : 'No')}
    `.trim(),
    'Configuration Summary'
  )

  const proceed = await confirm({
    message: 'Proceed with project creation?',
    initialValue: true
  })

  if (!proceed || typeof proceed === 'symbol') {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  // Create the project
  const s = spinner()
  s.start('Creating your Fluid PWA project...')

  try {
    await createProject(config)
    s.stop('Project created successfully!')
    
    outro(
      `${fluidGradient('🎉 Success!')} Your Fluid PWA project has been created.

${chalk.bold('Next steps:')}
${chalk.gray('1.')} ${chalk.cyan(`cd ${config.projectName}`)}
${chalk.gray('2.')} ${config.installDeps ? chalk.gray('Dependencies installed ✓') : chalk.cyan(`${config.packageManager} install`)}
${chalk.gray('3.')} ${chalk.cyan(`${config.packageManager} run dev`)}

${chalk.bold('Documentation:')}
${chalk.gray('├─')} ${chalk.blue('https://github.com/harshalmore31/fluid-pwa')}
${chalk.gray('├─')} ${chalk.blue('https://github.com/harshalmore31/fluid-pwa/tree/main/examples')}
${chalk.gray('└─')} ${chalk.blue('https://github.com/harshalmore31/fluid-pwa/blob/main/README.md')}

${chalk.dim('Happy coding with Fluid PWA! 🚀')}`
    )
  } catch (error) {
    s.stop('Failed to create project')
    console.error(chalk.red('Error:'), error)
    process.exit(1)
  }
}

// CLI setup
const program = new Command()

program
  .name('create-fluid-pwa')
  .description('🚀 Create a new Fluid PWA project')
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Project template')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip Git initialization')
  .option('--typescript', 'Use TypeScript')
  .option('--javascript', 'Use JavaScript')
  .action(async (projectName: string | undefined, options: any) => {
    if (projectName || Object.keys(options).length > 0) {
      // Non-interactive mode with CLI args
      console.log(chalk.yellow('Non-interactive mode not yet implemented. Using interactive mode...'))
    }
    await main()
  })

program.parse() 