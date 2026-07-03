
### Update: Form Fix - Mobile Webview Compatibility
- **Issue:** Encountered a fatal runtime "Script error" crash on the "Log New Trade" view inside the Telegram container due to strict UTC ISO string splitting on an HTML `datetime-local` input field.
- **Resolution:** Refactored `TradeForm.tsx` to utilize a robust locale-based generation utility (`getLocalDatetimeString`) that matches the local system time presentation offset perfectly.
