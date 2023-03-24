import {
  siAbletonlive,
  siAdobeaftereffects,
  siAdobeillustrator,
  siAdobephotoshop,
  siAdobepremierepro,
  siAmazonaws,
  siAnaconda,
  siAndroid,
  siAndroidstudio,
  siApple,
  siArduino,
  siBlender,
  siCsharp,
  siCplusplus,
  siCloudflare,
  siCss3,
  siDart,
  siDiscord,
  siDocker,
  siEpicgames,
  siFacebook,
  siFigma,
  siFirebase,
  siFlutter,
  siGit,
  siGithub,
  siGithubactions,
  siGooglecloud,
  siGoogleplay,
  siHtml5,
  siInstagram,
  siJavascript,
  siJupyter,
  siKotlin,
  siLinux,
  siMariadb,
  siMarkdown,
  siMidi,
  siMongodb,
  siMysql,
  siNintendoswitch,
  siNodedotjs,
  siNotion,
  siOculus,
  siOpenssl,
  siPostgresql,
  siPython,
  siRaspberrypi,
  siReact,
  siSequelize,
  siSketch,
  siSlack,
  siSocketdotio,
  siSqlite,
  siSteam,
  siSynology,
  siTypescript,
  siUbisoft,
  siUbuntu,
  siUnity,
  siVisualstudio,
  siVisualstudiocode,
  siWindows11,
  siXcode,
  siNestjs,
  siPrisma,
  siLinear,
} from 'simple-icons/icons';
import { Skill, SkillLevel, SkillType } from '../model/skill';

