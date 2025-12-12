# GitHub Actions Learning Path

A structured guide to progress from beginner to advanced GitHub Actions mastery.

## Phase 1: Foundations (Week 1)

### Goals
- Understand GitHub Actions core concepts
- Create your first workflow
- Learn basic YAML syntax

### Tasks

1. **Read the basics**
   - Go through [GITHUB_ACTIONS_GUIDE.md Part 1: Fundamentals](../GITHUB_ACTIONS_GUIDE.md#part-1-fundamentals)
   - Understand: Workflow, Job, Step, Action, Runner, Event

2. **Create hello-world workflow**
   - Copy `.github/workflows/01-hello-world.yml` from examples
   - Push to your repo
   - Check Actions tab to see it run
   - Modify to print different messages

3. **Learn GitHub context**
   - Modify workflow to print `github.ref`, `github.sha`, `github.actor`
   - Push to different branches to see values change
   - Push tags to see difference

4. **Try triggers**
   - Add `on: [push, pull_request]`
   - Create a PR and see workflow run
   - Try different trigger events

### Checkpoint
- [ ] Created and executed a workflow
- [ ] Understand GitHub context variables
- [ ] Can modify trigger events

---

## Phase 2: Common Tasks (Week 2)

### Goals
- Build real workflows for common tasks
- Learn environment variables and secrets
- Handle conditionals

### Tasks

1. **Node.js workflow**
   - Review [02-nodejs-build-test.yml](./examples/02-nodejs-build-test.yml)
   - Create it in your repo
   - Adapt it to your project structure
   - Ensure linting and tests run

2. **Environment variables**
   - Study [CHEATSHEET.md - Environment Variables](./CHEATSHEET.md#environment-variables)
   - Create workflow: `.github/workflows/env-demo.yml`
   - Set variables at different levels (global, job, step)
   - Print and verify each

3. **Secrets handling**
   - Add a test secret in GitHub Settings
   - Create workflow that uses it
   - Verify it appears masked in logs
   - Never commit secrets to repo

4. **Conditionals**
   - Review conditional patterns in [CHEATSHEET.md](./CHEATSHEET.md#conditionals)
   - Create workflow with `if:` conditions
   - Test different branches and conditions
   - Verify jobs run/skip as expected

5. **Artifacts**
   - Study [07-artifacts-caching.yml](./examples/07-artifacts-caching.yml)
   - Create a build workflow that uploads artifacts
   - Create a test job that downloads and uses artifacts
   - Download artifacts from GitHub UI

### Checkpoint
- [ ] Built Node.js workflow with tests
- [ ] Can use environment variables at different levels
- [ ] Understand secrets and how to use them safely
- [ ] Created conditional steps that run/skip correctly
- [ ] Uploaded and downloaded artifacts between jobs

---

## Phase 3: Intermediate Patterns (Week 3)

### Goals
- Master job orchestration
- Use matrix builds for testing
- Understand job outputs
- Deploy conditionally

### Tasks

1. **Job dependencies**
   - Review job structure in [05-conditional-deployment.yml](./examples/05-conditional-deployment.yml)
   - Understand `needs:` and execution order
   - Create a 4-job workflow: setup → build → test → deploy
   - Visualize job graph in GitHub Actions UI

2. **Matrix builds**
   - Study [03-matrix-build.yml](./examples/03-matrix-build.yml)
   - Create workflow testing multiple Node versions
   - Test on different OS (ubuntu, macos)
   - Examine how many jobs get created

3. **Job outputs**
   - Create job that generates outputs (version number, commit hash)
   - Pass outputs to dependent jobs
   - Use outputs in conditionals
   - Log all outputs for verification

4. **Conditional deployment**
   - Study [05-conditional-deployment.yml](./examples/05-conditional-deployment.yml)
   - Create workflow with environment-specific deployments
   - Deploy to staging on develop branch
   - Deploy to production on main branch only
   - Use `environment:` protection rules

5. **Caching**
   - Implement npm caching in your workflow
   - Compare build times with/without cache
   - Understand cache keys
   - Test cache invalidation

### Checkpoint
- [ ] Created multi-job workflows with correct dependencies
- [ ] Matrix build testing multiple versions
- [ ] Passing data between jobs via outputs
- [ ] Conditional deployments to different environments
- [ ] Implemented caching for faster builds

---

## Phase 4: Advanced Patterns (Week 4)

### Goals
- Docker integration
- Scheduled workflows
- Manual triggers with inputs
- Reusable workflows
- PR automation

### Tasks

1. **Docker workflows**
   - Review [04-docker-build-push.yml](./examples/04-docker-build-push.yml)
   - Create Docker login and build workflow
   - Push to Docker Hub (use free tier)
   - Tag with commit SHA and branch
   - Test Docker image works

2. **Scheduled workflows**
   - Study [08-scheduled-workflow.yml](./examples/08-scheduled-workflow.yml)
   - Create daily scheduled workflow
   - Add security audit (npm audit)
   - Test with workflow_dispatch trigger
   - Set up notifications on failure

3. **Manual deployments**
   - Review [09-manual-deployment.yml](./examples/09-manual-deployment.yml)
   - Create workflow with workflow_dispatch inputs
   - Accept environment and version parameters
   - Validate inputs
   - Implement conditional deployment

4. **PR workflows**
   - Study [10-pull-request-workflow.yml](./examples/10-pull-request-workflow.yml)
   - Create PR-specific workflow
   - Add code quality checks
   - Comment on PRs with results
   - Auto-merge dependabot PRs

5. **Reusable workflows**
   - Create a reusable workflow for your standard build/test
   - Import it in multiple workflows
   - Pass different inputs to reuse code
   - Reduce duplication

### Checkpoint
- [ ] Docker image built and pushed from workflow
- [ ] Scheduled workflow executing on cron
- [ ] Manual trigger with user inputs
- [ ] PR workflow with quality checks and comments
- [ ] Reusable workflow reducing duplication

---

## Phase 5: Production Ready (Week 5+)

### Goals
- Best practices and security
- Performance optimization
- Monitoring and observability
- Real-world integration

### Tasks

1. **Security hardening**
   - Review [GITHUB_ACTIONS_GUIDE.md Part 4: Best Practices](../GITHUB_ACTIONS_GUIDE.md#part-4-best-practices)
   - Use pinned action versions (not @main)
   - Implement least privilege with permissions
   - Use environment secrets properly
   - Add security scanning (dependency check, code scan)

2. **Performance optimization**
   - Implement parallel jobs where possible
   - Use caching effectively
   - Minimize checkout with `fetch-depth: 1`
   - Use `npm ci` instead of `npm install`
   - Profile workflow run times

3. **Error handling**
   - Study failure conditions: success(), failure(), always()
   - Implement proper error handling
   - Add notifications on failure
   - Retry critical steps
   - Clean up resources on failure

4. **Monitoring**
   - Set up workflow failure notifications
   - Integrate with Slack/email
   - Track build times and trends
   - Monitor artifact storage usage
   - Log important events

5. **Real-world integration**
   - Integrate with code quality tools (SonarCloud, CodeClimate)
   - Set up automated releases
   - Deploy to multiple environments
   - Integrate with deployment platforms
   - Implement approval gates for production

### Checkpoint
- [ ] Workflows follow all security best practices
- [ ] Optimized for speed with parallel execution and caching
- [ ] Proper error handling and notifications
- [ ] Integrated with external services
- [ ] Production-ready and well-documented

---

## Daily Practice Exercises

### Exercise 1: Create Workflow from Scratch
**Time: 30 minutes**

Create a workflow for a new feature without looking at examples:
1. Checkout code
2. Install dependencies
3. Run linter
4. Run tests
5. Build project
6. Upload artifacts

Difficulty: Start easy, add matrix builds, then add deployment.

### Exercise 2: Troubleshoot Failing Workflow
**Time: 20 minutes**

Debug provided broken workflows:
1. Identify why workflow fails
2. Read error messages carefully
3. Fix the issue
4. Verify it passes
5. Explain what was wrong

[Create broken examples to debug]

### Exercise 3: Optimize a Workflow
**Time: 25 minutes**

Take a working workflow and improve it:
1. Add caching
2. Parallelize jobs
3. Reduce checkout depth
4. Add conditional skips
5. Compare before/after timing

### Exercise 4: Add Feature to Existing Workflow
**Time: 15 minutes**

Add one new feature to an existing workflow:
1. Add matrix testing
2. Add artifact upload
3. Add conditional step
4. Add environment variable
5. Add manual trigger input

---

## Building Your Own Workflows

### Template: Complete CI/CD Pipeline

Use this as a template for your projects:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  lint:
    # Linting job
  test:
    needs: lint
    # Testing job
  build:
    needs: lint
    # Build job
  security:
    # Security checks
  staging-deploy:
    needs: [test, build]
    if: github.ref == 'refs/heads/develop'
    # Deploy to staging
  production-deploy:
    needs: [test, build]
    if: github.ref == 'refs/heads/main'
    environment: production
    # Deploy to production
```

### Common Workflow Checklist

When creating workflows, ensure:

- [ ] Clear, descriptive workflow name
- [ ] Appropriate trigger events
- [ ] Proper job dependencies
- [ ] Meaningful step names
- [ ] Error handling (always(), failure())
- [ ] Artifact uploads for important outputs
- [ ] Caching where applicable
- [ ] Environment variables for configuration
- [ ] Secrets for sensitive data
- [ ] Conditionals for branch-specific logic
- [ ] Notifications on failure
- [ ] Documentation in comments

---

## Resources & Next Steps

### Official Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Contexts Reference](https://docs.github.com/en/actions/learn-github-actions/contexts)

### Useful Tools & Services
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions)
- [GitHub Script Action](https://github.com/actions/github-script)
- [Super-Linter](https://github.com/super-linter/super-linter)

### Community & Help
- [GitHub Community Discussions](https://github.com/orgs/community/discussions)
- [GitHub Actions Issues](https://github.com/actions/toolkit/issues)
- Stack Overflow: Search `github-actions` tag

### Keep Learning
- Explore workflows from popular open-source projects
- Contribute to projects and learn from their workflows
- Experiment with new actions from the marketplace
- Stay updated with GitHub blog for new features

---

## Success Metrics

By the end of this learning path, you should be able to:

✓ Write YAML workflows without looking at examples  
✓ Understand all core GitHub Actions concepts  
✓ Create secure, optimized workflows  
✓ Debug failing workflows efficiently  
✓ Implement CI/CD for your projects  
✓ Use advanced patterns (matrix, reusable, etc.)  
✓ Integrate with external services  
✓ Help others with their workflows  

---

## Notes for Your Journey

- **Start simple**: Master basics before advanced patterns
- **Practice regularly**: Create workflows for real projects
- **Read error messages**: They usually tell you what's wrong
- **Check logs carefully**: GitHub shows detailed execution logs
- **Use examples**: The provided examples are real workflows
- **Experiment safely**: Use development/staging branches to test
- **Document your workflows**: Comments help future maintainers
- **Keep it DRY**: Use reusable workflows to reduce repetition

Good luck! 🚀
