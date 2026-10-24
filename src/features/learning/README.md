# Learning Hub

The Learning Hub is a catalogue of links to third-party learning materials, not a course-hosting or learning-management system.

## Implemented

- Six curated starting resources with title, publisher, topic category, learner level, summary, and topic tags.
- Direct links to the publisher's source page. The content remains on the provider's site; Pathlight does not reproduce lesson text or media.
- Search by title, provider, category, level, summary, or topic.
- Filter by topic category and by overlap with the interest tags in the signed-in user's profile.
- Sort by explicit interest-tag overlap when interests are present. This is a transparent tag count—not an assessment of ability or learning style.
- Self-mark a resource as complete or reopen it. The user's completed resource IDs are stored in Firestore at `users/{uid}.completedLearningResourceIds` using atomic array transforms.
- Completion state is a self-report only. Pathlight does not verify activity on external websites, issue certificates, or measure mastery.

## Source and rights notes

Each record keeps the publisher name, target URL, source URL, source review date, resource type, and a rights note. Links were checked on 25 October 2026. This is a link review date, not a guarantee that providers will never change their content. Third-party resources remain subject to the provider's terms and any license shown at the destination.

## Included providers

- MDN Web Docs: beginner first-website tutorial and core web development curriculum.
- Python Software Foundation: official Python tutorial; it assumes basic programming experience.
- Microsoft Learn: beginner Python fundamentals learning path.
- Khan Academy: computing-topic catalogue covering programming and related subjects.
- GitHub Skills: interactive practice catalogue for GitHub and software collaboration.

The local catalogue is deliberately small. It avoids invented lesson content, made-up durations, unverified certificates, and claims that an external course is free or always available.


## Provider-specific licensing and terms (reviewed 25 October 2026)

Each record links to its learning page and a relevant provider rights page. MDN documentation guidance describes CC BY-SA 2.5 or later unless a page states otherwise; MDN code samples can have different terms. Python publishes documentation license information. Microsoft Learn and Khan Academy have service terms, and GitHub Skills can link to repositories with individual licenses. The catalogue links to these resources only and does not republish their lessons.

These notes are navigational summaries, not legal advice or blanket permission to reuse external materials. Verify the current terms and any page- or repository-specific license before copying or redistributing content. Review the links periodically because providers may change their terms.
