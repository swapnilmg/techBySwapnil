// Activity content is split into conferences and hackathons so each section can
// keep its own compact layout. Put media in static/activities/<event-id>/, then
// reference it from the matching role. To add an event, copy an object in the
// appropriate list. Photos use { src, alt, thumbnail? }; certificates use
// { type: "image" | "pdf", src, alt, thumbnail?, fit? }.
export const conferences = [
  {
    id: 'icieee-2026',
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
              '/activities/icieee-2026/technical-advisor-certificate.png',
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
            thumbnail: '/activities/icieee-2026/session-chair-certificate.png',
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
            thumbnail: '/activities/icieee-2026/invited-talk-certificate.png',
            alt: 'ICIEEE 2026 Invited Speaker certificate of appreciation'
          }
        ]
      }
    ]
  }
]

export const hackathons = [
  {
    id: 'bincom-hackathon-6',
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
    role: {
      title: 'Judge',
      photos: [],
      certificates: [
        {
          type: 'pdf',
          src: '/activities/bincom-hackathon-6/letter-of-appreciation.pdf',
          thumbnail:
            '/activities/bincom-hackathon-6/letter-of-appreciation.png',
          alt: 'Bincom Hackathon 6.0 judging letter of appreciation',
          fit: 'contain'
        }
      ]
    }
  },
  {
    id: 'hack-for-humanity-summer-2026',
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
    role: {
      title: 'Judge',
      photos: [],
      certificates: []
    }
  },
  {
    id: 'volthacks-2026',
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
    role: {
      title: 'Judge',
      photos: [],
      certificates: [
        {
          type: 'image',
          src: '/activities/volthacks-2026/judge-certificate.png',
          thumbnail:
            '/activities/volthacks-2026/judge-certificate-thumbnail.png',
          alt: 'VoltHacks 2026 Judge certificate of recognition'
        }
      ]
    }
  }
]
