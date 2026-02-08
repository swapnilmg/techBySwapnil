# Design Document: Enhanced About Page

## Overview

This design document outlines the implementation approach for enhancing the About page of the Tech by Swapnil blog. The current About page contains only a single line of text and needs to be transformed into a comprehensive professional profile page that showcases experience, publications, skills, and personal background.

The design follows a component-based architecture using React and Gatsby, maintaining consistency with the existing site structure while introducing new styled sections. The page will be inspired by the clean, professional aesthetic of Brittany Chiang's portfolio site, featuring clear typography hierarchy, appropriate spacing, and responsive design.

## Architecture

### High-Level Structure

The About page will follow Gatsby's page-based routing architecture and utilize the existing Layout component for consistent site-wide styling. The page will be composed of multiple content sections, each responsible for displaying a specific category of information.

```
AboutPage (src/pages/about.js)
├── Layout Component (existing)
│   └── Page Content
│       ├── Bio Section
│       ├── Experience Section
│       ├── Publications Section
│       ├── Skills Section
│       └── Contact Links Section
└── SEO Component (existing)
```

### Design Principles

1. **Component Composition**: Break content into logical, reusable sections
2. **CSS Modules**: Use CSS Modules for scoped styling to avoid conflicts
3. **Responsive Design**: Mobile-first approach with appropriate breakpoints
4. **Accessibility**: Semantic HTML and proper heading hierarchy
5. **Maintainability**: Separate content from presentation for easy updates

## Components and Interfaces

### AboutPage Component

The main page component that orchestrates all sections.

**Location**: `src/pages/about.js`

**Props**: None (Gatsby page component)

**Structure**:
```javascript
const AboutPage = () => {
  return (
    <Layout pageTitle="About Me">
      <BioSection />
      <ExperienceSection />
      <PublicationsSection />
      <SkillsSection />
      <ContactSection />
    </Layout>
  )
}
```

### BioSection Component

Displays the professional biography and introduction.

**Props**: None (content embedded)

**Content**:
- Current role and company
- Educational background
- Areas of expertise
- Personal interests

**Styling**:
- Paragraph text with comfortable line height
- Maximum width for readability
- Subtle emphasis on key terms

### ExperienceSection Component

Displays professional work history in reverse chronological order.

**Data Structure**:
```javascript
{
  company: string,
  title: string,
  period: string,
  description: string[],
  technologies?: string[]
}
```

**Rendering**:
- Each experience as a distinct block
- Company and title prominently displayed
- Time period aligned to the right (desktop) or below title (mobile)
- Bullet points or paragraphs for descriptions
- Optional technology tags

### PublicationsSection Component

Displays academic publications with links to full papers.

**Data Structure**:
```javascript
{
  title: string,
  venue: string,
  date: string,
  url: string,
  description: string
}
```

**Rendering**:
- Publication title as a clickable link
- Venue and date as metadata
- Brief description or abstract
- External link indicator icon
- Opens in new tab with `target="_blank"` and `rel="noopener noreferrer"`

### SkillsSection Component

Displays technical skills organized by category.

**Data Structure**:
```javascript
{
  category: string,
  skills: string[]
}
```

**Rendering**:
- Category headings
- Skills as inline list or grid
- Subtle visual separation between categories

### ContactSection Component

Displays links to external profiles and contact methods.

**Content**:
- LinkedIn profile link
- GitHub profile (if applicable)
- Email (if desired)
- Other professional networks

**Styling**:
- Horizontal layout on desktop
- Vertical stack on mobile
- Icon + text or text-only links

## Data Models

### Experience Data

```javascript
const experiences = [
  {
    company: "Amazon",
    title: "Senior Software Engineer",
    period: "YYYY — Present",
    description: [
      "Description of key responsibilities",
      "Major achievements and impact",
      "Technologies and systems worked with"
    ],
    technologies: ["Technology1", "Technology2"]
  }
  // Additional experiences...
]
```

### Publications Data

