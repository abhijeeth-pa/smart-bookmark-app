# Contributing to Smart Bookmark App

Thank you for your interest in contributing! This document provides guidelines and steps for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Browser/device information

### Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Why it would be useful
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/smart-bookmark-app.git
   cd smart-bookmark-app
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Run the app locally
   - Test all affected features
   - Check responsive design
   - Verify no console errors

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   # or
   git commit -m "fix: bug description"
   ```

   Commit message format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit!

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing formatting (Prettier/ESLint)
- Use descriptive variable names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### Component Guidelines

**Server Components (default):**
```typescript
// app/example/page.tsx
export default async function ExamplePage() {
  // Fetch data
  const data = await fetchData()
  
  return <div>{/* render */}</div>
}
```

**Client Components (when needed):**
```typescript
// app/example/Component.tsx
'use client'

import { useState } from 'react'

export default function Component() {
  const [state, setState] = useState()
  
  return <div>{/* render */}</div>
}
```

### File Structure

- Place server components in `app/[route]/page.tsx`
- Place client components in `app/[route]/ComponentName.tsx`
- Use PascalCase for component files
- Use kebab-case for route folders

### CSS Guidelines

- Use Tailwind utility classes
- Follow mobile-first approach
- Use responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Avoid custom CSS unless absolutely necessary

### Database Changes

If you modify the database schema:

1. Update the SQL in SUPABASE_SETUP.md
2. Update TypeScript types
3. Update RLS policies if needed
4. Document the changes

### Testing Your Changes

Before submitting a PR:

1. **Run locally**
   ```bash
   npm run dev
   ```

2. **Test authentication**
   - Login works
   - Logout works
   - Protected routes work

3. **Test features**
   - All CRUD operations work
   - Real-time sync works
   - No console errors

4. **Test responsive design**
   - Mobile view (< 640px)
   - Tablet view (640-1023px)
   - Desktop view (1024px+)

5. **Build test**
   ```bash
   npm run build
   ```

6. **Lint check**
   ```bash
   npm run lint
   ```

## Areas for Contribution

### High Priority
- Bug fixes
- Performance improvements
- Documentation improvements
- Accessibility enhancements

### Medium Priority
- UI/UX improvements
- Mobile responsiveness tweaks
- Error handling improvements

### Feature Ideas (Nice to Have)
- Search functionality
- Bookmark editing
- Tags/categories
- Import/export
- Dark mode

## Pull Request Process

1. **Review**: Maintainer reviews your PR
2. **Feedback**: Address any requested changes
3. **Approval**: PR is approved
4. **Merge**: Code is merged to main
5. **Deploy**: Vercel auto-deploys to production

## Questions?

- Open an issue for questions
- Tag with `question` label
- Be specific about what you need help with

## Recognition

Contributors will be:
- Listed in GitHub contributors
- Mentioned in release notes (for significant contributions)
- Appreciated in the community!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
