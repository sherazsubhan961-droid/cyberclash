const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Enable CORS headers for handling Vercel serverless request cross-routing
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Method not allowed. Use POST." });
    }

    const { name, email, phone, category, amount, trxId } = req.body;

    if (!name || !email || !phone || !category || !amount || !trxId) {
        return res.status(400).json({ success: false, message: "Missing required registration parameters." });
    }

    // Generate a secure, unique ticket barcode tracking identifier code
    const referencePassCode = `CC-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    // ----------------------------------------------------
    // SECURE EMAIL DISPATCH CONFIGURATION (SMTP Setup)
    // ----------------------------------------------------
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'sherazsubhan961@gmail.com',  // Your system email address
            pass: 'iqmfwgpthgxgsoah'            // Your generated 16-character Google App Password
        }
    });

    const automatedMailLayout = {
        from: '"Cyber Clash Tournament Committee" <sherazsubhan961@gmail.com>',
        to: email, // Sends the dynamic ticket directly to the registering user's email address
        subject: `💥 REGISTRATION SECURED: Your Pass for Cyber Clash 2026 [${category}]`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 2px solid #0F172A; background: #F8FAFC;">
                <h2 style="color: #38BDF8; text-transform: uppercase; margin-top: 0;">Cyber Clash Esports Championship</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your registration profile and incoming mobile cash ledger transmission data have been successfully received and processed by our system.</p>
                
                <div style="background: #0F172A; color: #FFFFFF; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #FBBF24;">🎫 OFFICIAL COMPETITOR ACCESS PASS</h3>
                    <p style="margin: 5px 0;"><strong>BRACKET SECTOR:</strong> ${category}</p>
                    <p style="margin: 5px 0;"><strong>DIGITAL TICKET PASSCODE:</strong> <span style="font-size: 18px; letter-spacing: 1px; color: #F43F5E;">${referencePassCode}</span></p>
                    <p style="margin: 5px 0;"><strong>RECORDED PAYMENT:</strong> Rs. ${amount}</p>
                    <p style="margin: 5px 0;"><strong>SUBMITTED TRX ID:</strong> ${trxId}</p>
                </div>

                <p style="font-size: 13px; color: #64748B;">
                    <strong>Event Execution Logistics:</strong> Please present this exact email containing your unique ticket passcode at the physical check-in desk on <strong>August 23rd, 2026</strong>. Our operational crew will match your recorded Trx ID against the master console roster to clear your seat allocation instantly.
                </p>
                <hr style="border: 0; border-top: 1px solid #CBD5E1; margin: 20px 0;">
                <p style="font-size: 11px; text-align: center; color: #94A3B8;">Cyber Clash 2026. Executive Production by Co-Founders Khwaja M. Subhan Shiraz & Mian M. Taimur Usman.</p>
            </div>
        `
    };

    try {
        // Dispatch the transactional email to the user instantly
        await transporter.sendMail(automatedMailLayout);
        return res.status(200).json({ success: true, message: "Competitor logged and ticket emailed successfully!" });
    } catch (error) {
        console.error("Critical Mailing Engine Error Logged: ", error);
        return res.status(500).json({ success: false, message: "Server logged details, but automated ticket mailing infrastructure failed." });
    }
}
