// Donation settings for the Donate page form (src/components/DonationForm.astro).
// Card details are never handled by this site: donors complete payment on PayPal (or Stripe) hosted pages.
// Fill in the empty values once the client provides them; empty values show a "coming soon" notice instead.

export interface Campaign { title: string; text?: string; url: string; }

export const donations = {
  currency: 'EUR',
  amounts: [10, 25, 50, 100],
  defaultAmount: 25,

  // PayPal Business: the account email or merchant ID. Donors without a PayPal account can pay by card as guests.
  // Verify on the live account that guest card payments and monthly donations are available for Italy.
  paypal: { business: '' },

  // Optional alternative for cards. Stripe Payment Links: `oneTime` should be a "customer chooses what to pay" link;
  // `monthly` maps each preset amount to a recurring link (Stripe does not support a free amount on recurring links).
  // When `oneTime` is set, the Card option uses Stripe instead of PayPal's guest card checkout.
  stripe: { oneTime: '', monthly: {} as Record<number, string> },

  bank: { holder: '', iban: '', bic: '', bankName: '', reference: 'Donation – IICC Mission' },

  gofundme: [] as Campaign[],
};
