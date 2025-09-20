#!/bin/bash

echo "🧪 Component Testing Helper"
echo "=========================="

echo "1. 📝 Generated Components:"
ls -la src/pages/

echo -e "\n2. 🔍 Validate Components:"
for file in examples/*.spec.json; do
    echo "Validating $file..."
    npm run ai:quality "$file"
done

echo -e "\n3. 🎨 Design System Usage:"
echo "Components in manifest: $(cat design-system/components.manifest.json | grep -o '"[^"]*":' | wc -l)"
echo "Design tokens: $(cat design-system/tokens.json | grep -o '"[^"]*":' | wc -l)"

echo -e "\n4. 🚀 Quick Test Options:"
echo "   React: npx create-react-app test-app && cp src/pages/*.jsx test-app/src/"
echo "   Angular: ng new test-app && cp src/pages/*.component.ts test-app/src/app/"
echo "   Storybook: npx storybook@latest init"
echo "   Preview: open test-preview.html"

echo -e "\n5. 🔧 Test Generation:"
echo "   React: npm run ai:demo"
echo "   Angular: npm run ai:demo:angular"