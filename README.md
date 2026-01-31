 # Project Name
ResQNet – Smart Emergency Response Network

# Problem Statement ID
CS05TS

# Team Name
Team Information.

# College Name
St Aloysius University 


## Problem Statement

Strengthening emergency medical services to ensure faster response and better care for road accident victims.


## Proposed Solution

ResQNet is a full-stack emergency response coordination platform that enables users to trigger an SOS alert instantly without login. The system automatically captures the user’s location, notifies nearby hospitals and police authorities, and dispatches emergency services in real time.

## Core Flow

User triggers SOS

GPS captured automatically

Phone number + emergency details recorded

Nearby hospitals alerted

Hospital accepts and dispatches ambulance

Police coordinate traffic and safety

User tracks live status until resolved

This ensures faster response, better coordination, and reliable emergency handling.


## Innovation & Creativity

ResQNet improves upon traditional emergency systems through:

Login-free instant SOS activation

Multi-emergency support (medical, fire, water)

Automatic GPS-based routing

Smart nearest-hospital allocation

Hospital approval-based dispatch workflow

Police-assisted green corridor creation

Unified dashboards for hospitals and police

Real-time tracking and notifications

False SOS prevention mechanisms

Unlike typical SOS apps, ResQNet coordinates multiple agencies simultaneously, not just ambulances.


## Technical Complexity & Stack

Frontend
	
	Next.js
	Tailwind CSS
	Typescript
	
Backend

	Next.js

Database

	Supabase (PostgreSQL + Realtime)

Maps & Geolocation

	OpenStreetMap (Overpass API)
	Leaflet / React-Leaflet
	Google Maps Embed
	Supabase Auth for Hospital & Police
	Guest access for Citizens

Hosting

	Vercel


## Usability & Impact

Users:

	Citizens
	Hospitals
	Police Departments
	Fire & Rescue Teams

Interaction:

	One-tap SOS
	Minimal manual input
	Automatic hospital routing
	Live ambulance tracking

Real-World Impact:

	Reduced emergency response time
	Faster ambulance dispatch
	Better multi-agency coordination
	Improved survival during Golden Hour
	Accessible to non-technical users


## Setup Instructions

Prerequisites:

	Make sure the following are installed:
	Node.js (v18 or above)
	npm or yarn
	Git
	Supabase account (for database)

Clone Repository:

	git clone <your-repository-link>
	cd resqnet

Install Dependencies:

	npm install
	(or)
	yarn install

Environment Variables:

	Create a .env.local file in the root directory:
	
	NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
	SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

Run Locally:

	npm run dev

Access Application:

	Open your browser:
	http://localhost:3000

Routes:

	/sos → Citizen portal

	/hospital → Hospital dashboard

	/police → Police dashboard

	/emergency-status → Live tracking


Presentation Link:

	https://www.canva.com/design/DAG_6yC17sk/d5o8BPoqBJI5ljUaRjCCrw/edit?utm_content=DAG_6yC17sk&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

