# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\navbar.spec.js >> Services navigation works
- Location: tests\navbar.spec.js:3:1

# Error details

```
Error: locator.click: Error: strict mode violation: getByText('Services') resolved to 4 elements:
    1) <a class="" href="/services">Services</a> aka getByRole('link', { name: 'Services', exact: true })
    2) <h2>Services Built for People</h2> aka getByRole('heading', { name: 'Services Built for People' })
    3) <h4>Our Services</h4> aka getByRole('heading', { name: 'Our Services' })
    4) <a href="/services">All Services</a> aka getByRole('link', { name: 'All Services' })

Call log:
  - waiting for getByText('Services')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - generic [ref=e5]:
      - link "🌿 ServeHub" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: 🌿
        - generic [ref=e8]: ServeHub
      - list [ref=e9]:
        - listitem [ref=e10]:
          - link "Home" [ref=e11] [cursor=pointer]:
            - /url: /
        - listitem [ref=e12]:
          - link "Services" [ref=e13] [cursor=pointer]:
            - /url: /services
        - listitem [ref=e14]:
          - link "Careers" [ref=e15] [cursor=pointer]:
            - /url: /careers
        - listitem [ref=e16]:
          - link "Elder Care" [ref=e17] [cursor=pointer]:
            - /url: /elder-care
      - generic [ref=e19]:
        - link "Sign In" [ref=e20] [cursor=pointer]:
          - /url: /login
        - link "Join Now" [ref=e21] [cursor=pointer]:
          - /url: /register
  - main [ref=e22]:
    - generic [ref=e23]:
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]: 🌱 Building stronger communities since 2024
          - heading "Where Opportunity Meets Compassion" [level=1] [ref=e32]:
            - text: Where
            - emphasis [ref=e33]: Opportunity
            - text: Meets
            - emphasis [ref=e34]: Compassion
          - paragraph [ref=e35]: ServeHub connects job seekers with career opportunities while empowering communities to care for their elders with dignity and love.
          - generic [ref=e36]:
            - link "💼 Explore Careers" [ref=e37] [cursor=pointer]:
              - /url: /careers
              - generic [ref=e38]: 💼
              - text: Explore Careers
            - link "❤️ Help an Elder" [ref=e39] [cursor=pointer]:
              - /url: /elder-care
              - generic [ref=e40]: ❤️
              - text: Help an Elder
          - generic [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e43]: 👩
              - generic [ref=e44]: 👨
              - generic [ref=e45]: 👴
              - generic [ref=e46]: 👵
              - generic [ref=e47]: 🧑
            - paragraph [ref=e48]:
              - text: Joined by
              - strong [ref=e49]: 12,000+ community members
              - text: across India
        - generic [ref=e50]:
          - generic [ref=e51]:
            - generic [ref=e52]: 🤝
            - heading "Together We Serve" [level=3] [ref=e53]
            - paragraph [ref=e54]: Every action creates a ripple of kindness
          - generic [ref=e55]:
            - generic [ref=e56]: 💼
            - generic [ref=e57]:
              - paragraph [ref=e58]: New Job Posted
              - paragraph [ref=e59]: Software Engineer · Remote
          - generic [ref=e60]:
            - generic [ref=e61]: ❤️
            - generic [ref=e62]:
              - paragraph [ref=e63]: Elder Helped Today
              - paragraph [ref=e64]: Grocery run · Chennai
          - generic [ref=e65]:
            - generic [ref=e66]: ⭐
            - generic [ref=e67]:
              - paragraph [ref=e68]: 5-Star Review
              - paragraph [ref=e69]: "\"Life-changing platform!\""
      - generic [ref=e72]:
        - generic [ref=e73]:
          - generic [ref=e74]: 👥
          - generic [ref=e75]: 12,000+
          - generic [ref=e76]: Community Members
        - generic [ref=e77]:
          - generic [ref=e78]: 💼
          - generic [ref=e79]: 3,400+
          - generic [ref=e80]: Jobs Posted
        - generic [ref=e81]:
          - generic [ref=e82]: ❤️
          - generic [ref=e83]: 8,200+
          - generic [ref=e84]: Elders Served
        - generic [ref=e85]:
          - generic [ref=e86]: ⭐
          - generic [ref=e87]: 94%
          - generic [ref=e88]: Satisfaction Rate
      - generic [ref=e90]:
        - generic [ref=e91]:
          - generic [ref=e92]: What We Offer
          - heading "Services Built for People" [level=2] [ref=e93]
          - paragraph [ref=e94]: From career growth to elder care, ServeHub is your community's platform for opportunity and compassion.
        - generic [ref=e95]:
          - link "💼 Career Openings Discover thousands of job opportunities across all sectors. Upload your profile and connect with top employers. →" [ref=e96] [cursor=pointer]:
            - /url: /careers
            - generic [ref=e98]: 💼
            - heading "Career Openings" [level=3] [ref=e99]
            - paragraph [ref=e100]: Discover thousands of job opportunities across all sectors. Upload your profile and connect with top employers.
            - generic [ref=e101]: →
          - link "🌿 Elder Gardening Volunteer to help seniors maintain their gardens — bringing joy and green beauty to their everyday lives. →" [ref=e102] [cursor=pointer]:
            - /url: /elder-care
            - generic [ref=e104]: 🌿
            - heading "Elder Gardening" [level=3] [ref=e105]
            - paragraph [ref=e106]: Volunteer to help seniors maintain their gardens — bringing joy and green beauty to their everyday lives.
            - generic [ref=e107]: →
          - link "🍱 Food Delivery Ensure elders receive nutritious home-cooked meals through our compassionate volunteer delivery network. →" [ref=e108] [cursor=pointer]:
            - /url: /elder-care
            - generic [ref=e110]: 🍱
            - heading "Food Delivery" [level=3] [ref=e111]
            - paragraph [ref=e112]: Ensure elders receive nutritious home-cooked meals through our compassionate volunteer delivery network.
            - generic [ref=e113]: →
          - link "🏥 Medical Assistance Help seniors navigate medical appointments, access medications, and receive the care they deserve. →" [ref=e114] [cursor=pointer]:
            - /url: /elder-care
            - generic [ref=e116]: 🏥
            - heading "Medical Assistance" [level=3] [ref=e117]
            - paragraph [ref=e118]: Help seniors navigate medical appointments, access medications, and receive the care they deserve.
            - generic [ref=e119]: →
          - link "🛒 Grocery Help Assist elderly neighbours with grocery runs, ensuring they always have what they need without the strain. →" [ref=e120] [cursor=pointer]:
            - /url: /elder-care
            - generic [ref=e122]: 🛒
            - heading "Grocery Help" [level=3] [ref=e123]
            - paragraph [ref=e124]: Assist elderly neighbours with grocery runs, ensuring they always have what they need without the strain.
            - generic [ref=e125]: →
          - link "🤝 Companionship Fighting loneliness one visit at a time. Volunteer to spend quality time with seniors who need a friend. →" [ref=e126] [cursor=pointer]:
            - /url: /elder-care
            - generic [ref=e128]: 🤝
            - heading "Companionship" [level=3] [ref=e129]
            - paragraph [ref=e130]: Fighting loneliness one visit at a time. Volunteer to spend quality time with seniors who need a friend.
            - generic [ref=e131]: →
      - generic [ref=e134]:
        - generic [ref=e135]:
          - text: Our Purpose
          - heading "Why ServeHub Exists" [level=2] [ref=e136]
          - paragraph [ref=e137]: India's elders built this nation. Our youth carry its future. ServeHub is the bridge that connects opportunity with gratitude — creating a cycle of giving where career growth funds community care.
          - paragraph [ref=e138]: Every job filled. Every elder helped. Every volunteer hour given. These aren't just transactions — they are acts of profound human kindness.
          - generic [ref=e139]:
            - link "Join the Movement 🌿" [ref=e140] [cursor=pointer]:
              - /url: /register
            - link "Learn More" [ref=e141] [cursor=pointer]:
              - /url: /services
        - generic [ref=e142]:
          - generic [ref=e143]:
            - text: 🌱
            - heading "Grow Together" [level=4] [ref=e144]
            - paragraph [ref=e145]: Career opportunities for everyone
          - generic [ref=e146]:
            - text: ❤️
            - heading "Care Together" [level=4] [ref=e147]
            - paragraph [ref=e148]: Elder support network
          - generic [ref=e149]:
            - text: ✨
            - heading "Thrive Together" [level=4] [ref=e150]
            - paragraph [ref=e151]: A stronger community
          - generic [ref=e152]:
            - generic [ref=e153]: 🌍
            - paragraph [ref=e154]: Community
      - generic [ref=e156]:
        - generic [ref=e157]:
          - generic [ref=e158]: Simple & Easy
          - heading "How ServeHub Works" [level=2] [ref=e159]
        - generic [ref=e160]:
          - generic [ref=e161]:
            - generic [ref=e162]: "01"
            - generic [ref=e163]: 📝
            - heading "Create Your Profile" [level=3] [ref=e164]
            - paragraph [ref=e165]: Sign up as a job seeker, volunteer, or service provider in under 2 minutes.
          - generic [ref=e166]:
            - generic [ref=e167]: "02"
            - generic [ref=e168]: 🔍
            - heading "Browse & Discover" [level=3] [ref=e169]
            - paragraph [ref=e170]: Explore career openings or find elder care requests in your neighbourhood.
          - generic [ref=e171]:
            - generic [ref=e172]: "03"
            - generic [ref=e173]: 🤝
            - heading "Connect & Act" [level=3] [ref=e174]
            - paragraph [ref=e175]: Apply for jobs or accept elder care tasks and start making a difference today.
          - generic [ref=e176]:
            - generic [ref=e177]: "04"
            - generic [ref=e178]: 🌟
            - heading "Build Your Legacy" [level=3] [ref=e179]
            - paragraph [ref=e180]: Track your impact, earn recognition, and grow within the ServeHub community.
      - generic [ref=e182]:
        - generic [ref=e183]:
          - generic [ref=e184]: Community Stories
          - heading "Voices of ServeHub" [level=2] [ref=e185]
        - generic [ref=e186]:
          - generic [ref=e187]:
            - generic [ref=e188]: "\""
            - paragraph [ref=e189]: ServeHub helped me find my purpose. Every week I help Mrs. Rao with groceries, and the smile on her face makes everything worthwhile.
            - generic [ref=e190]:
              - generic [ref=e191]: 👩
              - generic [ref=e192]:
                - paragraph [ref=e193]: Priya Sharma
                - paragraph [ref=e194]: Volunteer · Chennai
          - generic [ref=e195]:
            - generic [ref=e196]: "\""
            - paragraph [ref=e197]: I found my dream job in just 2 weeks using ServeHub. The platform is incredibly easy to use and the job listings are genuine.
            - generic [ref=e198]:
              - generic [ref=e199]: 👨
              - generic [ref=e200]:
                - paragraph [ref=e201]: Rajesh Kumar
                - paragraph [ref=e202]: Job Seeker · Bangalore
          - generic [ref=e203]:
            - generic [ref=e204]: "\""
            - paragraph [ref=e205]: My father lives alone. ServeHub volunteers come twice a week to help him with household tasks. We feel so much more at peace.
            - generic [ref=e206]:
              - generic [ref=e207]: 👩
              - generic [ref=e208]:
                - paragraph [ref=e209]: Meena Patel
                - paragraph [ref=e210]: Elder Care User · Mumbai
      - generic [ref=e217]:
        - heading "Ready to Make a Difference?" [level=2] [ref=e218]
        - paragraph [ref=e219]: Join thousands of people already building careers and transforming lives through ServeHub.
        - generic [ref=e220]:
          - link "Start Your Journey 🌿" [ref=e221] [cursor=pointer]:
            - /url: /register
          - link "Sign In" [ref=e222] [cursor=pointer]:
            - /url: /login
  - contentinfo [ref=e223]:
    - generic [ref=e224]:
      - generic [ref=e225]:
        - generic [ref=e226]:
          - generic [ref=e227]:
            - generic [ref=e228]: 🌿
            - generic [ref=e229]: ServeHub
          - paragraph [ref=e230]: Bridging opportunities, nurturing care — building a better community together.
          - generic [ref=e231]:
            - link "twitter" [ref=e232] [cursor=pointer]:
              - /url: "#"
              - text: 𝕏
            - link "linkedin" [ref=e233] [cursor=pointer]:
              - /url: "#"
              - text: in
            - link "instagram" [ref=e234] [cursor=pointer]:
              - /url: "#"
              - text: 📸
        - generic [ref=e235]:
          - heading "Our Services" [level=4] [ref=e236]
          - list [ref=e237]:
            - listitem [ref=e238]:
              - link "Career Opportunities" [ref=e239] [cursor=pointer]:
                - /url: /careers
            - listitem [ref=e240]:
              - link "Elder Care" [ref=e241] [cursor=pointer]:
                - /url: /elder-care
            - listitem [ref=e242]:
              - link "All Services" [ref=e243] [cursor=pointer]:
                - /url: /services
            - listitem [ref=e244]:
              - link "Become a Volunteer" [ref=e245] [cursor=pointer]:
                - /url: /register?role=volunteer
        - generic [ref=e246]:
          - heading "Platform" [level=4] [ref=e247]
          - list [ref=e248]:
            - listitem [ref=e249]:
              - link "Create Account" [ref=e250] [cursor=pointer]:
                - /url: /register
            - listitem [ref=e251]:
              - link "Sign In" [ref=e252] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e253]:
              - link "My Dashboard" [ref=e254] [cursor=pointer]:
                - /url: /dashboard
            - listitem [ref=e255]:
              - link "Contact Support" [ref=e256] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e257]:
          - heading "About" [level=4] [ref=e258]
          - list [ref=e259]:
            - listitem [ref=e260]:
              - link "Our Mission" [ref=e261] [cursor=pointer]:
                - /url: /mission
            - listitem [ref=e262]:
              - link "Community Impact" [ref=e263] [cursor=pointer]:
                - /url: /impact
            - listitem [ref=e264]:
              - link "Privacy Policy" [ref=e265] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e266]:
              - link "Terms of Service" [ref=e267] [cursor=pointer]:
                - /url: /terms
      - generic [ref=e268]:
        - paragraph [ref=e269]: © 2026 ServeHub. Built with ❤️ for humanity.
        - paragraph [ref=e270]: Serving communities, one person at a time.
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('Services navigation works', async ({ page }) => {
  4  |   await page.goto('http://localhost:3000');
> 5  |   await page.getByText('Services').click();
     |                                    ^ Error: locator.click: Error: strict mode violation: getByText('Services') resolved to 4 elements:
  6  | });
  7  | 
  8  | test('Careers navigation works', async ({ page }) => {
  9  |   await page.goto('http://localhost:3000');
  10 |   await page.getByText('Careers').click();
  11 | });
```