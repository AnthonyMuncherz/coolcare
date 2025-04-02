# CoolCare - Air Conditioning Maintenance Subscription

CoolCare is a subscription-based air conditioning maintenance service based in Malaysia. This web application provides customers with information about our services and allows them to subscribe to maintenance plans.

## Features

- Modern, responsive landing page
- Information about AC maintenance services
- Subscription plans and pricing
- Customer testimonials
- SQLite3 database for storing customer data and service records

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: SQLite3
- **Icons**: Heroicons

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [Git](https://git-scm.com/downloads)
- A code editor (e.g., [Visual Studio Code](https://code.visualstudio.com/))

### Installation (Windows)

1. **Install the prerequisites** if you haven't already:
   - Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)
   - Download and install Git from [https://git-scm.com/download/win](https://git-scm.com/download/win)

2. **Clone the repository**:
   - Open Command Prompt or PowerShell
   - Navigate to the folder where you want to store the project
   ```cmd
   cd C:\path\to\your\projects\folder
   ```
   - Clone the repository
   ```cmd
   git clone https://github.com/username/coolcare.git
   cd coolcare
   ```

3. **Install dependencies**:
   ```cmd
   npm install
   ```

4. **Run the development server**:
   ```cmd
   npm run dev
   ```

5. **Open the application** by navigating to [http://localhost:3000](http://localhost:3000) in your web browser

### Troubleshooting on Windows

- **Port already in use**: If port 3000 is already in use, you can specify a different port:
  ```cmd
  npm run dev -- -p 3001
  ```

- **Permission errors**: If you encounter permission errors, try running Command Prompt or PowerShell as Administrator.

- **Node.js version issues**: Ensure you're using a compatible Node.js version by running:
  ```cmd
  node -v
  ```
  If needed, you can use [nvm-windows](https://github.com/coreybutler/nvm-windows) to install and manage multiple Node.js versions.

## Development

The project structure follows the Next.js App Router pattern:

- `src/app`: Contains the main page components and routes
- `src/components`: Reusable UI components
- `src/lib/db`: Database utilities for SQLite3

## Project Status

This project is currently in development. The landing page is complete, and we are working on the following features:

- User authentication
- Subscription management
- Service request system
- Admin dashboard for managing maintenance schedules

## License

This project is licensed under the MIT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
