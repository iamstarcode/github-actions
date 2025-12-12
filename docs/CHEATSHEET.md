# GitHub Actions Cheat Sheet

Quick reference for common GitHub Actions patterns and syntax.

## File Structure

```
.github/
└── workflows/
    ├── ci.yml
    ├── deploy.yml
    └── scheduled-tasks.yml
```

## Basic Workflow Structure

```yaml
name: Workflow Name

on: push  # Trigger event

jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello"
```

## Triggers

```yaml
on: push                    # Any push
on: pull_request           # PR opened/updated
on: release                # Release published

on:
  push:
    branches: [main]       # Specific branches
    tags: [v*]             # Specific tags
    paths: [src/**]        # Specific paths

on:
  schedule:
    - cron: '0 0 * * *'   # Daily at midnight UTC

on:
  workflow_dispatch:       # Manual trigger
    inputs:
      name:
        description: 'Name'
        required: true
        type: string

on:
  pull_request:
    types: [opened, synchronize, reopened]
```

## Runners

```yaml
runs-on: ubuntu-latest     # Ubuntu
runs-on: macos-latest      # macOS
runs-on: windows-latest    # Windows
runs-on: self-hosted       # Self-hosted
runs-on: [ubuntu-latest, macos-latest]  # Multiple
```

## Steps

```yaml
steps:
  # Run command
  - run: npm install
  
  # Run multi-line
  - run: |
      npm install
      npm test
  
  # Use action
  - uses: actions/checkout@v4
  
  # Use action with inputs
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
  
  # With name
  - name: Install dependencies
    run: npm install
  
  # With environment variables
  - run: npm test
    env:
      NODE_ENV: test
  
  # With condition
  - if: github.ref == 'refs/heads/main'
    run: npm run deploy
  
  # With ID for outputs
  - id: build
    run: echo "value=123" >> $GITHUB_OUTPUT
  
  # Use output from previous step
  - run: echo ${{ steps.build.outputs.value }}
```

## Conditionals

```yaml
if: success()              # Previous step succeeded
if: failure()              # Previous step failed
if: always()               # Always run
if: cancelled()            # Workflow cancelled

if: github.ref == 'refs/heads/main'           # Main branch
if: github.event_name == 'push'               # Push event
if: startsWith(github.ref, 'refs/tags/v')    # Tag starts with v
if: contains(github.event.head_commit.modified, 'package.json')  # File changed

if: ${{ secrets.SECRET != '' }}  # Secret exists
if: github.actor == 'dependabot' # Specific actor
```

## Environment Variables

```yaml
env:
  GLOBAL: value            # Available everywhere

jobs:
  job:
    env:
      JOB_VAR: value      # Job-level variable
    steps:
      - env:
          STEP_VAR: value # Step-level variable
        run: echo $STEP_VAR
```

## GitHub Context

```yaml
${{ github.event_name }}      # Event type
${{ github.ref }}              # Branch/tag ref
${{ github.sha }}              # Commit SHA
${{ github.actor }}            # User who triggered
${{ github.repository }}       # Owner/repo
${{ github.workspace }}        # Working directory
${{ github.run_id }}           # Workflow run ID
${{ github.run_number }}       # Workflow run number
${{ github.event.inputs.name }} # Workflow input
```

## Secrets and Variables

```yaml
# Use secret (masked in logs)
- run: echo ${{ secrets.API_KEY }}

# Use repository variable
- run: echo ${{ vars.API_URL }}

# Environment variable from secret
env:
  API_KEY: ${{ secrets.API_KEY }}
run: curl -H "Auth: $API_KEY" https://...
```

## Job Dependencies

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
  
  build:
    needs: setup           # Wait for setup
  
  test:
    needs: build          # Wait for build
  
  deploy:
    needs: [build, test]  # Wait for multiple
```

## Matrix Builds

```yaml
strategy:
  matrix:
    node: [16, 18, 20]
    os: [ubuntu, macos, windows]

