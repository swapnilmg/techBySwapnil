// Activities render in one date-sorted list. To add an entry, copy an object,
// set type to "conference" or "hackathon", and add one or more roles. Put media
// in static/activities/<activity-id>/ and reference it from the matching role.
// Photos use { src, alt, thumbnail? }; certificates use
// { type: "image" | "pdf", src, alt, thumbnail?, fit? }. An optional top-level
// `logo` shows next to the title - prefer a self-hosted path under
// static/activities/<activity-id>/ over an external URL, which can rot or
// (for signed CDN links) expire outright. Set `date.pending: true` when dates
// aren't announced yet so the entry still shows as upcoming on the home page.
// A role can carry an optional `detail` line (talk title, session, time).
const activities = [
  {
    id: 'great-lakes-ai-week-2026',
    type: 'conference',
    shortName: 'Great Lakes AI Week 2026',
    name: 'Great Lakes AI Week 2026 – AI Leadership Summit',
    date: {
      start: '2026-11-10',
      end: '2026-11-12',
      label: 'Nov 10–12, 2026'
    },
    location: 'Bowling Green State University & University of Toledo, Ohio',
    description:
      "The Midwest's AI week, hosted by the Enterprise Technology Association at BGSU and the University of Toledo: a two-day leadership conference anchoring a week of programming and AI Ready Ohio certification workshops.",
    url: 'https://www.greatlakesaiweek.com/agenda',
    linkLabel: 'Agenda',
    roles: [
      {
        title: 'Speaker',
        detail:
          '"GenAI Agents for the Workflows That Actually Resist Automation" · AI Learning Lab: AI Agents (AI Ready Ohio credit) · Tue, Nov 10, 3:30–4:00 PM ET, Stage Three',
        url: 'https://www.greatlakesaiweek.com/agenda',
        photos: [],
        certificates: []
      }
    ]
  },
  {
    id: 'temsmet-2026',
    type: 'conference',
    shortName: 'IEEE TEMSMET 2026',
    name:
      '5th IEEE International Conference on Technology and Engineering Management for Societal Impact (IEEE TEMSMET 2026)',
    date: {
      start: '2026-10-28',
      end: '2026-10-30',
      label: 'Oct 28–30, 2026'
    },
    location: 'Symbiosis Institute of Technology, Hyderabad, India',
    description:
      'An IEEE conference on technology and engineering management for societal impact, hosted by Symbiosis Institute of Technology, Hyderabad.',
    roles: [
      {
        title: 'Session Chair (Virtual)',
        detail: 'Session OL-30-13 · Oct 30, 1:00–2:10 PM IST',
        photos: [],
        certificates: []
      }
    ]
  },
  {
    id: 'hackohio-2026',
    type: 'hackathon',
    name: 'HackOHI/O',
    edition: '2026',
    date: {
      start: '2026-10-23',
      end: '2026-10-25',
      label: 'Oct 23–25, 2026'
    },
    organizer: 'The Ohio State University',
    description:
      "Ohio State University's student hackathon. Judges score teams by reviewing project video submissions and joining live discussions with the teams.",
    url: 'https://hack.osu.edu/',
    linkLabel: 'Website',
    roles: [
      {
        title: 'Judge',
        photos: [],
        certificates: []
      }
    ]
  },
  {
    id: 'gicite-2026',
    type: 'conference',
    shortName: 'GICITE 2026',
    name:
      'IEEE Germany–India Conference on Innovation, Technology, and Engineering (GICITE 2026)',
    date: {
      start: '2026-11-06',
      end: '2026-11-07',
      label: 'Nov 6–7, 2026'
    },
    location: 'Technische Universität Berlin, Germany',
    description:
      'Conducted under IEEE Conference ID #71006 and sponsored by the World Research Union (WRU) and the London College of Applied Research and Education (LCARE). It brings together researchers, industry leaders, and practitioners across innovation, technology, and engineering.',
    url: 'https://gicite.com/',
    linkLabel: 'Conference website',
    logo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop/rIkK0kfFHVgUh9kC/gicite-logo-WyfHMbE1gjLDduJh.jpg',
    roles: [
      {
        title: 'Technical Advisory Committee Member',
        url: 'https://gicite.com/people',
        photos: [],
        certificates: []
      },
      {
        title: 'Session Chair (Virtual)',
        detail: 'Session 12 · Nov 7, 11:00 AM–1:00 PM CET',
        url: 'https://gicite.com/people',
        photos: [],
        certificates: []
      },
      {
        title: 'Invited Talk (Virtual)',
        detail: 'Session 10 · Nov 7, 9:10–9:20 AM CET',
        url: 'https://gicite.com/speakers',
        photos: [],
        certificates: []
      }
    ]
  },
  {
    id: 'icieee-2026',
    type: 'conference',
    shortName: 'ICIEEE 2026',
    name:
      'International Conference on Innovations in Electronics and Electrical Engineering (ICIEEE-2026)',
    date: {
      start: '2026-09-11',
      end: '2026-09-12',
      label: 'Sep 11–12, 2026'
    },
    location: 'MAHSA University, Kuala Lumpur, Malaysia',
    description:
      'The conference was supported by the World Research Union and conducted under IEEE Conference ID #69095. It focuses on interdisciplinary collaboration and advances across electronics and electrical engineering.',
    url: 'https://icieee.com/2026',
    linkLabel: 'Conference website',
    logo: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=388,fit=crop/Y4LvJoNnaMueRzXo/icieee-YleQyLbDR4FlkLpv.jpg',
    roles: [
      {
        title: 'Technical Advisor',
        url: 'https://icieee.com/committee',
        photos: [],
        certificates: [
          {
            type: 'pdf',
            src: '/activities/icieee-2026/technical-advisor-certificate.pdf',
            thumbnail:
              '/activities/icieee-2026/technical-advisor-certificate.webp',
            alt: 'ICIEEE 2026 Advisory Committee certificate of appreciation'
          }
        ]
      },
      {
        title: 'Session Chair (Virtual)',
        url: 'https://icieee.com/committee',
        photos: [],
        certificates: [
          {
            type: 'pdf',
            src: '/activities/icieee-2026/session-chair-certificate.pdf',
            thumbnail: '/activities/icieee-2026/session-chair-certificate.webp',
            alt: 'ICIEEE 2026 Session Chair certificate of appreciation'
          }
        ]
      },
      {
        title: 'Invited Talk (Virtual)',
        url: 'https://icieee.com/committee',
        photos: [],
        certificates: [
          {
            type: 'pdf',
            src: '/activities/icieee-2026/invited-talk-certificate.pdf',
            thumbnail: '/activities/icieee-2026/invited-talk-certificate.webp',
            alt: 'ICIEEE 2026 Invited Speaker certificate of appreciation'
          }
        ]
      }
    ]
  },
  {
    id: 'bincom-hackathon-6',
    type: 'hackathon',
    name: 'Bincom Hackathon',
    edition: '6.0',
    date: {
      start: '2026-09-18',
      end: '2026-09-19',
      label: 'Sep 18–19, 2026'
    },
    format: 'Hybrid',
    organizer: 'Bincom Dev Center',
    description:
      'A 24-hour innovation sprint for building working software solutions powered by generative AI.',
    url: 'https://hackathon.bincomdevcenter.com/',
    linkLabel: 'Website',
    // Signed Instagram CDN URL (oh=/oe= params) - this WILL expire. Replace
    // with a self-hosted /activities/bincom-hackathon-6/logo.jpg before then.
    logo: 'https://scontent-sea5-1.cdninstagram.com/v/t51.2885-19/385897698_703753704471021_4963614362407075327_n.jpg?_nc_cat=100&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4zMjguQzMifQ%3D%3D&_nc_ohc=nScxAqr5tcwQ7kNvwEZw2fu&_nc_oc=AdoQEEdexanpu_snNksG6UJdaRkulkje60ShldG_4IiUEbRKG5dUmWputVbs-Q6ZEmI&_nc_zt=24&_nc_ht=scontent-sea5-1.cdninstagram.com&_nc_ss=7b6a8&oh=00_AQPHT_QemFaFJZ6HxdQQTf-rZNKpGju_akmbjZIHMAGFdg&oe=6AC8B2DA',
    roles: [
      {
        title: 'Judge',
        photos: [],
        certificates: [
          {
            type: 'pdf',
            src: '/activities/bincom-hackathon-6/letter-of-appreciation.pdf',
            thumbnail:
              '/activities/bincom-hackathon-6/letter-of-appreciation.webp',
            alt: 'Bincom Hackathon 6.0 judging letter of appreciation',
            fit: 'contain'
          }
        ]
      }
    ]
  },
  {
    id: 'hack-for-humanity-summer-2026',
    type: 'hackathon',
    name: 'Hack for Humanity',
    edition: 'Summer 2026',
    date: {
      start: '2026-08-07',
      end: '2026-09-04',
      label: 'Aug 7–Sep 4, 2026'
    },
    format: 'Online',
    description:
      'A month-long event creating technology solutions for mental and physical health issues, with an optional focus on AI.',
    url: 'https://hack-for-humanity-summer-26.devpost.com/',
    linkLabel: 'Devpost',
    logo: 'https://yt3.googleusercontent.com/TBjvxDxqjcXslWHFqVLyNgHaQfB9rA3mpo4TaDshP6H9SGtBNOepsuaoNJDaP8834fBr2FinaQ=s160-c-k-c0x00ffffff-no-rj',
    roles: [
      {
        title: 'Judge',
        photos: [],
        certificates: []
      },
      {
        title: 'Mentor',
        url: 'https://hack-for-humanity-summer-26.devpost.com/',
        photos: [],
        certificates: []
      }
    ]
  },
  {
    id: 'volthacks-2026',
    type: 'hackathon',
    name: 'VoltHacks',
    edition: '2026',
    date: {
      start: '2026-05-22',
      end: '2026-09-13',
      label: 'May 22–Sep 13, 2026'
    },
    format: 'Online',
    organizer: 'VoltHacks',
    description:
      'A hackathon focused on building real-world solutions using hardware, IoT, and AI.',
    url: 'https://volthacks.devpost.com/',
    linkLabel: 'Devpost',
    logo: 'https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/004/620/967/datas/medium.png',
    roles: [
      {
        title: 'Judge',
        photos: [],
        certificates: [
          {
            type: 'image',
            src: '/activities/volthacks-2026/judge-certificate.webp',
            thumbnail:
              '/activities/volthacks-2026/judge-certificate-thumbnail.webp',
            alt: 'VoltHacks 2026 Judge certificate of recognition'
          }
        ]
      }
    ]
  }
]

export default activities
