import { client } from '@/sanity/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const subscription = await req.json();

        if (!subscription || !subscription.endpoint) {
            return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
        }

        // Check if we can write
        if (!client.config().token) {
            console.error("Missing Sanity API Token in client configuration");
            return NextResponse.json({ error: 'Server configuration error: write access denied' }, { status: 500 });
        }

        // Create subscription document in Sanity
        const doc = {
            _type: 'subscription',
            endpoint: subscription.endpoint,
            keys: subscription.keys,
            userAgent: req.headers.get('user-agent') || 'Unknown',
            createdAt: new Date().toISOString()
        };

        // We use create which sends a POST. If we wanted to avoid duplicates we could stick to createIfNotExists but endpoint is a unique key usually. 
        // However, subscription objects don't have IDs by default. Ideally we hash the endpoint to make an ID.
        // For simplicity now, we just create. 
        await client.create(doc);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error handling subscription:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
