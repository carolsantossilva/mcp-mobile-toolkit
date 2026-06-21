# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities through GitHub's private security
advisory feature for this repository. Do not open a public issue or pull request
containing exploit details, secrets, personal data, or unredacted mobile
artifacts.

Include the affected version or commit, impact, reproduction steps, and any
suggested mitigation. Use synthetic data whenever possible. Maintainers will
acknowledge a report within five business days and will coordinate disclosure
after a fix or mitigation is available.

If the private advisory feature is unavailable, contact the repository owner
privately before sharing details elsewhere.

## Supported versions

Until the first stable release, security fixes are provided on the default
branch only. After version 1.0, this section will identify the supported release
lines.

## Sensitive fixture policy

Logs, crash reports, issue descriptions, localization bundles, feedback, and
release metadata can contain credentials, access tokens, email addresses, device
identifiers, application identifiers, and personal filesystem paths.

- Commit only synthetic or irreversibly anonymized fixtures.
- Never commit production logs, customer content, credentials, signing material,
  provisioning profiles, or private keys.
- Replace identifiers consistently so relationships needed by a test remain
  meaningful without preserving real values.
- Keep fixtures minimal and document which behavior each fixture covers.
- Treat generated snapshots and failure output as sensitive until reviewed.
- Remove a fixture immediately if its provenance or anonymization is uncertain,
  then rotate any exposed secret through the appropriate provider.

The runtime must not persist submitted artifacts or emit them to diagnostics.
Protocol output and errors must use the project's redaction and sanitization
rules.