```javascript
const publications = [
  {
    title: "Optimal Constrained Wireless Emergency Network Antenna Placement",
    venue: "IEEE",
    date: "May 2017",
    url: "https://davidanastasiu.net/pdf/papers/2017-GaikwadA-SCI-los.pdf",
    description: "Communication is paramount during emergencies. This research proposes a framework for identifying optimal placement of wireless network antennas within a city, given multiple criteria constraints."
  },
  {
    title: "Large-scale Optimization for Wireless Emergency Networks",
    venue: "CIKM 2018",
    date: "October 2018",
    url: "https://davidanastasiu.net/pdf/papers/2018-GaikwadMA-CIKM-los2.pdf",
    description: "Research on optimizing wireless emergency network deployment for large-scale disaster scenarios."
  }
]
```

### Skills Data

```javascript
const skills = [
  {
    category: "Languages",
    skills: ["JavaScript", "Python", "Java", "TypeScript"]
  },
  {
    category: "Frameworks & Libraries",
    skills: ["React", "Node.js", "Gatsby", "Express"]
  },
  {
    category: "Tools & Platforms",
    skills: ["AWS", "Git", "Docker", "CI/CD"]
  }
]
```

## Styling Approach

### CSS Module Structure

Create `src/pages/about.module.css` for page-specific styles:

```css
/* Section spacing */
.section {
  margin-bottom: 4rem;
}

/* Bio section */
.bio {
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 650px;
}

/* Experience section */
.experienceItem {
  margin-bottom: 2.5rem;
}

.experienceHeader {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.company {
  font-weight: 600;
  font-size: 1.2rem;
}

.period {
  color: #666;
  font-size: 0.9rem;
}

/* Publications section */
.publicationItem {
  margin-bottom: 2rem;
}

.publicationTitle {
  font-weight: 600;
  color: rebeccapurple;
  text-decoration: none;
}

.publicationTitle:hover {
  text-decoration: underline;
}

.publicationMeta {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

/* Skills section */
.skillsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.skillCategory {
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.skillList {
  list-style: none;
  padding: 0;
}

.skillList li {
  padding: 0.25rem 0;
}

/* Contact section */
.contactLinks {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.contactLink {
  color: rebeccapurple;
  text-decoration: none;
  font-weight: 500;
}

.contactLink:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .experienceHeader {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .period {
    margin-top: 0.25rem;
  }
  
  .skillsGrid {
    grid-template-columns: 1fr;
  }
}
```

### Design Tokens

Maintain consistency with existing site styles:
- Primary color: `rebeccapurple` (from existing heading style)
- Text color: `black` (from existing nav links)
- Secondary text: `#666` (gray for metadata)
- Font family: `sans-serif` (from existing container)
- Max width: `500px` (from existing container, may expand for About page)

## Error Handling

### Missing Data Handling

1. **Empty Arrays**: If experience, publications, or skills arrays are empty, display a placeholder message or hide the section
2. **Missing URLs**: If publication URLs are unavailable, display title without link
3. **Broken Links**: External links should include proper `rel` attributes for security

### Responsive Breakpoints

1. **Mobile**: < 768px - Stack all content vertically, full-width sections
2. **Tablet**: 768px - 1024px - Maintain some horizontal layouts
3. **Desktop**: > 1024px - Full horizontal layouts where appropriate

### Accessibility Considerations

1. **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
2. **Link Accessibility**: External links include descriptive text and proper ARIA labels
3. **Focus States**: Ensure all interactive elements have visible focus indicators
4. **Color Contrast**: Maintain WCAG AA compliance for text contrast ratios
5. **Screen Readers**: Use semantic elements (`<section>`, `<article>`, `<nav>`)

## Testing Strategy


### Testing Approach

The About page will be tested using a dual approach:

1. **Unit Tests**: Verify specific examples, component rendering, and edge cases
2. **Property-Based Tests**: Verify universal properties across all data inputs

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests will catch concrete bugs in specific scenarios, while property-based tests will verify that general correctness properties hold across all possible inputs.

### Testing Framework

