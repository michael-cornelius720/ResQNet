 # Project Name
ResQNet – Smart Emergency Response Network

# Problem Statement ID
CS05TS

# Team Name
The Information 

# College Name
St Aloysius University 


## Problem Statement

In real-life emergencies such as road accidents, fires, and drowning incidents, victims often face delays in receiving timely medical and rescue assistance. Current systems rely on manual calls, unclear location sharing, and poor coordination between hospitals, police, and rescue services.

These delays during the critical “golden hour” significantly increase fatalities and reduce survival chances.

There is a need for a fast, location-aware, and automated emergency response system that can instantly connect victims with hospitals, ambulances, police, and specialized rescue teams.

## Proposed Solution

ResQNet is a web-based smart emergency response platform that allows users to trigger an SOS alert instantly without login.

When SOS is pressed:

    - User enters phone number

    - Selects emergency type (Accident / Fire / Water)

    - GPS location is captured automatically

    - Nearest hospital is selected or auto-assigned

    - Hospital receives request and approves

    - Police are notified simultaneously

    - Ambulance and rescue services are dispatched

    - Live tracking starts after hospital confirmation

    - This ensures faster response, better coordination, and reliable emergency handling.

## Innovation & Creativity

ResQNet introduces several unique improvements over traditional emergency systems:

    - No login or OTP to avoid delay

    - Multi-emergency support (medical + fire + water rescue)

    - Automatic GPS capture

    - Smart nearest hospital allocation

    - Hospital approval-based dispatch (real-world workflow)

    - Police-assisted green corridor creation

    - Unified dashboard for hospitals and authorities

    - False SOS prevention mechanisms

    - Unlike basic SOS apps, ResQNet coordinates multiple agencies simultaneously, not just ambulances

## Technical Complexity & Stack

### Frontend
    - Next.js / React

    - Tailwind CSS

    - TypeScript

### Backend
    - Next.js


### Database
    - MongoDB

### APIs & Services
    - Geolocation API (GPS)

    - Maps API (routing & distance calculation)

    - Real-time updates (WebSockets/Firebase)

### Hosting / Deployment
- Vercel / Render / AWS (optional)



## Usability & Impact

### Users:
	- General public

	- Hospitals

	- Police departments

	- Fire & water rescue teams


### How They Interact:
	- One-tap SOS

	- Minimal input

	- Automatic routing

	- Real-time tracking

### Real-World Impact:
	- Faster ambulance dispatch

	- Reduced emergency response time

	- Better coordination between services

	- Higher survival rate during critical situations

	- Works even for non-technical users



## Setup Instructions

### Prerequisites
- Node.js installed
- Git installed
- Database (MySQL or MongoDB)

### Steps to Run Locally

1. Clone the repository:
```bash
git clone <your-github-repo-link>
