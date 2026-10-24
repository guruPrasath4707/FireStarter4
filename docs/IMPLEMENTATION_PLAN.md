# FireStarter4 / Pathlight implementation plan

This is the working checklist for improving the existing application without pretending unfinished features are complete. Work is split into reviewable milestones; a milestone is marked complete only after its relevant checks pass.

## Repository baseline observed

- React 18, Vite 5, React Router 7, and Tailwind CSS 4.
- Firebase email/password auth and Firestore-backed user profiles are wired in the client.
- Career Explorer reads a 12-item local demo catalogue. Interest overlap is calculated from profile tags; salary and outlook values remain illustrative and unverified.
- Learning Hub, AI Mentor, Assessments, Scholarships, and Opportunities are placeholder pages despite navigation entries and early service stubs.
- No test suite existed at the audit baseline. The production build worked but did not detect the route/profile bugs noted below.
- Multiple overlapping UI/layout and Firebase setup modules exist. A root-level Colleges.jsx appears to be legacy and is not part of the active route tree.
- No backend server or Firebase Security Rules file is included in this repository. External Firebase console/rules settings cannot be verified from front-end code alone.

## Ordered work

### 0. Project baseline and CI
- [x] Correct README and setup guidance.
- [x] Add .env.example; ignore local .env* files.
- [x] Add GitHub Actions install/build workflow.
- [x] Confirm production build through GitHub Actions.
- [x] Add an automated test command to CI and confirm tests plus build pass.

### 1. Authentication, onboarding, and profile state
- [x] Make route guards read onboarding state from ProfileContext, not an absent AuthContext property.
- [x] Wait until both auth state and profile subscription are loaded before redirect decisions.
- [x] Prevent a failed profile read from being interpreted as incomplete onboarding; allow retry.
- [x] Remove the profile-seeding race that can overwrite a just-completed onboarding record.
- [x] Test the route-decision matrix with Node's built-in test runner.

### 2. Firebase configuration and data access
- [x] Remove duplicate Firebase app initialization and placeholder hard-coded configuration.
- [x] Make required client configuration explicit and show an actionable setup error.
- [x] Route the legacy profile service through the shared Firestore access layer instead of initializing its own Firebase client.
- [x] Document that Firestore Security Rules are a deployment requirement; client-side route guards are not data authorization.

### 3. Career Explorer correctness
- [x] Replace misleading static “personalized” score labels with transparent, explainable interest matching.
- [x] Ensure no-interest, no-match, loading, and error states behave consistently.
- [x] Persist saved careers atomically and make saved careers discoverable/filterable in the Career Explorer.
- [x] Clearly label salary ranges, market outlook and skill weights as illustrative catalogue content.
- [ ] Validate salary/outlook catalogue data against dated authoritative sources before presenting it as current labour-market information.

### 4. Honest public experience and navigation
- [x] Remove invented testimonials, unsubstantiated learner-count claims, and misleading claims about features that are not implemented.
- [x] Ensure all public navigation anchors land on a real section or route.
- [x] Replace placeholder privacy/terms/help links with real pages or clearly non-interactive copy until those pages exist.
- [x] Bring branding and public-facing UI copy into alignment with implemented capabilities.
- [x] Remove language choices that imply translations are complete when only English is implemented; communicate English-only availability honestly.

### 5. Working student features (incremental, not fake integrations)
- [x] Learning Hub: curated external starter catalogue with source/license notes, search/topic/completion filters, and Firestore-backed self-reported completion state. CI passed for tests and production build; completion is not provider-verified.
- [ ] Assessments: deterministic, explainable baseline quiz and results; avoid unsupported “adaptive” claims.
- [ ] AI Mentor: define a server-side API contract and safe deployment approach before connecting a model; no provider secrets in Vite client variables.
- [ ] Scholarships and Opportunities: define verified source, freshness date, eligibility fields, application URL, and update owner before presenting listings as real.
- [ ] Dashboard: derive progress, streak, and timeline numbers from saved records, not hard-coded zeros or invented percentages.

### 6. Profile and settings reliability
- [x] Rehydrate clean profile forms when saved data changes without overwriting unsaved edits.
- [x] Show profile save errors and success feedback; validate and normalize fields before writes.
- [x] Remove nonfunctional theme/notification controls and explain their current availability.
- [ ] Handle logout and mobile navigation errors/keyboard behavior.

### 7. Architecture, accessibility, security, and performance
- [ ] Audit overlapping components/ui, components/shell, design-system, and layouts modules; consolidate only after reference checks.
- [ ] Resolve unlisted direct dependencies and remove obsolete utilities/configs after reference checks.
- [ ] Add lint/type-check/browser-level regression coverage beyond build-only CI.
- [ ] Review npm audit findings one dependency at a time; avoid blind force upgrades.
- [ ] Split the large initial JavaScript bundle and verify production chunk sizes.
- [ ] Check keyboard navigation, form labels, focus visibility, responsive layout, and accessible error messages.

## Current milestone

Milestone 3 was completed and merged in PR #5. Interest overlap is calculated from profile tags, saved careers persist in Firestore, and unsupported match-score claims were removed.

Milestone 4 was completed and merged in PR #6. The landing page identifies current feature status, removes fabricated testimonials and learner-count claims, provides a working FAQ, and replaces dead footer links with real project links and a notice that legal pages are not yet published.

Milestone 5 now has a working Learning Hub vertical slice on the learning-hub-catalog-completion branch: five official external resources, explicit source/license notes, filters, atomic Firestore completion tracking, and dashboard counts derived from valid catalogue IDs. Tests and the production build passed at commit 700ac3c. The completion status is self-reported and is not verified with the external providers.

Next items in this milestone are a deterministic baseline assessment with explainable results, a defined server-side AI Mentor contract, and verifiable scholarship/opportunity sources. Do not mark these features complete until their behavior, provenance, and regression tests are implemented.
