import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message = '',
      businessName = 'Local Business',
      businessCategory = 'Local Services',
      phone = '(216) 555-0100',
      address = 'Greater Cleveland, OH',
      services = [],
    } = body;

    const lowerMsg = message.toLowerCase();

    let reply = '';

    if (
      lowerMsg.includes('hour') ||
      lowerMsg.includes('open') ||
      lowerMsg.includes('close') ||
      lowerMsg.includes('time')
    ) {
      reply = `Thanks for asking! ${businessName} is open Monday through Saturday from 8:00 AM to 7:00 PM (Emergency calls accepted 24/7). Would you like to schedule an appointment or get a quick estimate?`;
    } else if (
      lowerMsg.includes('price') ||
      lowerMsg.includes('cost') ||
      lowerMsg.includes('quote') ||
      lowerMsg.includes('estimate') ||
      lowerMsg.includes('rate')
    ) {
      reply = `We provide upfront, transparent pricing on all our ${businessCategory.toLowerCase()} services! To give you an exact quote, what is the best phone number or email to reach you, and a few details about your project?`;
    } else if (
      lowerMsg.includes('where') ||
      lowerMsg.includes('location') ||
      lowerMsg.includes('address') ||
      lowerMsg.includes('area')
    ) {
      reply = `${businessName} serves ${address} and the surrounding Greater Cleveland / Northeast Ohio community within a 40-minute service radius. What area are you located in?`;
    } else if (
      lowerMsg.includes('service') ||
      lowerMsg.includes('do you do') ||
      lowerMsg.includes('can you')
    ) {
      const serviceList = services.length > 0 ? services.slice(0, 4).join(', ') : 'commercial and residential projects';
      reply = `Yes! We specialize in ${serviceList}. Would you like us to check availability for this week?`;
    } else if (
      lowerMsg.includes('phone') ||
      lowerMsg.includes('call') ||
      lowerMsg.includes('contact') ||
      lowerMsg.includes('speak')
    ) {
      reply = `You can call our team directly at ${phone}. Or leave your name and phone number right here, and one of our specialists will text or call you back within 15 minutes!`;
    } else if (
      lowerMsg.includes('book') ||
      lowerMsg.includes('schedule') ||
      lowerMsg.includes('appointment')
    ) {
      reply = `We'd love to get you on the schedule! What day and time works best for you, and what is your contact phone number?`;
    } else {
      reply = `Hi! Thanks for contacting ${businessName}. I'm your 24/7 AI concierge. How can we help you today with your ${businessCategory.toLowerCase()} project?`;
    }

    return NextResponse.json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chat error' }, { status: 500 });
  }
}
