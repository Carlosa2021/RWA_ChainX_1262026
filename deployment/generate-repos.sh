#!/bin/bash

# ChainX RWA Repository Generator Script
# Generates customized repositories for each plan tier

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SOURCE_REPO="RWA_InmoToken"
DEPLOYMENT_DIR="deployment"
TEMPLATES_DIR="$DEPLOYMENT_DIR/templates"

# Plans configuration
declare -A PLANS=(
    ["starter"]="chainx-rwa-starter"
    ["pro"]="chainx-rwa-pro" 
    ["enterprise"]="chainx-rwa-enterprise"
)

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to generate repository for a specific plan
generate_repo() {
    local plan=$1
    local repo_name=${PLANS[$plan]}
    local template_file="$TEMPLATES_DIR/.env.$plan"
    
    print_status "Generating repository for $plan plan: $repo_name"
    
    # Check if template exists
    if [[ ! -f "$template_file" ]]; then
        print_error "Template file not found: $template_file"
        return 1
    fi
    
    # Create target directory
    local target_dir="../$repo_name"
    
    if [[ -d "$target_dir" ]]; then
        print_warning "Directory $target_dir already exists. Do you want to overwrite? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            print_status "Skipping $plan plan"
            return 0
        fi
        rm -rf "$target_dir"
    fi
    
    # Copy source repository
    print_status "Copying source repository..."
    cp -r "." "$target_dir"
    
    # Navigate to target directory
    cd "$target_dir"
    
    # Copy appropriate .env template
    print_status "Configuring environment for $plan plan..."
    cp "$TEMPLATES_DIR/.env.$plan" ".env.local"
    cp "$TEMPLATES_DIR/.env.$plan" ".env.production"
    
    # Update package.json
    print_status "Updating package.json..."
    if command -v jq &> /dev/null; then
        jq --arg name "$repo_name" '.name = $name' package.json > package.json.tmp
        mv package.json.tmp package.json
    else
        print_warning "jq not found. Please manually update package.json name to: $repo_name"
    fi
    
    # Create plan-specific README
    print_status "Creating plan-specific README..."
    cat > README.md << EOF
# $repo_name

ChainX RWA Platform - $(echo $plan | tr '[:lower:]' '[:upper:]') Plan

## Plan Features

$(case $plan in
    "starter")
        echo "- ✅ 1 Property maximum"
        echo "- ✅ Basic wallet functionality"
        echo "- ✅ Manual KYC process"
        echo "- ❌ AI Features disabled"
        echo "- ❌ Pay/Bridge/Vault disabled"
        echo "- ❌ Custom branding disabled"
        ;;
    "pro")
        echo "- ✅ 10 Properties maximum"
        echo "- ✅ AI Showcase enabled"
        echo "- ✅ Pay + Bridge enabled"
        echo "- ✅ Advanced analytics"
        echo "- ✅ Custom branding"
        echo "- ❌ Vault disabled (Enterprise only)"
        ;;
    "enterprise")
        echo "- ✅ Unlimited properties"
        echo "- ✅ Complete feature set"
        echo "- ✅ Pay + Bridge + Vault"
        echo "- ✅ White-label solution"
        echo "- ✅ Custom domain support"
        echo "- ✅ Priority support"
        ;;
esac)

## Installation

