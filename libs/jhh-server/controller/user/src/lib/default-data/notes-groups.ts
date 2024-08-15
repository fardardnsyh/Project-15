import { Note, NotesGroup } from '@jhh/shared/domain';

interface DefaultNote extends Pick<Note, 'name' | 'slug' | 'content'> {}

interface DefaultNotesGroup extends Pick<NotesGroup, 'name' | 'slug'> {
  notes: DefaultNote[];
}

const defaultNotesGroups: DefaultNotesGroup[] = [
  {
    name: 'Node.js',
    slug: 'nodejs',
    notes: [],
  },
  {
    name: 'Angular',
    slug: 'angular',
    notes: [
      {
        name: 'Text interpolation',
        slug: 'text-interpolation',
        content:
          '<p><strong>Interpolation</strong> refers to embedding expressions into marked up text. By default, interpolation uses the double curly braces&nbsp;<strong>{{</strong>&nbsp;and&nbsp;<strong>}}</strong>&nbsp;as delimiters.</p><p>To illustrate how interpolation works, consider an Angular component that contains a&nbsp;<strong><u>currentCustomer</u></strong>&nbsp;variable:</p><pre class="ql-syntax" spellcheck="false">currentCustomer = \'Maria\'; </pre><p>Use interpolation to display the value of this variable in the corresponding component template:</p><pre class="ql-syntax" spellcheck="false">&lt;h3&gt;Current customer: {{ currentCustomer }}&lt;/h3&gt; </pre><p>Angular replaces&nbsp;<strong><u>currentCustomer</u></strong>&nbsp;with the string value of the corresponding component property. In this case, the value is&nbsp;<strong><u>Maria</u></strong>.</p><p>In the following example, Angular evaluates the&nbsp;<strong><u>title</u></strong>&nbsp;and&nbsp;<strong><u>itemImageUrl</u></strong>&nbsp;properties to display some title text and an image.</p><pre class="ql-syntax" spellcheck="false">&lt;p&gt;{{title}}&lt;/p&gt; &lt;div&gt;&lt;img alt="item" src="{{itemImageUrl}}"&gt;&lt;/div&gt; </pre><p><br></p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/HPzLsklVs9Y?showinfo=0"></iframe><p><br></p>',
      },
      {
        name: 'Pipes',
        slug: 'pipes',
        content:
          '<p>To apply a pipe, use the pipe operator (<strong><u>|</u></strong>) within a template expression as shown in the following code example.</p><pre class="ql-syntax" spellcheck="false">&lt;p&gt;The hero\'s birthday is {{ birthday | date }}&lt;/p&gt; </pre><p>The component\'s&nbsp;<strong><u>birthday</u></strong>&nbsp;value flows through the pipe operator (<strong><u>|</u></strong>) to the&nbsp;<a href="https://angular.io/api/common/DatePipe" rel="noopener noreferrer"><strong><u>DatePipe</u></strong></a>&nbsp;whose pipe name is&nbsp;<a href="https://angular.io/api/common/DatePipe" rel="noopener noreferrer"><strong><u>date</u></strong></a>. The pipe renders the date in the default format as&nbsp;<strong>Apr 15, 1988</strong>.</p><p>Look at the component class.</p><pre class="ql-syntax" spellcheck="false">import { Component } from \'@angular/core\'; import { DatePipe } from \'@angular/common\'; @Component({ standalone: true, selector: \'app-birthday\', templateUrl: \'./birthday.component.html\', imports: [DatePipe], }) export class BirthdayComponent { birthday = new Date(1988, 3, 15); // April 15, 1988 -- since month parameter is zero-based } </pre>',
      },
      {
        name: 'Change detection',
        slug: 'change-detection',
        content:
          '<p><strong>Change detection</strong>&nbsp;is the process through which Angular checks to see whether your application state has changed, and if any DOM needs to be updated. At a high level, Angular walks your components from top to bottom, looking for changes. Angular runs its change detection mechanism periodically so that changes to the data model are reflected in an application’s view. Change detection can be triggered either manually or through an asynchronous event (for example, a user interaction or an XMLHttpRequest completion).</p><p>Change detection is highly optimized and performant, but it can still cause slowdowns if the application runs it too frequently.</p><p>In this guide, you’ll learn how to control and optimize the change detection mechanism by skipping parts of your application and running change detection only when necessary.</p><iframe class="ql-video" frameborder="0" allowfullscreen="true" src="https://www.youtube.com/embed/f8sA-i6gkGQ?showinfo=0"></iframe><p><br></p>',
      },
    ],
  },
];

export default defaultNotesGroups;