runs-on: ${{ matrix.os }}-latest
uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node }}
```

## Artifacts

```yaml
# Upload
- uses: actions/upload-artifact@v3
  with:
    name: build
    path: dist/
    retention-days: 7

# Download
- uses: actions/download-artifact@v3
  with:
    name: build
    path: ./dist
```

## Caching

```yaml
# Built-in cache
- uses: actions/setup-node@v4
  with:
    cache: npm

# Custom cache
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

## Common Actions

```yaml
# Checkout repo
- uses: actions/checkout@v4
  with:
    fetch-depth: 1

# Setup Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: npm

# Setup Python
- uses: actions/setup-python@v4
  with:
    python-version: '3.11'
    cache: pip

# Setup Java
- uses: actions/setup-java@v3
  with:
    java-version: '17'
    distribution: 'temurin'

# Setup Docker
- uses: docker/setup-buildx-action@v2

# Upload artifacts
- uses: actions/upload-artifact@v3

# Create GitHub Release
- uses: softprops/action-gh-release@v1

# GitHub Script
- uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.createComment({...})
```

## Outputs

```yaml
# Set output in step
- id: vars
  run: echo "version=1.0.0" >> $GITHUB_OUTPUT

# Use in same job
- run: echo ${{ steps.vars.outputs.version }}

# Set job output
jobs:
  build:
    outputs:
      version: ${{ steps.vars.outputs.version }}

# Use in other job
jobs:
  deploy:
    needs: build
    run: echo ${{ needs.build.outputs.version }}
```

## Permissions

```yaml
permissions:
  contents: read            # Read repo content
  contents: write           # Write to repo
  pull-requests: write      # Comment on PR
  issues: write             # Comment on issue
  packages: write           # Publish packages
  id-token: write           # OIDC token
```

## Docker

```yaml
# Build and push
- uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myrepo/myapp:latest

# Login
- uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}
```

## Failure Handling

```yaml
- run: npm test
  continue-on-error: true  # Don't fail job on error

- name: Upload if failed
  if: failure()
  uses: actions/upload-artifact@v3

- name: Notify on failure
  if: failure()
  run: echo "Job failed"

- name: Always run
  if: always()
  run: cleanup.sh
```

## Special Syntax

```yaml
# String interpolation
run: echo "Value is ${{ env.MY_VAR }}"

# Conditional with &&
run: npm install && npm test

# Multi-line string
run: |
  echo "Line 1"
  echo "Line 2"

# Array
uses: actions/setup-node@v4
with:
  node-version: ${{ fromJson(env.VERSIONS) }}

# Boolean
if: ${{ env.SKIP == 'true' }}
```

## Debugging

```yaml
# Set debug logging
- name: Debug
  run: npm test
  env:
    RUNNER_DEBUG: 1

# Print context
- run: |
    echo "Event: ${{ github.event }}"
    echo "Context: ${{ toJson(github) }}"

# Check available outputs
- run: |
    echo "Available outputs:"
    echo "SHA: ${{ github.sha }}"
    echo "Ref: ${{ github.ref }}"
```

## Reusable Workflows

```yaml
# Called workflow: .github/workflows/reusable.yml
name: Reusable
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '18'
    secrets:
      npm-token:
        required: true

# Calling workflow
jobs:
  build:
    uses: ./.github/workflows/reusable.yml
    with:
      node-version: '20'
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

## Common Patterns

### Run on main only
```yaml
if: github.ref == 'refs/heads/main'
```

### Run on tag push
```yaml
if: startsWith(github.ref, 'refs/tags/')
```

### Run on PR to main
```yaml
if: github.event_name == 'pull_request' && github.base_ref == 'main'
```

### Install and cache
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: npm
- run: npm ci
```

### Build matrix
```yaml
strategy:
  matrix:
    node: [16, 18, 20]
    os: [ubuntu-latest, macos-latest]
```

### Upload on fail
```yaml
- if: always()
  uses: actions/upload-artifact@v3
```

---

## Resources

- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- [Context and expression syntax](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
