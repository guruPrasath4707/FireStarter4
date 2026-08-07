# features/careers

Career Explorer module — listing + detail.

## Structure

```
careers/
├── data/careers.mock.ts            # 12 careers, 6 categories
├── services/careersService.ts      # list({query,category,interests}), getById(id)
├── pages/
│   ├── CareerExplorerPage.jsx      # listing + filters + stats
│   └── CareerDetailPage.jsx        # details + roadmap + related
├── components/
│   ├── CareerFilters.jsx
│   ├── CareerCard.jsx
│   ├── CareerGrid.jsx
│   ├── CareerDetailHeader.jsx
│   ├── RoadmapPreview.jsx
│   └── SkillBar.jsx
├── types.ts
└── index.js                        # barrel
```

## Personalization

The page reads `profile.interests` from `ProfileContext` and passes it to
`careersService.list()`. The service uses the interests as a soft filter today
(the mock has them in `career.interests`) and the **mock** `matchScore` drives
the on-card progress bar. AI/recommendation scoring is a later phase.

## Backend swap

`careersService.ts` is gated by a `USE_MOCK` flag. When the backend is live,
flip the flag and the service routes through `apiClient.get('/careers')`. The
response shape (`{ items, total, categories }`) is stable.

## Routes

- `/careers`       — listing
- `/careers/:id`   — detail (accepts `c-001` id or slug)
