#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install additional dependencies for development
echo "Installing development dependencies..."
npm install -D @types/node @types/react @types/react-dom typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint eslint-config-next prettier prettier-plugin-tailwindcss husky lint-staged @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio

# Initialize Prisma
echo "Initializing Prisma..."
npx prisma generate

# Create initial migration
echo "Creating initial database migration..."
npx prisma migrate dev --name init

# Initialize Git repository
echo "Initializing Git repository..."
git init
git add .
git commit -m "Initial commit"

# Initialize Husky
echo "Setting up Husky..."
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

# Create .env file from example
echo "Creating .env file..."
cp .env.example .env

echo "Setup complete! 🎉"
echo "Next steps:"
echo "1. Update the .env file with your configuration"
echo "2. Start the development server with 'npm run dev'"
echo "3. Open http://localhost:3000 in your browser" 