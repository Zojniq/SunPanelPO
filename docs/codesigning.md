# Windows Code Signing — Solar Designer Pro

> Document version: 1.0 (initial baseline, T1.1.3 of AP-02 / Phase 1).
> This document does **not** change build settings. It describes the
> recommended path. Actual integration into `package.json` / CI is a
> follow-up task once a certificate is acquired.

## 1. Why code signing matters for this product

Solar Designer Pro is distributed as an unsigned `.exe` NSIS installer
(`npm run dist`). On Windows, this leads to three concrete problems for the
target user (an Italian PV designer downloading the installer):

1. **SmartScreen warning** ("Windows protected your PC — unrecognised
   publisher"). The user must click "More info" → "Run anyway". Most
   non-technical users abort here.
2. **Antivirus heuristics**. Unsigned Electron binaries trigger
   false-positive flags in some AV products, especially on first
   distribution.
3. **Corporate IT blocks**. Studios that use endpoint management (Intune,
   Defender for Endpoint) often block unsigned executables at the policy
   level.

Code signing solves problem 1 fully (once SmartScreen reputation is built)
and problems 2 and 3 partially. It does **not** make the product more
secure — it makes its provenance verifiable.

## 2. State of Windows code signing (as of 2024+)

A change in **June 2023** broke the historical "buy a .pfx file, sign on
any laptop" workflow:

- The CA/Browser Forum tightened the baseline requirements. **All publicly
  trusted code-signing private keys must now live on hardware** (FIPS 140-2
  Level 2 / Common Criteria EAL 4+).
- Practically: any OV (Organization Validation) or EV (Extended Validation)
  certificate issued after June 2023 ships either as a USB hardware token
  or requires a cloud HSM.
- File-based `.pfx` signing for newly issued certificates is no longer
  available from public CAs.
- Existing pre-2023 `.pfx` files continue to work until they expire.

This change makes CI/CD signing harder — physical USB tokens cannot be
plugged into a GitHub Actions runner. Three viable answers exist:

| Path | How keys live | CI-friendly | Cost (rough) | SmartScreen reputation |
|---|---|:---:|---|---|
| **Microsoft Trusted Signing** | Cloud HSM, managed by Microsoft | Yes | ~$10/month + setup | Inherits Microsoft trust — fast |
| **EV cert + USB token** | Physical USB token at a build machine | Awkward | ~$300–500/year | Immediate (EV bypasses SmartScreen reputation phase) |
| **OV cert + cloud HSM** | DigiCert KeyLocker, SSL.com eSigner, etc. | Yes | ~$200–400/year | Slow (must build reputation over time) |
| Self-signed | Local file, untrusted | Yes | Free | None — useless for distribution |

## 3. Recommended path: Microsoft Trusted Signing

For Solar Designer Pro the recommendation is **Microsoft Trusted Signing**
(formerly "Azure Code Signing"). Rationale:

- **No USB token to manage.** Keys live in Microsoft's HSM cluster. No
  shipping, no token loss, no build-machine pinning.
- **CI-native.** Works from any GitHub Actions / Azure DevOps / on-prem
  runner with a service principal — no hardware passthrough.
- **SmartScreen reputation inherits from Microsoft.** A signed installer
  generally **does not** trigger the unknown-publisher warning even on
  first download. (This is the main reason to choose this path for a
  small-volume product like a desktop engineering tool — building
  reputation via OV over thousands of downloads is impractical.)
- **Cost.** As of 2024 pricing, ~$9.99/month base + per-signature fees.
  Cheaper than EV over a 2-year horizon for low-volume signing.
- **Identity validation** (one-time, ~2–5 business days):
  - For an Italian S.r.l. / S.p.A.: D-U-N-S number + visura camerale.
  - For an individual / ditta individuale: personal ID + tax records.

The trade-off: requires an Azure subscription. For an Italian small studio
that does not yet have Azure, this means signing up.

### When to choose another path

- **You already have an EV USB token from before June 2023** → keep using
  it until expiry. Switching mid-cycle is not worth it.
- **You will never use cloud infrastructure for any reason** → EV USB token
  is the path of least administrative friction, even with the CI awkwardness.
- **The product will eventually have other reasons for Azure (Trusted
  Signing for other apps, telemetry, build agents)** → consolidate on
  Trusted Signing.

## 4. Alternative paths (summary only)

### 4.1 EV certificate with USB token

- Issue: Sectigo, DigiCert, GlobalSign.
- Cost: ~$300–500/year.
- SmartScreen: bypasses the reputation phase immediately.
- Signing: USB token plugged into the Windows build machine; install the
  vendor's token driver + signtool.
- CI: requires a self-hosted Windows runner with the token plugged in
  permanently — operationally fragile.
- Useful when: you already own a token, or you do not use cloud services.

### 4.2 OV certificate with cloud HSM

- Issue: DigiCert KeyLocker, SSL.com eSigner, Sectigo cloud signing.
- Cost: ~$200–400/year.
- SmartScreen: must build reputation slowly. A new product with low
  download volume can spend months in the unknown-publisher state.
- Signing: HTTPS API call from CI to the cloud HSM; signtool with cloud
  plugin.
- CI: works well.
- Useful when: cost-sensitive and you can tolerate a slow SmartScreen
  warm-up. Generally **not recommended** for the SDP use case unless
  there is a specific reason not to use Trusted Signing.

### 4.3 Self-signed (do not use for distribution)

Self-signed certificates can be useful for **internal testing only**:
verifying the signing pipeline before purchasing a real certificate. They
must never reach end users — they trigger every warning the system has.

## 5. electron-builder integration (informational, do not apply yet)

This section describes the changes that **will** be needed in
`package.json` once a certificate is acquired. It is intentionally not
applied as part of T1.1.3.

### 5.1 With Microsoft Trusted Signing

`package.json` `build.win` would gain (illustrative, names per
electron-builder 24+ documentation):

```
"win": {
  "target": "nsis",
  "icon": "icon.ico",
  "signtoolOptions": {
    "signingHashAlgorithms": ["sha256"],
    "publisherName": "Nome S.r.l."
  },
  "azureSignOptions": {
    "endpoint": "https://eus.codesigning.azure.net/",
    "codeSigningAccountName": "solardesigner-csa",
    "certificateProfileName": "solardesigner-profile"
  }
}
```

Authentication uses an Azure service principal exposed via env vars:
`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`. These live in
CI secrets and are never committed.

### 5.2 With EV USB token

`package.json` `build.win` would gain:

```
"win": {
  "target": "nsis",
  "icon": "icon.ico",
  "certificateSubjectName": "Nome S.r.l.",
  "signingHashAlgorithms": ["sha256"],
  "signtoolOptions": {
    "publisherName": "Nome S.r.l."
  }
}
```

The signing identity is picked from the Windows certificate store where
the USB token surfaces it. Build machine must have the token's driver
installed and the device plugged in during `npm run dist`.

### 5.3 With OV cloud HSM (DigiCert KeyLocker)

`package.json` `build.win` would gain a custom `sign` function pointing at
a Node module that proxies to the KeyLocker CLI:

```
"win": {
  "target": "nsis",
  "icon": "icon.ico",
  "sign": "./build/sign.js"
}
```

`build/sign.js` would shell out to `smctl sign` (DigiCert) or equivalent.

## 6. CI considerations

A signed-installer pipeline (future Phase 2 AP-13 work) needs the
following secrets, none of which are present in `INVARIANTS.md` data or
`COMPLIANCE.md`:

- Trusted Signing path: `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`,
  `AZURE_CLIENT_SECRET`.
- EV token path: not CI-able without a self-hosted Windows runner; do
  signing manually on the release machine.
- KeyLocker path: `SM_API_KEY`, `SM_CLIENT_CERT_FILE` (Base64 encoded in
  secrets), `SM_CLIENT_CERT_PASSWORD`, `SM_HOST`.

Rules:

- Secrets are CI-scoped, never in `package.json`.
- Signing runs only on `main` branch or tagged releases — never on PRs.
- Build artefacts must be re-signed after any post-build modification.
- The signed installer is the **authoritative artefact** — once produced
  it is uploaded to GitHub Releases (or equivalent) and not modified.

## 7. SmartScreen reputation

Even with OV signing, SmartScreen shows the "unrecognised publisher"
warning until enough users have run the installer without flagging it.
Practical numbers:

- ~3,000 unique installs over ~1 week is a rough threshold (Microsoft does
  not publish a hard number).
- For a low-volume engineering product this can take **months** or never
  happen organically.

With **Trusted Signing** or **EV**, the warning is generally bypassed from
the first download.

Microsoft also lets publishers submit signed installers to the
[Microsoft Defender SmartScreen analysis form](https://www.microsoft.com/en-us/wdsi/filesubmission)
to accelerate the reputation phase if needed. Useful as a tactical step,
not a substitute for proper signing.

## 8. Step-by-step: setting up Microsoft Trusted Signing

This is the recommended workflow when the project is ready to ship a
signed v1.0 to real users. Estimated total time: **1 working day spread
over 1 week** (most of the wait is identity validation).

1. **Create an Azure subscription** (if not already in place). Pay-as-you-go
   is sufficient — no enterprise plan needed.

2. **Create a Trusted Signing account** in the Azure portal under
   "Trusted Signing Accounts". Choose region `East US 2` or `West Europe`
   (the latter has better latency from Italy).

3. **Submit identity verification** for the account. For an Italian S.r.l.:
   - Legal name as it appears in the visura camerale.
   - VAT number / partita IVA.
   - D-U-N-S number (request free via Dun & Bradstreet if not present).
   - Authorised representative's documents.

   Wait 2–5 business days for approval.

4. **Create a certificate profile** under the account. Profile type:
   `Public Trust`. The display name becomes the `publisherName` shown in
   SmartScreen.

5. **Create an Azure AD service principal** with role `Trusted Signing
   Certificate Profile Signer` scoped to the certificate profile. Capture
   `tenantId`, `clientId`, `clientSecret`.

6. **Test signing locally** on the release machine:
   - Install `Azure.CodeSigning.Dlib` and configure
     `metadata.json` with endpoint + profile.
   - Sign a throwaway binary with `signtool` to validate the chain.

7. **Add electron-builder `azureSignOptions`** to `package.json` (see §5.1).
   Add env vars to release-only CI secrets.

8. **Run `npm run dist`** with env vars set. The installer is now signed.

9. **Verify**:
   - Right-click `Solar Designer Pro Setup *.exe` → Properties → Digital
     Signatures. Signer name matches `publisherName`.
   - `signtool verify /pa /v` on Windows shows the full chain.
   - Open the installer on a fresh Windows machine with no prior product
     trust → SmartScreen banner should **not** appear, or show the verified
     publisher name in the soft warning.

10. **Distribute**: upload signed installer to GitHub Releases / your own
    distribution channel. Communicate to users that the publisher is
    "Nome S.r.l." so they can verify.

## 9. Verification commands

After signing, regardless of path:

```
# PowerShell on Windows
Get-AuthenticodeSignature ".\dist\Solar Designer Pro Setup 1.0.0.exe"
```

Should return `Status: Valid`, `SignerCertificate` with the expected
subject, and `TimeStamperCertificate` populated.

```
# With Windows SDK signtool
signtool verify /pa /v "dist\Solar Designer Pro Setup 1.0.0.exe"
```

Should print the certificate chain ending at a trusted root, plus a
timestamp counter-signature.

## 10. Troubleshooting

**"The signature is not timestamped."**
A timestamp counter-signature is mandatory; without it the signature
becomes invalid when the cert expires. electron-builder enables
timestamping by default via `signingHashAlgorithms`. If missing, add a
timestamp URL (`http://timestamp.digicert.com` or
`http://timestamp.acs.microsoft.com` for Trusted Signing).

**"SmartScreen still shows the warning after signing."**
- If using OV: expected. Build reputation over weeks or use Microsoft
  Defender SmartScreen submission form.
- If using EV / Trusted Signing: verify the signer chain and rebuild. A
  broken chain (intermediate cert missing) causes SmartScreen to ignore
  the signature.

**"electron-builder fails with `signtool not found`."**
Install Windows SDK ≥ 10.0.22621 (which includes signtool) on the build
machine. macOS / Linux runners cannot directly use signtool — they must
delegate to a Windows runner for the signing step.

**"Token unplugged" mid-build (EV path)."**
Use a USB extension cable to a permanent port; the token surfaces as a
USB-HID device and Windows occasionally drops it. Plug-and-stay setups
work better than dock-based ones.

**"Azure service principal cannot sign — 403."**
The role assignment is at the certificate profile level, not the account
level. Re-check that `Trusted Signing Certificate Profile Signer` is
scoped exactly to the profile, not to the parent account.

---

## When to revisit this document

- When a certificate is purchased — convert §5 from informational to
  applied, update `package.json` build config in a dedicated PR (post
  T1.1.3, separate task).
- When Microsoft changes Trusted Signing pricing or capabilities (check
  yearly).
- When CA/Browser Forum baseline requirements change again (rare but
  possible).
- When the product moves cross-platform (macOS notarisation, Linux
  signing) — separate document.
