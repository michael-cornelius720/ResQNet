import { NextRequest, NextResponse } from "next/server";
const FALLBACK_HOSPITALS = [
  {
    name: "KMC Hospital Mangaluru",
    lat: 12.872168853376317, 
    lng: 74.84882556685055,
  },
];

export async function POST(req: NextRequest) {
  const { latitude, longitude } = await req.json();

  if (!latitude || !longitude) {
    return NextResponse.json([]);
  }

  // 🔥 Expanded Overpass Query to catch KMC & similar hospitals
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:12000,${latitude},${longitude});
      way["amenity"="hospital"](around:12000,${latitude},${longitude});
      relation["amenity"="hospital"](around:12000,${latitude},${longitude});

      node["healthcare"="hospital"](around:12000,${latitude},${longitude});
      way["healthcare"="hospital"](around:12000,${latitude},${longitude});
      relation["healthcare"="hospital"](around:12000,${latitude},${longitude});

      node["amenity"="clinic"](around:12000,${latitude},${longitude});
      way["amenity"="clinic"](around:12000,${latitude},${longitude});
    );
    out center tags;
  `;

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: query,
      }
    );

    const data = await response.json();

   let hospitals = data.elements
  .map((el: any) => ({
    name: el.tags?.name || "Nearby Hospital",
    lat: el.lat || el.center?.lat,
    lng: el.lon || el.center?.lon,
  }))
  .filter((h: any) => h.lat && h.lng);

// 🔥 Inject fallback hospitals if missing
for (const fallback of FALLBACK_HOSPITALS) {
  const exists = hospitals.some((h: any) =>
    h.name.toLowerCase().includes("kmc")
  );

  if (!exists) {
    hospitals.push(fallback);
  }
}

hospitals = hospitals.slice(0, 50);


    return NextResponse.json(hospitals);
  } catch (error) {
    console.error("Overpass API error:", error);
    return NextResponse.json([]);
  }
}