- **Test Framework**: Jest (included with Gatsby)
- **React Testing**: React Testing Library
- **Property-Based Testing**: fast-check (JavaScript property-based testing library)

### Test Configuration

- Property-based tests will run a minimum of 100 iterations per test
- Each property test will be tagged with a comment referencing the design property
- Tag format: `// Feature: enhanced-about-page, Property {number}: {property_text}`

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Bio Section Word Count Constraint

*For any* bio text content, the word count should be between 150 and 300 words inclusive.

**Validates: Requirements 1.5**

### Property 2: Experience Entries Display Complete Information

*For any* experience entry in the experience data array, when rendered, the output should contain the company name, job title, and time period.

**Validates: Requirements 2.2, 2.3**

### Property 3: Experience Chronological Ordering

*For any* list of experience entries with date information, the rendered experience section should display them in reverse chronological order (most recent first).

**Validates: Requirements 2.4**

### Property 4: Experience Time Period Format Consistency

*For any* set of experience entries, all rendered time period strings should match the format pattern "YYYY — YYYY" or "YYYY — Present".

**Validates: Requirements 2.5**

### Property 5: Publication Entries Display Complete Information

*For any* publication entry in the publications data array, when rendered, the output should contain the title, venue, publication date, a clickable link, and a description.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 6: Skills Organized by Category

*For any* skills data structure, when rendered, each skill should be grouped under its corresponding category heading.

**Validates: Requirements 4.2**

### Property 7: External Links Open in New Tab

*For any* external link (publication links, LinkedIn, etc.) rendered on the page, the link element should have `target="_blank"` and `rel="noopener noreferrer"` attributes.

**Validates: Requirements 6.2, 6.3**

### Property 8: External Links Have Visual Indicators

*For any* external link on the page, the link element should have a CSS class or child element that provides a visual indicator (such as an icon or styling).

**Validates: Requirements 6.4**

### Property 9: Semantic HTML Structure

*For any* rendered About page, the page should use semantic HTML elements (section, article, nav, header) rather than generic div elements for major content areas.

**Validates: Requirements 7.5**

### Edge Cases and Examples

The following scenarios should be tested with unit tests as specific examples:

1. **Bio section appears at top** (Requirements 1.1)
2. **Bio includes current role** (Requirements 1.2)
3. **Bio includes educational background** (Requirements 1.3)
4. **Experience section appears below bio** (Requirements 2.1)
5. **Publications section exists** (Requirements 3.1)
6. **Both specified publications are present** (Requirements 3.5)
7. **Skills section exists** (Requirements 4.1)
8. **Skills displayed in list or grid format** (Requirements 4.3)
9. **Layout component is used** (Requirements 5.1)
10. **Mobile responsive rendering** (Requirements 5.4)
11. **LinkedIn link is present** (Requirements 6.1)
12. **SEO component is present** (Requirements 6.5)
13. **Publication data accuracy** (Requirements 7.4)

## Implementation Notes

### Content Management

For the initial implementation, content will be stored as JavaScript constants within the About page component. This provides:
- Easy updates by editing a single file
- Type safety with JSDoc comments or TypeScript
- No need for external CMS or data files

Future enhancements could move content to:
- Separate JSON or YAML files
- MDX files for rich text formatting
- Headless CMS for non-technical content updates

### Performance Considerations

1. **No External API Calls**: All content is static and bundled at build time
2. **Image Optimization**: If profile photos are added, use Gatsby Image plugin
3. **Code Splitting**: Not necessary for this page (small bundle size)
4. **CSS Modules**: Scoped styles prevent global CSS bloat

### Accessibility Checklist

- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] All links have descriptive text
- [ ] External links have appropriate `rel` attributes
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible on all interactive elements
- [ ] Semantic HTML elements used throughout
- [ ] Page is keyboard navigable

### Browser Compatibility

Target browsers:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

CSS features used:
- CSS Grid (widely supported)
- Flexbox (widely supported)
- CSS Modules (build-time transformation)
