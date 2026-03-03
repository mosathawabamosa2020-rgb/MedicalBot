-- Manual migration: add indexes for Reference and VerificationLog
-- Created: 2026-03-03

CREATE INDEX IF NOT EXISTS idx_reference_status ON "Reference" (status);
CREATE INDEX IF NOT EXISTS idx_reference_uploadedAt ON "Reference" ("uploadedAt");

CREATE INDEX IF NOT EXISTS idx_verificationlog_referenceId ON "VerificationLog" ("referenceId");
CREATE INDEX IF NOT EXISTS idx_verificationlog_reviewerId ON "VerificationLog" ("reviewerId");
