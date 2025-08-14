"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const bookmarkCategories = {
  "Engineering Leadership": [
    {
      title: "What is an Engineering Manager? | AWS Startups Blog",
      url: "https://aws.amazon.com/blogs/startups/what-is-an-engineering-manager/"
    },
    {
      title: "3 Steps for Leaders in Emergencies",
      url: "https://larahogan.me/blog/3-steps-for-leaders-in-emergencies/"
    },
    {
      title: "Three Superpowers",
      url: "https://randsinrepose.com/archives/three-superpowers/"
    },
    {
      title: "Developers Mentoring Other Developers",
      url: "https://blog.pragmaticengineer.com/developers-mentoring-other-developers/"
    },
    {
      title: "The Update, The Vent, and The Disaster",
      url: "https://randsinrepose.com/archives/the-update-the-vent-and-the-disaster/"
    },
    {
      title: "First Time Managers | Lighthouse Blog",
      url: "https://getlighthouse.com/blog/first-time-managers/"
    },
    {
      title: "Team Leader Venn Diagram",
      url: "https://larahogan.me/blog/team-leader-venn-diagram/"
    },
    {
      title: "How to Run a Meeting",
      url: "https://randsinrepose.com/archives/how-to-run-a-meeting/"
    },
    {
      title: "The Definition of a Tech Lead",
      url: "https://www.patkua.com/blog/the-definition-of-a-tech-lead/"
    },
    {
      title: "My team is going in circles...",
      url: "https://larahogan.me/blog/my-team-is-going-in-circles/"
    },
    {
      title: "5 Engineering Manager Archetypes",
      url: "https://www.patkua.com/blog/5-engineering-manager-archetypes/"
    },
    {
      title: "The Engineer/Manager Pendulum",
      url: "https://charity.wtf/2017/05/11/the-engineer-manager-pendulum/"
    },
    {
      title: "Engineering Manager's Guide to Effective Annual Feedback",
      url: "https://peterszasz.com/engineering-managers-guide-to-effective-annual-feedback/"
    },
    {
      title: "The Band Manifesto | Life at Spotify",
      url: "https://www.lifeatspotify.com/being-here/the-band-manifesto"
    },
    {
      title: "The Startup CTO's Journey",
      url: "https://www.foundersinthecloud.com/p/startup-ctos-journey"
    }
  ],
  "Technical Practices": [
    {
      title: "Code Review Best Practices - Lessons from the Trenches",
      url: "https://blogboard.io/blog/code-review-best-practices"
    },
    {
      title: "Promise | TypeScript Deep Dive",
      url: "https://basarat.gitbook.io/typescript/future-javascript/promise"
    },
    {
      title: "My Engineering Axioms",
      url: "https://martinrue.com/my-engineering-axioms/"
    },
    {
      title: "A Better React/Rails Architecture | Stitch Fix Technology",
      url: "https://multithreaded.stitchfix.com/blog/2021/01/06/a-better-react-rails-architecture/?hn=2"
    },
    {
      title: "CSS-in-JS: styled-components",
      url: "https://www.joshwcomeau.com/css/styled-components/"
    },
    {
      title: "Deep dive into CORS",
      url: "https://ieftimov.com/post/deep-dive-cors-history-how-it-works-best-practices/"
    },
    {
      title: "Compound Components",
      url: "https://jesseduffield.com/Compound-Components/"
    },
    {
      title: "Estimation",
      url: "https://jacobian.org/2021/may/20/estimation/"
    },
    {
      title: "What I learned from Software Engineering at Google",
      url: "https://swizec.com/blog/what-i-learned-from-software-engineering-at-google/"
    },
    {
      title: "React Folder Structure",
      url: "https://www.robinwieruch.de/react-folder-structure/"
    },
    {
      title: "The Absolute Minimum Every Software Developer Must Know About Unicode",
      url: "https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/"
    },
    {
      title: "Islands Architecture",
      url: "https://www.patterns.dev/posts/islands-architecture/"
    },
    {
      title: "Complexity is killing software developers",
      url: "https://www.infoworld.com/article/3639050/complexity-is-killing-software-developers.html"
    },
    {
      title: "Simple Architectures",
      url: "https://danluu.com/simple-architectures/"
    },
    {
      title: "Avoiding if-else Hell: The Functional Style",
      url: "https://lackofimagination.org/2024/09/avoiding-if-else-hell-the-functional-style/"
    },
    {
      title: "Building and operating a pretty big storage system called S3",
      url: "https://www.allthingsdistributed.com/2023/07/building-and-operating-a-pretty-big-storage-system.html"
    },
    {
      title: "20 Things I've Learned in my 20 Years as a Software Engineer",
      url: "https://www.simplethread.com/20-things-ive-learned-in-my-20-years-as-a-software-engineer/"
    },
    {
      title: "Software vs. Systems",
      url: "https://codewithstyle.info/software-vs-systems/"
    },
    {
      title: "State of Frontend 2024",
      url: "https://tsh.io/state-of-frontend/#report"
    },
    {
      title: "Microservices for Startups",
      url: "https://nexo.sh/posts/microservices-for-startups/"
    },
    {
      title: "Patterns.dev",
      url: "https://www.patterns.dev/"
    },
    {
      title: "Elided Branches - A blog about functional programming",
      url: "https://www.elidedbranches.com/"
    }
  ],
  "Career & Professional Development": [
    {
      title: "Climbing the Wealth Ladder",
      url: "https://ofdollarsanddata.com/climbing-the-wealth-ladder/"
    },
    {
      title: "Salary Negotiation: Make More Money, Be More Valued",
      url: "https://www.kalzumeus.com/2012/01/23/salary-negotiation/"
    },
    {
      title: "Levels.fyi - Compare Career Levels",
      url: "https://www.levels.fyi/?compare=Google,Facebook,Microsoft&track=Software%20Engineering%20Manager"
    },
    {
      title: "How to Hit the Ground Running at a New Job in 3 Weeks",
      url: "https://www.scarletink.com/hit-ground-running-ramp-up-new-job-3-weeks/"
    },
    {
      title: "A Forty-Year Career",
      url: "https://lethain.com/forty-year-career/"
    },
    {
      title: "Work-Life Balance is a Myth",
      url: "https://blog.nateliason.com/p/work-life-balance"
    },
    {
      title: "AI is a floor raiser, not a ceiling raiser",
      url: "https://elroy.bot/blog/2025/07/29/ai-is-a-floor-raiser-not-a-ceiling-raiser.html"
    },
    {
      title: "Developers Reinvented",
      url: "https://ashtom.github.io/developers-reinvented"
    },
    {
      title: "Nobody Cares",
      url: "https://grantslatton.com/nobody-cares"
    },
    {
      title: "NYC's Thriving Digital Health Alumni Network",
      url: "https://www.indexventures.com/perspectives/inside-new-yorks-thriving-digital-health-alumni-network/"
    }
  ],
  "Product & Strategy": [
    {
      title: "Pioneers, Settlers and Town Planners",
      url: "https://www.siddharthsarda.com/p/pioneers-settlers-and-town-planners"
    },
    {
      title: "The Engineering-Product Relationship",
      url: "https://www.theengineeringmanager.com/growth/the-engineering-product-relationship/"
    },
    {
      title: "12 Signs You're Working in a Feature Factory",
      url: "https://cutle.fish/blog/12-signs-youre-working-in-a-feature-factory"
    },
    {
      title: "Product Manager + Engineering Manager: Rules of Engagement",
      url: "https://segment.com/blog/product-manager-engineering-manager-rules-of-engagement/"
    },
    {
      title: "Write tasks, not user stories",
      url: "https://linear.app/method/write-tasks-not-user-stories"
    },
    {
      title: "How to Write a Strategy Your Team Will Remember",
      url: "https://academy.nobl.io/how-to-write-a-strategy-your-team-will-remember/"
    },
    {
      title: "Project Management in Tech",
      url: "https://blog.pragmaticengineer.com/project-management-at-big-tech/"
    },
    {
      title: "From Gut to Plan: The Thoughtful Execution Framework",
      url: "https://spotify.design/article/from-gut-to-plan-the-thoughtful-execution-framework"
    },
    {
      title: "Why We Choose Profit",
      url: "https://37signals.com/why-we-choose-profit/"
    },
    {
      title: "Business Questions Worth Asking",
      url: "https://gmays.com/business-questions-worth-asking/"
    },
    {
      title: "Shape Up - Stop Running in Circles",
      url: "https://basecamp.com/shapeup"
    },
    {
      title: "The speedy downfall of rapid delivery",
      url: "https://www.wired.com/story/the-speedy-downfall-of-rapid-delivery/"
    }
  ],
  "Systems Thinking": [
    {
      title: "The Sunk Cost Fallacy Is Ruining Your Decisions | TIME",
      url: "https://time.com/5347133/sunk-cost-fallacy-decisions/"
    },
    {
      title: "Why Tacit Knowledge is More Important Than Deliberate Practice",
      url: "https://commoncog.com/blog/tacit-knowledge-is-a-real-thing/"
    },
    {
      title: "Identify Your Controls",
      url: "https://lethain.com/identify-your-controls/"
    },
    {
      title: "You Are Going on a Quest",
      url: "https://randsinrepose.com/archives/you-are-going-on-a-quest/"
    },
    {
      title: "A Lifetime of Systems Thinking",
      url: "https://thesystemsthinker.com/a-lifetime-of-systems-thinking/"
    },
    {
      title: "XY Problem",
      url: "https://xyproblem.info/"
    },
    {
      title: "Organizational Design as a Skill",
      url: "https://commoncog.com/blog/org-design-skill/"
    },
    {
      title: "Situational Leadership",
      url: "https://situational.com/"
    },
    {
      title: "The Four Leadership Styles of Situational Leadership",
      url: "https://situational.com/blog/the-four-leadership-styles-of-situational-leadership/"
    },
    {
      title: "The RACI Model",
      url: "https://racichart.org/the-raci-model/"
    },
    {
      title: "The Blue Tape List",
      url: "https://randsinrepose.com/archives/the-blue-tape-list/"
    },
    {
      title: "Second-Order Thinking: What Smart People Use to Outperform",
      url: "https://fs.blog/second-order-thinking/"
    },
    {
      title: "Situational Leadership | Asana",
      url: "https://asana.com/resources/situational-leadership"
    },
    {
      title: "Managing Yourself: Zoom In, Zoom Out",
      url: "https://hbr.org/2011/03/managing-yourself-zoom-in-zoom-out"
    },
    {
      title: "Pre-mortem | Team Playbook",
      url: "https://www.atlassian.com/team-playbook/plays/pre-mortem"
    }
  ],
  "Tools & Resources": [
    {
      title: "NextAuth.js - Authentication for Next.js",
      url: "https://next-auth.js.org/"
    },
    {
      title: "Web Conformance",
      url: "https://web.dev/conformance/"
    },
    {
      title: "Deep Linking",
      url: "https://www.adjust.com/blog/dive-into-deeplinking/"
    },
    {
      title: "OneStack",
      url: "https://onestack.dev/docs/introduction"
    },
    {
      title: "ZeroServer",
      url: "https://zeroserver.io/?#getting-started"
    },
    {
      title: "ZeroSync",
      url: "https://zerosync.dev/"
    },
    {
      title: "Replicache",
      url: "https://replicache.dev/"
    },
    {
      title: "Qodo - AI Code Testing",
      url: "https://www.qodo.ai/"
    },
    {
      title: "TheOrg - See how companies are organized",
      url: "https://theorg.com/"
    },
    {
      title: "KIS Tools",
      url: "https://kis.tools/"
    },
    {
      title: "Tuple - Screen sharing for developers",
      url: "https://tuple.app/"
    },
    {
      title: "iTerm Status Bar Guide",
      url: "https://wompa.land/articles/iterm-status-bar"
    },
    {
      title: "Hugging Face - Introduction to AI Agents",
      url: "https://huggingface.co/learn/agents-course/unit1/introduction"
    }
  ],
  "Writing & Communication": [
    {
      title: "Writing Practices and Culture",
      url: "https://works.hashicorp.com/articles/writing-practices-and-culture"
    },
    {
      title: "Software Lead Weekly Issue 456",
      url: "https://softwareleadweekly.com/issues/456"
    },
    {
      title: "Soft Skills Audio",
      url: "https://softskills.audio/"
    },
    {
      title: "What is documentation?",
      url: "https://documentation.divio.com/introduction/"
    },
    {
      title: "Radical Candor - How to Get Feedback",
      url: "https://www.radicalcandor.com/get-feedback/"
    },
    {
      title: "Leading Through Writing for Software Engineering",
      url: "https://leaddev.com/communication-relationships/leading-through-writing-software-engineering"
    },
    {
      title: "Hire remote employees that write well",
      url: "https://pulseasync.com/blog/hire-remote-employees-that-write-well/"
    },
    {
      title: "The perks of a high-documentation, low-meeting work culture",
      url: "https://www.tremendous.com/blog/the-perks-of-a-high-documentation-low-meeting-work-culture"
    },
    {
      title: "GitLab's Remote Work Playbook",
      url: "https://learn.gitlab.com/allremote/remote-playbook"
    },
    {
      title: "Async Remote Postmortems",
      url: "https://www.ashbyhq.com/blog/engineering/async-remote-postmortems"
    }
  ],
  "Random": [
    {
      title: "Easy No-Knead Focaccia Bread Recipe | Bon Appétit",
      url: "https://www.bonappetit.com/recipe/easy-no-knead-focaccia"
    },
    {
      title: "Naval's Almanack",
      url: "https://www.navalmanack.com/"
    },
    {
      title: "The Appalachian Mountains May Have Once Been as Tall as the Himalayas",
      url: "https://www.cntraveler.com/story/appalachian-mountains-may-have-once-been-as-tall-as-the-himalayas"
    },
    {
      title: "Potato Pancakes",
      url: "https://foreignfork.com/potato-pancakes/"
    },
    {
      title: "Cold Beet Soup - Holodnik",
      url: "https://www.olgasflavorfactory.com/recipes/soups/cold-beet-holodnik/"
    },
    {
      title: "Making Fish Hydrolysate",
      url: "https://www.ridgedalepermaculture.com/blog/making-fish-hydrolysate"
    },
    {
      title: "Fall Gardening Guide",
      url: "https://morningchores.com/fall-gardening/"
    },
    {
      title: "How To Do (And Use) Focaccia Right, With Bread-Making Master Nancy Silverton",
      url: "https://www.eater.com/22549119/focaccia-recipe-pizza-arugula-salad-talbott-and-arding"
    },
    {
      title: "Rewiring America",
      url: "https://www.rewiringamerica.org/about"
    },
    {
      title: "Nuclear Power | Open Source Foundation",
      url: "https://ossfoundation.us/projects/energy/nuclear"
    },
    {
      title: "Why Is Everything So Ugly?",
      url: "https://www.nplusonemag.com/issue-44/the-intellectual-situation/why-is-everything-so-ugly/"
    },
    {
      title: "The Libido for the Ugly by H.L. Mencken",
      url: "https://www.thoughtco.com/libido-for-the-ugly-by-mencken-1690254"
    },
    {
      title: "Workman Keyboard Layout",
      url: "https://workmanlayout.org/"
    },
    {
      title: "Metrics",
      url: "https://jakobgreenfeld.com/metrics"
    },
    {
      title: "Accessible Quality",
      url: "https://www.rainforestqa.com/blog/accessible-quality"
    },
    {
      title: "Five Categories of Engineering Metrics",
      url: "https://angelariggs.github.io/articles/five-categories-engineering-metrics"
    },
    {
      title: "Apple Watch Blood Pressure Study",
      url: "https://www.empirical.health/blog/apple-watch-blood-pressure/"
    },
    {
      title: "GLP-1 Impact on Healthcare Data",
      url: "https://www.biopharmadive.com/news/glp-1-obesity-healthcare-data-support-ozempic-wegovy/720954/"
    },
    {
      title: "Bring the Donuts",
      url: "https://www.bringthedonuts.com/blog/"
    },
    {
      title: "Singleton Blog",
      url: "https://blog.singleton.io/"
    }
  ]
};

