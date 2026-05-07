---
title: "Advice I Wish I Could Give My Younger Self as a Junior Developer"
category: ["Workplace"]
created: 2021-02-07T11:18:53.000Z
updated: 2021-02-07T18:28:10.632Z
deck: "While the profession of a developer may appear glamorous, beneath the surface lies a realm of ceaseless learning and enduring perseverance. Reflecting on three and a half years of practical experience, I offer principles of attitude and growth that I wish to impart to junior developers—those, like my past self, who are brimming with passion yet grappling with the uncertainties of their path."
abstract: "This article offers guidance on cultivating an 'enjoyment of learning'—an indispensable trait for developers to avoid stagnation—and honing 'code analysis and communication skills,' which are paramount for effective collaboration. Furthermore, it shares practical directives for aspiring senior developers, including the importance of strategic focus on core technologies, the necessity of code reviews, and the imperative of substantiating one's own code with clear rationale."
keywords: "junior developer advice, career growth, developer skills, collaboration, code review, self-improvement"
description: "Drawing from the trials and errors of my early career, this article elucidates the essential learning attitudes, technical focus, and communication strategies necessary for becoming a highly competent developer and fostering collaborative growth with colleagues."
---

# My Inadequate Days as a Junior Developer

It has been three and a half years since I embarked on my journey as a developer. Though I once harbored dreams of becoming a physicist, my path diverged, first piqued by the C language I learned in middle school to create games, and later by an interest in VPNs and networking through Hamachi in high school. After completing my bachelor's and master's degrees, I joined Coupang, driven by an ambition to ride the wave of technological advancement.

**In my junior days, I was undeniably naive.** My penchant for standing out manifested in a rather unrestrained demeanor, both in dress and conduct. **I was brimming with passion, yet lacked genuine proficiency in development; my efforts were scattered across numerous endeavors, which ultimately yielded few lasting gains, either for the team or for my personal growth.** While I sometimes lament not having concentrated more on Spring, Java, and React from a development perspective, I harbor no significant regrets. My diverse experiences, spanning from business to full-stack development within a large company, imparted invaluable lessons. Nevertheless, there are **several pieces of advice I would offer if I could return to my own junior developer days.**

# Requests for Advice from Others

During my days off, I used to conduct Spring and machine learning study sessions with students interested in development, offering them various pieces of advice. Recently, one of them inquired about guidance I could offer to junior developers in their circle. What began as a brief response evolved into this blog post—a retrospective on my own inadequate junior days, and a resource I can recommend to other study groups. Given the wide array of technology stacks among junior developers, I have intentionally excluded technical specifics, believing it best for individuals to tailor their learning to their respective fields.

## Developers, Think Again

