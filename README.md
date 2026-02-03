# Gullak - Intelligent Personal Finance Management

**Gullak** is a sophisticated, digital financial assistant designed to bridge the gap between simple expense tracking and professional financial planning. Inspired by the analytical rigor of a Chartered Accountant, Gullak provides users with a comprehensive ecosystem to manage income, optimize debt, and build long-term wealth.

---

## The Problem

In today's complex financial landscape, many individuals struggle to maintain financial health despite having adequate income. The challenges are often multifaceted:

*   **Lack of Holistic Visibility**: Users typically check their bank balance to gauge financial health, failing to account for recurring liabilities, accrued interest, or net worth trends.
*   **The Debt Trap**: Loans and EMIs are often taken without a clear understanding of the long-term interest burden. Users rarely visualize how small prepayments can save lakhs in interest.
*   **Reactive vs. Proactive**: Most finance apps are reactive—they track where money *went*. They fail to tell users where money *should go* or alert them before they overspend.
*   **Data Fragmentation**: Financial data is scattered across bank statements, loan portals, and investment apps, making it difficult to get a unified "big picture" view.

## The Solution: Gullak

Gullak addresses these challenges by moving beyond passive tracking to active management. It treats your personal finance like a business, offering tools and insights previously reserved for corporate finance management.

### 1. The "Digital CA" Approach
Unlike standard budget apps, Gullak analyzes your data to find inefficiencies. It doesn't just show you a chart of high expenses; it flags actionable insights, such as "Your dining out expense is 15% of your income, which is 5% higher than recommended."

### 2. Strategic Debt Management
We believe debt optimization is the quickest path to wealth creation. Our EMI Optimization engine allows users to model various repayment scenarios, visually demonstrating how increasing an EMI by even a small fraction can drastically reduce loan tenure and interest outgo.

### 3. Unified Financial Ecosystem
Gullak serves as a central repository for all financial data—assets, liabilities, income, and expenses—providing a true Net Worth calculation that updates in real-time as you log transactions or pay down debt.

---

## detailed Features

### Core Modules

#### 1. Advanced EMI & Debt Optimizer
*   **Amortization Visualization**: Interactive charts showing the split between principal and interest for every payment.
*   **Prepayment Impact Engine**: A simulator that calculates exactly how much money and time you save by making one-time or recurring extra payments.
*   **Loan Comparison**: Tools to compare existing loans against current market offers to decide on balance transfers.

#### 2. Intelligent Expense Tracking
*   **Smart Categorization**: Expenses are categorized not just by type (Food, Travel) but by necessity (Needs vs. Wants), allowing for better budgeting.
*   **Budget Guards**: Set strict or soft limits for categories. Receive visual alerts as you approach your thresholds.
*   **Recurring Transaction Management**: Automated logging for fixed monthly expenses like rent, subscriptions, and utility bills.

#### 3. Financial Health Dashboard
*   **Net Worth Tracker**: A real-time graph showing Total Assets minus Total Liabilities.
*   **Financial Health Score**: An algorithmic score (0-100) derived from your savings rate, debt-to-income ratio, and spending consistency.
*   **Monthly Reports**: Automated summaries at the end of each month highlighting achievements and areas for improvement.

#### 4. Knowledge & Learning Hub
*   **Contextual Education**: If a user has high credit card debt, the app surfaces articles on "The Avalanche vs. Snowball Method" of debt repayment.
*   **Curated Content**: Professional templates and guides for tax planning and investment basics.

---

## Technical Architecture

Gullak is built as a modern Monorepo, ensuring code sharing and consistency logic between the web and mobile platforms.

### Web Application
*   **Framework**: React 19 (via Vite) for high-performance rendering.
*   **Routing**: React Router DOM v7 for seamless client-side navigation.
*   **Design System**: Custom implementation of "Glassmorphism" using Tailwind CSS v4. It features translucent layers, vivid gradients, and sophisticated blur effects to create a premium, immersive user interface.
*   **Visualizations**: Recharts integration for responsive, data-rich financial charts.

### Mobile Application
*   **Framework**: React Native (Expo SDK 52) ensuring native performance on iOS and Android.
*   **Styling**: NativeWind (Tailwind for React Native) to maintain design consistency with the web platform.
*   **Navigation**: React Navigation v7 with a custom bottom-tab layout.
*   **Haptics**: Integrated tactile feedback for interactions to enhance the premium feel.

---

## New Features (Latest Update)
*   **Express Backend**: Data is now synced to a Node.js backend (`/api`) for persistence across sessions.
*   **Two-Factor Authentication (2FA)**: Secure logic with Google Authenticator and Email OTP fallback.
*   **Global Search**: Integrated `Cmd+K` style search for tools, features, and financial guides.
*   **Intelligent Caching**: Uses a dual-layer approach (localStorage + Backend) for "Fast Load" performance.
*   **Real-time Sync**: Expense data is automatically debounced and saved to the server.

---

## Getting Started

### Prerequisites
*   **Node.js**: Version 18.0.0 or higher.
*   **Package Manager**: npm or yarn.
*   **Database**: Optional MongoDB (runs in-memory by default).

### Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Gautam-Bharadwaj/Gullak.git
    cd Gullak
    ```

2.  **Install Global Dependencies**
    ```bash
    npm install
    ```

3.  **Running the Platform (Unified)**
    ```bash
    # This starts both the Website (Frontend) and the API (Backend)
    npm run dev
    ```
    *   **Frontend**: `http://localhost:5173`
    *   **Backend**: `http://localhost:5001`

4.  **Running the Mobile Application**
    ```bash
    cd App
    npm install
    npx expo start
    ```

---

## Contribution Guidelines

We follow a strict professional workflow for contributions:

1.  **Fork** the repository.
2.  **Create a Branch** for your feature (`git checkout -b feature/NewModule`).
3.  **Commit** your changes with descriptive messages.
4.  **Push** to your branch and open a **Pull Request**.

Please ensure all new components adhere to the Glassmorphism design system guidelines found in `index.css`.

---
