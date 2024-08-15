import { Quiz, QuizResult, QuizResults } from '@jhh/shared/domain';

interface DefaultQuizResults
  extends Pick<QuizResults, 'totalScore' | 'percentage'> {
  items: QuizResult[];
}

interface DefaultQuiz
  extends Pick<Quiz, 'name' | 'slug' | 'description' | 'imageUrl' | 'items'> {
  results: DefaultQuizResults[];
}

const defaultPracticeQuizzes: DefaultQuiz[] = [
  {
    name: 'TypeScript',
    slug: 'typescript',
    description:
      'This TypeScript quiz is a brief test covering key concepts, perfect for both beginners and experienced developers to assess and enhance their skills.',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/125px-Typescript_logo_2020.svg.png',
    items: [
      {
        question: 'What is TypeScript primarily used for?',
        answers: [
          { isCorrect: false, text: 'Back-end development' },
          { isCorrect: false, text: 'Front-end development' },
          { isCorrect: true, text: 'Adding static typing to JavaScript' },
          { isCorrect: false, text: 'Database management' },
        ],
      },
      {
        question:
          'Which of the following is a valid way to define a variable in TypeScript?',
        answers: [
          { isCorrect: true, text: 'var name: string = "John";' },
          { isCorrect: false, text: 'string name = "John";' },
          { isCorrect: true, text: 'let name: string = "John";' },
          { isCorrect: false, text: 'name: string = "John";' },
          { isCorrect: false, text: 'string name = new String("John");' },
        ],
      },
      {
        question: 'Which is a key feature of TypeScript?',
        answers: [
          { isCorrect: false, text: 'Interpreted language' },
          { isCorrect: false, text: 'Dynamic typing' },
          { isCorrect: true, text: 'Optional static typing' },
          { isCorrect: false, text: 'No support for libraries' },
          { isCorrect: false, text: 'Incompatibility with JavaScript' },
        ],
      },
      {
        question: 'What does the `any` type represent in TypeScript?',
        answers: [
          { isCorrect: false, text: 'Any number' },
          {
            isCorrect: true,
            text: "Any type of value, bypassing the compiler's type checking",
          },
          { isCorrect: false, text: 'Any string' },
          { isCorrect: false, text: 'Undefined values only' },
          { isCorrect: false, text: 'Any array' },
        ],
      },
      {
        question:
          'Which TypeScript feature allows for specifying an exact value for a variable?',
        answers: [
          { isCorrect: false, text: 'Enums' },
          { isCorrect: true, text: 'Literal Types' },
          { isCorrect: false, text: 'Generics' },
          { isCorrect: false, text: 'Interfaces' },
        ],
      },
      {
        question: 'How do you define an interface in TypeScript?',
        answers: [
          {
            isCorrect: true,
            text: 'interface Person { name: string; age: number; }',
          },
          {
            isCorrect: false,
            text: 'class Person { name: string; age: number; }',
          },
          {
            isCorrect: true,
            text: 'type Person = { name: string; age: number; }',
          },
          { isCorrect: false, text: 'Person = { name: string; age: number; }' },
          {
            isCorrect: false,
            text: 'model Person { name: string; age: number; }',
          },
        ],
      },
      {
        question:
          "Which of the following is true about TypeScript's type inference?",
        answers: [
          { isCorrect: false, text: 'TypeScript cannot infer types.' },
          {
            isCorrect: false,
            text: 'TypeScript always requires explicit type annotations.',
          },
          {
            isCorrect: true,
            text: 'TypeScript can infer variable types in certain situations.',
          },
          {
            isCorrect: false,
            text: 'Type inference is only available in TypeScript version 3.0 and later.',
          },
          {
            isCorrect: false,
            text: 'Type inference applies to all variables, regardless of complexity.',
          },
        ],
      },
      {
        question: 'In TypeScript, what is a Tuple?',
        answers: [
          { isCorrect: false, text: 'A function that returns multiple values' },
          { isCorrect: true, text: 'An array with fixed size and types' },
          { isCorrect: false, text: 'A type that represents a set of values' },
          { isCorrect: false, text: 'A method to combine multiple types' },
          {
            isCorrect: false,
            text: 'An interface for complex data structures',
          },
        ],
      },
      {
        question:
          'Which is a correct method to make a property optional in a TypeScript interface?',
        answers: [
          { isCorrect: true, text: 'interface User { name?: string; }' },
          { isCorrect: false, text: 'interface User { name: string?; }' },
          {
            isCorrect: false,
            text: 'interface User { optional name: string; }',
          },
          {
            isCorrect: false,
            text: 'interface User { name: optional string; }',
          },
        ],
      },
      {
        question:
          'What is the output of this TypeScript code snippet: console.log(typeof null);?',
        answers: [
          { isCorrect: false, text: 'null' },
          { isCorrect: false, text: 'undefined' },
          { isCorrect: true, text: 'object' },
          { isCorrect: false, text: 'number' },
          { isCorrect: false, text: 'string' },
        ],
      },
    ],
    results: [],
  },
  {
    name: 'SCSS',
    slug: 'scss',
    description:
      'This SCSS quiz is designed to test and reinforce knowledge on SCSS fundamentals, covering topics from variables and nesting to mixins and inheritance, suitable for both beginners and experienced front-end developers.',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/512px-Sass_Logo_Color.svg.png',
    items: [
      {
        question: 'Which is a feature of SCSS?',
        answers: [
          { isCorrect: true, text: 'Variables for reusable values' },
          { isCorrect: false, text: '<link> tag to include SCSS files' },
          { isCorrect: false, text: 'Using the @html directive for HTML' },
          { isCorrect: false, text: 'Automatic browser prefixing' },
        ],
      },
      {
        question: 'How do you create a mixin in SCSS?',
        answers: [
          { isCorrect: false, text: '@mixin-name { }' },
          { isCorrect: false, text: '$mixin: mixin-name { }' },
          { isCorrect: false, text: '++mixin-name { }' },
          { isCorrect: true, text: '@mixin mixin-name { }' },
        ],
      },
      {
        question: 'Which syntax is correct for using a variable in SCSS?',
        answers: [
          { isCorrect: true, text: 'color: $variableName;' },
          { isCorrect: false, text: '$variableName' },
          { isCorrect: false, text: '@variableName' },
          { isCorrect: false, text: 'var(variableName)' },
        ],
      },
      {
        question: 'How do you extend a placeholder in SCSS?',
        answers: [
          { isCorrect: false, text: '@extend .placeholder;' },
          { isCorrect: true, text: '@extend %placeholder;' },
          { isCorrect: false, text: '+placeholder;' },
          { isCorrect: false, text: '@placeholder;' },
        ],
      },
      {
        question: 'What is the SCSS syntax for nesting selectors?',
        answers: [
          { isCorrect: false, text: '.parent > .child { }' },
          { isCorrect: false, text: '.parent .child { }' },
          { isCorrect: true, text: '.parent { .child { } }' },
          { isCorrect: false, text: '.parent, .child { }' },
        ],
      },
      {
        question: 'Which is true about SCSS compilation?',
        answers: [
          { isCorrect: false, text: 'It can run directly in the browser.' },
          { isCorrect: false, text: 'SCSS files are smaller than CSS.' },
          { isCorrect: true, text: 'It needs to be compiled into CSS.' },
          {
            isCorrect: false,
            text: 'Compilation speeds up website performance.',
          },
        ],
      },
      {
        question: 'How can you import another SCSS file?',
        answers: [
          { isCorrect: false, text: "@import 'filename.css';" },
          { isCorrect: true, text: "@import 'filename';" },
          { isCorrect: false, text: "include 'filename.scss';" },
          { isCorrect: false, text: "use 'filename';" },
        ],
      },
      {
        question: 'Which of the following is a benefit of using SCSS?',
        answers: [
          { isCorrect: true, text: 'Better organization through nesting' },
          { isCorrect: false, text: 'Automatic refresh without compiling' },
          { isCorrect: false, text: 'Direct use in HTML without CSS file' },
          { isCorrect: false, text: 'Faster page load times' },
        ],
      },
      {
        question: "What does the '&' symbol represent in SCSS?",
        answers: [
          { isCorrect: false, text: 'Concatenation operator' },
          { isCorrect: false, text: 'A CSS variable' },
          { isCorrect: false, text: 'Start of a comment block' },
          { isCorrect: true, text: 'Reference to the parent selector' },
        ],
      },
      {
        question: 'Which statements are true regarding SCSS?',
        answers: [
          {
            isCorrect: true,
            text: 'SCSS supports mathematical operations directly within the stylesheet.',
          },
          {
            isCorrect: true,
            text: 'SCSS allows the use of conditional statements and loops within stylesheets.',
          },
          {
            isCorrect: false,
            text: 'SCSS files can be used in web pages without being compiled into CSS.',
          },
          {
            isCorrect: false,
            text: 'Variables in SCSS are globally scoped by default and cannot be overridden within selectors.',
          },
        ],
      },
    ],
    results: [
      {
        totalScore: 4,
        percentage: 80,
        items: [
          {
            question: 'Which is a feature of SCSS?',
            userAnswers: ['Variables for reusable values'],
            correctAnswers: ['Variables for reusable values'],
            isCorrect: true,
          },
          {
            question: 'How do you create a mixin in SCSS?',
            userAnswers: ['@mixin-name { }'],
            correctAnswers: ['@mixin mixin-name { }'],
            isCorrect: false,
          },
          {
            question: 'Which syntax is correct for using a variable in SCSS?',
            userAnswers: ['color: $variableName;'],
            correctAnswers: ['color: $variableName;'],
            isCorrect: true,
          },
          {
            question: 'How do you extend a placeholder in SCSS?',
            userAnswers: ['@extend %placeholder;'],
            correctAnswers: ['@extend %placeholder;'],
            isCorrect: true,
          },
          {
            question: 'What is the SCSS syntax for nesting selectors?',
            userAnswers: ['.parent { .child { } }'],
            correctAnswers: ['.parent { .child { } }'],
            isCorrect: true,
          },
        ],
      },
    ],
  },
];

export default defaultPracticeQuizzes;
