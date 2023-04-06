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
import { Tech, TechLevel, TechType } from '../models/Tech';

export const techs = {
  HTML: new Tech({
    name: 'HTML',
    icon: siHtml5,
    description: 'Markup language used for creating web pages and applications',
    level: TechLevel.Expert,
    type: TechType.Language,
  }),
  CSS: new Tech({
    name: 'CSS',
    icon: siCss3,
    description:
      'Style sheet language used for describing the presentation of a document written in HTML',
    level: TechLevel.Expert,
    type: TechType.Language,
  }),
  JavaScript: new Tech({
    name: 'JavaScript',
    icon: siJavascript,
    description:
      'High-level, interpreted programming language used for creating interactive web pages and applications',
    level: TechLevel.Expert,
    type: TechType.Language,
  }),
  TypeScript: new Tech({
    name: 'TypeScript',
    icon: siTypescript,
    description: 'Open-source language which is a superset of JavaScript',
    level: TechLevel.Intermediate,
    type: TechType.Language,
  }),
  Kotlin: new Tech({
    name: 'Kotlin',
    icon: siKotlin,
    description:
      'Cross-platform, statically typed programming language used for creating mobile and web applications',
    level: TechLevel.Intermediate,
    type: TechType.Language,
  }),
  Python: new Tech({
    name: 'Python',
    icon: siPython,
    description:
      'High-level, interpreted programming language used for web development, scientific computing, data analysis, artificial intelligence, and more',
    level: TechLevel.Advanced,
    type: TechType.Language,
  }),
  Dart: new Tech({
    name: 'Dart',
    icon: siDart,
    description:
      'Client-optimized language used for creating mobile, web, and desktop applications',
    level: TechLevel.Intermediate,
    type: TechType.Language,
  }),
  'C++': new Tech({
    name: 'C++',
    icon: siCplusplus,
    description:
      'General-purpose programming language with a bias toward systems programming that is widely used in application software, game development, drivers, and more',
    level: TechLevel.Intermediate,
    type: TechType.Language,
  }),
  'C#': new Tech({
    name: 'C#',
    icon: siCsharp,
    description:
      'Simple, modern, object-oriented, and type-safe programming language that is widely used for creating Windows desktop applications, video games, and more',
    level: TechLevel.Intermediate,
    type: TechType.Language,
  }),
  MIDI: new Tech({
    name: 'MIDI',
    icon: siMidi,
    description:
      'Protocol used for communicating musical information between digital devices',
    level: TechLevel.Intermediate,
    type: TechType.Protocol,
  }),
  'Socket.IO': new Tech({
    name: 'Socket.IO',
    icon: siSocketdotio,
    description:
      'Real-time event-based communication framework for web applications',
    level: TechLevel.Intermediate,
    type: TechType.Protocol,
  }),
  OpenSSL: new Tech({
    name: 'OpenSSL',
    icon: siOpenssl,
    description:
      'Robust, full-featured open source toolkit implementing the Secure Sockets Layer (SSL) and Transport Layer Security (TLS) protocols',
    level: TechLevel.Beginner,
    type: TechType.Protocol,
  }),
  Markdown: new Tech({
    name: 'Markdown',
    icon: siMarkdown,
    description:
      'Lightweight markup language used to format plain text into formatted documents',
    level: TechLevel.Expert,
    type: TechType.Language,
  }),
  Android: new Tech({
    name: 'Android',
    icon: siAndroid,
    description:
      'Mobile operating system based on the Linux kernel and developed by Google, used for creating mobile applications',
    level: TechLevel.Intermediate,
    type: TechType.Platform,
  }),
  'Node.js': new Tech({
    name: 'Node.js',
    icon: siNodedotjs,
    description:
      'Open-source, cross-platform, back-end JavaScript runtime environment that executes JavaScript code outside a web browser',
    level: TechLevel.Expert,
    type: TechType.Framework,
  }),
  React: new Tech({
    name: 'React',
    icon: siReact,
    description:
      'JavaScript library used for building user interfaces and UI components',
    level: TechLevel.Expert,
    type: TechType.Framework,
  }),
  Flutter: new Tech({
    name: 'Flutter',
    icon: siFlutter,
    description:
      'Open-source mobile application development framework created by Google for creating high-performance, high-fidelity, apps for iOS and Android, from a single codebase',
    level: TechLevel.Intermediate,
    type: TechType.Framework,
  }),
  Arduino: new Tech({
    name: 'Arduino',
    icon: siArduino,
    description:
      'Open-source electronics platform based on easy-to-use hardware and software, used for creating interactive electronic objects and environments',
    level: TechLevel.Beginner,
    type: TechType.Platform,
  }),
  'Raspberry Pi': new Tech({
    name: 'Raspberry Pi',
    icon: siRaspberrypi,
    description:
      'Low-cost, credit-card-sized computer that plugs into a computer monitor or TV, used for learning programming and creating DIY projects',
    level: TechLevel.Intermediate,
    type: TechType.Platform,
  }),
  Unity: new Tech({
    name: 'Unity',
    icon: siUnity,
    description:
      'Cross-platform game engine developed by Unity Technologies, used for creating video games, AR and VR experiences, and more',
    level: TechLevel.Intermediate,
    type: TechType.Framework,
  }),
  NestJS: new Tech({
    name: 'NestJS',
    icon: siNestjs,
    description:
      'A progressive Node.js framework for building efficient, scalable, and enterprise-grade server-side applications',
    level: TechLevel.Intermediate,
    type: TechType.Framework,
  }),
  MongoDB: new Tech({
    name: 'MongoDB',
    icon: siMongodb,
    description:
      'Cross-platform document-oriented database program, used for high volume data storage and retrieval',
    level: TechLevel.Advanced,
    type: TechType.Database,
  }),
  MySQL: new Tech({
    name: 'MySQL',
    icon: siMysql,
    description:
      'Open-source relational database management system, used for storing and managing data in various applications',
    level: TechLevel.Expert,
    type: TechType.Database,
  }),
  MariaDB: new Tech({
    name: 'MariaDB',
    icon: siMariadb,
    description:
      'Community-developed fork of MySQL, used for storing and managing data in various applications',
    level: TechLevel.Intermediate,
    type: TechType.Database,
  }),
  PostgreSQL: new Tech({
    name: 'PostgreSQL',
    icon: siPostgresql,
    description:
      'Powerful open-source object-relational database system, used for storing and managing data in various applications',
    level: TechLevel.Advanced,
    type: TechType.Database,
  }),
  SQLite: new Tech({
    name: 'SQLite',
    icon: siSqlite,
    description:
      'Lightweight, serverless, self-contained, high-reliability, SQL database engine, used for local data storage and management',
    level: TechLevel.Intermediate,
    type: TechType.Database,
  }),
  Sequelize: new Tech({
    name: 'Sequelize',
    icon: siSequelize,
    description:
      'Promise-based ORM for Node.js, used for mapping objects to relational database tables',
    level: TechLevel.Intermediate,
    type: TechType.Library,
  }),
  Prisma: new Tech({
    name: 'Prisma',
    icon: siPrisma,
    description:
      'Modern database toolkit and ORM for Node.js and TypeScript, used for accessing databases and managing data in a type-safe way',
    level: TechLevel.Intermediate,
    type: TechType.Library,
  }),
  GitHub: new Tech({
    name: 'GitHub',
    icon: siGithub,
    description:
      'Web-based hosting service for version control using Git, used for managing and collaborating on software development projects',
    level: TechLevel.Expert,
    type: TechType.CICD,
  }),
  Git: new Tech({
    name: 'Git',
    icon: siGit,
    description:
      'Distributed version control system for tracking changes in source code during software development',
    level: TechLevel.Expert,
    type: TechType.CICD,
  }),
  'GitHub Actions': new Tech({
    name: 'GitHub Actions',
    icon: siGithubactions,
    description:
      'Workflow automation tool provided by GitHub, used for building, testing, and deploying software projects',
    level: TechLevel.Intermediate,
    type: TechType.CICD,
  }),
  Docker: new Tech({
    name: 'Docker',
    icon: siDocker,
    description:
      'Open-source platform for building, shipping, and running distributed applications in containers',
    level: TechLevel.Intermediate,
    type: TechType.CICD,
  }),
  'Google Play': new Tech({
    name: 'Google Play',
    icon: siGoogleplay,
    description:
      'Official app store for Android operating system, used for distributing and downloading mobile apps',
    level: TechLevel.Intermediate,
    type: TechType.CICD,
  }),
  'Google Cloud': new Tech({
    name: 'Google Cloud',
    icon: siGooglecloud,
    description:
      'Cloud computing services provided by Google, used for hosting and managing applications and data',
    level: TechLevel.Beginner,
    type: TechType.Platform,
  }),
  Firebase: new Tech({
    name: 'Firebase',
    icon: siFirebase,
    description:
      'Mobile and web application development platform provided by Google, used for building high-quality apps, growing your user base, and earning more money',
    level: TechLevel.Intermediate,
    type: TechType.Platform,
  }),
  Cloudflare: new Tech({
    name: 'Cloudflare',
    icon: siCloudflare,
    description:
      'Internet security, performance, and reliability company that provides content delivery network services, DDoS mitigation, Internet security, and more',
    level: TechLevel.Beginner,
    type: TechType.CICD,
  }),
  'Amazon Web Services': new Tech({
    name: 'Amazon Web Services',
    icon: siAmazonaws,
    description:
      'Collection of cloud computing services provided by Amazon, used for hosting and managing applications and data',
    level: TechLevel.Intermediate,
    type: TechType.Platform,
  }),
  Apple: new Tech({
    name: 'Apple',
    icon: siApple,
    description:
      'Technology company that designs, develops, and sells consumer electronics, computer software, and online services',
    level: TechLevel.Intermediate,
    type: TechType.OperatingSystem,
  }),
  'Windows 11': new Tech({
    name: 'Windows 11',
    icon: siWindows11,
    description:
      'Latest version of the Windows operating system developed by Microsoft',
    level: TechLevel.Intermediate,
    type: TechType.OperatingSystem,
  }),
  Ubuntu: new Tech({
    name: 'Ubuntu',
    icon: siUbuntu,
    description:
      'Open-source operating system based on the Linux kernel, used for desktop and server computing',
    level: TechLevel.Intermediate,
    type: TechType.OperatingSystem,
  }),
  Linux: new Tech({
    name: 'Linux',
    icon: siLinux,
    description:
      'Family of open-source Unix-like operating systems based on the Linux kernel, used for desktop and server computing',
    level: TechLevel.Intermediate,
    type: TechType.OperatingSystem,
  }),
  Synology: new Tech({
    name: 'Synology',
    icon: siSynology,
    description:
      'Taiwanese company that develops and sells network-attached storage (NAS), routers, and surveillance products, used for data storage and management',
    level: TechLevel.Intermediate,
    type: TechType.Platform,
  }),
  'Visual Studio Code': new Tech({
    name: 'Visual Studio Code',
    icon: siVisualstudiocode,
    description:
      'Free and open-source source-code editor developed by Microsoft, used for editing and debugging code',
    level: TechLevel.Expert,
    type: TechType.IDE,
  }),
  'Android Studio': new Tech({
    name: 'Android Studio',
    icon: siAndroidstudio,
    description:
      'Official integrated development environment (IDE) for Android application development, based on IntelliJ IDEA',
    level: TechLevel.Intermediate,
    type: TechType.IDE,
  }),
  Xcode: new Tech({
    name: 'Xcode',
    icon: siXcode,
    description:
      'Integrated development environment (IDE) for macOS used for developing software for macOS, iOS, iPadOS, watchOS, and tvOS',
    level: TechLevel.Intermediate,
    type: TechType.IDE,
  }),
  'Visual Studio': new Tech({
    name: 'Visual Studio',
    icon: siVisualstudio,
    description:
      'Integrated development environment (IDE) developed by Microsoft, used for developing software for Windows, Android, iOS, web, and cloud',
    level: TechLevel.Intermediate,
    type: TechType.IDE,
  }),
  Anaconda: new Tech({
    name: 'Anaconda',
    icon: siAnaconda,
    description:
      'Free and open-source distribution of the Python and R programming languages for scientific computing, data science, and machine learning',
    level: TechLevel.Intermediate,
    type: TechType.IDE,
  }),
  Jupyter: new Tech({
    name: 'Jupyter',
    icon: siJupyter,
    description:
      'Open-source web application that allows you to create and share documents that contain live code, equations, visualizations, and narrative text',
    level: TechLevel.Intermediate,
    type: TechType.IDE,
  }),
  'Adobe Photoshop': new Tech({
    name: 'Adobe Photoshop',
    icon: siAdobephotoshop,
    description:
      'Raster graphics editor developed and published by Adobe, used for editing and manipulating digital images',
    level: TechLevel.Intermediate,
    type: TechType.Tool,
  }),
  'Adobe Illustrator': new Tech({
    name: 'Adobe Illustrator',
    icon: siAdobeillustrator,
    description:
      'Vector graphics editor developed and published by Adobe, used for creating illustrations, icons, logos, and more',
    level: TechLevel.Intermediate,
    type: TechType.Tool,
  }),
  'Adobe Premiere Pro': new Tech({
    name: 'Adobe Premiere Pro',
    icon: siAdobepremierepro,
    description:
      'Timeline-based video editing software developed and published by Adobe, used for editing and producing videos',
    level: TechLevel.Intermediate,
    type: TechType.Tool,
  }),
  'Adobe After Effects': new Tech({
    name: 'Adobe After Effects',
    icon: siAdobeaftereffects,
    description:
      'Digital visual effects, motion graphics, and compositing software developed and published by Adobe, used for creating visual effects and animations',
    level: TechLevel.Intermediate,
    type: TechType.Tool,
  }),
  Sketch: new Tech({
    name: 'Sketch',
    icon: siSketch,
    description:
      'Vector graphics editor developed and published by Sketch B.V., used for designing user interfaces, websites, and icons',
    level: TechLevel.Intermediate,
    type: TechType.Tool,
  }),
  Figma: new Tech({
    name: 'Figma',
    icon: siFigma,
    description:
      'Web-based vector graphics editor and prototyping tool developed and published by Figma, Inc., used for designing user interfaces and interactive prototypes',
    level: TechLevel.Intermediate,
    type: TechType.Tool,
  }),
  Blender: new Tech({
    name: 'Blender',
    icon: siBlender,
    description:
      'Free and open-source 3D creation software, used for creating 3D models, animations, and visual effects',
    level: TechLevel.Beginner,
    type: TechType.Tool,
  }),
  'Ableton Live': new Tech({
    name: 'Ableton Live',
    icon: siAbletonlive,
    description:
      'Digital audio workstation (DAW) developed and published by Ableton, used for creating, producing, and performing music',
    level: TechLevel.Beginner,
    type: TechType.Tool,
  }),
  Facebook: new Tech({
    name: 'Facebook',
    icon: siFacebook,
    description:
      'Social media and networking company that allows users to connect with friends and family, join groups, and share photos and videos',
    level: TechLevel.Intermediate,
    type: TechType.Social,
  }),
  Instagram: new Tech({
    name: 'Instagram',
    icon: siInstagram,
    description:
      'Social media and networking service that allows users to share photos and videos, and follow other users',
    level: TechLevel.Intermediate,
    type: TechType.Social,
  }),
  Discord: new Tech({
    name: 'Discord',
    icon: siDiscord,
    description:
      'Instant messaging and VoIP application designed for creating communities, used for text, image, video, and audio communication between users',
    level: TechLevel.Beginner,
    type: TechType.Social,
  }),
  Slack: new Tech({
    name: 'Slack',
    icon: siSlack,
    description:
      'Collaboration hub that brings teams together to get work done, used for real-time messaging, file sharing, and task management',
    level: TechLevel.Beginner,
    type: TechType.Tool,
  }),
  Notion: new Tech({
    name: 'Notion',
    icon: siNotion,
    description:
      'All-in-one workspace that allows users to write, plan, collaborate, and get organized, used for note-taking, project management, and knowledge sharing',
    level: TechLevel.Intermediate,
    type: TechType.Tool,
  }),
  Linear: new Tech({
    name: 'Linear',
    icon: siLinear,
    description:
      'Issue tracking and project management tool designed for software development teams, used for tracking bugs and feature requests',
    level: TechLevel.Beginner,
    type: TechType.Tool,
  }),
  Steam: new Tech({
    name: 'Steam',
    icon: siSteam,
    description:
      'Digital distribution platform developed and published by Valve Corporation, used for distributing and playing video games',
    level: TechLevel.Intermediate,
    type: TechType.Gaming,
  }),
  'Epic Games': new Tech({
    name: 'Epic Games',
    icon: siEpicgames,
    description:
      'American video game and software development company that develops and publishes Fortnite, used for creating and publishing video games',
    level: TechLevel.Beginner,
    type: TechType.Gaming,
  }),
  Ubisoft: new Tech({
    name: 'Ubisoft',
    icon: siUbisoft,
    description:
      'French video game company that develops and publishes popular video game franchises, used for creating and publishing video games',
    level: TechLevel.Beginner,
    type: TechType.Gaming,
  }),
  Oculus: new Tech({
    name: 'Oculus',
    icon: siOculus,
    description:
      'Virtual reality technology company that develops and publishes the Oculus Rift and Oculus Quest, used for developing and playing virtual reality games and experiences',
    level: TechLevel.Beginner,
    type: TechType.Gaming,
  }),
  'Nintendo Switch': new Tech({
    name: 'Nintendo Switch',
    icon: siNintendoswitch,
    description:
      'Hybrid video game console developed and published by Nintendo, used for playing video games at home and on the go',
    level: TechLevel.Beginner,
    type: TechType.Gaming,
  }),
};
