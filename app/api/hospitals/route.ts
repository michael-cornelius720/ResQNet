import { NextRequest, NextResponse } from "next/server";


const FALLBACK_HOSPITALS = [
  {
    name: "KMC Hospital Mangaluru",
    lat: 12.872168853376317,
    lng: 74.84882556685055,
  },
];

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      return NextResponse.json([]);
    }

    // 🔥 Expanded Overpass Query
    const query = `
      [out:json][timeout:25];
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

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      }
    );

    // ✅ SAFETY: Read as text first
    const text = await response.text();

    // If Overpass returns HTML/XML error
    if (text.startsWith("<")) {
      console.error("Overpass HTML error:", text);
      return NextResponse.json(FALLBACK_HOSPITALS);
    }

    const data = JSON.parse(text);

    let hospitals = data.elements
      .map((el: any) => ({
        name: el.tags?.name || "Nearby Hospital",
        lat: el.lat ?? el.center?.lat,
        lng: el.lon ?? el.center?.lon,
      }))
      .filter((h: any) => h.lat && h.lng);

    // 🔥 Inject fallback hospital if KMC missing
    const kmcExists = hospitals.some((h: any) =>
      h.name.toLowerCase().includes("kmc")
    );

    if (!kmcExists) {
      hospitals.push(...FALLBACK_HOSPITALS);
    }

    // Limit to 50
    hospitals = hospitals.slice(0, 50);

    return NextResponse.json(hospitals);
  } catch (error) {
    console.error("Overpass API error:", error);
    return NextResponse.json(FALLBACK_HOSPITALS);
  }
}
