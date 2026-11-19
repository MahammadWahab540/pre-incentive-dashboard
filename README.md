# NxtWave PRE Incentive Calculator Dashboard

A clean, responsive, production-ready PRE Incentive Dashboard built for NxtWave operations managers. It allows managers to select a PRE executive, enter monthly verified outcomes, and instantly calculate eligible incentives based on standard bonus tiers and employee-specific multiplier adjustments while strictly maintaining salary confidentiality.

🌐 **Live Deployment**: [https://pre-incentive-dashboard.pages.dev](https://pre-incentive-dashboard.pages.dev)

---

## Features

- **Searchable Executive Selector**: Search and select across all 43 PRE executives by name or email.
- **Instant Reactive Recalculation**: Instant recalculation as outcomes change with positive integer validation.
- **Strict Salary Confidentiality**: CTC and salary figures are never stored or exposed. Public API endpoints never leak adjustment percentages or internal compensation multipliers.
- **NA Configuration Guardrail**: Automatically displays *"Incentive configuration unavailable"* for NA policy executives instead of assuming 0%.
- **Milestone Tracker**: Visual progression bar across all 6 tiers (50 $\rightarrow$ 55 $\rightarrow$ 60 $\rightarrow$ 65 $\rightarrow$ 70 $\rightarrow$ 75), highlighting achieved milestones and additional bonus available at the next milestone.
- **Apple-Inspired Design**: Clean neutral aesthetic, high-contrast typography, and responsive mobile/desktop layouts.

---

## Incentive Structure

### Base Bonus Tiers

| Monthly Outcomes | Base Bonus |
|---|---|
| 50 | ₹10,000 |
| 55 | ₹12,500 |
| 60 | ₹18,000 |
| 65 | ₹20,000 |
| 70 | ₹30,000 |
| 75 | ₹35,000 |

### Multiplier Formula

$$\text{Final Incentive} = \text{Base Bonus} \times \left(1 + \frac{\text{Adjustment Percentage}}{100}\right)$$

- Multipliers supported from `+40%` (1.40) down to `-30%` (0.70).
- Outcomes $< 50$ yield ₹0 base bonus, targeting 50 outcomes.
- Outcomes $\ge 75$ are capped at the 75-outcome tier (₹35,000 base).

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend / Edge Functions**: Express.js, TypeScript, Cloudflare Pages Edge Functions
- **Testing**: Vitest (50/50 unit and integration tests passing)
- **Deployment**: Cloudflare Pages

---

## Local Development

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Run automated test suite
npm run test:server

# 3. Start local development servers
npm run dev:server   # Backend API on port 3001
npm run dev:client   # Frontend on http://localhost:5173
```
