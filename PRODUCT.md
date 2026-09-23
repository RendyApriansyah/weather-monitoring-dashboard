# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Researchers / Academics requiring local historical weather data.
- Admins / Technicians managing IoT sensor hardware.
- General public around Palembang monitoring local weather conditions.

## Product Purpose
Provide real-time environmental monitoring (temperature, humidity, atmospheric pressure, and light intensity) streamed directly from IoT sensor hardware, and facilitate historical trend analysis.

## Positioning
Relying on direct data feeds from local IoT hardware that deliver hyper-local accuracy and relevance (Palembang) compared to estimations from global or generalized public weather apps.

## Operating Context
Accessed via web browsers (both desktop and mobile) to evaluate current environmental conditions and derive insights from historical readings recorded over configurable time windows.

## Capabilities and Constraints
- Must use Supabase as the backend.
- Must support and showcase metrics from BME280 sensors (Station 1) and DHT & BH1750 sensors (Station 2).
- Fixed database table schemas (`sensor_data` and `station_2_data`).

## Brand Commitments
- Product Name: EMD (Environmental Weather Dashboard).
- Logo: Uses `/websitelogo.svg`.

## Evidence on Hand
- Real-time Supabase integration (insert events).
- Line chart implementation (Recharts) handling variable time range intervals.
- Footer copy citing "Palembang, South Sumatra" and copyright notice.

## Product Principles
- **Accuracy & Transparency:** Display raw sensor data swiftly without manipulation.
- **Instant Readability:** Real-time values must stand out and be readable at a glance.
- **In-Depth Analysis:** Provide clear historical trend visualizations for researchers and technicians to diagnose patterns.