const generateBookmarksHTML = () => {
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}" PERSONAL_TOOLBAR_FOLDER="true">Blake's Bookmarks</H3>
    <DL><p>`;

  Object.entries(bookmarkCategories).forEach(([category, links]) => {
    html += `
        <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">${category}</H3>
        <DL><p>`;
    
    links.forEach((bookmark) => {
      html += `
            <DT><A HREF="${bookmark.url}" ADD_DATE="${Math.floor(Date.now() / 1000)}">${bookmark.title}</A>`;
    });
    
    html += `
        </DL><p>`;
  });

  html += `
    </DL><p>
</DL><p>`;
  
  return html;
};

const downloadBookmarks = () => {
  const htmlContent = generateBookmarksHTML();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'blake-yoder-bookmarks.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function Bookmarks() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const categories = Object.keys(bookmarkCategories);
  
  const filteredCategories = selectedCategory
    ? { [selectedCategory]: bookmarkCategories[selectedCategory as keyof typeof bookmarkCategories] }
    : bookmarkCategories;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDownloadModal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Bookmarks</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          <Link href="/">← Back to home</Link>
        </p>
      </header>

      <main>
        <p style={{ marginBottom: '2rem' }}>
For nearly six years, I’ve kept a Firefox bookmark folder called “Reading List”—a running collection of interesting articles I’ve found online. Most I’ve read, some I still haven’t. A few years ago, a report who was leaving asked if they could take the list with them. (Some folks on the team knew I had a pretty extensive stash of saved resources.) I exported the folder and shared it with them.
<br/>
<br/>
I’m sharing it with you now in the same spirit. I hope you find something useful in here. It’s a little snapshot of me—spanning everything from scaling systems to no-knead focaccia bread recipes.
        </p>

        <div style={{ marginBottom: '3rem' }}>
          <div 
            role="group" 
            aria-label="Filter bookmarks by category"
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem',
              marginBottom: '0.5rem' 
            }}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              aria-pressed={selectedCategory === null}
              aria-label={`Show all categories (${Object.values(bookmarkCategories).flat().length} links)`}
              style={{
                padding: '0.5rem 1rem',
                border: selectedCategory === null ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                backgroundColor: selectedCategory === null ? 'var(--text-primary)' : 'transparent',
                color: selectedCategory === null ? 'var(--background)' : 'var(--text-secondary)',
                borderRadius: '4px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== null) {
                  (e.target as HTMLElement).style.borderColor = 'var(--text-secondary)';
                  (e.target as HTMLElement).style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== null) {
                  (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
                  (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                }
              }}
            >
              All ({Object.values(bookmarkCategories).flat().length})
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                aria-label={`Filter by ${category} (${bookmarkCategories[category as keyof typeof bookmarkCategories].length} links)`}
                style={{
                  padding: '0.5rem 1rem',
                  border: selectedCategory === category ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                  backgroundColor: selectedCategory === category ? 'var(--text-primary)' : 'transparent',
                  color: selectedCategory === category ? 'var(--background)' : 'var(--text-secondary)',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    (e.target as HTMLElement).style.borderColor = 'var(--text-secondary)';
                    (e.target as HTMLElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
                    (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {category} ({bookmarkCategories[category as keyof typeof bookmarkCategories].length})
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {Object.entries(filteredCategories).map(([category, links]) => (
            <div 
              key={category}
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            >
              <h2 style={{ 
                fontSize: '1.25rem', 
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
                fontWeight: 'normal'
              }}>
                {category}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {links.map((bookmark, index) => (
                  <div key={index} style={{ 
                    paddingBottom: '0.75rem', 
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        lineHeight: 1.4,
                        display: 'block',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--text-primary)'}
                    >
                      {bookmark.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {Object.values(bookmarkCategories).flat().length} links • Last updated: {new Date().toLocaleDateString()}
        </p>
      </main>

      {showDownloadModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={() => setShowDownloadModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              animation: 'slideIn 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDownloadModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'var(--border-color)';
                (e.target as HTMLElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
                (e.target as HTMLElement).style.color = 'var(--text-secondary)';
              }}
              aria-label="Close modal"
            >
              ×
            </button>

            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: '1rem', 
              color: 'var(--text-primary)',
              fontWeight: 'normal'
            }}>
              Download My Bookmarks
            </h3>

            <p style={{ 
              marginBottom: '1.5rem', 
              color: 'var(--text-secondary)', 
              lineHeight: 1.5 
            }}>
              Want to add these {Object.values(bookmarkCategories).flat().length} bookmarks to your own browser? Download them as an HTML file that you can import into any browser.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDownloadModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'var(--text-secondary)';
                  (e.target as HTMLElement).style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
                  (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                }}
              >
                No thanks
              </button>

              <button
                onClick={() => {
                  downloadBookmarks();
                  setShowDownloadModal(false);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--text-primary)',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--background)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.opacity = '1';
                }}
              >
                Download Bookmarks
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