1. Clone this repository
2. Install dependencies: \`npm install\`
3. Configure environment variables in \`.env.local\`
4. Run development server: \`npm run dev\`

## Deployment

This repository is pre-configured for $(echo $plan | tr '[:lower:]' '[:upper:]') plan deployment.

### Vercel Deployment

1. Connect this repository to Vercel
2. Environment variables are pre-configured
3. Deploy automatically on push to main

### Manual Deployment

1. Build the project: \`npm run build\`
2. Start production server: \`npm start\`

## License

This is a licensed version of ChainX RWA Platform.
License: $(echo $plan | tr '[:lower:]' '[:upper:]') Plan

## Support

$(case $plan in
    "starter")
        echo "- 📧 Email support (48h response)"
        echo "- 📚 Documentation access"
        ;;
    "pro")
        echo "- 📧 Priority email support (24h response)"
        echo "- 💬 Chat support"
        echo "- 📚 Full documentation + tutorials"
        ;;
    "enterprise")
        echo "- 📞 Dedicated support manager"
        echo "- 💬 Slack channel support"
        echo "- 🛠️ Custom development support"
        echo "- 📚 White-label documentation"
        ;;
esac)

EOF

    # Initialize git repository
    print_status "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: ChainX RWA $plan plan"
    
    # Add remote if GitHub CLI is available
    if command -v gh &> /dev/null; then
        print_status "Creating GitHub repository..."
        gh repo create "$repo_name" --private --description "ChainX RWA Platform - $(echo $plan | tr '[:lower:]' '[:upper:]') Plan"
        git remote add origin "https://github.com/$(gh api user --jq .login)/$repo_name.git"
        git branch -M main
        git push -u origin main
        print_success "GitHub repository created and pushed: $repo_name"
    else
        print_warning "GitHub CLI not found. Please manually create repository and add remote:"
        print_warning "git remote add origin https://github.com/YOUR_USERNAME/$repo_name.git"
        print_warning "git push -u origin main"
    fi
    
    # Return to source directory
    cd - > /dev/null
    
    print_success "Repository generated successfully: $target_dir"
}

# Function to generate client-specific repository
generate_client_repo() {
    local plan=$1
    local client_name=$2
    local client_id=$3
    local repo_name="chainx-rwa-$plan-$client_id"
    
    print_status "Generating client-specific repository: $repo_name"
    
    # Generate base repository first
    generate_repo "$plan"
    
    # Customize for client
    local base_dir="../chainx-rwa-$plan"
    local client_dir="../$repo_name"
    
    if [[ -d "$client_dir" ]]; then
        rm -rf "$client_dir"
    fi
    
    cp -r "$base_dir" "$client_dir"
    cd "$client_dir"
    
    # Update client-specific configurations
    print_status "Customizing for client: $client_name"
    
    # Update .env files with client info
    sed -i.bak "s/NEXT_PUBLIC_CLIENT_NAME=.*/NEXT_PUBLIC_CLIENT_NAME=\"$client_name\"/" .env.local
    sed -i.bak "s/NEXT_PUBLIC_CLIENT_ID=.*/NEXT_PUBLIC_CLIENT_ID=\"$client_id\"/" .env.local
    
    # Generate unique license key
    local license_key="${plan^^}_${client_id}_$(date +%s | sha256sum | head -c 8)"
    sed -i.bak "s/NEXT_PUBLIC_LICENSE_KEY=.*/NEXT_PUBLIC_LICENSE_KEY=\"$license_key\"/" .env.local
    
    # Clean up backup files
    rm -f .env.local.bak .env.production.bak
    
    # Update README with client info
    sed -i.bak "s/ChainX RWA Platform/ChainX RWA Platform for $client_name/" README.md
    rm -f README.md.bak
    
    # Commit changes
    git add .
    git commit -m "Customize for client: $client_name"
    
    cd - > /dev/null
    
    print_success "Client repository generated: $client_dir"
    print_status "License Key: $license_key"
}

# Main script logic
main() {
    print_status "ChainX RWA Repository Generator"
    print_status "==============================="
    
    # Check if we're in the right directory
    if [[ ! -f "package.json" ]] || [[ ! -d "$TEMPLATES_DIR" ]]; then
        print_error "Please run this script from the root of RWA_InmoToken repository"
        print_error "Make sure $TEMPLATES_DIR directory exists"
        exit 1
    fi
    
    case "${1:-}" in
        "all")
            print_status "Generating all plan repositories..."
            for plan in "${!PLANS[@]}"; do
                generate_repo "$plan"
            done
            ;;
        "starter"|"pro"|"enterprise")
            generate_repo "$1"
            ;;
        "client")
            if [[ $# -lt 4 ]]; then
                print_error "Usage: $0 client <plan> <client_name> <client_id>"
                print_error "Example: $0 client pro \"Acme Corp\" acme_001"
                exit 1
            fi
            generate_client_repo "$2" "$3" "$4"
            ;;
        *)
            echo "Usage: $0 <command> [options]"
            echo ""
            echo "Commands:"
            echo "  all                           Generate all plan repositories"
            echo "  starter                       Generate starter plan repository"
            echo "  pro                          Generate pro plan repository" 
            echo "  enterprise                   Generate enterprise plan repository"
            echo "  client <plan> <name> <id>    Generate client-specific repository"
            echo ""
            echo "Examples:"
            echo "  $0 all"
            echo "  $0 pro"
            echo "  $0 client enterprise \"Big Corp\" bigcorp_001"
            exit 1
            ;;
    esac
    
    print_success "Repository generation completed!"
}

# Run main function with all arguments
main "$@"