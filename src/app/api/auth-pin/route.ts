import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    // In a real application, the PIN would be securely stored (e.g., in an environment variable,
    // a database, or a secrets manager) and compared securely.
    // For demonstration purposes and to satisfy the user's immediate need,
    // we'll use a hardcoded mock PIN.
    const MOCK_SECURE_PIN = "918"; // User specified PIN "918"

    console.log(`Attempting to validate PIN: ${pin}`); // Log PIN for debugging

    if (pin === MOCK_SECURE_PIN) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Invalid PIN" }, { status: 401 });
    }
  } catch (error: any) {
    console.error("Auth PIN API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
