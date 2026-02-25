// ── Conversation messages ──────────────────────────────────
const conversations = {
  'Caroline Brennan': [
    { dir:'out', text:'Welcome to Clarity! How can we help you today?', time:'14:24' },
    { dir:'in',  text:'Hi. How can I top up with apple pay?', time:'14:25' },
    { dir:'out', text:'Of course! You can top up via Apple Pay by going to Settings → Payment Methods → Add New. It should appear as an option if your device supports it.', time:'14:26' },
    { dir:'in',  text:'I don\'t see it on my device', time:'14:27' },
    { dir:'out', text:'Could you let me know which device and iOS version you\'re on? That will help us investigate further.', time:'14:28' },
    { dir:'in',  text:'iPhone 14, iOS 17.2', time:'14:29' },
    { dir:'out', text:'Thanks! That version is fully supported. Could you try force-closing the app and reopening it? Sometimes the payment options need a refresh.', time:'14:30' },
  ],
  'Ethan Kim': [
    { dir:'out', text:'Hi Ethan! How can we assist you today?', time:'09:10' },
    { dir:'in',  text:'Can I use multiple payment methods for a single transaction?', time:'09:11' },
    { dir:'out', text:'Unfortunately, we currently only support one payment method per transaction. However, you can split payments by making two separate top-ups.', time:'09:13' },
    { dir:'in',  text:'That\'s a bit inconvenient. Is this something you plan to support?', time:'09:15' },
    { dir:'out', text:'Absolutely, it\'s on our roadmap! We\'ll notify you as soon as it\'s available. Is there anything else I can help with?', time:'09:16' },
  ],
  'Jason Lee': [
    { dir:'out', text:'Hello Jason, welcome! What brings you in today?', time:'08:00' },
    { dir:'in',  text:'What\'s the best way to contact support if this chat isn\'t available?', time:'08:02' },
    { dir:'out', text:'You can reach us at support@clarity.com or call +1 800 123 4567. We\'re available 24/7.', time:'08:03' },
    { dir:'in',  text:'Great, and what\'s the typical response time for email?', time:'08:04' },
    { dir:'out', text:'Usually within 2 hours during business hours, and up to 6 hours on weekends.', time:'08:05' },
    { dir:'in',  text:'Perfect, thanks!', time:'08:06' },
  ],
  'Aisha Patel': [
    { dir:'out', text:'Hi Aisha! How can I help you today?', time:'11:30' },
    { dir:'in',  text:'Can you help me with my account verification? I submitted my ID 3 days ago.', time:'11:31' },
    { dir:'out', text:'I\'m looking into it now. I can see your documents were received on Monday. The review team typically takes 3–5 business days.', time:'11:33' },
    { dir:'in',  text:'Okay, so it might be done today or tomorrow?', time:'11:34' },
    { dir:'out', text:'That\'s correct! You\'ll receive a confirmation email as soon as it\'s approved.', time:'11:35' },
  ],
  'Marcus Wu': [
    { dir:'out', text:'Hey Marcus, what can we do for you today?', time:'10:00' },
    { dir:'in',  text:'Is there a way to change my subscription plan?', time:'10:01' },
    { dir:'out', text:'Yes! Head to Account → Subscription → Change Plan. You can upgrade or downgrade anytime.', time:'10:02' },
    { dir:'in',  text:'Will I lose any credits if I downgrade?', time:'10:03' },
    { dir:'out', text:'No credits will be lost. Any unused balance carries over to your new plan.', time:'10:04' },
    { dir:'in',  text:'Nice. What about billing — will it be prorated?', time:'10:05' },
    { dir:'out', text:'Yes, billing is prorated. You\'ll only be charged for the remaining days on your new plan.', time:'10:07' },
  ],
  'Linda Gomez': [
    { dir:'out', text:'Hi Linda! What can I help you with?', time:'15:00' },
    { dir:'in',  text:'How do I reset my password?', time:'15:01' },
    { dir:'out', text:'Easy! Go to the login page and click "Forgot Password". You\'ll receive a reset link in your email within 1–2 minutes.', time:'15:02' },
    { dir:'in',  text:'I didn\'t get the email', time:'15:05' },
    { dir:'out', text:'Please check your spam/junk folder. If it\'s not there, I can resend it manually. What email address should I use?', time:'15:06' },
  ],
  'Carlos Rodriguez': [
    { dir:'out', text:'Hello Carlos! How can we help?', time:'13:00' },
    { dir:'in',  text:'What security measures do you have to protect my data?', time:'13:01' },
    { dir:'out', text:'We use AES-256 encryption at rest and TLS 1.3 in transit. All data is stored in ISO 27001 certified data centers.', time:'13:02' },
    { dir:'in',  text:'Do you share data with third parties?', time:'13:03' },
    { dir:'out', text:'Only with your explicit consent. You can review and manage your data sharing preferences in Account → Privacy.', time:'13:05' },
  ],
  'Julia Chen': [
    { dir:'out', text:'Hi Julia, what brings you here today?', time:'09:45' },
    { dir:'in',  text:'How do I report a technical issue with the app?', time:'09:46' },
    { dir:'out', text:'You can report issues directly from the app: tap Help → Report a Problem. Screenshots and logs are automatically attached.', time:'09:47' },
    { dir:'in',  text:'What if the app won\'t open at all?', time:'09:48' },
    { dir:'out', text:'In that case, email us at bugs@clarity.com with your device model and OS version. We\'ll prioritize it.', time:'09:50' },
  ],
  'Brandon Smith': [
    { dir:'out', text:'Hey Brandon! What can I help you with today?', time:'14:10' },
    { dir:'in',  text:'What features are included in the free trial?', time:'14:11' },
    { dir:'out', text:'The free trial includes all Pro features for 14 days — unlimited transactions, analytics, multi-currency support, and priority support.', time:'14:12' },
    { dir:'in',  text:'Do I need a credit card to sign up?', time:'14:13' },
    { dir:'out', text:'No credit card needed! You can sign up with just your email. We\'ll only ask for payment if you choose to upgrade after the trial.', time:'14:14' },
  ],
  'Nina Brown': [
    { dir:'out', text:'Hi Nina! What can we help you with?', time:'16:30' },
    { dir:'in',  text:'Can I change my email address linked to the account?', time:'16:31' },
    { dir:'out', text:'Yes! Go to Account → Profile → Email Address. You\'ll need to verify both the old and new email addresses.', time:'16:32' },
    { dir:'in',  text:'I no longer have access to my old email', time:'16:33' },
    { dir:'out', text:'No problem. I can bypass that by verifying your identity with your phone number or ID. Would you like to proceed?', time:'16:35' },
  ],
  'Oliver Johnson': [
    { dir:'out', text:'Hello Oliver! How can I assist?', time:'11:00' },
    { dir:'in',  text:'How do I contact customer service directly?', time:'11:01' },
    { dir:'out', text:'You can reach us here on live chat (24/7), by phone at +1 800 123 4567, or by email at support@clarity.com.', time:'11:02' },
    { dir:'in',  text:'Is there a dedicated account manager for business accounts?', time:'11:03' },
    { dir:'out', text:'Yes! Business and Enterprise plans include a dedicated account manager. Would you like to know more about upgrading?', time:'11:05' },
  ],
  'Grace White': [
    { dir:'out', text:'Hi Grace! What can I do for you?', time:'10:20' },
    { dir:'in',  text:'What should I do if I forget my username?', time:'10:21' },
    { dir:'out', text:'Your username is usually your email address. Try logging in with the email you used to register.', time:'10:22' },
    { dir:'in',  text:'I tried that but it says account not found', time:'10:23' },
    { dir:'out', text:'You might have registered with a different email. I can look you up by phone number if you have one on file — would that help?', time:'10:24' },
  ],
  'Leo Thompson': [
    { dir:'out', text:'Hey Leo! How can we help today?', time:'17:00' },
    { dir:'in',  text:'Are there any promotions or discounts available right now?', time:'17:01' },
    { dir:'out', text:'We have an ongoing 20% discount on annual plans this month! Use code CLARITY20 at checkout.', time:'17:02' },
    { dir:'in',  text:'Does that apply to upgrades too?', time:'17:03' },
    { dir:'out', text:'Yes, it applies to new subscriptions and upgrades. It expires on the 30th of this month.', time:'17:04' },
    { dir:'in',  text:'Perfect, I\'ll upgrade now. Thanks!', time:'17:05' },
  ],
  'Emma Garcia': [
    { dir:'out', text:'Hi Emma! How can I assist you today?', time:'08:30' },
    { dir:'in',  text:'What are your returns policy options?', time:'08:31' },
    { dir:'out', text:'We offer a 30-day money-back guarantee on all paid plans, no questions asked. Just cancel within 30 days of purchase.', time:'08:32' },
    { dir:'in',  text:'And what if I was charged twice by mistake?', time:'08:33' },
    { dir:'out', text:'That would be refunded immediately. If you\'ve noticed a duplicate charge, I can look into it right now — can you share your account email?', time:'08:35' },
  ],
  'Liam Johnson': [
    { dir:'out', text:'Hello Liam! What can I help you with?', time:'12:00' },
    { dir:'in',  text:'How can I track my order?', time:'12:01' },
    { dir:'out', text:'You can track your order under Account → Orders → Track. You\'ll also receive email updates at each stage.', time:'12:02' },
    { dir:'in',  text:'I haven\'t received any emails', time:'12:03' },
    { dir:'out', text:'Let me check your notification settings. Could you confirm if marketing/transactional emails are enabled in your account preferences?', time:'12:05' },
    { dir:'in',  text:'They seem to be on', time:'12:06' },
    { dir:'out', text:'I\'ll resend the tracking email now. Please check your inbox in the next few minutes.', time:'12:07' },
  ],
};

