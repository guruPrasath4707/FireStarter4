# Career Explorer

The Career Explorer is a small reference catalogue and navigation aid. It is not an AI recommender or a live labour-market feed.

## What works

- Search by role, description, or skill.
- Filter by the six catalogue categories.
- See a transparent count of the profile interests that overlap a career's tags.
- See catalogue entries sorted by overlap count when interests are available; with no interests, catalogue order is preserved.
- Save and remove careers from the signed-in user's path; saved choices are stored with the user's Firestore profile and can be filtered in the catalogue.
- Open detail pages with skills, example learning stages, related careers, and illustrative salary fields.

## Data and limitations

- The catalogue contains 12 local records and six categories in `data/careers.mock.ts`.
- Interest overlap is a deterministic tag intersection; it is not an AI score, aptitude result, or probability of career success.
- Salary ranges, market outlook labels, skill weights, roadmaps, and descriptions are illustrative placeholders. They are not currently linked to dated authoritative labour-market sources and must not be presented as current verified guidance.
- Catalogue entries do not currently provide source citations. Add a source, geography, publication date and methodology before promoting salary/growth information as factual.
- The Career Explorer and detail pages show an explicit notice that salary/outlook values are unverified illustrative placeholders. This is a risk disclosure, not a substitute for country-specific, dated labour-market sources.
- Saved-career IDs are stored in `users/{uid}.savedCareerIds` using Firestore array transforms to avoid duplicate entries when saving from multiple tabs.

## Structure

```text
careers/
  data/careers.mock.ts
  services/careerFit.js
  services/careersService.ts
  pages/CareerExplorerPage.jsx
  pages/CareerDetailPage.jsx
  components/
```
