# 🔒 Security Guidelines

## ⚠️ IMMEDIATE ACTION REQUIRED

If GitGuardian detected exposed tokens in your repository, follow these steps **immediately**:

### 1. **Revoke All Exposed Tokens**

#### Slack Tokens
- Go to [Slack API Apps](https://api.slack.com/apps)
- Select your app
- Navigate to "OAuth & Permissions"
- **Regenerate** the Bot User OAuth Token
- **Regenerate** any Webhook URLs

#### Google Gemini API Key
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Delete** the exposed API key
- **Create** a new API key

### 2. **Update Your Local Environment**
- Update your local `.env` file with the new tokens
- **Never** commit the `.env` file to version control

### 3. **Clean Git History (If Needed)**
If tokens were committed to git history:
```bash
# Remove sensitive files from git history
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch backend/.env' \
--prune-empty --tag-name-filter cat -- --all

# Force push to overwrite remote history
git push origin --force --all
```

## 🛡️ Security Best Practices

### Environment Variables
- ✅ Use `.env` files for sensitive data
- ✅ Add `.env` to `.gitignore`
- ✅ Use `.env.example` for documentation
- ❌ Never commit real API keys
- ❌ Never hardcode secrets in source code

### API Key Management
- 🔄 Rotate API keys regularly
- 🔒 Use least privilege principle
- 📝 Monitor API key usage
- 🚫 Revoke unused keys immediately

### Git Security
- ✅ Review commits before pushing
- ✅ Use pre-commit hooks to scan for secrets
- ✅ Enable branch protection rules
- ❌ Never force push to main/master

### Production Deployment
- 🔒 Use environment variables in deployment platform
- 🛡️ Enable HTTPS/SSL
- 🔐 Configure proper CORS settings
- 📊 Monitor for security vulnerabilities

## 🔍 Security Scanning Tools

### Recommended Tools
- **GitGuardian**: Automatic secret detection
- **git-secrets**: Pre-commit hook for AWS credentials
- **truffleHog**: Search git repos for secrets
- **detect-secrets**: Pre-commit framework for secret detection

### Setup Pre-commit Hook
```bash
# Install pre-commit
pip install pre-commit

# Create .pre-commit-config.yaml
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
EOF

# Install the hook
pre-commit install
```

## 📞 Incident Response

If you suspect a security breach:

1. **Immediately revoke** all potentially compromised credentials
2. **Change all passwords** and API keys
3. **Review access logs** for unauthorized activity
4. **Update dependencies** to latest secure versions
5. **Document the incident** for future reference

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Slack Security Best Practices](https://slack.com/help/articles/115004930943)
- [Google Cloud Security](https://cloud.google.com/security/best-practices)