export const skills = {
  HTML: {
    name: 'HTML',
    icon: siHtml5,
    description: 'Markup language used for creating web pages and applications',
    level: SkillLevel.Expert,
    type: SkillType.Language,
  } as Skill,
  CSS: {
    name: 'CSS',
    icon: siCss3,
    description:
      'Style sheet language used for describing the presentation of a document written in HTML',
    level: SkillLevel.Expert,
    type: SkillType.Language,
  } as Skill,
  JavaScript: {
    name: 'JavaScript',
    icon: siJavascript,
    description:
      'High-level, interpreted programming language used for creating interactive web pages and applications',
    level: SkillLevel.Expert,
    type: SkillType.Language,
  } as Skill,
  TypeScript: {
    name: 'TypeScript',
    icon: siTypescript,
    description: 'Open-source language which is a superset of JavaScript',
    level: SkillLevel.Intermediate,
    type: SkillType.Language,
  } as Skill,
  Kotlin: {
    name: 'Kotlin',
    icon: siKotlin,
    description:
      'Cross-platform, statically typed programming language used for creating mobile and web applications',
    level: SkillLevel.Intermediate,
    type: SkillType.Language,
  } as Skill,
  Python: {
    name: 'Python',
    icon: siPython,
    description:
      'High-level, interpreted programming language used for web development, scientific computing, data analysis, artificial intelligence, and more',
    level: SkillLevel.Advanced,
    type: SkillType.Language,
  } as Skill,
  Dart: {
    name: 'Dart',
    icon: siDart,
    description:
      'Client-optimized language used for creating mobile, web, and desktop applications',
    level: SkillLevel.Intermediate,
    type: SkillType.Language,
  } as Skill,
  'C++': {
    name: 'C++',
    icon: siCplusplus,
    description:
      'General-purpose programming language with a bias toward systems programming that is widely used in application software, game development, drivers, and more',
    level: SkillLevel.Intermediate,
    type: SkillType.Language,
  } as Skill,
  'C#': {
    name: 'C#',
    icon: siCsharp,
    description:
      'Simple, modern, object-oriented, and type-safe programming language that is widely used for creating Windows desktop applications, video games, and more',
    level: SkillLevel.Intermediate,
    type: SkillType.Language,
  } as Skill,
  MIDI: {
    name: 'MIDI',
    icon: siMidi,
    description:
      'Protocol used for communicating musical information between digital devices',
    level: SkillLevel.Intermediate,
    type: SkillType.Protocol,
  } as Skill,
  'Socket.IO': {
    name: 'Socket.IO',
    icon: siSocketdotio,
    description:
      'Real-time event-based communication framework for web applications',
    level: SkillLevel.Intermediate,
    type: SkillType.Protocol,
  } as Skill,
  OpenSSL: {
    name: 'OpenSSL',
    icon: siOpenssl,
    description:
      'Robust, full-featured open source toolkit implementing the Secure Sockets Layer (SSL) and Transport Layer Security (TLS) protocols',
    level: SkillLevel.Beginner,
    type: SkillType.Protocol,
  } as Skill,
  Markdown: {
    name: 'Markdown',
    icon: siMarkdown,
    description:
      'Lightweight markup language used to format plain text into formatted documents',
    level: SkillLevel.Expert,
    type: SkillType.Language,
  } as Skill,
  Android: {
    name: 'Android',
    icon: siAndroid,
    description:
      'Mobile operating system based on the Linux kernel and developed by Google, used for creating mobile applications',
    level: SkillLevel.Intermediate,
    type: SkillType.Platform,
  } as Skill,
  'Node.js': {
    name: 'Node.js',
    icon: siNodedotjs,
    description:
      'Open-source, cross-platform, back-end JavaScript runtime environment that executes JavaScript code outside a web browser',
    level: SkillLevel.Expert,
    type: SkillType.Framework,
  } as Skill,
  React: {
    name: 'React',
    icon: siReact,
    description:
      'JavaScript library used for building user interfaces and UI components',
    level: SkillLevel.Expert,
    type: SkillType.Framework,
  } as Skill,
  Flutter: {
    name: 'Flutter',
    icon: siFlutter,
    description:
      'Open-source mobile application development framework created by Google for creating high-performance, high-fidelity, apps for iOS and Android, from a single codebase',
    level: SkillLevel.Intermediate,
    type: SkillType.Framework,
  } as Skill,
  Arduino: {
    name: 'Arduino',
    icon: siArduino,
    description:
      'Open-source electronics platform based on easy-to-use hardware and software, used for creating interactive electronic objects and environments',
    level: SkillLevel.Beginner,
    type: SkillType.Platform,
  } as Skill,
  'Raspberry Pi': {
    name: 'Raspberry Pi',
    icon: siRaspberrypi,
    description:
      'Low-cost, credit-card-sized computer that plugs into a computer monitor or TV, used for learning programming and creating DIY projects',
    level: SkillLevel.Intermediate,
    type: SkillType.Platform,
  } as Skill,
  Unity: {
    name: 'Unity',
    icon: siUnity,
    description:
      'Cross-platform game engine developed by Unity Technologies, used for creating video games, AR and VR experiences, and more',
    level: SkillLevel.Intermediate,
    type: SkillType.Framework,
  } as Skill,
  NestJS: {
    name: 'NestJS',
    icon: siNestjs,
    description:
      'A progressive Node.js framework for building efficient, scalable, and enterprise-grade server-side applications',
    level: SkillLevel.Intermediate,
    type: SkillType.Framework,
  } as Skill,
  MongoDB: {
    name: 'MongoDB',
    icon: siMongodb,
    description:
      'Cross-platform document-oriented database program, used for high volume data storage and retrieval',
    level: SkillLevel.Advanced,
    type: SkillType.Database,
  } as Skill,
  MySQL: {
    name: 'MySQL',
    icon: siMysql,
    description:
      'Open-source relational database management system, used for storing and managing data in various applications',
    level: SkillLevel.Expert,
    type: SkillType.Database,
  } as Skill,
  MariaDB: {
    name: 'MariaDB',
    icon: siMariadb,
    description:
      'Community-developed fork of MySQL, used for storing and managing data in various applications',
    level: SkillLevel.Intermediate,
    type: SkillType.Database,
  } as Skill,
  PostgreSQL: {
    name: 'PostgreSQL',
    icon: siPostgresql,
    description:
      'Powerful open-source object-relational database system, used for storing and managing data in various applications',
    level: SkillLevel.Advanced,
    type: SkillType.Database,
  } as Skill,
  SQLite: {
    name: 'SQLite',
    icon: siSqlite,
    description:
      'Lightweight, serverless, self-contained, high-reliability, SQL database engine, used for local data storage and management',
    level: SkillLevel.Intermediate,
    type: SkillType.Database,
  } as Skill,
  Sequelize: {
    name: 'Sequelize',
    icon: siSequelize,
    description:
      'Promise-based ORM for Node.js, used for mapping objects to relational database tables',
    level: SkillLevel.Intermediate,
    type: SkillType.Library,
  } as Skill,
  Prisma: {
    name: 'Prisma',
    icon: siPrisma,
    description:
      'Modern database toolkit and ORM for Node.js and TypeScript, used for accessing databases and managing data in a type-safe way',
    level: SkillLevel.Intermediate,
    type: SkillType.Library,
  } as Skill,
  GitHub: {
    name: 'GitHub',
    icon: siGithub,
    description:
      'Web-based hosting service for version control using Git, used for managing and collaborating on software development projects',
    level: SkillLevel.Expert,
    type: SkillType.CICD,
  } as Skill,
  Git: {
    name: 'Git',
    icon: siGit,
    description:
      'Distributed version control system for tracking changes in source code during software development',
    level: SkillLevel.Expert,
    type: SkillType.CICD,
  } as Skill,
  'GitHub Actions': {
    name: 'GitHub Actions',
    icon: siGithubactions,
    description:
      'Workflow automation tool provided by GitHub, used for building, testing, and deploying software projects',
    level: SkillLevel.Intermediate,
    type: SkillType.CICD,
  } as Skill,
  Docker: {
    name: 'Docker',
    icon: siDocker,
    description:
      'Open-source platform for building, shipping, and running distributed applications in containers',
    level: SkillLevel.Intermediate,
    type: SkillType.CICD,
  } as Skill,
  'Google Play': {
    name: 'Google Play',
    icon: siGoogleplay,
    description:
      'Official app store for Android operating system, used for distributing and downloading mobile apps',
    level: SkillLevel.Intermediate,
    type: SkillType.CICD,
  } as Skill,
  'Google Cloud': {
    name: 'Google Cloud',
    icon: siGooglecloud,
    description:
      'Cloud computing services provided by Google, used for hosting and managing applications and data',
    level: SkillLevel.Beginner,
    type: SkillType.Platform,
  } as Skill,
  Firebase: {
    name: 'Firebase',
    icon: siFirebase,
    description:
      'Mobile and web application development platform provided by Google, used for building high-quality apps, growing your user base, and earning more money',
    level: SkillLevel.Intermediate,
    type: SkillType.Platform,
  } as Skill,
  Cloudflare: {
    name: 'Cloudflare',
    icon: siCloudflare,
    description:
      'Internet security, performance, and reliability company that provides content delivery network services, DDoS mitigation, Internet security, and more',
    level: SkillLevel.Beginner,
    type: SkillType.CICD,
  } as Skill,
  'Amazon Web Services': {
    name: 'Amazon Web Services',
    icon: siAmazonaws,
    description:
      'Collection of cloud computing services provided by Amazon, used for hosting and managing applications and data',
    level: SkillLevel.Intermediate,
    type: SkillType.Platform,
  } as Skill,
  Apple: {
    name: 'Apple',
    icon: siApple,
    description:
      'Technology company that designs, develops, and sells consumer electronics, computer software, and online services',
    level: SkillLevel.Intermediate,
    type: SkillType.OperatingSystem,
  } as Skill,
  'Windows 11': {
    name: 'Windows 11',
    icon: siWindows11,
    description:
      'Latest version of the Windows operating system developed by Microsoft',
    level: SkillLevel.Intermediate,
    type: SkillType.OperatingSystem,
  } as Skill,
  Ubuntu: {
    name: 'Ubuntu',
    icon: siUbuntu,
    description:
      'Open-source operating system based on the Linux kernel, used for desktop and server computing',
    level: SkillLevel.Intermediate,
    type: SkillType.OperatingSystem,
  } as Skill,
  Linux: {
    name: 'Linux',
    icon: siLinux,
    description:
      'Family of open-source Unix-like operating systems based on the Linux kernel, used for desktop and server computing',
    level: SkillLevel.Intermediate,
    type: SkillType.OperatingSystem,
  } as Skill,
  Synology: {
    name: 'Synology',
    icon: siSynology,
    description:
      'Taiwanese company that develops and sells network-attached storage (NAS), routers, and surveillance products, used for data storage and management',
    level: SkillLevel.Intermediate,
    type: SkillType.Platform,
  } as Skill,
  'Visual Studio Code': {
    name: 'Visual Studio Code',
    icon: siVisualstudiocode,
    description:
      'Free and open-source source-code editor developed by Microsoft, used for editing and debugging code',
    level: SkillLevel.Expert,
    type: SkillType.IDE,
  } as Skill,
  'Android Studio': {
    name: 'Android Studio',
    icon: siAndroidstudio,
    description:
      'Official integrated development environment (IDE) for Android application development, based on IntelliJ IDEA',
    level: SkillLevel.Intermediate,
    type: SkillType.IDE,
  } as Skill,
  Xcode: {
    name: 'Xcode',
    icon: siXcode,
    description:
      'Integrated development environment (IDE) for macOS used for developing software for macOS, iOS, iPadOS, watchOS, and tvOS',
    level: SkillLevel.Intermediate,
    type: SkillType.IDE,
  } as Skill,
  'Visual Studio': {
    name: 'Visual Studio',
    icon: siVisualstudio,
    description:
      'Integrated development environment (IDE) developed by Microsoft, used for developing software for Windows, Android, iOS, web, and cloud',
    level: SkillLevel.Intermediate,
    type: SkillType.IDE,
  } as Skill,
  Anaconda: {
    name: 'Anaconda',
    icon: siAnaconda,
    description:
      'Free and open-source distribution of the Python and R programming languages for scientific computing, data science, and machine learning',
    level: SkillLevel.Intermediate,
    type: SkillType.IDE,
  } as Skill,
  Jupyter: {
    name: 'Jupyter',
    icon: siJupyter,
    description:
      'Open-source web application that allows you to create and share documents that contain live code, equations, visualizations, and narrative text',
    level: SkillLevel.Intermediate,
    type: SkillType.IDE,
  } as Skill,
  'Adobe Photoshop': {
    name: 'Adobe Photoshop',
    icon: siAdobephotoshop,
    description:
      'Raster graphics editor developed and published by Adobe, used for editing and manipulating digital images',
    level: SkillLevel.Intermediate,
    type: SkillType.Tool,
  } as Skill,
  'Adobe Illustrator': {
    name: 'Adobe Illustrator',
    icon: siAdobeillustrator,
    description:
      'Vector graphics editor developed and published by Adobe, used for creating illustrations, icons, logos, and more',
    level: SkillLevel.Intermediate,
    type: SkillType.Tool,
  } as Skill,
  'Adobe Premiere Pro': {
    name: 'Adobe Premiere Pro',
    icon: siAdobepremierepro,
    description:
      'Timeline-based video editing software developed and published by Adobe, used for editing and producing videos',
    level: SkillLevel.Intermediate,
    type: SkillType.Tool,
  } as Skill,
  'Adobe After Effects': {
    name: 'Adobe After Effects',
    icon: siAdobeaftereffects,
    description:
      'Digital visual effects, motion graphics, and compositing software developed and published by Adobe, used for creating visual effects and animations',
    level: SkillLevel.Intermediate,
    type: SkillType.Tool,
  } as Skill,
  Sketch: {
    name: 'Sketch',
    icon: siSketch,
    description:
      'Vector graphics editor developed and published by Sketch B.V., used for designing user interfaces, websites, and icons',
    level: SkillLevel.Intermediate,
    type: SkillType.Tool,
  } as Skill,
  Figma: {
    name: 'Figma',
    icon: siFigma,
    description:
      'Web-based vector graphics editor and prototyping tool developed and published by Figma, Inc., used for designing user interfaces and interactive prototypes',
    level: SkillLevel.Intermediate,
    type: SkillType.Tool,
  } as Skill,
  Blender: {
    name: 'Blender',
    icon: siBlender,
    description:
      'Free and open-source 3D creation software, used for creating 3D models, animations, and visual effects',
    level: SkillLevel.Beginner,
    type: SkillType.Tool,
  } as Skill,
  'Ableton Live': {
    name: 'Ableton Live',
    icon: siAbletonlive,
    description:
      'Digital audio workstation (DAW) developed and published by Ableton, used for creating, producing, and performing music',
    level: SkillLevel.Beginner,
    type: SkillType.Tool,
  } as Skill,
  Facebook: {
    name: 'Facebook',
    icon: siFacebook,
    description:
      'Social media and networking company that allows users to connect with friends and family, join groups, and share photos and videos',
    level: SkillLevel.Intermediate,
    type: SkillType.Social,
  } as Skill,
  Instagram: {
    name: 'Instagram',
    icon: siInstagram,
    description:
      'Social media and networking service that allows users to share photos and videos, and follow other users',
    level: SkillLevel.Intermediate,
    type: SkillType.Social,
  } as Skill,
  Discord: {
    name: 'Discord',
    icon: siDiscord,
    description:
      'Instant messaging and VoIP application designed for creating communities, used for text, image, video, and audio communication between users',
    level: SkillLevel.Beginner,
    type: SkillType.Social,
  } as Skill,
  Slack: {
    name: 'Slack',
    icon: siSlack,
    description:
      'Collaboration hub that brings teams together to get work done, used for real-time messaging, file sharing, and task management',
    level: SkillLevel.Beginner,
    type: SkillType.Tool,
  } as Skill,
  Notion: {
    name: 'Notion',
    icon: siNotion,
    description:
      'All-in-one workspace that allows users to write, plan, collaborate, and get organized, used for note-taking, project management, and knowledge sharing',
    level: SkillLevel.Intermediate,
    type: SkillType.Tool,
  } as Skill,
  Linear: {
    name: 'Linear',
    icon: siLinear,
    description:
      'Issue tracking and project management tool designed for software development teams, used for tracking bugs and feature requests',
    level: SkillLevel.Beginner,
    type: SkillType.Tool,
  } as Skill,
  Steam: {
    name: 'Steam',
    icon: siSteam,
    description:
      'Digital distribution platform developed and published by Valve Corporation, used for distributing and playing video games',
    level: SkillLevel.Intermediate,
    type: SkillType.Gaming,
  } as Skill,
  'Epic Games': {
    name: 'Epic Games',
    icon: siEpicgames,
    description:
      'American video game and software development company that develops and publishes Fortnite, used for creating and publishing video games',
    level: SkillLevel.Beginner,
    type: SkillType.Gaming,
  } as Skill,
  Ubisoft: {
    name: 'Ubisoft',
    icon: siUbisoft,
    description:
      'French video game company that develops and publishes popular video game franchises, used for creating and publishing video games',
    level: SkillLevel.Beginner,
    type: SkillType.Gaming,
  } as Skill,
  Oculus: {
    name: 'Oculus',
    icon: siOculus,
    description:
      'Virtual reality technology company that develops and publishes the Oculus Rift and Oculus Quest, used for developing and playing virtual reality games and experiences',
    level: SkillLevel.Beginner,
    type: SkillType.Gaming,
  } as Skill,
  'Nintendo Switch': {
    name: 'Nintendo Switch',
    icon: siNintendoswitch,
    description:
      'Hybrid video game console developed and published by Nintendo, used for playing video games at home and on the go',
    level: SkillLevel.Beginner,
    type: SkillType.Gaming,
  } as Skill,
};