// ── Channel icons ──────────────────────────────────────────
const CH = {
  livechat: `<img src="icons/12px/LiveChat.svg" width="12" height="12" alt="LiveChat"/>`,
  whatsapp: `<img src="icons/12px/Whatsapp.svg" width="12" height="12" alt="WhatsApp"/>`,
  android:  `<img src="icons/12px/Android.svg"  width="12" height="12" alt="Android"/>`,
  apple:    `<img src="icons/12px/Apple.svg"    width="12" height="12" alt="Apple"/>`,
};

// ── Inbox conversations ────────────────────────────────────
const allConversations = [
  { name:'Caroline Brennan', initials:'CB', bg:'linear-gradient(135deg,#fbbf24,#f87171)', ch:'livechat', time:'13min', preview:'Hi. How can I top up with apple pay?',           badge:0, views:['assigned','all'] },
  { name:'Ethan Kim',        initials:'EK', bg:'linear-gradient(135deg,#34d399,#059669)', ch:'whatsapp', time:'2h',   preview:'Can I use multiple payment methods?',             badge:1, views:['assigned','all'] },
  { name:'Jason Lee',        initials:'JL', bg:'linear-gradient(135deg,#60a5fa,#3b82f6)', ch:'whatsapp', time:'6h',   preview:"What's the best way to contact support?",         badge:2, views:['assigned','all'] },
  { name:'Aisha Patel',      initials:'AP', bg:'linear-gradient(135deg,#f9a8d4,#ec4899)', ch:'livechat', time:'1d',   preview:'Can you help me with my account verification?',   badge:0, views:['assigned','all'] },
  { name:'Marcus Wu',        initials:'MW', bg:'linear-gradient(135deg,#86efac,#16a34a)', ch:'android',  time:'1d',   preview:'Is there a way to change my subscription?',       badge:4, views:['unassigned','all'] },
  { name:'Linda Gomez',      initials:'LG', bg:'linear-gradient(135deg,#fcd34d,#f59e0b)', ch:'livechat', time:'1d',   preview:'How do I reset my password?',                     badge:0, quote:true, views:['mentions','all'] },
  { name:'Carlos Rodriguez', initials:'CR', bg:'linear-gradient(135deg,#6ee7b7,#059669)', ch:'livechat', time:'2d',   preview:'What are the security measures for my data?',     badge:0, views:['snoozed','all'] },
  { name:'Julia Chen',       initials:'JC', bg:'linear-gradient(135deg,#c4b5fd,#7c3aed)', ch:'livechat', time:'2d',   preview:'How to report a technical issue?',                badge:0, views:['unassigned','all'] },
  { name:'Brandon Smith',    initials:'BS', bg:'linear-gradient(135deg,#93c5fd,#2563eb)', ch:'livechat', time:'2d',   preview:'What features are included in the free trial?',   badge:0, views:['mentions','all'] },
  { name:'Nina Brown',       initials:'NB', bg:'linear-gradient(135deg,#fda4af,#e11d48)', ch:'android',  time:'3d',   preview:'Can I change my email address linked to...',      badge:0, views:['snoozed','all'] },
  { name:'Oliver Johnson',   initials:'OJ', bg:'linear-gradient(135deg,#fdba74,#ea580c)', ch:'android',  time:'3d',   preview:'How do I contact customer service directly?',     badge:0, quote:true, views:['unassigned','all'] },
  { name:'Grace White',      initials:'GW', bg:'linear-gradient(135deg,#5eead4,#0d9488)', ch:'android',  time:'4d',   preview:'What should I do if I forget my username?',       badge:0, views:['closed','all'] },
  { name:'Leo Thompson',     initials:'LT', bg:'linear-gradient(135deg,#a5b4fc,#6366f1)', ch:'livechat', time:'4d',   preview:'Are there any promotions available right now?',   badge:0, views:['closed','all'] },
  { name:'Emma Garcia',      initials:'EG', bg:'linear-gradient(135deg,#f9a8d4,#db2777)', ch:'whatsapp', time:'4d',   preview:'What are the returns policy options?',            badge:0, views:['mentions','all'] },
  { name:'Liam Johnson',     initials:'LJ', bg:'linear-gradient(135deg,#bfdbfe,#3b82f6)', ch:'livechat', time:'4d',   preview:'How can I track my order?',                       badge:0, views:['closed','all'] },
];

// ── View labels ────────────────────────────────────────────
const VIEW_LABELS = {
  assigned:   'Assigned to me',
  mentions:   'Mentions',
  unassigned: 'Unassigned',
  snoozed:    'Snoozed',
  closed:     'Closed',
  all:        'All',
};
