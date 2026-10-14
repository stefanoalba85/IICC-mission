// Main navigation — every page listed in Struttura.csv is reachable from here.
export interface NavLink { label: string; href: string; }
export interface NavColumn { title: string; href?: string; links: NavLink[]; }
export interface NavMenu { label: string; columns: NavColumn[]; wide?: boolean; alignRight?: boolean; }

const l = (label: string, href: string): NavLink => ({ label, href });

export const menus: NavMenu[] = [
  {
    label: 'About Us',
    columns: [
      { title: 'Who We Are', href: '/about-us', links: [
        l('About Us', '/about-us'), l('Our Mission', '/about-us/our-mission'), l('Our Vision', '/about-us/our-vision'),
        l('Our Story', '/about-us/our-story'), l('Our Leadership', '/about-us/our-leadership'),
      ] },
      { title: 'Our Founder', href: '/about-us/ambassador-founder', links: [
        l('Ambassador & Founder', '/about-us/ambassador-founder'), l('Founder Messages', '/about-us/founder-messages'),
        l("Prison Didn't Break Me", '/about-us/prison-didnt-break-me'),
      ] },
      { title: 'Inspired by Faith', href: '/about-us/inspired-by-faith', links: [
        l('Inspired by Faith', '/about-us/inspired-by-faith'), l('Pope Francis', '/about-us/pope-francis'), l('Pope Leo XIV', '/about-us/pope-leo-xiv'),
        l('Cardinal George Pell', '/about-us/cardinal-george-pell'), l('Archbishop Peter Comensoli', '/about-us/peter-comensoli'),
      ] },
      { title: 'Our People', href: '/about-us/our-people', links: [
        l('Our People', '/about-us/our-people'), l('Staff & Volunteers', '/about-us/our-people/staff-volunteers'),
        l('Professional Partners', '/about-us/our-people/professional-partners'), l('Acknowledgements', '/about-us/our-people/acknowledgements'),
      ] },
    ],
  },
  {
    label: 'Our Services',
    wide: true,
    columns: [
      { title: 'Who We Serve', href: '/our-services/who-we-serve', links: [
        l('Incarcerated Individuals', '/our-services/who-we-serve/incarcerated-individuals'),
        l('Immigration Detainees', '/our-services/who-we-serve/immigration-detainees'),
        l('Families Affected by Detention', '/our-services/who-we-serve/families-affected-by-detention'),
        l('Victims of Abuse & Domestic Violence', '/our-services/who-we-serve/victims-of-abuse-domestic-violence'),
        l('Vulnerable Communities', '/our-services/who-we-serve/vulnerable-communities'),
        l('Former Inmates & Detainees', '/our-services/who-we-serve/former-inmates-detainees'),
        l('Restoration & Reintegration', '/our-services/who-we-serve/restoration-reintegration'),
      ] },
      { title: 'Prison Ministry', href: '/our-services/prison-ministry', links: [
        l('Spiritual & Pastoral Care', '/our-services/prison-ministry/spiritual-pastoral-care'),
        l('Prison Visits', '/our-services/prison-ministry/prison-visits'),
        l('Prisoner Support', '/our-services/prison-ministry/prisoner-support'),
        l('Letters of Hope', '/our-services/prison-ministry/letters-of-hope'),
        l('Phone & Communication Support', '/our-services/prison-ministry/phone-communication-support'),
        l('Legal Support & Referrals', '/our-services/prison-ministry/legal-support-referrals'),
        l('Rights Awareness', '/our-services/prison-ministry/rights-awareness'),
        l('Prison Resources', '/our-services/prison-ministry/prison-resources'),
        l('Prison Education & Skills', '/our-services/prison-ministry/prison-education-skills'),
        l('Rehabilitation Programs', '/our-services/prison-ministry/rehabilitation-programs'),
        l('Mental Health Support in Prison', '/our-services/prison-ministry/mental-health-support'),
        l('Family Support for Prisoners', '/our-services/prison-ministry/family-support'),
        l('Reintegration Support', '/our-services/prison-ministry/reintegration-support'),
        l('Former Prisoner Reintegration', '/our-services/prison-ministry/former-prisoner-reintegration'),
        l('Restorative Justice', '/our-services/prison-ministry/restorative-justice'),
      ] },
      { title: 'Immigration Detention', href: '/our-services/immigration-detention', links: [
        l('Immigration Detention Support', '/our-services/immigration-detention/immigration-detention-support'),
        l('Preparing for Detention', '/our-services/immigration-detention/preparing-for-detention'),
        l('Support for Detainees', '/our-services/immigration-detention/support-for-detainees'),
        l('Family Support During Detention', '/our-services/immigration-detention/family-support'),
        l('Legal Referral Services', '/our-services/immigration-detention/legal-referral-services'),
        l('Humanitarian Assistance', '/our-services/immigration-detention/humanitarian-assistance'),
        l('Faith & Pastoral Care', '/our-services/immigration-detention/faith-pastoral-care'),
        l('Community Integration', '/our-services/immigration-detention/community-integration'),
        l('Immigration Detention Resources', '/our-services/immigration-detention/immigration-detention-resources'),
      ] },
      { title: 'Mental Health & Wellbeing', href: '/our-services/mental-health', links: [
        l('Mental Health Resources', '/our-services/mental-health/mental-health-resources'),
        l('Mental Health in Detention', '/our-services/mental-health/mental-health-in-detention'),
        l('Long-Term Detention', '/our-services/mental-health/long-term-detention'),
        l('Family Mental Health Support', '/our-services/mental-health/family-mental-health-support'),
        l('Crisis Support Resources', '/our-services/mental-health/crisis-support-resources'),
      ] },
      { title: 'Advocacy & Human Rights', href: '/our-services/advocacy', links: [
        l('Human Dignity in Detention', '/our-services/advocacy/human-dignity-in-detention'),
        l('Human Dignity in Italian Prisons', '/our-services/advocacy/human-dignity-italian-prisons'),
        l('Prison Conditions Worldwide', '/our-services/advocacy/prison-conditions-worldwide'),
        l('Rehabilitation for Every Prisoner', '/our-services/advocacy/rehabilitation-for-every-prisoner'),
        l('International Human Rights Campaign', '/our-services/advocacy/international-human-rights-campaign'),
        l('UN Human Rights Advocacy', '/our-services/advocacy/un-human-rights-advocacy'),
        l('International Legal Advocacy', '/our-services/advocacy/international-legal-advocacy'),
        l('Research & Reports', '/our-services/advocacy/research-reports'),
        l('International Research', '/our-services/advocacy/international-research'),
        l('Article 41-bis & Human Rights', '/our-services/advocacy/article-41-bis-human-rights'),
        l('Article 41-bis Reform Campaign', '/our-services/advocacy/article-41-bis-reform'),
        l('Immigration Reform Campaign', '/our-services/advocacy/immigration-reform-campaign'),
        l('Australia Section 501 Campaign', '/our-services/advocacy/australia-section-501-campaign'),
        l('Mandatory Visa Cancellation Reform', '/our-services/advocacy/mandatory-visa-cancellation'),
        l('Petition Campaigns', '/our-services/advocacy/petition-campaigns'),
        l('Support Justice Campaign', '/our-services/advocacy/support-justice-campaign'),
      ] },
    ],
  },
  {
    label: 'Programs',
    columns: [
      { title: 'Hope Companion Program', href: '/programs/hope-companion', links: [
        l('How the Program Works', '/programs/hope-companion/how-it-works'),
        l('Training & Safeguarding', '/programs/hope-companion/training-safeguarding'),
        l('Prison Companion Program', '/programs/hope-companion/prison-companion-program'),
        l('Detainee Companion Program', '/programs/hope-companion/detainee-companion-program'),
        l('Become a Hope Companion', '/programs/hope-companion/become-a-companion'),
        l('Hope Companion Stories', '/programs/hope-companion/stories'),
        l('10,000 Hope Companions', '/programs/hope-companion/10000-companions'),
      ] },
      { title: 'Social Enterprise', href: '/programs/bakery-of-hope', links: [
        l('Francis Bakery of Hope', '/programs/bakery-of-hope'),
      ] },
    ],
  },
  {
    label: 'Get Involved',
    columns: [
      { title: 'Take Part', href: '/get-involved', links: [
        l('Get Involved', '/get-involved'), l('Volunteer Program', '/get-involved/volunteer-program'),
        l('Volunteer Application', '/get-involved/volunteer-application'), l('Ambassador Program', '/get-involved/ambassador-program'),
        l('Submit Your Story', '/get-involved/submit-your-story'),
      ] },
      { title: 'Give', href: '/donate', links: [
        l('Donate', '/donate'), l('Your Impact', '/donate/impact'), l('Monthly Giving', '/donate/monthly-giving'),
        l('Corporate Giving', '/donate/corporate-giving'), l('Leave a Legacy', '/donate/legacy'),
      ] },
      { title: 'Ask for Help', links: [
        l('Prayer Request', '/get-involved/prayer-request'), l('Support Request Form', '/get-involved/support-request'),
      ] },
    ],
  },
  {
    label: 'Partnerships',
    alignRight: true,
    columns: [
      { title: 'Global Mission Network', href: '/partnerships', links: [
        l('Global Mission Network', '/partnerships'), l('Rome Headquarters', '/partnerships/rome-headquarters'),
        l('International Branches', '/partnerships/international-branches'), l('Italian Branches', '/partnerships/italian-branches'),
        l('Australian Branches', '/partnerships/australian-branches'),
      ] },
      { title: 'Mission Structure', links: [
        l('National Missions', '/partnerships/national-missions'), l('State Missions', '/partnerships/state-missions'),
        l('Regional Missions', '/partnerships/regional-missions'), l('USA Expansion', '/partnerships/usa-expansion'),
        l('Canada Expansion', '/partnerships/canada-expansion'),
      ] },
      { title: 'Church Partners', links: [
        l('Churches & Parish Partners', '/partnerships/churches-parish-partners'),
      ] },
    ],
  },
  {
    label: 'Resources',
    alignRight: true,
    columns: [
      { title: 'Resource Centre', href: '/resources', links: [
        l('Resource Centre', '/resources/resource-centre'), l('Recommended Books', '/resources/recommended-books'),
        l('Articles & Insights', '/resources/articles'), l('Videos & Messages', '/resources/videos'),
        l('Download Guides', '/resources/download-guides'), l('Bible & Daily Gospel', '/resources/bible-daily-gospel'),
        l('Prayer Resources', '/resources/prayer-resources'), l('Family Resources', '/resources/family-resources'),
      ] },
      { title: 'Autism Resources', href: '/resources/autism', links: [
        l('Autism Awareness', '/resources/autism/awareness'), l('Autism Support', '/resources/autism/support'),
        l('Autism Family Support', '/resources/autism/family-support'), l('Autism Advocacy', '/resources/autism/advocacy'),
        l('Autism Support Request', '/resources/autism/support-request'),
      ] },
    ],
  },
];
