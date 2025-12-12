# GitHub Actions Learning Guide

A progressive guide from basic to advanced GitHub Actions workflows.

## Quick Navigation

- **[Part 1: Fundamentals](#part-1-fundamentals)** - Basic concepts and structure
- **[Part 2: Common Tasks](#part-2-common-tasks)** - Real-world workflow examples
- **[Part 3: Advanced Patterns](#part-3-advanced-patterns)** - Complex scenarios and optimization
- **[Part 4: Best Practices](#part-4-best-practices)** - Production-ready patterns
- **[Examples Directory](/docs/examples/)** - Ready-to-use workflow files

---

## Part 1: Fundamentals

### 1.1 What is GitHub Actions?

GitHub Actions is GitHub's native CI/CD platform that allows you to automate tasks directly in your repository:
- **Triggered by events** (push, pull request, schedule, etc.)
- **Runs on GitHub-hosted or self-hosted runners**
- **Free for public repos, included minutes for private repos**
- **YAML-based workflow definition**

### 1.2 Core Concepts

#### Workflow
A workflow is an automated process defined in YAML. Stored in `.github/workflows/` directory.

```yaml
name: My First Workflow
on: push
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Hello, GitHub Actions!"
```

#### Event
Triggers that start a workflow:
- `push` - Code pushed to repository
- `pull_request` - PR opened/updated
- `schedule` - Cron-based triggers
- `workflow_dispatch` - Manual trigger

#### Job
A set of steps running on the same runner. Jobs run in parallel by default.

#### Step
Individual task within a job. Can run commands or use actions.

#### Action
Reusable units of code. Can be Docker containers, JavaScript, or composite actions.

#### Runner
The machine running your workflow (Ubuntu, macOS, Windows, or self-hosted).

### 1.3 Your First Workflow

**File:** `.github/workflows/01-hello-world.yml`

```yaml
name: Hello World
on: push

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - name: Print greeting
        run: echo "Hello, World!"
```

**What happens:**
1. Any push to the repo triggers this workflow
2. Starts an Ubuntu runner
3. Executes the `echo` command
4. Done!

---

## Part 2: Common Tasks

### 2.1 Checking Out Code

Most workflows need the repository code. Use the `checkout` action:

**File:** `.github/workflows/02-checkout.yml`

```yaml
name: Checkout Example
on: push

jobs:
  work-with-code:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: List files
        run: ls -la
      
      - name: Check Node version
        run: node --version
```

**Key points:**
- `uses:` loads an action from GitHub marketplace
- `@v4` specifies the version (always use specific versions for reproducibility)
- Code is checked out to `$GITHUB_WORKSPACE` directory

### 2.2 Working with Node.js

**File:** `.github/workflows/03-nodejs.yml`

```yaml
name: Node.js Setup
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'  # Caches node_modules
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
```

**Caching:**
- `cache: 'npm'` automatically caches dependencies
- Significantly speeds up workflows
- Also works with `yarn`, `pnpm`

### 2.3 Environment Variables

**File:** `.github/workflows/04-env-vars.yml`

```yaml
name: Environment Variables
on: push

env:
  GLOBAL_VAR: "Available in all jobs"

jobs:
  demo:
    runs-on: ubuntu-latest
    env:
      JOB_VAR: "Available in this job only"
    steps:
      - name: Use variables
        env:
          STEP_VAR: "Available in this step only"
        run: |
          echo "Global: $GLOBAL_VAR"
          echo "Job: $JOB_VAR"
          echo "Step: $STEP_VAR"
```

**GitHub-provided variables:**
- `$GITHUB_EVENT_NAME` - Event that triggered workflow
- `$GITHUB_REF` - Branch or tag ref
- `$GITHUB_SHA` - Commit SHA
- `$GITHUB_ACTOR` - User who triggered workflow
- [See all default variables](https://docs.github.com/en/actions/learn-github-actions/variables#default-variables)

### 2.4 Using Secrets

Never hardcode sensitive data. Use GitHub Secrets instead.

**Setup in GitHub:**
1. Go to repo Settings → Secrets and Variables → Actions
2. Click "New repository secret"
3. Add name and value

**File:** `.github/workflows/05-secrets.yml`

```yaml
name: Using Secrets
on: push

jobs:
  secure-task:
    runs-on: ubuntu-latest
    steps:
      - name: Use secret
        run: echo "Username is ${{ secrets.DB_USERNAME }}"
        # Password never echoed, but available to commands
        env:
          DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
```

**Security rules:**
- Secrets are masked in logs (show as `***`)
- Never log secrets
- Use them only in environment variables or action inputs
- Each job can access only necessary secrets

### 2.5 Conditional Execution

**File:** `.github/workflows/06-conditionals.yml`

```yaml
name: Conditional Steps
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install only on main branch
        if: github.ref == 'refs/heads/main'
        run: npm install
      
      - name: Deploy only if file changed
        if: contains(github.event.head_commit.modified, 'package.json')
        run: npm run deploy
      
      - name: Notify on failure
        if: failure()
        run: echo "Job failed!"
      
      - name: Notify on success
        if: success()
        run: echo "Job succeeded!"
```

**Common conditions:**
- `if: github.ref == 'refs/heads/main'` - Specific branch
- `if: contains(...)` - Check if string contains value
- `if: startsWith(...)` - String starts with
- `if: success()` - Previous steps succeeded
- `if: failure()` - Previous steps failed
- `if: always()` - Always run

---

## Part 3: Advanced Patterns

### 3.1 Matrix Builds

Test across multiple versions simultaneously:

**File:** `.github/workflows/07-matrix.yml`

```yaml
name: Matrix Build
on: push

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node ${{ matrix.node-version }} on ${{ matrix.os }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - run: npm test
```

**Result:** Creates 9 jobs (3 OS × 3 Node versions)

**Advanced matrix:**

```yaml
strategy:
  matrix:
    include:
      - os: ubuntu-latest
        node: 18
        npm-version: 9
      - os: windows-latest
        node: 20
        npm-version: 10
  exclude:
    - os: macos-latest
      node: 16  # Don't test this combination
```

### 3.2 Job Dependencies

Control job execution order:

**File:** `.github/workflows/08-job-dependencies.yml`

```yaml
name: Job Dependencies
on: push

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Setup complete"
  
  build:
    needs: setup  # Wait for 'setup' job
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."
  
  test:
    needs: build  # Wait for 'build' job
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing..."
  
  deploy:
    needs: [build, test]  # Wait for multiple jobs
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."
```

### 3.3 Artifacts and Caching

**Store and retrieve files between jobs:**

**File:** `.github/workflows/09-artifacts.yml`

```yaml
name: Artifacts
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install && npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-output
          path: dist/
          retention-days: 5
  
  test-artifacts:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-output
          path: ./dist
      
      - run: echo "Testing build artifacts..."
```

**Cache for dependencies (faster builds):**

```yaml
- name: Cache Node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### 3.4 Docker in Workflows

**Build and push Docker images:**

**File:** `.github/workflows/10-docker.yml`

```yaml
name: Docker Build
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/my-app:latest
            ${{ secrets.DOCKER_USERNAME }}/my-app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 3.5 Manual Workflow Dispatch

Allow manually triggering workflows with inputs:

**File:** `.github/workflows/11-manual-trigger.yml`

```yaml
name: Manual Deploy
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        type: choice
        options:
          - staging
          - production
      verbose:
        description: 'Enable verbose logging'
        required: false
        type: boolean
        default: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ${{ github.event.inputs.environment }}
        run: echo "Deploying to ${{ github.event.inputs.environment }}"
      
      - name: Verbose mode
        if: github.event.inputs.verbose == 'true'
        run: echo "Verbose output enabled"
```

**Trigger from GitHub UI:** Actions → Manual Deploy → Run workflow

---

## Part 4: Best Practices

### 4.1 Security

**File:** `.github/workflows/12-security-best-practices.yml`

```yaml
name: Security Best Practices
on: push

jobs:
  secure:
    runs-on: ubuntu-latest
    steps:
      # ✅ DO: Use specific action versions
      - uses: actions/checkout@v4
      
      # ❌ DON'T: Use @main or @master
      # - uses: some-action@main
      
      # ✅ DO: Mask sensitive output
      - name: Process secrets
        run: |
          echo "::add-mask::${{ secrets.API_KEY }}"
          echo "::notice::This notice won't contain secrets"
      
      # ✅ DO: Use GITHUB_OUTPUT for sharing data between steps
      - name: Generate value
        id: generator
        run: echo "value=hello" >> $GITHUB_OUTPUT
      
      - name: Use output
        run: echo "Value is ${{ steps.generator.outputs.value }}"
      
      # ❌ DON'T: Store secrets in environment without using them
      # ✅ DO: Only expose secrets where needed
      - name: Secure operation
        env:
          SECRET: ${{ secrets.MY_SECRET }}
        run: some-command  # Uses $SECRET only as needed
```

### 4.2 Workflow Organization

**File:** `.github/workflows/13-organization.yml`

```yaml
name: Well-Organized Workflow

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  # Centralized configuration
  NODE_VERSION: '18'
  REGISTRY: ghcr.io

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run lint
  
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run test:coverage
      
      - name: Upload coverage
        if: always()
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
  
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run build
      
      - name: Upload build
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
  
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Download build
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/
      - run: echo "Deploying..."
```

### 4.3 Reusable Workflows

**File:** `.github/workflows/shared-build.yml`

```yaml
name: Shared Build Workflow
on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: '18'
    secrets:
      npm-token:
        required: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run build
```

**File:** `.github/workflows/use-shared-build.yml`

```yaml
name: Using Shared Workflow
on: push

jobs:
  call-shared-workflow:
    uses: ./.github/workflows/shared-build.yml
    with:
      node-version: '20'
    secrets:
      npm-token: ${{ secrets.NPM_TOKEN }}
```

### 4.4 Performance Optimization

```yaml
name: Optimized Workflow
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Checkout with depth for faster clone
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1
      
      # Setup with caching
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: npm
      
      # Use ci instead of install (faster, more reliable)
      - run: npm ci
      
      # Parallel tests
      - run: npm run test -- --parallel
      
      # Cancel on failure to save time
      - run: npm run lint
      
      # Upload only if changed
      - name: Upload artifact
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: results
          path: results/
```

---

## Quick Reference

### Trigger Events

```yaml
on:
  push:
    branches: [main, develop]
    tags: [v*]
  pull_request:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:
  release:
    types: [published]
```

### Context Variables

```yaml
- run: |
    echo "Branch: ${{ github.ref }}"
    echo "Commit: ${{ github.sha }}"
    echo "Event: ${{ github.event_name }}"
    echo "Actor: ${{ github.actor }}"
    echo "Repository: ${{ github.repository }}"
```

### Status Checks

```yaml
if: success()      # Previous step succeeded
if: failure()      # Previous step failed
if: always()       # Always run
if: cancelled()    # Workflow was cancelled
```

---

## Resources

- [Official GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow syntax reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Best practices](https://docs.github.com/en/actions/guides)

---

## Next Steps

1. Create your first workflow in `.github/workflows/`
2. Explore the examples in `/docs/examples/`
3. Read the official documentation for deeper understanding
4. Practice with your own projects
5. Check out the Advanced Patterns section when ready
