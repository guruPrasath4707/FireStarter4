# FireStarter4 / Pathlight implementation plan

This is the working checklist for improving the existing application without pretending unfinished features are complete. Work is split into reviewable milestones; a milestone is marked complete only after its relevant checks pass.

## Repository baseline observed

- React 18, Vite 5, React Router 7, and Tailwind CSS 4.
- Firebase email/password auth and Firestore-backed user profiles are wired in the client.
- Career Explorer reads a 12-item local demo catalogue. Interest overlap is calculated from profile tags; salary and outlook values remain illustrative and unverified.
- Learning Hub is a curated external-resource catalogue with self-reported completion. The Assessments route now hosts a deterministic career-interest self-reflection; AI Mentor, Scholarships, and Opportunities remain unfinished.
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
- [x] Learning Hub: curated starter catalogue with publisher/source metadata, provider-specific license/terms links, topic/interest filters, and Firestore-persisted self-reported completion.
- [x] Career-interest check-in: eight-question deterministic self-reflection, full tag-score breakdown, and saved latest preference result without aptitude/career-prediction claims.
- [x] Foundations check-in: separate fixed eight-question knowledge quiz, deterministic domain scoring, answer explanations, Learning Hub resource suggestions, validated last-result persistence, and regression tests. Not adaptive and not a validated proficiency test.
- [ ] AI Mentor: define a server-side API contract and safe deployment approach before connecting a model; no provider secrets in Vite client variables.
- [ ] Scholarships and Opportunities: define verified source, freshness date, eligibility fields, application URL, and update owner before presenting listings as real.
- [x] Dashboard: derive profile metrics from saved records and link users into the working Learning Hub and saved-career filter.

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

Profile/dashboard reliability was completed and merged in PR #7. Profile forms rehydrate only when clean, save changes are validated with visible feedback, unsupported language choices are removed, inactive settings controls are replaced with status notes, and dashboard statistics are derived from saved profile data.

Learning Hub was completed and merged in PR #9. It provides a source-reviewed catalogue of external resources, interest filtering, and atomic self-reported completion state in Firestore; it does not host courses, verify external activity, or award certificates. External links and provider terms need periodic review.

The career-interest check-in was completed and merged in PR #11. Its eight prompts are a transparent self-reflection, with one point per selected activity tag and latest-result persistence; it makes no aptitude or career-success prediction.

Learning Hub rights metadata was merged in PR #12. Resource cards include provider-specific license/terms links and distinguish source-documented licenses from general service terms; external links and terms still require periodic review.

The career-interest self-reflection was completed and merged in PR #11; it records current activity preferences without right/wrong answers or career-success predictions. The separate foundations knowledge check is implemented on `work/foundations-checkin-two-modes-2026-10-25`. It uses eight fixed questions, deterministic domain scores, answer explanations, mapped Learning Hub suggestions, and a distinct saved-result field that does not overwrite the career-interest result. CI must pass before the knowledge-check work is considered verified.
