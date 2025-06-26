# Contributing to Fluid PWA 🤝

Thank you for your interest in contributing to Fluid PWA! This is an open-source project created and maintained by [Harshal More](https://github.com/harshalmore31). We welcome contributions from the community to help build the ultimate offline-first PWA framework with multiple batteries for rapid development.

## 🌟 Ways to Contribute

### 🐛 **Bug Reports**
Found a bug? Help us improve by reporting it:
- Check existing issues to avoid duplicates
- Provide a clear title and description
- Include steps to reproduce the issue
- Share your environment details (OS, browser, Node.js version)
- Add code examples or screenshots when helpful

### ✨ **Feature Requests**
Have an idea for a new feature?
- Check if it's already requested in discussions
- Explain the use case and expected behavior
- Consider if it fits the framework's scope and philosophy
- Be open to feedback and alternative approaches

### 🔧 **Code Contributions**
Ready to code? Here's how:
- Bug fixes and improvements
- New hooks and utilities
- Performance optimizations
- Documentation improvements
- Test coverage expansion

### 📖 **Documentation**
Help others learn Fluid PWA:
- Improve existing documentation
- Add code examples and tutorials
- Fix typos and clarify explanations
- Create guides for specific use cases

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git
- A modern code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   # Fork the repo on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/fluid-pwa.git
   cd fluid-pwa
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   This runs the Next.js app with the demo at `http://localhost:3000`

4. **Run Tests**
   ```bash
   npm test
   # or for watch mode
   npm run test:watch
   ```

5. **Build the Package**
   ```bash
   npm run build:package
   ```

### Project Structure

```
fluid-pwa/
├── src/
│   ├── app/               # Next.js app (demo site)
│   │   ├── demo/          # Interactive demo
│   │   └── page.tsx       # Homepage
│   ├── components/        # Demo components
│   └── lib/
│       └── dexie/         # 🏗️ Core framework code
│           ├── database.ts    # Database management
│           ├── hooks.ts       # React hooks
│           ├── types.ts       # TypeScript definitions
│           ├── FluidPWAProvider.tsx # React provider
│           └── index.ts       # Main exports
├── docs/                  # Documentation files
├── tests/                 # Test files
└── examples/              # Example implementations
```

## 🛠️ Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled, maintain type safety
- **ESLint**: Follow the configured rules
- **Formatting**: Use Prettier (automatic on save recommended)
- **Naming**: Use clear, descriptive names for functions and variables

### Git Workflow
1. **Branch Naming**
   ```
   feature/add-new-hook
   fix/database-connection-issue
   docs/improve-getting-started
   ```

2. **Commit Messages**
   Use conventional commits:
   ```
   feat: add useGetPendingItems hook
   fix: resolve sync status not updating
   docs: update installation instructions
   test: add tests for bulk operations
   ```

3. **Pull Request Process**
   - Create a descriptive title
   - Reference related issues with "Fixes #123"
   - Provide context and testing instructions
   - Ensure all tests pass
   - Update documentation if needed

### Testing
- **Unit Tests**: Test individual functions and hooks
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows in the demo
- **Manual Testing**: Test in multiple browsers and offline scenarios

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Framework Philosophy

Keep these principles in mind when contributing:

1. **Developer Experience First**: APIs should be intuitive and require minimal configuration
2. **Type Safety**: Full TypeScript support with intelligent inference
3. **Offline-First**: Everything should work seamlessly offline
4. **Performance**: Optimize for speed and memory usage
5. **Simplicity**: Complex implementations, simple APIs
6. **Backwards Compatibility**: Avoid breaking changes when possible

## 📋 Contribution Areas

### 🔥 **High Priority**
- [ ] Background sync with Service Workers
- [ ] Conflict resolution strategies
- [ ] Performance optimizations
- [ ] More comprehensive error handling
- [ ] Additional hook variants

### 🎯 **Good First Issues**
- [ ] Add more TypeScript examples to docs
- [ ] Improve error messages
- [ ] Add JSDoc comments to exported functions
- [ ] Write integration tests for edge cases
- [ ] Create example apps for different use cases

### 🚀 **Advanced**
- [ ] Plugin architecture for extensibility
- [ ] Real-time collaboration features
- [ ] Encryption and security enhancements
- [ ] Multi-database support
- [ ] Advanced sync algorithms

## 🧪 Testing Your Changes

### Manual Testing Checklist
- [ ] Demo app loads without errors
- [ ] CRUD operations work correctly
- [ ] Sync status updates properly
- [ ] Offline functionality works
- [ ] TypeScript compilation succeeds
- [ ] No console errors or warnings

### Browser Testing
Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on macOS)
- [ ] Edge (latest)
- [ ] Mobile browsers (Chrome/Safari)

## 📝 Documentation Guidelines

### Code Documentation
- Use JSDoc comments for all exported functions
- Include examples in documentation
- Explain complex algorithms and design decisions
- Document type parameters and return types

```typescript
/**
 * Hook to add items to a store with automatic sync status tracking
 * 
 * @template T - The type of item being added
 * @param storeName - Name of the Dexie store
 * @param options - Optional configuration for the operation
 * @returns Function to add items that returns a CRUDResult
 * 
 * @example
 * ```typescript
 * const addNote = useAddItem<Note>('notes', {
 *   onAfterAdd: (note, id) => console.log('Added:', id)
 * })
 * 
 * const result = await addNote({
 *   title: 'My Note',
 *   content: 'This is a note'
 * })
 * ```
 */
```

### README Updates
- Keep the main README concise and focused
- Add new features to the features list
- Update examples when APIs change
- Maintain the changelog

## 🚦 Review Process

### What We Look For
- **Functionality**: Does it work as intended?
- **Testing**: Are there adequate tests?
- **Documentation**: Is it well documented?
- **Code Quality**: Is it readable and maintainable?
- **Performance**: Does it impact performance?
- **Breaking Changes**: Are they necessary and well-communicated?

### Review Timeline
- Initial response: Within 2-3 days
- Full review: Within 1 week
- Complex features may take longer

## 🤝 Community

### Getting Help
- **Discussions**: Use [GitHub Discussions](https://github.com/harshalmore31/fluid-pwa/discussions) for questions
- **Issues**: Create an issue for bugs and feature requests

### Code of Conduct
We follow the [Contributor Covenant](https://www.contributor-covenant.org/):
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different perspectives and experiences

## 🎉 Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes for significant contributions
- Hall of Fame in documentation (coming soon)
- Special Discord roles for active contributors

## 📞 Questions?

Still have questions? We're here to help!

- 💬 **Discussions**: [Join our community](https://github.com/harshalmore31/fluid-pwa/discussions)
- 📧 **Issues**: [Report bugs and request features](https://github.com/harshalmore31/fluid-pwa/issues)
- 👨‍💻 **Creator**: [@harshalmore31](https://github.com/harshalmore31)

---

**Thank you for helping make Fluid PWA better for everyone! ��**

*Happy coding!* 