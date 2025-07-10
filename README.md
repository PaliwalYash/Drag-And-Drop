🎯Form Builder

A modern, intuitive drag-and-drop form builder that creates horizontal layouts with smart component grouping.

✨ Features

🎨 Smart Layout System

Dynamic Width: Single components take full width, pairs share 50/50 layout
Horizontal Groups: Organize components in side-by-side arrangements

🔄 Advanced Drag & Drop

Intelligent Swapping: Drop components on full groups to automatically swap
Cross-Group Movement: Drag components between any groups seamlessly
Within-Group Reordering: Rearrange components within the same group

🚀 Quick Start

Prerequisites

Node.js 18+
Supabase database
npm or yarn

# Install dependencies
npm install

# Set up environment variables
cp .env

# Set up the database
npx prisma db push

# Start the development server
npm run dev

Visit http://localhost:3000 to see your application.

Environment Setup
Configure your .env file:
# Database
DATABASE_URL=""

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

🏗️ Tech Stack

Frontend: Next.js 14, React 18, TypeScript
Backend: tRPC, Prisma ORM
Database: PostgreSQL
Styling: Tailwind CSS
Drag & Drop: react-beautiful-dnd

🎮 How to Use
Building Forms

Add Components: Use the "Add Component" form to create new form elements
Organize Groups: Each new component gets its own group initially
Create Layouts: Drag components between groups to create horizontal pairs
Preview Form: See real-time preview of your form layout

Managing Groups

Single Component: Takes full width in the form preview
Two Components: Share 50/50 width side by side
Empty Groups: Click "+ New Group" to create drop zones
Smart Swapping: Drop on full groups to swap components automatically
