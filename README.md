# Megacubos - Enterprise Internal Tools Platform

## Overview
Megacubos is a powerful low-code platform designed for enterprises to build internal tools, dashboards, and workflows. It enables teams to create custom applications without extensive coding knowledge while providing developers with the flexibility to extend functionality when needed.

## Key Features

### 1. Database Management
- Visual database table creation and management
- Support for PostgreSQL databases
- CSV import/export capabilities
- Real-time data grid with sorting and filtering
- Custom field types including text, number, boolean, date, timestamp, email, and URL

### 2. Authentication & Authorization
- Built on Supabase Auth service
- Role-based access control (creator/user roles)
- Multi-tenant architecture with account isolation
- Secure user management and invitation system

### 3. Canvas Builder
- Drag-and-drop interface
- Component library including:
  - Tables
  - Charts
  - Forms
  - Custom widgets
- Real-time collaboration
- Responsive layouts

### 4. Data Integration
- Native PostgreSQL integration
- REST API endpoints
- GraphQL support
- Custom query builder

## Technical Architecture

### Database Schema

#### Core Tables
1. **accounts**
   - id (int8, primary key)
   - company_name (text)
   - plan (text)
   - seats_total (int4)
   - seats_used (int4)
   - created_at (timestamptz)
   - owner_id (uuid, references auth.users.id)
   - status (bool)

2. **user_accounts**
   - id (int8, primary key)
   - created_at (timestamptz)
   - name (text)
   - phone (text)
   - role (text)
   - auth_user_id (uuid, references auth.users.id)
   - account_id (int8, references accounts.id)

3. **master_tables**
   - id (int8, primary key)
   - created_at (timestamptz)
   - table_name (varchar)
   - type (text)
   - account_id (int8, references accounts.id)

4. **canvas_components**
   - id (uuid, primary key)
   - component_type (varchar)
   - position_x (numeric)
   - position_y (numeric)
   - width (numeric)
   - height (numeric)
   - properties (jsonb)
   - created_at (timestamptz)
   - updated_at (timestamptz)
   - canvas (int8, references canvas.id)

5. **canvas**
   - id (int8, primary key)
   - created_at (timestamptz)
   - name (text)
   - status (bool)
   - company_id (int8, references accounts.id)

6. **database_auth_settings**
   - id (int8, primary key)
   - created_at (timestamptz)
   - accounts_id (int8, references accounts.id)
   - connection_name (text)
   - host (text)
   - port (text)
   - db_name (text)
   - db_username (text)
   - db_password (text)

### Environment Variables
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=


## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Zustand for state management
- Lucide React for icons
- React DND for drag-and-drop
- Recharts for data visualization

### Backend
- Supabase for:
  - Database (PostgreSQL)
  - Authentication
  - Real-time subscriptions
  - Row Level Security

## Deployment
- Vite-optimized build process
- Environment-based configuration
- Docker support (coming soon)

## Security Features
- Row Level Security (RLS) policies
- Secure authentication flow
- Data encryption in transit
- Account isolation

## Competitive Analysis
Major players in the internal tools space include:
- Retool
- Superblocks
- Budibase
- Appsmith


## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