![Please Don't be a Programmer](../../ko/things-that-i-should-have-known-when-i-was-a-junior-developer/dont-be-a-programmer.png)

Recent shifts in industrial structure have triggered an explosion in demand for development roles. In the current job market, becoming a developer has become an attractive alternative for many job seekers, leading to a noticeable trend of professionals transitioning into development or students changing their majors. It's true that highly competent developers often earn substantial incomes, enjoy favorable corporate treatment, and operate within a progressive, creative field that intrinsically discourages archaic or rigid hierarchies (often referred to as 'kkondae'). **However, all these advantages are privileges afforded only to those who are truly competent developers. As with any demanding profession, the journey is punctuated by countless hours of relentless effort and perseverance.**

---

### Replaceable Workforce

**Paradoxically, if a developer is not competent, they are remarkably easy to replace.** I've often heard stories from senior developers around me, many of whom endured rigorous development experiences in SI (System Integration) firms. They highlight that the distribution of developer skill often follows a "winner-take-all" dynamic: only a small percentage of highly capable developers can proactively lead projects, while others are relegated to passively completing assigned tasks. **This crucial distinction between proactivity and passivity, I believe, profoundly shapes the companies one works for, the salary one commands, and the caliber of colleagues one collaborates with.** All the senior mentors I deeply respect ascended through ceaseless study and effort within SI environments. This fundamentally suggests that one's **attitude is far more critical than the specific company or team one belongs to.**

---

### Characteristics of a Competent Developer

The highly skewed distribution between competent and less competent developers reflects just how challenging it is to achieve proficiency. Competition is relative, and with many developers striving for excellence, even a slight deficiency can lead to long-term stagnation. So, what traits define a successful developer?

-   **One must genuinely enjoy coding and studying outside of work hours.**

After completing work and returning home, even during personal leisure, **one should be inclined to revisit and analyze the various issues encountered at work or the code reviews exchanged, delving into their underlying reasons and causes.** For instance, if you experienced a Docker-based deployment process for the first time today, you might spend time studying aspects of Docker that piqued your curiosity. Having personal projects is highly beneficial. Alternatively, exploring and improving open-source projects, meticulously dissecting well-structured open-source code, or performing line-by-line debugging can significantly enhance one's coding prowess.

-   **One must be committed to lifelong learning.**

While enjoyment is essential, a developer's career, until retirement, **demands continuous study.** Consider Spring: it transitioned from `.xml`-based Bean injection to `@Annotation`-based processing. React.js, too, evolved from class-based components to functional Hooks. JVM and ES standards are in a constant state of flux, with new concepts unveiled at virtually every development conference. Technology drives the rapid pace of the world, and developers are often at the forefront of this acceleration. To avoid falling behind in this swift current, **one must cultivate the ability to assimilate each new concept upon a robust foundation of prior development knowledge, thereby preparing for what lies ahead.**

Development, at its essence, involves a user's single click on a web/app traversing a complete cycle of technological stacks—from **Front-end UI → Network → Security → Back-end Server → Server Infrastructure → DB**—to deliver the desired outcome. Each of these domains is profoundly deep, to the extent that one could compare practitioners to medical specialists. Regardless of one's chosen specialization, a suitable depth of understanding across the entire cycle is indispensable to:

-   Develop or advise on highly reliable solutions by simultaneously considering diverse scenarios.
-   Swiftly identify and address the root cause of issues when they arise.

---

### Developers Are, In Essence, Analysts.

The common image associated with aspiring developers is that of someone tirelessly typing code to generate new creations. In reality, roughly half of development involves creating new code, while diligently considering security, performance, stability, and scalability. **Even this creation often involves referencing and adapting substantial portions of existing code—whether one's own, others', or snippets from Stack Overflow. The other half is dedicated to testing and debugging.**

In a professional setting, a single individual rarely assumes all roles and responsibilities for an entire project. Even if they did, that code would eventually be inherited by a new generation of developers. Development is fundamentally a collaborative endeavor involving multiple developers. **Thus, it is a recurring process of weaving one's modest contributions into the intricate tapestry of collective code. It is, in effect, non-face-to-face, asynchronous collaboration. Consequently, even when developing a single feature, a thorough understanding of code written by other developers is paramount to prevent unintended errors.** During testing, situations inevitably arise where the intended outcome is not achieved; in such cases, one must be capable of debugging not only their own code but also that of their colleagues. Understanding the intent behind each line and comprehending the flow of the code is often more critical than direct coding ability—much like an acupuncturist whose skill with needles is moot without the insight to accurately diagnose the pulse.

Code maintainability was once a colossal concern, prompting the emergence of concepts like Spring's IoC (Inversion of Control) and separation of concerns to address it. While crafting code that is self-explanatory even without documentation is ideal, documentation and comments remain equally vital for developer collaboration. **Never forget that development is inherently a collaborative undertaking.**

---

## Becoming a Good Senior Developer

Having explored some facets of a developer's capabilities that might differ from common perceptions, if your passion for development remains strong, let me now discuss how you can evolve from a junior developer into a senior colleague whom others genuinely wish to work with in a few years. In brief, **you must be able to articulate the rationale and justification for your code clearly to anyone, and possess a profound understanding of your core language or framework.**

---

### Always Document and Review Issues and Code Reviews

It is crucial to meticulously document and review the "why" behind issues encountered during development and in code reviews. As previously mentioned, development is a profession demanding lifelong learning, with a vast amount of information to master. Without consistent documentation and review, one is prone to repeating the same mistakes. **Teaching others, perhaps through study groups, is an excellent method for cementing knowledge.**

---

### Explaining Code Rationale

You must be capable of clearly explaining to anyone *why* you performed a certain task in a particular way. This is a significant aspect that interviewers carefully assess when hiring junior or experienced developers. Responses like "Someone told me to do it this way" or "Stack Overflow suggested this" are, naturally, unconvincing. **Code should rarely be implemented without a clear rationale, simply because 'it works.'** While time constraints may prevent us from knowing every single reason behind every line, you should at least be able to articulate your justifications within your core domain.

---

### Choose and Focus on Language/Framework

As a junior, it's advantageous to focus on a smaller number of core languages, frameworks, and databases, and understand them deeply. It's perfectly understandable, even commendable, to feel overwhelmed and eager to try everything when first joining a (good) company that uses cutting-edge technologies and boasts diverse team-specific stacks—like a buffet tempting you with myriad choices. However, **as a junior, you need at least one core technology to truly grasp the distinctions and characteristics of other technologies.** Not only does this aid in understanding other tech, but over a long career of 3-5 years, this core technology will solidify into your strength, enabling you to guide future colleagues.

**While the desire to master everything is admirable, the sheer volume of information demands the wisdom of selective focus, mastering at least one area with profound depth.** True full-stack proficiency emerges when a solid, vertical 'I' of deep specialized understanding is established, upon which a horizontal '—' can then be drawn, forming a 'T-shaped' individual. If you can properly erect that vertical 'I', the horizontal '—' can subsequently extend much wider and deeper. Let go of immediate ambitions and concentrate on your core domain.

**When choosing a language/framework, opt for those widely preferred and commonly used in the field you aspire to enter.** For web service development, a thorough understanding of Java, Spring, and MySQL (for SQL) will be immensely helpful in comprehending NoSQL concepts and MVCC. For game development, you might learn C# for Unity, or for machine learning, Python for TensorFlow.

---

### Study Whenever You Have Free Time

Junior developers in a new company typically learn three main things: internal/external team structure, business logic, and the technical stack. If you join a company with an extensive business like Coupang, understanding the business alone might consume your first year. Nevertheless, **if you consistently and persistently study your core language and framework in your spare moments, you'll be better equipped to seize opportune moments and achieve significant results.**

Some might suggest that dedicating oneself entirely to study for 2-3 years, as if one ceased to exist to the outside world, can accelerate one's path to becoming a senior developer. However, humanly speaking, I find it difficult to recommend such an extreme approach. It is, perhaps, this intense devotion—akin to an 'otaku's' obsession or an ardent passion for coding and learning—that nurtures truly prodigious developers. Ultimately, it is the total cumulative effort of study that determines one's trajectory.

---

### Code Review is Essential

I highly recommend seeking companies where code review is a deeply entrenched practice. **It is particularly beneficial to work in an environment where at least one mentor consistently provides code reviews. A well-established mentor-mentee culture is truly exceptional.** A single line of code can encapsulate numerous underlying reasons for its design. Junior developers might spend months trying to decipher these reasons independently, but with a competent mentor, these insights can be acquired in a week (provided, of course, that these valuable lessons are diligently noted). **If such a culture is absent, it is advisable to form groups with peers or through study sessions to share and review each other's code and knowledge. This is because, in reality, responding to business demands often makes it challenging to consistently prioritize code reviews.** Company colleagues offer the advantage of reviewing internal, proprietary code, while study groups provide a forum for discussing designated languages/frameworks from diverse perspectives. For similar reasons, expanding external activities such as developer meetups is also highly recommended by senior professionals.

---

### Communication Skills

Ironically, I initially chose development because of its non-face-to-face nature, thinking it would minimize social interaction. However, **contrary to the stereotypical image of a socially reclusive 'loner' developer, the profession is fundamentally about interacting with people.** While the media often portrays unsocial "nerds" whose technical abilities are exceptionally brilliant, companies are fundamentally collaborative environments with team-based goals. Without strong collaboration and communication skills, even such brilliant individuals may become an unusable resource. As a junior developer, you will primarily interact with two types of people: those in business roles and those in design roles. With them, you will frequently discuss (1) requirements and (2) development limitations. Furthermore, communication is indispensable for interacting with fellow developers, both for (1) code reviews and explaining your rationale, and for (2) exchanging information. You must always be prepared to actively listen to and respect others' opinions, while also being able to articulate your own justifications coherently.

---

Initially, I had intended to discuss the technical aspects necessary for a full-stack developer, encompassing front-end, back-end, security, networking, and infrastructure. However, the sheer volume of information proved too vast for this single post; I believe it would be best conveyed through future blog articles or offline study sessions.

Even after three and a half years, I still constantly feel a sense of inadequacy and continue to study, which sometimes makes me question my suitability for writing such advice. Nevertheless, I hope that these reflections on my shortcomings as a junior developer will prove beneficial to those just entering the profession or preparing for a development career. Thank you for reading this article to the end, despite its potential imperfections, written in a short span of time. :) I wish all developers the very best and hope our paths cross in good positions someday!