// Put conference media in static/activities/<conference-id>/ and reference it
// from the matching role. To add a conference, copy the object shape below and
// add its roles. Photos use { src, alt, thumbnail? }; certificates use
// { type: "image" | "pdf", src, alt, thumbnail? }. The three ICIEEE role
// certificates and their PNG thumbnails live together in
// static/activities/icieee-2026/.
const conferences = [
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

export default conferences
