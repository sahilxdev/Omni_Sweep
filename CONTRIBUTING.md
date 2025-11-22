# Contributing to OmniSweep

Thank you for your interest in contributing to OmniSweep! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** (recommended) or npm
- **Foundry** for smart contract development
- **Git** for version control

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/sahilxdev/Omni_Sweep.git
cd Omni_Sweep
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
pnpm install

# Smart contracts
cd ../contracts
forge install
```

3. **Environment setup**
```bash
# Copy example env file
cp .env.example .env

# Add your keys
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
PYTH_API_KEY=your_pyth_key
```

4. **Run tests**
```bash
# Smart contracts
forge test

# Frontend
pnpm test
```

## 📁 Project Structure

```
Omni_Sweep/
├── contracts/           # Smart contracts
│   ├── src/
│   │   ├── OmniSweepCore.sol
│   │   ├── interfaces/
│   │   └── libraries/
│   ├── test/
│   └── script/
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   └── public/
├── docs/               # Documentation
└── README.md
```

## 🛠️ Development Workflow

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

**Example:** `feature/world-id-integration`

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(contract): add Pyth price verification
fix(frontend): resolve wallet connection issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test thoroughly**
```bash
# Run all tests
forge test
pnpm test

# Run linter
pnpm lint

# Format code
pnpm format
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add new feature"
```

5. **Push to GitHub**
```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what you changed and why
   - Include screenshots for UI changes

7. **Code Review**
   - Address reviewer feedback
   - Keep discussions constructive
   - Update your PR as needed

## ✅ Code Standards

### Smart Contracts

- **Style Guide:** Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Comments:** Use NatSpec for all public/external functions
- **Gas Optimization:** Prioritize readability over micro-optimizations
- **Security:** Run slither and mythril before PR

```solidity
/// @notice Sweeps dust tokens and bridges to destination chain
/// @param tokens Array of token addresses to sweep
/// @param amounts Array of token amounts
/// @return netOutput Amount received after gas deduction
function sweepDustWithGasRefund(
    address[] calldata tokens,
    uint256[] calldata amounts
) external returns (uint256 netOutput) {
    // Implementation
}
```

### Frontend (TypeScript/React)

- **Style Guide:** Airbnb JavaScript Style Guide
- **Formatting:** Prettier with project config
- **Linting:** ESLint with TypeScript support
- **Components:** Use functional components with hooks
- **Types:** Prefer explicit types over `any`

```typescript
interface SweepParams {
  tokens: Address[];
  amounts: bigint[];
  destinationChain: number;
}

export const useSweepDust = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const sweepDust = async (params: SweepParams) => {
    // Implementation
  };
  
  return { sweepDust, isLoading };
};
```

### Testing Requirements

#### Smart Contracts
- **Unit tests** for all public functions
- **Integration tests** for cross-contract interactions
- **Fork tests** for DEX/Bridge integrations
- **Minimum 80% coverage**

```solidity
function testSweepDustSuccess() public {
    // Setup
    uint256[] memory amounts = new uint256[](2);
    amounts[0] = 100e6; // 100 USDC
    amounts[1] = 0.05e18; // 0.05 ETH
    
    // Execute
    uint256 output = omniSweep.sweepDustWithGasRefund(tokens, amounts);
    
    // Assert
    assertGt(output, 0, "Should receive positive output");
}
```

#### Frontend
- **Component tests** with React Testing Library
- **Hook tests** with renderHook
- **E2E tests** for critical user flows
- **Minimum 70% coverage**

```typescript
describe('SweepButton', () => {
  it('should disable when wallet not connected', () => {
    const { getByRole } = render(<SweepButton />);
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

## 🐛 Bug Reports

### Before Submitting
- Check existing issues for duplicates
- Test on latest version
- Gather reproduction steps

### Bug Report Template
```markdown
**Description**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Wallet: [e.g., Coinbase Wallet]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
What other solutions did you consider?

**Additional Context**
Any other relevant information
```

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Eligible for future bounties/rewards

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all.

### Our Standards
- **Be respectful** of differing viewpoints
- **Be collaborative** and constructive
- **Focus on** what is best for the community
- **Show empathy** towards other community members

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

### Enforcement
Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to: [maintainer email]

## 📞 Getting Help

- **Discord:** [Coming Soon]
- **GitHub Discussions:** For general questions
- **GitHub Issues:** For bugs and feature requests
- **Twitter:** [@OmniSweep](https://twitter.com/OmniSweep) [Coming Soon]

## 🎯 Priority Areas

We're especially interested in contributions for:

1. **Multi-chain support** - Add new chain integrations
2. **Gas optimization** - Reduce transaction costs
3. **UI/UX improvements** - Better user experience
4. **Documentation** - Tutorials, guides, translations
5. **Testing** - More comprehensive test coverage

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to OmniSweep! 🌊**

Every contribution, no matter how small, helps make crypto more accessible.
