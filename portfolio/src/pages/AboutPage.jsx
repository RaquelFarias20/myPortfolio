import { motion } from "framer-motion";
import Header from "../components/layout/Header.jsx";
import BackButton from "../components/ui/BackButton.jsx";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="wrap">
        <article className="detail" aria-labelledby="about-title">
          <motion.div
            className="detail-header"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <h1 className="sr-only" id="about-title">
              About
            </h1>
            <BackButton to="/" label="Back to home" />
            <div className="detail-eyebrow">About</div>
          </motion.div>

          <motion.div
            className="panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          >
            <p className="panel-statement">
              A recent graduate of NYU&apos;s M.S. in Management and Data
              Analytics with a concentration in Business Analytics from New York
              University, passionate about blending product with data analytics
              to build solutions that drive meaningful business and digital
              transformation.
            </p>

            <p>
              My work sits at the intersection of product innovation, business,
              and data analytics. I approach problems by integrating business
              goals, technology, and data into a single picture&mdash;managing
              timelines, resources, communication, and workflows to help
              designers, researchers, and engineers launch digital products
              efficiently, while, through my analytical layer, turning raw
              information into decisions that serve both the organization and
              its users. I bring analytical rigor to complexity, pairing
              creative problem-solving with a disciplined, evidence-based
              process.
            </p>

            <p>
              I&apos;m especially focused on the emerging space of agentic AI,
              with hands-on experience designing and implementing agentic AI
              systems that streamline workflows and unlock new product
              capabilities.
            </p>

            <p>
              With a dual foundation in business and technology, I&apos;m
              comfortable communicating with both technical teams and business
              stakeholders, translating between the two without losing nuance on
              either side. I excel at transforming complex, ambiguous challenges
              into clear, actionable strategy.
            </p>

            <p>
              I&apos;m seeking opportunities to apply my skills in product
              growth strategy, data analytics, and AI implementation to drive
              innovation and deliver tangible results.
            </p>

            <h2 className="panel-h2">Highlights</h2>
            <ul className="about-highlights">
              <li>
                B.S. in Industrial Design from the Autonomous Metropolitan
                University (UAM)
              </li>
              <li>
                M.S. in Management &amp; Business Analytics from New York
                University
              </li>
              <li>PMP candidate </li>
              <li>UX DesignOps Certificate</li>
              <li>Google UX Design Certificate</li>
              <li>
                Drove program and delivery for AI platform initiatives at the
                United Nations International Computing Center (ICC), planning
                projects, defining milestones, and coordinating a
                multidisciplinary team to a first-place finish
              </li>
              <li>
                Strong in product analytics&mdash;defining KPIs, tracking
                product metrics, and turning data into decisions that inform
                roadmaps and measure quality
              </li>
              <li>
                Experienced in design systems: building, auditing, and codifying
                component libraries and patterns that scale across products
              </li>
              <li>
                Integrates AI and LLM tools (Claude, Cursor) into design
                workflows to automate project tracking and reporting and improve
                deliverables
              </li>
              <li>
                Background in user research, user-centered methodologies, and
                visual quality assurance across startups, consulting, and
                technology-driven environments
              </li>
              <li>
                Skilled at cross-functional coordination&mdash;harmonizing
                product, engineering, and business teams
              </li>
            </ul>
          </motion.div>
        </article>
      </main>
    </>
  );
}
