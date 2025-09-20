# ⚡ Quick Start - AI Builder for Angular

## 🎯 Get Started in 2 Minutes

### 1. Install & Demo
```bash
npm install
npm run ai:demo
# ✅ Creates: src/pages/demopage.component.ts (showcases your design system)
```

### 2. Generate Your First Component
```bash
# Option A: From natural language (needs API key)
echo "Create a user settings page with profile form and preferences" > prompts/my-component.md
OPENAI_API_KEY=sk-xxx npm run ai:build -- --prompt prompts/my-component.md

# Option B: From specification (no API key needed)
npm run ai:build -- --from-spec examples/angular-claims-dashboard.spec.json
```

### 3. Customize for Your Design System
```bash
# Edit your components
vim design-system/components.manifest.json

# Edit your design tokens
vim design-system/tokens.json

# Regenerate with your system
npm run ai:demo
```

## 🎁 What You Get

### ✅ **Perfect Angular Components**
- Standalone components (Angular 17+)
- TypeScript with proper interfaces
- Reactive forms integration
- Design system compliance
- Data service injection

### ✅ **Developer Experience**
- Watch mode for live development
- Quality gates and validation
- Error handling and help messages
- Prettier formatting included

### ✅ **Production Ready**
- No React dependencies
- Clean, testable code structure
- Follows Angular best practices
- Ready for CI/CD integration

## 🚀 Key Commands

| Command | Description |
|---------|-------------|
| `npm run ai:demo` | Generate generic demo page |
| `npm run ai:demo:watch` | Watch mode for development |
| `npm run ai:create` | Interactive page creator |
| `npm run ai:create:dashboard` | Create dashboard page |
| `npm run ai:create:form` | Create form page |
| `npm run ai:validate <spec>` | Validate specification |
| `npm run ai:quality <spec>` | Run quality checks |
| `npm run format` | Format all code |

## 💡 Pro Tips

1. **Start Simple**: Use `npm run ai:demo` to see example output
2. **Learn by Example**: Study `examples/angular-claims-dashboard.spec.json`
3. **Customize Gradually**: Update manifest with your actual design system
4. **Use Watch Mode**: `npm run ai:demo:watch` for rapid iteration
5. **Quality First**: Always run `npm run ai:quality` before production

## 🎯 Common Use Cases

- **📊 Dashboards**: Analytics, admin panels, user interfaces
- **📝 Forms**: User registration, settings, data entry
- **📋 Data Tables**: User lists, product catalogs, reports
- **🎛️ Controls**: Navigation, toolbars, action panels

## 🆘 Need Help?

- 📖 **Full Guide**: See `USER-GUIDE.md` for comprehensive documentation
- 🔧 **Technical Docs**: Check `README.md` for detailed setup
- 🐛 **Issues**: Report problems via GitHub issues
- 💬 **Examples**: Explore `examples/` and `prompts/` directories

**Ready? Run `npm run ai:demo` and see the magic! 🎉**