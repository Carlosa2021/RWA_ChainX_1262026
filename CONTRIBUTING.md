# Contributing to ChainX® RWA Platform

Thank you for your interest in contributing! 🎉

## ⚠️ Important Legal Notice

This project is licensed under **Apache 2.0 WITH ADDITIONAL TERMS**.

**ChainX®** is a registered trademark (N° 830657, Swissreg) owned by Carlos Bernal.

By contributing, you agree that:
1. Your contributions will be licensed under the same license
2. You do NOT acquire rights to use the ChainX® trademark
3. Your contributions do NOT grant you commercial usage rights
4. You have the right to submit your contributions

## 🤝 How to Contribute

### Types of Contributions Welcome

✅ **Bug fixes**
✅ **Security improvements**
✅ **Documentation improvements**
✅ **Test coverage**
✅ **Code quality improvements**
✅ **Translation/localization**
✅ **Performance optimizations**

❌ **Not accepting:**
- Breaking changes without discussion
- Features that compete with commercial offerings
- Trademark modifications
- License changes

## 📋 Contribution Process

### 1. Before Starting

- Check existing issues and PRs
- For major changes, open an issue first to discuss
- For security issues, see [SECURITY.md](./SECURITY.md)

### 2. Fork & Clone

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR_USERNAME/RWA_ChainX.git
cd RWA_ChainX
npm install
```

### 3. Create Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `test/` - Tests
- `refactor/` - Code refactoring
- `security/` - Security fixes

### 4. Make Changes

**Code Style:**
- Follow existing code patterns
- Use TypeScript strictly
- Add JSDoc comments for functions
- Keep functions small and focused

**Smart Contracts:**
- Follow Solidity best practices
- Add NatSpec comments
- Include tests for new functionality
- Run `npm run test` before submitting

**Frontend:**
- Use Tailwind CSS for styling
- Follow React best practices
- Ensure responsive design
- Test on multiple browsers

### 5. Commit

```bash
git add .
git commit -m "type: brief description

- Detailed explanation if needed
- Reference issue: #123"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring
- `style:` - Formatting
- `chore:` - Maintenance
- `security:` - Security fix

### 6. Push & PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Reference to related issues
- Screenshots (if UI changes)
- Test results

## 🧪 Testing

### Smart Contracts

```bash
cd contracts
npm test
```

All tests must pass before PR is merged.

### Frontend

```bash
npm run dev
# Manual testing in browser
```

## 📝 Documentation

Update relevant documentation:
- README.md
- Code comments
- JSDoc/NatSpec
- User guides (if applicable)

## 🔍 Code Review

Your PR will be reviewed for:
- Code quality
- Security implications
- Test coverage
- Documentation
- License compliance

## ⚡ Quick Start for Common Tasks

### Add a New Smart Contract Script

```bash
cd contracts/scripts
cp template.ts your-script.ts
# Edit your-script.ts
```

### Fix a Bug

1. Write a test that reproduces the bug
2. Fix the bug
3. Verify test passes
4. Submit PR

### Improve Documentation

1. Edit relevant .md files
2. Check formatting
3. Submit PR

## 🚫 What NOT to Do

❌ Commit private keys or sensitive data
❌ Change LICENSE or NOTICE files
❌ Use ChainX® trademark without permission
❌ Submit AI-generated code without review
❌ Copy code without proper attribution
❌ Break existing functionality

## 🏆 Recognition

Contributors will be:
- Listed in GitHub contributors
- Mentioned in release notes (for significant contributions)
- Part of the open-source community

## 📞 Questions?

- **Technical**: Open a GitHub issue
- **Legal**: legal@chainx.ch
- **Security**: security@chainx.ch
- **General**: support@chainx.ch

## 📄 License

By contributing, you agree that your contributions will be licensed under:
- Apache License 2.0
- Additional ChainX® terms (see LICENSE)

You DO NOT gain rights to:
- Use ChainX® trademark commercially
- Sublicense the code commercially
- Create commercial derivatives without permission

---

Thank you for contributing to ChainX®! 🚀

© 2025 Carlos Bernal - ChainX®  
Trademark N° 830657 (Swissreg)
