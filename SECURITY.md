# Security Policy

## Reporting Security Vulnerabilities

ChainX® takes security seriously. We appreciate your efforts to responsibly disclose security findings.

### 🔒 How to Report

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead, please report security issues to:
- **Email**: security@chainx.ch
- **Subject**: `[SECURITY] Brief description`

### 📧 What to Include

Please provide:
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)
5. Your contact information for follow-up

### ⏱️ Response Timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Fix timeline**: Depends on severity

### 🏆 Recognition

Security researchers who report valid vulnerabilities will be:
- Acknowledged in our SECURITY.md (unless you prefer anonymity)
- Potentially eligible for bug bounty (case by case)

### 🛡️ Scope

**In Scope:**
- Smart contract vulnerabilities
- Authentication/authorization issues
- Private key leakage risks
- XSS, CSRF, injection attacks
- Business logic flaws
- Denial of Service

**Out of Scope:**
- Known issues in dependencies (report to upstream)
- Social engineering attacks
- Physical attacks
- Third-party services

### 📜 Responsible Disclosure

We ask that you:
- Give us reasonable time to fix issues before public disclosure
- Do not exploit vulnerabilities beyond proof of concept
- Do not access or modify user data
- Do not perform DOS attacks

### 🔐 Security Best Practices

For users deploying this platform:

1. **Never commit private keys**
   - Use `.env` files (ignored by git)
   - Use hardware wallets for production
   - Rotate keys regularly

2. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Use testnet first**
   - Test on Polygon Mumbai before mainnet
   - Use small amounts for initial tests

4. **Smart contract security**
   - Get professional audits before production
   - Use multi-sig wallets for admin functions
   - Implement timelock for critical operations

5. **KYC/AML compliance**
   - Verify user identities properly
   - Maintain compliance logs
   - Follow local regulations

### 📞 Contact

- **Security Issues**: security@chainx.ch
- **General Support**: support@chainx.ch
- **Legal**: legal@chainx.ch

### 🔗 Resources

- [OWASP Smart Contract Top 10](https://owasp.org/www-project-smart-contract-top-10/)
- [Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Security Audits](https://blog.openzeppelin.com/security-audits/)

---

© 2025 Carlos Bernal - ChainX®  
Trademark N° 830657 (Swissreg)
