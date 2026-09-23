# EMD - Environmental Monitoring Dashboard

EMD (Environmental Monitoring Dashboard) is a real-time weather and environmental monitoring platform for hyper-local areas (focused on Palembang, South Sumatra).

The system displays and analyzes environmental metric data transmitted directly from IoT sensor devices (such as **BME280**, **DHT**, and **BH1750** sensors). This web application is engineered around *"The Command Center"* principle — emphasizing fast, raw, unmanipulated sensor data presentation and clear historical trend visualizations for researchers, academics, and IoT hardware technicians.

---

## 🌟 Key Features

- **Real-Time Monitoring**: Live integration with Supabase WebSockets to listen for database insert events (new sensor readings) instantly.
- **Multi-Sensor Stations**:
  - **Station 1**: Displays Temperature, Humidity, and Atmospheric Pressure (BME280).
  - **Station 2**: Displays Temperature, Humidity, and Light Intensity (DHT & BH1750).
- **Historical Trend Analysis**: Interactive chart visualizations powered by **Recharts** to diagnose weather trends across selectable time windows.
- **Responsive & Accessible**: Spacious 3-column layout for Desktop and efficient *Off-Canvas Sidebar* navigation for Mobile devices. Built with a clean *Floating Header* interface.
- **Robust Design System**: Governed by strict design token rules (using centralized CSS Variables) ensuring consistent UI and effortless theme customization in the future.

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Backend / Database:** [Supabase](https://supabase.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Styling:** Pure CSS Variables with custom utilities.
- **Design & UI Standards:** Managed using `DESIGN.md` & `PRODUCT.md` guidelines.

## 🚀 Installation & Development Guide

### 1. Prerequisites
- Node.js (v16+ recommended)
- NPM or Yarn
- A configured Supabase account and database project.

### 2. Clone the Repository
```bash
git clone https://github.com/username/weather-monitoring-dashboard.git
cd weather-monitoring-dashboard
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the project root (or `.env.local`) and configure your Supabase credentials:
```env
VITE_SUPABASE_URL=https://<PROJECT_ID>.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

### 5. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite) to view the dashboard.

## 🗄️ Database Structure (Supabase)

This application relies on two primary tables:
1. `sensor_data` (Table for Station 1 - BME280)
2. `station_2_data` (Table for Station 2 - DHT & BH1750)

Both tables require appropriate sensor reading columns (`temperature`, `humidity`, `parameter3`) and a timestamp attribute (`created_at`) to be mapped into charts and tables.

## 🎨 Design System Guidelines

This project follows centralized design documentation. When adding features or modifying UI components, please refer to:
- `DESIGN.md`: For accessibility rules, color palettes, typography, border-radius scales, and layout specifications.
- `PRODUCT.md`: To understand the product vision and core principles (*"The Command Center"*).

## 📄 License

Copyright &copy; 2026 EMD - Environmental Monitoring Dashboard. Palembang, South Sumatra. All rights reserved.
