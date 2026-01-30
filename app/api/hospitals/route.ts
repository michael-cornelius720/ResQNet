import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { latitude, longitude } = await req.json();

  if (!latitude || !longitude) {
    return NextResponse.json([]);
  }

  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${latitude},${longitude});
      way["amenity"="hospital"](around:5000,${latitude},${longitude});
      relation["amenity"="hospital"](around:5000,${latitude},${longitude});
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

    const hospitals = data.elements
      .map((el: any) => ({
        name: el.tags?.name || "Nearby Hospital",
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
      }))
      .filter((h: any) => h.lat && h.lng)
      .slice(0, 5); // nearest 5

    return NextResponse.json(hospitals);
  } catch {
    return NextResponse.json([]);
  }
}
